import type { GlobalConfig } from "payload";
import { validateNotEmpty } from "@/lib/validations";

export const Parametros: GlobalConfig = {
    slug: "parametros",
    label: "Parâmetros do Site",
    access: {
        read: () => true,
    },
    fields: [
        {
            type: "tabs",
            tabs: [
                {
                    label: "Funcionalidades",
                    description: "Controle de funcionalidades e seções do site",
                    fields: [
                        {
                            name: "habilitarSeminovos",
                            label: "Habilitar Seminovos",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description: "Se desabilitado, oculta toda a seção de motos seminovas do site",
                            },
                        },
                        {
                            name: "exibirTenhoInteresseHeader",
                            label: 'Exibir Botão "Tenho Interesse" no Header',
                            type: "checkbox",
                            defaultValue: false,
                            required: true,
                            admin: {
                                description: "Exibe o botão TENHO INTERESSE no header (versão desktop)",
                            },
                        },
                        {
                            name: "exibirPrecoMotosNovas",
                            label: "Exibir Preço nas Motos Novas",
                            type: "checkbox",
                            defaultValue: false,
                            required: true,
                            admin: {
                                description: "Controla a exibição de preços nos cards de motos novas (Grid/Carousel)",
                            },
                        },
                        {
                            name: "exibirModelosSeparadosMotosNovasGrid",
                            label: "Exibir Modelos Separados no Grid de Motos Novas",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description: "Exibe cards separados por modelo/variação (similar ao grid de ofertas)",
                            },
                        },
                        {
                            name: "exibirModelosSeparadosConsorcioGrid",
                            label: "Exibir Modelos Separados no Grid de Consórcio",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description: "Exibe cards separados por modelo/variação (similar ao grid de ofertas)",
                            },
                        },
                        {
                            name: "utilizarParcelasConsorcioComSeguro",
                            label: "Utilizar Parcelas com Seguro no Consórcio",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description:
                                    "Se ativo, usa o valor da parcela com seguro para o menor valor exibido no consórcio",
                            },
                        },
                        {
                            name: "habilitarTagsGTM",
                            label: "Habilitar Google Tag Manager (GTM)",
                            type: "checkbox",
                            defaultValue: false,
                            required: true,
                            admin: {
                                description: "Se ativo, carrega as tags do Google Tag Manager no site",
                            },
                        },
                        {
                            name: "seminovasCardCompartilhadoResumirInformacoes",
                            label: "Resumir Informações no Card de Compartilhamento de Seminovas",
                            type: "checkbox",
                            defaultValue: false,
                            required: true,
                            admin: {
                                description:
                                    "Se ativo, o card de compartilhamento resume as informações. Se desativado, exibe listas completas",
                            },
                        },
                    ],
                },
                {
                    label: "SEO e Branding",
                    description: "Configurações de SEO, logos e identidade visual",
                    fields: [
                        {
                            name: "tituloPadraoSite",
                            label: "Título Padrão do Site",
                            type: "text",
                            required: true,
                            defaultValue: "Sua Concessionária – Concessionária Honda",
                            admin: {
                                description: "Título padrão usado no <title> e meta tags (fallback global)",
                            },
                            validate: validateNotEmpty("Título padrão do site"),
                        },
                        {
                            name: "descricaoPadraoSite",
                            label: "Descrição Padrão do Site",
                            type: "textarea",
                            required: true,
                            defaultValue:
                                "Motos novas e seminovas, consórcio, serviços e peças genuínas. Atendimento em todo o Brasil!",
                            admin: {
                                description: "Meta description padrão usada no layout (fallback global)",
                            },
                            validate: validateNotEmpty("Descrição padrão do site"),
                        },
                        {
                            name: "alturaLogoConcessionariaHeader",
                            label: "Altura do Logo no Header",
                            type: "text",
                            required: true,
                            defaultValue: "68px",
                            admin: {
                                description: "Altura do logo da concessionária no header (ex.: 68px, 4rem)",
                                placeholder: "68px",
                            },
                            validate: validateNotEmpty("Altura do logo no header"),
                        },
                        {
                            name: "alturaLogoConcessionariaFooter",
                            label: "Altura do Logo no Footer",
                            type: "text",
                            required: true,
                            defaultValue: "68px",
                            admin: {
                                description: "Altura do logo da concessionária no footer (ex.: 68px, 4rem)",
                                placeholder: "68px",
                            },
                            validate: validateNotEmpty("Altura do logo no footer"),
                        },
                        {
                            name: "usarLogoConcessionariaHeaderMobile",
                            label: "Usar Logo no Header Mobile",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description:
                                    "Se ativo, usa a logo da concessionária no header mobile. Se desativado, usa texto com nome fantasia",
                            },
                        },
                    ],
                },
                {
                    label: "Formulários",
                    description: "Configurações de formulários e integrações",
                    fields: [
                        {
                            name: "motosNovasTipoForm",
                            label: "Tipo de Formulário - Motos Novas",
                            type: "select",
                            required: true,
                            defaultValue: "WebToLead",
                            options: [
                                {
                                    label: "LeadsConnect (iframe para formulário do Salesforce no myHonda, interface e usabilidade ruim mas é o recomendado pela norma CEC)",
                                    value: "LeadsConnect",
                                },
                                {
                                    label: "WebToLead (Formulário personalizado, usabilidade ideal e integrado ao myHonda mas com pontuação reduzida no CEC)",
                                    value: "WebToLead",
                                },
                            ],
                            admin: {
                                description: "Define qual tipo de formulário será usado para leads de motos novas",
                            },
                        },
                        {
                            name: "testRideTipoForm",
                            label: "Tipo de Formulário - Test Ride",
                            type: "select",
                            required: true,
                            defaultValue: "Email",
                            options: [
                                {
                                    label: "Email (Formulário nativo que envia informações pro email parametrizado e também grava no CMS)",
                                    value: "Email",
                                },
                                {
                                    label: "LeadsConnect (iframe para formulário do Salesforce no myHonda, interface e usabilidade ruim mas é o recomendado pela norma CEC)",
                                    value: "LeadsConnect",
                                },
                            ],
                            admin: {
                                description: "Define qual tipo de formulário será usado para Test Ride",
                            },
                        },
                        {
                            name: "webToLeadFormsTest",
                            label: "Usar Ambiente de Teste (WebToLead)",
                            type: "checkbox",
                            defaultValue: false,
                            required: true,
                            admin: {
                                description:
                                    "Se ativo, os formulários WebToLead usarão o ambiente de teste da Salesforce",
                            },
                        },
                    ],
                },
                {
                    label: "WhatsApp e Telefone",
                    description: "Configurações de WhatsApp e telefone no site",
                    fields: [
                        {
                            name: "separarWhatsAppLeadsConnectPorFilial",
                            label: "Separar WhatsApp por Filial",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description:
                                    "Se ativo, o WhatsApp flutuante exibe menu expansível com links separados por concessionária",
                            },
                        },
                        {
                            name: "ocultarWhatsappHeaderMobile",
                            label: "Ocultar WhatsApp no Header Mobile",
                            type: "checkbox",
                            defaultValue: true,
                            required: true,
                            admin: {
                                description:
                                    "Se ativo, oculta o botão do WhatsApp no header mobile, exibindo apenas o botão de telefone",
                            },
                        },
                    ],
                },
                {
                    label: "Cards - Motos Novas",
                    description: "Configurações de botões dos cards de motos novas",
                    fields: [
                        {
                            name: "cardMotosNovasTextoBotao",
                            label: "Texto do Botão",
                            type: "text",
                            required: true,
                            defaultValue: "TENHO INTERESSE",
                            admin: {
                                description: "Texto exibido no botão principal dos cards de motos novas",
                            },
                            validate: validateNotEmpty("Texto do botão"),
                        },
                        {
                            name: "cardMotosNovasExibirBotaoFixo",
                            label: "Exibir Botão Fixo",
                            type: "select",
                            required: true,
                            defaultValue: "xs",
                            options: [
                                {
                                    label: "Nenhum (apenas no hover)",
                                    value: "nenhum",
                                },
                                {
                                    label: "Apenas Mobile (xs)",
                                    value: "xs",
                                },
                                {
                                    label: "Todos os tamanhos",
                                    value: "todos",
                                },
                            ],
                            admin: {
                                description: "Controla quando o botão fica sempre visível (sem hover)",
                            },
                        },
                    ],
                },
                {
                    label: "Cards - Seminovas",
                    description: "Configurações de botões dos cards de motos seminovas",
                    fields: [
                        {
                            name: "cardMotosSeminovasTextoBotao",
                            label: "Texto do Botão",
                            type: "text",
                            required: true,
                            defaultValue: "VER DETALHES",
                            admin: {
                                description: "Texto exibido no botão principal dos cards de motos seminovas",
                            },
                            validate: validateNotEmpty("Texto do botão"),
                        },
                        {
                            name: "cardMotosSeminovasExibirBotaoFixo",
                            label: "Exibir Botão Fixo",
                            type: "select",
                            required: true,
                            defaultValue: "xs",
                            options: [
                                {
                                    label: "Nenhum (apenas no hover)",
                                    value: "nenhum",
                                },
                                {
                                    label: "Apenas Mobile (xs)",
                                    value: "xs",
                                },
                                {
                                    label: "Todos os tamanhos",
                                    value: "todos",
                                },
                            ],
                            admin: {
                                description: "Controla quando o botão fica sempre visível (sem hover)",
                            },
                        },
                    ],
                },
                {
                    label: "Cards - Ofertas",
                    description: "Configurações de botões dos cards de ofertas",
                    fields: [
                        {
                            name: "cardOfertasTextoBotao",
                            label: "Texto do Botão",
                            type: "text",
                            required: true,
                            defaultValue: "EU QUERO!",
                            admin: {
                                description: "Texto exibido no botão principal dos cards de ofertas",
                            },
                            validate: validateNotEmpty("Texto do botão"),
                        },
                        {
                            name: "cardOfertasExibirBotaoFixo",
                            label: "Exibir Botão Fixo",
                            type: "select",
                            required: true,
                            defaultValue: "xs",
                            options: [
                                {
                                    label: "Nenhum (apenas no hover)",
                                    value: "nenhum",
                                },
                                {
                                    label: "Apenas Mobile (xs)",
                                    value: "xs",
                                },
                                {
                                    label: "Todos os tamanhos",
                                    value: "todos",
                                },
                            ],
                            admin: {
                                description: "Controla quando o botão fica sempre visível (sem hover)",
                            },
                        },
                    ],
                },
                {
                    label: "Cards - Consórcio",
                    description: "Configurações de botões dos cards de consórcio",
                    fields: [
                        {
                            name: "cardConsorcioTextoBotao",
                            label: "Texto do Botão",
                            type: "text",
                            required: true,
                            defaultValue: "ESTOU INTERESSADO",
                            admin: {
                                description: "Texto exibido no botão principal dos cards de consórcio",
                            },
                            validate: validateNotEmpty("Texto do botão"),
                        },
                        {
                            name: "cardConsorcioExibirBotaoFixo",
                            label: "Exibir Botão Fixo",
                            type: "select",
                            required: true,
                            defaultValue: "xs",
                            options: [
                                {
                                    label: "Nenhum (apenas no hover)",
                                    value: "nenhum",
                                },
                                {
                                    label: "Apenas Mobile (xs)",
                                    value: "xs",
                                },
                                {
                                    label: "Todos os tamanhos",
                                    value: "todos",
                                },
                            ],
                            admin: {
                                description: "Controla quando o botão fica sempre visível (sem hover)",
                            },
                        },
                    ],
                },
                {
                    label: "Cards - Serviços",
                    description: "Configurações de botões dos cards de serviços",
                    fields: [
                        {
                            name: "cardServicosTextoBotao",
                            label: "Texto do Botão",
                            type: "text",
                            required: true,
                            defaultValue: "AGENDAR SERVIÇO",
                            admin: {
                                description: "Texto exibido no botão principal dos cards de serviços",
                            },
                            validate: validateNotEmpty("Texto do botão"),
                        },
                        {
                            name: "cardServicosExibirBotaoFixo",
                            label: "Exibir Botão Fixo",
                            type: "select",
                            required: true,
                            defaultValue: "xs",
                            options: [
                                {
                                    label: "Nenhum (apenas no hover)",
                                    value: "nenhum",
                                },
                                {
                                    label: "Apenas Mobile (xs)",
                                    value: "xs",
                                },
                                {
                                    label: "Todos os tamanhos",
                                    value: "todos",
                                },
                            ],
                            admin: {
                                description: "Controla quando o botão fica sempre visível (sem hover)",
                            },
                        },
                    ],
                },
                {
                    label: "Ordem das Seções",
                    description: "Defina a ordem de exibição das seções na página inicial",
                    fields: [
                        {
                            name: "secoesHomeOrdem",
                            label: "Ordem das Seções da Home",
                            type: "array",
                            required: true,
                            labels: {
                                singular: "Seção",
                                plural: "Seções",
                            },
                            admin: {
                                description:
                                    "Ajuste a ordem arrastando as seções. As seções aparecerão nesta ordem após o banner principal",
                            },
                            defaultValue: [
                                { secao: "motos-novas" },
                                { secao: "ofertas" },
                                { secao: "consorcio" },
                                { secao: "test-ride" },
                                { secao: "motos-seminovas" },
                                { secao: "servicos" },
                            ],
                            fields: [
                                {
                                    name: "secao",
                                    label: "Seção",
                                    type: "select",
                                    required: true,
                                    options: [
                                        {
                                            label: "Motos Novas",
                                            value: "motos-novas",
                                        },
                                        {
                                            label: "Ofertas",
                                            value: "ofertas",
                                        },
                                        {
                                            label: "Consórcio",
                                            value: "consorcio",
                                        },
                                        {
                                            label: "Test Ride",
                                            value: "test-ride",
                                        },
                                        {
                                            label: "Motos Seminovas",
                                            value: "motos-seminovas",
                                        },

                                        {
                                            label: "Serviços",
                                            value: "servicos",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
