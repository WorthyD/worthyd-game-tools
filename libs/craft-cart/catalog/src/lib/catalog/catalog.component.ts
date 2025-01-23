import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogFacade } from '@crafting-cart/shell';
import { PushPipe } from '@ngrx/component';

@Component({
  selector: 'lib-catalog',
  imports: [CommonModule, PushPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  readonly cf = inject(CatalogFacade);
  catalogItems$ = this.cf.allCatalog$;
}
