import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LabelOption } from './catalog-filters';
import { LabelFilterComponent } from './label-filter.component';

const options: LabelOption[] = [
  { id: 'bombs', name: 'Bombs', icon: 'bomb', label: 'Bombs' },
  { id: 'fences', name: 'Fences', icon: 'fence', label: 'Fences' },
  { id: 'artisan', name: 'Artisan_Equipment', icon: 'wine_bar', label: 'Artisan Equipment' }
];

@Component({
  imports: [LabelFilterComponent],
  template: `<lib-label-filter label="Tags" icon="sell" [options]="options" [(selected)]="selected" />`
})
class HostComponent {
  readonly options = options;
  readonly selected = signal<string[]>([]);
}

describe('LabelFilterComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let filter: LabelFilterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    filter = fixture.debugElement.query(By.directive(LabelFilterComponent)).componentInstance;
  });

  it('shows the label', () => {
    expect(fixture.nativeElement.querySelector('mat-label')?.textContent).toBe('Tags');
  });

  it('summarises the selection by its first label and a count', () => {
    fixture.componentInstance.selected.set(['artisan']);
    fixture.detectChanges();
    expect(filter.summary()).toBe('Artisan Equipment');

    fixture.componentInstance.selected.set(['bombs', 'fences', 'artisan']);
    fixture.detectChanges();
    expect(filter.summary()).toBe('Bombs +2');
  });

  it('writes selection changes back to the parent', () => {
    filter.selected.set(['fences']);
    expect(fixture.componentInstance.selected()).toEqual(['fences']);
  });
});
