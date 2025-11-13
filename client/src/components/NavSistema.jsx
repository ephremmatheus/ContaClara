import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './NavSistema.css';

export default function NavSistema() {
  const [aberto, setAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [nomeCondominio, setNomeCondominio] = useState("CONVIDADO");
  const [role, setRole] = useState("guest");

  // Detecta se está em dispositivo móvel
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function changeNav() {
    setAberto(!aberto);
  }

  function entrou() {
    if (!isMobile) setAberto(true);
  }

  function saiu() {
    if (!isMobile) setAberto(false);
  }

  return (
    <div
      id="navSistema"
      className={aberto ? 'open' : ''}
      onMouseEnter={entrou}
      onMouseLeave={saiu}
    >
      <div className="navSistema-content">
        <div className="user">
          <div className="img">
            <img src="/images/perfil.png" alt="Imagem de perfil" />
          </div>
          <p className='user-infos'>
            <span>{nomeCondominio}</span>
            <span>{role}</span>
          </p>
        </div>

        <ul className='side-items'>
          <Link to="/sistema">
            <li className='side-item'>
              <Link to="/sistema">
                <span className="material-symbols-outlined">home</span>
              </Link>
              <Link to='/sistema' className="item-description">Inicio</Link>
            </li>
          </Link>
          <Link to="/sistema/registros">
            <li className='side-item'>
              <Link to="/sistema/registros">
                <span className="material-symbols-outlined">folder</span>
              </Link>
              <Link to='/sistema/registros' className="item-description">Registros</Link>
            </li>
          </Link>
          <Link to="/sistema/prestacao">
            <li className='side-item'>
              <Link to="/sistema/prestacao">
                <span className="material-symbols-outlined">assignment_add</span>
              </Link>
              <Link to='/sistema/prestacao' className="item-description">Prestação</Link>
            </li>
          </Link>
          <li className='side-item'>
              <Link to="/sistema/pedidos">
                <span className="material-symbols-outlined">person</span>
              </Link>
              <Link to='/sistema/pedidos' className="item-description">Pedidos de Acesso</Link>
          </li>
        </ul>

        <button className={aberto ? 'open-btn' : 'close-btn'} onClick={changeNav}>
          <span className="material-symbols-outlined">
            {aberto ? 'chevron_backward' : 'chevron_forward'}
          </span>
        </button>
      </div>
      <hr className='navSistema-hr' />
      <div className="logout">
        <a className='logout-btn' href="/">
          <span className="material-symbols-outlined">logout</span>
          <p className="item-description">Sair</p>
        </a>
      </div>
    </div>
  );
}
