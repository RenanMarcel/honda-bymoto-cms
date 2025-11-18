import path from "path";
import fs from "fs/promises";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { getPayload } from "payload";
import payloadConfig from "@payload-config";
import type { MotosNova } from "../payload-types";

dotenv.config();

// eslint-disable-next-line no-console
console.log("[motos-novas-import] Script carregado");

type LpParcelamentoFinanciamentoItem = {
    readonly qtdParcelas: number;
    readonly precoParcela: number;
    readonly precoTotal: number;
};

type LpModeloValores = {
    readonly id: string;
    readonly nome?: string;
    readonly preco: number;
    readonly parcelamento?: readonly LpParcelamentoFinanciamentoItem[];
    readonly precoOferta?: number;
    readonly vantagensOferta?: readonly string[];
    readonly exibirOferta?: boolean;
};

type LpDadosFinanceirosMotoNova = {
    readonly id: string;
    readonly modelos: readonly LpModeloValores[];
};

type LpVariacao = {
    readonly id: string;
    readonly nome?: string;
};

type LpMotoNovaLocal = {
    readonly id: string;
    readonly nome: string;
    readonly exibirColecao?: readonly string[];
    readonly dadosFinanceiros?: LpDadosFinanceirosMotoNova;
};

type ImportResumo = {
    readonly total: number;
    readonly criadas: number;
    readonly atualizadas: number;
    readonly puladas: number;
};

type ImportContexto = {
    // Usamos any aqui para evitar conflitos complexos de generics do tipo Payload
    readonly payload: any;
};

let payloadClient: any | null = null;
let motosComDadosCnh: Set<string> | null = null;

function resolverLpDataRoot(): string {
    const lpDataRootEnv: string | undefined = process.env.LP_MOTOS_NOVAS_DATA_ROOT;
    if (lpDataRootEnv && lpDataRootEnv.trim() !== "") {
        return lpDataRootEnv;
    }
    const defaultRoot: string = path.resolve(process.cwd(), "..", "honda-bymoto-lp", "src", "data");
    return defaultRoot;
}

async function carregarDadosFinanceiros(): Promise<readonly LpDadosFinanceirosMotoNova[]> {
    const lpDataRoot: string = resolverLpDataRoot();
    const dadosFinanceirosDir: string = path.resolve(lpDataRoot, "motos-novas", "dados-financeiros");
    const arquivos: string[] = await fs.readdir(dadosFinanceirosDir);
    const resultados: LpDadosFinanceirosMotoNova[] = [];
    for (const arquivo of arquivos) {
        if (!arquivo.endsWith(".dados-financeiros.ts")) {
            continue;
        }
        const fullPath: string = path.resolve(dadosFinanceirosDir, arquivo);
        const fileUrl: string = pathToFileURL(fullPath).href;
        const modulo: unknown = await import(fileUrl);
        const exportsModulo: Record<string, LpDadosFinanceirosMotoNova> = modulo as Record<
            string,
            LpDadosFinanceirosMotoNova
        >;
        const exportNames: string[] = Object.keys(exportsModulo);
        for (const exportName of exportNames) {
            const valor: LpDadosFinanceirosMotoNova | undefined = exportsModulo[exportName];
            if (valor && Array.isArray(valor.modelos)) {
                resultados.push(valor);
                break;
            }
        }
    }
    return resultados;
}

async function carregarMotosComDadosCnh(): Promise<Set<string>> {
    const lpDataRoot: string = resolverLpDataRoot();
    const dadosCnhDir: string = path.resolve(lpDataRoot, "motos-novas", "dados-cnh");
    const ids: Set<string> = new Set<string>();
    try {
        const arquivos: string[] = await fs.readdir(dadosCnhDir);
        for (const arquivo of arquivos) {
            if (!arquivo.endsWith(".ts")) {
                continue;
            }
            const baseId: string = arquivo.replace(/\.(dados-)?cnh\.ts$/, "");
            if (baseId.trim() !== "") {
                ids.add(baseId);
            }
        }
    } catch (erro: unknown) {
        // eslint-disable-next-line no-console
        console.warn("[motos-novas-import] Não foi possível ler a pasta de dados-cnh:", erro);
    }
    return ids;
}

