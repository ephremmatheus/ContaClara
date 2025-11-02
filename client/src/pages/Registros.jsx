import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import './Registros.css';

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [selectedMes, setSelectedMes] = useState(null);
  const [editando, setEditando] = useState(false);
  const [tempRegistro, setTempRegistro] = useState(null);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("registros")) || [];

    if (data.length === 0) {
      data = [
        { 
          mesAno: "8-2025", 
          receitas: [{ dia: 5, descricao: "Luz", valor: 1000 }], 
          despesas: [{ dia: 10, descricao: "Zelador", valor: 500 }] 
        },
        { 
          mesAno: "9-2025", 
          receitas: [{ dia: 3, descricao: "Zelador", valor: 500 }], 
          despesas: [{ dia: 15, descricao: "Reforma", valor: 1200 }] 
        }
      ];
      localStorage.setItem("registros", JSON.stringify(data));
    }

    setRegistros(data);
  }, []);

  const handleSelectMes = (registro) => {
    setSelectedMes(registro);
    setTempRegistro(JSON.parse(JSON.stringify(registro)));
    setEditando(false);
  };

  const handleBack = () => {
    setSelectedMes(null);
    setEditando(false);
  };

  const toggleEditar = () => setEditando(!editando);

  const atualizarItem = (tipo, index, campo, valor) => {
    let updatedRegistro = { ...tempRegistro };
    let listaAtual = tipo === 'receita' ? updatedRegistro.receitas : updatedRegistro.despesas;
    let item = listaAtual[index];

    if (campo === 'dia') {
      const diaNum = parseInt(valor);
      if (diaNum < 1 || diaNum > 31) return;
      item.dia = diaNum;
    } else if (campo === 'valor') {
      item.valor = parseFloat(valor);
    } else if (campo === 'tipo') {
      if (valor !== tipo) {
        listaAtual.splice(index, 1);
        item.editadoEm = new Date().toLocaleString();
        if (valor === 'receita') updatedRegistro.receitas.push(item);
        else updatedRegistro.despesas.push(item);
      }
    } else {
      item[campo] = valor;
    }

    setTempRegistro(updatedRegistro);
  };

  const salvarEdicao = () => {
    const updatedRegistro = { ...tempRegistro };
    const agora = new Date().toLocaleString();

    updatedRegistro.receitas.forEach(r => r.editadoEm = agora);
    updatedRegistro.despesas.forEach(d => d.editadoEm = agora);

    const novosRegistros = registros.map(r => r.mesAno === updatedRegistro.mesAno ? updatedRegistro : r);
    setRegistros(novosRegistros);
    localStorage.setItem("registros", JSON.stringify(novosRegistros));
    setSelectedMes(updatedRegistro);
    setEditando(false);
    alert("Registro atualizado com sucesso!");
  };

  const saldoTotalMes = (r) =>
    r.receitas.reduce((acc, item) => acc + item.valor, 0) -
    r.despesas.reduce((acc, item) => acc + item.valor, 0);

  const saldoAcumulado = registros.reduce((acc, r) => acc + saldoTotalMes(r), 0);

  const registroAtual = editando ? tempRegistro : selectedMes;

  const gerarPDF = () => {
    if (!registroAtual) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Registro - Mês/Ano: ${registroAtual.mesAno}`, 10, 20);
    doc.setFontSize(12);

    doc.text("Receitas:", 10, 30);
    registroAtual.receitas.forEach((r, i) => {
      doc.text(`${i+1}. Dia: ${r.dia} | Desc: ${r.descricao} | Valor: R$ ${r.valor.toFixed(2)} | Editado: ${r.editadoEm || "-"}`, 10, 40 + i*8);
    });

    let yPos = 40 + registroAtual.receitas.length * 8 + 10;
    doc.text("Despesas:", 10, yPos);
    registroAtual.despesas.forEach((d, i) => {
      doc.text(`${i+1}. Dia: ${d.dia} | Desc: ${d.descricao} | Valor: R$ ${d.valor.toFixed(2)} | Editado: ${d.editadoEm || "-"}`, 10, yPos + 10 + i*8);
    });

    yPos = yPos + 10 + registroAtual.despesas.length * 8 + 10;
    doc.text(`Saldo do Mês: R$ ${saldoTotalMes(registroAtual).toFixed(2)}`, 10, yPos);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 10, yPos + 10);

    doc.save(`Registro_${registroAtual.mesAno}.pdf`);
  };

  return (
    <div className="registros-container">
      <h2 className="registros-titulo">Registros Salvos</h2>
      <h3 className="registros-saldo-acumulado">Saldo Acumulado: R$ {saldoAcumulado.toFixed(2)}</h3>

      {!selectedMes ? (
        <div className="registros-cards">
          {registros.length === 0 ? (
            <p className="registros-empty">Nenhum registro salvo.</p>
          ) : (
            registros.map((r, i) => (
              <div key={i} className="registros-card" onClick={() => handleSelectMes(r)}>
                <h3>Mês/Ano: {r.mesAno}</h3>
                <p>Receitas: {r.receitas.length} | Despesas: {r.despesas.length}</p>
                <p>Saldo: R$ {saldoTotalMes(r).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="registros-detalhes">
          <div className="registros-btn-group">
            <button className="registros-back-btn" onClick={handleBack}>Voltar</button>
            <button className="registros-edit-btn" onClick={toggleEditar}>
              {editando ? "Cancelar Edição" : "Editar Mês"}
            </button>
            {editando && <button className="registros-save-edit-btn" onClick={salvarEdicao}>Salvar Edição</button>}
            <button className="registros-pdf-btn" onClick={gerarPDF}>Gerar PDF</button>
          </div>

          <h3>Detalhes do Mês: {selectedMes.mesAno}</h3>

          <div className="registros-table-container">
            <table className="registros-table">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Editado em</th>
                </tr>
              </thead>
              <tbody>
                {registroAtual.receitas.map((r, i) => (
                  <tr key={`rec-${i}`} className="registros-receita">
                    <td>{editando ? (
                      <input type="number" value={r.dia} min={1} max={31} onChange={(e) => atualizarItem('receita', i, 'dia', e.target.value)} />
                    ) : r.dia}</td>
                    <td>{editando ? (
                      <input type="text" value={r.descricao} onChange={(e) => atualizarItem('receita', i, 'descricao', e.target.value)} />
                    ) : r.descricao}</td>
                    <td>{editando ? (
                      <input type="number" value={r.valor} onChange={(e) => atualizarItem('receita', i, 'valor', e.target.value)} />
                    ) : `R$ ${r.valor.toFixed(2)}`}</td>
                    <td>{editando ? (
                      <select value="receita" onChange={(e) => atualizarItem('receita', i, 'tipo', e.target.value)}>
                        <option value="receita">Receita</option>
                        <option value="despesa">Despesa</option>
                      </select>
                    ) : "Receita"}</td>
                    <td>{r.editadoEm || "-"}</td>
                  </tr>
                ))}
                {registroAtual.despesas.map((d, i) => (
                  <tr key={`des-${i}`} className="registros-despesa">
                    <td>{editando ? (
                      <input type="number" value={d.dia} min={1} max={31} onChange={(e) => atualizarItem('despesa', i, 'dia', e.target.value)} />
                    ) : d.dia}</td>
                    <td>{editando ? (
                      <input type="text" value={d.descricao} onChange={(e) => atualizarItem('despesa', i, 'descricao', e.target.value)} />
                    ) : d.descricao}</td>
                    <td>{editando ? (
                      <input type="number" value={d.valor} onChange={(e) => atualizarItem('despesa', i, 'valor', e.target.value)} />
                    ) : `R$ ${d.valor.toFixed(2)}`}</td>
                    <td>{editando ? (
                      <select value="despesa" onChange={(e) => atualizarItem('despesa', i, 'tipo', e.target.value)}>
                        <option value="receita">Receita</option>
                        <option value="despesa">Despesa</option>
                      </select>
                    ) : "Despesa"}</td>
                    <td>{d.editadoEm || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="registros-saldo">Saldo Total do Mês: R$ {saldoTotalMes(registroAtual).toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}
