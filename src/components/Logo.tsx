import React from "react";
import Image from "next/image";

/**
 * Logo customizado para o admin do Payload CMS
 * Exibido na tela de login e no topo do painel admin
 */
export const Logo = () => {
    return (
        <div className="flex items-center justify-center py-5">
            <Image
                src="/logos/concessionaria-logo.svg"
                alt="Honda Bymoto"
                width={200}
                height={60}
                priority
                className="h-auto w-auto max-w-[200px]"
            />
        </div>
    );
};
