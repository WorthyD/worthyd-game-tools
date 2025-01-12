import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MemberProfile } from '@dcd/shared/models';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'dcd-player-snapshot',
    imports: [MatCardModule, MatListModule],
    templateUrl: './player-snapshot.component.html',
    styleUrl: './player-snapshot.component.scss'
})
export class PlayerSnapshotComponent {
  @Input()
  isLoading: boolean = false;

  @Input()
  profile: MemberProfile | undefined = undefined;
}
