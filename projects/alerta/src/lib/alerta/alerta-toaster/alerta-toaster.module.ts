import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertaToasterComponent } from './alerta-toaster-comp/alerta-toaster.component';



@NgModule({
  declarations: [
    AlertaToasterComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AlertaToasterModule { }
