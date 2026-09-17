// sanity.config.ts (Taruh di root folder proyek)
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schema } from './sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Tribun CMS Studio',

  projectId: '49hcvicd', // ID project Sanity lu
  dataset: 'production',

  plugins: [deskTool()],

  schema: schema,
  basePath: '/studio', // Ini yang bikin dia bisa dibuka di localhost:3000/studio
});