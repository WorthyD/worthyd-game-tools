import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MemberProfile } from '@dcd/shared/models';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'dcd-player-snapshot',
  imports: [MatCardModule, MatListModule],
  standalone: true,
  templateUrl: './player-snapshot.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './player-snapshot.component.scss'
})
export class PlayerSnapshotComponent {
  @Input()
  isLoading: boolean = false;

  @Input()
  profile: MemberProfile | undefined = undefined;
}
