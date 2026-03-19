import { supabase } from './supabase'

export const dbService = {
  // 1. Criar Módulo
  async criarModulo(titulo, descricao) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('modulos')
      .insert([{ 
        titulo, 
        descricao, 
        criado_por_id: user.id 
      }])
      .select()

    if (error) throw error
    return data[0] // Retorna o módulo recém-criado (com o ID dele)
  },

  // 1.1 Obter Modulo (Exige ID modulo criado)
  async getModulo(idModulo) {
    const { data, error } = await supabase
    .from('modulos')
    .select('*') // Pega todas as colunas
    .eq('id_modulo', idModulo) // Onde a coluna id_modulo seja igual ao ID passado
    .single() // Garante que retorne apenas 1 objeto e nao um array
    

    if (error) throw error
    return data
  },

  // 2. Criar Submódulo (Exige o ID do Módulo pai)
  async criarSubmodulo(titulo, descricao, idModulo) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('submodulos')
      .insert([{ 
        titulo, 
        descricao, 
        id_modulo: idModulo, 
        criado_por_id: user.id 
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // 2.2 Obter Submodulo (Exige ID_Modulo)
  async getSubmodulo(idModulo) {
    const { data, error } = await supabase
    .from('submodulos')
    .select('*')
    .eq('id_modulo', idModulo)
    .order('id_submodulo', {ascending: false})
    
    if (error) throw error
    return data
  },

  // 3. Criar Card (Exige ID do Módulo e do Submódulo)
  async criarCard(titulo, conteudo, idModulo, idSubmodulo) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('cards')
      .insert([{ 
        titulo, 
        conteudo, 
        id_modulo: idModulo, 
        id_submodulo: idSubmodulo, 
        criado_por_id: user.id 
      }])
      .select()

    if (error) throw error
    return data[0]
  }

 
}