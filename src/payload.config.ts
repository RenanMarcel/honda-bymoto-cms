// storage-adapter-import-placeholder
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite"; // database-adapter-import
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import {
    CloudflareContext,
    getCloudflareContext,
} from "@opennextjs/cloudflare";
import { GetPlatformProxyOptions } from "wrangler";
import { r2Storage } from "@payloadcms/storage-r2";
import { en } from "@payloadcms/translations/languages/en";

import { ptBR } from "./i18n/pt-BR";
import { Usuarios } from "./collections/Usuarios";
import { Midia } from "./collections/Midia";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const cloudflareRemoteBindings = process.env.NODE_ENV === "production";
const cloudflare =
    process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
    !cloudflareRemoteBindings
        ? await getCloudflareContextFromWrangler()
        : await getCloudflareContext({ async: true });

export default buildConfig({
    admin: {
        user: Usuarios.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        components: {
            graphics: {
                Logo: "/components/Logo#Logo",
                Icon: "/components/Icon#Icon",
            },
        },
        meta: {
            titleSuffix: "- Honda Bymoto CMS",
        },
    },
    collections: [Usuarios, Midia],
    i18n: {
        supportedLanguages: {
            pt: ptBR as any, // Português (Brasil) - Padrão (Tradução customizada)
            en, // English - Opcional
        },
        fallbackLanguage: "pt",
    },
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    // database-adapter-config-start
    db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
    // database-adapter-config-end
    plugins: [
        // storage-adapter-placeholder
        r2Storage({
            bucket: cloudflare.env.R2,
            collections: { midia: true } as any,
        }),
    ],
});

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
    return import(
        /* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`
    ).then(({ getPlatformProxy }) =>
        getPlatformProxy({
            environment: process.env.CLOUDFLARE_ENV,
        } satisfies GetPlatformProxyOptions),
    );
}
