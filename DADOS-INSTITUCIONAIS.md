# Documentação - Dados Institucionais

## Visão Geral

Global responsável pelas informações institucionais da empresa e suas concessionárias. Contém dados corporativos, logos, informações de contato, endereços, URLs de integração (LeadsConnect, MyHonda), redes sociais e fotos das concessionárias.

---

## Endpoint da API

- `GET /api/globals/dados-institucionais`

> Este é um **Global** do Payload, portanto possui apenas um único documento (não é uma coleção).

---

## Exemplo de resposta (GET /api/globals/dados-institucionais)

```json
{
    "id": "1",
    "nome": "Moto e Cia Comércio de Motocicletas Ltda",
    "nomeFantasia": "Honda By Moto",
    "cnpj": "12.345.678/0001-90",
    "siteUrl": "https://www.hondabymoto.com.br",
    "logoConcessionaria": "logo-id-1",
    "logoConcessionariaBranca": "logo-branca-id-2",
    "logoConcessionariaPreta": "logo-preta-id-3",
    "gtmId": "GTM-XXXXXXX",
    "ga4Id": "G-XXXXXXXXXX",
    "concessionarias": [
        {
            "nome": "Honda By Moto - Jardim Inga",
            "endereco": {
                "cep": "12345-678",
                "rua": "Rua Exemplo",
                "numero": "1234",
                "bairro": "Jardim Inga",
                "cidade": "Maringá",
                "estado": "PR"
            },
            "googleMapUrl": "https://maps.google.com/maps?q=moto%20e%20cia%20jardim%20inga&t=m&z=12&output=embed&iwloc=near",
            "telefones": [
                {
                    "rotulo": "WhatsApp",
                    "codigoPais": "55",
                    "numero": "(44) 99999-9999",
                    "temWhatsapp": true,
                    "id": "tel-1"
                },
                {
                    "rotulo": "Fixo",
                    "codigoPais": "55",
                    "numero": "(44) 3333-3333",
                    "temWhatsapp": false,
                    "id": "tel-2"
                }
            ],
            "emails": {
                "emailContato": "contato@hondabymoto.com.br",
                "emailRH": "rh@hondabymoto.com.br",
                "emailVendas": "vendas@hondabymoto.com.br",
                "emailSeminovas": "seminovas@hondabymoto.com.br",
                "emailTestRide": "testride@hondabymoto.com.br"
            },
            "horarios": [
                {
                    "dias": "Segunda a Sexta",
                    "horario": "08:00 - 18:00",
                    "id": "hor-1"
                },
                {
                    "dias": "Sábado",
                    "horario": "08:00 - 13:00",
                    "id": "hor-2"
                }
            ],
            "leadsConnectMyHonda": {
                "myHondaDealerCode": 12345,
                "whatsappLeadsConnectUrl": "https://leadsconnect.com.br/whatsapp/12345",
                "leadsConnectFormularioCompletoUrl": "https://leadsconnect.com.br/formulario/12345",
                "leadsConnectVendasUrl": "https://leadsconnect.com.br/vendas/12345",
                "leadsConnectTestRideUrl": "https://leadsconnect.com.br/testride/12345",
                "leadsConnectSegurosUrl": "https://leadsconnect.com.br/seguros/12345",
                "agendamentoDigitalHondaUrl": "https://agendamento.honda.com.br/12345",
                "pecasHondaUrl": "https://pecas.honda.com.br/12345"
            },
            "fotos": [
                {
                    "imagem": "foto-id-1",
                    "fotoPrincipal": true,
                    "ordem": 1,
                    "id": "foto-1"
                },
                {
                    "imagem": "foto-id-2",
                    "fotoPrincipal": false,
                    "ordem": 2,
                    "id": "foto-2"
                }
            ],
            "redesSociais": {
                "instagram": "https://instagram.com/hondabymoto",
                "facebook": "https://facebook.com/hondabymoto",
                "youtube": "https://youtube.com/@hondabymoto",
                "linkedin": "https://linkedin.com/company/hondabymoto"
            },
            "matriz": true,
            "id": "conc-1"
        }
    ],
    "createdAt": "2025-01-14T12:00:00.000Z",
    "updatedAt": "2025-01-14T12:00:00.000Z"
}
```

> Obs.: Campos como `logoConcessionaria`, `logoConcessionariaBranca`, `logoConcessionariaPreta` e `imagem` (dentro de `fotos`) retornam o `id` do documento na coleção `midia`.

---

## Interface TypeScript de Exemplo

