import { useEffect, useReducer, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./PrestacaoSystem.css";

/*
 Estado unificado via reducer para evitar atualizações desincronizadas:
 state = { receitas: [], despesas: [] }
 actions: ADD, EDIT, REMOVE
*/

function uid() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

const initialState = { receitas: [], despesas: [] };

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return {
        receitas: action.payload.receitas || [],
        despesas: action.payload.despesas || [],
      };
    }

    case "ADD": {
      const item = action.payload; // já possui id e tipo
      if (item.tipo === "receita") {
        return { ...state, receitas: [...state.receitas, item] };
      } else {
        return { ...state, despesas: [...state.despesas, item] };
      }
    }

    case "REMOVE": {
      const { id, tipo } = action.payload;
      if (tipo === "receita") {
        return { ...state, receitas: state.receitas.filter(r => r.id !== id) };
      } else {
        return { ...state, despesas: state.despesas.filter(d => d.id !== id) };
      }
    }

    case "EDIT": {
      const { id, novoItem } = action.payload;
      // novoItem contém tipo (receita/despesa) e campos atualizados
      // Remove o item antigo (se existir) de ambas listas e adiciona/atualiza na lista correta.
      const withoutIdReceitas = state.receitas.filter(r => r.id !== id);
      const withoutIdDespesas = state.despesas.filter(d => d.id !== id);

      if (novoItem.tipo === "receita") {
        // Se já existia como receita, substitui; se vinha de despesa, será removido e adicionado aqui.
        return {
          receitas: [...withoutIdReceitas, { ...novoItem, id }],
          despesas: withoutIdDespesas,
        };
      } else {
        return {
          receitas: withoutIdReceitas,
          despesas: [...withoutIdDespesas, { ...novoItem, id }],
        };
      }
    }

    default:
      return state;
  }
}

export default function PrestacaoSystem() {
  const { registros, setRegistros } = useOutletContext();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form, setForm] = useState({ tipo: "receita", descricao: "", valor: "", dia: "" });
  const [editId, setEditId] = useState(null); // id do item sendo editado
  const [autorizado, setAutorizado] = useState(true);
  const navigate = useNavigate();

  // Token (se usar backend)
  const token = localStorage.getItem("token");

  // Init: carregar do localStorage (modo convidado)
  useEffect(() => {
    const saved = localStorage.getItem("prestacao_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "INIT", payload: parsed });
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Persistir no localStorage quando mudar state
  useEffect(() => {
    localStorage.setItem("prestacao_state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user !== "sindico") {
      setAutorizado(false);
    }
  }, []);

  // Envia ao servidor (mantive sua função, não altera estado local)
  async function enviarPrestacao() {
    try {
      const data = { receitas: state.receitas, despesas: state.despesas };

      const response = await fetch("http://localhost:3001/prestacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Erro ao enviar:", error);
        alert("Erro ao salvar a prestação!");
        return;
      }

      const result = await response.json();
      console.log("Prestação salva:", result);
      alert("Prestação salva com sucesso!");
      navigate("/system/registros");
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Falha ao se comunicar com o servidor.");
    }
  }

  // Handle do form
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Adicionar ou salvar edição
  const addItem = () => {
    if (!form.descricao || !form.valor || !form.dia) return;

    const diaNum = parseInt(form.dia, 10);
    if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
      alert("Dia inválido! Informe um valor entre 1 e 31.");
      return;
    }

    const parsedValor = Number(form.valor);
    if (Number.isNaN(parsedValor)) {
      alert("Valor inválido!");
      return;
    }

    const itemBase = {
      tipo: form.tipo,
      descricao: form.descricao,
      valor: parsedValor,
      dia: diaNum,
      editadoEm: null,
    };

    if (editId) {
      // editar: dispatch EDIT (id preservado)
      const novoItem = { ...itemBase, editadoEm: new Date().toLocaleString() };
      dispatch({ type: "EDIT", payload: { id: editId, novoItem } });
      setEditId(null);
    } else {
      // novo item: gera id e dispatch ADD
      const itemComId = { ...itemBase, id: uid() };
      dispatch({ type: "ADD", payload: itemComId });
    }

    setForm({ tipo: "receita", descricao: "", valor: "", dia: "" });
    // scroll para baixo (se você quer focar na lista)
    window.requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
  };

  // Remover
  const removeItem = (tipo, id) => {
    dispatch({ type: "REMOVE", payload: { tipo, id } });
  };

  // Preparar edição: encontra por id nas duas listas
  const editarItem = (tipo, id) => {
    const item = tipo === "receita"
      ? state.receitas.find(r => r.id === id)
      : state.despesas.find(d => d.id === id);

    if (!item) return alert("Item não encontrado");

    // preenche form (valor como string)
    setForm({ tipo: item.tipo, descricao: item.descricao, valor: item.valor.toString(), dia: item.dia.toString() });
    setEditId(id);
    // não uso editTipo porque id é suficiente
  };

  // Salvar no servidor
  const handleSave = () => {
    if (state.receitas.length === 0 && state.despesas.length === 0) {
      alert("Adicione pelo menos um item antes de salvar!");
      return;
    }
    enviarPrestacao();
  };

  // Saldo derivado com useMemo
  const saldo = useMemo(() => {
    const totalR = state.receitas.reduce((acc, r) => acc + Number(r.valor || 0), 0);
    const totalD = state.despesas.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    return totalR - totalD;
  }, [state.receitas, state.despesas]);

  if (!autorizado) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h1>Erro 401</h1>
        <p>Você não tem autorização para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="prestacao-container">
      <h2 className="prestacao-titulo">Prestação de Contas</h2>

      <div className="prestacao-form">
        <select name="tipo" value={form.tipo} onChange={handleChange} className="prestacao-input">
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="prestacao-input"
        />
        <input
          type="number"
          name="valor"
          placeholder="Valor"
          value={form.valor}
          onChange={handleChange}
          className="prestacao-input"
        />
        <input
          type="number"
          name="dia"
          placeholder="Dia"
          value={form.dia}
          onChange={handleChange}
          className="prestacao-input"
        />
        <button onClick={addItem} className="prestacao-btn">
          {editId ? "Salvar Alteração" : "Adicionar"}
        </button>
      </div>

      <h3 className="prestacao-saldo">Saldo: R$ {saldo.toFixed(2)}</h3>

      <div className="prestacao-tabelas">
        <table className="prestacao-table">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {state.receitas.map((r) => (
              <tr key={r.id} className="prestacao-receita">
                <td>{r.dia}</td>
                <td>{r.descricao}</td>
                <td>R$ {Number(r.valor).toFixed(2)}</td>
                <td>
                  <button onClick={() => editarItem("receita", r.id)}>Editar</button>
                  <button onClick={() => removeItem("receita", r.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {state.despesas.map((d) => (
              <tr key={d.id} className="prestacao-despesa">
                <td>{d.dia}</td>
                <td>{d.descricao}</td>
                <td>R$ {Number(d.valor).toFixed(2)}</td>
                <td>
                  <button onClick={() => editarItem("despesa", d.id)}>Editar</button>
                  <button onClick={() => removeItem("despesa", d.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="prestacao-save-btn" onClick={handleSave}>
        Salvar Registro
      </button>
    </div>
  );
}
