import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PlayerSeal } from './player-seal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
@Component({
  selector: 'lib-player-seal',
  imports: [CommonModule, MatTooltipModule, MatProgressBarModule, MatIconModule, MatBadgeModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [matTooltip]="playerSeal.sealDescription">
      <div
        [ngClass]="{ 'seal-completed': playerSeal.complete, 'seal-image': true }"
        [matBadge]="playerSeal.gildedCount"
        [matBadgeHidden]="playerSeal.gildedCount === 0"
        matBadgeOverlap="false"
      >
        <img src="//bungie.net/{{ playerSeal.sealImage }}" alt="{{ playerSeal.sealTitle }}" />
      </div>
      <h3>
        {{ playerSeal.sealTitle }}
        <mat-icon *ngIf="playerSeal.gilded" matTooltip="Gilded">workspace_premium</mat-icon>
      </h3>
      <div *ngIf="!playerSeal.complete" class="seal-progress">
        <mat-progress-bar mode="determinate" [value]="playerSeal.progress"></mat-progress-bar>
        {{ playerSeal.progress }}%
      </div>
    </section>
  `,
  styles: [
    `
      h3 {
        text-align: center;
      }
      section {
        padding: 1rem;
      }
      .seal-image {
        height: 127px;
        width: 127px;
        position: relative;
        display: block;
        margin: 0 auto;
        img {
          height: 127px;
          width: 127px;
        }
      }
      h3 {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Unfortunately, this looks really bad on a dark background
      /*
      .seal-completed:after {
        animation: shine 3s ease-in-out infinite;
        animation-fill-mode: forwards;
        content: '';
        position: absolute;
        top: -110%;
        left: -210%;
        width: 200%;
        height: 200%;
        opacity: 0;
        transform: rotate(30deg);

        background: rgba(255, 255, 255, 0.13);
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0.13) 0%,
          rgba(255, 255, 255, 0.13) 77%,
          rgba(255, 255, 255, 0.5) 92%,
          rgba(255, 255, 255, 0) 100%
        );
      }
      */
      .seal-completed:active:after {
      }
      mat-progress-bar {
        margin-right: 0.5rem;
      }
      /* h4 {
        padding: 12px 48px;
        color: #ffffff;
        background: linear-gradient(to right, #c0c0c0 0, white 10%, #c0c0c0 20%);
        background-position: 0;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 2s infinite linear;
        animation-fill-mode: forwards;
        -webkit-text-size-adjust: none;
      } */

      /* @keyframes shine {
        0% {
          background-position: 0;
        }
        60% {
          background-position: 180px;
        }
        100% {
          background-position: 280px;
        }
      } */
      .seal-progress {
        display: flex;
        align-items: center;
      }
      /* @keyframes shine {
        10% {
          opacity: 1;
          top: -30%;
          left: -30%;
          transition-property: left, top, opacity;
          transition-duration: 0.7s, 0.7s, 0.15s;
          transition-timing-function: ease;
        }
        100% {
          opacity: 0;
          top: -30%;
          left: -30%;
          transition-property: left, top, opacity;
        }
      } */
    `
  ]
})
export class PlayerSealComponent {
  @Input()
  playerSeal!: PlayerSeal;

  constructor() {}
}
