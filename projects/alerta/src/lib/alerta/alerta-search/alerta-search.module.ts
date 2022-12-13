
import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AlertaSearchComponent } from './alerta-serch-comp/alerta-search.component';
import { UtilsModule } from '../../utils/utils.module';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule,

    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers: [
		{provide: LOCALE_ID,
		useValue: 'pt_BR'},

	],
  declarations: [AlertaSearchComponent],
  exports: [AlertaSearchComponent]
})
export class AlertaSearchModule { }
