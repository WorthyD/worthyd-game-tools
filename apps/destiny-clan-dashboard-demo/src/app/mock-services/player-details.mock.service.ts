import { Injectable } from '@angular/core';
import { getMockProfile } from '../mock-objects/profile';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlayerMockService {
  constructor() {}

  getProfile(membershipType: string, membershipId: string) {
    return of(getMockProfile());
  }
}
