export type StatusVegetacao = 'normal' | 'atencao' | 'corte_necessario';
export type TipoVegetacao = 'grama_baixa' | 'grama_densa' | 'capim_alto';
export type PerfilUsuario = 'operador' | 'supervisor' | 'gestor';
export type CondicaoClima = 'seco' | 'chuva_moderada' | 'chuva_recente' | 'muito_umido';
export type StatusColeta = 'em_andamento' | 'concluida' | 'pendente';
export type StatusCronograma = 'planejado' | 'em_execucao' | 'concluido';
export type TipoAlerta = 'limite_atingido' | 'previsao_critica' | 'reincidencia';

export interface MedicaoHistorica {
  data: string;
  altura: number;
  status: StatusVegetacao;
}

export interface ClimaSimulado {
  condicao: CondicaoClima;
  temperatura: number;
  fatorCrescimento: number;
  descricao: string;
}

export interface Trecho {
  id: string;
  rodovia: string;
  nomeRodovia: string;
  kmInicial: number;
  kmFinal: number;
  sentido: 'Norte' | 'Sul' | 'Leste' | 'Oeste';
  alturaAtual: number;
  status: StatusVegetacao;
  tipoVegetacao: TipoVegetacao;
  ultimaColeta: string;
  previsaoCorte: string;
  diasAte30cm: number;
  historico: MedicaoHistorica[];
  clima: ClimaSimulado;
  coordenadas: { lat: number; lng: number };
  observacoes?: string;
  programadoParaCorte?: boolean;
}

export interface Coleta {
  id: string;
  ciclo: number;
  anoMes: string;
  rodovia: string;
  nomeRodovia: string;
  sentido: string;
  kmInicial: number;
  kmFinal: number;
  dataInicio: string;
  dataFim: string | null;
  status: StatusColeta;
  operador: string;
  trechosColetados: string[];
  totalTrechos: number;
  coberturaPercent: number;
}

export interface CronogramaItem {
  id: string;
  trechoId: string;
  equipe: string;
  diaSemana: string;
  dataPlaneada: string;
  status: StatusCronograma;
  prioridade: number;
}

export interface Alerta {
  id: string;
  trechoId: string;
  tipo: TipoAlerta;
  mensagem: string;
  data: string;
  lido: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  rodoviaResponsavel?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Detalhe: { trechoId: string };
  Coleta: { coletaId: string };
  Analise: { trechoId: string };
  Previsao: { trechoId: string };
  Agendamento: { trechoId: string };
  Confirmacao: { trechoId: string; equipe: string; dataPlaneada: string };
  Relatorios: undefined;
};

export type MainTabParamList = {
  DashboardTab: undefined;
  MapaTab: undefined;
  RankingTab: undefined;
  CronogramaTab: undefined;
};
