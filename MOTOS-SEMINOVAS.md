# Documentação - Motos Seminovas

## Visão Geral

Coleção responsável pelo cadastro de motos seminovas (usadas) disponíveis na concessionária. Inclui informações completas como placa, ano, quilometragem, características, preço, localização e galeria de fotos.

---

## Endpoints da API

- `GET /api/motos-seminovas`
- `GET /api/motos-seminovas/:id`
- `GET /api/motos-seminovas?where[id][equals]=nc-750x-preta-2020`

### Filtros comuns (query params)

- `where[ativo][equals]=true` — retorna apenas motos ativas
- `where[id][equals]=nc-750x-preta-2020` — busca por ID específico
- `where[categoria][equals]=Trail` — filtra por categoria
- `where[combustivel][equals]=Gasolina` — filtra por tipo de combustível
- `where[local][equals]=Luziânia` — filtra por filial/local
- `where[marca][equals]=Honda` — filtra por marca
- `where[preco][lte]=30000` — filtra por preço máximo
- `where[anoModelo][gte]=2020` — filtra por ano mínimo

Exemplo com múltiplos parâmetros:

```http
GET /api/motos-seminovas?where[ativo][equals]=true&where[categoria][equals]=Trail&where[preco][lte]=30000
```

---

## Exemplo de resposta (GET /api/motos-seminovas/:id)

```json
{
    "id": "nc-750x-preta-2020",
    "ativo": true,
    "placa": "ABC-1234",
    "marca": "Honda",
    "nome": "NC 750X",
    "anoFabricacao": 2020,
    "anoModelo": 2021,
    "quilometragem": "15.000 km",
    "combustivel": "Gasolina",
    "cor": "Preta",
    "categoria": "Trail",
    "preco": 28500,
    "local": "Luziânia",
    "caracteristicas": [
        {
            "caracteristica": "Baixa manutenção",
            "id": "car-1"
        },
        {
            "caracteristica": "Econômica",
            "id": "car-2"
        },
        {
            "caracteristica": "Único dono",
            "id": "car-3"
        }
    ],
    "adicionais": [
        {
            "adicional": "3 meses de garantia",
            "id": "adic-1"
        },
        {
            "adicional": "Transferência gratuita",
            "id": "adic-2"
        },
        {
            "adicional": "Revisada",
            "id": "adic-3"
        }
    ],
    "imagem": {
        "id": "img-123",
        "filename": "nc-750x-principal.jpg",
        "mimeType": "image/jpeg",
        "filesize": 245680,
        "width": 1200,
        "height": 800,
        "url": "https://pub-123.r2.dev/nc-750x-principal.jpg"
    },
    "galeria": [
        {
            "imagem": {
                "id": "img-124",
                "filename": "nc-750x-lateral.jpg",
                "url": "https://pub-123.r2.dev/nc-750x-lateral.jpg"
            },
            "alt": "NC 750X foto 1",
            "id": "gal-1"
        },
        {
            "imagem": {
                "id": "img-125",
                "filename": "nc-750x-frontal.jpg",
                "url": "https://pub-123.r2.dev/nc-750x-frontal.jpg"
            },
            "alt": "NC 750X foto 2",
            "id": "gal-2"
        }
    ],
    "createdAt": "2025-01-14T12:00:00.000Z",
    "updatedAt": "2025-01-14T12:00:00.000Z"
}
```

---

## Interface TypeScript de Exemplo

Interfaces pensadas para uso no frontend.

```ts
/**
 * Categorias disponíveis para motos seminovas
 */
export type CategoriaMotosSeminovas =
    | "City"
    | "Scooter"
    | "Naked"
    | "Trail"
    | "Big Trail"
    | "Crossover"
    | "Off Road"
    | "Sport"
    | "Touring";

/**
 * Tipos de combustível
 */
export type Combustivel = "Gasolina" | "Álcool" | "Flex" | "Elétrico";

/**
 * Item da galeria de fotos
 */
export type ItemGaleria = {
    id: string;
    imagem: Imagem;
    alt?: string;
};

/**
 * Característica da moto
 */
export type Caracteristica = {
    id: string;
    caracteristica: string;
};

/**
 * Adicional/diferencial da moto
 */
export type Adicional = {
    id: string;
    adicional: string;
};

/**
 * Dados de uma imagem do Payload
 */
export type Imagem = {
    id: string;
    filename: string;
    mimeType: string;
    filesize: number;
    width: number;
    height: number;
    url: string;
};

/**
 * Dados completos de uma moto seminova
 */
export type MotoSeminova = {
    /** ID único da moto (ex.: nc-750x-preta-2020). */
    id: string;
    /** Placa da moto. */
    placa: string;
    /** Nome/modelo da moto (ex.: NC 750X). */
    nome: string;
    /** Ano de fabricação. */
    anoFabricacao: number;
    /** Ano do modelo. */
    anoModelo: number;
    /** Quilometragem (pode ser string formatada ou número). */
    quilometragem: string;
    /** Tipo de combustível. */
    combustivel: Combustivel;
    /** Cor da moto. */
    cor: string;
    /** Marca da moto (ex.: Honda). */
    marca: string;
    /** Categoria/tipo da moto. */
    categoria: CategoriaMotosSeminovas;
    /** Preço de venda em reais. */
    preco: number;
    /** Filial/local onde está disponível. */
    local: string;
    /** Lista de características. */
    caracteristicas: Caracteristica[];
    /** Lista de adicionais/diferenciais. */
    adicionais: Adicional[];
    /** Imagem principal. */
    imagem: Imagem;
    /** Galeria de fotos (opcional). */
    galeria?: ItemGaleria[];
    /** Se false, não exibe no site. */
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
};
```

