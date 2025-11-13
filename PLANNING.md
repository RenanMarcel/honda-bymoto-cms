# Planejamento - Honda Bymoto CMS

## Arquitetura

Este projeto utiliza **Payload CMS 3.0** com **Cloudflare Workers** como runtime.

### Stack Técnico:
- **CMS**: Payload CMS 3.0
- **Runtime**: Cloudflare Workers
- **Database**: PostgreSQL (via Cloudflare Hyperdrive)
- **Storage**: Cloudflare R2
- **Linguagem**: TypeScript
- **Build**: Vite

## Estrutura do Projeto

```
src/
├── collections/        # Coleções do CMS
│   ├── Usuarios.ts
│   └── Midia.ts
├── components/         # Componentes React customizados
│   ├── Logo.tsx       # Logo do admin
│   └── Icon.tsx       # Ícone do admin
├── i18n/              # Traduções
│   └── pt-BR.ts       # Tradução customizada pt-BR
├── app/
│   └── (frontend)/
│       └── page.tsx   # Página inicial
└── payload.config.ts  # Configuração principal

public/
└── images/            # Imagens estáticas
    └── honda-bymoto-logo.svg  # Logo da concessionária
```

## 🇧🇷 Regras de Tradução

**TODO O CÓDIGO DEVE SER ESCRITO EM PORTUGUÊS BRASILEIRO**

### O que traduzir:
- ✅ Nomes de arquivos, classes e exports
- ✅ Slugs de coleções/rotas
- ✅ Nomes de campos (properties)
- ✅ Labels, descriptions e help texts
- ✅ Values de options/select
- ✅ Comentários e documentação

### Exceções (manter em inglês):
- Termos técnicos: `slug`, `email`, `url`, `upload`
- Propriedades CSS: `padding`, `margin`, `background`
- Campos do sistema: `id`, `createdAt`, `updatedAt`
- Tipos do framework: `CollectionConfig`, `Field`, etc.

### Convenções de nomenclatura:
- **Arquivos**: PascalCase (`Produtos.ts`, `DadosEmpresa.ts`)
- **Classes/Exports**: PascalCase (`Produtos`, `DadosEmpresa`)
- **Slugs**: kebab-case (`produtos`, `dados-empresa`)
- **Campos**: camelCase (`nomeProduto`, `precoPromocional`)
- **Labels**: Texto normal (`Nome do Produto`, `Preço Promocional`)

### Exemplo completo:
```typescript
// src/collections/Produtos.ts
export const Produtos: CollectionConfig = {
  slug: 'produtos',
  labels: {
    singular: 'Produto',
    plural: 'Produtos',
  },
  fields: [
    {
      name: 'nomeCompleto',
      label: 'Nome Completo',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome completo do produto',
      },
    },
    {
      name: 'cor',
      label: 'Cor',
      type: 'select',
      options: [
        { label: 'Vermelho', value: 'vermelho' },
        { label: 'Azul', value: 'azul' },
      ],
    },
  ],
}
```

## Branding

O sistema possui branding customizado:
- **Logo**: Arquivo SVG da concessionária (`public/images/honda-bymoto-logo.svg`)
- **Icon**: Versão reduzida do logo (32x32px)
- **Title Suffix**: "- Honda Bymoto CMS"

Componentes customizados:
- `src/components/Logo.tsx` - Exibido na tela de login e no topo do admin (200px)
- `src/components/Icon.tsx` - Exibido na aba do navegador (32px)

### Arquivos Estáticos
Imagens e arquivos estáticos devem ficar na pasta `public/`:
- `public/images/` - Logos, ícones e imagens do sistema
- Arquivos acessíveis via `/images/nome-arquivo.ext` no frontend

## Endpoints da API

```
GET /api/usuarios
GET /api/midia
```

## Padrões de Código

### Organização de Arquivos
- Máximo de 500 linhas por arquivo
- Um export por arquivo
- Imports relativos dentro de módulos

### Estilo de Código
- TypeScript com tipagem estrita
- Evitar uso de `any`
- JSDoc em métodos públicos
- Comentários inline em português para explicar lógica complexa

### Funções
- Máximo 20 linhas por função
- Single responsibility
- Early returns para evitar aninhamento
- Arrow functions para casos simples (<3 instruções)

## Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Deploy
pnpm deploy

# Gerar tipos TypeScript
pnpm payload generate:types

# Migração do banco
pnpm payload migrate

# Linting
pnpm lint
pnpm format
```

## Metas e Objetivos

- Interface de administração totalmente em português
- Código legível e manutenível por equipe brasileira
- API RESTful intuitiva com endpoints em português
- Performance otimizada com Cloudflare Workers
- Fácil integração com frontend Astro

## Notas Importantes

- Sempre regenerar tipos após mudanças nas collections: `pnpm payload generate:types`
- Testar localmente antes de fazer deploy
- Validar todas as entradas de usuário
- Seguir convenções de nomenclatura estabelecidas
