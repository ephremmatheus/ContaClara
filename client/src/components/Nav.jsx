import { useState } from "react"
import { Link } from "react-router-dom";
import { Button } from "./Button";
import './Nav.css';


export const Nav = (props) => {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);


    function handleClick(){
        setClick(!click);
    }

    function closeMobileMenu(){
        setClick(false);
    }

    function showButton() {
        if(window.innerWidth <= 960){
            setButton(false);
        } else{
            setButton(true);
        }
    }

    window.onload = function(){
        showButton()
    }

    window.addEventListener('resize', showButton);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" onClick={() =>{
                        closeMobileMenu();
                        props.homeScroll();
                    } }>ContaClara</Link>
                </div>
                <div className="menu-icon" onClick={handleClick}>
                    <span className={"material-symbols-outlined"} >
                        {click? "close": "menu"}
                    </span>
                </div>
                <ul className={click? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link
                        onClick={ () => {
                            
                            props.homeScroll();
                            closeMobileMenu();
                        }} className="nav-links">Início</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/"
                         onClick={ () =>{
                            props.funcionalidadesScroll();
                            closeMobileMenu();
                         }
                        } className="nav-links">Funcionalidades</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/" onClick={() =>{
                            props.demoScroll();
                            closeMobileMenu();
                         }} className="nav-links">Demostração</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/" onClick={()=>{
                            props.contatosScroll();
                            closeMobileMenu();
                            }
                        }className="nav-links">Contato</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" onClick={closeMobileMenu} className="nav-links-mobile">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/cadastro" onClick={closeMobileMenu} className="nav-links-mobile-cadastrar">Cadastre-se</Link>
                    </li>
                </ul>
                <div className="nav-login">
                    {button && <Button buttonStyle='btn--outline' className="btn-login" tipo = "login">Login</Button>}
                    {button && <Button buttonStyle='btn--outline' tipo = "cadastro">CADASTRE-SE</Button>}
                </div>
            </div>
        </nav>
    )
}