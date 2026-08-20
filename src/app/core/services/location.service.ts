import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { UserLocation, UserLocationAddress, LocationStatus } from 'src/app/model/user/user-location.model';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { environment } from 'src/environments/environment';

interface LocationApiResponse {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: UserLocationAddress | null;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly CACHE_KEY = 'mercadobox_user_location';
  private readonly CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

  private currentLocationSubject = new BehaviorSubject<UserLocation | null>(null);
  public currentLocation$: Observable<UserLocation | null> = this.currentLocationSubject.asObservable();

  private locationStatusSubject = new BehaviorSubject<LocationStatus>(LocationStatus.NOT_IDENTIFIED);
  public locationStatus$: Observable<LocationStatus> = this.locationStatusSubject.asObservable();

  private promptVisibleSubject = new BehaviorSubject<boolean>(false);
  public promptVisible$: Observable<boolean> = this.promptVisibleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notificacao: NotificacaoService
  ) {
    this.init();
  }

  /**
   * Inicializa o estado lendo o cache do LocalStorage.
   */
  public init(): void {
    const cached = this.getCachedLocation();
    if (cached && this.isCacheValid(cached)) {
      this.currentLocationSubject.next(cached);
      this.locationStatusSubject.next(LocationStatus.IDENTIFIED);
    } else {
      this.currentLocationSubject.next(null);
      this.locationStatusSubject.next(LocationStatus.NOT_IDENTIFIED);
    }
  }

  /**
   * Abre o diálogo de consentimento amigável.
   */
  public openConsentPrompt(): void {
    this.promptVisibleSubject.next(true);
  }

  /**
   * Fecha o diálogo de consentimento sem acionar a geolocalização.
   */
  public dismissConsentPrompt(): void {
    this.promptVisibleSubject.next(false);
  }

  /**
   * Obtém a localização atual do usuário e consulta o reverse geocoding no backend.
   */
  public async requestLocation(forceRefresh = false): Promise<UserLocation | null> {
    this.dismissConsentPrompt();

    if (!forceRefresh) {
      const cached = this.getCachedLocation();
      if (cached && this.isCacheValid(cached)) {
        this.currentLocationSubject.next(cached);
        this.locationStatusSubject.next(LocationStatus.IDENTIFIED);
        return cached;
      }
    }

    if (!navigator || !navigator.geolocation) {
      this.locationStatusSubject.next(LocationStatus.UNAVAILABLE);
      this.notificacao.warn(
        'Localização',
        'Geolocalização não é suportada ou permitida por este navegador.'
      );
      return null;
    }

    this.locationStatusSubject.next(LocationStatus.REQUESTING);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const rawLat = position.coords.latitude;
          const rawLng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          const locationData: UserLocation = {
            latitude: rawLat,
            longitude: rawLng,
            accuracy: accuracy,
            timestamp: new Date(),
            address: null
          };

          // Consulta reverse geocoding no backend
          try {
            const addressResponse = await this.fetchReverseGeocode(rawLat, rawLng, accuracy);
            if (addressResponse && addressResponse.address) {
              locationData.address = addressResponse.address;
            }
          } catch (e) {
            console.warn('Reverse geocoding não disponível ou falhou:', e);
          }

          this.saveLocationToCache(locationData);
          this.currentLocationSubject.next(locationData);
          this.locationStatusSubject.next(LocationStatus.IDENTIFIED);

          const localDescricao = locationData.address?.neighborhood
            ? `${locationData.address.neighborhood}, ${locationData.address.city || ''}`
            : locationData.address?.city || 'Localização obtida';

          this.notificacao.success(
            'Localização identificada',
            localDescricao
          );

          resolve(locationData);
        },
        (error: GeolocationPositionError) => {
          let errorMessage = 'Não foi possível obter sua localização.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.locationStatusSubject.next(LocationStatus.DENIED);
              errorMessage = 'Não conseguimos acessar sua localização. Você poderá continuar utilizando o MercadoBox normalmente.';
              this.notificacao.info('Localização', errorMessage);
              break;

            case error.POSITION_UNAVAILABLE:
              this.locationStatusSubject.next(LocationStatus.UNAVAILABLE);
              errorMessage = 'Não foi possível determinar sua localização. Verifique se o serviço de localização está ativado e tente novamente.';
              this.notificacao.warn('Localização', errorMessage);
              break;

            case error.TIMEOUT:
              this.locationStatusSubject.next(LocationStatus.ERROR);
              errorMessage = 'Tempo esgotado ao tentar obter sua localização.';
              this.notificacao.warn('Localização', errorMessage);
              break;

            default:
              this.locationStatusSubject.next(LocationStatus.ERROR);
              this.notificacao.error('Localização', errorMessage);
              break;
          }

          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Chama o backend para converter coordenadas em endereço
   */
  public async fetchReverseGeocode(latitude: number, longitude: number, accuracy?: number): Promise<LocationApiResponse | null> {
    try {
      return await firstValueFrom(
        this.http.post<LocationApiResponse>(`${environment.apiUrl}/location/reverse-geocode`, {
          latitude,
          longitude,
          accuracy
        })
      );
    } catch {
      return null;
    }
  }

  /**
   * Recupera a localização armazenada no LocalStorage.
   */
  public getCachedLocation(): UserLocation | null {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return null;
      const parsed: UserLocation = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Verifica se a localização em cache ainda está dentro do período de validade (30 min).
   */
  public isCacheValid(location: UserLocation): boolean {
    if (!location || !location.timestamp) return false;
    const locationTime = new Date(location.timestamp).getTime();
    const now = Date.now();
    return (now - locationTime) < this.CACHE_TTL_MS;
  }

  /**
   * Salva a localização no LocalStorage.
   */
  private saveLocationToCache(location: UserLocation): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(location));
    } catch (e) {
      console.error('Erro ao salvar localização no localStorage:', e);
    }
  }

  /**
   * Limpa a localização em cache e reseta o estado.
   */
  public clearLocation(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (e) {
      console.error('Erro ao limpar localização:', e);
    }
    this.currentLocationSubject.next(null);
    this.locationStatusSubject.next(LocationStatus.NOT_IDENTIFIED);
  }

  /**
   * Retorna o valor síncrono atual da localização.
   */
  public getCurrentLocationValue(): UserLocation | null {
    return this.currentLocationSubject.value;
  }

  /**
   * Retorna o status síncrono atual.
   */
  public getCurrentStatusValue(): LocationStatus {
    return this.locationStatusSubject.value;
  }
}
