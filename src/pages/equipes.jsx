import { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { Link, useParams } from 'react-router-dom';
import { GetModulo } from '../components/Modulo';


export function MinhasEquipes() {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [convites, setConvites] = useState([]);

  useEffect(() => {
    // 1. Corrigido: Função única para carregar tudo (Equipes e Convites)
    async function carregarDados() {
      try {
        // Busca as equipes do usuário
        const dadosEquipes = await dbService.getMinhasEquipes();
        setEquipes(dadosEquipes);

        // Busca os convites pendentes
        const dadosConvites = await dbService.getConvitesPendentes();
        setConvites(dadosConvites);
        
      } catch (error) {
        alert("Erro ao carregar dados: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    
    carregarDados();
  }, []); // Array vazio garante que rode apenas 1x ao abrir a página

  const handleRespostaConvite = async (idEquipe, aceito) => {
    try {
      await dbService.responderConvite(idEquipe, aceito);
      
      // Atualiza a tela tirando o convite que foi respondido
      setConvites(convites.filter(c => c.id_equipe !== idEquipe));
      
      if (aceito) {
        // Se aceitou, busca a lista de equipes novamente no banco
        // (ideal para garantir que temos os dados reais atualizados)
        const dadosEquipes = await dbService.getMinhasEquipes();
        setEquipes(dadosEquipes);
        alert("Bem-vindo à equipe!");
      }
    } catch (error) {
      alert("Erro ao processar convite: " + error.message);
    }
  };

  // 2. Corrigido: Tela de loading posicionada corretamente
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando suas equipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Seção de Convites Pendentes */}
        {convites.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
               Você tem convites pendentes!
            </h2>
            <div className="flex flex-col gap-3">
              {convites.map(convite => (
                <div key={convite.id_equipe} className="bg-white p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center shadow-sm border border-yellow-100 gap-4">
                  <span className="font-semibold text-gray-700">
                    Você foi convidado para: <span className="text-black">{convite.nome}</span>
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleRespostaConvite(convite.id_equipe, false)}
                      className="flex-1 sm:flex-none px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium text-sm transition"
                    >
                      Recusar
                    </button>
                    <button 
                      onClick={() => handleRespostaConvite(convite.id_equipe, true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium text-sm transition shadow-sm"
                    >
                      Aceitar Convite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cabeçalho Minhas Equipes */}
        <Link to="/" className='homePageLink' style={{color: 'red'}}>Página Inicial</Link>
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Minhas Equipes</h1>
          {equipes.length > 0  && (
            <Link 
              to="/equipes/criar" 
              className="font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              style={{ color: '#606c38', backgroundColor: '#f0f2eb' }}
            >
              + Criar Equipe
            </Link>
          )}
        </div>

        {/* Lista de Equipes */}
        {equipes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center mt-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma equipe encontrada</h3>
            <p className="text-gray-500 mb-6">Você ainda não participa ou criou nenhuma equipe no sistema.</p>
            <Link 
              to="/equipes/criar" 
              className="inline-block px-6 py-3 bg-[#606c38] text-white rounded-lg font-medium hover:bg-opacity-90 transition shadow-md"
            >
              Criar minha primeira equipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {equipes.map((equipe) => (
              <Link 
                key={equipe.id_equipe} 
                to={`/equipe/${equipe.id_equipe}`} 
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#606c38] transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40"
              >
                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#606c38] transition-colors">{equipe.nome}</h2>
                <span className="text-sm text-gray-400 mt-3 group-hover:text-gray-600">Acessar área de trabalho &rarr;</span>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


export function DashboardEquipe() {
    const { idEquipe } = useParams(); // Pega o ID da URL (ex: /equipe/123)
  const [modulosEquipe, setModulosEquipe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarModulos() {
      try {
        const dados = await dbService.getModulosDaEquipe(idEquipe);
        setModulosEquipe(dados);
      } catch (error) {
        alert("Erro ao carregar módulos da equipe: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarModulos();
  }, [idEquipe]);

  if (loading) return <div className="p-8 text-center text-xl">Carregando área da equipe...</div>;

  return (
    <div className="p-4 sm:p-8 w-full mx-auto">
      
      {/* 🔹 CABEÇALHO MODERNO E RESPONSIVO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
        
        {/* Lado Esquerdo: Voltar + Título */}
        <div className="flex flex-col gap-2">
          <Link 
            to="/equipes" 
            className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-2 w-fit"
          >
            <span>&larr;</span> Voltar para Minhas Equipes
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Área da Equipe
          </h1>
        </div>

        {/* Lado Direito: Ações (Botões) */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 md:mt-0">
          
          {/* Botão Secundário: Membros */}
          <Link 
            to={`/equipe/${idEquipe}/membros`} 
            className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2 shadow-sm"
            style={{color: 'gray'}}
          >
            <svg className="w-4 h-4 text-[#606c38]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Membros
          </Link>
          
          {/* Botão Principal: Criar Módulo */}
          <Link 
            to={`/equipe/${idEquipe}/criar-modulo`} 
            className="text-sm sm:text-base px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            style={{ backgroundColor: '#283618', color: 'white' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Criar Módulo
          </Link>

        </div>
      </div>

      {/* 🔹 CORPO DA PÁGINA */}
      {modulosEquipe.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-600 text-lg font-medium">Nenhum módulo criado nesta equipe ainda.</p>
          <p className="text-gray-400 text-sm mt-2">Clique no botão acima para estruturar sua área de trabalho.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Reaproveitamos o seu componente GetModulo perfeitamente! */}
          {modulosEquipe.map((modulo) => (
            <GetModulo key={modulo.id_modulo} idModulo={modulo.id_modulo} />
          ))}
        </div>
      )}
    </div>
  );
}