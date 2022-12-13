import { NgModule } from '@angular/core';
import { AcentuacaoPipe } from './acentuacao.pipe';
import { HoldableDirective } from './holdable.directive';

@NgModule({
  declarations: [
    AcentuacaoPipe,
    HoldableDirective
  ],
  exports: [
    AcentuacaoPipe,
    HoldableDirective
  ],
})
export class UtilsModule { }
