import { useState } from "react"
import { Footer } from "../components/Footer"
import './Login.css'
import { useRef } from "react";

export default function LoginCadastro(){ 
    const [sindicoOn, setSindicoOn] = useState(false);
    const [message, setMessage] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [codigoAcesso, setCodigoAcesso] = useState(null);
    const form = useRef(null);
    

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const formData = new FormData(form.current);
        const data = Object.fromEntries(formData.entries());

        try{
            const response = await fetch('http://localhost:3001/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json();
            setMessage(result.message);
            setFeedback(result.type);
            setCodigoAcesso(result.codigoAcesso);

            setTimeout(() =>{
                setMessage(null)
            }, 10000);

        }catch(e) {
            console.error("Erro ao registrar:", e);
        }
    }
        
    function opcoesCondomino(){
        setSindicoOn(false);
    }

    function opcoesSindico(){
        setSindicoOn(true);
    }

    return(
            <div className="login-page">
                <div className="navbar-loginCadastro">
                <div className="navbar-loginCadastro-container">
                    <div className="navbar-loginCadastro-logo">
                        <a href="/">ContaClara</a>
                    </div>
                </div>
            </div>
                <div className="menu">
                    <div className="voltar">
                        <a href="/"><span className="material-symbols-outlined">arrow_back</span>Voltar</a>
                    </div>
                    <div className="login">
                        <a href="/login">Fazer Login <span className="material-symbols-outlined">arrow_forward</span></a>
                    </div>
                </div>
                <div className="loginCadastro">
                    <div className="loginCadastro-section">
                        <h2 className="loginCadastro-section-titulo">Cadastre-se</h2>
                        <form method="post" className="form" ref={form}  onSubmit={handleSubmit}>
                            <div className="role">
                                <input type="radio" name="tipo" id="viewerId" value='condomino' required onFocus={opcoesCondomino}/>
                                <label htmlFor="viewerId">Condômino</label>
                                <input type="radio" name="tipo" id="sindicoId" value='sindico' required onFocus={opcoesSindico}/>
                                <label htmlFor="sindicoId">Síndico</label>
                            </div>
                                
                            {!sindicoOn ? '' : 
                                <div className="sindico">
                                    <label htmlFor="nomeCondominioId">
                                        <p className="inputTitle">NOME DO CONDOMÍNIO/PRÉDIO</p>
                                        <input type="text" name="nomeCondominio" id="nomeCondominioId" required/>
                                    </label>
                                    <label htmlFor="enderecoCondominioId">
                                        <p className="inputTitle">ENDEREÇO</p>
                                        <input type="text" name="enderecoCondominio" id="enderecoCondominioId" required />
                                    </label>
                                </div>
                            }
                            <label htmlFor="nomeUser">
                                    <p className="inputTitle">NOME</p>
                                    <input type="text" name="nome" id="nomeUser" required />
                            </label>
                            <label htmlFor="emailloginCadastroId">
                                <p className="inputTitle">E-MAIL</p>
                                <input type="email" name="email" id="emailloginCadastroId" required/>
                            </label>
                            <label htmlFor="passwordloginCadastroId">
                                <p className="inputTitle">SENHA</p>    
                                <input type="password" name="senha" minLength={6} id="passwordloginCadastroId" required/>
                            </label>
                            {!sindicoOn ?
                                <label htmlFor="codigologinCadastroId">
                                    <p className="inputTitle">CODIGO DE ACESSO</p>    
                                    <input type="text" name="codigo" id="codigologinCadastroId" min={6} max={30} required/>
                                    <p className="codigoText">Solicite o código de acesso ao síndico.</p>
                                </label> : 
                                '' 
                            }

                            {sindicoOn && codigoAcesso != null ?
                            <p className="codigoText">Compartilhe este codigo com os condôminos:{codigoAcesso}</p>: ''}
                            <div className={`bloco ${feedback}`}>
                                <p className={`mensagem-texto ${feedback}`}>{message}</p>
                            </div>
                            <button className="button-loginCadastro" type="submit">CRIAR</button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
    )
}