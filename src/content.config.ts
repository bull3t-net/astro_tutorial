import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    author: z.string().trim().min(1),
    publishedDate: z.iso.date(),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = { articles };
