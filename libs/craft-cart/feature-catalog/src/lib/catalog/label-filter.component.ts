import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { LabelOption } from './catalog-filters';

/** Multi-select of catalog labels (categories or tags), each shown with its icon. */
@Component({
  selector: 'lib-label-filter',
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule],
  template: `
    <mat-form-field class="w-56">
      <mat-label>{{ label() }}</mat-label>
      <mat-icon matPrefix aria-hidden="true">{{ icon() }}</mat-icon>
      <mat-select multiple [value]="selected()" (selectionChange)="selected.set($event.value)">
        <mat-select-trigger>{{ summary() }}</mat-select-trigger>
        @for (option of options(); track option.id) {
          <mat-option [value]="option.id">
            <mat-icon aria-hidden="true">{{ option.icon }}</mat-icon>
            {{ option.label }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelFilterComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly options = input.required<LabelOption[]>();
  readonly selected = model<string[]>([]);

  /** "Bombs" for one selection, "Bombs +2" for three. */
  readonly summary = computed(() => {
    const selected = this.selected();
    const first = this.options().find((option) => option.id === selected[0])?.label ?? '';
    return selected.length > 1 ? `${first} +${selected.length - 1}` : first;
  });
}
