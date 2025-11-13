import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './NavSystem.css';

export default function NavSystem() {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("CONVIDADO");
  const [role, setRole] = useState("guest");
  const [codigo, setCodigo] = useState("guest");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/system", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();
        setNome(result.nome);
        setRole(result.nivelAcesso);
        setCodigo(result.codigo);
      } catch (err) {
        window.location.href = "/login";
      }
    };

    if (token) fetchUser();
  }, []);

  function changeNav() {
    setAberto(!aberto);
  }

  function entrou() {
    if (window.innerWidth > 768) setAberto(true); // Só abre com hover no desktop
  }

  function saiu() {
    if (window.innerWidth > 768) setAberto(false);
  }

  function fecharMenuMobile() {
    if (window.innerWidth <= 768) setAberto(false);
  }

  return (
    <div
      id="navSystem"
      className={aberto ? 'open' : ''}
      onMouseEnter={entrou}
      onMouseLeave={saiu}
    >
      <div className="navSystem-content">
        <div className="user">
          <div className="img">
            <img src="../../public/images/perfil.png" alt="Imagem de perfil" />
          </div>
          <p className='user-infos'>
            <span>{nome}</span>
            <span>{role}</span>
            {role == "sindico" ? <span>Seu código de acesso: <br />{codigo}</span> : ""}
          </p>
        </div>

        <ul className='side-items'>
          <Link to="/system" onClick={fecharMenuMobile}>
            <li className='side-item'>
              <Link to="/system" onClick={fecharMenuMobile}>
                <span className="material-symbols-outlined">home</span>
              </Link>
              <Link to='/system' className="item-description" onClick={fecharMenuMobile}>Início</Link>
            </li>
          </Link>

          <Link to="/system/registros" onClick={fecharMenuMobile}>
            <li className='side-item'>
              <Link to="/system/registros" onClick={fecharMenuMobile}>
                <span className="material-symbols-outlined">folder</span>
              </Link>
              <Link to='/system/registros' className="item-description" onClick={fecharMenuMobile}>Registros</Link>
            </li>
          </Link>

          {role == "sindico" ?
            <Link to="/system/prestacao" onClick={fecharMenuMobile}>
              <li className='side-item'>
                <Link to="/system/prestacao" onClick={fecharMenuMobile}>
                  <span className="material-symbols-outlined">assignment_add</span>
                </Link>
                <Link to='/system/prestacao' className="item-description" onClick={fecharMenuMobile}>Prestação</Link>
              </li>
            </Link> : ""}

          {role == "sindico" ?
            <Link to="/system/pedidos" onClick={fecharMenuMobile}>
              <li className='side-item'>
                <Link to="/system/pedidos" onClick={fecharMenuMobile}>
                  <span className="material-symbols-outlined">person</span>
                </Link>
                <Link to='/system/pedidos' className="item-description" onClick={fecharMenuMobile}>Pedidos de Acesso</Link>
              </li>
            </Link> : ""}
        </ul>

        <button className={aberto ? 'open-btn' : 'close-btn'} onClick={changeNav}>
          <span className="material-symbols-outlined">
            {aberto ? 'chevron_backward' : 'chevron_forward'}
          </span>
        </button>
      </div>

      <hr className='navSystem-hr' />
      <div className="logout">
        <a className='logout-btn' href="/login" onClick={fecharMenuMobile}>
          <span className="material-symbols-outlined">logout</span>
          <p className="item-description">Sair</p>
        </a>
      </div>
    </div>
  );
}
