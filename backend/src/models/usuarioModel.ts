interface UsuarioModel {
    ID: number;
    NomeCompleto: string;
    Email: string;
    Telefone: string | null;
    Bairro: string | null;
    DataNascimento: string | null;
    ParoquiaMaisFrequentada: number | null;
    IDServicoComunitario: number[] | null;
    SenhaHash: string;
  }
  
  export default UsuarioModel;