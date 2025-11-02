import './Footer.css';

export const Footer = (props) => {
    
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-menu">
                    <div className="menu-opcao">
                        <h3>Sobre</h3>
                        <p>Sistema de prestação de contas transparente e moderno para condomínios. Organize, gere PDFs e compartilhe tudo com facilidade.</p>
                    </div>
                    <div className="menu-opcao" ref={props.contatosRef}>
                        <h3>Contato</h3>
                        <p>Email: <a href="mailto:ephrem08matheus@gmail.com">ephrem08matheus@gmail.com</a></p>
                    </div>
                    <div className="menu-opcao">
                        <h3>Redes Profissionais</h3>
                        <p> <a href="https://www.linkedin.com/in/ephrem-matheus-821a5a294/" target="_blank">Linkedin: Ephrem Matheus</a></p>
                        <p><a href="https://github.com/ephremmatheus" target='_blank'>Github: ephremmatheus</a></p>
                    </div>
                </div>
                <hr />
                <div className="footer-rodape">
                    <p>Desenvolvido por <strong className='destaque'>Ephrem Matheus</strong> — Projeto em uso real.</p>
                </div>
            </div>
        </div>
    )
}