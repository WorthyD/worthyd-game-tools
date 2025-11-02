import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerShellRoutingModule } from './player-shell-routing.module';
import { PlayerDetailModule } from '@dcd/player/detail';
import { CachedProfileService } from '@dcd/shared/data-access/profile';
import { IdbKeyValService } from '@dcd/shared/utils/storage';
import { PlayerService } from '@dcd/player/data-access';
import { AppConfigService } from '@dcd/shared/utils/app-config';

@NgModule({
  declarations: [],
  providers: [
    {
      provide: CachedProfileService,
      useFactory: (store: IdbKeyValService, config: AppConfigService) => {
        return new CachedProfileService(store, config.config.apiKey);
      },
      deps: [IdbKeyValService, AppConfigService]
    }
  ],
  imports: [PlayerShellRoutingModule, PlayerDetailModule]
})
export class PlayerShellModule {}
