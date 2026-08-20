import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-location-consent-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './location-consent-dialog.component.html',
  styleUrls: ['./location-consent-dialog.component.scss']
})
export class LocationConsentDialogComponent {
  constructor(public locationService: LocationService) {}

  onPermitir(): void {
    this.locationService.requestLocation(true);
  }

  onAgoraNao(): void {
    this.locationService.dismissConsentPrompt();
  }
}
