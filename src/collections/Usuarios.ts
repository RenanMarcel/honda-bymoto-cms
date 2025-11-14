import type { CollectionConfig } from "payload";

export const Usuarios: CollectionConfig = {
    slug: "usuarios",
    labels: {
        singular: "Usuário",
        plural: "Usuários",
    },
    admin: {
        useAsTitle: "email",
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
            name: "alertBox",
            type: "ui",
            admin: {
                components: {
                    Field: "/components/AlertBox#AlertBox",
                },
            },
        },
    ],
};
