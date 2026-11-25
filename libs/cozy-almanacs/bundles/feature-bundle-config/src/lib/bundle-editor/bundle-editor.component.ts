import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, from, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Bundle, BundleItem } from '@cozy-almanacs/models';
import {
  BundleEditorStore,
  BundlePath,
  CatalogDatasetLoader,
  CatalogStore,
  bundleAt,
  bundleTemplate,
  createBundlesFile,
  filterCatalogItems,
  formatLinks,
  parseLinks
} from '@cozy-almanacs/state';

interface ExportFile {
  path: string;
  name: string;
  text: string;
}

const exportFile = (path: string, text: string): ExportFile => ({ path, name: path.split('/').pop() ?? path, text });

const samePath = (a: BundlePath, b: BundlePath): boolean => a.length === b.length && a.every((n, i) => n === b[i]);

/**
 * Editor for a dataset's bundles: add, nest, reorder and fill bundles with catalog items or one-offs.
 * Every change is autosaved to local storage; saving is manual (copy or download the generated bundles.json
 * and replace the file in the repo), the same as the catalog editor.
 */
@Component({
  selector: 'lib-bundle-editor',
  imports: [
    DatePipe,
    NgTemplateOutlet,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [BundleEditorStore],
  templateUrl: './bundle-editor.component.html',
  styleUrl: './bundle-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleEditorComponent {
  protected readonly store = inject(BundleEditorStore);
  protected readonly catalog = inject(CatalogStore);
  private readonly router = inject(Router);
  private readonly loader = inject(CatalogDatasetLoader);
  protected readonly datasets = this.loader.sources;

  protected readonly missingDataset = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly message = signal('');
  protected readonly selectedPath = signal<BundlePath>([0]);

  protected readonly bundles = computed(() => this.store.draft() ?? []);
  protected readonly selected = computed(() => bundleAt(this.bundles(), this.selectedPath()));
  protected readonly selectedLinks = computed(() => formatLinks(this.selected()?.links ?? []));
  protected readonly catalogMap = computed(() => new Map(this.catalog.entities().map((item) => [item.id, item])));
  protected readonly catalogOptions = computed(() =>
    [...this.catalog.entities()].sort((a, b) => a.name.localeCompare(b.name))
  );
  protected readonly filteredCount = computed(
    () => filterCatalogItems(this.catalog.entities(), this.selected()?.itemFilter).length
  );

  protected readonly exportFile = computed(() =>
    exportFile(this.store.filePath() ?? 'bundles.json', this.store.bundlesFile())
  );
  /** The base bundle as it would appear in bundles.json, to copy and paste. */
  protected readonly templateFile = computed(() =>
    exportFile('bundle-template.json', createBundlesFile([bundleTemplate]))
  );

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(
        switchMap((params) => {
          const id = params.get('datasetId');
          const source = this.loader.source(id);
          this.missingDataset.set(source ? null : (id ?? ''));
          this.loadError.set(null);
          return source
            ? from(this.loader.load(source)).pipe(
                catchError((error: unknown) => {
                  this.loadError.set(`Couldn't load ${source.name}: ${error instanceof Error ? error.message : error}`);
                  return EMPTY;
                })
              )
            : EMPTY;
        }),
        takeUntilDestroyed()
      )
      .subscribe((dataset) => {
        this.store.open(dataset);
        this.selectedPath.set([0]);
      });
  }

  protected isSelected(path: BundlePath): boolean {
    return samePath(path, this.selectedPath());
  }

  protected switchDataset(id: string): void {
    this.router.navigate(['/bundles/config', id]);
  }

  protected discardDraft(): void {
    if (confirm('Discard all changes in this draft and start again from the source file?')) {
      this.store.discardDraft();
      this.selectedPath.set([0]);
    }
  }

  // Bundles

  protected addBundle(parent: BundlePath | null): void {
    this.selectedPath.set(this.store.addBundle(parent));
  }

  protected addFromTemplate(parent: BundlePath | null): void {
    this.selectedPath.set(this.store.insertBundle(parent, bundleTemplate));
  }

  protected duplicateBundle(): void {
    this.selectedPath.set(this.store.duplicateBundle(this.selectedPath()));
  }

  protected moveBundle(offset: -1 | 1): void {
    this.selectedPath.set(this.store.moveBundle(this.selectedPath(), offset));
  }

  protected removeBundle(bundle: Bundle): void {
    const children = bundle.bundles?.length ?? 0;
    const detail = children ? ` and the ${children} bundles inside it` : '';
    if (confirm(`Delete ${bundle.name || bundle.id}${detail}?`)) {
      const path = this.selectedPath();
      this.store.removeBundle(path);
      const parent = path.slice(0, -1);
      const index = path[path.length - 1];
      this.selectedPath.set(index > 0 ? [...parent, index - 1] : parent.length ? parent : [0]);
    }
  }

  protected update(changes: Partial<Bundle>): void {
    this.store.updateBundle(this.selectedPath(), changes);
  }

  protected setRequired(value: string): void {
    const required = parseInt(value, 10);
    this.update({ required: Number.isNaN(required) ? undefined : required });
  }

  protected setLinks(text: string): void {
    this.update({ links: parseLinks(text) });
  }

  protected setFilter(kind: 'categories' | 'tags', ids: string[]): void {
    this.update({ itemFilter: { ...this.selected()?.itemFilter, [kind]: ids } });
  }

  // Items

  protected addCatalogItems(input: HTMLInputElement): void {
    const ids = input.value
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id);
    const unknown = ids.filter((id) => !this.catalogMap().has(id));
    if (unknown.length) {
      this.message.set(`Not in the catalog: ${unknown.join(', ')}. Add them in the catalog editor first.`);
      return;
    }
    this.store.addItems(
      this.selectedPath(),
      ids.map((itemId) => ({ itemId }))
    );
    input.value = '';
  }

  protected addOneOff(): void {
    const count = this.selected()?.items?.length ?? 0;
    this.store.addItems(this.selectedPath(), [{ id: `item_${count + 1}`, name: `Item ${count + 1}` }]);
  }

  protected addFromUrls(textarea: HTMLTextAreaElement): void {
    const added = this.store.addItemsFromUrls(this.selectedPath(), textarea.value.split('\n'));
    this.message.set(
      added
        ? `Added ${added} ${added === 1 ? 'item' : 'items'}. Wiki pages that match a catalog item id use the catalog item.`
        : 'No new items: paste full wiki urls, one per line.'
    );
    if (added) {
      textarea.value = '';
    }
  }

  protected updateItem(index: number, changes: Partial<BundleItem>): void {
    this.store.updateItem(this.selectedPath(), index, changes);
  }

  protected setQuantity(index: number, value: string): void {
    const quantity = parseInt(value, 10);
    this.updateItem(index, { quantity: Number.isNaN(quantity) ? undefined : quantity });
  }

  protected parseLinksText(text: string): BundleItem['links'] {
    return parseLinks(text);
  }

  protected itemLinks(item: BundleItem): string {
    return formatLinks(item.links ?? []);
  }

  // Export

  protected async copyFile(file: ExportFile): Promise<void> {
    try {
      await navigator.clipboard.writeText(file.text);
      this.message.set(`Copied ${file.path}.`);
    } catch {
      this.message.set("Couldn't copy to the clipboard. Use Download instead.");
    }
  }

  protected downloadFile(file: ExportFile): void {
    const url = URL.createObjectURL(new Blob([file.text], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  }
}
