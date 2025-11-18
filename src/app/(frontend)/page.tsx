import Image from "next/image";
import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import config from "@/payload.config";

export default async function HomePage() {
    const headers = await getHeaders();
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig });
    const { user } = await payload.auth({ headers });

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted px-4">
            <div className="w-full max-w-xl rounded-3xl border bg-card/80 p-8 text-center shadow-lg backdrop-blur-sm sm:p-10">
                <div className="flex flex-col items-center gap-6">
                    <Image
                        src="/logos/concessionaria-logo.svg"
                        alt="Honda By Moto"
                        width={220}
                        height={66}
                        priority
                        className="h-auto w-auto max-w-[220px]"
                    />
                    {!user && (
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold sm:text-4xl">Bem-vindo ao Honda By Moto CMS</h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                Acesse o painel administrativo para gerenciar o conteúdo da concessionária.
                            </p>
                        </div>
                    )}
                    {user && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Sessão autenticada
                            </p>
                            <h1 className="text-2xl font-semibold sm:text-3xl">
                                Olá, <span className="font-bold">{user.email}</span>
                            </h1>
                        </div>
                    )}
                    <div className="mt-2 flex justify-center">
                        <a
                            className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                            href={payloadConfig.routes.admin}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Painel Administrativo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
