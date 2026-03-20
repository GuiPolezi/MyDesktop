import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dbService } from '../services/dbService'
import { useNavigate } from "react-router-dom";

export function CriarCards() {
    const { idModulo, idSubModulo } = useParams();
    const navigate = useNavigate(); // 🔹 hook para redirecionar

    const [titulo, setTitulo] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [arquivos, setArquivos] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleCriar = async (e) => {
        e.preventDefault()

        // Validação de segurança: não deixa criar se não houver um ID de módulo pai
        if (!idModulo) {
            alert("Erro: Este Card precisa estar vinculado a um módulo!")
            return
        }

        setLoading(true)

        try {
            const novoCard = await dbService.criarCard(titulo, conteudo, arquivos, idModulo, idSubModulo)
            alert(`Card "${novoCard.titulo}" criado com sucesso! ID: ${novoCard.id_card}`)

            navigate('/') // Redireciona para página inicial após criação
        } catch (error) {
            alert("Erro ao criar: " + error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <form onSubmit={handleCriar} style={{ marginBottom: '2rem' }}>
            <h4>Adicionar Card ao Módulo {idModulo}</h4>
            {idSubModulo && <p>Vinculado ao Submódulo: {idSubModulo}</p>}

            <h3>1. Criar Novo Card</h3>
            <input 
                placeholder="Título do Card" 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
                required 
            />
            <input 
                placeholder="Conteúdo do card" 
                value={conteudo} 
                onChange={e => setConteudo(e.target.value)} 
            />
            {/*  Para arquivos, não usamos 'value'. 
                Se for apenas o nome do arquivo para o JSONB: */}
            <input 
                type="file" 
                onChange={e => setArquivos(e.target.files[0]?.name)} 
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Card'}
            </button>
        </form>
    )
}