# Importação de Motos Novas (LP → Payload CMS)

Este documento explica como usar o importador de **motos novas** que lê os dados do projeto **honda-bymoto-lp** e preenche/atualiza a coleção `motos-novas` no Payload CMS.

> Toda a lógica principal do importador está em `src/scripts/ImportMotosNovasFromLp.ts`.

---

## Visão geral

- **Origem dos dados**: `../honda-bymoto-lp/src/data/motos-novas` (por padrão).
- **Destino**: coleção `motos-novas` do Payload CMS.
- **Comando principal**: `pnpm import:motos-novas:run`.
- **Comportamento**:
    - Lê todos os arquivos `*.dados-financeiros.ts` da pasta `motos-novas/dados-financeiros` do projeto LP.
    - Para cada moto encontrada, faz **upsert** na coleção `motos-novas` (cria se não existir, atualiza se já existir).
    - Nenhuma moto é removida automaticamente.

---

## Pré-requisitos

- Projeto **honda-bymoto-cms** com dependências instaladas (`pnpm install`).
- Banco de dados configurado e acessível para o Payload (D1 local / remoto, conforme ambiente).
- Variável de ambiente **PAYLOAD_SECRET** configurada (a mesma usada para rodar o Payload normalmente).
- Projeto **honda-bymoto-lp** clonado em um diretório irmão (configuração padrão) ou caminho configurado via variável de ambiente.

### Caminho dos dados do LP (`LP_MOTOS_NOVAS_DATA_ROOT`)

O importador resolve automaticamente o diretório raiz dos dados do LP usando a variável de ambiente `LP_MOTOS_NOVAS_DATA_ROOT`.

- **Se a variável NÃO estiver definida**:
    - Usa o caminho padrão relativo:
        - `../honda-bymoto-lp/src/data`
- **Se a variável estiver definida**:
    - Usa exatamente o valor informado.

Exemplos:

```bash
# Usando o caminho padrão (honda-bymoto-lp como projeto irmão)
pnpm import:motos-novas:run

# Usando um caminho customizado para os dados do LP
cross-env LP_MOTOS_NOVAS_DATA_ROOT="C:/Projetos/honda-bymoto-lp/src/data" pnpm import:motos-novas:run
```

---

## Como executar o importador

O script está registrado no `package.json` como:

```json
"import:motos-novas:run": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload run src/scripts/ImportMotosNovasFromLp.ts"
```

### Passo a passo

1. Garanta que o banco de dados do Payload esteja acessível no ambiente atual (local ou remoto).
2. Garanta que o diretório do LP (`LP_MOTOS_NOVAS_DATA_ROOT`) aponte para o lugar correto.
3. Na raiz do projeto **honda-bymoto-cms**, execute:

```bash
pnpm import:motos-novas:run
```

4. Acompanhe os logs no terminal. Ao final, você verá um resumo como:

```text
[motos-novas-import] Iniciando importação de 45 motos novas...
[motos-novas-import] Concluído. Total: 45, criadas: 45, atualizadas: 0, puladas: 0.
```

- **Total**: quantidade de motos lidas dos arquivos de dados financeiros do LP.
- **Criadas**: novas entradas na coleção `motos-novas`.
- **Atualizadas**: motos que já existiam e foram atualizadas.
- **Puladas**: motos que não puderam ser importadas (ver seção de troubleshooting se valor > 0).

---

## Como o importador funciona

### 1. Leitura dos dados financeiros

- O script lê todos os arquivos `*.dados-financeiros.ts` em:
    - `<LP_MOTOS_NOVAS_DATA_ROOT>/motos-novas/dados-financeiros`.
- Em cada arquivo é procurado um export do tipo `DadosFinanceirosMotoNova`, contendo:
    - `id` da moto
    - `modelos[]` com informações de preço, parcelamento, oferta e vantagens

Esses dados são mapeados para a interface `MotosNova` do Payload.

### 2. Upsert na coleção `motos-novas`

Para cada item de dados financeiros:

- O script tenta localizar um registro existente na coleção `motos-novas` com o mesmo `id`.
- Se **não encontrar**, cria uma nova moto.
- Se **encontrar**, atualiza o registro existente com os dados gerados.
- Nenhuma moto é apagada automaticamente.