function mapearVantagensOferta(vantagensLp?: readonly string[]): { readonly vantagem: string }[] {
    if (!vantagensLp || vantagensLp.length === 0) {
        return [];
    }
    return vantagensLp.map((texto: string) => ({ vantagem: texto }));
}

function normalizarPrecoParaPayload(precoOriginal: number | undefined | null): number {
    if (precoOriginal === null || precoOriginal === undefined) {
        return 0;
    }
    if (Number.isNaN(precoOriginal)) {
        return 0;
    }
    return precoOriginal;
}

async function carregarVariacoesDaMoto(idMoto: string): Promise<readonly LpVariacao[] | null> {
    const variacoesPorMoto: Record<string, readonly LpVariacao[]> = {
        "cb-1000r": [{ id: "standard", nome: "Standard" }],
        "cb-1000r-black-edition": [{ id: "black-edition", nome: "Black Edition" }],
        "cbr-1000rr-r-fireblade": [
            { id: "sp", nome: "SP" },
            { id: "30th-anniversary-edition-2024", nome: "30th Anniversary Edition 2024" },
        ],
        "crf-1100l-africa-twin": [
            { id: "mt", nome: "MT" },
            { id: "dct", nome: "DCT" },
        ],
        "crf-1100l-africa-twin-adventure-sports": [
            { id: "mt", nome: "MT" },
            { id: "dct", nome: "DCT" },
        ],
        "crf-250r": [
            { id: "r", nome: "R" },
            { id: "rx", nome: "RX" },
        ],
        "crf-450r": [
            { id: "r", nome: "R" },
            { id: "rx", nome: "RX" },
        ],
        "gl-1800-gold-wing-tour": [{ id: "standard", nome: "Standard" }],
        "x-adv": [{ id: "x-adv", nome: "X-ADV" }],
    };
    const variacoes: readonly LpVariacao[] | undefined = variacoesPorMoto[idMoto];
    if (!variacoes || variacoes.length === 0) {
        return null;
    }
    return variacoes;
}

function gerarNomeAPartirDoId(id: string): string {
    if (id === "x-adv") {
        return "X-ADV";
    }
    const partes: string[] = id.split("-").filter((parte: string) => parte !== "");
    if (partes.length === 0) {
        return id.toUpperCase();
    }
    const formatadas: string[] = partes.map((parte: string, indice: number) => {
        return formatarParteNomeMoto(parte, indice === 0);
    });
    return formatadas.join(" ");
}

function formatarParteNomeMoto(parte: string, isPrefixo: boolean): string {
    if (parte.length === 0) {
        return parte;
    }
    const somenteLetras: string = parte.replace(/[^a-zA-Z]/g, "");
    const somenteNumeros: string = parte.replace(/[^0-9]/g, "");
    const letrasMinusculas: string = somenteLetras.toLowerCase();
    const isBizOuPop: boolean = letrasMinusculas === "biz" || letrasMinusculas === "pop";
    if (
        isPrefixo &&
        somenteNumeros.length === 0 &&
        (somenteLetras.length === 2 || (somenteLetras.length === 3 && !isBizOuPop))
    ) {
        return parte.toUpperCase();
    }
    if (!isPrefixo && somenteNumeros.length === 0 && letrasMinusculas === "adv") {
        return "ADV";
    }
    const indiceUltimoDigito: number = encontrarUltimoIndiceDigito(parte);
    if (indiceUltimoDigito >= 0 && indiceUltimoDigito < parte.length - 1) {
        const numeros: string = parte.slice(0, indiceUltimoDigito + 1);
        const sufixo: string = parte.slice(indiceUltimoDigito + 1).toUpperCase();
        return `${numeros}${sufixo}`;
    }
    const primeiraLetra: string = parte.charAt(0).toUpperCase();
    const restante: string = parte.slice(1).toLowerCase();
    return `${primeiraLetra}${restante}`;
}

