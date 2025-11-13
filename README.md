# Honda Bymoto CMS

Sistema de gerenciamento de conteúdo para Honda Bymoto construído com Payload CMS 3.0 e Cloudflare Workers.

## 🇧🇷 Idioma Padrão: Português Brasileiro

Todo o sistema está configurado em **português brasileiro**, incluindo:

- Interface de administração
- Collections e campos
- Mensagens e validações
- Documentação do código

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- pnpm
- Conta Cloudflare

### Configuração Local

```bash
# Instalar dependências
pnpm install

# Fazer login no Cloudflare
pnpm wrangler login

# Iniciar servidor de desenvolvimento
pnpm dev
O admin estará disponível em: http://localhost:3000/admin

📋 Estrutura do Projeto
Collections
Usuários (usuarios) - Autenticação e gerenciamento de usuários
Mídia (midia) - Upload e armazenamento de arquivos no R2
Endpoints da API
GET /api/usuarios
GET /api/midia
Tradução pt-BR
O sistema utiliza traduções customizadas em português brasileiro. Veja
src/i18n/pt-BR.ts
 para as traduções completas.

🗄️ Banco de Dados e Armazenamento
D1 Database (SQLite)
Banco de dados SQLite gerenciado pelo Cloudflare D1.

R2 Storage
Armazenamento de arquivos no Cloudflare R2 com integração automática.

📝 Comandos Úteis
bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Deploy para produção
pnpm deploy

# Gerar tipos TypeScript
pnpm payload generate:types

# Criar migração
pnpm payload migrate:create

# Executar migrações
pnpm payload migrate

# Formatar código
pnpm format

# Lint
pnpm lint
🔧 Regras de Desenvolvimento
Tradução Obrigatória
TODO O CÓDIGO DEVE SER ESCRITO EM PORTUGUÊS BRASILEIRO

Arquivos: PascalCase (Produtos.ts)
Classes/Exports: PascalCase (Produtos)
Slugs: kebab-case (produtos)
Campos: camelCase (nomeProduto)
Labels: Texto normal (Nome do Produto)
Veja
PLANNING.md
 para mais detalhes sobre padrões de código e arquitetura.

Convenções de Código
typescript
// ✅ CORRETO - Tudo em português
export const Produtos: CollectionConfig = {
    slug: 'produtos',
    labels: {
        singular: 'Produto',
        plural: 'Produtos',
    },
    fields: [
        {
            name: 'nomeProduto',
            label: 'Nome do Produto',
            type: 'text',
        },
    ],
}

// ❌ ERRADO - Não use inglês
export const Products: CollectionConfig = {
    slug: 'products',
    fields: [
        {
            name: 'productName',
            label: 'Product Name',
        },
    ],
}
🚀 Deploy
bash
# 1. Criar migrações (se houver alterações no schema)
pnpm payload migrate:create

# 2. Deploy para produção
pnpm deploy
O comando deploy irá:

Executar migrações pendentes
Fazer build da aplicação
Fazer deploy no Cloudflare Workers
📚 Documentação
PLANNING.md
 - Arquitetura e padrões do projeto
TASK.md
 - Gerenciamento de tarefas
DEBUG.md
 - Registro de erros e soluções
Payload CMS Docs
Cloudflare Workers Docs
⚠️ Observações Importantes
Plano Pago do Workers: Necessário devido ao tamanho do bundle (limite de 3MB)
GraphQL: Suporte limitado no Cloudflare Workers
Sharp: Não disponível no Workers (crop e focalPoint desabilitados)
🛠️ Stack Técnica
CMS: Payload CMS 3.0
Framework: Next.js 15
Runtime: Cloudflare Workers
Database: D1 (SQLite)
Storage: R2
Language: TypeScript
Build: Vite
📁 Estrutura de Pastas
src/
├── collections/        # Coleções do CMS
│   ├── Usuarios.ts
│   └── Midia.ts
├── i18n/              # Traduções
│   └── pt-BR.ts
├── migrations/        # Migrações do banco
└── payload.config.ts  # Configuração principal
🌐 Variáveis de Ambiente
env
PAYLOAD_SECRET=sua-chave-secreta-aqui
DATABASE_URI=cloudflare-d1
CLOUDFLARE_ACCOUNT_ID=seu-account-id
📞 Suporte
Para dúvidas sobre:

Payload CMS: Discord ou GitHub Discussions
Cloudflare Workers: Documentação
Desenvolvido com ❤️ para Honda Bymoto
```
