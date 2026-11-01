import type { Meta, StoryObj } from '@storybook/angular';
import { ItemCardComponent } from './item-card.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ItemCardComponent> = {
  component: ItemCardComponent,
  title: 'ItemCardComponent'
};
export default meta;
type Story = StoryObj<ItemCardComponent>;

export const Primary: Story = {
  args: {}
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/item-card works!/gi)).toBeTruthy();
  }
};
