import type { CollectionConfig } from "payload";

export const PerfisAcesso: CollectionConfig = {
    slug: "perfis-acesso",
    labels: {
        singular: "Perfil de Acesso",
        plural: "Perfis de Acesso",
    },
    admin: {
        useAsTitle: "nome",
        defaultColumns: ["nome", "nivelHierarquia", "ativo"],
        group: "Administrativo",
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "nome",
            label: "Nome do Perfil",
            type: "text",
            required: true,
        },
        {
            name: "descricao",
            label: "Descrição",
            type: "textarea",
        },
        {
            name: "nivelHierarquia",
            label: "Nível Hierárquico",
            type: "number",
            required: true,
            admin: {
                description: "Quanto menor o número, maior o nível de acesso",
            },
        },
        {
            name: "permissoesColecoes",
            label: "Permissões por Coleção",
            type: "array",
            labels: {
                singular: "Permissão de Coleção",
                plural: "Permissões de Coleções",
            },
            fields: [
                {
                    name: "colecao",
                    label: "Coleção",
                    type: "select",
                    required: true,
                    options: [
                        { label: "Usuários", value: "usuarios" },
                        { label: "Mídia", value: "midia" },
                        { label: "Banners Página Inicial", value: "banners-pagina-inicial" },
                    ],
                },
                {
                    name: "podeListar",
                    label: "Pode listar",
                    type: "checkbox",
                    defaultValue: true,
                },
                {
                    name: "podeCriar",
                    label: "Pode criar",
                    type: "checkbox",
                    defaultValue: false,
                },
                {
                    name: "podeEditar",
                    label: "Pode editar",
                    type: "checkbox",
                    defaultValue: false,
                },
                {
                    name: "podeExcluir",
                    label: "Pode excluir",
                    type: "checkbox",
                    defaultValue: false,
                },
            ],
        },
        {
            name: "permissoesMenus",
            label: "Permissões por Menu",
            type: "array",
            labels: {
                singular: "Permissão de Menu",
                plural: "Permissões de Menus",
            },
            fields: [
                {
                    name: "menu",
                    label: "Menu",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Identificador do menu (slug ou chave interna)",
                    },
                },
                {
                    name: "podeAcessar",
                    label: "Pode acessar",
                    type: "checkbox",
                    defaultValue: true,
                },
            ],
        },
        {
            name: "ativo",
            label: "Ativo",
            type: "checkbox",
            defaultValue: true,
        },
    ],
};