---

## Boas práticas de consumo

### Filtros e Buscas

- **Filtro de ativos:** Sempre use `where[ativo][equals]=true` para exibir apenas motos disponíveis
- **Busca por categoria:** Use para criar páginas filtradas por tipo de moto
- **Busca por local:** Permita ao usuário filtrar por filial mais próxima
- **Filtro de preço:** Implemente range de preços (mínimo/máximo)
- **Cache:** Recomenda-se cache de curta duração (15-30 minutos) pois o estoque muda com frequência

### Categorias

As motos são organizadas em 9 categorias:

- **City**: Motos urbanas, ágeis para cidade
- **Scooter**: Scooters automáticas
- **Naked**: Motos naked/street
- **Trail**: Motos trail médias
- **Big Trail**: Motos trail grandes
- **Crossover**: Motos crossover/adventure
- **Off Road**: Motos off-road
- **Sport**: Motos esportivas
- **Touring**: Motos touring

### Combustível

Tipos disponíveis:

- **Gasolina**: Motor exclusivo gasolina
- **Álcool**: Motor exclusivo álcool
- **Flex**: Motor flex (gasolina/álcool)
- **Elétrico**: Motor elétrico

### Imagens

**Imagem Principal:**

- Use para listagens e cards
- Sempre presente no cadastro
- URL completa retornada pela API

**Galeria:**

- Array opcional de fotos adicionais
- Cada item possui imagem e texto alt
- Use para carrossel ou lightbox na página de detalhes

**Otimização:**

```tsx
// Gerar versão AVIF otimizada no frontend
import { getImage } from "astro:assets";

const avif = await getImage({
    src: moto.imagem.url,
    format: "avif",
    quality: 75,
    width: 500,
});
```

### Características e Adicionais

**Características comuns:**

- Baixa manutenção
- Econômica
- Ideal para cidade
- Único dono
- Revisada
- Pronta entrega

**Adicionais comuns:**

- 3 meses de garantia
- Transferência gratuita
- Revisada
- Pronta entrega
- Garantia estendida
- Documentação em dia

Use essas listas como sugestões no admin, mas permita valores customizados.

### Local/Filial

- O campo `local` é **linkado com as concessionárias** cadastradas em Dados Institucionais
- No admin, aparece como um select com as filiais disponíveis
- Armazena o **nome da concessionária** selecionada
- Use para agrupar motos por localização
- Implemente filtro por proximidade se tiver geolocalização
- **Importante:** As concessionárias devem estar cadastradas em Dados Institucionais antes de cadastrar motos

---

## Exemplos Práticos

### Listagem de Motos Seminovas

```tsx
import type { MotoSeminova } from "@/types/motos-seminovas";

export default async function ListagemSeminovas() {
    const response = await fetch("https://api.example.com/api/motos-seminovas?where[ativo][equals]=true");
    const data = await response.json();
    const motos: MotoSeminova[] = data.docs;

    return (
        <div className="grid">
            {motos.map((moto) => (
                <div key={moto.id} className="card">
                    <img src={moto.imagem.url} alt={moto.nome} />
                    <h3>{moto.nome}</h3>
                    <p className="categoria">{moto.categoria}</p>
                    <p className="preco">R$ {moto.preco.toLocaleString("pt-BR")}</p>
                    <p className="ano">
                        {moto.anoModelo} | {moto.quilometragem}
                    </p>
                    <p className="local">{moto.local}</p>
                    <a href={`/seminovas/${moto.id}`}>Ver Detalhes</a>
                </div>
            ))}
        </div>
    );
}
```

### Página de Detalhes com Galeria

