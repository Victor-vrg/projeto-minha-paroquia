interface UsuarioModel {
    ID: number;
    NomeCompleto: string;
    Email: string;
    Telefone: string | null;
    Bairro: string | null;
    DataNascimento: string | null;
    ParoquiaMaisFrequentada: number | null;
    NivelAcesso: number;
    IDServicoComunitario: number[] | null;
    SenhaHash: string;
    Cargo: number | null;
  }
  
  export default UsuarioModel;