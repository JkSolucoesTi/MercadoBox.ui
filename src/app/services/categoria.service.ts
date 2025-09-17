import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiUrlHelper } from "../core/helpers/api-url.helper";
import { API_CONFIG } from "../core/config/api.config";
import { CategoriaResponse } from "../model/Dto/response/categoriaResponse";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CategoriaService {

    private apiUrl = ApiUrlHelper.getUrl(API_CONFIG.endpoints.categorias)

    constructor(private http: HttpClient) { }

    listar(): Observable<CategoriaResponse[]> {
        return this.http.get<CategoriaResponse[]>(`${this.apiUrl}/GetAll`);
    }
}