# Documentação - Parâmetros do Site

## Visão Geral

Global responsável pelos parâmetros de configuração do site. Controla funcionalidades, aparência, comportamento de formulários, botões dos cards e ordem das seções da home. Permite customizar o site sem alterar código.

---

## Endpoint da API

- `GET /api/globals/parametros`

> Este é um **Global** do Payload, portanto possui apenas um único documento (não é uma coleção).

---

## Exemplo de resposta (GET /api/globals/parametros)

```json
{
    "id": "1",
    "habilitarSeminovos": true,
    "exibirTenhoInteresseHeader": false,
    "exibirPrecoMotosNovas": false,
    "exibirModelosSeparadosMotosNovasGrid": true,
    "exibirModelosSeparadosConsorcioGrid": true,
    "utilizarParcelasConsorcioComSeguro": true,
    "habilitarTagsGTM": false,
    "seminovasCardCompartilhadoResumirInformacoes": false,
    "tituloPadraoSite": "Sua Concessionária – Concessionária Honda",
    "descricaoPadraoSite": "Motos novas e seminovas, consórcio, serviços e peças genuínas. Atendimento em Luziânia, Águas Lindas, Jardim Ingá, Ocidental e Cristalina!",
    "alturaLogoConcessionariaHeader": "68px",
    "alturaLogoConcessionariaFooter": "68px",
    "usarLogoConcessionariaHeaderMobile": true,
    "motosNovasTipoForm": "WebToLead",
    "testRideTipoForm": "Email",
    "webToLeadFormsTest": false,
    "separarWhatsAppLeadsConnectPorFilial": true,
    "ocultarWhatsappHeaderMobile": true,
    "cardMotosNovasTextoBotao": "TENHO INTERESSE",
    "cardMotosNovasExibirBotaoFixo": "xs",
    "cardMotosSeminovasTextoBotao": "VER DETALHES",
    "cardMotosSeminovasExibirBotaoFixo": "xs",
    "cardOfertasTextoBotao": "EU QUERO!",
    "cardOfertasExibirBotaoFixo": "xs",
    "cardConsorcioTextoBotao": "ESTOU INTERESSADO",
    "cardConsorcioExibirBotaoFixo": "xs",
    "cardServicosTextoBotao": "AGENDAR SERVIÇO",
    "cardServicosExibirBotaoFixo": "xs",
    "secoesHomeOrdem": [
        { "secao": "motos-novas", "id": "sec-1" },
        { "secao": "ofertas", "id": "sec-2" },
        { "secao": "consorcio", "id": "sec-3" },
        { "secao": "test-ride", "id": "sec-4" },
        { "secao": "motos-seminovas", "id": "sec-5" },
        { "secao": "motores-e-maquinas", "id": "sec-6" },
        { "secao": "institucional", "id": "sec-7" },
        { "secao": "servicos", "id": "sec-8" }
    ],
    "createdAt": "2025-01-14T12:00:00.000Z",
    "updatedAt": "2025-01-14T12:00:00.000Z"
}
```

---

## Interface TypeScript de Exemplo

Interface pensada para uso no frontend.

