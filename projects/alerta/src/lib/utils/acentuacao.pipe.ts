import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acentuacao'
})
export class AcentuacaoPipe implements PipeTransform {

  transform(inputValue: any, ...args: unknown[]): unknown {
    const values = ['CALCULO', 'VALIDACAO', 'PRODUCAO'];
    const tranformedValues = ['CÁLCULO', 'VALIDAÇÃO','PRODUÇÃO'];
    let result = inputValue;
    for(let [i,value] of values.entries()) {
      if(inputValue === value) result = tranformedValues[i];
    }
    return result;
  }

}
