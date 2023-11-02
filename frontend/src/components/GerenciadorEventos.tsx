import React, { useState, useEffect } from "react";
import "../styles/GerenciadorEventos.css";
import axios from "axios";
import Select, { ActionMeta, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const authToken = localStorage.getItem("token");

// Função para converter o caminho da imagem
function convertImageURL(imageURL: string) {
  const match = imageURL.match(/\/d\/(.+?)\//);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?id=${fileId}`;
  }
  return imageURL;
}

function GerenciadorEventos() {
  const [evento, setEvento] = useState({
    NomeEvento: "",
    DataInicio: "",
    DataFim: "",
    HoraInicio: "",
    HoraFim: "",
    LocalizacaoEvento: "",
    DescricaoEvento: "",
    CaminhoImagem: "",
    TipoEvento: "",
    IDServicoComunitario: [] as number[],
    Destaque: "", 
  });

  const [errors, setErrors] = useState({
    NomeEvento: "",
    DataInicio: "",
    DataFim: "",
    HoraInicio: "",
    HoraFim: "",
    LocalizacaoEvento: "",
    DescricaoEvento: "",
    TipoEvento: "",
    IDServicoComunitario: "",
  });

  const today = moment();
  const [servicosComunitariosOptions, setServicosComunitariosOptions] =
    useState([]);
  const [selectedServicosComunitarios, setSelectedServicosComunitarios] =
    useState([] as MultiValue<any>);
  const navigate = useNavigate();

  const fetchServicosComunitarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/role/niveis-abaixode5",
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const options = response.data.map((servicoComunitario: any) => ({
        value: servicoComunitario.ServicoComunitarioID,
        label: servicoComunitario.nomeServicoComunitario,
      }));
      setServicosComunitariosOptions(options);
    } catch (error) {
      console.error("Erro ao buscar serviços comunitários:", error);
    }
  };

  useEffect(() => {
    fetchServicosComunitarios();
  }, []);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "CaminhoImagem") {
      const convertedImagePath = convertImageURL(value);
      setEvento({ ...evento, [name]: convertedImagePath });
    } else {
      setEvento({ ...evento, [name]: value });
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleDateChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: moment(value).format("YYYY-MM-DD") });
  };

  const handleTimeChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: moment(value, "HH:mm").format("HH:mm") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { ...errors };

    if (!evento.NomeEvento) {
      newErrors.NomeEvento = "O campo Nome do Evento é obrigatório.";
    } else {
      newErrors.NomeEvento = "";
    }

    if (moment(evento.DataInicio).isBefore(today, "day")) {
      newErrors.DataInicio = "A Data de Início não pode ser anterior à data atual.";
    } else {
      newErrors.DataInicio = "";
    }

    if (moment(evento.DataFim).isBefore(evento.DataInicio, "day")) {
      newErrors.DataFim = "A Data de Fim não pode ser anterior à Data de Início.";
    } else {
      newErrors.DataFim = "";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      try {
        const response = await axios.post(
          "http://localhost:3001/eventos/criar",
          evento,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
    
        if (response.status === 201) {
          console.log("O evento foi criado com sucesso:", response.data);
          navigate("/pagina-principal-paroquia");
        } else {
          console.error("Ocorreu um erro ao criar o evento:", response.data);
          alert("Houve um problema ao criar o evento. Por favor, tente novamente.");
        }
      } catch (error) {
        console.error("Ocorreu um erro ao criar o evento:", error);
        alert("Houve um problema ao criar o evento. Por favor, tente novamente.");
      }
    }
  };

  return (
    <div className="EventosWrapper">
      <div className="EventosContainer">
        <div className="Container-form">
          <h2>Criar um Novo Evento</h2>
          <form className="criar-evento-form" onSubmit={handleSubmit}>
            <div>
              <label>Nome do Evento:</label>
              {errors.NomeEvento && (
                <span className="error">{errors.NomeEvento}</span>
              )}
              <input
                type="text"
                name="NomeEvento"
                placeholder="insira um nome para evento"
                value={evento.NomeEvento}
                onChange={handleChange}
                required
              />
            </div>
            <label>Data de início e fim</label>
            {errors.DataInicio && (
              <span className="error">{errors.DataInicio}</span>
            )}
            {errors.DataFim && <span className="error">{errors.DataFim}</span>}
            <div className="data-inputs">
              <input
                type="date"
                name="DataInicio"
                value={evento.DataInicio}
                onChange={handleDateChange}
                required
              />
              <input
                type="date"
                name="DataFim"
                value={evento.DataFim}
                onChange={handleDateChange}
                required
              />
            </div>
            <label>Hora de início e fim</label>
            <div className="hora-inputs">
              <input
                type="time"
                name="HoraInicio"
                value={evento.HoraInicio}
                onChange={handleTimeChange}
                required
              />
              <input
                type="time"
                name="HoraFim"
                value={evento.HoraFim}
                onChange={handleTimeChange}
                required
              />
            </div>
            <div>
              <label>Localização do Evento:</label>
              <input
                type="text"
                name="LocalizacaoEvento"
                placeholder="exemplo: Salão Paroquial..."
                value={evento.LocalizacaoEvento}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Descrição do Evento:</label>
              <textarea
                className="descricaoEventotextarea"
                value={evento.DescricaoEvento}
                name="DescricaoEvento"
                placeholder="Insira detalhes, para melhor divulgação como instagram, roteiro"
                onChange={handleTextareaChange}
              />
            </div>
            <div>
              <label>Imagem do Evento:</label>
              <input
                type="text"
                name="CaminhoImagem"
                placeholder="Insira o endereço de sua imagem aqui!"
                value={evento.CaminhoImagem}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Tipo de Evento:</label>
              <input
                type="text"
                name="TipoEvento"
                placeholder="Catequese, excursão..."
                value={evento.TipoEvento}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Serviço Comunitário:</label>
              <Select
                options={servicosComunitariosOptions}
                value={selectedServicosComunitarios}
                onChange={(
                  newValue: MultiValue<any>,
                  actionMeta: ActionMeta<any>
                ) => {
                  if (actionMeta.action === "select-option") {
                    setSelectedServicosComunitarios(newValue);
                    setEvento({
                      ...evento,
                      IDServicoComunitario: newValue.map(
                        (option: any) => option.value
                      ),
                    });
                  } else if (actionMeta.action === "remove-value") {
                    setSelectedServicosComunitarios(newValue);
                    setEvento({
                      ...evento,
                      IDServicoComunitario: newValue.map(
                        (option: any) => option.value
                      ),
                    });
                  }
                }}
                isMulti
                placeholder="Selecione ou digite para buscar serviços comunitários"
              />
            </div>

            <div>
  <label>Deseja destacar seu evento?</label>
  <select
    name="Destaque"
    value={evento.Destaque}
    onChange={handleChange}
  >
    <option value={0}>Não</option>
    <option value={1}>Sim</option>
  </select>
</div>


            <div>
              <button type="submit">Criar Evento</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GerenciadorEventos;
