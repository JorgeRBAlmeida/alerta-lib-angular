export class Alerta
{
    id?: string;
    dataRegistro?: string;
    tipo?: string;
    mensagem?:  string;
    status: number = 0;
    situacao!: 'ABERTO' | 'EM_ANALISE'
    origem?: string;
    situacaoLoading?: 'LOADING' | 'LOADING2'
  }

export interface AlertaPut
{
    id: string;
    dataRegistro: string;
    tipo: string;
    status: 1 | null;
    mensagem:  string;
    origem: string;
  }