```tsx
export default async function DetalheSeminova({ params }: { params: { id: string } }) {
    const response = await fetch(`https://api.example.com/api/motos-seminovas?where[id][equals]=${params.id}`);
    const data = await response.json();
    const moto: MotoSeminova = data.docs[0];

    if (!moto) {
        return <div>Moto não encontrada</div>;
    }

    return (
        <div className="detalhe-moto">
            <h1>{moto.nome}</h1>

            {/* Galeria de Fotos */}
            <div className="galeria">
                <img src={moto.imagem.url} alt={moto.nome} className="principal" />
                {moto.galeria?.map((item) => (
                    <img key={item.id} src={item.imagem.url} alt={item.alt || moto.nome} />
                ))}
            </div>

            {/* Informações Principais */}
            <div className="info">
                <p>
                    <strong>Preço:</strong> R$ {moto.preco.toLocaleString("pt-BR")}
                </p>
                <p>
                    <strong>Ano:</strong> {moto.anoFabricacao}/{moto.anoModelo}
                </p>
                <p>
                    <strong>Quilometragem:</strong> {moto.quilometragem}
                </p>
                <p>
                    <strong>Combustível:</strong> {moto.combustivel}
                </p>
                <p>
                    <strong>Cor:</strong> {moto.cor}
                </p>
                <p>
                    <strong>Placa:</strong> {moto.placa}
                </p>
                <p>
                    <strong>Local:</strong> {moto.local}
                </p>
            </div>

            {/* Características */}
            {moto.caracteristicas.length > 0 && (
                <div className="caracteristicas">
                    <h2>Características</h2>
                    <ul>
                        {moto.caracteristicas.map((item) => (
                            <li key={item.id}>{item.caracteristica}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Adicionais */}
            {moto.adicionais.length > 0 && (
                <div className="adicionais">
                    <h2>Diferenciais</h2>
                    <ul>
                        {moto.adicionais.map((item) => (
                            <li key={item.id}>{item.adicional}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
```

### Filtro por Categoria

```tsx
export default async function SeminovasPorCategoria({ categoria }: { categoria: CategoriaMotosSeminovas }) {
    const response = await fetch(
        `https://api.example.com/api/motos-seminovas?where[ativo][equals]=true&where[categoria][equals]=${categoria}`,
    );
    const data = await response.json();
    const motos: MotoSeminova[] = data.docs;

    return (
        <section>
            <h2>Motos {categoria}</h2>
            <div className="grid">
                {motos.map((moto) => (
                    <CardMotoSeminova key={moto.id} moto={moto} />
                ))}
            </div>
        </section>
    );
}
```

### Filtro por Faixa de Preço

```tsx
export default async function SeminovasPorPreco({ min, max }: { min: number; max: number }) {
    const response = await fetch(
        `https://api.example.com/api/motos-seminovas?where[ativo][equals]=true&where[preco][gte]=${min}&where[preco][lte]=${max}`,
    );
    const data = await response.json();
    const motos: MotoSeminova[] = data.docs;

    return (
        <div>
            <h2>
                Motos de R$ {min.toLocaleString("pt-BR")} a R$ {max.toLocaleString("pt-BR")}
            </h2>
            {/* renderizar motos */}
        </div>
    );
}
```

### Hook React para Motos Seminovas

```tsx
import { useState, useEffect } from "react";
import type { MotoSeminova } from "@/types/motos-seminovas";

export function useMotosSeminovas(categoria?: string) {
    const [motos, setMotos] = useState<MotoSeminova[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const url = categoria
            ? `/api/motos-seminovas?where[ativo][equals]=true&where[categoria][equals]=${categoria}`
            : "/api/motos-seminovas?where[ativo][equals]=true";

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setMotos(data.docs);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [categoria]);

    return { motos, loading, error };
}

// Uso
function ListaSeminovas() {
    const { motos, loading } = useMotosSeminovas("Trail");

    if (loading) return <div>Carregando...</div>;

    return (
        <div>
            {motos.map((moto) => (
                <div key={moto.id}>{moto.nome}</div>
            ))}
        </div>
    );
}
```

---

## Validações Aplicadas

Todos os campos possuem validações robustas no backend:

- ✅ **ID:** Obrigatório, único, formato kebab-case
- ✅ **Placa:** Obrigatória, não pode estar vazia
- ✅ **Nome:** Obrigatório, não pode estar vazio
- ✅ **Marca:** Obrigatória, não pode estar vazia
- ✅ **Ano de Fabricação:** Obrigatório, entre 1900 e ano atual + 1
- ✅ **Ano do Modelo:** Obrigatório, entre 1900 e ano atual + 1
- ✅ **Quilometragem:** Obrigatória
- ✅ **Combustível:** Obrigatório, valores restritos ao enum
- ✅ **Cor:** Obrigatória
- ✅ **Categoria:** Obrigatória, valores restritos ao enum
- ✅ **Preço:** Obrigatório, maior que zero
- ✅ **Local:** Obrigatório
- ✅ **Imagem Principal:** Obrigatória
- ✅ **Galeria:** Opcional
- ✅ **Características:** Opcional (array)
- ✅ **Adicionais:** Opcional (array)

---

## Campos Organizados

Os campos são organizados de forma intuitiva no admin:

1. **Linha 1:** ID e Status Ativo
2. **Linha 2:** Placa e Marca
3. **Linha 3:** Nome/Modelo
4. **Linha 4:** Ano Fabricação, Ano Modelo, Quilometragem
5. **Linha 5:** Combustível, Cor, Categoria
6. **Linha 6:** Preço e Local
7. **Características** (array)
8. **Adicionais** (array)
9. **Imagem Principal**
10. **Galeria de Fotos** (array)

Esta organização facilita o cadastro e evita erros de preenchimento.
