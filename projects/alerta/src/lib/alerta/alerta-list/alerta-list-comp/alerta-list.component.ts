import { animate, style, transition, trigger } from '@angular/animations';
import { registerLocaleData } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { Observable, Subscription } from 'rxjs';
import localePt from '@angular/common/locales/pt';

import { Alerta } from '../../../model/alerta.model';
import { Grupo } from '../../../model/grupo.model';
import { Origem } from '../../../model/origem.model';

registerLocaleData(localePt);

@Component({
  selector: 'bb-alerta-list',
  templateUrl: './alerta-list.component.html',
  styles: [`
    .container {
      width: 100%;
      padding: 0;
      margin-top: 2rem;
      padding-bottom: 1rem;
    }

    .alerta-list {
      overflow-x: auto;
    }
    /*------------------------------------------------------ HEADERS -------------------------------------------------*/

    .header-table {
      width: 100%;
      margin-right: auto;
      font-weight: 500;
      font-size: 1.6rem;
    }

    /*------------------------------------------------------ SECTIONS -------------------------------------------------*/

    .filtros {
      width: 100%;
      display: flex;
      align-items: center;
      /* background-color: #f6f6f6; */
      background-color: #fff;
      /* border-top: 1px solid #c6c6c6; */
      height: 6rem;
      position: relative;
      overflow: hidden;
    }

    .filtros> *:not(:first-child) {
      margin-left: .7rem;
    }

    .form-filtro {
      height: 4rem;
      width: 20%;
      font-size: 1rem;
    }

    .mat-card {
      padding: 0;
    }

    /*------------------------------------------------------ BUTTONS -------------------------------------------------*/

    .btn {
      /* border: 1px solid hsl(0, 0%, 80%); */
      border: none;
      color: hsl(0, 0%, 39%);
      position: relative;
      cursor: pointer;
      overflow: hidden;
      border-radius: 2rem;
      align-self: stretch;
      min-width: fit-content;
      font-weight: bold;
    }

    .btn > * {
      display: inline-block;
      width: 8rem;
    }

    .btn__visible {
      padding: .5rem 1rem;
      position: relative;
    }

    .btn--export {
      margin: 1.2rem .7rem 1rem 0;
      background-color: transparent;
      align-self: center;
      text-align-last: inherit;
      padding: 1.8rem;
      position: relative;
    }

    .btn--show-hide {
      position: absolute;
      left: 48%;
      top: -1.7rem;
      z-index: 10;
    }

    .btn--show-hide .mat-icon {
      margin-top: .5rem;
    }

    .btn .btn__situacao {
      background-color: hsl(0, 0, 70%);
    }

    .mat-row:hover .mat-cell .btn__situacao:hover {
      background-color: hsl(0, 0%, 60%);
      color: hsl(0, 100%, 100%);
    }

    .btn__situacao--em-analise {
      background-color: hsl(60, 97%, 80%);
      color: hsl(60, 97%, 20%);
    }

    .btn .btn__situacao .btn__situacao--em-analise:hover {
      background-color: hsl(60, 97%, 60%);
      color: hsl(60, 97%, 10%);
    }

    .mat-row:hover .mat-cell .btn__situacao--em-analise:hover {
      background-color: hsl(60, 97%, 50%);
      color: hsl(60, 97%, 20%);
    }

    .btn--export .mat-icon {
      font-size: 2rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-65%, -40%);

    }

    /*------------------------------------------------------ TABLE -------------------------------------------------*/
    table {
      width: 100%;
    }

    .column-origem {
      font-weight: 600;
      color: hsl(0, 0%, 40%);
    }

    .column-data {
      font-style: italic;
      color: hsl(0, 0%, 40%);
    }

    .mat-column-mensagem {
      color: hsl(0, 0%, 40%);
    }

    .situacao-header {
      margin-left: 3rem;
    }

    .mat-header-cell:not(:last-child) {
      color: rgba(0, 0, 0, 0.7);
      min-width: 8rem;
    }

    td.mat-cell {
      padding: .5rem 0;
    }

    .mat-row .mat-cell {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .mat-row:hover .mat-cell {
      border-color: rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.03);
    }

    .icon-delete .mat-icon:hover {
      color: #D50000 !important;
    }

    .icon-delete .mat-icon {
      color: hsl(0, 0%, 40%) !important;
    }

    .mat-footer-row .mat-footer-cell {
      text-align: center;
      font-style: italic;
    }

    .em-analise {

      position: relative;
      margin: 0;
    }

    .em-analise::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 98%;
      background-color: hsl(60, 97%, 59%);
    }

    .barra-excluir {
      position: relative;
      width: 100%;
      background-color: hsla(349, 75%, 45%, 0.111);
      border: 1px solid hsla(349, 75%, 45%, 0.111);
      transition: all 1s;
    }

    .barra-excluir::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5%;
      background-color: hsl(349, 75%, 45%);
      animation: slide-in 1s;
      transform-origin: left;
    }

    @keyframes slide-in {
      0% { transform: scaleX(0%) };
      100% { transform: scaleX(100%) };
    }

    .rowgroup {
      overflow: hidden;
    }


    /*------------------------------------------------------ OTHERS -------------------------------------------------*/

    .divider {
      border-bottom: 1px solid #c6c6c6;
      margin: 0;
      padding: 0%;
    }

    .hide {
      display: none;
    }

    .spinner--situacao {
      position: absolute;
      top: .5rem;
      left: .5rem;
    }

    /*------------------------------------------------------ SCROLLBAR -------------------------------------------------*/

    /* width */
    ::-webkit-scrollbar {
      width: .2rem;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #f4f4f4;
      border-radius: 1rem;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #e2e2e2;
    }

  `],
  animations: [
    trigger('fadeOutAnimation', [
      transition('excluindo => void', [
        style({opacity: 1, height: '*', transform: 'translateX(0%)'}),
        animate('.5s ease-out', style({ opacity: 0, height: '0', transform: 'translateX(-20%)' }))
      ])
    ])
  ]
})
export class AlertaListComponent implements OnInit, OnDestroy {

