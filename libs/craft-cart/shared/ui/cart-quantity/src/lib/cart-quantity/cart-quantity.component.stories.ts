import type { Meta, StoryObj } from '@storybook/angular';
import { CartQuantityComponent } from './cart-quantity.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<CartQuantityComponent> = {
  component: CartQuantityComponent,
  title: 'CartQuantityComponent'
};
export default meta;
type Story = StoryObj<CartQuantityComponent>;

export const Primary: Story = {
  args: {}
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/cart-quantity works!/gi)).toBeTruthy();
  }
};
