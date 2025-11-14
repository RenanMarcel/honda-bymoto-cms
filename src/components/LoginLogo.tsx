import React from "react";

/**
 * Logo customizada para a página de login do Payload CMS
 * Usa a logo da concessionária no lugar da logo padrão do Payload
 */
export const LoginLogo: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full">
            <img
                src="/logos/concessionaria-logo.svg"
                alt="Honda By Moto"
                className="h-16 w-auto"
                style={{ maxWidth: "240px" }}
            />
        </div>
    );
};
