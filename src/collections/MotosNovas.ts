import type { CollectionConfig } from "payload";
import { validateNotEmpty, validatePositiveInteger } from "@/lib/validations";

export const MotosNovas: CollectionConfig = {
    slug: "motos-novas",
    labels: {
        singular: "Moto Nova",
        plural: "Motos Novas",
    },
    admin: {
        useAsTitle: "nome",
        defaultColumns: ["nome", "id", "ativo"],
        group: "Catálogo",
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
                description: "Identificador único da moto (ex.: biz-125, cg-160). Usado nas URLs e APIs",
            },
            validate: (value: string) => {
                if (!value || value.trim() === "") {
                    return "ID é obrigatório";
                }
                if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
                    return "ID deve conter apenas letras minúsculas, números e hífens (ex.: biz-125)";
                }
                return true;
            },
        },
        {
            name: "nome",
            label: "Nome",
            type: "text",
            required: true,
            admin: {
                description: "Nome da moto (ex.: Biz 125, CG 160)",
            },
            validate: validateNotEmpty("Nome"),
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
            name: "modelos",
            label: "Modelos",
            type: "array",
            required: true,
            labels: {
                singular: "Modelo",
                plural: "Modelos",
            },
            admin: {
                description: "Cadastre os diferentes modelos/variações desta moto (ex.: ES, EX, Sport, Flex)",
            },
            fields: [
                {
                    name: "nome",
                    label: "Nome do Modelo",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Nome/versão do modelo (ex.: ES, EX, Sport, Flex)",
                        placeholder: "ES",
                    },
                    validate: validateNotEmpty("Nome do modelo"),
                },
                {
                    name: "dadosFinanceiros",
                    label: "Dados Financeiros",
                    type: "group",
                    fields: [
                        {
                            name: "preco",
                            label: "Preço à Vista",
                            type: "number",
                            required: true,
                            admin: {
                                description: "Preço de venda à vista do modelo (em reais)",
                                placeholder: "15590.00",
                            },
                            validate: (value: number) => {
                                if (!value || value <= 0) {
                                    return "Preço deve ser maior que zero";
                                }
                                return true;
                            },
                        },
                        {
                            name: "parcelamento",
                            label: "Opções de Parcelamento (Opcional)",
                            type: "array",
                            labels: {
                                singular: "Opção de Parcelamento",
                                plural: "Opções de Parcelamento",
                            },
                            admin: {
                                description:
                                    "Cadastre as opções de parcelamento do financiamento disponíveis (opcional)",
                            },
                            fields: [
                                {
                                    name: "qtdParcelas",
                                    label: "Quantidade de Parcelas",
                                    type: "number",
                                    required: true,
                                    admin: {
                                        description: "Número de parcelas (meses)",
                                        placeholder: "12",
                                    },
                                    validate: validatePositiveInteger(true),
                                },
                                {
                                    name: "precoParcela",
                                    label: "Valor da Parcela",
                                    type: "number",
                                    required: true,
                                    admin: {
                                        description: "Valor de cada parcela (em reais)",
                                        placeholder: "1481.05",
                                    },
                                    validate: (value: number) => {
                                        if (!value || value <= 0) {
                                            return "Valor da parcela deve ser maior que zero";
                                        }
                                        return true;
                                    },
                                },
                                {
                                    name: "precoTotal",
                                    label: "Preço Total Financiado",
                                    type: "number",
                                    required: true,
                                    admin: {
                                        description:
                                            "Valor total pago ao final do financiamento (quantidade × valor da parcela)",
                                        placeholder: "17772.60",
                                    },
                                    validate: (value: number) => {
                                        if (!value || value <= 0) {
                                            return "Preço total deve ser maior que zero";
                                        }
                                        return true;
                                    },
                                },
                            ],
                        },
                        {
                            name: "precoOferta",
                            label: "Preço de Oferta (Opcional)",
                            type: "number",
                            admin: {
                                description:
                                    "Preço promocional quando aplicável (normalmente menor que o preço à vista)",
                                placeholder: "15500.00",
                            },
                            validate: (value: number | null | undefined) => {
                                if (value && value <= 0) {
                                    return "Preço da oferta deve ser maior que zero";
                                }
                                return true;
                            },
                        },
                        {
                            name: "vantagensOferta",
                            label: "Vantagens da Oferta (Opcional)",
                            type: "array",
                            labels: {
                                singular: "Vantagem",
                                plural: "Vantagens",
                            },
                            admin: {
                                description:
                                    "Liste as vantagens/diferenciais da oferta (ex.: Promoção para pagamento à vista, Estoque limitado)",
                            },
                            fields: [
                                {
                                    name: "vantagem",
                                    label: "Vantagem",
                                    type: "text",
                                    required: true,
                                    admin: {
                                        placeholder: "Ex.: Promoção para pagamento à vista",
                                    },
                                    validate: validateNotEmpty("Vantagem"),
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "exibirConsorcio",
                    label: "Exibir no Consórcio",
                    type: "checkbox",
                    defaultValue: false,
                    admin: {
                        description: "Se marcado, este modelo aparecerá na seção de consórcio do site",
                    },
                },
                {
                    name: "exibirOferta",
                    label: "Exibir como Oferta",
                    type: "checkbox",
                    defaultValue: false,
                    admin: {
                        description: "Se marcado, este modelo aparecerá na seção de ofertas especiais do site",
                    },
                },
            ],
        },
    ],
};
