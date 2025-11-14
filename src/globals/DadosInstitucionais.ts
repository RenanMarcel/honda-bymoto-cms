import type { GlobalConfig } from "payload";
import {
    formatBrazilianPhone,
    formatCEP,
    formatCNPJ,
    validateBrazilianPhone,
    validateCEP,
    validateCNPJ,
    validateCountryCode,
    validatePositiveInteger,
    validateSocialMediaURL,
    validateURL,
} from "@/lib/validations";

export const DadosInstitucionais: GlobalConfig = {
    slug: "dados-institucionais",
    label: "Dados Institucionais",
    access: {
        read: () => true,
    },
    fields: [
        {
            type: "tabs",
            tabs: [
                {
                    label: "Empresa",
                    fields: [
                        {
                            name: "nome",
                            label: "Nome",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "nomeFantasia",
                            label: "Nome Fantasia",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "cnpj",
                            label: "CNPJ",
                            type: "text",
                            required: true,
                            admin: {
                                description: "CNPJ da empresa (será formatado automaticamente)",
                                placeholder: "12.345.678/0001-90",
                            },
                            hooks: {
                                afterChange: [
                                    ({ value }) => {
                                        if (typeof value !== "string") return value;
                                        return formatCNPJ(value);
                                    },
                                ],
                            },
                            validate: validateCNPJ,
                        },
                        {
                            name: "siteUrl",
                            label: "URL do Site",
                            type: "text",
                            required: true,
                            admin: {
                                description: "URL completa do site (ex.: https://exemplo.com)",
                                placeholder: "https://exemplo.com",
                            },
                            validate: validateURL(true),
                        },
                        {
                            name: "logoConcessionaria",
                            label: "Logo Concessionária",
                            type: "upload",
                            relationTo: "midia",
                            required: true,
                        },
                        {
                            name: "logoConcessionariaBranca",
                            label: "Logo Concessionária Branca",
                            type: "upload",
                            relationTo: "midia",
                            required: true,
                        },
                        {
                            name: "logoConcessionariaPreta",
                            label: "Logo Concessionária Preta",
                            type: "upload",
                            relationTo: "midia",
                            required: true,
                        },
                        {
                            name: "gtmId",
                            label: "Google Tag Manager ID",
                            type: "text",
                            admin: {
                                description: "Google Tag Manager Container ID (ex.: GTM-XXXXXXX)",
                            },
                        },
                        {
                            name: "ga4Id",
                            label: "Google Analytics 4 ID",
                            type: "text",
                            admin: {
                                description: "Google Analytics 4 Measurement ID (ex.: G-XXXXXXXXXX)",
                            },
                        },
                    ],
                },
                {
                    label: "Concessionárias",
                    fields: [
                        {
                            name: "concessionarias",
                            label: "Concessionárias",
                            type: "array",
                            labels: {
                                singular: "Concessionária",
                                plural: "Concessionárias",
                            },
                            fields: [
                                {
                                    name: "nome",
                                    label: "Nome",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    name: "endereco",
                                    label: "Endereço",
                                    type: "group",
                                    fields: [
                                        {
                                            name: "cep",
                                            label: "CEP",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "CEP do endereço (será formatado automaticamente)",
                                                placeholder: "12345-678",
                                            },
                                            hooks: {
                                                afterChange: [
                                                    ({ value }) => {
                                                        if (typeof value !== "string") return value;
                                                        return formatCEP(value);
                                                    },
                                                ],
                                            },
                                            validate: validateCEP,
                                        },
                                        {
                                            name: "rua",
                                            label: "Rua",
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "numero",
                                            label: "Número",
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "bairro",
                                            label: "Bairro",
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "cidade",
                                            label: "Cidade",
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "estado",
                                            label: "Estado",
                                            type: "text",
                                            required: true,
                                        },
                                    ],
                                },
                                {
                                    name: "googleMapUrl",
                                    label: "Google Maps URL",
                                    type: "text",
                                    required: true,
                                    admin: {
                                        description:
                                            "Ex.: https://maps.google.com/maps?q=moto%20e%20cia%20jardim%20inga&t=m&z=12&output=embed&iwloc=near",
                                    },
                                    validate: validateURL(true),
                                },
                                {
                                    name: "telefones",
                                    label: "Telefones",
                                    type: "array",
                                    labels: {
                                        singular: "Telefone",
                                        plural: "Telefones",
                                    },
                                    fields: [
                                        {
                                            name: "rotulo",
                                            label: "Rótulo",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "Ex.: Telefone, Fixo, WhatsApp",
                                            },
                                        },
                                        {
                                            name: "codigoPais",
                                            label: "Código do País",
                                            type: "text",
                                            required: true,
                                            defaultValue: "55",
                                            admin: {
                                                description: "Código internacional (ex.: 55 para Brasil)",
                                            },
                                            validate: validateCountryCode,
                                        },
                                        {
                                            name: "numero",
                                            label: "Número com DDD",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description:
                                                    "Digite o número com DDD. Será formatado automaticamente (ex.: (11) 98765-4321)",
                                                placeholder: "(11) 98765-4321",
                                            },
                                            hooks: {
                                                afterChange: [
                                                    ({ value }) => {
                                                        if (typeof value !== "string") return value;
                                                        return formatBrazilianPhone(value);
                                                    },
                                                ],
                                            },
                                            validate: validateBrazilianPhone,
                                        },
                                        {
                                            name: "temWhatsapp",
                                            label: "Tem WhatsApp",
                                            type: "checkbox",
                                            defaultValue: false,
                                        },
                                    ],
                                },
                                {
                                    name: "emails",
                                    label: "E-mails",
                                    type: "group",
                                    fields: [
                                        {
                                            name: "emailContato",
                                            label: "E-mail Contato",
                                            type: "email",
                                            required: true,
                                        },
                                        {
                                            name: "emailRH",
                                            label: "E-mail RH",
                                            type: "email",
                                        },
                                        {
                                            name: "emailVendas",
                                            label: "E-mail Vendas",
                                            type: "email",
                                        },
                                        {
                                            name: "emailSeminovas",
                                            label: "E-mail Seminovas",
                                            type: "email",
                                        },
                                        {
                                            name: "emailTestRide",
                                            label: "E-mail Test Ride",
                                            type: "email",
                                        },
                                    ],
                                },
                                {
                                    name: "horarios",
                                    label: "Horários de Funcionamento",
                                    type: "array",
                                    labels: {
                                        singular: "Horário",
                                        plural: "Horários",
                                    },
                                    fields: [
                                        {
                                            name: "dias",
                                            label: "Dias",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "Ex.: Segunda a Sexta",
                                            },
                                        },
                                        {
                                            name: "horario",
                                            label: "Horário",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "Ex.: 08:00 - 18:00",
                                            },
                                        },
                                    ],
                                },
                                {
                                    name: "leadsConnectMyHonda",
                                    label: "LeadsConnect e MyHonda",
                                    type: "group",
                                    fields: [
                                        {
                                            name: "myHondaDealerCode",
                                            label: "MyHonda Dealer Code",
                                            type: "number",
                                            required: true,
                                            validate: validatePositiveInteger(true),
                                        },
                                        {
                                            name: "whatsappLeadsConnectUrl",
                                            label: "WhatsApp LeadsConnect URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description:
                                                    "Usado no botão flutuante de WhatsApp em todo o site (multi-concessionária)",
                                            },
                                            validate: validateURL(true),
                                        },
                                        {
                                            name: "leadsConnectFormularioCompletoUrl",
                                            label: "LeadsConnect Formulário Completo URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "Usado nos formulários da página de consórcio (MyHonda)",
                                            },
                                            validate: validateURL(true),
                                        },
                                        {
                                            name: "leadsConnectVendasUrl",
                                            label: "LeadsConnect Vendas URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "Usado nos formulários da página de motos novas (vendas)",
                                            },
                                            validate: validateURL(true),
                                        },
                                        {
                                            name: "leadsConnectTestRideUrl",
                                            label: "LeadsConnect Test Ride URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description:
                                                    "Usado nos formulários da página de test ride (agendamento de test drive)",
                                            },
                                            validate: validateURL(true),
                                        },
                                        {
                                            name: "leadsConnectSegurosUrl",
                                            label: "LeadsConnect Seguros URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description: "Usado nos formulários da página de seguros",
                                            },
                                            validate: validateURL(true),
                                        },
                                        {
                                            name: "agendamentoDigitalHondaUrl",
                                            label: "Agendamento Digital Honda URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description:
                                                    "Usado nos formulários e botões de agendamento de serviços (revisão, manutenção)",
                                            },
                                            validate: validateURL(true),
                                        },
                                        {
                                            name: "pecasHondaUrl",
                                            label: "Peças Honda URL",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                description:
                                                    "Usado nos botões e links da página de peças genuínas Honda",
                                            },
                                            validate: validateURL(true),
                                        },
                                    ],
                                },
                                {
                                    name: "fotos",
                                    label: "Fotos da Concessionária",
                                    type: "array",
                                    labels: {
                                        singular: "Foto",
                                        plural: "Fotos",
                                    },
                                    admin: {
                                        description: "Adicione fotos da concessionária para exibição no site",
                                    },
                                    fields: [
                                        {
                                            name: "imagem",
                                            label: "Imagem",
                                            type: "upload",
                                            relationTo: "midia",
                                            required: true,
                                        },
                                        {
                                            name: "fotoPrincipal",
                                            label: "Foto Principal",
                                            type: "checkbox",
                                            defaultValue: false,
                                            admin: {
                                                description: "Marque apenas uma foto como principal para destaque",
                                            },
                                        },
                                        {
                                            name: "ordem",
                                            label: "Ordem",
                                            type: "number",
                                            admin: {
                                                description: "Ordem de exibição (números menores aparecem primeiro)",
                                            },
                                        },
                                    ],
                                },
                                {
                                    name: "redesSociais",
                                    label: "Redes Sociais",
                                    type: "group",
                                    fields: [
                                        {
                                            name: "instagram",
                                            label: "Instagram",
                                            type: "text",
                                            admin: {
                                                description: "Ex.: https://instagram.com/hondabymoto",
                                            },
                                            validate: validateSocialMediaURL("instagram"),
                                        },
                                        {
                                            name: "facebook",
                                            label: "Facebook",
                                            type: "text",
                                            admin: {
                                                description: "Ex.: https://facebook.com/hondabymoto",
                                            },
                                            validate: validateSocialMediaURL("facebook"),
                                        },
                                        {
                                            name: "youtube",
                                            label: "YouTube",
                                            type: "text",
                                            admin: {
                                                description: "Ex.: https://youtube.com/@hondabymoto",
                                            },
                                            validate: validateSocialMediaURL("youtube"),
                                        },
                                        {
                                            name: "linkedin",
                                            label: "LinkedIn",
                                            type: "text",
                                            admin: {
                                                description: "Ex.: https://linkedin.com/company/hondabymoto",
                                            },
                                            validate: validateSocialMediaURL("linkedin"),
                                        },
                                    ],
                                },
                                {
                                    name: "matriz",
                                    label: "Matriz",
                                    type: "checkbox",
                                    defaultValue: false,
                                    admin: {
                                        description: "Marque se esta é a concessionária matriz",
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
