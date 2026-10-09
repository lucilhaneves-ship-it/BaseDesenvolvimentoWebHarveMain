-- Schema da tabela "clientes"
-- Como usar: abra o painel do Supabase do seu projeto -> SQL Editor -> New query
-- cole todo este arquivo e clique em "Run".

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,               -- texto, NÃO numérico (evita perder o "0" inicial, "+55" etc.)
  email text,
  cidade text,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  observacoes text,
  criado_em timestamptz not null default now()
);

-- =====================================================================
-- Dados de exemplo (opcional). Descomente as linhas abaixo e rode
-- novamente no SQL Editor se quiser começar com alguns clientes de teste.
-- =====================================================================

-- insert into clientes (nome, telefone, email, cidade, status, observacoes) values
--   ('Ana Souza', '(11) 91234-5678', 'ana.souza@email.com', 'São Paulo', 'ativo', 'Cliente desde 2023, prefere contato por WhatsApp.'),
--   ('Bruno Lima', '(21) 99876-5432', 'bruno.lima@email.com', 'Rio de Janeiro', 'ativo', 'Comprou plano anual em janeiro.'),
--   ('Carla Mendes', '(31) 98765-4321', 'carla.mendes@email.com', 'Belo Horizonte', 'inativo', 'Cancelou o serviço, avaliar retorno futuro.');
