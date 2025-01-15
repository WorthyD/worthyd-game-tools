import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MemberTypePipe } from '@dcd/shared/utils/pipes';

@Component({
  selector: 'lib-member-type-icon',
  standalone: true,
  imports: [MemberTypePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mat-icon [svgIcon]="type | memberType" class="ico-{{ type | memberType }}">{{ type }}</mat-icon>`,
  encapsulation: ViewEncapsulation.None
})
export class MemberTypeIconComponent {
  @Input()
  type = 0;
}
