import { Outlet } from 'react-router-dom';
import NavSistema from '../components/NavSistema';
import { useState, useEffect } from 'react';
import './Layout.css';

export default function Layout() {
    const [registros, setRegistros] = useState([]);

    // Carregar registros do localStorage ou usar meses fictícios de exemplo
    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("registros")) || [];
        if (!data.length) {
            data = [
                { 
                    mesAno: "8-2025", 
                    receitas: [{ dia: 5, descricao: "Salário", valor: 2000 }], 
                    despesas: [{ dia: 10, descricao: "Aluguel", valor: 800 }] 
                },
                { 
                    mesAno: "9-2025", 
                    receitas: [{ dia: 3, descricao: "Freela", valor: 500 }], 
                    despesas: [{ dia: 15, descricao: "Supermercado", valor: 200 }] 
                }
            ];
            localStorage.setItem("registros", JSON.stringify(data));
        }
        setRegistros(data);
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <NavSistema />
            <main>
                {/* Compartilha registros e setRegistros para filhos */}
                <Outlet context={{ registros, setRegistros }} />
            </main>
        </div>
    );
}
