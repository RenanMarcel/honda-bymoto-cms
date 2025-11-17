# Documentação - Motos Novas

## Visão Geral

Coleção responsável pelo cadastro de motos novas disponíveis na concessionária. Estrutura simplificada focada em **dados financeiros** (preços, parcelamentos e ofertas) de cada modelo/variação.

### Estrutura

- **Moto Nova** (ex.: Biz 125)
    - **Modelos** (ex.: ES, EX, Sport)
        - **Dados Financeiros** (preço, parcelamento, ofertas)
        - **Flags** (exibirConsorcio, exibirOferta)

> **Nota:** Esta coleção está em desenvolvimento inicial. Futuramente incluirá especificações técnicas, imagens, cores, etc. Por enquanto, use apenas para dados financeiros.

---

## Endpoints da API

- `GET /api/motos-novas`
- `GET /api/motos-novas/:id`
- `GET /api/motos-novas?where[id][equals]=biz-125`

### Filtros comuns (query params)

- `where[ativo][equals]=true` — retorna apenas motos ativas
- `where[id][equals]=biz-125` — busca por ID específico
- `where[modelos.exibirOferta][equals]=true` — retorna motos com ofertas
- `where[modelos.exibirConsorcio][equals]=true` — retorna motos com consórcio

Exemplo com múltiplos parâmetros:

```http
GET /api/motos-novas?where[ativo][equals]=true&where[modelos.exibirOferta][equals]=true
```

---

## Exemplo de resposta (GET /api/motos-novas/:id)

```json
{
    "id": "biz-125",
    "nome": "Biz 125",
    "ativo": true,
    "modelos": [
        {
            "nome": "ES",
            "dadosFinanceiros": {
                "preco": 15590,
                "parcelamento": [
                    {
                        "qtdParcelas": 3,
                        "precoParcela": 5508.47,
                        "precoTotal": 16525.4,
                        "id": "parc-1"
                    },
                    {
                        "qtdParcelas": 6,
                        "precoParcela": 2832.18,
                        "precoTotal": 16993.1,
                        "id": "parc-2"
                    },
                    {
                        "qtdParcelas": 10,
                        "precoParcela": 1746.08,
                        "precoTotal": 17460.8,
                        "id": "parc-3"
                    },
                    {
                        "qtdParcelas": 12,
                        "precoParcela": 1481.05,
                        "precoTotal": 17772.6,
                        "id": "parc-4"
                    }
                ],
                "precoOferta": 15500,
                "vantagensOferta": [
                    {
                        "vantagem": "Promoção para pagamento à vista",
                        "id": "vant-1"
                    },
                    {
                        "vantagem": "Estoque limitado",
                        "id": "vant-2"
                    }
                ]
            },
            "exibirConsorcio": true,
            "exibirOferta": true,
            "id": "modelo-1"
        },
        {
            "nome": "EX",
            "dadosFinanceiros": {
                "preco": 18990,
                "parcelamento": [
                    {
                        "qtdParcelas": 3,
                        "precoParcela": 6706.8,
                        "precoTotal": 20120.4,
                        "id": "parc-5"
                    },
                    {
                        "qtdParcelas": 6,
                        "precoParcela": 3449.85,
                        "precoTotal": 20699.1,
                        "id": "parc-6"
                    },
                    {
                        "qtdParcelas": 10,
                        "precoParcela": 2126.88,
                        "precoTotal": 21268.8,
                        "id": "parc-7"
                    },
                    {
                        "qtdParcelas": 12,
                        "precoParcela": 1804.05,
                        "precoTotal": 21648.6,
                        "id": "parc-8"
                    }
                ],
                "precoOferta": 18500,
                "vantagensOferta": [
                    {
                        "vantagem": "Promoção para pagamento à vista",
                        "id": "vant-3"
                    },
                    {
                        "vantagem": "Estoque limitado",
                        "id": "vant-4"
                    }
                ]
            },
            "exibirConsorcio": true,
            "exibirOferta": true,
            "id": "modelo-2"
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
 * Representa um item de parcelamento de financiamento.
 * Ex.: 3x de R$ 5.000 = R$ 15.000 total
 */
export type ParcelamentoFinanciamentoItem = {
    id: string;
    /** Quantidade de parcelas (meses). */
    qtdParcelas: number;
    /** Valor de cada parcela em reais. */
    precoParcela: number;
    /** Valor total pago ao final do financiamento. */
    precoTotal: number;
};

/**
 * Representa uma vantagem da oferta
 */
export type VantagemOferta = {
    id: string;
    vantagem: string;
};

/**
 * Dados financeiros de um modelo
 */
export type DadosFinanceiros = {
    /** Preço à vista do modelo. */
    preco: number;
    /** Opções de parcelamento do financiamento para este modelo (opcional). */
    parcelamento?: ParcelamentoFinanciamentoItem[];
    /** Preço de oferta (quando aplicável). */
    precoOferta?: number;
    /** Lista de vantagens exibidas junto à oferta (quando aplicável). */
    vantagensOferta?: VantagemOferta[];
};

/**
 * Modelo/variação de uma moto
 */
export type Modelo = {
    id: string;
    /** Nome do modelo (ex.: ES, EX, Sport, Flex). */
    nome: string;
    /** Dados financeiros do modelo. */
    dadosFinanceiros: DadosFinanceiros;
    /** Se true, exibe na seção de consórcio. */
    exibirConsorcio: boolean;
    /** Se true, exibe na seção de ofertas. */
    exibirOferta: boolean;
};

/**
 * Dados completos de uma moto nova
 */
export type MotoNova = {
    /** ID único da moto (ex.: biz-125). */
    id: string;
    /** Nome da moto (ex.: Biz 125, CG 160). */
    nome: string;
    /** Se false, não exibe no site. */
    ativo: boolean;
    /** Array de modelos/variações desta moto. */
    modelos: Modelo[];
    createdAt: string;
    updatedAt: string;
};
```

