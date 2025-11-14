import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Logo } from "@/components/Logo";

export default async function HomePage() {
    const headers = await getHeaders();
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig });
    const { user } = await payload.auth({ headers });

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between overflow-hidden px-6 py-8 sm:px-11 sm:py-11">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Logo />
                {!user && (
                    <>
                        <h1 className="mt-10 text-3xl font-bold sm:text-4xl lg:text-5xl">
                            Bem-vindo ao Honda By Moto CMS
                        </h1>
                        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                            Sistema de gerenciamento de conteúdo
                        </p>
                    </>
                )}
                {user && <h1 className="mt-10 text-3xl font-bold sm:text-4xl lg:text-4xl">Olá, {user.email}</h1>}
                <div className="mt-8 flex items-center gap-3">
                    <a
                        className="inline-flex items-center rounded border border-foreground bg-foreground px-3 py-1 text-sm font-medium text-background no-underline transition hover:opacity-90"
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
