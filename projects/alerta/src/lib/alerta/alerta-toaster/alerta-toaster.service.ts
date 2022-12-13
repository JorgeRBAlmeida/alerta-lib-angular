import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertaToasterComponent } from './alerta-toaster-comp/alerta-toaster.component';

@Injectable({
  providedIn: 'root'
})
export class AlertaToasterService {
  positions: number[] = [];
  dialogRef?: MatDialogRef<any>;

  constructor(public toaster: MatDialog) { }

  showErrorMsg(mensagem: string) {
    this.toaster.open(AlertaToasterComponent, {
      width: 'fit-content',
      data: [mensagem, 1],
      position: {top: '7rem'}
    });

  }

  showSuccessMsg(mensagem: string) {
    this.positions.push(8);
    const positionScreen = this.positions.reduce((positionScreen, i) => positionScreen + i);
    this.dialogRef = this.toaster.open(AlertaToasterComponent, {
      width: 'fit-content',
      data: [mensagem, 2],
      hasBackdrop: false,
      position: { top: positionScreen +'rem'}
    });
    this.positionOnClose();
  }

  private positionOnClose() {
    this.dialogRef?.afterClosed().pipe(take(1)).subscribe(result => {
      this.positions = [];
    })
    this.toaster.afterAllClosed.pipe(take(1)).subscribe(result => {
      this.positions = [];
    })
  }


}