Interfaces pensadas para uso no frontend, onde os `id`s de imagens já foram resolvidos para objetos da coleção `midia`.

```ts
/**
 * Tipo para imagens da coleção Midia
 */
export type Midia = {
    id: string;
    url: string;
    alt: string;
    filename: string;
    width?: number;
    height?: number;
};

/**
 * Estrutura de endereço
 */
export type Endereco = {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
};

/**
 * Telefone com código do país e número formatado
 */
export type Telefone = {
    id: string;
    rotulo: string;
    codigoPais: string;
    numero: string;
    temWhatsapp: boolean;
};

/**
 * Grupo de e-mails da concessionária
 */
export type Emails = {
    emailContato: string;
    emailRH?: string;
    emailVendas?: string;
    emailSeminovas?: string;
    emailTestRide?: string;
};

/**
 * Horário de funcionamento
 */
export type Horario = {
    id: string;
    dias: string;
    horario: string;
};

/**
 * URLs de integração LeadsConnect e MyHonda
 */
export type LeadsConnectMyHonda = {
    myHondaDealerCode: number;
    whatsappLeadsConnectUrl: string;
    leadsConnectFormularioCompletoUrl: string;
    leadsConnectVendasUrl: string;
    leadsConnectTestRideUrl: string;
    leadsConnectSegurosUrl: string;
    agendamentoDigitalHondaUrl: string;
    pecasHondaUrl: string;
};

/**
 * Foto da concessionária
 */
export type FotoConcessionaria = {
    id: string;
    imagem: Midia;
    fotoPrincipal: boolean;
    ordem?: number;
};

/**
 * URLs das redes sociais
 */
export type RedesSociais = {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
};

/**
 * Dados completos de uma concessionária/filial
 */
export type Concessionaria = {
    id: string;
    nome: string;
    endereco: Endereco;
    googleMapUrl: string;
    telefones: Telefone[];
    emails: Emails;
    horarios: Horario[];
    leadsConnectMyHonda: LeadsConnectMyHonda;
    fotos: FotoConcessionaria[];
    redesSociais: RedesSociais;
    matriz: boolean;
};

/**
 * Empresa (dados corporativos)
 */
export type Empresa = {
    nome: string;
    nomeFantasia: string;
    cnpj: string;
    siteUrl: string;
    logoConcessionaria: Midia;
    logoConcessionariaBranca: Midia;
    logoConcessionariaPreta: Midia;
    gtmId?: string;
    ga4Id?: string;
};

/**
 * Dados Institucionais completos
 */
export type DadosInstitucionais = Empresa & {
    id: string;
    concessionarias: Concessionaria[];
    createdAt: string;
    updatedAt: string;
};
```

---

## Boas práticas de consumo

### Dados Gerais

- **Cache:** Por ser um global, os dados mudam com pouca frequência. Considere cachear a resposta por um período razoável (ex.: 1 hora).
- **Logos:** Use `logoConcessionaria` para fundos claros, `logoConcessionariaBranca` para fundos escuros e `logoConcessionariaPreta` como alternativa.

### Concessionárias

- **Matriz:** Identifique a concessionária principal pelo campo `matriz: true`. Útil para definir padrões ou priorizar informações.
- **Telefones:**
    - Use `codigoPais + numero` para criar links `tel:` no formato internacional: `tel:+5544999999999`
    - Exiba o ícone de WhatsApp apenas quando `temWhatsapp: true`
- **Endereço completo:** Monte o endereço no formato: `rua, numero - bairro, cidade/estado - CEP`
- **Google Maps:** Use `googleMapUrl` como `src` de um `<iframe>` para exibir o mapa incorporado
- **Horários:** Exiba em formato de lista ou tabela para melhor legibilidade

### URLs de Integração (LeadsConnect e MyHonda)

- **WhatsApp:** Use `whatsappLeadsConnectUrl` para o botão flutuante de WhatsApp em todo o site
- **Formulários:**
    - `leadsConnectFormularioCompletoUrl` → Formulário de consórcio (MyHonda)
    - `leadsConnectVendasUrl` → Formulários de vendas/motos novas
    - `leadsConnectTestRideUrl` → Formulários de test ride
    - `leadsConnectSegurosUrl` → Formulários de seguros
- **Serviços:**
    - `agendamentoDigitalHondaUrl` → Agendamento de revisão/manutenção
    - `pecasHondaUrl` → Loja de peças genuínas Honda
- **MyHonda Dealer Code:** Use para identificar a concessionária nas integrações Honda

### Fotos da Concessionária

