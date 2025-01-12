import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SealListItem } from '@dcd/seals/models';
@Component({
    selector: 'app-seals-list',
    templateUrl: './seals-list.component.html',
    styleUrls: ['./seals-list.component.scss'],
    imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SealsListComponent {
  @Input() sealsList!: SealListItem[];

  trackByFn(index: number, sealListItem: SealListItem) {
    return sealListItem.seal.hash;
  }
}
