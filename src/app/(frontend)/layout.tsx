import React from "react";
import "@/styles/global.css";

export const metadata = {
    title: "Honda By Moto CMS",
    description: "Sistema de gerenciamento de conteúdo da concessionária Honda By Moto.",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props;

    return (
        <html lang="pt-BR">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