### 3. Regras de normalização de preços

- Campo `dadosFinanceiros.preco` em cada modelo:
    - Valores `undefined`, `null` ou `NaN` são normalizados para **0**.
    - Valores negativos são impedidos pela validação da coleção, mas o importador nunca envia valores negativos.
- Campo `parcelamento` no Payload:
    - Atualmente é preenchido sempre como um **array vazio**.
    - `precoOferta` e `vantagensOferta` são copiados dos dados financeiros do LP, quando existirem.

---

## Tratamento de motos sem modelos financeiros

Algumas motos do LP não possuem `modelos` definidos no arquivo de dados financeiros. Para evitar que essas motos sejam puladas, o script cria modelos sintéticos.

### Regras

- Se `dadosFinanceiros.modelos` estiver vazio ou indefinido:
    - O script procura variações pré-mapeadas para o `id` da moto (por exemplo, `cb-1000r`, `x-adv`, `gl-1800-gold-wing-tour` etc.).
    - Para cada variação, é criado um modelo sintético com:
        - `nome`: baseado no nome/id da variação.
        - `dadosFinanceiros.preco`: `0`.
        - `dadosFinanceiros.parcelamento`: `[]`.
        - `dadosFinanceiros.precoOferta`: `undefined`.
        - `dadosFinanceiros.vantagensOferta`: `[]`.
        - `exibirOferta`: `false` (exceto quando a regra de `-2025` se aplica, ver abaixo).
- Apenas se não houver nenhuma variação mapeada a moto é **pulada** e um `console.warn` é emitido.

Resultado: nenhuma moto com variações conhecidas fica de fora, mesmo que não tenha dados financeiros completos no LP.

---

## Regras de flags de exibição

Cada modelo na coleção `motos-novas` possui os seguintes flags:

- `exibirMotosNovas`
- `exibirConsorcio`
- `exibirOferta`

### `exibirMotosNovas`

- Se o `id` da moto **contém `-2025`**:
    - `exibirMotosNovas = false` (modelo não aparece na listagem principal de motos novas).
- Caso contrário:
    - `exibirMotosNovas = true`.

A ideia é esconder automaticamente os modelos 2025 quando já existem modelos 2026 ou mais novos para aquela moto.

### `exibirConsorcio`

- O importador verifica a pasta `motos-novas/dados-cnh` do projeto LP.
- Para motos que possuem um arquivo nessa pasta (por exemplo, `biz-125.dados-cnh.ts`):
    - `exibirConsorcio = true` por padrão em todos os modelos dessa moto.
    - A associação é feita comparando o `id` da moto com o **nome base do arquivo**, sem o sufixo `.dados-cnh.ts` ou `.cnh.ts`.
        - Exemplo: `id = "biz-125"` → arquivo `biz-125.dados-cnh.ts`.
- Se o `id` da moto **contém `-2025`**:
    - `exibirConsorcio` permanece **false**, mesmo que exista arquivo em `dados-cnh`.
- A exibição no consórcio ainda pode ser ajustada manualmente via admin, se necessário.

### `exibirOferta`

- Se o `id` da moto **contém `-2025`**:
    - `exibirOferta = true` **para todos os modelos**, independentemente do que vier do LP.
    - Isso permite destacar os modelos 2025 como oferta, mesmo que não tenham mais destaque na coleção principal.
- Para as demais motos:
    - `exibirOferta` é copiado do LP:
        - `exibirOferta = modelo.exibirOferta ?? false`.

---

## Regras de formatação de nomes

### Nome da moto (campo `nome`)

O nome da moto é gerado a partir do `id` (por exemplo, `cb-1000r`, `biz-125`, `pcx-150`), seguindo estas regras:

- A string é quebrada por `-` e cada parte é formatada separadamente.
- **Prefixo (primeira parte)**:
    - Se tiver **apenas letras** e **2 caracteres** (ex.: `cb`, `cg`):
        - Fica totalmente **maiúsculo**: `CB`, `CG`.
    - Se tiver **apenas letras** e **3 caracteres**, e não for `biz` ou `pop`:
        - Fica totalmente **maiúsculo**: `pcx` → `PCX`.
    - Se for `biz` ou `pop`:
        - Fica em **PascalCase**: `Biz`, `Pop`.
