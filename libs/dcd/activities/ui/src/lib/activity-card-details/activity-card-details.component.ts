import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinyDefinitionsDestinyActivityDefinition } from 'bungie-api-angular';
//import { DestinyDefinitionsDestinyActivityDefinition } from 'bungie-api-angular/lib/model/destinyDefinitionsDestinyActivityDefinition';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'dcd-activity-card-details',
    imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
    templateUrl: './activity-card-details.component.html',
    styleUrls: ['./activity-card-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCardDetailsComponent {
  @Input() activityDefinition?: DestinyDefinitionsDestinyActivityDefinition;
  @Input() title!: string;
  @Input() itemTemplate!: TemplateRef<HTMLElement>;
  @Output() viewActivity = new EventEmitter<number>();
}
