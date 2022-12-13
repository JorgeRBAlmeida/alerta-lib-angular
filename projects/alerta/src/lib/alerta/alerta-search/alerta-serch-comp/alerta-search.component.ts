import { AlertaService } from '../../../alerta/alerta.service';
import { Origem } from '../../../model/origem.model';
import { Grupo } from '../../../model/grupo.model';

import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

import { animate, group, query, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'bb-alerta-search',
  templateUrl: './alerta-search.component.html',
  styles: [`
    .header-secondary {
      width: 100%;
      margin-right: auto;
      font-weight: 500;
      margin-bottom: 20rem;
    }
    .busca__bg-icon {
      position: relative;
      margin: 0 15rem 15rem -5rem;
    }

    .select-placeholder-container {
      display: flex;
      align-items: center;
    }

    .select-placeholder-container > span {
      flex: 1;
    }

    .busca__bg-icon > * {
      font-size: 18rem;
      color: hsla(100, 100%, 100%, 0.07);
      transform: rotateZ(-15deg);
      position: absolute;
      padding: 0;
    }

    .busca {
      width: 100%;
      padding: 0;
      align-items: flex-start;
      display: flex;
      flex-wrap: wrap;

    }

    .busca__toolbar {
      height: 8rem;
      justify-content:space-around;
      border-radius: .9rem;
      margin: 3rem 0 -4.6rem 0;
      font-size: 1rem;
      position: relative;
      overflow: hidden;
    }

    .mb-hide {
      margin-bottom: -10rem;
    }

    .btn {
      border: 1px solid hsl(0, 0%, 53%);
      color: #fff;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      background-color: #212121;
      border-radius: .25rem;
      min-width: fit-content;
    }

    .btn > * {
      display: inline-block;
      width: 8rem;
    }

    .btn:hover {
      background-color: #f1f1f1;
      color: #212121;
    }

    .btn--reset .mat-icon {
        font-size: 2rem;
        color: #a3afff;
        width: fit-content;
        vertical-align: baseline;
      }

    .btn--reset .mat-icon:hover {
      color: #fff;
    }

    /* MAT FORM DARK BG */

    ::ng-deep .mat-datepicker-toggle-default-icon {
      color: #d1d1d1;
    }

    ::ng-deep .mat-form-field-appearance-fill .mat-form-field-flex:not(:disabled) {
      background-color: hsla(0,0%,100%,.1);

    }

    ::ng-deep .mat-form-field-appearance-fill .mat-form-field-flex :disabled {
      background-color: hsla(0,0%,60%,.1) !important;
    }

    ::ng-deep.mat-form-field-underline {
    /*change color of underline*/
    background-color: #d1d1d1 !important;
    }

    ::ng-deep .mat-form-field-ripple {
    /*change color of underline when focused*/
    background-color: hsl(60, 97%, 59%) !important;
    }

    ::ng-deep .mat-form-field .mat-select .mat-select-arrow {
    color: #d1d1d1;
    }
    ::ng-deep .mat-form-field-appearance-fill.mat-form-field-disabled .mat-form-field-label, .mat-form-field-appearance-fill.mat-form-field-disabled, .mat-form-field .mat-select.mat-select-disabled .mat-select-arrow {
    color: #404040;
    }

    .hide {
    display: none;
    }

    .invisible {
    opacity: 0;
    }

        /*------------------------------------------------------ SCROLLBAR -------------------------------------------------*/

    /* width */
    ::ng-deep ::-webkit-scrollbar {
      width: .5rem;
    }

    /* Track */
    ::ng-deep ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Handle */
    ::ng-deep ::-webkit-scrollbar-thumb {
      background: #e2e2e2;
      border-radius: 1rem;
    }

    /* Handle on hover */
    ::ng-deep ::-webkit-scrollbar-thumb:hover {
      background: #d4d4d4;
    }

  `],
  animations: [
    trigger('toggleAnimation', [
      state('false', style({marginBottom: '3.4rem'})),
      state('true', style({marginBottom: '-4.9rem'})),
      transition('true => false', [
        query('.busca__toolbar', style({ marginBottom: '*',  })),
        query('.busca__bg-icon', style({marginLeft: '-15rem', opacity: 0 })),
          group([
                  query('.busca__toolbar', animate('.3s ease-out', style( { marginBottom: '1.5rem' } ) ) ),
                  query('.busca__bg-icon', animate('.3s ease-out', style( { marginLeft: '*', opacity: 1 } ) ) )
          ]),
      ]),
      transition('false => true', [
        query('.busca__toolbar', style({ marginBottom: '*' })),
        query('.busca__bg-icon', style({marginLeft: '*', opacity: 1 })),
          group([
                  query('.busca__toolbar', animate('.3s ease-in', style( { marginBottom: '-12rem' } ) ) ),
                  query('.busca__bg-icon', animate('.3s ease-out', style( { marginLeft: '-15rem', opacity: 0 } ) ) )
          ]),
      ]),
      transition(':leave', [
        query('.busca__bg-icon', style({marginLeft: '*'})),
                  query('.busca__bg-icon', animate('.3s ease-out', style( { marginLeft: '-15rem'} ) ) )
      ])
    ])
  ]
})
export class AlertaSearchComponent implements OnInit, OnDestroy {

