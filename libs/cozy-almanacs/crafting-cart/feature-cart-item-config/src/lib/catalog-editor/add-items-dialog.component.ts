import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Item, ItemLabel } from '@cozy-almanacs/models';
import { ITEM_IMAGE_PATH, LabelKind, itemFromUrl, toCatalogId } from '@cozy-almanacs/state';
import { IngredientEditorComponent, IngredientOption } from './ingredient-editor.component';

/** How many items the dialog adds at a time. */
export const MAX_NEW_ITEMS = 5;

export interface AddItemsDialogData {
  labels: Record<LabelKind, ItemLabel[]>;
  /** Catalog items that can be picked as ingredients. */
  ingredientOptions: IngredientOption[];
  /** Ids already in the catalog, which new items can't reuse. */
  existingIds: string[];
}

/** What the person typed for one new item. Empty `id`, `name` and `imageUrl` fall back to values made from the other fields. */
interface NewItemRow {
  name: string;
  id: string;
  url: string;
  description: string;
  imageUrl: string;
  categories: string[];
  tags: string[];
  ingredients: Item['ingredients'];
}

const emptyRow = (): NewItemRow => ({
  name: '',
  id: '',
  url: '',
  description: '',
  imageUrl: '',
  categories: [],
  tags: [],
  ingredients: []
});

const isBlank = (row: NewItemRow): boolean =>
  !row.name.trim() &&
  !row.id.trim() &&
  !row.url.trim() &&
  !row.description.trim() &&
  !row.imageUrl.trim() &&
  !row.categories.length &&
  !row.tags.length &&
  !row.ingredients.length;

/**
 * Dialog for adding up to {@link MAX_NEW_ITEMS} catalog items at once. Blank rows are skipped. Each item's id comes
 * from its name (or its wiki url's page name) unless one is typed, and its image defaults to `./images/<id>.png`.
 * Closes with the finished items, or nothing when cancelled.
 */
@Component({
  selector: 'lib-add-items-dialog',
  imports: [
    IngredientEditorComponent,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './add-items-dialog.component.html',
  styleUrl: './add-items-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddItemsDialogComponent {
  protected readonly data = inject<AddItemsDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<AddItemsDialogComponent, Item[]>>(MatDialogRef);

  protected readonly max = MAX_NEW_ITEMS;
  protected readonly rows = signal<NewItemRow[]>(Array.from({ length: MAX_NEW_ITEMS }, emptyRow));

  private readonly existingIds = new Set(this.data.existingIds);

  /** Each row with the values that will be saved and what (if anything) stops it from being added. */
  protected readonly entries = computed(() => {
    const entries = this.rows().map((row) => {
      const url = row.url.trim();
      const fromUrl = url ? itemFromUrl(url) : null;
      const autoName = fromUrl?.name ?? '';
      const name = row.name.trim() || autoName;
      const autoId = toCatalogId(name);
      const id = row.id.trim() ? toCatalogId(row.id) : autoId;
      const autoImageUrl = id ? `${ITEM_IMAGE_PATH}${id}.png` : '';
      const blank = isBlank(row);
      let problem = '';
      if (!blank) {
        if (url && !fromUrl) {
          problem = 'The wiki url must be a full http(s) link to a page.';
        } else if (!id) {
          problem = 'Give it a name, an id or a wiki url.';
        } else if (this.existingIds.has(id)) {
          problem = `The catalog already has an item with the id "${id}".`;
        }
      }
      return { row, blank, name, id, autoName, autoId, autoImageUrl, links: fromUrl?.links ?? [], problem };
    });
    const ids = entries.filter((entry) => !entry.blank && entry.id).map((entry) => entry.id);
    return entries.map((entry) =>
      !entry.problem && !entry.blank && ids.indexOf(entry.id) !== ids.lastIndexOf(entry.id)
        ? { ...entry, problem: `Another new item also has the id "${entry.id}".` }
        : entry
    );
  });

  protected readonly filled = computed(() => this.entries().filter((entry) => !entry.blank));
  protected readonly canAdd = computed(
    () => this.filled().length > 0 && this.filled().every((entry) => !entry.problem)
  );

  protected update(index: number, changes: Partial<NewItemRow>): void {
    this.rows.update((rows) => rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  }

  protected clear(index: number): void {
    this.update(index, emptyRow());
  }

  protected add(): void {
    if (!this.canAdd()) {
      return;
    }
    const items = this.filled().map(
      ({ row, id, name, autoImageUrl, links }): Item => ({
        id,
        name,
        description: row.description.trim(),
        imageUrl: row.imageUrl.trim() || autoImageUrl,
        links,
        ingredients: row.ingredients,
        categories: row.categories,
        tags: row.tags
      })
    );
    this.dialogRef.close(items);
  }
}
