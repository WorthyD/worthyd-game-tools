import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lib-card-footer' },
  template:`<ng-content></ng-content>`,
})
export class CardFooterComponent {}
