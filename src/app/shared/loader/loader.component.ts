import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  @Input() visible = false;
}
