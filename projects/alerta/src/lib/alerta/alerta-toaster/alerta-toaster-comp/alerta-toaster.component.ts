import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'bb-alerta-toaster',
  templateUrl: './alerta-toaster.component.html',
  styles: [`
  .text-modal {
    font-weight: 400;
    font-size: 1rem;
  }

  .inline {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .icon-red {
    color: rgb(214, 57, 29);
  }

  .icon-green {
    color: rgb(35, 189, 53);
  }
  .icons {
    margin: 0 .5rem;
  }
  `]
})
export class AlertaToasterComponent implements OnInit {

  constructor(public toaster: MatDialogRef<AlertaToasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<any>) { }

  ngOnInit() {
    setTimeout(() => this.toaster.close(), 3000);
  }

  fecharModal() {
    this.toaster.close();
  }

  icon: any = this.data[1];

}
