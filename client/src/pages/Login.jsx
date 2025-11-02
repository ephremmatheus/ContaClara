import { useRef, useState } from "react";
import { Footer } from "../components/Footer"
import './Login.css'

export default function LoginCadastro(){
    const form = useRef();
    const [message, setMessage] = useState(null); 
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form.current);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            
            const result = await response.json();
            setMessage(result.message)
            setFeedback(result.type);

        } catch(err) {
            console.log(err);
        }
    }

    return(
        <div className="loginCadastro-page">
            <div className="navbar-loginCadastro">
                <div className="navbar-loginCadastro-container">
                    <div className="navbar-loginCadastro-logo">
                        <a href="/">ContaClara</a>
                    </div>
                </div>
            </div>
            <div className="voltar">
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                    }}><span class="material-symbols-outlined">arrow_back</span>Voltar</a>
            </div>
            <div className="loginCadastro">
                <div className="loginCadastro-section">
                    <h2 className="loginCadastro-section-titulo">Entrar</h2>
                    <form action="http://localhost:3001/login" method="post" className="form" ref={form} onSubmit={handleSubmit}>
                        <label htmlFor="emailloginCadastroId">
                            <p className="inputTitle">E-MAIL</p>
                            <input type="email" name="email" id="emailloginCadastroId"/>
                        </label>
                        <label htmlFor="passwordloginCadastroId">
                            <p className="inputTitle">SENHA</p>    
                            <input type="password" name="senha" id="passwordloginCadastroId"/>
                        </label>
                        <div className={`bloco ${feedback}`}>
                            <p className={`mensagem-texto ${feedback}`}>{message}</p>
                        </div>
                        <button className="button-loginCadastro" type="submit">ENTRAR</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}