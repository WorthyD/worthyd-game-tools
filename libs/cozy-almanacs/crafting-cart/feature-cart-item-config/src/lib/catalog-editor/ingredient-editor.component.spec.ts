import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { Item } from '@cozy-almanacs/models';
import { IngredientEditorComponent, IngredientOption } from './ingredient-editor.component';

@Component({
  imports: [IngredientEditorComponent],
  template: `<lib-ingredient-editor
    [ingredients]="ingredients()"
    [options]="options"
    itemId="bomb"
    (ingredientsChange)="ingredients.set($event)"
  />`
})
class HostComponent {
  readonly ingredients = signal<Item['ingredients']>([{ id: 'copper_ore', quantity: 4 }]);
  readonly options: IngredientOption[] = [
    { id: 'bomb', name: 'Bomb' },
    { id: 'coal', name: 'Coal' },
    { id: 'copper_ore', name: 'Copper Ore' },
    { id: 'iron_ore', name: 'Iron Ore' }
  ];
}

describe('IngredientEditorComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const host = () => fixture.componentInstance;
  const query = <T extends Element>(selector: string): T => fixture.nativeElement.querySelector(selector);
  const picker = () =>
    TestbedHarnessEnvironment.loader(fixture).getHarness(
      MatAutocompleteHarness.with({ selector: '[aria-label="Add ingredient"]' })
    );

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideNoopAnimations()] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('lists ingredients by catalog name with a number box for the quantity', () => {
    const quantity = query<HTMLInputElement>('input[aria-label="Quantity of Copper Ore"]');

    expect(fixture.nativeElement.textContent).toContain('Copper Ore');
    expect(quantity.type).toBe('number');
    expect(quantity.min).toBe('1');
    expect(quantity.value).toBe('4');
  });

  it('only offers catalog items that are not the item itself or already added', async () => {
    const autocomplete = await picker();
    await autocomplete.focus();
    const options = await autocomplete.getOptions();

    expect(await Promise.all(options.map((option) => option.getText()))).toEqual(['Coal coal', 'Iron Ore iron_ore']);
  });

  it('adds a picked catalog item with a quantity of 1 and clears the search', async () => {
    const autocomplete = await picker();
    await autocomplete.enterText('iron');
    await autocomplete.selectOption({ text: /Iron Ore/ });

    expect(host().ingredients()).toEqual([
      { id: 'copper_ore', quantity: 4 },
      { id: 'iron_ore', quantity: 1 }
    ]);
    expect(await autocomplete.getValue()).toBe('');
  });

  it('does not add typed text that is not a catalog item', async () => {
    const autocomplete = await picker();
    await autocomplete.enterText('diamond');
    const options = await autocomplete.getOptions();

    expect(await Promise.all(options.map((option) => option.getText()))).toEqual(['No matching catalog items']);
    expect(await options[0].isDisabled()).toBe(true);
    expect(host().ingredients()).toEqual([{ id: 'copper_ore', quantity: 4 }]);
  });

  it.each([
    ['7', 7],
    ['2.6', 2],
    ['0', 1],
    ['-3', 1],
    ['', 1]
  ])('sets the quantity from %p to %p', (value, expected) => {
    const quantity = query<HTMLInputElement>('input[aria-label="Quantity of Copper Ore"]');
    quantity.value = value;
    quantity.dispatchEvent(new Event('change'));

    expect(host().ingredients()).toEqual([{ id: 'copper_ore', quantity: expected }]);
    expect(quantity.value).toBe(String(expected));
  });

  it('removes an ingredient', () => {
    query<HTMLButtonElement>('button[aria-label="Remove Copper Ore"]').click();

    expect(host().ingredients()).toEqual([]);
  });

  it('flags ingredients that are not catalog items', () => {
    host().ingredients.set([{ id: 'stardrop', quantity: 1 }]);
    fixture.detectChanges();

    expect(query('.ingredient-missing')?.textContent).toContain('stardrop');
  });
});
