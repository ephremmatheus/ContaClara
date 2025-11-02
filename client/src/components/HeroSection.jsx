import { Link } from "react-router-dom";
import './HeroSection.css';
import React from "react";

export const HeroSection = (props) =>{


    return(
        <div className='hero-container' ref={props.homeRef}>
            {console.log(props.home)}
            <div className="hero-center">
                <div className="hero-titles">
                    <h1>Clareza e confiança nas contas</h1>
                    <p>Síndicos informam, condôminos acompanham.</p>
                </div>
                <div className="hero-btns">
                    <a href="/sistema" className="btn-comece" >ENTRAR COMO CONVIDADO</a>
                    <Link onClick={props.comoFuncionaScroll} className="btn-como">Como funciona</Link>
                </div>
            </div>
        </div>
    )
}