import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberProfile } from '@dcd/shared/models';
import { MatCardModule } from '@angular/material/card';
import { MemberTypeIconComponent } from '../member-type-icon/member-type-icon.component';
import { BungieDateTimePipe } from '@dcd/shared/utils/pipes';

@Component({
  selector: 'dcd-shared-member-overview',
  imports: [CommonModule, MatCardModule, MemberTypeIconComponent, BungieDateTimePipe],
  templateUrl: './member-overview.component.html',
  standalone: true,
  styleUrl: './member-overview.component.scss'
})
export class MemberSharedOverviewComponent {
  @Input()
  memberOverview: MemberProfile | undefined = {};
  @Input()
  isLoading: boolean = false;
}
