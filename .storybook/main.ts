import type { StorybookConfig } from '@storybook/react-vite';

const isGHPages = process.env.DEPLOY_TARGET === 'gh-pages';

const config: StorybookConfig = {
  stories: [
    '../src/stories/**/*.mdx',
    '../src/stories/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    if (isGHPages) {
      config.base = '/verity-charts-playground/';
    }
    return config;
  },
};

export default config;
