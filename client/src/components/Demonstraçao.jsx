import './Demonstraçao.css';

export const Demonstraçao = (props) =>{
    return(
        <div className="demo-container" ref={props.demoRef}>
            <h3>Demonstração</h3>
            <div className="demo-center">
                <div className="demo">
                    <p>demonstração 1</p>
                    <p>demonstração 2</p>
                    <p>demonstração 3</p>
                    <p>demonstração 4</p>
                </div>
            </div>
            
        </div>
    )
}