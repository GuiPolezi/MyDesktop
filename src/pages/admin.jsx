import { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom'

export function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvandoId, setSalvandoId] = useState(null); // Controla qual linha está sendo salva no momento

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // 1. Função para buscar os usuários assim que a página abre
  async function carregarUsuarios() {
    try {
      const lista = await dbService.getAllUsers();
      setUsuarios(lista);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro ao carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Função acionada quando você troca o valor no <select>
  const handleMudarSetor = async (idUser, novoSetor, nomeUser) => {
    // Uma confirmação de segurança para evitar cliques acidentais
    const confirmar = window.confirm(`Deseja alterar o setor de ${nomeUser} para "${novoSetor}"?`);
    if (!confirmar) return;

    setSalvandoId(idUser); // Ativa o aviso de "Salvando..." apenas neste usuário
    
    try {
      await dbService.updateSetorUser(idUser, novoSetor);
      
      // Atualiza a lista na tela imediatamente (sem precisar dar F5)
      setUsuarios((usuariosAtuais) => 
        usuariosAtuais.map((user) => 
          user.id_user === idUser ? { ...user, setor: novoSetor } : user
        )
      );
      
      alert("Setor atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar setor:", error);
      alert("Erro ao salvar o novo setor. Tente novamente.");
    } finally {
      setSalvandoId(null);
    }
  };

  // Tela de loading inicial
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold">Carregando painel de usuários...</p>
      </div>
    );
  }

  return (
    <section className="p-5 lg:p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#283618' }}>Painel Administrativo</h1>
        <Link to="/" className='text-2xl'>Voltar</Link>
      <div className="bg-white mt-20 shadow-md rounded-lg overflow-hidden border">
        {/* Cabeçalho da Tabela */}
        <div className="p-5 border-b bg-gray-50">
          <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
          <p className="text-sm text-gray-500">Altere o setor e os privilégios de acesso da sua equipe.</p>
        </div>
        
        {/* Tabela Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2">
                <th className="p-4 font-semibold text-gray-700">Nome</th>
                <th className="p-4 font-semibold text-gray-700">E-mail</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Setor de Acesso</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id_user} className="border-b hover:bg-gray-50 transition-colors">
                  
                  <td className="p-4 font-medium">{user.nome || 'Sem nome'}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <select 
                        className={`border p-2 rounded w-full max-w-xs focus:ring-2 focus:outline-none 
                          ${salvandoId === user.id_user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        value={user.setor || 'comum'} // Se estiver vazio no banco, assume 'comum'
                        onChange={(e) => handleMudarSetor(user.id_user, e.target.value, user.nome)}
                        disabled={salvandoId === user.id_user} // Bloqueia enquanto salva
                        style={{ borderColor: '#283618' }}
                      >
                        {/* 🔹 Aqui ficam as opções de setores! Adicione ou remova conforme precisar */}
                        <option value="administrador">Administrador</option>
                        <option value="suporte">Suporte</option>
                        <option value="comum">Comum</option>
                      </select>
                      
                      {/* Feedback visual enquanto o banco de dados processa */}
                      {salvandoId === user.id_user && (
                        <span className="text-xs font-bold text-green-600 mt-1">Salvando...</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
              
              {/* Caso não tenha nenhum usuário (raro, mas evita tela em branco) */}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    Nenhum usuário encontrado no banco de dados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}