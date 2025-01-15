import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ClassTypeTextPipe, RaceTypeTextPipe } from '@dcd/shared/utils/pipes';
import { Character } from '@dcd/shared/models';

@Component({
  selector: 'lib-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatCardModule, ClassTypeTextPipe, RaceTypeTextPipe],
  standalone: true,
  template: `
    <ng-container *ngIf="!isLoading; else loading">
      <mat-card *ngIf="character" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ character.classType ?? 0 | classTypeText }} - {{ character.light }}</mat-card-title>
          <mat-card-subtitle>{{ character.raceType ?? 0 | raceTypeText }} </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content></mat-card-content>
      </mat-card>
    </ng-container>
    <ng-template #loading>
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title><span class="skeleton-item skeleton-title"></span></mat-card-title>
          <mat-card-subtitle><span class="skeleton-item skeleton-title"></span> </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content></mat-card-content>
      </mat-card>
    </ng-template>
  `,
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  //TODO: IDEAS TO SHOW
  /*
    time played total, time played this season, emblem, current title
  */
  @Input()
  character: Character = {};

  @Input()
  isLoading: boolean = false;
}
