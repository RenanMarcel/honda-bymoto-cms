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

````bash
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
Perfis de Acesso (perfis-acesso) - Grupos de usuários e níveis de acesso por coleção/menus
Mídia (midia) - Upload e armazenamento de arquivos no R2
Banners Página Inicial (banners-pagina-inicial) - Banners da página inicial do site
Motos Novas (motos-novas) - Catálogo de motos novas com dados financeiros

Globals
Dados Institucionais (dados-institucionais) - Informações da empresa e concessionárias
Parâmetros (parametros) - Configurações e parâmetros globais do site

Endpoints da API
GET /api/usuarios
GET /api/perfis-acesso
GET /api/midia
GET /api/banners-pagina-inicial
GET /api/motos-novas
GET /api/globals/dados-institucionais
GET /api/globals/parametros
Tradução pt-BR
O sistema utiliza traduções customizadas em português brasileiro. Veja
src/i18n/pt-BR.ts
 para as traduções completas.

## 🛡️ Biblioteca de Validações

O projeto inclui uma biblioteca reutilizável de validações em `src/lib/validations.ts` com funções para:

### Validadores Disponíveis

- **`validateCNPJ(value)`** - Valida CNPJ brasileiro com verificação de dígitos
- **`validateCEP(value)`** - Valida CEP brasileiro (8 dígitos)
- **`validateURL(required)`** - Valida URLs com protocolo http/https
- **`validateCountryCode(value)`** - Valida código de país (1-3 dígitos)
- **`validateBrazilianPhone(value)`** - Valida telefone brasileiro com DDD
- **`validateEmail(required)`** - Validação adicional de e-mail
- **`validatePositiveInteger(required)`** - Valida números inteiros positivos
- **`validateSocialMediaURL(platform)`** - Valida URLs de redes sociais específicas
- **`validateNotEmpty(fieldName)`** - Valida campos não vazios

### Formatadores Disponíveis

- **`formatCNPJ(value)`** - Formata CNPJ: `12.345.678/0001-90`
- **`formatCEP(value)`** - Formata CEP: `12345-678`
- **`formatBrazilianPhone(value)`** - Formata telefone: `(11) 98765-4321`
- **`removeNonNumeric(value)`** - Remove caracteres não numéricos

### Exemplo de Uso

```typescript
import { validateCNPJ, formatCNPJ } from "@/lib/validations";

{
    name: "cnpj",
    type: "text",
    hooks: {
        afterChange: [({ value }) => formatCNPJ(value)],
    },
    validate: validateCNPJ,
}
```

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

### Documentação do Projeto

- **[PLANNING.md](./PLANNING.md)** - Arquitetura e padrões do projeto
- **[TASK.md](./TASK.md)** - Gerenciamento de tarefas
- **[DEBUG.md](./DEBUG.md)** - Registro de erros e soluções

### Documentação das APIs

- **[BANNERS.md](./BANNERS.md)** - API de Banners da Página Inicial
- **[DADOS-INSTITUCIONAIS.md](./DADOS-INSTITUCIONAIS.md)** - API de Dados Institucionais
- **[PARAMETROS.md](./PARAMETROS.md)** - API de Parâmetros do Site
- **[MOTOS-NOVAS.md](./MOTOS-NOVAS.md)** - API de Motos Novas (Dados Financeiros)

### Links Externos

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
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

 Payload CMS Docs
 Cloudflare Workers Docs
 Desenvolvido com ❤️ para Honda Bymoto

 ## Exemplo de uso do componente de alerta no admin

 O componente `AlertBox` pode ser usado como um campo de interface (`type: "ui"`) em qualquer collection do Payload para exibir mensagens informativas para o usuário administrador.

 Exemplo de configuração de campo em uma collection:

 ```ts
 {
     name: "alertaAjuda",
     type: "ui",
     admin: {
         components: {
             Field: "/components/AlertBox#AlertBox",
         },
     },
 }
````

Exemplo de implementação do componente `AlertBox` usando o sistema de alertas da interface:

```tsx
import React from "react";
import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const AlertBox: React.FC = () => {
    return (
        <div className="grid w-full max-w-sm items-start gap-4 rounded-2xl">
            <Alert>
                <CheckCircle2Icon />
                <AlertTitle>Alterações salvas com sucesso</AlertTitle>
                <AlertDescription>Este é um exemplo de alerta com ícone, título e descrição.</AlertDescription>
            </Alert>
        </div>
    );
};
```
