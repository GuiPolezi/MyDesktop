import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
// 🔹 Importe o componente que lista os cards do submódulo (vamos criar ele no Passo 2)
import { GetCardsSubModule } from '../components/Cards'; // Ajuste o caminho se necessário

export function SubPage() {
  // Captura o ID que vem na URL (ex: /submodulo/5)
  const { idSubmodulo } = useParams(); 
  const navigate = useNavigate(); // 🔹 hook para redirecionar
  const [submodulo, setSubmodulo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await dbService.getSubmoduloById(idSubmodulo);
        setSubmodulo(dados);
      } catch (error) {
        console.error("Erro ao carregar a página do submódulo:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [idSubmodulo]);

  // Tela de Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold text-fog animate-pulse">Carregando submódulo...</p>
      </div>
    );
  }

  // Se o usuário digitar um ID que não existe na URL
  if (!submodulo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-2xl font-bold text-mist">Submódulo não encontrado.</p>
        <Link to="/" className="text-leaf-bright hover:underline font-medium">&larr; Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <button type='button' onClick={() => navigate(-1)} style={{background: 'none'}} className="group inline-flex items-center text-sm font-semibold text-fog hover:text-leaf-bright mb-10 transition-all duration-300">
             <div className="p-2 mr-3 bg-white/10 rounded-full border border-white/10 group-hover:bg-white/15 group-hover:-translate-x-1 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </div>
          Voltar
        </button>
        {/* Botão Voltar com Efeito de Hover 
        <Link 
          to="/" 
          className="group inline-flex items-center text-sm font-semibold text-gray-400 hover:text-[#283618] mb-10 transition-all duration-300"
        >
          <div className="p-2 mr-3 bg-white rounded-full shadow-sm border border-gray-100 group-hover:shadow-md group-hover:-translate-x-1 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </div>
          Voltar para o Início
        </Link>
        */}
        {/* Header Card: Design Minimalista e Flutuante */}
        <header className="relative glass-card p-8 md:p-12 mb-12 overflow-hidden rounded-3xl">
          {/* Detalhe Decorativo de Fundo */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-leaf/15 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-leaf-deep text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.15em]">
                Submódulo
              </span>
              <div className="h-1 w-1 rounded-full bg-white/30" />
              <span className="text-sm font-medium text-fog">
                Módulo <span className="text-gray-300">#{submodulo.id_modulo}</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-mist tracking-tight mb-6 leading-tight">
              {submodulo.titulo}
            </h1>

            {submodulo.descricao && (
              <p className="text-lg text-fog leading-relaxed max-w-2xl font-light">
                {submodulo.descricao}
              </p>
            )}
          </div>
        </header>

        {/* Seção de Conteúdo */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-2xl font-bold text-mist tracking-tight">Cards de Conteúdo</h2>
              <p className="text-fog text-sm mt-1 font-medium">Explore e gerencie seus materiais de estudo.</p>
            </div>
            
            <Link
              to={`/criarcard/${submodulo.id_modulo}/${submodulo.id_submodulo}`}
              className='createCardSub'
            >
             + Adicionar Card
            </Link>
          </div>

          {/* Lista de Cards */}
          <div className="py-4">
            <GetCardsSubModule idSubModulo={submodulo.id_submodulo} />
          </div>
        </section>

      </div>
    </main>
  );
}