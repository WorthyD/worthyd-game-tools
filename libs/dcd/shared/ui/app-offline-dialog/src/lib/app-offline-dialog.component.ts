import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppConfigService } from '@dcd/shared/utils/app-config';
@Component({
    selector: 'app-app-offline-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './app-offline-dialog.component.html',
    styleUrls: ['./app-offline-dialog.component.scss']
})
export class AppOfflineDialogComponent {
  constructor(public dialogRef: MatDialogRef<AppOfflineDialogComponent>, private appConfig: AppConfigService) {}
  onNoClick(): void {
    window.sessionStorage.setItem(this.appConfig.config.constants.D2DASHBOARD_ACKNOWLEDGE_OFFLINE, 'true');
    this.dialogRef.close();
  }
}
