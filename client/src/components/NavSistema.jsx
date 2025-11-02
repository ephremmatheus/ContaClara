import { Link } from 'react-router-dom';
import { useState } from 'react';
import './NavSistema.css';

export default function NavSistema(){
    const [aberto, setAberto] = useState(false);
    const [nomeCondominio, setNomeCondominio]= useState("CONVIDADO");
    const [role, setRole] = useState("guest");

    function changeNav(){
        setAberto(!aberto);
    }

    function entrou(){
        setAberto(true);
    }

    function saiu(){
        setAberto(false);
    }

    

    return (
        <div id="navSistema" className={aberto ? 'open' : ''} onMouseEnter={entrou} onMouseLeave={saiu}>
            <div className="navSistema-content" >
                <div className="user">
                    <div className="img">
                        <img src="../../public/images/perfil.png" alt="Imagem de perfil" />
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
                            <Link to='/sistema/prestacao' className="item-description"> Prestação</Link>
                        </li>
                    </Link>
                </ul>
            
                <button className={aberto ? 'open-btn' : 'close-btn'} onClick={changeNav}>
                    <span className="material-symbols-outlined">
                        {aberto ? 'chevron_backward' : 'chevron_forward'}
                    </span>
                </button>
            </div>
           <hr className='navSistema-hr'/>
            <div className="logout">
                <a className='logout-btn' href="/login">
                    <span className="material-symbols-outlined">logout</span>
                    <p className="item-description">Sair</p>
                </a>
            </div>
        </div>
    )
}
