// TODO: Rename this component to sync
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';
interface Notification {
  title: string;
  data: {
    total?: number;
    progress: number;
    complete?: number;
  };
}

@Component({
    selector: 'app-notifications',
    imports: [CommonModule, MatIconModule, MatCardModule, OverlayModule, MatButtonModule, MatProgressBarModule],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnChanges {
  isOpen = false;
  manualDismiss = false;

  @Input() notifications: Notification[] = [];
  constructor() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['notifications']) {
      if (this.notifications && this.notifications.length > 0 && !this.manualDismiss) {
        this.isOpen = true;
      }
    }
  }
  sync() {
    //this.isOpen = !this.isOpen;
    if (this.isOpen == false && this.notifications.length > 0) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
      this.manualDismiss = true;
    }
  }
}
