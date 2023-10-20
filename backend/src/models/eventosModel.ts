interface EventosModel {
  ID: number;
  NomeEvento: string;
  DataInicio: string;
  DataFim: string;
  HoraInicio: string;
  HoraFim: string;
  LocalizacaoEvento: string;
  DescricaoEvento: string;
  CaminhoImagem: string ;
  TipoEvento: string;
  Participacao: 'Sim' | 'Talvez' | 'Não';
  Destaque: number;
  ParoquiaID: number;
}
export default EventosModel