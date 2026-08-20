import { Injectable } from '@angular/core';
import { UserLocation } from '../model/user/user-location.model';
import { LocationService } from '../core/services/location.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLocationService {
  constructor(private locationService: LocationService) {}

  public get currentLocation$(): Observable<UserLocation | null> {
    return this.locationService.currentLocation$;
  }

  public getCurrentLocation(forceRefresh = false): Promise<UserLocation | null> {
    return this.locationService.requestLocation(forceRefresh);
  }

  public async obterLocalizacao(forceRefresh = false): Promise<UserLocation | null> {
    return this.locationService.requestLocation(forceRefresh);
  }
}