function encontrarUltimoIndiceDigito(valor: string): number {
    for (let indice: number = valor.length - 1; indice >= 0; indice -= 1) {
        const caractere: string = valor.charAt(indice);
        if (caractere >= "0" && caractere <= "9") {
            return indice;
        }
    }
    return -1;
}

function formatarNomeModelo(nomeOriginal: string | undefined, idModelo: string): string {
    const base: string = nomeOriginal && nomeOriginal.trim() !== "" ? nomeOriginal : idModelo;
    const partes: string[] = base.split(/\s+/).filter((parte: string) => parte !== "");
    if (partes.length === 0) {
        return base.toUpperCase();
    }
    const formatadas: string[] = partes.map((parte: string) => {
        return formatarParteNomeModelo(parte);
    });
    return formatadas.join(" ");
}

function formatarParteNomeModelo(parte: string): string {
    if (parte.length === 0) {
        return parte;
    }
    const letrasENumeros: string = parte.replace(/[^a-zA-Z0-9]/g, "");
    const letrasMinusculas: string = letrasENumeros.toLowerCase();
    const isBizOuPop: boolean = letrasMinusculas === "biz" || letrasMinusculas === "pop";
    if (letrasENumeros.length > 0 && letrasENumeros.length <= 3 && !isBizOuPop) {
        return parte.toUpperCase();
    }
    if (parte === parte.toUpperCase()) {
        return parte;
    }
    const primeiraLetra: string = parte.charAt(0).toUpperCase();
    const restante: string = parte.slice(1).toLowerCase();
    return `${primeiraLetra}${restante}`;
}

function criarDadosFinanceirosParaModelo(modelo: LpModeloValores): MotosNova["modelos"][number]["dadosFinanceiros"] {
    const parcelamentoVazio: MotosNova["modelos"][number]["dadosFinanceiros"]["parcelamento"] = [];
    const vantagens: { readonly vantagem: string }[] = mapearVantagensOferta(modelo.vantagensOferta);
    const dados: MotosNova["modelos"][number]["dadosFinanceiros"] = {
        preco: normalizarPrecoParaPayload(modelo.preco),
        parcelamento: parcelamentoVazio,
        precoOferta: modelo.precoOferta,
        vantagensOferta: vantagens.length > 0 ? vantagens : undefined,
    };
    return dados;
}

function deveExibirModeloParaMotoId(motoId: string): boolean {
    return !motoId.includes("-2025");
}

function deveExibirConsorcioParaMotoId(motoId: string): boolean {
    if (motoId.includes("-2025")) {
        return false;
    }
    if (!motosComDadosCnh) {
        return false;
    }
    return motosComDadosCnh.has(motoId);
}

function deveExibirOfertaParaMotoId(motoId: string, exibirOfertaLp: boolean | undefined): boolean {
    if (motoId.includes("-2025")) {
        return true;
    }
    return exibirOfertaLp ?? false;
}

function criarModeloPayload(motoId: string, modelo: LpModeloValores): MotosNova["modelos"][number] {
    const nomeModelo: string = formatarNomeModelo(modelo.nome, modelo.id);
    const dadosFinanceiros = criarDadosFinanceirosParaModelo(modelo);
    const exibirMotosNovas: boolean = deveExibirModeloParaMotoId(motoId);
    const exibirConsorcio: boolean = deveExibirConsorcioParaMotoId(motoId);
    const exibirOferta: boolean = deveExibirOfertaParaMotoId(motoId, modelo.exibirOferta);
    const payloadModelo: MotosNova["modelos"][number] = {
        nome: nomeModelo,
        dadosFinanceiros,
        exibirMotosNovas,
        exibirConsorcio,
        exibirOferta,
    };
    return payloadModelo;
}

