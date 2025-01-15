import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
//import { AppConfig } from '@core/config/app-config';
import { AppConfigService } from '@dcd/shared/utils/app-config';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsMenuComponent {
  constructor(private appConfig: AppConfigService) {}
  versionNumber = this.appConfig.config.appVersion;
}
