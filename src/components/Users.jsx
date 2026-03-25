import { useEffect, useState } from 'react'
import { dbService } from '../services/dbService'
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário

// Função para obter nome de usuario
export function GetNameUser() {
    const [nomeUsuario, setNomeUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function obterDadosIniciais() {
            try {
                setLoading(true);

                // Obtem o usuario logado no momento (sessao do supabase)
                const {data: {user}, error: authError} = await supabase.auth.getUser();

                if (authError || !user) {
                    throw new Error("Usuário não autenticado");
                }

                // Id obtido (user.id) chamamos a função do dbservice
                const nome = await dbService.getNameUser(user.id);

                setNomeUsuario(nome);
            } catch (error) {
                console.error("Erro ao carregar perfil: ", error.message);
            } finally {
                setLoading(false);
            }
        }
        obterDadosIniciais();
    }, [])

    if (loading) return <span>Carregando...</span>

    return (
        <div>
            {nomeUsuario ? (
                <h1 className='username text-4xl lg:text-7xl'>{nomeUsuario.nome}</h1>
            ): (
                <p>Usuário não encontrado</p>
            )}
        </div>
    );

}