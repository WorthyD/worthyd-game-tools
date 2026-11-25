import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { catalogDatasets } from './catalog/datasets';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it(`should have as title 'cozy-almanacs'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cozy-almanacs');
  });

  it('should ship no game data of its own', () => {
    expect(catalogDatasets).toEqual([]);
  });
});