- **Números seguidos de letras**:
    - Qualquer parte com números seguidos de letras terá as letras após o último dígito em maiúsculo.
    - Exemplos:
        - `1000r` → `1000R`.
        - `110i` → `110I`.
- **Demais partes**:
    - São convertidas para PascalCase (primeira letra maiúscula, restante minúsculo):
        - `start` → `Start`.

Exemplos práticos:

- `cb-1000r` → `CB 1000R`.
- `cg-160-start` → `CG 160 Start`.
- `biz-125` → `Biz 125`.
- `pop-110i` → `Pop 110I`.
- `pcx-150` → `PCX 150`.
- `x-adv` → `X-ADV`.
- `honda-adv` → `Honda ADV`.

### Nome do modelo (campo `modelos[].nome`)

O nome do modelo é baseado em `modelo.nome` vindo do LP; se estiver vazio, usa `modelo.id`. Em seguida, aplica as regras abaixo por "palavra" (quebrada por espaço):

- **Palavras com 1 a 3 caracteres alfanuméricos**, que não sejam `biz` ou `pop`:
    - Ficam totalmente em maiúsculo (**siglas**):
        - `sp` → `SP`.
        - `mt` → `MT`.
        - `rx` → `RX`.
        - `dct` → `DCT`.
- **Palavras já totalmente maiúsculas**:
    - São preservadas como estão:
        - `X-ADV` → `X-ADV`.
        - `ES` → `ES`.
- **Palavras iguais a `biz` ou `pop`**:
    - Ficam em PascalCase: `Biz`, `Pop`.
- **Demais palavras**:
    - Convertidas para PascalCase:
        - `adventure` → `Adventure`.
        - `sports` → `Sports`.

---

## Logs e troubleshooting

O script emite logs com o prefixo `[motos-novas-import]`.

### Exemplos de logs

- Início da importação:

```text
[motos-novas-import] Iniciando importação de 45 motos novas...
```

- Resumo ao final:

```text
[motos-novas-import] Concluído. Total: 45, criadas: 40, atualizadas: 5, puladas: 0.
```

- Moto pulada por falta de modelos e variações:

```text
[motos-novas-import] Moto xyz pulada: nenhum modelo definido em dados-financeiros e nenhuma variacao encontrada no arquivo principal.
```

Se `puladas` for maior que 0, verifique:

- Se existe arquivo de dados financeiros para essa moto.
- Se ela está incluída no mapeamento de variações sintéticas no script (para casos especiais).
- Se o `id` da moto no LP bate com o `id` esperado no CMS.

### Erros comuns

- **Caminho dos dados do LP incorreto**:
    - Ajuste a variável `LP_MOTOS_NOVAS_DATA_ROOT`.
- **Problemas de acesso ao banco / Payload**:
    - Verifique `PAYLOAD_SECRET` e a configuração de banco de dados (D1, etc.).

---

## Boas práticas de uso

- Rodar o importador sempre que houver alterações relevantes em `motos-novas` no projeto LP (novos modelos, ajustes de preço, flags de oferta, etc.).
- Após rodar o importador:
    - Conferir rapidamente no admin se as motos esperadas foram criadas/atualizadas.
    - Validar especialmente:
        - Modelos com ano `-2025` (flags de exibição).
        - Motos com preços 0 (casos esperados para motos sem preço definido).
- Registrar no `TASK.md` sempre que uma mudança estrutural importante for feita no importador (novos campos, novas regras de mapeamento, etc.).

---

## Resumo rápido

- Comando principal:

```bash
pnpm import:motos-novas:run
```

- O script faz **upsert** na coleção `motos-novas` a partir dos dados financeiros do LP.
- Preços indefinidos são normalizados para **0**.
- Motos sem modelos financeiros utilizam **variações sintéticas** com preço 0 para não serem puladas.
- Motos com `id` contendo `-2025` têm:
    - `exibirMotosNovas = false`.
    - `exibirConsorcio = false`.
    - `exibirOferta = true` em todos os modelos.
- Nomes de motos e modelos são formatados automaticamente para manter um padrão visual consistente (CB/CG/PCX em maiúsculo, Biz/Pop em PascalCase, siglas dos modelos em maiúsculo, etc.).
