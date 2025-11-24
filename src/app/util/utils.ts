export class Utils {

static toDateString(date: Date | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') {
      // Evita strings vazias ou inválidas
      if (date.trim().length === 0) return '';
      return date.substring(0, 10); // assume 'YYYY-MM-DD...' e corta
    }
    return date.toISOString().substring(0, 10);
  }
}