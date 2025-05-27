import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemCardComponent } from './cart-item-card.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<CartItemCardComponent> = {
  component: CartItemCardComponent,
  title: 'CartItemCardComponent'
};
export default meta;
type Story = StoryObj<CartItemCardComponent>;

export const Primary: Story = {
  args: {}
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/cart-item-card works!/gi)).toBeTruthy();
  }
};
