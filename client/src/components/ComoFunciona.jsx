import './ComoFunciona.css';

export const ComoFunciona = (props) => {
    return(
        <div className="cf-container" ref={props.comoFuncionaRef}>
            <div className="cf-text">
                <h2>Como Funciona</h2>
                <p>Em poucos passos, você organiza, salva e compartilha as finanças do seu condomínio.</p>
            </div>
            <div className="cf-cards">
                <div className="cf-card">
                    <h3>1. Crie sua Conta</h3>
                    <p>Cadastre-se como síndico e inicie a gestão.</p>
                </div>
                <div className="cf-card">
                    <h3>2. Adicione Receitas e Despesas</h3>
                    <p>Preencha os dados financeiros do mês com poucos cliques</p>
                </div>
                <div className="cf-card">
                    <h3>3. Gere Relatórios em PDF</h3>
                    <p>Com um botão, você exporta tudo em PDF pronto para apresentação.</p>
                </div>
                <div className="cf-card">
                    <h3>4. Compartilhe com os Condôminos</h3>
                    <p>Envie os dados por e-mail ou disponibilize para download seguro.</p>
                </div>
            </div>
        </div>
    )
}