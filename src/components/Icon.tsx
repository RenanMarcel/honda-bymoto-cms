import React from "react";
import Image from "next/image";

/**
 * Ícone customizado para o admin do Payload CMS
 * Exibido na aba do navegador e em outros locais
 */
export const Icon = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Image
                src="/logos/concessionaria-logo.svg"
                alt="Honda By Moto"
                width={160}
                height={48}
                priority
                className="h-auto w-full max-w-[160px]"
            />
        </div>
    );
};
