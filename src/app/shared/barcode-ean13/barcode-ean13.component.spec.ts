import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeEan13Component } from './barcode-ean13.component';

describe('BarcodeEan13Component', () => {
  let component: BarcodeEan13Component;
  let fixture: ComponentFixture<BarcodeEan13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BarcodeEan13Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeEan13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