- **Foto Principal:** Priorize a exibição da foto com `fotoPrincipal: true` em destaques ou carrosséis
- **Ordenação:** Ordene as fotos pelo campo `ordem` (valores menores aparecem primeiro)
- **Galeria:** Use todas as fotos ordenadas para criar uma galeria completa da concessionária

### Redes Sociais

- **Links:** Todos os campos de `redesSociais` são opcionais. Exiba apenas os ícones cujas URLs estejam preenchidas
- **Validação:** As URLs são validadas para garantir que pertencem à plataforma correta
- **Target:** Abra os links em nova aba (`target="_blank"` e `rel="noopener noreferrer"`)

### Multi-concessionária

Se o site gerenciar múltiplas concessionárias:

- **Seletor de Filial:** Permita que o usuário escolha sua concessionária preferida
- **Persistência:** Salve a escolha no `localStorage` ou `cookie`
- **Formulários Dinâmicos:** Use as URLs do `leadsConnectMyHonda` da concessionária selecionada
- **Informações Contextuais:** Exiba telefone, endereço e horários da filial escolhida

---

## Formato dos Dados

### Telefone

- **Código do País:** Sempre numérico (ex.: `"55"` para Brasil)
- **Número:** Já formatado com máscara: `"(44) 99999-9999"` ou `"(44) 3333-3333"`
- **Link internacional:** Remova caracteres não numéricos e concatene: `+55` + `44999999999` = `+5544999999999`

### CEP

- Formatado: `"12345-678"`

### CNPJ

- Formatado: `"12.345.678/0001-90"`

### Datas

- ISO 8601: `"2025-01-14T12:00:00.000Z"`
- Use bibliotecas como `date-fns` ou `dayjs` para formatação local

---

## Exemplo de Uso no Frontend

### React/Next.js

```tsx
import { DadosInstitucionais } from "@/types/dados-institucionais";

export default function Footer({ dados }: { dados: DadosInstitucionais }) {
    const matriz = dados.concessionarias.find((c) => c.matriz);

    return (
        <footer>
            <img src={dados.logoConcessionariaBranca.url} alt="Logo" />
            <p>
                {dados.nome} - CNPJ: {dados.cnpj}
            </p>

            {matriz && (
                <div>
                    <h3>{matriz.nome}</h3>
                    <p>
                        {matriz.endereco.rua}, {matriz.endereco.numero} -{matriz.endereco.bairro},{" "}
                        {matriz.endereco.cidade}/{matriz.endereco.estado}
                    </p>

                    {matriz.telefones.map((tel) => (
                        <a key={tel.id} href={`tel:+${tel.codigoPais}${tel.numero.replace(/\D/g, "")}`}>
                            {tel.rotulo}: {tel.numero}
                            {tel.temWhatsapp && <span> (WhatsApp)</span>}
                        </a>
                    ))}

                    <div>
                        {matriz.redesSociais.instagram && (
                            <a href={matriz.redesSociais.instagram} target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        )}
                        {matriz.redesSociais.facebook && (
                            <a href={matriz.redesSociais.facebook} target="_blank" rel="noopener noreferrer">
                                Facebook
                            </a>
                        )}
                    </div>
                </div>
            )}
        </footer>
    );
}
```

### Astro

```astro
---
import type { DadosInstitucionais } from '@/types/dados-institucionais';

const response = await fetch('https://api.example.com/api/globals/dados-institucionais');
const dados: DadosInstitucionais = await response.json();
const matriz = dados.concessionarias.find(c => c.matriz);
---

<footer>
    <img src={dados.logoConcessionariaBranca.url} alt="Logo" />

    {matriz && (
        <div>
            <h3>{matriz.nome}</h3>
            {matriz.telefones.map(tel => (
                <a href={`tel:+${tel.codigoPais}${tel.numero.replace(/\D/g, '')}`}>
                    {tel.rotulo}: {tel.numero}
                </a>
            ))}
        </div>
    )}
</footer>
```

---

## Validações Aplicadas

Todos os campos possuem validações robustas no backend:

- ✅ **CNPJ:** Validação completa com dígitos verificadores
- ✅ **CEP:** Formato brasileiro (8 dígitos)
- ✅ **Telefone:** DDD + número (10 ou 11 dígitos)
- ✅ **URLs:** Protocolo http/https obrigatório
- ✅ **Redes Sociais:** Validação de domínio específico por plataforma
- ✅ **Código do País:** 1 a 3 dígitos numéricos

Formatações automáticas são aplicadas via hooks no backend.
