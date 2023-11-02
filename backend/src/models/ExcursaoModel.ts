export default interface ExcursaoModel {
    ID: number;
    NomeExcursao: string;
    DataInicioExcursao: string;
    DataFimExcursao: string;
    HoraInicioExcursao: string;
    HoraFimExcursao: string;
    LocalizacaoExcursao: string;
    DescricaoExcursao: string;
    CaminhoImagem: string;
    PrecoExcursao: number;
    VagasExcursao: number;
    ParoquiaID: number;
    Ocultar: number;
    Destaque: number;
  }
  