import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
// 🔹 Importe o componente que lista os cards do submódulo (vamos criar ele no Passo 2)
import { GetCardsSubModule } from '../components/Cards'; // Ajuste o caminho se necessário

export function SubPage() {
  // Captura o ID que vem na URL (ex: /submodulo/5)
  const { idSubmodulo } = useParams(); 
  
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-bold text-gray-600 animate-pulse">Carregando submódulo...</p>
      </div>
    );
  }

  // Se o usuário digitar um ID que não existe na URL
  if (!submodulo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
        <p className="text-2xl font-bold text-gray-800">Submódulo não encontrado.</p>
        <Link to="/" className="text-blue-600 hover:underline font-medium">&larr; Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Botão Voltar */}
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Voltar para o Início
        </Link>

        {/* Cabeçalho do Submódulo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 border-t-4" style={{ borderTopColor: '#283618' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Submódulo
            </span>
            <span className="text-sm font-medium text-gray-500">
              Vinculado ao Módulo #{submodulo.id_modulo}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{submodulo.titulo}</h1>
          {submodulo.descricao && (
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{submodulo.descricao}</p>
          )}
        </div>

        {/* Área de Cards deste Submódulo */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Cards de Conteúdo</h2>
            <p className="text-gray-500 mt-1">Materiais e anotações exclusivas desta seção.</p>
          </div>
          
          {/* Botão para criar um card que já vai cair direto dentro deste Submódulo */}
          <Link
            to={`/criarcard/${submodulo.id_modulo}/${submodulo.id_submodulo}`}
            className="px-6 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            style={{ backgroundColor: '#283618' }}
          >
            + Adicionar Card Aqui
          </Link>
        </div>

        {/* 🔹 Componente que vai listar os cards (Passo 2) */}
        <GetCardsSubModule idSubModulo={submodulo.id_submodulo} />

      </div>
    </main>
  );
}