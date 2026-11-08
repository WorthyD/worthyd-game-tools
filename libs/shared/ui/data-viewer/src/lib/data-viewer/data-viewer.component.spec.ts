import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataViewerComponent } from './data-viewer.component';

interface Row {
  id: number;
  name: string;
}

const makeRows = (count: number): Row[] => Array.from({ length: count }, (_, i) => ({ id: i, name: `Row ${i}` }));

@Component({
  imports: [DataViewerComponent],
  template: `
    <lib-data-viewer [dataSource]="rows()" [columns]="[]" [filterColumns]="['name']">
      <span dataViewerFilters class="projected-filter">Category</span>
    </lib-data-viewer>
  `
})
class HostComponent {
  readonly rows = signal(makeRows(60));
}

describe('DataViewerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let viewer: DataViewerComponent<Row>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    viewer = fixture.debugElement.query(By.directive(DataViewerComponent)).componentInstance;
  });

  it('pages the data', () => {
    expect(viewer.pagedData()?.length).toBe(25);
  });

  it('projects consumer filters into the toolbar', () => {
    expect(fixture.nativeElement.querySelector('.projected-filter')?.textContent).toBe('Category');
  });

  it('returns to the first page when the data source changes', () => {
    viewer.paginator.lastPage();
    fixture.detectChanges();
    expect(viewer.pagerData().index).toBe(2);

    fixture.componentInstance.rows.set(makeRows(30));
    fixture.detectChanges();

    expect(viewer.pagerData().index).toBe(0);
    expect(viewer.pagedData()?.[0].id).toBe(0);
  });
});
