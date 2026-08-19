import { defineConfig } from 'astro/config';

const repoEnv = process.env.GITHUB_REPOSITORY || '';
const [owner = '', repo = ''] = repoEnv.split('/');
const isUserSite = owner && repo === `${owner}.github.io`;
const base = repoEnv ? (isUserSite ? '/' : `/${repo}`) : '/';
const site = owner ? `https://${owner}.github.io` : 'https://example.com';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  }
});
