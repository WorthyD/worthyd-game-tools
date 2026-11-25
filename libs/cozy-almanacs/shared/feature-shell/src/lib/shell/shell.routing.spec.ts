import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';
import { CatalogDatasetLoader } from '@cozy-almanacs/state';
import { shellRoutes } from './shell.routing';

@Component({ template: 'shell' })
class StubShellComponent {}

describe('shellRoutes', () => {
  it('loads the active catalog dataset before opening the shell, even when loading fails', async () => {
    const loadActive = jest.fn().mockResolvedValue(false);
    TestBed.configureTestingModule({
      providers: [
        { provide: CatalogDatasetLoader, useValue: { loadActive } },
        provideRouter([{ ...shellRoutes[0], component: StubShellComponent, children: [] }])
      ]
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    expect(loadActive).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.textContent).toContain('shell');
  });
});