async function criarDadosMotoNova(dadosFinanceiros: LpDadosFinanceirosMotoNova): Promise<Partial<MotosNova>> {
    let modelosOrigem: readonly LpModeloValores[] | undefined = dadosFinanceiros.modelos;
    if (!modelosOrigem || modelosOrigem.length === 0) {
        const variacoes: readonly LpVariacao[] | null = await carregarVariacoesDaMoto(dadosFinanceiros.id);
        if (!variacoes || variacoes.length === 0) {
            // eslint-disable-next-line no-console
            console.warn(
                `[motos-novas-import] Moto ${dadosFinanceiros.id} pulada: nenhum modelo definido em dados-financeiros e nenhuma variacao encontrada no arquivo principal.`,
            );
            return {};
        }
        modelosOrigem = variacoes.map((variacao: LpVariacao): LpModeloValores => {
            return {
                id: variacao.id,
                nome: variacao.nome,
                preco: 0,
                parcelamento: [],
                precoOferta: undefined,
                vantagensOferta: [],
                exibirOferta: false,
            };
        });
    }
    const modelosPayload: MotosNova["modelos"] = modelosOrigem.map((modelo: LpModeloValores) => {
        return criarModeloPayload(dadosFinanceiros.id, modelo);
    });
    const dados: Partial<MotosNova> = {
        id: dadosFinanceiros.id,
        nome: gerarNomeAPartirDoId(dadosFinanceiros.id),
        ativo: true,
        modelos: modelosPayload,
    };
    return dados;
}

async function upsertMotoNova(
    contexto: ImportContexto,
    dadosFinanceiros: LpDadosFinanceirosMotoNova,
): Promise<"created" | "updated" | "skipped"> {
    const dados: Partial<MotosNova> = await criarDadosMotoNova(dadosFinanceiros);
    if (!dados.id || !dados.nome || !dados.modelos || dados.modelos.length === 0) {
        return "skipped";
    }
    const existentes = await contexto.payload.find({
        collection: "motos-novas",
        where: {
            id: {
                equals: dados.id,
            },
        },
        limit: 1,
    });
    if (existentes.docs.length > 0) {
        const existente: MotosNova = existentes.docs[0] as MotosNova;
        await contexto.payload.update({
            collection: "motos-novas",
            id: existente.id,
            data: dados,
        });
        return "updated";
    }
    await contexto.payload.create({
        collection: "motos-novas",
        data: dados,
    });
    return "created";
}

async function executarImportacao(): Promise<void> {
    if (!payloadClient) {
        throw new Error("Payload ainda não foi inicializado.");
    }
    const contexto: ImportContexto = { payload: payloadClient };
    motosComDadosCnh = await carregarMotosComDadosCnh();
    const dadosFinanceirosLista: readonly LpDadosFinanceirosMotoNova[] = await carregarDadosFinanceiros();
    const total: number = dadosFinanceirosLista.length;
    let criadas: number = 0;
    let atualizadas: number = 0;
    let puladas: number = 0;
    // eslint-disable-next-line no-console
    console.log(`[motos-novas-import] Iniciando importação de ${total} motos novas...`);
    for (const dadosFinanceiros of dadosFinanceirosLista) {
        const resultado = await upsertMotoNova(contexto, dadosFinanceiros);
        if (resultado === "created") {
            criadas += 1;
        } else if (resultado === "updated") {
            atualizadas += 1;
        } else {
            puladas += 1;
        }
    }
    const resumo: ImportResumo = { total, criadas, atualizadas, puladas };
    // eslint-disable-next-line no-console
    console.log(
        `[motos-novas-import] Concluído. Total: ${resumo.total}, criadas: ${resumo.criadas}, atualizadas: ${resumo.atualizadas}, puladas: ${resumo.puladas}.`,
    );
}

// eslint-disable-next-line no-console
console.log("[motos-novas-import] Iniciando getPayload...");

try {
    const payloadInstance: any = await getPayload({ config: payloadConfig });
    payloadClient = payloadInstance;
    // eslint-disable-next-line no-console
    console.log("[motos-novas-import] getPayload concluído, iniciando executarImportacao()...");
    await executarImportacao();
} catch (erro: unknown) {
    // eslint-disable-next-line no-console
    console.error("[motos-novas-import] Erro durante importação:", erro);
    process.exitCode = 1;
}