```ts
/**
 * Valores válidos para exibição de botão fixo nos cards
 */
export type ExibicaoBotaoFixo = "nenhum" | "xs" | "todos";

/**
 * Tipos de formulário disponíveis
 */
export type TipoFormMotosNovas = "LeadsConnect" | "WebToLead";
export type TipoFormTestRide = "Email" | "LeadsConnect";

/**
 * Chaves válidas para as seções da home
 */
export type ChaveSecaoHome =
    | "motos-novas"
    | "ofertas"
    | "consorcio"
    | "test-ride"
    | "motos-seminovas"
    | "motores-e-maquinas"
    | "servicos"
    | "institucional";

/**
 * Item da ordem de seções
 */
export type SecaoHomeOrdem = {
    id: string;
    secao: ChaveSecaoHome;
};

/**
 * Parâmetros globais do site
 */
export type Parametros = {
    id: string;

    // Funcionalidades
    habilitarSeminovos: boolean;
    exibirTenhoInteresseHeader: boolean;
    exibirPrecoMotosNovas: boolean;
    exibirModelosSeparadosMotosNovasGrid: boolean;
    exibirModelosSeparadosConsorcioGrid: boolean;
    utilizarParcelasConsorcioComSeguro: boolean;
    habilitarTagsGTM: boolean;
    seminovasCardCompartilhadoResumirInformacoes: boolean;

    // SEO e Branding
    tituloPadraoSite: string;
    descricaoPadraoSite: string;
    alturaLogoConcessionariaHeader: string;
    alturaLogoConcessionariaFooter: string;
    usarLogoConcessionariaHeaderMobile: boolean;

    // Formulários
    motosNovasTipoForm: TipoFormMotosNovas;
    testRideTipoForm: TipoFormTestRide;
    webToLeadFormsTest: boolean;

    // WhatsApp e Telefone
    separarWhatsAppLeadsConnectPorFilial: boolean;
    ocultarWhatsappHeaderMobile: boolean;

    // Cards - Motos Novas
    cardMotosNovasTextoBotao: string;
    cardMotosNovasExibirBotaoFixo: ExibicaoBotaoFixo;

    // Cards - Seminovas
    cardMotosSeminovasTextoBotao: string;
    cardMotosSeminovasExibirBotaoFixo: ExibicaoBotaoFixo;

    // Cards - Ofertas
    cardOfertasTextoBotao: string;
    cardOfertasExibirBotaoFixo: ExibicaoBotaoFixo;

    // Cards - Consórcio
    cardConsorcioTextoBotao: string;
    cardConsorcioExibirBotaoFixo: ExibicaoBotaoFixo;

    // Cards - Serviços
    cardServicosTextoBotao: string;
    cardServicosExibirBotaoFixo: ExibicaoBotaoFixo;

    // Ordem das Seções
    secoesHomeOrdem: SecaoHomeOrdem[];

    // Metadata
    createdAt: string;
    updatedAt: string;
};
```

---

## Boas práticas de consumo

### Cache e Performance

- **Cache Agressivo:** Por ser um global de configuração, os dados mudam raramente. Recomenda-se cachear por 24 horas ou mais.
- **Build Time:** Em sites estáticos (SSG), carregue os parâmetros no build time para melhor performance.
- **Fallbacks:** Sempre tenha valores padrão no código caso a API falhe.

### Funcionalidades

#### `habilitarSeminovos`

- Se `false`, oculte toda a seção de seminovas do site
- Remova links do menu/navegação
- Não gere rotas relacionadas a seminovas

#### `exibirTenhoInteresseHeader`

- Controla o botão "TENHO INTERESSE" no header desktop
- Útil para campanhas sazonais

#### `exibirPrecoMotosNovas`

- Mostra/oculta preços nos cards de motos novas
- Útil quando a concessionária prefere consulta por formulário

#### `exibirModelosSeparadosMotosNovasGrid` / `exibirModelosSeparadosConsorcioGrid`

- Se `true`: cria um card para cada variação/cor do modelo
- Se `false`: agrupa variações em um único card

#### `utilizarParcelasConsorcioComSeguro`

- Define qual valor de parcela usar no destaque do consórcio
- `true`: parcela com seguro incluído
- `false`: parcela sem seguro

#### `habilitarTagsGTM`

- Controla injeção do Google Tag Manager
- Use para ativar/desativar tracking temporariamente

#### `seminovasCardCompartilhadoResumirInformacoes`

- Controla o nível de detalhes no card de compartilhamento de seminovas
- `true`: resumo conciso
- `false`: lista completa de features

### SEO e Branding

#### `tituloPadraoSite` e `descricaoPadraoSite`

- Use como fallback em páginas que não têm título/descrição específicos
- Injete nas meta tags do `<head>`

```tsx
// Next.js Metadata
export async function generateMetadata() {
    const params = await getParametros();
    return {
        title: params.tituloPadraoSite,
        description: params.descricaoPadraoSite,
    };
}
```

#### `alturaLogoConcessionariaHeader` e `alturaLogoConcessionariaFooter`

- Valores em CSS (ex: `"68px"`, `"4rem"`)
- Aplique diretamente no estilo da logo:

```tsx
<img src={logo.url} alt="Logo" style={{ height: parametros.alturaLogoConcessionariaHeader }} />
```

#### `usarLogoConcessionariaHeaderMobile`

