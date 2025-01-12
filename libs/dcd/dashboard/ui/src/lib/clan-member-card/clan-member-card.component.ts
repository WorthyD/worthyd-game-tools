import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClanMemberProfile, MemberProfile } from '@dcd/shared/models';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { BungieDisplayNameModule } from 'libs/components/src/lib/pipes/bungie-display-name';
import { BungieDisplayNamePipe } from '@dcd/shared/utils/pipes';
import { ProfileLinkComponent } from '@dcd/shared/ui/profile-link';

@Component({
    selector: 'dcd-clan-member-card',
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        BungieDisplayNamePipe,
        ProfileLinkComponent,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './clan-member-card.component.html',
    styleUrls: ['./clan-member-card.component.scss']
})
export class ClanMemberCardComponent {
  @Input()
  cardTitle!: string;

  @Input()
  members!: ClanMemberProfile[];

  @Input()
  isLoading!: boolean;

  @Input() itemTemplate!: TemplateRef<any>;
  @Output() viewProfile = new EventEmitter<MemberProfile>();
}
