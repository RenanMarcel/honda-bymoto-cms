import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import React from "react";
import { fileURLToPath } from "url";

import config from "@/payload.config";
import { Logo } from "@/components/Logo";
import "./styles.css";

export default async function HomePage() {
    const headers = await getHeaders();
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig });
    const { user } = await payload.auth({ headers });

    const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`;

    return (
        <div className="home">
            <div className="content">
                <Logo />
                {!user && (
                    <>
                        <h1>Bem-vindo ao Honda By Moto CMS</h1>
                        <p>Sistema de gerenciamento de conteúdo</p>
                    </>
                )}
                {user && <h1>Olá, {user.email}</h1>}
                <div className="links">
                    <a
                        className="admin"
                        href={payloadConfig.routes.admin}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Painel Administrativo
                    </a>
                </div>
            </div>
        </div>
    );
}
