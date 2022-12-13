import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertaToasterService } from '../alerta-toaster/alerta-toaster.service';
import { AlertaService } from '../../alerta/alerta.service';
import { Alerta } from '../../model/alerta.model';
import { Grupo } from '../../model/grupo.model';
import { Origem } from '../../model/origem.model';
import { Subject } from 'rxjs';
import { first, tap, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'bb-alerta',
  templateUrl: './alerta.component.html',
  styles: [`
    .content {
      margin: 0;
      padding: 0 2rem;
      flex-direction: column;
      align-items: center;
      position:relative;
    }

  `]
})
export class AlertaComponent implements OnInit {

  @Input() grupoFixo: string = '';
  @Input() origemFixa: string = '';
  @Input() selectedGrupo: string = '';
  @Input() selectedOrigem: string = '';
  @Input() grupoTitle: boolean = true;

  data$: Subject<Alerta[]> = new Subject<Alerta[]>();
  buscaNav$: Subject<string> = new Subject<string>();
  loading$: Subject<string> = new Subject<string>();

  listData!: Alerta[] | null;
  grupos?: Grupo[];
  origens?: Origem[];
  excluindo: string = 'normal';

  constructor(
    private alertaService : AlertaService,
    private toasterService: AlertaToasterService,
    ) { }

  ngOnInit(): void {
    this.grupoFixo = this.removeAcento(this.grupoFixo);
    this.origemFixa = this.removeAcento(this.origemFixa);
    this.selectedGrupo = this.grupoFixo;
    this.selectedOrigem = this.origemFixa;
    this.getGrupos();
    this.getOrigens();

  }

  removeAcento (texto: string) {
    texto = texto.toLowerCase()
    .replace(/[ÁÀÂÃ]/gi, 'a')
    .replace(/[ÉÈÊ]/gi, 'e')
    .replace(/[ÍÌÎ]/gi, 'i')
    .replace(/[ÓÒÔÕ]/gi, 'o')
    .replace(/[ÚÙÛ]/gi, 'u')
    .replace(/[Ç]/gi, 'c')
    return texto.toUpperCase();
  }

  getListaAoCarregar() {
    const params = this.alertaService.getParams(this.selectedGrupo, this.selectedOrigem);

    this.alertaService.listarAlertas(params).pipe(first())
    .subscribe((lista: Alerta[]) => {
      this.listData = lista;
      this.data$.next(lista);
      console.log(this.listData);
    },
    (error) => {
     this.toasterService.showErrorMsg('Erro ao carregar alertas. Tente novamente mais tarde.');
    })
  }

  validarData(dataForm: FormGroup) {
    if (dataForm.valueChanges && dataForm.valid) {
      return { dataInicial: dataForm.value.start, dataFinal: dataForm.value.end };
    } else return undefined;

  }

  getAlertas(mudando: 'grupo' | 'origem', evento: string){
    this.selectedGrupo = mudando === 'grupo' ? evento : this.selectedGrupo;
    this.selectedOrigem = mudando === 'origem' ? evento : this.selectedOrigem;
    let params: any;

    if (this.origemFixa || mudando === 'origem') {
      this.getListaAoCarregar();
    } else {
      this.loading$.next('origens carregando');

      this.alertaService.getOrigensDeGrupos(this.selectedGrupo).pipe(first(),
        map(res => {
          this.loading$.next('origens finalizado');
          this.origens = res;
          this.validarOrigemPorGrupoSelecionado();

        }),
        switchMap(res => {
          params = this.alertaService.getParams(this.selectedGrupo, this.selectedOrigem);
          return this.alertaService.listarAlertas(params)
        }),
        map(res => {
          this.listData = res;
          this.data$.next(res);
        }))
        .subscribe(
          res => { console.log('Alerta carregado!')},
          (error) => {
            this.toasterService.showErrorMsg('Erro ao carregar alertas. Tente novamente mais tarde.');
          }
      )
    }
  }

