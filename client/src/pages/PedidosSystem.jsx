import { useState, useEffect } from "react";
import "./PedidosSystem.css";

export default function PedidosSystem() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [autorizado, setAutorizado] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user !== "sindico") {
      setAutorizado(false);
    }
  }, []);

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/pedidos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar pedidos");

      const result = await response.json();

      // Filtra apenas pedidos pendentes
      const pendentes = result[0].filter(p => p.status === "pendente");
      setPedidos(pendentes);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function tratarPedidos(resposta, usuario_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ resposta, usuario_id }),
      });

      if (!response.ok) throw new Error("Erro ao tratar pedido");

      // Atualiza a lista (filtrando o removido)
      setPedidos(prev => prev.filter(p => p.usuario_id !== usuario_id));
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
    }
  }

  // Se o usuário não for síndico, mostra erro 401
  if (!autorizado) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h1>Erro 401</h1>
        <p>Você não tem autorização para acessar esta página.</p>
      </div>
    );
  }

  if (loading) return <p>Carregando pedidos...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div className="pedidos-container">
      <h1 className="pedidosTitulo">Pedidos de acesso</h1>
      <div className="pedidos-tabelas">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, i) => (
              <tr key={i} className="pedidos-receita">
                <td data-label="Nome">{pedido.user.nome}</td>
                <td data-label="Email">{pedido.user.email}</td>
                <td data-label="Data">
                  {new Date(pedido.data_pedido).toLocaleDateString()}
                </td>
                <td data-label="Status">{pedido.status}</td>
                <td data-label="Ação">
                  <button
                    onClick={() => tratarPedidos("ativo", pedido.usuario_id)}
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => tratarPedidos("rejeitado", pedido.usuario_id)}
                  >
                    Recusar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pedidos.length === 0 && (
          <p className="sem-pedidos">Nenhum pedido pendente no momento.</p>
        )}
      </div>
    </div>
  );
}
