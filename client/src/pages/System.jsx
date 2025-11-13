import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import './System.css';

export default function System() {

  const [nome, setNome] = useState("Usuário");
  // Estado compartilhado dos registros
  const [registros, setRegistros] = useState(() => {
    const saved = localStorage.getItem("registros");
    return saved ? JSON.parse(saved) : [];
  });

  // Atualiza localStorage sempre que registros mudam
  // useEffect(() => {
  //   localStorage.setItem("registros", JSON.stringify(registros));
  // }, [registros]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    localStorage.setItem("registros", JSON.stringify(registros));

    // se não houver token, redireciona direto
    if (!token) {
        window.location.href = "/login";
        return;
    }

    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:3001/system", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // se o token estiver expirado ou inválido
            if (!response.ok) {
                throw new Error("Token inválido ou expirado");
            }

            const result = await response.json();
            setNome(result.nome);
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);

            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "/login";
        }
    };

    fetchUser();
}, [registros]); // executa apenas 1x quando o componente monta

  return (
    <div className='sistema'>
      {/* Navbar interna do sistema */}
      <nav className="sistema-navbar">
        <h1 className="sistema-title">ContaClara</h1>
      </nav>

      {/* Informações principais */}
      <div className="informacoes-sistema">
        <h1>Bem vindo, {nome}</h1>
        <p>Use a barra de navegação ao lado para navegar pelo sistema!</p>
      </div>


      {/* Outlet: aqui aparecem Prestacao, Registros, etc */}
      <div className="sistema-outlet">
        <Outlet context={{ registros, setRegistros }} />
      </div>
    </div>
  );
}
