import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

// import { DestinyDefinitionsDestinyActivityDefinition } from 'bungie-api-angular';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'dcd-activity-mode-card-details',
    imports: [RouterModule, MatCardModule, MatButtonModule],
    templateUrl: './activity-mode-card-details.component.html',
    styleUrls: ['./activity-mode-card-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityModeCardDetailsComponent {
  @Input() activityDefinition!: any;
  @Input() title!: string;
  @Input() itemTemplate!: TemplateRef<HTMLElement>;
}