---

## Boas práticas de consumo

### Dados Gerais

- **Filtro de ativos:** Sempre use `where[ativo][equals]=true` para exibir apenas motos disponíveis no site.
- **Busca por ID:** Use o ID para URLs amigáveis: `/motos-novas/biz-125`
- **Cache:** Os dados financeiros podem mudar com frequência. Recomenda-se cache de curta duração (15-30 minutos).

### Cálculo do Menor Preço

- Calcule o "a partir de" no frontend pegando o menor preço entre todos os modelos:

```ts
const menorPreco = Math.min(...moto.modelos.map((m) => m.dadosFinanceiros.preco));
```

### Modelos e Variações

- Cada moto pode ter múltiplos modelos/variações (ES, EX, Sport, Flex, etc.)
- Cada modelo possui seu próprio objeto `dadosFinanceiros`
- Use `modelos[].nome` para exibir o nome da variação
- Exiba todas as opções de parcelamento disponíveis para cada modelo

### Parcelamento

- **qtdParcelas:** Quantidade de meses do financiamento
- **precoParcela:** Valor que o cliente pagará mensalmente (em reais)
- **precoTotal:** Valor total ao final - **calculado automaticamente** (qtdParcelas × precoParcela)
- O campo `precoTotal` é somente leitura no admin e preenchido automaticamente
- Sempre exiba o precoTotal para transparência no frontend

**Exemplo de exibição:**

```tsx
{
    modelo.dadosFinanceiros.parcelamento?.map((parc) => (
        <div key={parc.id}>
            <strong>{parc.qtdParcelas}x</strong> de <strong>R$ {parc.precoParcela.toFixed(2)}</strong>
            <small> (Total: R$ {parc.precoTotal.toFixed(2)})</small>
        </div>
    ));
}
```

### Ofertas Especiais

- Verifique `modelos[].exibirOferta` para saber se deve aparecer na seção de ofertas
- `precoOferta` é o preço promocional (normalmente menor que `preco`)
- `vantagensOferta` lista os diferenciais da promoção

**Como usar:**

