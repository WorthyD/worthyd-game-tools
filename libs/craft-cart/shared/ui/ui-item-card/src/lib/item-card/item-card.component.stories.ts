import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { ItemCardComponent } from './item-card.component';

const meta: Meta<ItemCardComponent> = {
  component: ItemCardComponent,
  title: 'ItemCardComponent',
  args: {
    catalogItem: {
      id: 'ancient-fruit',
      name: 'Ancient Fruit',
      description: 'It was dormant for eons. Grows from Ancient Seeds and keeps producing fruit every week.',
      imageUrl: 'https://stardewvalleywiki.com/mediawiki/images/6/66/Ancient_Fruit.png',
      links: [],
      ingredients: [],
      categories: [],
      tags: []
    }
  }
};
export default meta;
type Story = StoryObj<ItemCardComponent>;

export const Primary: Story = {};

export const Heading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Ancient Fruit' })).toBeTruthy();
  }
};
