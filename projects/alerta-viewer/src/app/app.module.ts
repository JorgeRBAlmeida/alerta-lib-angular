import { LOCALE_ID, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { AlertaModule, AlertaToasterComponent, AlertaToasterModule } from '@bbdtvm/alerta';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AlertaModule,
    AlertaToasterModule,
    BrowserModule,
    MatDialogModule,
  ],
  providers: [
    {provide: LOCALE_ID,
      useValue: 'pt_BR'},
      {provide: 'environment',
      useValue: environment}
  ],
  entryComponents: [AlertaToasterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
