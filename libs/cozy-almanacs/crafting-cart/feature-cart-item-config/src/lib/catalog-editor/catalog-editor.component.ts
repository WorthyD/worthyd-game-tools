import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Item, ItemConfig, ItemLabel } from '@cozy-almanacs/models';
import {
  CATALOG_DATASETS,
  CatalogEditorStore,
  ConfigSettings,
  EditorRows,
  LabelKind,
  formatIngredients,
  formatLinks,
  parseIngredients,
  parseLinks
} from '@cozy-almanacs/state';
import { EditorTable } from './editor-table';

interface ExportFile {
  path: string;
  name: string;
  text: string;
}

const exportFile = (path: string, text: string): ExportFile => ({ path, name: path.split('/').pop() ?? path, text });

/**
 * Bulk editor for a catalog dataset: settings, category and tag labels, the scraper's item configs and
 * the catalog items. Every change is autosaved to local storage; saving is manual (copy or download the
 * generated config.ts / items.ts and replace the files in the repo).
 */
@Component({
  selector: 'lib-catalog-editor',
  imports: [
    DatePipe,
    NgTemplateOutlet,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [CatalogEditorStore],
  templateUrl: './catalog-editor.component.html',
  styleUrl: './catalog-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogEditorComponent {
  protected readonly store = inject(CatalogEditorStore);
  private readonly router = inject(Router);
  protected readonly datasets = inject(CATALOG_DATASETS);

  /** Material Symbols (fonts.google.com/icons) given to labels added here; change them in the Labels tab. */
  protected readonly defaultIcons: Record<LabelKind, string> = { categories: 'category', tags: 'label' };
  protected readonly labelKinds: { kind: LabelKind; title: string }[] = [
    { kind: 'categories', title: 'Categories' },
    { kind: 'tags', title: 'Tags' }
  ];
  protected readonly settingFields: { key: keyof ConfigSettings; label: string }[] = [
    { key: 'baseUrl', label: 'Base URL' },
    { key: 'assetPath', label: 'Asset path' },
    { key: 'imagePath', label: 'Image path' },
    { key: 'configOutputPath', label: 'Scraper output path' }
  ];

  protected readonly missingDataset = signal<string | null>(null);
  protected readonly message = signal('');

  protected readonly config = computed(() => this.store.draft()?.config ?? null);
  protected readonly labels = computed(() => ({
    categories: this.config()?.categories ?? [],
    tags: this.config()?.tags ?? []
  }));
  protected readonly labelMaps = computed(() => ({
    categories: Object.fromEntries(this.labels().categories.map((label) => [label.id, label])),
    tags: Object.fromEntries(this.labels().tags.map((label) => [label.id, label]))
  }));

  protected readonly itemConfigs = new EditorTable<ItemConfig>(
    computed(() => this.config()?.items ?? []),
    (row) => [row.itemId, row.itemUrl, ...row.categories, ...row.tags].join(' ')
  );
  protected readonly items = new EditorTable<Item>(
    computed(() => this.store.draft()?.items ?? []),
    (row) => [row.id, row.name, row.description, ...row.categories, ...row.tags].join(' ')
  );
  protected readonly itemPage = computed(() =>
    this.items.page().map((entry) => ({
      ...entry,
      ingredients: formatIngredients(entry.row.ingredients),
      links: formatLinks(entry.row.links)
    }))
  );

  /** The generated files; only computed once the Export tab renders them. */
  protected readonly exportFiles = computed(() => [
    exportFile(this.store.files()?.config ?? 'config.ts', this.store.configFile()),
    exportFile(this.store.files()?.items ?? 'items.ts', this.store.itemsFile())
  ]);

  /** The label picked in each table's bulk bar. */
  protected readonly bulkLabel = signal<Record<EditorRows, { kind: LabelKind; id: string } | null>>({
    itemConfigs: null,
    items: null
  });

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = params.get('datasetId');
        const dataset = id ? this.datasets.find((d) => d.id === id) : this.datasets[0];
        this.missingDataset.set(dataset ? null : (id ?? ''));
        if (dataset) {
          this.store.open(dataset);
          this.itemConfigs.clearSelection();
          this.items.clearSelection();
        }
      });
  }

  protected switchDataset(id: string): void {
    this.router.navigate(['/crafting-cart/config', id]);
  }

  protected discardDraft(): void {
    if (confirm('Discard all changes in this draft and start again from the source files?')) {
      this.store.discardDraft();
      this.itemConfigs.clearSelection();
      this.items.clearSelection();
    }
  }

  protected setSetting(key: keyof ConfigSettings, value: string): void {
    this.store.updateSettings({ [key]: value });
  }

  // Labels

  protected addLabel(kind: LabelKind, input: HTMLInputElement): void {
    if (this.store.addLabel(kind, input.value, this.defaultIcons[kind])) {
      input.value = '';
    } else if (input.value.trim()) {
      this.message.set(`A ${kind === 'tags' ? 'tag' : 'category'} with that id already exists.`);
    }
  }

  protected renameLabel(kind: LabelKind, label: ItemLabel, input: HTMLInputElement): void {
    const id = this.store.renameLabel(kind, label.id, input.value);
    if (id === label.id && input.value !== label.id) {
      this.message.set(`Couldn't rename "${label.id}" to "${input.value}": the id is empty or already used.`);
    }
    input.value = id;
  }

  protected removeLabel(kind: LabelKind, label: ItemLabel): void {
    const uses = this.store.labelUsage()[kind][label.id] ?? 0;
    if (!uses || confirm(`"${label.name}" is used by ${uses} rows. Remove it from all of them?`)) {
      this.store.removeLabel(kind, label.id);
    }
  }

  // Rows

  protected tableFor(rows: EditorRows): EditorTable<ItemConfig> | EditorTable<Item> {
    return rows === 'items' ? this.items : this.itemConfigs;
  }

  protected addRow(rows: EditorRows): void {
    this.tableFor(rows).reveal(this.store.addRow(rows));
  }

  protected addItemConfigUrls(textarea: HTMLTextAreaElement): void {
    const added = this.store.addItemConfigsFromUrls(textarea.value.split('\n'));
    this.message.set(
      added ? `Added ${added} item configs.` : 'No new item configs: the urls are empty or already added.'
    );
    if (added) {
      textarea.value = '';
      this.itemConfigs.reveal((this.config()?.items.length ?? 1) - 1);
    }
  }

  protected setIngredients(index: number, text: string): void {
    this.store.updateItem(index, { ingredients: parseIngredients(text) });
  }

  protected setLinks(index: number, text: string): void {
    this.store.updateItem(index, { links: parseLinks(text) });
  }

  protected setBulkLabel(rows: EditorRows, value: string): void {
    const [kind, id] = value.split(':') as [LabelKind, string];
    this.bulkLabel.update((current) => ({ ...current, [rows]: id ? { kind, id } : null }));
  }

  protected applyBulkLabel(rows: EditorRows, mode: 'add' | 'remove'): void {
    const label = this.bulkLabel()[rows];
    if (label) {
      this.store.applyLabel(rows, [...this.tableFor(rows).selected()], label.kind, label.id, mode);
    }
  }

  protected removeSelected(rows: EditorRows): void {
    const table = this.tableFor(rows);
    const count = table.selected().size;
    if (count && confirm(`Delete ${count} selected rows?`)) {
      this.store.removeRows(rows, [...table.selected()]);
      table.clearSelection();
    }
  }

  protected removeRow(rows: EditorRows, index: number): void {
    this.store.removeRows(rows, [index]);
    this.tableFor(rows).clearSelection();
  }

  // Export

  protected async copyFile(file: ExportFile): Promise<void> {
    try {
      await navigator.clipboard.writeText(file.text);
      this.message.set(`Copied ${file.path}. Paste it over the file to save.`);
    } catch {
      this.message.set("Couldn't copy to the clipboard. Use Download instead.");
    }
  }

  protected downloadFile(file: ExportFile): void {
    const url = URL.createObjectURL(new Blob([file.text], { type: 'text/typescript' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  }
}