- `true`: exibe logo no header mobile
- `false`: exibe texto com nome fantasia

### Formulários

#### `motosNovasTipoForm`

- **`"LeadsConnect"`**: Carrega iframe externo do LeadsConnect
- **`"WebToLead"`**: Usa formulário nativo integrado com Salesforce

#### `testRideTipoForm`

- **`"Email"`**: Formulário nativo que envia e-mail
- **`"LeadsConnect"`**: Iframe do LeadsConnect

#### `webToLeadFormsTest`

- `true`: formulários WebToLead apontam para ambiente de teste/sandbox da Salesforce
- `false`: ambiente de produção

**Exemplo de uso:**

```tsx
function FormMotosNovas({ parametros }: { parametros: Parametros }) {
    if (parametros.motosNovasTipoForm === "LeadsConnect") {
        return <IframeLeadsConnect src={leadsConnectUrl} />;
    }
    return <FormularioWebToLead test={parametros.webToLeadFormsTest} />;
}
```

### WhatsApp e Telefone

#### `separarWhatsAppLeadsConnectPorFilial`

- `true`: botão flutuante de WhatsApp exibe menu com opção por concessionária
- `false`: link direto para WhatsApp da matriz

#### `ocultarWhatsappHeaderMobile`

- `true`: oculta botão de WhatsApp no header mobile, mostra só telefone
- `false`: exibe ambos os botões

### Cards e Botões

Todos os cards possuem dois parâmetros:

1. **Texto do Botão** (ex: `cardMotosNovasTextoBotao`)
2. **Exibição Fixa** (ex: `cardMotosNovasExibirBotaoFixo`)

#### Valores de `ExibirBotaoFixo`:

- **`"nenhum"`**: Botão só aparece no hover (desktop). Em mobile, sempre visível.
- **`"xs"`**: Botão sempre visível em mobile (breakpoint xs). Hover no desktop.
- **`"todos"`**: Botão sempre visível em todos os tamanhos de tela.

**Exemplo CSS/Tailwind:**

```tsx
function CardMotoNova({ parametros }: { parametros: Parametros }) {
    const btnClasses = {
        nenhum: "opacity-0 group-hover:opacity-100 md:transition-opacity",
        xs: "opacity-100 md:opacity-0 md:group-hover:opacity-100",
        todos: "opacity-100",
    };

    return (
        <div className="group">
            {/* Conteúdo do card */}
            <button className={btnClasses[parametros.cardMotosNovasExibirBotaoFixo]}>
                {parametros.cardMotosNovasTextoBotao}
            </button>
        </div>
    );
}
```

### Ordem das Seções

O campo `secoesHomeOrdem` é um array ordenado que define a sequência das seções na home.

**Boas práticas:**

1. **Respeite a ordem:** Renderize as seções exatamente na ordem do array
2. **Filtre seções desabilitadas:** Se `habilitarSeminovos` é `false`, remova "motos-seminovas" da lista
3. **Lazy Loading:** Considere lazy load para seções abaixo da dobra

**Exemplo de uso:**

```tsx
export default function Home({ parametros }: { parametros: Parametros }) {
    // Filtrar seminovas se desabilitado
    const secoes = parametros.secoesHomeOrdem.filter(
        (s) => parametros.habilitarSeminovos || s.secao !== "motos-seminovas",
    );

    return (
        <main>
            <BannerPrincipal />
            {secoes.map((item) => {
                switch (item.secao) {
                    case "motos-novas":
                        return <SecaoMotosNovas key={item.id} />;
                    case "ofertas":
                        return <SecaoOfertas key={item.id} />;
                    case "consorcio":
                        return <SecaoConsorcio key={item.id} />;
                    case "test-ride":
                        return <SecaoTestRide key={item.id} />;
                    case "motos-seminovas":
                        return <SecaoSeminovas key={item.id} />;
                    case "motores-e-maquinas":
                        return <SecaoMotoresEMaquinas key={item.id} />;
                    case "servicos":
                        return <SecaoServicos key={item.id} />;
                    case "institucional":
                        return <SecaoInstitucional key={item.id} />;
                    default:
                        return null;
                }
            })}
        </main>
    );
}
```

---

## Exemplos Práticos

### Next.js App Router

