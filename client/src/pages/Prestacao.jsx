import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import './Prestacao.css';

export default function Prestacao() {
  const { registros, setRegistros } = useOutletContext();
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [form, setForm] = useState({ tipo: 'receita', descricao: '', valor: '', dia: '' });
  const [editIndex, setEditIndex] = useState(null); // índice do item em edição
  const [editTipo, setEditTipo] = useState(null);   // tipo do item em edição
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addItem = () => {
    if (!form.descricao || !form.valor || !form.dia) return;
    const diaNum = parseInt(form.dia);
    if (diaNum < 1 || diaNum > 31) {
      alert("Dia inválido! Informe um valor entre 1 e 31.");
      return;
    }

    const novoItem = { ...form, valor: parseFloat(form.valor) };

    if (editIndex !== null && editTipo) {
      // Atualiza item existente
      if (editTipo === 'receita') {
        const novasReceitas = [...receitas];
        novasReceitas[editIndex] = { ...novoItem, editadoEm: new Date().toLocaleString() };
        setReceitas(novasReceitas);
      } else {
        const novasDespesas = [...despesas];
        novasDespesas[editIndex] = { ...novoItem, editadoEm: new Date().toLocaleString() };
        setDespesas(novasDespesas);
      }
      setEditIndex(null);
      setEditTipo(null);
    } else {
      // Adiciona novo item
      if (form.tipo === 'receita') setReceitas([...receitas, novoItem]);
      else setDespesas([...despesas, novoItem]);
    }

    setForm({ tipo: 'receita', descricao: '', valor: '', dia: '' });
  };

  const removeItem = (tipo, index) => {
    if (tipo === 'receita') setReceitas(receitas.filter((_, i) => i !== index));
    else setDespesas(despesas.filter((_, i) => i !== index));
  };

  const editarItem = (tipo, index) => {
    const item = tipo === 'receita' ? receitas[index] : despesas[index];
    setForm({ ...item, valor: item.valor.toString() });
    setEditIndex(index);
    setEditTipo(tipo);
  };

  const saldo = receitas.reduce((acc, r) => acc + r.valor, 0) - despesas.reduce((acc, d) => acc + d.valor, 0);

  const handleSave = () => {
    if (receitas.length === 0 && despesas.length === 0) {
      alert("Adicione pelo menos um item antes de salvar!");
      return;
    }

    const now = new Date();
    const mesAno = `${now.getMonth() + 1}-${now.getFullYear()}`;

    // Verifica se já existe registro do mês
    if (registros.some(r => r.mesAno === mesAno)) {
      alert("Já existe uma prestação registrada para este mês!");
      return;
    }

    const novoRegistro = { mesAno, receitas, despesas };
    const novosRegistros = [...registros, novoRegistro];

    setRegistros(novosRegistros);
    localStorage.setItem("registros", JSON.stringify(novosRegistros));

    // Limpar formulário
    setReceitas([]);
    setDespesas([]);
    setForm({ tipo: 'receita', descricao: '', valor: '', dia: '' });
    navigate('/sistema/registros');
  };

  return (
    <div className="prestacao-container">
      <h2 className="prestacao-titulo">Prestação de Contas</h2>

      <div className="prestacao-form">
        <select name="tipo" value={form.tipo} onChange={handleChange} className="prestacao-input">
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <input type="text" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} className="prestacao-input"/>
        <input type="number" name="valor" placeholder="Valor" value={form.valor} onChange={handleChange} className="prestacao-input"/>
        <input type="number" name="dia" placeholder="Dia" value={form.dia} onChange={handleChange} className="prestacao-input"/>
        <button onClick={addItem} className="prestacao-btn">
          {editIndex !== null ? "Salvar Alteração" : "Adicionar"}
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
            {receitas.map((r, i) => (
              <tr key={`r-${i}`} className="prestacao-receita">
                <td>{r.dia}</td>
                <td>{r.descricao}</td>
                <td>R$ {r.valor.toFixed(2)}</td>
                <td>
                  <button onClick={() => editarItem('receita', i)}>Editar</button>
                  <button onClick={() => removeItem('receita', i)}>Excluir</button>
                </td>
              </tr>
            ))}
            {despesas.map((d, i) => (
              <tr key={`d-${i}`} className="prestacao-despesa">
                <td>{d.dia}</td>
                <td>{d.descricao}</td>
                <td>R$ {d.valor.toFixed(2)}</td>
                <td>
                  <button onClick={() => editarItem('despesa', i)}>Editar</button>
                  <button onClick={() => removeItem('despesa', i)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="prestacao-save-btn" onClick={handleSave}>Salvar Registro</button>
    </div>
  );
}