  @Input() data$!: Observable<Alerta[]>;

  @Input() grupos?: Grupo[] ;
  @Input() origens?: Origem[] ;
  @Input() selectedGrupo: string = '';
  @Input() selectedOrigem: string = '';
  @Input() grupoTitle: boolean = true;
  @Input() origemFixa: string = '';
  @Input() excluindo: string = 'normal';

  displayedColumns: string[] = [ 'origem', 'tipo', 'mensagem', 'situacao', 'acao'];
  exportColumns: number[] = [13, 15, 30, 80, 13];

  filterEntity: Alerta = new Alerta;
  filterType: MatTableFilter = MatTableFilter.ANYWHERE;

  @Output() remover = new EventEmitter<Alerta>();
  @Output() atualizar = new EventEmitter<Alerta>();
  @Output() toggleBusca = new EventEmitter<string>();

  @ViewChild(MatSort) sort!: MatSort;

  btnToggle: string = 'more';
  listData!: MatTableDataSource<Alerta>;
  excluindoRow = new Set();
  progresso: number = 0;
  private dataSub!: Subscription;

  ngOnInit() {
    this.inicializarDadosTabela();
    this.displayedColumns = this.dinamizarColunaOrigem(this.displayedColumns);
    this.exportColumns = this.dinamizarColunaOrigem(this.exportColumns);
    this.getEstadoInicialBusca();
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

  inicializarDadosTabela() {
    this.dataSub = this.data$.subscribe( data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      console.log(data);
    })
  }

  dinamizarColunaOrigem(arrayComOrigem: Array<any>) {
    const arraySemOrigem = [... arrayComOrigem];
    arraySemOrigem.splice(1, 1);
    return this.origemFixa != ''? arraySemOrigem : arrayComOrigem;
  }

  getEstadoInicialBusca() {
    this.btnToggle = (this.selectedGrupo === '') && (this.selectedOrigem === '') ? 'less' : 'more';
    this.toggleBusca.emit(this.btnToggle);
  }

  mudarBusca() {
    this.btnToggle = this.btnToggle === 'more' ? 'less' : 'more';
    this.toggleBusca.emit(this.btnToggle);
  }

  holdHandler(row: any, e: number) {
    this.excluindoRow.add(row);
    if( e > 1000 || e === 0 ) this.excluindoRow.delete(row);
  }

  excluirAlerta(e: number, alerta: Alerta){
    this.holdHandler(alerta, e);
    this.progresso = e / 10;
    if(this.progresso === 100) {
      this.progresso = 0;
      console.log(alerta);
      this.remover.emit(alerta);
    }

  }

}
