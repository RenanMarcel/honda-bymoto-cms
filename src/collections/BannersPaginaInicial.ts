import type { CollectionConfig } from "payload";

export const BannersPaginaInicial: CollectionConfig = {
    slug: "banners-pagina-inicial",
    labels: {
        singular: "Banner Página Inicial",
        plural: "Banners Página Inicial",
    },
    admin: {
        useAsTitle: "titulo",
        defaultColumns: ["descricao", "ordem", "dataValidadeInicial", "dataValidadeFinal", "ativo"],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "descricao",
            label: "Descrição interna",
            type: "text",
            admin: {
                description: "Descrição interna para identificação (não exibido no site)",
            },
        },
        {
            name: "titulo",
            label: "Título",
            type: "text",
        },
        {
            name: "subtitulo",
            label: "Subtítulo",
            type: "text",
        },
        {
            name: "bannerUrl",
            label: "URL do Banner",
            type: "text",
            admin: {
                description: "Link para onde o banner deve direcionar ao ser clicado",
            },
        },
        {
            name: "imagemDesktop",
            label: "Imagem Desktop",
            type: "upload",
            relationTo: "midia",
            required: true,
            admin: {
                description: "Imagem principal para desktop (1920x800 recomendado)",
            },
        },
        {
            name: "imagemMobile",
            label: "Imagem Mobile",
            type: "upload",
            relationTo: "midia",
            admin: {
                description: "Imagem específica para dispositivos móveis (780x840 recomendado)",
            },
        },
        {
            name: "dataValidadeInicial",
            label: "Data de Validade Inicial",
            type: "date",
            admin: {
                description: "Data a partir da qual o banner deve ser exibido no site",
                date: {
                    displayFormat: "dd/MM/yyyy",
                },
            },
        },
        {
            name: "dataValidadeFinal",
            label: "Data de Validade Final",
            type: "date",
            admin: {
                description: "Após essa data, o banner será ocultado do site",
                date: {
                    displayFormat: "dd/MM/yyyy",
                },
            },
        },
        {
            name: "textoLegal",
            label: "Texto Legal",
            type: "textarea",
        },
        {
            name: "ordem",
            label: "Ordem",
            type: "number",
            admin: {
                description: "Define a ordem de exibição do banner; números menores aparecem primeiro",
            },
        },
        {
            name: "ativo",
            label: "Ativo",
            type: "checkbox",
            defaultValue: true,
            admin: {
                description: "Desmarque para ocultar o banner do site",
            },
        },
    ],
};
