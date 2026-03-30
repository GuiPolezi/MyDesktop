import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { dbService } from '../services/dbService';

export function AdminRoute({ session, children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔹 O SEGREDO DEFINITIVO: Variável para guardar a sessão atual
  const [sessaoAtual, setSessaoAtual] = useState(session);

  // Se a sessão mudou subitamente (ex: terminou de carregar o login),
  // nós resetamos o estado de loading ANTES do componente renderizar o resto.
  if (session !== sessaoAtual) {
    setSessaoAtual(session);
    setLoading(true);
    setIsAdmin(null);
  }

  useEffect(() => {
    async function verificarPermissao() {
      // Se não tiver sessão, não precisa nem checar o banco
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const usuario = await dbService.getUsers();
        
        // 🔹 DICA: Voltei com o trim() e toLowerCase() por segurança. 
        // Isso evita que um espaço invisível no banco ("administrador ") quebre o código.
        const setorFormatado = usuario?.setor?.trim().toLowerCase();

        if (setorFormatado === 'administrador') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    verificarPermissao();
  }, [session]);

  // 1. Bloqueia a tela enquanto não tem certeza absoluta
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold">Verificando permissões de acesso...</p>
      </div>
    );
  }

  // 2. Se verificou e não está logado
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se verificou e NÃO É administrador
  if (isAdmin === false) {
   // console.warn("Redirecionando: Usuário não possui privilégios de admin.");
    return <Navigate to="/" replace />;
  }

  // 4. Tudo certo, é admin e está logado! Renderiza a página
  return children;
}