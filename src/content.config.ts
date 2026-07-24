import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    client: z.string(),
    clientLogo: z.string(),
    clientLogoAlt: z.string(),
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    industry: z.string(),
    partners: z.string(),
    engagement: z.string(),
    draft: z.boolean().default(false),
    outcomes: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.enum([
          'shield',
          'puzzle',
          'growth',
          'team',
          'grid',
          'layers',
          'code',
          'accessibility',
          'brush',
          'network',
          'person',
          'calendar',
          'globe',
        ]),
      }),
    ),
  }),
});

export const collections = { work };
