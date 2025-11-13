import { useState, useEffect } from "react";
import "./PedidosSistema.css";

export default function PedidosSistema() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [autorizado, setAutorizado] = useState(true);

  // Simula dados locais (como se viessem do servidor)
  const pedidosFake = [
    {
      usuario_id: 1,
      status: "pendente",
      data_pedido: "2025-11-10T12:00:00Z",
      user: { nome: "João Silva", email: "joao@email.com" },
    },
    {
      usuario_id: 2,
      status: "pendente",
      data_pedido: "2025-11-11T15:30:00Z",
      user: { nome: "Maria Souza", email: "maria@email.com" },
    },
    {
      usuario_id: 3,
      status: "ativo",
      data_pedido: "2025-11-12T10:45:00Z",
      user: { nome: "Carlos Lima", email: "carlos@email.com" },
    },
  ];

  // Simula autorização
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user !== "sindico") {
      setAutorizado(false);
    }
  }, []);

  // Simula busca dos pedidos
  useEffect(() => {
    setTimeout(() => {
      try {
        const pendentes = pedidosFake.filter(p => p.status === "pendente");
        setPedidos(pendentes);
      } catch (error) {
        setErro("Erro ao carregar pedidos simulados");
      } finally {
        setLoading(false);
      }
    }, 500); // delay só pra parecer que está “carregando”
  }, []);

  // Simula o tratamento de pedidos (atualiza o estado local)
  function tratarPedidos(resposta, usuario_id) {
    setPedidos(prev => prev.filter(p => p.usuario_id !== usuario_id));
    console.log(`Pedido do usuário ${usuario_id} marcado como: ${resposta}`);
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
