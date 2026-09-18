"""Verify and atomically replace the downloadable Cardistry archive.

Run after npm run build, npm test, npm run test:content and npm run test:structure.
Requires Pillow only to prepare the cropped mobile preview (pip install Pillow).
"""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
from tempfile import NamedTemporaryFile
from urllib.request import urlopen
from xml.etree import ElementTree
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image

ROOT = Path(__file__).resolve().parent
ARCHIVE = ROOT.parent / "cardistry-astro.zip"
EXCLUDED = {"node_modules", ".astro", ".git", "__pycache__"}


def verify_reports() -> None:
    """Reject failed QA and deployment files changed since the structure test."""
    report = json.loads((ROOT / "qa/report.json").read_text())
    assert report["routes"] == 11 and report["responsiveChecks"] == 44
    assert not report["jsErrors"] and not report["violations"]
    assert report["interactions"] == "passed"
    structure = json.loads((ROOT / "qa/structure-report.json").read_text())
    assert structure["status"] == "passed" and structure["htmlPages"] == 11
    content = json.loads((ROOT / "qa/content-report.json").read_text())
    assert content["status"] == "passed" and content["routes"] == 11
    for entry in structure["deploymentFiles"]:
        actual = hashlib.sha256((ROOT / entry["path"]).read_bytes()).hexdigest()
        assert actual == entry["sha256"], f"Re-test changed build: {entry['path']}"


def verify_preview() -> None:
    base = os.environ.get("BASE_URL", "http://127.0.0.1:8080")
    for route in (
        "/", "/contact/", "/pvc-business-cards/", "/nfc-business-cards/",
        "/favicon.svg", "/robots.txt", "/sitemap.xml",
    ):
        with urlopen(base + route, timeout=15) as response:
            assert response.status == 200
            if route.endswith(".xml"):
                assert len(ElementTree.fromstring(response.read())) == 11
        print("HTTP 200", route)


def main() -> None:
    verify_reports()
    verify_preview()
    with Image.open(ROOT / "qa/home-390.png") as image:
        image.crop((0, 0, 390, 1150)).save(ROOT / "qa/home-mobile.png")

    files = sorted(
        path for path in ROOT.rglob("*")
        if path.is_file()
        and not EXCLUDED.intersection(path.relative_to(ROOT).parts)
        and not path.name.startswith(".env")
    )
    # Keep the previous downloadable file intact until the replacement is verified.
    with NamedTemporaryFile(dir=ARCHIVE.parent, suffix=".zip", delete=False) as handle:
        temporary = Path(handle.name)
    try:
        with ZipFile(temporary, "w", ZIP_DEFLATED) as archive:
            for path in files:
                archive.write(path, arcname=f"cardistry-astro/{path.relative_to(ROOT)}")
        with ZipFile(temporary) as archive:
            assert archive.testzip() is None
            names = archive.namelist()
            required = (
                "src/pages/index.astro", "src/layouts/BaseLayout.astro",
                "src/components/QuoteForm.astro", "src/content.config.ts",
                "scripts/format-deployment.mjs", "package-lock.json",
                "qa/report.json", "qa/structure-report.json", "qa/content-report.json",
                ".prettierrc.json", ".editorconfig", "tsconfig.json",
            )
            for path in required:
                assert f"cardistry-astro/{path}" in names, path
            assert "cardistry-astro/src/pages/[...slug].astro" not in names
            html_files = [name for name in names if name.startswith("cardistry-astro/dist/") and name.endswith(".html")]
            assert len(html_files) == 11
            for name in html_files:
                assert len(archive.read(name).splitlines()) > 100
            # Confirm every archived source/build/evidence file matches the final workspace.
            for path in files:
                assert archive.read(f"cardistry-astro/{path.relative_to(ROOT)}") == path.read_bytes()
        os.replace(temporary, ARCHIVE)
    finally:
        temporary.unlink(missing_ok=True)

    print(json.dumps({
        "archive": str(ARCHIVE), "files": len(names),
        "built_pages": len(html_files), "bytes": ARCHIVE.stat().st_size,
        "sha256": hashlib.sha256(ARCHIVE.read_bytes()).hexdigest(),
        "integrity": "PASS", "source_and_build_match": True,
    }, indent=2))


if __name__ == "__main__":
    main()
