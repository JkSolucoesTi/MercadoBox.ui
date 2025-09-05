import { API_CONFIG } from '../config/api.config';

export class ApiUrlHelper {
  static getUrl(endpoint: string): string {
    return `${API_CONFIG.baseUrl}/${endpoint}`;
  }
}