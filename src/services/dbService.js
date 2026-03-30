import { supabase } from './supabase'

export const dbService = {
  // 1. Criar Módulo
  // Atualizando para receber setorPermitido
  async criarModulo(titulo, descricao, setorPermitido = 'todos') {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('modulos')
      .insert([{ 
        titulo, 
        descricao, 
        criado_por_id: user.id,
        setor_permitido: setorPermitido,
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
    .maybeSingle() // Garante que retorne apenas 1 objeto e nao um array
    

    if (error) throw error
    return data
  },

 // 1.1.1 Obter lista de Modulo
  async getModuloList() {
    const { data, error } = await supabase
    .from('modulos')
    .select('*') // Pega todas as colunas
    .order('id_modulo')

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
  async criarCard(titulo, conteudo, arquivos=null, idModulo, idSubmodulo=null) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('cards')
      .insert([{ 
        titulo, 
        conteudo, 
        arquivos: arquivos,
        id_modulo: idModulo, 
        id_submodulo: idSubmodulo, 
        criado_por_id: user.id 
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // 3.3 Obter cards modulo (Exige ID_Modulo)
  async getCardsModule(idModulo) {
    const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id_modulo', idModulo)
    .is('id_submodulo', null)
    .order('id_card', {ascending: false})
    
    if (error) throw error
    return data
  },

  // 3.3.3 obter Cards Submodulo (Exige ID_submodulo) 
  async getCardsSubmodule(idSubModulo) {
    const {data, error} = await supabase
    .from('cards')
    .select('*')
    .eq('id_submodulo', idSubModulo)
    .order('id_card', {ascending: false})
    
    if (error) throw error
    return data
  },

  // 4. Obter Lista de modulos com funções de filtragem
  async getLoopModules() {
    // Primeiro descobre o usuario e qual o setor dele
    const usuario = await this.getUsers();
    if (!usuario) throw new Error('usuario não autenticado');

    const setorDoUser = usuario.setor;

    let query = supabase
      .from('modulos')
      .select('*') // Traz a lista de objetos
      .order('id_modulo', { ascending: true }); 
    
    // Regra de negocio: se não for admin, filtra os modulos
    if (setorDoUser !== 'administrador') {
      // retorna os modulos onde setor_permitido é 'todos' ou igual ao setor do usuario
      query = query.or(`setor_permitido.eq.todos,setor_permitido.eq.${setorDoUser}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;

  },


  // 5. Obter nome do usuario
  async getNameUser(idUser) {
    const {data, error} = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_user', idUser)
    .single() // Obtendo apenas o objeto e nao a lista

    if (error) throw error
    return data
  },

  // 6. Obter usuario completo
  async getUsers() {
    const {data: {user} } = await supabase.auth.getUser()
    if (!user) return null;

    const {data, error} = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_user', user.id)
    .single()

    if (error) throw error
    return data
  },


  // 7. Obter todos os usuarios (para painel admin)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome', { ascending: true })

    if (error) throw error
    return data
  },


  /* ------------ EXCLUSÕES --------- */

 // Excluir Card
 async deleteCard(idCard) {
  const {data, error} = await supabase
  .from('cards')
  .delete()
  .eq('id_card', idCard) // Filtra pelo id do card
  .select() // 🔹 Obriga o Supabase a devolver a linha que foi apagada
 
  if (error) throw error
  // Aqui nós forçamos o erro para o React entender que falhou!
  if (!data || data.length === 0) {
    throw new Error("Ação não permitida. Apenas o criador pode excluir este card.");
  }
  return data
},

  // Excluir Modulo
  async deleteModule(idModulo) {
    const {data, error} = await supabase
    .from('modulos')
    .delete()
    .eq('id_modulo', idModulo) // Filtra pelo id
    .select() // 🔹 Obriga o Supabase a devolver a linha que foi apagada

    if (error) throw error
    // Aqui nós forçamos o erro para o React entender que falhou!
    if (!data || data.length === 0) {
      throw new Error("Ação não permitida. Apenas o criador pode excluir este modulo.");
    }
    return data

  },

  // Excluir SubModulo
  async deleteSubModule(idSubModulo) {
    const { data, error } = await supabase
    .from('submodulos')
    .delete()
    .eq('id_submodulo', idSubModulo) // Filtra pelo id
    .select() // Obriga o supabase devolver a linha que foi apagada

    if (error) throw error
    // Aqui nós forçamos o erro para o React entender que falhou!
    if (!data || data.length === 0) {
      throw new Error("Ação não permitida. Apenas o criador pode excluir este submodulo.");
    }
    return data
  },

  /* ------------- Edições ------------ */

  // Editar Card
  async updateCard(idCard, dadosAtualizados) {
    try {
      const { data, error } = await supabase
      .from('cards') // Nome da tabela
      .update(dadosAtualizados) // Passando objeto com as alterações
      .eq('id_card', idCard) // Garante que apenas o card com id especificado seja alterado
      .select() // Opcional: Faz o supabase devolver o objeto atualizado
  
      if (error) {
        throw new Error(error.message)
      }
  
      return data;
    } catch (error) {
      console.error("Erro no dbservice ao tentar atualizar dados de Card")
      throw error;
    }
    
  },

  // Editar Módulo
  async updateModule(idModulo, dadosAtualizados) {
    try {
      const {data, error} = await supabase
      .from('modulos') // Nome da tabela
      .update(dadosAtualizados) // Passando objeto com as alterações
      .eq('id_modulo', idModulo) // Garante que apenas o modulo com id especificado seja alterado
      .select() // Opcional: Faz supabase devolver o objeto atualizado
    
      if (error) {
        throw new Error(error.message)
      }

      return data;
    } catch (error) {
      console.error("Erro no dbservice ao tentar atualizar Módulo")
      throw error;
    }
  },

  // Editar submódulo
  async updateSubmodule(idSubModulo, dadosAtualizados) {
    try {
      const {data, error } = await supabase
      .from('submodulos')
      .update(dadosAtualizados)
      .eq('id_submodulo', idSubModulo)
      .select()

      if (error) {
        throw new Error(error.message)
      }

      return data;
    } catch (error) {
      console.error("Erro no dbservice ao tentar atualizar SubMódulo")
      throw error;
    }
  },

   // Editar setor do usuario (para painel admin)
  async updateSetorUser(idUser, novoSetor) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ setor: novoSetor })
      .eq('id_user', idUser)
      .select()

    if (error) throw error
    return data
  },

  // Editar setor Permitido do modulo (para painek admin)
  async updateSetorPermitido(idModulo, novoSetorPermitido) {
    const {data, error} = await supabase
    .from('modulos')
    .update({setor_permitido: novoSetorPermitido})
    .eq('id_modulo', idModulo)
    .select()

    if (error) throw error
    return data
  }

}
