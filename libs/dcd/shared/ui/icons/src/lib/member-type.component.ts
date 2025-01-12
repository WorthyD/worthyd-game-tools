import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MemberTypePipe } from '@dcd/shared/utils/pipes';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'lib-member-type',
    template: `<mat-icon [svgIcon]="type | memberType" class="ico-{{ type | memberType }}"></mat-icon>`,
    imports: [MemberTypePipe, MatIconModule],
    encapsulation: ViewEncapsulation.None
})
export class MemberTypeComponent {
  @Input()
  type: any;
  constructor() {}
}