```tsx
function CardMotoOferta({ modelo }: { modelo: ModeloFinanceiro }) {
    if (!modelo.exibirOferta) return null;

    return (
        <div className="card-oferta">
            <div className="preco">
                {modelo.precoOferta && (
                    <>
                        <span className="preco-antigo">De: R$ {modelo.preco.toFixed(2)}</span>
                        <span className="preco-oferta">Por: R$ {modelo.precoOferta.toFixed(2)}</span>
                    </>
                )}
            </div>

            {modelo.vantagensOferta && (
                <ul>
                    {modelo.vantagensOferta.map((v) => (
                        <li key={v.id}>{v.vantagem}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

### Cálculos Úteis

**Economia na oferta:**

```ts
const economia = modelo.preco - (modelo.precoOferta || modelo.preco);
const percentualDesconto = ((economia / modelo.preco) * 100).toFixed(0);
```

**Melhor opção de parcelamento (menor total):**

```ts
const melhorOpcao = modelo.parcelamento.reduce((prev, curr) => (curr.precoTotal < prev.precoTotal ? curr : prev));
```

**Simulação de entrada + parcelas:**

```ts
function calcularEntradaParcelas(
    precoTotal: number,
    percentualEntrada: number,
    qtdParcelas: number,
): { entrada: number; valorParcela: number } {
    const entrada = precoTotal * (percentualEntrada / 100);
    const saldo = precoTotal - entrada;
    const valorParcela = saldo / qtdParcelas;

    return { entrada, valorParcela };
}

// Exemplo: 30% de entrada
const { entrada, valorParcela } = calcularEntradaParcelas(15590, 30, 12);
// entrada = 4677, valorParcela = 909.42
```

---

## Exemplos Práticos

### Listagem de Motos com Menor Preço

```tsx
import type { MotoNova } from "@/types/motos-novas";

