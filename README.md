# MyDesktop
A web-based system for managing individual or group information.

Add your most used informations and guaranteed a quickly access for this informations

## Install
```
# Clone from Repository
git clone https://github.com/GuiPolezi/MyDesktop

# Access the Repository
cd MyDesktop

# Install dependencies
npm install

# Run the Development Build
npm run dev
```

## Enviroment Variables
```
Based on .env.example file
1. Create a .env file on the root directory
2. Insert Variables:
VITE_SUPABASE_URL=####
VITE_SUPABASE_ANON_KEY=####
3. Obtain the Credencials on the supabase Project
```

## Tables Supabase
```
SQL Editor

usuarios (Connected with Auth off Supabase)
----------
CREATE TABLE public.usuarios (
  id_user UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  apelido TEXT,
  email TEXT,
  setor TEXT
);

modulos
-----------
create table public.modulos (
  id_modulo integer generated always as identity not null,
  titulo text not null,
  descricao text null,
  criado_por_id uuid null,
  atualizado_em timestamp with time zone null default now(),
  id_equipe uuid null,
  constraint modulos_pkey primary key (id_modulo),
  constraint modulos_criado_por_id_fkey foreign KEY (criado_por_id) references usuarios (id_user),
  constraint modulos_id_equipe_fkey foreign KEY (id_equipe) references equipes (id_equipe)
) TABLESPACE pg_default;

submodulos
-----------
CREATE TABLE public.submodulos (
  id_submodulo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_modulo INT REFERENCES public.modulos(id_modulo) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  criado_por_id UUID REFERENCES public.usuarios(id_user),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

cards
--------
CREATE TABLE public.cards (
  id_card INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT, 
  arquivos JSONB, 
  id_modulo INT REFERENCES public.modulos(id_modulo) ON DELETE CASCADE,
  id_submodulo INT REFERENCES public.submodulos(id_submodulo) ON DELETE CASCADE,
  criado_por_id UUID REFERENCES public.usuarios(id_user),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

equipes
------
CREATE TABLE equipes (
  id_equipe UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_por_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

membros_equipe
------
CREATE TABLE membros_equipe (
  id_equipe UUID REFERENCES equipes(id_equipe) ON DELETE CASCADE,
  id_user UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pendente', -- Pode ser 'pendente' ou 'aceito'
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id_equipe, id_user) -- Evita que a pessoa seja adicionada 2x na mesma equipe
);
```

### Policies (RLS)
<details>
<summary><b>Clique aqui para ver o Script SQL (Policies)</b></summary>

```sql
-- Ativando RLS para todas as tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submodulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_equipe ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS: USUÁRIOS
-- ==========================================
CREATE POLICY "Visualização de perfis permitida para usuários autenticados" ON public.usuarios FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários podem atualizar apenas o próprio perfil" ON public.usuarios FOR UPDATE USING (auth.uid() = id_user);

-- ==========================================
-- POLÍTICAS: EQUIPES
-- ==========================================
CREATE POLICY "Ver próprias equipes" ON public.equipes FOR SELECT USING (auth.uid() = criado_por_id OR id_equipe IN (SELECT id_equipe FROM public.membros_equipe WHERE id_user = auth.uid()));
CREATE POLICY "Permitir criação de equipe" ON public.equipes FOR INSERT WITH CHECK (auth.uid() = criado_por_id);
CREATE POLICY "Dono gerencia equipe" ON public.equipes FOR UPDATE USING (auth.uid() = criado_por_id);
CREATE POLICY "Dono exclui equipe" ON public.equipes FOR DELETE USING (auth.uid() = criado_por_id);

-- ==========================================
-- POLÍTICAS: MEMBROS DA EQUIPE
-- ==========================================
CREATE POLICY "Ver membros da própria equipe" ON public.membros_equipe FOR SELECT USING (id_equipe IN (SELECT id_equipe FROM public.equipes WHERE criado_por_id = auth.uid()) OR id_user = auth.uid());
CREATE POLICY "Permitir adicionar membros" ON public.membros_equipe FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.equipes WHERE id_equipe = public.membros_equipe.id_equipe AND criado_por_id = auth.uid()));
CREATE POLICY "Responder próprio convite" ON public.membros_equipe FOR UPDATE USING (auth.uid() = id_user);
CREATE POLICY "Sair ou remover membro" ON public.membros_equipe FOR DELETE USING (auth.uid() = id_user OR EXISTS (SELECT 1 FROM public.equipes WHERE id_equipe = public.membros_equipe.id_equipe AND criado_por_id = auth.uid()));

-- ==========================================
-- POLÍTICAS: MÓDULOS
-- ==========================================
CREATE POLICY "Ver modulos permitidos" ON public.modulos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Inserção de módulos apenas com o próprio ID" ON public.modulos FOR INSERT WITH CHECK (auth.uid() = criado_por_id);
CREATE POLICY "Atualização restrita ao criador do módulo" ON public.modulos FOR UPDATE USING (auth.uid() = criado_por_id);
CREATE POLICY "Exclusão restrita ao criador do módulo" ON public.modulos FOR DELETE USING (auth.uid() = criado_por_id);

-- ==========================================
-- POLÍTICAS: SUBMÓDULOS
-- ==========================================
CREATE POLICY "Ver submodulos permitidos" ON public.submodulos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Inserção de submódulos apenas com o próprio ID" ON public.submodulos FOR INSERT WITH CHECK (auth.uid() = criado_por_id);
CREATE POLICY "Atualização restrita ao criador do submódulo" ON public.submodulos FOR UPDATE USING (auth.uid() = criado_por_id);
CREATE POLICY "Exclusão restrita ao criador do submódulo" ON public.submodulos FOR DELETE USING (auth.uid() = criado_por_id);

-- ==========================================
-- POLÍTICAS: CARDS
-- ==========================================
CREATE POLICY "Ver cards permitidos" ON public.cards FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Inserção de cards apenas com o próprio ID" ON public.cards FOR INSERT WITH CHECK (auth.uid() = criado_por_id);
CREATE POLICY "Atualização restrita ao criador do card" ON public.cards FOR UPDATE USING (auth.uid() = criado_por_id);
CREATE POLICY "Exclusão restrita ao criador do card" ON public.cards FOR DELETE USING (auth.uid() = criado_por_id);
```
</details>

##
[![Made by GuiPolezi](https://img.shields.io/badge/Made%20by-GuiPolezi-green)](https://github.com/GuiPolezi)
![Version](https://img.shields.io/badge/Version-1.0.0-green)