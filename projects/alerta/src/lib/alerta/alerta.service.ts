import { Grupo } from './../model/grupo.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Alerta, AlertaPut } from '../model/alerta.model';

enum SituacaoAlerta { ABERTO, EM_ANALISE }

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  constructor(private http: HttpClient, @Inject('environment') private env: any) { }

  getParams( grupo: string | undefined, origem?: string): any {
    let params: any = {};

    if (grupo) {
      params['grupo'] = grupo;
    }
    if (origem) {
      params['origem'] = origem;
    }
    return params;
  }

  listarAlertas(params?: any): Observable<Alerta[]> {
    const httpOptions = {
      params: new HttpParams({ fromObject: params })
    };
    console.log(params);
    let url = `${this.env.apiAlerta}/alertas`;
		return this.http.get<Alerta[]>(url, httpOptions )
	}

  excluirAlerta(id: any): Observable<Alerta> {
    const url = `${this.env.apiAlerta}/alertas/${id}`;
    return this.http.delete<Alerta>(url);
	}

  getGrupos( ): Observable<Grupo[]> {
    const url = `${this.env.apiAlerta}/grupos`;
		return this.http.get<Grupo[]>(url);
	}

  getOrigensTodas( ): Observable<any[]> {
    const url = `${this.env.apiAlerta}/origens`;
		return this.http.get<any[]>(url);
	}

  getOrigensDeGrupos(grupo: string): Observable<any[]> {
    const url = `${this.env.apiAlerta}/grupos/origens/`;
		return this.http.get<any>(url).pipe(
      tap(res => console.log(res[grupo])),
      switchMap( res =>[ res[grupo]])
    );
	}

  atualizaAlerta(alerta: Alerta): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' },
      ),
    }
    /* const body = SituacaoAlerta[alerta.situacao]; */
    const body: AlertaPut = {
        id : alerta.id!,
        dataRegistro : alerta.dataRegistro!,
        tipo : alerta.tipo!,
        status : alerta.situacao === 'ABERTO' ? null : 1,
        mensagem: alerta.mensagem!,
        origem: alerta.origem!
    };

    const url = `${this.env.apiAlerta}/alertas/${alerta.id}`;
    return this.http.put<any>(url, body, httpOptions)
	}

  porSituacaoSpinner(alerta: Alerta) {
    alerta.situacaoLoading = alerta.situacao === 'EM_ANALISE' ? 'LOADING' : 'LOADING2';
  }

  retirarSituacaoSpinner(alerta: Alerta) {
    console.log(alerta.situacao);
    alerta.situacaoLoading = undefined;
    return alerta;
  }

}
