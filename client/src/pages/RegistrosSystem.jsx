import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "./RegistrosSystem.css";

export default function RegistrosSystem() {
  const [resumo, setResumo] = useState([]);
  const [detalhes, setDetalhes] = useState([]);
  const [selectedMes, setSelectedMes] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRegistros() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/registros", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setResumo(data);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    }

    fetchRegistros();
  }, []);

  const handleSelectMes = async (r) => {
    try {
      if (!r || !r.ano || !r.numero_mes) {
        alert("Erro interno: dados do mês inválidos.");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");

      const resp = await fetch(
        `http://localhost:3001/registros/${r.ano}/${r.numero_mes}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await resp.json();

      if (!Array.isArray(data)) {
        alert("Erro ao carregar detalhes do mês. Verifique o servidor.");
        setLoading(false);
        return;
      }

      const detalhesConvertidos = data.map((d) => ({
        ...d,
        valor: Number(d.valor) || 0,
      }));

      setSelectedMes(r);
      setDetalhes(detalhesConvertidos);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedMes(null);
    setDetalhes([]);
  };

  const gerarPDF = () => {
    if (!selectedMes) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Registro - ${selectedMes.mes}/${selectedMes.ano}`, 10, 20);
    doc.setFontSize(12);

    detalhes.forEach((item, i) => {
      const y = 30 + i * 8;
      doc.text(
        `${i + 1}. Dia: ${item.dia} | ${item.tipo.toUpperCase()} | ${item.descricao} | R$ ${item.valor.toFixed(2)}`,
        10,
        y
      );
    });

    const saldo = detalhes.reduce(
      (acc, i) => (i.tipo === "receita" ? acc + i.valor : acc - i.valor),
      0
    );

    doc.text(`Saldo do Mês: R$ ${saldo.toFixed(2)}`, 10, 40 + detalhes.length * 8);
    doc.save(`Registro_${selectedMes.mes}_${selectedMes.ano}.pdf`);
  };

  return (
    <div className="registros-container">
      <h2 className="registros-titulo">Histórico</h2>

      {!selectedMes ? (
        <div className="registros-cards">
          {resumo.length === 0 ? (
            <p>Nenhum registro encontrado.</p>
          ) : (
            resumo.map((r, i) => {
              const receitas = Number(r.receitas) || 0;
              const despesas = Number(r.despesas) || 0;
              const saldo = receitas - despesas;

              return (
                <div
                  key={i}
                  className="registros-card"
                  onClick={() => handleSelectMes(r)}
                >
                  <h3>{r.mes} / {r.ano}</h3>
                  <p>Receitas: R$ {receitas.toFixed(2)}</p>
                  <p>Despesas: R$ {despesas.toFixed(2)}</p>
                  <p><strong>Saldo: R$ {saldo.toFixed(2)}</strong></p>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="registros-detalhes">
          <div className="registros-btn-group">
            <button onClick={handleBack}>Voltar</button>
            <button onClick={gerarPDF}>Gerar PDF</button>
          </div>

          <h3>Detalhes - {selectedMes.mes}/{selectedMes.ano}</h3>
          <p class="scroll-hint">Arraste para o lado para ver mais</p>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="registros-table-container">
              <table className="registros-table">
                <thead>
                  <tr>
                    <th>Dia</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhes.map((d, i) => (
                    <tr
                      key={i}
                      className={
                        d.tipo === "receita" ? "registros-receita" : "registros-despesa"
                      }
                    >
                      <td>{d.dia}</td>
                      <td>{d.descricao}</td>
                      <td>R$ {d.valor.toFixed(2)}</td>
                      <td>{d.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
