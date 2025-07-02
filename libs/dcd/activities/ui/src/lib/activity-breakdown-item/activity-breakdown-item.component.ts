
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'dcd-activity-breakdown-item',
  templateUrl: './activity-breakdown-item.component.html',
  styleUrls: ['./activity-breakdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  standalone: true
})
export class ActivityBreakdownItemComponent {
  @Input() title!: string;
  @Input() iconUrl?: string;
  @Input() description?: string;
  @Input() label?: string;
  @Input() isLoading: boolean = false;
}
