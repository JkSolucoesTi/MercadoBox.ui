// ean13.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ean13',
  standalone: true
})
export class Ean13Pipe implements PipeTransform {

  transform(value: string | number | null | undefined, validate: boolean = true, withSeparators: boolean = true): string {
    if (value == null) return '';
    const digits = value.toString().replace(/\D/g, '');

    if (digits.length !== 13) return value.toString();

    if (validate && !this.isValidEan13(digits)) {
      return value.toString();
    }

    if (!withSeparators) return digits;

    return `${digits.slice(0,3)} ${digits.slice(3,7)} ${digits.slice(7,12)} ${digits.slice(12)}`;
  }

  private isValidEan13(d: string): boolean {

    const base = d.slice(0, 12).split('').map(n => +n);
    const check = +d[12];

    const sum = base.reduce((acc, curr, idx) => acc + curr * (idx % 2 === 0 ? 1 : 3), 0);
    const dv = (10 - (sum % 10)) % 10;

    return dv === check;
  }
}
