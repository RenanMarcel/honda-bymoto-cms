# Debug - Honda Bymoto CMS

## Registro de Erros e Soluções

Este arquivo registra erros encontrados e suas soluções para evitar reincidência.

---

### 2025-01-13 - Configuração Inicial

**Status**: ✅ Resolvido

**Descrição**: Projeto configurado com regras de tradução em português brasileiro.

**Solução**:

- Criado PLANNING.md com regras de arquitetura e tradução
- Adicionada memory global no Windsurf com regras de tradução
- Criado TASK.md para gerenciamento de tarefas

**Lembretes**:

- Sempre usar português brasileiro em todo o código
- Seguir convenções: PascalCase para arquivos/classes, camelCase para campos, kebab-case para slugs
- Regenerar tipos após mudanças: `pnpm payload generate:types`

---

### 2025-01-13 - Erro "Cannot read properties of undefined (reading 'lexical')"

**Status**: ✅ Resolvido

**Descrição**: Runtime error na página inicial ao tentar fazer `payload.auth({ headers })` - erro "Cannot read properties of undefined (reading 'lexical')".

**Causa Raiz**: A configuração do `i18n` estava incompleta. Faltava:

1. O pacote `@payloadcms/translations` instalado
2. Import do `en` oficial do Payload
3. Configuração correta do `supportedLanguages` com `en` e `ptBR`

**Solução**:

1. Instalado `@payloadcms/translations`:
    ```bash
    pnpm add @payloadcms/translations
    ```
2. Adicionado import no `payload.config.ts`:
    ```typescript
    import { en } from "@payloadcms/translations/languages/en";
    ```
3. Configurado `supportedLanguages` corretamente:
    ```typescript
    i18n: {
        supportedLanguages: {
            pt: ptBR as any,
            en,
        },
        fallbackLanguage: "pt",
    }
    ```
4. Mudado `as GetPlatformProxyOptions` para `satisfies GetPlatformProxyOptions`

**Lembretes**:

- SEMPRE incluir pelo menos uma tradução oficial (como `en`) junto com traduções customizadas
- O Payload precisa de uma tradução base completa para funcionar
- Usar `satisfies` ao invés de `as` para type checking mais rigoroso
- Baseado no projeto União Central que funciona perfeitamente

---

### 2025-11-17 - Campo Select Dinâmico para Concessionárias

**Status**: ✅ Resolvido

**Descrição**: Necessidade de fazer o campo "local/filial" nas Motos Seminovas estar linkado com as concessionárias cadastradas no global Dados Institucionais.

**Causa Raiz**: Concessionárias são um array dentro de um global, não uma coleção separada. Não é possível usar `type: "relationship"` diretamente.

**Solução**:

1. Criado componente customizado React `ConcessionariasSelect.tsx` que:
    - Busca as concessionárias via API do global (`/api/globals/dados-institucionais`)
    - Popula um select dinamicamente com as opções
    - Usa `SelectInput` do `@payloadcms/ui`
    - Inclui estados de loading, erro e lista vazia

2. Configurado o campo `local` para usar o componente customizado:

    ```typescript
    admin: {
        components: {
            Field: "/collections/components/ConcessionariasSelect#ConcessionariasSelectField";
        }
    }
    ```

3. Adicionada tipagem TypeScript adequada para evitar erros:
    ```typescript
    const data = (await response.json()) as {
        concessionarias?: Array<{ nome: string; id: string }>;
    };
    ```

**Lembretes**:

- Para relacionamentos com arrays dentro de globals, use componentes customizados
- Sempre adicione tipagem explícita ao fazer `await response.json()`
- Use `SelectInput` do `@payloadcms/ui` para manter consistência visual
- Inclua mensagem amigável quando não houver dados cadastrados
- Componentes customizados devem usar `"use client"` no topo do arquivo
- **IMPORTANTE:** Após criar componentes customizados, sempre execute `pnpm payload generate:importmap` e reinicie o servidor

---

## Template para Novos Registros

```markdown
### YYYY-MM-DD - [Título do Erro]

**Status**: 🔴 Ativo / ⚠️ Em Progresso / ✅ Resolvido

**Descrição**: [Descrição breve do problema]

**Causa Raiz**: [O que causou o erro]

**Solução**: [Como foi resolvido]

**Lembretes**: [Pontos importantes para não repetir o erro]

---
```