export default async function ListagemMotos() {
    const response = await fetch("https://api.example.com/api/motos-novas?where[ativo][equals]=true");
    const data = await response.json();
    const motos: MotoNova[] = data.docs;

    return (
        <div className="grid">
            {motos.map((moto) => (
                <a key={moto.id} href={`/motos-novas/${moto.slug}`}>
                    <h3>{moto.nome}</h3>
                    {moto.menorPreco && <p>A partir de R$ {moto.menorPreco.toLocaleString("pt-BR")}</p>}
                </a>
            ))}
        </div>
    );
}
```

### Página de Detalhes com Opções de Parcelamento

```tsx
export default async function DetalheMoto({ params }: { params: { slug: string } }) {
    const response = await fetch(`https://api.example.com/api/motos-novas?where[slug][equals]=${params.slug}`);
    const data = await response.json();
    const moto: MotoNova = data.docs[0];

    return (
        <div>
            <h1>{moto.nome}</h1>

            {moto.modelos.map((modelo) => (
                <div key={modelo.id} className="modelo">
                    <h2>Versão {modelo.modeloId.toUpperCase()}</h2>

                    <div className="precos">
                        <p className="preco-vista">À vista: R$ {modelo.preco.toLocaleString("pt-BR")}</p>

                        {modelo.exibirOferta && modelo.precoOferta && (
                            <p className="preco-oferta">
                                <strong>OFERTA:</strong> R$ {modelo.precoOferta.toLocaleString("pt-BR")}
                            </p>
                        )}
                    </div>

                    <div className="parcelamento">
                        <h3>Opções de Parcelamento</h3>
                        {modelo.parcelamento.map((parc) => (
                            <div key={parc.id} className="opcao-parcelamento">
                                <span>
                                    {parc.qtdParcelas}x de R$ {parc.precoParcela.toFixed(2)}
                                </span>
                                <small>Total: R$ {parc.precoTotal.toLocaleString("pt-BR")}</small>
                            </div>
                        ))}
                    </div>

                    {modelo.vantagensOferta && modelo.vantagensOferta.length > 0 && (
                        <div className="vantagens">
                            <h4>Vantagens desta Oferta</h4>
                            <ul>
                                {modelo.vantagensOferta.map((v) => (
                                    <li key={v.id}>{v.vantagem}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
```

### Seção de Ofertas Especiais

```tsx
export default async function SecaoOfertas() {
    const response = await fetch("https://api.example.com/api/motos-novas?where[ativo][equals]=true");
    const data = await response.json();
    const motos: MotoNova[] = data.docs;

    // Filtrar modelos com oferta
    const ofertas = motos.flatMap((moto) =>
        moto.modelos.filter((m) => m.exibirOferta).map((m) => ({ ...m, motoNome: moto.nome, motoSlug: moto.slug })),
    );

    return (
        <section className="ofertas">
            <h2>Ofertas Especiais</h2>
            <div className="grid">
                {ofertas.map((oferta) => (
                    <div key={`${oferta.motoSlug}-${oferta.id}`} className="card-oferta">
                        <h3>
                            {oferta.motoNome} - {oferta.modeloId.toUpperCase()}
                        </h3>

                        <div className="precos">
                            <span className="preco-anterior">De: R$ {oferta.preco.toLocaleString("pt-BR")}</span>
                            <span className="preco-promocional">
                                Por: R$ {oferta.precoOferta?.toLocaleString("pt-BR")}
                            </span>
                        </div>

                        {oferta.vantagensOferta && (
                            <ul className="vantagens">
                                {oferta.vantagensOferta.map((v) => (
                                    <li key={v.id}>{v.vantagem}</li>
                                ))}
                            </ul>
                        )}

                        <a href={`/motos-novas/${oferta.motoSlug}`}>Ver Detalhes</a>
                    </div>
                ))}
            </div>
        </section>
    );
}
```

### Hook React para Dados Financeiros

```tsx
import { useState, useEffect } from "react";
import type { MotoNova } from "@/types/motos-novas";

export function useMotoNova(slug: string) {
    const [moto, setMoto] = useState<MotoNova | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch(`/api/motos-novas?where[slug][equals]=${slug}`)
            .then((res) => res.json())
            .then((data) => {
                setMoto(data.docs[0] || null);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [slug]);

    return { moto, loading, error };
}

// Uso
function ComponenteMoto() {
    const { moto, loading } = useMotoNova("biz-125");

    if (loading) return <div>Carregando...</div>;
    if (!moto) return <div>Moto não encontrada</div>;

    return <div>{moto.nome}</div>;
}
```

---

## Validações Aplicadas

Todos os campos possuem validações robustas no backend:

- ✅ **Nome:** Obrigatório e não pode estar vazio
- ✅ **Slug:** Obrigatório, único, formato `kebab-case` (apenas letras minúsculas, números e hífens)
- ✅ **ID do Modelo:** Formato `kebab-case`, obrigatório
- ✅ **Preço:** Obrigatório e deve ser maior que zero
- ✅ **Quantidade de Parcelas:** Obrigatório e deve ser número inteiro positivo
- ✅ **Valor da Parcela:** Obrigatório e deve ser maior que zero
- ✅ **Preço Total:** Obrigatório e deve ser maior que zero
- ✅ **Preço da Oferta:** Obrigatório se `exibirOferta` estiver marcado

---

## Estrutura de Abas no Admin

As configurações estão organizadas em 2 abas:

1. **Informações Básicas** - Nome, slug e status ativo
2. **Dados Financeiros** - Preços, modelos, parcelamentos e ofertas

Futuramente serão adicionadas mais abas para:

- Especificações Técnicas
- Imagens e Galeria
- Cores Disponíveis
- Acessórios

---

## Roadmap

Esta coleção será expandida com os seguintes campos:

- [ ] Imagens (foto principal, galeria)
- [ ] Especificações técnicas (motor, potência, consumo, etc.)
- [ ] Cores disponíveis
- [ ] Ficha técnica completa
- [ ] Categoria/tipo (scooter, trail, sport, etc.)
- [ ] Ano/modelo
- [ ] Disponibilidade em estoque
- [ ] Opcionais/acessórios
- [ ] Vídeos
- [ ] Documentos (catálogos PDF)

Por enquanto, mantenha os demais dados em arquivos locais e use esta API apenas para **dados financeiros**.
