import { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { Link, useParams } from 'react-router-dom';
import { LoopModuleEquipe } from '../components/GerenciarEquipe';


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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-fog">Carregando suas equipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Seção de Convites Pendentes */}
        {convites.length > 0 && (
          <div className="bg-amber-400/10 border border-amber-400/25 p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
               Você tem convites pendentes!
            </h2>
            <div className="flex flex-col gap-3">
              {convites.map(convite => (
                <div key={convite.id_equipe} className="bg-white/5 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center border border-white/10 gap-4">
                  <span className="font-semibold text-gray-300">
                    Você foi convidado para: <span className="text-mist">{convite.nome}</span>
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRespostaConvite(convite.id_equipe, false)}
                      className="btn-danger flex-1 sm:flex-none px-4 py-2 font-medium text-sm"
                    >
                      Recusar
                    </button>
                    <button
                      onClick={() => handleRespostaConvite(convite.id_equipe, true)}
                      className="btn-primary flex-1 sm:flex-none px-4 py-2 font-medium text-sm"
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
        <Link to="/" className='homePageLink text-leaf-bright'>Página Inicial</Link>
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-3xl font-extrabold text-mist">Minhas Equipes</h1>
          {equipes.length > 0  && (
            <Link
              to="/equipes/criar"
              className="font-semibold px-4 py-2 rounded-lg text-leaf-bright bg-leaf/15 hover:bg-leaf/25 transition"
            >
              + Criar Equipe
            </Link>
          )}
        </div>

        {/* Lista de Equipes */}
        {equipes.length === 0 ? (
          <div className="glass-card p-12 text-center mt-4">
            <h3 className="text-xl font-bold text-mist mb-2">Nenhuma equipe encontrada</h3>
            <p className="text-fog mb-6">Você ainda não participa ou criou nenhuma equipe no sistema.</p>
            <Link
              to="/equipes/criar"
              className="btn-primary inline-block px-6 py-3 font-medium"
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
                className="group glass-card p-6 hover:border-leaf/50 hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40"
              >
                <h2 className="text-2xl font-bold text-mist group-hover:text-leaf-bright transition-colors">{equipe.nome}</h2>
                <span className="text-sm text-fog mt-3 group-hover:text-gray-300">Acessar área de trabalho &rarr;</span>
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

  // Cria estado para armazenar texto da pesquisa
  const [termoBusca, setTermoBusca] = useState('')

  // Novo estado para guardar o nome da equipe
  const [nomeEquipe, setNomeEquipe] = useState('');


  // Função para evitar que a página recarregue ao apertar enter ou clicar no submit
  const handlePesquisa = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    async function carregarModulos() {
      try {
        // busca de nome
        const equipeDados = await dbService.getEquipeById(idEquipe);
        setNomeEquipe(equipeDados.nome);

        // Busca modulos
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
    <div className="p-4 sm:p-8 w-full mx-auto min-h-screen">

      {/* 🔹 CABEÇALHO MODERNO E RESPONSIVO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">

        {/* Lado Esquerdo: Voltar + Título */}
        <div className="flex flex-col gap-2">
          <Link
            to="/equipes"
            className="text-sm font-medium text-fog hover:text-mist transition-colors flex items-center gap-2 w-fit"
          >
            <span>&larr;</span> Voltar para Minhas Equipes
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-mist tracking-tight">
            Área da Equipe
          </h1>
          <p>{nomeEquipe}</p>
          <div className="pesquisaEquipe">
          <form onSubmit={handlePesquisa} className='flex align-center justify-center gap-5 p-2'>
              <p className='flex flex-col justify-center'>
                Nome
              </p>
              <input className='w-full p-1 max-w-md' type="text" placeholder='Digite o nome do módulo' value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}/>
              <button className='text-center btn-primary'>
                <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                </svg>
              </button>
          </form>
          </div>
        </div>

        {/* Lado Direito: Ações (Botões) */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 md:mt-0">
          
          {/* Botão Secundário: Membros */}
          <Link
            to={`/equipe/${idEquipe}/membros`}
            className="btn-ghost text-sm font-semibold px-4 py-2.5 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-leaf-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Membros
          </Link>

          {/* Botão Principal: Criar Módulo */}
          <Link
            to={`/equipe/${idEquipe}/criar-modulo`}
            className="btn-primary text-sm sm:text-base px-5 py-2.5 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Criar Módulo
          </Link>

        </div>
      </div>

      {/* 🔹 CORPO DA PÁGINA */}
      {modulosEquipe.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/5 rounded-2xl border border-dashed border-white/15">
          <p className="text-gray-300 text-lg font-medium">Nenhum módulo criado nesta equipe ainda.</p>
          <p className="text-fog text-sm mt-2">Clique no botão acima para estruturar sua área de trabalho.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
           <LoopModuleEquipe idEquipe={idEquipe} termoBusca={termoBusca}/>
        </div>
      )}
    </div>
  );
}