  @Input() buscaNav$!: Observable<string>;
  @Input() isLoading$!: Observable<string>;

  @Input() selectedGrupo: string = '';
  @Input() selectedOrigem: string = '';
  @Input() grupos?: Grupo[];
  @Input() origens?: Origem[];

  @Input() grupoFixo: string = '';
  @Input() origemFixa: string = '';

  isLoadingGrupos: boolean = true;
  isLoadingOrigens: boolean = true;
  semBusca: boolean = false;
  anime2: boolean = true;
  gruposDeOrigemGerado: boolean = false;
  private buscaSub = new Subscription;
  private loadingSub = new Subscription;

  @Output() buscarGrupo = new EventEmitter<string>();
  @Output() buscarOrigem = new EventEmitter<string>();
  @Output() reset = new EventEmitter<any>();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  })

  constructor(private alertaWebService: AlertaService) {}

  ngOnInit() {
    this.mostrarOcultarBusca();
    this.carregandoSpinner();
  }

  ngOnDestroy() {
    this.buscaSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }

  mostrarOcultarBusca() {
    this.buscaSub = this.buscaNav$.subscribe( res => {
      this.semBusca = res === 'more' ? false : true;
      this.anime2 = res === 'more' ? false : true;
      if(!this.gruposDeOrigemGerado) this.getGruposDeOrigem();
    })
  }

  carregandoSpinner() {
    this.loadingSub = this.isLoading$.subscribe( res => {
      switch (res) {
        case 'grupos carregando' :
          this.isLoadingGrupos = true;
          break;
        case 'grupos finalizado' :
          this.isLoadingGrupos = false;
          break;
        case 'origens carregando' :
          this.isLoadingOrigens = true;
          break;
        case 'origens finalizado' :
          this.isLoadingOrigens = false;
          break;
        default:
          this.isLoadingGrupos = false;
          this.isLoadingOrigens = false;
      }
    })
  }

  getGruposDeOrigem() {
    if (this.origemFixa && !this.grupoFixo && this.grupos) {
      this.isLoadingGrupos = true;
      const grupos = [...this.grupos];
      let gruposDaOrigem: Grupo[] = [];

      this.filtrarGruposDeOrigem(grupos, gruposDaOrigem);

      this.grupos = gruposDaOrigem;
      this.gruposDeOrigemGerado = true;
      this.isLoadingGrupos = false;
      console.log(grupos);
    }
  }

  private filtrarGruposDeOrigem(grupos: Grupo[], gruposDeFiltrados: Grupo[]) {
    for (let grupo of grupos) {
      this.alertaWebService.getOrigensDeGrupos(grupo.nome).subscribe(
        objetosGrupos => {
          for(let obj of objetosGrupos) {
            console.log(obj);
            console.log(this.origemFixa);
            if (obj.nome === this.origemFixa) gruposDeFiltrados.push(grupo);
          }
        }
      )
    }
  }

}
