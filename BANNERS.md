# Documentação - Banners Página Inicial

## Visão Geral

Coleção responsável pelos banners da página inicial do site. Cada documento representa um banner com título, textos auxiliares, imagens para desktop/mobile e controle de validade.

---

## Endpoints da API

- `GET /api/banners-pagina-inicial`
- `GET /api/banners-pagina-inicial/:id`

### Filtros comuns (query params)

- `where[ativo][equals]=true` — retorna apenas banners ativos
- `sort=ordem` — ordena pela ordem crescente

Exemplo com múltiplos parâmetros:

```http
GET /api/banners-pagina-inicial?where[ativo][equals]=true&sort=ordem
```

---

## Exemplo de resposta (GET /api/banners-pagina-inicial)

```json
{
    "docs": [
        {
            "id": "123",
            "titulo": "Oferta Honda 0km",
            "subtitulo": "Taxa zero e parcelamento facilitado",
            "bannerUrl": "https://www.sua-concessionaria.com.br/ofertas/honda-0km",
            "imagemDesktop": "456",
            "imagemMobile": "789",
            "dataValidadeInicial": "2025-01-01T00:00:00.000Z",
            "dataValidadeFinal": "2025-01-31T23:59:59.000Z",
            "textoLegal": "Consulte condições na concessionária.",
            "ordem": 1,
            "ativo": true,
            "createdAt": "2025-01-10T12:00:00.000Z",
            "updatedAt": "2025-01-10T12:00:00.000Z"
        }
    ],
    "totalDocs": 1,
    "limit": 10,
    "totalPages": 1,
    "page": 1,
    "hasPrevPage": false,
    "hasNextPage": false
}
```

> Obs.: `imagemDesktop` e `imagemMobile` retornam o `id` do documento na coleção `midia`.

---

## Interface TypeScript de Exemplo

Interface pensada para uso no frontend, onde os `id`s de `imagemDesktop` e `imagemMobile` já foram resolvidos para objetos da coleção `midia`.

```ts
export type Image = {
    id: string;
    url: string;
    alt: string;
    filename: string;
    width?: number;
    height?: number;
};

export type BannerPaginaInicial = {
    id: string;
    titulo?: string | null;
    subtitulo?: string | null;
    bannerUrl?: string | null;
    imagemDesktop: Image;
    imagemMobile?: Image | null;
    dataValidadeInicial?: string | null;
    dataValidadeFinal?: string | null;
    textoLegal?: string | null;
    ordem?: number | null;
    ativo?: boolean | null;
    createdAt: string;
    updatedAt: string;
};
```

---

## Boas práticas de consumo

- **Filtrar apenas banners ativos** no frontend (`where[ativo][equals]=true`).
- **Ordenar por `ordem`** para garantir a sequência correta de exibição.
- **Respeitar datas de validade**: exibir apenas banners em que `dataValidadeInicial` seja menor ou igual à data atual (ou esteja vazia) **e** `dataValidadeFinal` seja maior ou igual à data atual (ou esteja vazia). Banners fora desse intervalo devem ser ocultados.
- **Usar `bannerUrl`** como link de destino do clique no banner (quando preenchido).
- **Usar `imagemDesktop` / `imagemMobile`** de acordo com o breakpoint do layout.
