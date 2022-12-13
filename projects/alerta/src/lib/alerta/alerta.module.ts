import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTableFilterModule } from 'mat-table-filter';

import { AlertaListModule } from './alerta-list/alerta-list.module';
import { AlertaSearchModule } from './alerta-search/alerta-search.module';
import { AlertaService } from '../alerta/alerta.service';
import { AlertaComponent } from './alerta-comp/alerta.component';


@NgModule({
  declarations: [
    AlertaComponent
  ],
  imports: [
    AlertaListModule,
    AlertaSearchModule,
    CommonModule,
    MatIconModule
  ],
  exports: [
    AlertaComponent,

    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatTableExporterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatTableFilterModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [AlertaService]
})
export class AlertaModule { }