```tsx
// app/layout.tsx
import { getParametros } from "@/lib/api";

export async function generateMetadata() {
    const params = await getParametros();

    return {
        title: params.tituloPadraoSite,
        description: params.descricaoPadraoSite,
    };
}

export default async function RootLayout({ children }) {
    const params = await getParametros();

    return (
        <html>
            <head>
                {params.habilitarTagsGTM && params.gtmId && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){...})(window,document,'script','dataLayer','${params.gtmId}')`,
                        }}
                    />
                )}
            </head>
            <body>{children}</body>
        </html>
    );
}
```

### React Context

```tsx
// contexts/ParametrosContext.tsx
import { createContext, useContext } from "react";
import type { Parametros } from "@/types/parametros";

const ParametrosContext = createContext<Parametros | null>(null);

export function ParametrosProvider({ children, parametros }: { children: React.ReactNode; parametros: Parametros }) {
    return <ParametrosContext.Provider value={parametros}>{children}</ParametrosContext.Provider>;
}

export function useParametros() {
    const context = useContext(ParametrosContext);
    if (!context) throw new Error("useParametros must be used within ParametrosProvider");
    return context;
}

// Uso nos componentes
function Header() {
    const params = useParametros();

    return (
        <header>
            <Logo height={params.alturaLogoConcessionariaHeader} />
            {params.exibirTenhoInteresseHeader && <button>TENHO INTERESSE</button>}
        </header>
    );
}
```

### Astro

```astro
---
// src/layouts/Layout.astro
import type { Parametros } from '@/types/parametros';

const response = await fetch('https://api.example.com/api/globals/parametros');
const parametros: Parametros = await response.json();
---

<!DOCTYPE html>
<html>
<head>
    <title>{parametros.tituloPadraoSite}</title>
    <meta name="description" content={parametros.descricaoPadraoSite} />
</head>
<body>
    <slot />
</body>
</html>
```

---

## Valores Padrão Recomendados

Os seguintes valores padrão estão configurados no CMS e são considerados boas práticas:

| Campo                                  | Valor Padrão  | Observação                  |
| -------------------------------------- | ------------- | --------------------------- |
| `habilitarSeminovos`                   | `true`        | Habilitar se houver estoque |
| `exibirTenhoInteresseHeader`           | `false`       | Ativar em campanhas         |
| `exibirPrecoMotosNovas`                | `false`       | Comum ocultar preços        |
| `exibirModelosSeparadosMotosNovasGrid` | `true`        | Facilita visualização       |
| `utilizarParcelasConsorcioComSeguro`   | `true`        | Valor mais realista         |
| `usarLogoConcessionariaHeaderMobile`   | `true`        | Melhor identidade visual    |
| `motosNovasTipoForm`                   | `"WebToLead"` | Integração Salesforce       |
| `testRideTipoForm`                     | `"Email"`     | Simples e eficaz            |
| `webToLeadFormsTest`                   | `false`       | Apenas em desenvolvimento   |
| `separarWhatsAppLeadsConnectPorFilial` | `true`        | Para multi-loja             |
| `ocultarWhatsappHeaderMobile`          | `true`        | Evita poluição visual       |
| `cardMotosNovasExibirBotaoFixo`        | `"xs"`        | Sempre visível em mobile    |

---

## Validações Aplicadas

Todos os campos de texto obrigatórios possuem validação:

- ✅ **Campos obrigatórios**: Não podem estar vazios
- ✅ **Selects**: Apenas valores predefinidos são aceitos
- ✅ **Array de seções**: Deve conter pelo menos uma seção

---

## Estrutura de Abas no Admin

As configurações estão organizadas em 10 abas para melhor UX:

1. **Funcionalidades** - Flags on/off de features
2. **SEO e Branding** - Títulos, logos e branding
3. **Formulários** - Configurações de forms
4. **WhatsApp e Telefone** - Configurações de contato
5. **Cards - Motos Novas** - Botões e comportamento
6. **Cards - Seminovas** - Botões e comportamento
7. **Cards - Ofertas** - Botões e comportamento
8. **Cards - Consórcio** - Botões e comportamento
9. **Cards - Serviços** - Botões e comportamento
10. **Ordem das Seções** - Sequência da home

Esta organização facilita a manutenção e evita sobrecarga de informações.
