import { Injectable } from '@angular/core';
import { CachedProfileService } from '@dcd/shared/data-access/profile';
@Injectable()
export class PlayerService {
  constructor(
    private cachedProfileService: CachedProfileService
  ) {}

  getProfile(membershipType: string, membershipId: string) {
    return this.cachedProfileService.getProfile(membershipType, membershipId);
  }
}
