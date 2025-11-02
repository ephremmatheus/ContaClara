import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import './Sistema.css';

export default function Sistema() {
  // Estado compartilhado dos registros
  const [registros, setRegistros] = useState(() => {
    const saved = localStorage.getItem("registros");
    return saved ? JSON.parse(saved) : [];
  });

  // Atualiza localStorage sempre que registros mudam
  useEffect(() => {
    localStorage.setItem("registros", JSON.stringify(registros));
  }, [registros]);

  return (
    <div className='sistema'>
      {/* Navbar interna do sistema */}
      <nav className="sistema-navbar">
        <h1 className="sistema-title">ContaClara</h1>
      </nav>

      {/* Informações principais */}
      <div className="informacoes-sistema">
        <h1>Bem vindo, usuário!</h1>
        <p>Use a barra de navegação ao lado para navegar pelo sistema!</p>
      </div>

      <div className="img-sistema">
        <img src="/images/navegacao.png" alt="icone de navegação" />
      </div>

      {/* Outlet: aqui aparecem Prestacao, Registros, etc */}
      <div className="sistema-outlet">
        <Outlet context={{ registros, setRegistros }} />
      </div>
    </div>
  );
}
