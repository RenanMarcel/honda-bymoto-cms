import type { CollectionConfig } from "payload";

export const Midia: CollectionConfig = {
    slug: "midia",
    labels: {
        singular: "Mídia",
        plural: "Mídias",
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "alt",
            label: "Texto Alternativo",
            type: "text",
            required: true,
            admin: {
                description: "Descrição da imagem para acessibilidade",
            },
        },
    ],
    upload: {
        // Não suportado no Workers ainda devido à falta do sharp
        crop: false,
        focalPoint: false,
    },
};
