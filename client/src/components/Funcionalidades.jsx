import "./Funcionalidades.css";
import { Link } from "react-router-dom";

export const Funcionalidades = (props) =>{
    return(
        
        <div className="funcionalidades" ref={props.funcionalidadesRef}>
            <h2 className="funcionalidade-titulo">Funcionalidades</h2>
            <div className="funcionalidades-container">
                <div className="card armazenamento-mensal">
                    <img src="/images/cloud.png" alt="Cloud" />
                    <h3 className="card-titulo">Armazenamento Mensal</h3>
                    <p className="card-sobre">Registre e organize as prestações de contas de cada mês com histórico acessível.</p>
                </div>

                <div className="card gera-pdf">
                    <img src="/images/document.png" alt="Documento" />
                    <h3 className="card-titulo">Geração de PDF</h3>
                    <p className="card-sobre">Exporte documentos mensais com um clique e facilite assembleias e auditorias.</p>

                </div>

                <div className="card classifica-gastos">
                    <img src="/images/tags.png" alt="Tag" />
                    <h3 className="card-titulo">Descrição de Gastos</h3>
                    <p className="card-sobre">Descreva cada despesa e saiba exatamente onde o dinheiro está sendo usado.</p>
                </div>
                <div className="card acesso-seguro">
                    <img src="/images/lock.png" alt="Cadeado/Segurança" />
                    <h3 className="card-titulo">Acesso Seguro</h3>
                    <p className="card-sobre">Controle de permissões para síndico e condôminos.</p>
                </div>

            </div>
        </div>
    )
}