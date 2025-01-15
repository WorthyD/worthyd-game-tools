// component originated form https://github.com/crafted/crafted
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { take } from 'rxjs';
import { Grouper } from '@dcd/shared/data';
import { Sorter } from '@dcd/shared/data';
import { Viewer } from '@dcd/shared/data';
import { GroupLabel, SortLabel, ViewLabel } from '@dcd/shared/data-models';

@Component({
  selector: 'lib-display-options',
  templateUrl: './display-options.component.html',
  imports: [AsyncPipe, NgIf, NgFor, FormsModule, MatButtonModule, MatMenuModule, MatIconModule],
  standalone: true,
  styleUrls: ['./display-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayOptionsComponent implements OnChanges {
  groups!: GroupLabel[];

  sorts!: SortLabel[];

  views!: ViewLabel[];

  @Input() grouper!: Grouper;

  @Input() sorter!: Sorter;

  @Input() viewer!: Viewer;

  constructor() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['grouper']) {
      this.groups = this.grouper ? this.grouper.getGroups() : [];
    }
    if (simpleChanges['sorter']) {
      this.sorts = this.sorter ? this.sorter.getSorts() : [];
    }
    if (simpleChanges['viewer']) {
      this.views = this.viewer ? this.viewer.getViews() : [];
    }
  }

  setGroup(group: string) {
    this.grouper.setState({ group });
  }

  setSort(sort: string) {
    this.sorter.state.pipe(take(1)).subscribe((state) => {
      let reverse = state.reverse;
      if (state.sort === sort) {
        reverse = !reverse;
      } else {
        reverse = false;
      }

      this.sorter.setState({ ...state, sort, reverse });
    });
  }

  toggleViewKey(view: string) {
    this.viewer.toggle(view);
  }
}
