import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LocationService } from 'src/app/core/services/location.service';
import { LocationStatus, UserLocation } from 'src/app/model/user/user-location.model';

@Component({
  selector: 'app-location-status-badge',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './location-status-badge.component.html',
  styleUrls: ['./location-status-badge.component.scss']
})
export class LocationStatusBadgeComponent {
  @Input() compact = false;

  public readonly LocationStatus = LocationStatus;

  constructor(public locationService: LocationService) {}

  solicitarLocalizacao(): void {
    this.locationService.openConsentPrompt();
  }

  atualizarLocalizacao(): void {
    this.locationService.requestLocation(true);
  }

  getDisplayLocation(location: UserLocation | null): string {
    if (!location) return 'Localização identificada';

    const addr = location.address;
    if (addr) {
      if (addr.neighborhood && addr.city && addr.stateCode) {
        return `${addr.neighborhood}, ${addr.city} - ${addr.stateCode}`;
      }
      if (addr.neighborhood && addr.city) {
        return `${addr.neighborhood}, ${addr.city}`;
      }
      if (addr.city && addr.stateCode) {
        return `${addr.city} - ${addr.stateCode}`;
      }
      if (addr.formattedAddress) {
        return addr.formattedAddress;
      }
    }

    return 'Localização identificada';
  }

  getTooltip(location: UserLocation | null): string {
    if (!location) return 'Localização não informada';
    const hora = new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const precisao = location.accuracy ? ` (Precisão: ±${Math.round(location.accuracy)}m)` : '';
    const endereco = location.address?.formattedAddress ? `📍 ${location.address.formattedAddress}\n` : '';
    return `${endereco}Identificado às ${hora}${precisao}. Clique para atualizar.`;
  }
}
