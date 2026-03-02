import { Component, Inject, OnInit, Signal, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScraperConfigToken } from '@crafting-cart/shell';
import { ScraperConfig, ItemConfig } from '@crafting-cart/shared/models';
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'lib-cart-item-config',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './cart-item-config.component.html',
  styleUrl: './cart-item-config.component.scss'
})
export class CartItemConfigComponent implements OnInit {
  clonedConfig: ScraperConfig;
  itemsForm!: FormGroup;
  addForm!: FormGroup;
  displayedColumns: string[] = ['itemId', 'itemUrl', 'tags', 'categories', 'action'];
  dataSource!: MatTableDataSource<FormGroup>;
  dialog = inject(MatDialog);

  categories: WritableSignal<string[]> = signal([]);
  tags: WritableSignal<string[]> = signal([]);

  constructor(
    @Inject(ScraperConfigToken) private readonly config: any,
    private fb: FormBuilder
  ) {
    this.clonedConfig = { ...this.config };
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.itemsForm = this.fb.group({
      baseUrl: [this.clonedConfig.baseUrl, [Validators.required]],
      assetPath: [this.clonedConfig.assetPath, [Validators.required]],
      imagePath: [this.clonedConfig.imagePath, [Validators.required]],
      configOutputPath: [this.clonedConfig.configOutputPath, [Validators.required]],
      tags: [this.clonedConfig.tags],
      categories: [this.clonedConfig.categories],
      items: this.fb.array(this.clonedConfig.items.map((item) => this.createItemFormGroup(item)))
    });
    this.addForm = this.fb.group({
      categories: [[]],
      tags: [[]]
    });
    this.categories.set(this.clonedConfig.categories);
    this.tags.set(this.clonedConfig.tags);

    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.items.controls as FormGroup[]);
  }

  private createItemFormGroup(item: ItemConfig): FormGroup {
    return this.fb.group({
      itemUrl: [item.itemUrl, [Validators.required]],
      itemId: [item.itemId, [Validators.required]],
      categories: [item.categories],
      tags: [item.tags]
    });
  }

  private get items(): FormArray {
    console.log('Items Form Array:', this.itemsForm.get('items'));
    return this.itemsForm.get('items') as FormArray;
  }

  addRow(): void {
    const categories = this.addForm.get('categories')?.value || [];
    const tags = this.addForm.get('tags')?.value || [];
    (this.itemsForm.get('items') as FormArray).push(
      this.createItemFormGroup({
        itemUrl: '',
        itemId: '',
        categories: categories,
        tags: tags
      })
    );
    this.updateDataSource();
  }

  removeRow(index: number): void {
    this.items.removeAt(index);
    this.updateDataSource();
  }

  getItemUrlControl(index: number): FormControl {
    return this.items.at(index).get('itemUrl') as FormControl;
  }

  getItemIdControl(index: number): FormControl {
    return this.items.at(index).get('itemId') as FormControl;
  }
  openConfigDialog() {
    navigator.clipboard.writeText(`
        import { ScraperConfig } from '@crafting-cart/shared/models';
export const config: ScraperConfig =
      ${JSON.stringify(this.itemsForm.value, null, 2)}`);
  }

  removeKeyword(keyword: string, items: WritableSignal<string[]>) {
    items.update((keywords) => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      return [...keywords];
    });
  }
  addKeyword(event: MatChipInputEvent, items: WritableSignal<string[]>): void {
    const value = (event.value || '').trim();

    if (value) {
      items.update((keywords) => [...keywords, value]);
    }
    event.chipInput!.clear();
  }

  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
      return;
    }

    const baseUrl = this.itemsForm.get('baseUrl')?.value || '';
    const pastedText = clipboardData.getData('text');
    const itemUrl = pastedText.trim().replace(baseUrl, '');

    console.log('Pasted URL:', itemUrl);
    this.items.at(index).get('itemUrl')?.setValue(itemUrl);
    const itemId =
      itemUrl
        .split('/')
        .filter((part) => part)
        .pop() || '';
    this.items.at(index).get('itemId')?.setValue(itemId.toLowerCase());
  }
}
