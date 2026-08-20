import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { NotificacaoService } from 'src/app/shared/notificacao.service';
import { LocationStatus, UserLocation } from 'src/app/model/user/user-location.model';

describe('LocationService', () => {
  let service: LocationService;
  let notificacaoSpy: jasmine.SpyObj<NotificacaoService>;

  const mockLocation: UserLocation = {
    latitude: -23.550520,
    longitude: -46.633308,
    accuracy: 25,
    timestamp: new Date().toISOString(),
    address: {
      formattedAddress: 'Avenida Paulista, 1000, Bela Vista, São Paulo - SP',
      street: 'Avenida Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'São Paulo',
      stateCode: 'SP',
      country: 'Brasil',
      countryCode: 'BR',
      postalCode: '01310-100'
    }
  };

  beforeEach(() => {
    localStorage.clear();

    const spy = jasmine.createSpyObj('NotificacaoService', ['success', 'error', 'warn', 'info']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocationService,
        { provide: NotificacaoService, useValue: spy }
      ]
    });

    service = TestBed.inject(LocationService);
    notificacaoSpy = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve ser instanciado corretamente com estado inicial NOT_IDENTIFIED quando não houver cache', () => {
    expect(service).toBeTruthy();
    expect(service.getCurrentStatusValue()).toBe(LocationStatus.NOT_IDENTIFIED);
    expect(service.getCurrentLocationValue()).toBeNull();
  });

  it('deve carregar localização válida do localStorage no init()', () => {
    localStorage.setItem('mercadobox_user_location', JSON.stringify(mockLocation));
    service.init();

    expect(service.getCurrentStatusValue()).toBe(LocationStatus.IDENTIFIED);
    expect(service.getCurrentLocationValue()?.latitude).toBe(-23.550520);
    expect(service.getCurrentLocationValue()?.longitude).toBe(-46.633308);
    expect(service.getCurrentLocationValue()?.address?.neighborhood).toBe('Bela Vista');
  });

  it('deve descartar cache de localização se tiver mais de 30 minutos', () => {
    const expiredDate = new Date(Date.now() - 31 * 60 * 1000).toISOString();
    const expiredLocation: UserLocation = {
      ...mockLocation,
      timestamp: expiredDate
    };

    localStorage.setItem('mercadobox_user_location', JSON.stringify(expiredLocation));
    service.init();

    expect(service.getCurrentStatusValue()).toBe(LocationStatus.NOT_IDENTIFIED);
    expect(service.getCurrentLocationValue()).toBeNull();
  });

  it('deve abrir e fechar o diálogo de consentimento corretamente', () => {
    service.openConsentPrompt();
    let isVisible = false;
    service.promptVisible$.subscribe(v => isVisible = v);
    expect(isVisible).toBeTrue();

    service.dismissConsentPrompt();
    expect(isVisible).toBeFalse();
  });

  it('deve limpar localização e resetar status ao chamar clearLocation()', () => {
    localStorage.setItem('mercadobox_user_location', JSON.stringify(mockLocation));
    service.init();
    expect(service.getCurrentStatusValue()).toBe(LocationStatus.IDENTIFIED);

    service.clearLocation();

    expect(service.getCurrentStatusValue()).toBe(LocationStatus.NOT_IDENTIFIED);
    expect(service.getCurrentLocationValue()).toBeNull();
    expect(localStorage.getItem('mercadobox_user_location')).toBeNull();
  });
});
