import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CachedProfileService } from '@dcd/shared/data-access/profile';
import { MemberProfile } from '@dcd/shared/models';
@Injectable({
  providedIn: 'root',

})
export class PlayerService {
  constructor(private cachedProfileService: CachedProfileService) {}

  getPlayerInfo(membershipType: string, membershipId: string): Promise<MemberProfile | null> {
    return firstValueFrom(this.cachedProfileService.getProfile(membershipType, membershipId));
  }
}
