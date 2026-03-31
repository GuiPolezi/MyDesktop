import { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Link, useNavigate, useParams } from 'react-router-dom';


export function CriarEquipe() {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCriar = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const novaEquipe = await dbService.criarEquipe(nome);
      alert(`Equipe "${novaEquipe.nome}" criada com sucesso!`);
      
      // Redireciona o usuário direto para a página da equipe recém-criada
      navigate(`/equipe/${novaEquipe.id_equipe}`);
    } catch (error) {
      alert("Erro ao criar equipe: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 h-fit border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Nova Equipe</h2>
        <p className="text-gray-500 text-sm mb-6">Crie um espaço de trabalho colaborativo.</p>
        
        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Equipe *</label>
            <input 
              type="text" 
              placeholder="Ex: Time de Marketing"
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link to="/equipes" className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#283618] text-black font-semibold py-3 px-8 rounded-lg shadow-md"
            >
              {loading ? 'Criando...' : 'Criar Equipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MembrosEquipe() {
  const { idEquipe } = useParams();
  const [membros, setMembros] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca quem já está na equipe
        const membrosAtuais = await dbService.getMembrosDaEquipe(idEquipe);
        setMembros(membrosAtuais);

        // Busca todos os usuários do sistema para o dropdown de convite
        const usuarios = await dbService.getAllUsers();
        setTodosUsuarios(usuarios);
      } catch (error) {
        alert("Erro ao carregar dados: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [idEquipe]);

  const handleAdicionarMembro = async (e) => {
    e.preventDefault();
    if (!usuarioSelecionado) return;
    
    setAdicionando(true);
    try {
      await dbService.adicionarMembroEquipe(idEquipe, usuarioSelecionado);
      alert("Convite enviado com sucesso!");
      
      // Recarrega a lista de membros atualizada
      const membrosAtualizados = await dbService.getMembrosDaEquipe(idEquipe);
      setMembros(membrosAtualizados);
      setUsuarioSelecionado(''); // Limpa o select
    } catch (error) {
      alert(error.message);
    } finally {
      setAdicionando(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando membros...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      {/* Cabeçalho e Navegação */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Membros da Equipe</h1>
          <Link to={`/equipe/${idEquipe}`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            &larr; Voltar para os Módulos da Equipe
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Formulário para Convidar novos membros */}
        <div className="col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4">Convidar Membro</h3>
          <form onSubmit={handleAdicionarMembro} className="flex flex-col gap-4">
            <select 
              value={usuarioSelecionado} 
              onChange={e => setUsuarioSelecionado(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Selecione um usuário...</option>
              {todosUsuarios.map(user => (
                <option key={user.id_user} value={user.id_user}>
                  {user.nome} ({user.email})
                </option>
              ))}
            </select>
            
            <button 
              type="submit" 
              disabled={adicionando || !usuarioSelecionado}
              className="bg-[#283618] text-black py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {adicionando ? 'Enviando...' : 'Enviar Convite'}
            </button>
          </form>
        </div>

        {/* Lista de membros atuais */}
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Integrantes ({membros.length})</h3>
          
          <div className="flex flex-col gap-3">
            {membros.map(membro => (
              <div key={membro.id_user} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">{membro.nome}</p>
                  <p className="text-sm text-gray-500">{membro.email} | Setor: {membro.setor}</p>
                </div>
                {/* 🔹 Estilização dinâmica baseada no status */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  membro.status === 'pendente' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {membro.status === 'pendente' ? 'Aguardando Aceite' : 'Aceito'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}