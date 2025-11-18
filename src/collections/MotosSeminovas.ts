import type { CollectionConfig } from "payload";
import { validateNotEmpty } from "@/lib/validations";

export const MotosSeminovas: CollectionConfig = {
    slug: "motos-seminovas",
    labels: {
        singular: "Moto Seminova",
        plural: "Motos Seminovas",
    },
    admin: {
        useAsTitle: "nome",
        defaultColumns: ["nome", "placa", "preco", "local", "ativo"],
        group: "Catálogo",
        components: {
            beforeList: ["/collections/components/SeminovasImportButton#SeminovasImportButton"],
        },
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "id",
            label: "ID",
            type: "text",
            required: true,
            unique: true,
            admin: {
                description: "Identificador único da moto (ex.: nc-750x-preta-2020). Usado nas URLs e APIs",
            },
            validate: (value: string) => {
                if (!value || value.trim() === "") {
                    return "ID é obrigatório";
                }
                if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
                    return "ID deve conter apenas letras minúsculas, números e hífens (ex.: nc-750x-preta-2020)";
                }
                return true;
            },
        },
        {
            name: "ativo",
            label: "Ativo",
            type: "checkbox",
            defaultValue: true,
            admin: {
                description: "Se desmarcado, a moto não aparecerá no site",
            },
        },
        {
            type: "row",
            fields: [
                {
                    name: "placa",
                    label: "Placa",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Placa da moto (ex.: ABC-1234)",
                        width: "50%",
                    },
                    validate: validateNotEmpty("Placa"),
                },
                {
                    name: "marca",
                    label: "Marca",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Marca da moto (ex.: Honda)",
                        width: "50%",
                    },
                    validate: validateNotEmpty("Marca"),
                },
            ],
        },
        {
            name: "nome",
            label: "Nome/Modelo",
            type: "text",
            required: true,
            admin: {
                description: "Nome completo da moto (ex.: NC 750X)",
            },
            validate: validateNotEmpty("Nome"),
        },
        {
            type: "row",
            fields: [
                {
                    name: "anoFabricacao",
                    label: "Ano de Fabricação",
                    type: "number",
                    required: true,
                    admin: {
                        description: "Ano em que a moto foi fabricada",
                        placeholder: "2020",
                        width: "33.33%",
                    },
                    validate: (value: number) => {
                        if (!value) return "Ano de fabricação é obrigatório";
                        const currentYear = new Date().getFullYear();
                        if (value < 1900 || value > currentYear + 1) {
                            return `Ano deve estar entre 1900 e ${currentYear + 1}`;
                        }
                        return true;
                    },
                },
                {
                    name: "anoModelo",
                    label: "Ano do Modelo",
                    type: "number",
                    required: true,
                    admin: {
                        description: "Ano do modelo da moto",
                        placeholder: "2021",
                        width: "33.33%",
                    },
                    validate: (value: number) => {
                        if (!value) return "Ano do modelo é obrigatório";
                        const currentYear = new Date().getFullYear();
                        if (value < 1900 || value > currentYear + 1) {
                            return `Ano deve estar entre 1900 e ${currentYear + 1}`;
                        }
                        return true;
                    },
                },
                {
                    name: "quilometragem",
                    label: "Quilometragem",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Quilometragem da moto (ex.: 15000 ou 15.000 km)",
                        placeholder: "15.000 km",
                        width: "33.33%",
                    },
                    validate: validateNotEmpty("Quilometragem"),
                },
            ],
        },
        {
            type: "row",
            fields: [
                {
                    name: "combustivel",
                    label: "Combustível",
                    type: "select",
                    required: true,
                    admin: {
                        description: "Tipo de combustível",
                        width: "33.33%",
                    },
                    options: [
                        { label: "Gasolina", value: "Gasolina" },
                        { label: "Álcool", value: "Álcool" },
                        { label: "Flex", value: "Flex" },
                        { label: "Elétrico", value: "Elétrico" },
                    ],
                },
                {
                    name: "cor",
                    label: "Cor",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Cor da moto (ex.: Preta, Vermelha)",
                        width: "33.33%",
                    },
                    validate: validateNotEmpty("Cor"),
                },
                {
                    name: "categoria",
                    label: "Categoria",
                    type: "select",
                    required: true,
                    admin: {
                        description: "Categoria/tipo da moto",
                        width: "33.33%",
                    },
                    options: [
                        { label: "City", value: "City" },
                        { label: "Scooter", value: "Scooter" },
                        { label: "Naked", value: "Naked" },
                        { label: "Trail", value: "Trail" },
                        { label: "Big Trail", value: "Big Trail" },
                        { label: "Crossover", value: "Crossover" },
                        { label: "Off Road", value: "Off Road" },
                        { label: "Sport", value: "Sport" },
                        { label: "Touring", value: "Touring" },
                    ],
                },
            ],
        },
        {
            type: "row",
            fields: [
                {
                    name: "preco",
                    label: "Preço",
                    type: "number",
                    required: true,
                    admin: {
                        description: "Preço de venda da moto (em reais)",
                        placeholder: "25000.00",
                        width: "50%",
                    },
                    validate: (value: number) => {
                        if (!value || value <= 0) {
                            return "Preço deve ser maior que zero";
                        }
                        return true;
                    },
                },
                {
                    name: "local",
                    label: "Local/Filial",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Selecione a filial onde a moto está disponível",
                        width: "50%",
                        components: {
                            Field: "/collections/components/ConcessionariasSelect#ConcessionariasSelectField",
                        },
                    },
                    validate: validateNotEmpty("Local"),
                },
            ],
        },
        {
            name: "caracteristicas",
            label: "Características",
            type: "array",
            labels: {
                singular: "Característica",
                plural: "Características",
            },
            admin: {
                description:
                    "Liste as principais características da moto (ex.: Baixa manutenção, Econômica, Único dono)",
            },
            fields: [
                {
                    name: "caracteristica",
                    label: "Característica",
                    type: "text",
                    required: true,
                    admin: {
                        placeholder: "Ex.: Baixa manutenção",
                    },
                    validate: validateNotEmpty("Característica"),
                },
            ],
        },
        {
            name: "adicionais",
            label: "Adicionais/Diferenciais",
            type: "array",
            labels: {
                singular: "Adicional",
                plural: "Adicionais",
            },
            admin: {
                description:
                    "Liste os adicionais e diferenciais da moto (ex.: 3 meses de garantia, Transferência gratuita)",
            },
            fields: [
                {
                    name: "adicional",
                    label: "Adicional",
                    type: "text",
                    required: true,
                    admin: {
                        placeholder: "Ex.: 3 meses de garantia",
                    },
                    validate: validateNotEmpty("Adicional"),
                },
            ],
        },
        {
            name: "imagem",
            label: "Imagem Principal",
            type: "upload",
            relationTo: "midia",
            admin: {
                description: "Imagem principal da moto exibida nas listagens e cards",
            },
        },
        {
            name: "galeria",
            label: "Galeria de Fotos",
            type: "array",
            labels: {
                singular: "Foto",
                plural: "Fotos",
            },
            admin: {
                description: "Galeria com fotos adicionais da moto (opcional)",
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
                    name: "alt",
                    label: "Texto Alternativo (ALT)",
                    type: "text",
                    admin: {
                        description: "Descrição da imagem para acessibilidade (ex.: NC 750X foto 1)",
                        placeholder: "NC 750X foto 1",
                    },
                },
            ],
        },
    ],
};
