import type { CollectionConfig } from "payload";

export const Usuarios: CollectionConfig = {
    slug: "usuarios",
    labels: {
        singular: "Usuário",
        plural: "Usuários",
    },
    admin: {
        useAsTitle: "email",
        group: "Administrativo",
    },
    auth: {
        tokenExpiration: 7200,
        verify: false,
        maxLoginAttempts: 5,
        lockTime: 600 * 1000,
    },
    fields: [
        {
            name: "nome",
            label: "Nome",
            type: "text",
        },
        {
            name: "perfilAcesso",
            label: "Perfil de Acesso",
            type: "relationship",
            relationTo: "perfis-acesso",
            admin: {
                description: "Define o grupo de permissões aplicado ao usuário",
            },
        },
    ],
};
