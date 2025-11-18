"use client";

import React, { useState } from "react";

type ImportStatus = "idle" | "loading" | "success" | "error";

export const SeminovasImportButton: React.FC = () => {
    const [detailUrl, setDetailUrl] = useState<string>("");
    const [status, setStatus] = useState<ImportStatus>("idle");
    const [message, setMessage] = useState<string>("");

    const handleImport = async (): Promise<void> => {
        const trimmed: string = detailUrl.trim();
        if (trimmed === "") {
            setStatus("error");
            setMessage("Informe a URL da página de detalhe do seminovo.");
            return;
        }
        setStatus("loading");
        setMessage("");
        try {
            const response: Response = await fetch("/api/import-seminova", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ detailUrl: trimmed }),
            });
            const data = (await response.json()) as { message?: string; error?: string };
            if (!response.ok) {
                setStatus("error");
                setMessage(data.error ?? "Falha ao importar a moto.");
                return;
            }
            setStatus("success");
            setMessage(data.message ?? "Moto importada com sucesso.");
        } catch (error: unknown) {
            setStatus("error");
            setMessage("Erro inesperado ao chamar a API de importação.");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDetailUrl(event.target.value);
        if (status !== "idle") {
            setStatus("idle");
            setMessage("");
        }
    };

    const borderColorClass: string =
        status === "error" ? "border-red-400" : status === "success" ? "border-green-400" : "border-slate-300";

    return (
        <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 font-semibold">Importar moto seminova da ByMoto</div>
            <p className="mb-3 text-sm text-slate-600">
                Cole a URL da página de detalhe do seminovo da ByMoto (ex.: https://bymoto.com.br/seminovo/...).
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="text"
                    value={detailUrl}
                    onChange={handleChange}
                    placeholder="https://bymoto.com.br/seminovo/..."
                    className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring ${borderColorClass}`}
                />
                <button
                    type="button"
                    onClick={handleImport}
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                >
                    {status === "loading" ? "Importando..." : "Importar"}
                </button>
            </div>
            {message !== "" && (
                <p
                    className={`mt-2 text-sm ${
                        status === "error" ? "text-red-600" : status === "success" ? "text-green-700" : "text-slate-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};
