import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../apps/**/*.stories.@(js|jsx|ts|tsx)',
    '../libs/**/ui/**/*.stories.@(js|jsx|ts|tsx)'
  ],

  //addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  addons: [getAbsolutePath("@chromatic-com/storybook"), getAbsolutePath("@storybook/addon-docs")],

  staticDirs: [{ from: `${__dirname}/../apps/destiny-clan-dashboard/src/assets`, to: '/assets/' }],

  framework: {
    name: getAbsolutePath("@storybook/angular"),
    options: {}
  },

  // docs: {
  //   autodocs: 'tag'
  // },
  //   previewHead: () => `
  //   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;&display=swap" rel="stylesheet">
  // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  // <style>
  //   .story-book-wrapper {
  //   }
  // </style>
  // `
  previewHead: (head) => `
  ${head}
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;&display=swap" rel="stylesheet">
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
 <style>
   .story-book-wrapper {

   }

 </style>
  `,

  docs: {}
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
