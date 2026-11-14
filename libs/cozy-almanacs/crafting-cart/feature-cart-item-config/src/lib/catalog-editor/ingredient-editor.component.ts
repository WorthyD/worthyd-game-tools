import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Item } from '@cozy-almanacs/models';

/** A catalog item that can be picked as an ingredient. */
export interface IngredientOption {
  id: string;
  name: string;
}

/** How many matches the picker lists at once; typing narrows the rest down. */
export const MAX_INGREDIENT_MATCHES = 50;

/**
 * Edits one catalog item's ingredients. Ingredients can only be added by picking an existing catalog
 * item from the autocomplete, and each quantity is a whole number of at least 1.
 */
@Component({
  selector: 'lib-ingredient-editor',
  imports: [MatAutocompleteModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ingredient-editor.component.html',
  styleUrl: './ingredient-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientEditorComponent {
  readonly ingredients = input.required<Item['ingredients']>();
  /** Every catalog item, in the order the picker should list them. */
  readonly options = input.required<IngredientOption[]>();
  /** The item being edited, which can't be its own ingredient. */
  readonly itemId = input('');
  readonly ingredientsChange = output<Item['ingredients']>();

  protected readonly query = signal('');

  private readonly names = computed(() => new Map(this.options().map(({ id, name }) => [id, name])));

  protected readonly rows = computed(() =>
    this.ingredients().map(({ id, quantity }) => ({ id, quantity, name: this.names().get(id) ?? null }))
  );

  /** Catalog items matching the search, leaving out this item and ones already added. */
  protected readonly matches = computed(() => {
    const query = this.query().trim().toLowerCase();
    const taken = new Set([this.itemId(), ...this.ingredients().map(({ id }) => id)]);
    return this.options()
      .filter(
        ({ id, name }) =>
          !taken.has(id) && (!query || name.toLowerCase().includes(query) || id.toLowerCase().includes(query))
      )
      .slice(0, MAX_INGREDIENT_MATCHES);
  });

  protected add(id: string, search: HTMLInputElement): void {
    search.value = '';
    this.query.set('');
    if (this.names().has(id) && !this.ingredients().some((ingredient) => ingredient.id === id)) {
      this.ingredientsChange.emit([...this.ingredients(), { id, quantity: 1 }]);
    }
  }

  protected setQuantity(id: string, field: HTMLInputElement): void {
    const value = Math.floor(Number(field.value));
    const quantity = Number.isFinite(value) && value >= 1 ? value : 1;
    field.value = String(quantity);
    this.ingredientsChange.emit(
      this.ingredients().map((ingredient) => (ingredient.id === id ? { ...ingredient, quantity } : ingredient))
    );
  }

  protected remove(id: string): void {
    this.ingredientsChange.emit(this.ingredients().filter((ingredient) => ingredient.id !== id));
  }
}
