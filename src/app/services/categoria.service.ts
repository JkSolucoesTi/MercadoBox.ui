import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiUrlHelper } from "../core/helpers/api-url.helper";
import { API_CONFIG } from "../core/config/api.config";
import { CategoriaResponse } from "../model/Dto/response/categoriaResponse";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/apiResponse/apiResponse";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class CategoriaService {

    private controller : string = "Categorias";

    constructor(private http: HttpClient) { }

    listar(): Observable<ApiResponse<CategoriaResponse[]>> {
        return this.http.get<ApiResponse<CategoriaResponse[]>>(`${environment.apiUrl}/${this.controller}/GetAll`);
    }
}