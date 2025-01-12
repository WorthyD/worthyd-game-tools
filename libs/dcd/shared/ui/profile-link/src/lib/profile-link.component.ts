import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MemberProfile } from '@dcd/shared/models';
import { BungieDisplayNamePipe, ProfileUrlPipe } from '@dcd/shared/utils/pipes';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'lib-profile-link',
    imports: [BungieDisplayNamePipe, RouterModule, ProfileUrlPipe],
    templateUrl: './profile-link.component.html',
    styleUrls: ['./profile-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileLinkComponent {
  @Input()
  profile!: MemberProfile;

  @Input()
  showSidebar? = false;
}
