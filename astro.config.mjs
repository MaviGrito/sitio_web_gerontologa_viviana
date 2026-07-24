// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  site: 'https://www.gerontologaviviana.com',
  output: 'static',
  image: {
    // Usar sharp para optimización de imágenes en build time
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
