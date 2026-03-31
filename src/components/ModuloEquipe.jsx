import { useState } from 'react';
import { dbService } from '../services/dbService';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function CriarModuloEquipe() {
  const { idEquipe } = useParams(); // Pega a equipe da URL
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCriar = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Chama a função NOVA que criamos, passando o idEquipe
      const novoModulo = await dbService.criarModuloEquipe(titulo, descricao, idEquipe);
      alert(`Módulo de Equipe "${novoModulo.titulo}" criado!`);
      navigate(`/equipe/${idEquipe}`); // Volta para a tela da equipe
    } catch (error) {
      alert("Erro ao criar: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 h-fit">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Criar Módulo para a Equipe</h2>
        
        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título do Módulo *</label>
            <input 
              type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required 
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea 
              value={descricao} onChange={e => setDescricao(e.target.value)} rows="3"
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white resize-none"
            />
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <Link to={`/equipe/${idEquipe}`} className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className="bg-[#283618] text-white font-semibold py-3 px-8 rounded-lg">
              {loading ? 'Criando...' : 'Criar Módulo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}