  resetBusca() {
    if (!(this.origemFixa && this.grupoFixo)) {
      this.selectedOrigem = this.origemFixa ?  this.origemFixa : '';
      this.selectedGrupo =  this.grupoFixo ?  this.grupoFixo : '';

    const params = this.alertaService.getParams(this.selectedGrupo, this.selectedOrigem);
    this.alertaService.listarAlertas(params).pipe(first(),
    tap( _ => {
      if( !(this.origemFixa || this.grupoFixo)) {
        this.getOrigens();
        console.log('pegou origens');
      }
    })
    )
      .subscribe(res => {
        this.listData = res;
        this.data$.next(res);
        console.log(this.selectedOrigem, this.selectedGrupo);
      },
        (error) => this.toasterService.showErrorMsg('Erro ao listar alertas. Tente novamente mais tarde.')
      )
    }
  }

  getGrupos(){
    this.loading$.next('grupos carregando');
    this.alertaService.getGrupos()
      .pipe(first())
      .subscribe(
        res => {
          this.loading$.next('grupos finalizado');
          this.grupos = res;
          this.getListaAoCarregar();
        },
        (error) => {
          this.loading$.next('grupos finalizado');
          this.data$.next([]);
          this.toasterService.showErrorMsg('Erro ao carregar grupos. Tente novamente mais tarde.');
        }
      );
  }

  validarOrigemPorGrupoSelecionado() {

      console.log(this.origens);
      const origemSelecionadaExiste = this.origens?.filter(origem => {
        return origem.nome === this.selectedOrigem
      })
      console.log(origemSelecionadaExiste);
      console.log(this.selectedOrigem);
      this.selectedOrigem = origemSelecionadaExiste?.length === 0 ? '' : this.selectedOrigem ;
  }

  getOrigens(){
    this.loading$.next('origens carregando');
    const origensList = this.selectedGrupo === '' ?
      this.alertaService.getOrigensTodas().pipe(first()) :
      this.alertaService.getOrigensDeGrupos(this.selectedGrupo).pipe(first());
    origensList.subscribe(
          res => {
            this.loading$.next('origens finalizado');
            this.origens = res;
            this.validarOrigemPorGrupoSelecionado();
          },
          error => {
            this.toasterService.showErrorMsg('Erro ao carregar origens. Tente novamente mais tarde.');
            this.loading$.next('origens finalizado');
          }
        )
  }

  removeAlerta(alertas: Alerta[], alerta : Alerta){
    alertas.splice(alertas.indexOf(alerta), 1);
    this.listData = alertas;
    this.data$.next(alertas);
  }


  excluirAlerta(alerta: Alerta) {
    this.excluindo = 'excluindo';
    this.alertaService.excluirAlerta(alerta.id)
      .pipe(first())
      .subscribe(
        r => {
          this.removeAlerta(this.listData!, alerta);
          this.excluindo = 'normal';
          console.log('excluiu!');
        },
        (error) => {
          this.excluindo = 'normal';
          this.toasterService.showErrorMsg('Erro ao excluir alerta. Tente novamente mais tarde.');
        }
      );
  }

  mudaSituacao(alerta: Alerta) {
    this.alertaService.porSituacaoSpinner(alerta);
    alerta.situacao === 'EM_ANALISE' ? alerta.situacao = 'ABERTO' : alerta.situacao = 'EM_ANALISE';
    this.alertaService.atualizaAlerta(alerta).pipe(first())
      .subscribe((res: any) => {

      this.alertaService.retirarSituacaoSpinner(alerta);
      },
      (error) =>{
        alerta.situacao === 'EM_ANALISE' ? alerta.situacao = 'ABERTO' : alerta.situacao = 'EM_ANALISE';
        this.alertaService.retirarSituacaoSpinner(alerta);
        this.toasterService.showErrorMsg('Erro ao tentar mudar situacao. Tente novamente mais tarde.');
      }
    )

  }
}
