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
    <div className="min-h-screen py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl glass-card p-8 h-fit">
        <h2 className="text-3xl font-extrabold text-mist mb-6">Criar Módulo para a Equipe</h2>

        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Título do Módulo *</label>
            <input
              type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required
              className="field px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Descrição</label>
            <textarea
              value={descricao} onChange={e => setDescricao(e.target.value)} rows="3"
              className="field px-4 py-3 resize-none"
            />
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <Link to={`/equipe/${idEquipe}`} className="px-6 py-3 text-fog font-medium hover:bg-white/10 rounded-lg">
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
              {loading ? 'Criando...' : 'Criar Módulo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}