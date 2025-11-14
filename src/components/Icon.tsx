import React from "react";
import { House } from "lucide-react";

/**
 * Ícone customizado para o admin do Payload CMS
 * Exibido na aba do navegador e em outros locais
 */
export const Icon: React.FC = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <House className="h-6 w-6 text-[#ED1C2F]" />
        </div>
    );
};
