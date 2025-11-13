import './Depoimentos.css';

export const Depoimentos = () => {
    return(
        <div className="depoimentos">
            <div className="depoimentos-container">
                <h2 className='depoimento-titulo'>Veja o que dizem sobre o sistema</h2>
                <div className="depoimento">
                    <p>“Precisava organizar as contas do meu prédio, mas não tinha muita facilidade com tecnologia. Esse sistema foi simples de usar e me salvou muito tempo!”</p>
                    <span className='depoimento-avaliacao'>★★★★★</span>.
                    <div className="depoimento-cliente">
                        <p className='cliente-nome'> Claudete Costa/Síndica - Edifício Alan</p>
                        <p>Cliente desde 2025</p>
                    </div>
                </div>
            </div>
        </div>
    )
}