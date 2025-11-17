"use client";

import React, { useEffect, useState } from "react";
import { useField, SelectInput } from "@payloadcms/ui";

type Concessionaria = {
    nome: string;
    id: string;
};

/**
 * Campo select customizado que busca as concessionárias cadastradas
 * no global DadosInstitucionais e permite selecionar uma filial
 */
export const ConcessionariasSelectField: React.FC = () => {
    const { value, setValue } = useField<string>({ path: "local" });
    const [concessionarias, setConcessionarias] = useState<Concessionaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConcessionarias = async () => {
            try {
                const response = await fetch("/api/globals/dados-institucionais");
                const data = (await response.json()) as {
                    concessionarias?: Array<{ nome: string; id: string }>;
                };

                if (data?.concessionarias && Array.isArray(data.concessionarias)) {
                    setConcessionarias(
                        data.concessionarias.map((c) => ({
                            nome: c.nome,
                            id: c.id,
                        })),
                    );
                }
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar concessionárias:", err);
                setError("Erro ao carregar lista de concessionárias");
                setLoading(false);
            }
        };

        fetchConcessionarias();
    }, []);

    if (loading) {
        return <div>Carregando concessionárias...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    if (concessionarias.length === 0) {
        return (
            <div style={{ padding: "1rem", background: "#fff3cd", borderRadius: "4px" }}>
                ⚠️ Nenhuma concessionária cadastrada. Por favor, cadastre as concessionárias em{" "}
                <strong>Dados Institucionais</strong> primeiro.
            </div>
        );
    }

    const options = concessionarias.map((c) => ({
        label: c.nome,
        value: c.nome,
    }));

    return (
        <SelectInput
            path="local"
            name="local"
            label="Local/Filial"
            required={true}
            options={options}
            value={value}
            onChange={(option) => {
                if (option && typeof option === "object" && "value" in option) {
                    setValue(option.value as string);
                }
            }}
        />
    );
};
