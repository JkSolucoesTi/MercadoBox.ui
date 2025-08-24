import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, PanelModule, ButtonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  constructor(private router: Router , private modalService : ModalService) { }

  ngOnInit(): void {
  }

  //botão de rota
  @Input() titulo!: string;
  @Input() descricao!: string;
  @Input() rota!: string;

  //botão de modal
  @Input() modal!: boolean
  @Input() btnDescricao!: string
  

  Acao() {
    this.router.navigateByUrl(this.rota);
  }

  Modal() {
    this.modalService.openModal();
  }
}
