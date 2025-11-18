import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { DadosInstitucionai, Midia, MotosSeminova } from "@/payload-types";
import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

type SeminovaScrapedImage = {
    readonly url: string;
    readonly alt: string | null;
};

type SeminovaScraped = {
    readonly name: string;
    readonly priceText: string;
    readonly yearText: string;
    readonly mileageText: string;
    readonly locationText: string | null;
    readonly anoFabricacao: number | null;
    readonly anoModelo: number | null;
    readonly quilometragemNumero: number | null;
    readonly quilometragemTexto: string | null;
    readonly cor: string | null;
    readonly images: readonly SeminovaScrapedImage[];
};

type ImportResponseBody = {
    readonly message?: string;
    readonly error?: string;
};

type YearsInfo = {
    readonly anoFabricacao: number | null;
    readonly anoModelo: number | null;
};

type MileageInfo = {
    readonly quilometragemNumero: number | null;
    readonly quilometragemTexto: string | null;
};

type ImportResult = "created" | "updated" | "skipped" | "skipped-fetch" | "skipped-preco-ou-ano";

type ImagensProcessadas = {
    readonly imagemPrincipalId: number | null;
    readonly galeria: MotosSeminova["galeria"];
};

const MAX_SEMINOVA_GALLERY_IMAGES: number = 6;

function stripHtml(value: string): string {
    return value
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function matchSingle(html: string, regex: RegExp): string | null {
    const match: RegExpMatchArray | null = html.match(regex);
    if (!match || !match[1]) {
        return null;
    }
    return stripHtml(match[1]);
}

function extractYearsFromText(text: string): YearsInfo {
    const fourDigitsMatch: RegExpMatchArray | null = text.match(/(\d{4})\s*\/\s*(\d{4})/);
    if (fourDigitsMatch) {
        const anoFabricacaoQuatro: number = Number.parseInt(fourDigitsMatch[1], 10);
        const anoModeloQuatro: number = Number.parseInt(fourDigitsMatch[2], 10);
        if (Number.isNaN(anoFabricacaoQuatro) || Number.isNaN(anoModeloQuatro)) {
            return { anoFabricacao: null, anoModelo: null };
        }
        return { anoFabricacao: anoFabricacaoQuatro, anoModelo: anoModeloQuatro };
    }
    const twoDigitsMatch: RegExpMatchArray | null = text.match(/(\d{2})\s*\/\s*(\d{2})/);
    if (!twoDigitsMatch) {
        return { anoFabricacao: null, anoModelo: null };
    }
    const normalizeTwoDigitYear = (yearTwoDigits: number): number => {
        if (yearTwoDigits >= 90) {
            return 1900 + yearTwoDigits;
        }
        return 2000 + yearTwoDigits;
    };
    const anoFabricacaoDois: number = Number.parseInt(twoDigitsMatch[1], 10);
    const anoModeloDois: number = Number.parseInt(twoDigitsMatch[2], 10);
    if (Number.isNaN(anoFabricacaoDois) || Number.isNaN(anoModeloDois)) {
        return { anoFabricacao: null, anoModelo: null };
    }
    return {
        anoFabricacao: normalizeTwoDigitYear(anoFabricacaoDois),
        anoModelo: normalizeTwoDigitYear(anoModeloDois),
    };
}

function extractMileageFromText(text: string): MileageInfo {
    const labelledMatch: RegExpMatchArray | null = text.match(/Km\s*[:\-]?\s*(\d{1,3}(?:\.\d{3})+|\d+)/i);
    const genericMatch: RegExpMatchArray | null = labelledMatch ?? text.match(/(\d{1,3}(?:\.\d{3})+|\d+)\s*(?:km)?\b/i);
    if (!genericMatch) {
        return { quilometragemNumero: null, quilometragemTexto: null };
    }
    const raw: string = genericMatch[1];
    const normalized: string = raw.replace(/\./g, "").replace(/,/g, ".");
    const quilometragemNumero: number = Number.parseFloat(normalized);
    if (Number.isNaN(quilometragemNumero)) {
        return { quilometragemNumero: null, quilometragemTexto: raw };
    }
    return { quilometragemNumero, quilometragemTexto: raw };
}

function extractColorFromText(text: string): string | null {
    const labelMatch: RegExpMatchArray | null = text.match(/Cor\s*[:\-]?\s*([A-Za-zÀ-ÿ ]{3,30})/i);
    if (labelMatch) {
        const rawColor: string = labelMatch[1].trim();
        if (rawColor !== "") {
            return rawColor.toLowerCase();
        }
    }
    const colors: readonly string[] = [
        "preta",
        "preto",
        "branca",
        "branco",
        "vermelha",
        "vermelho",
        "prata",
        "cinza",
        "azul",
        "verde",
        "amarela",
        "amarelo",
        "laranja",
        "marrom",
        "grafite",
        "rosa",
    ];
    const lowerText: string = text.toLowerCase();
    for (const color of colors) {
        if (lowerText.includes(color)) {
            return color;
        }
    }
    return null;
}

function extractImagesFromHtml(html: string, baseUrl: string): SeminovaScrapedImage[] {
    const images: SeminovaScrapedImage[] = [];
    const imgRegex: RegExp = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match: RegExpMatchArray | null;
    while ((match = imgRegex.exec(html)) !== null) {
        const src: string = match[1] ?? "";
        if (src === "") {
            continue;
        }
        const lowerSrc: string = src.toLowerCase();
        if (
            lowerSrc.includes("logo") ||
            lowerSrc.includes("icon") ||
            lowerSrc.includes("instagram") ||
            lowerSrc.includes("facebook") ||
            lowerSrc.includes("youtube") ||
            lowerSrc.includes("/themes/theme-by-moto-honda/") ||
            lowerSrc.endsWith(".svg") ||
            lowerSrc.includes(".svg?")
        ) {
            continue;
        }
        let absoluteUrl: string;
        try {
            const url: URL = new URL(src, baseUrl);
            absoluteUrl = url.toString();
        } catch {
            absoluteUrl = src;
        }
        const altMatch: RegExpMatchArray | null = match[0].match(/alt=["']([^"']*)["']/i);
        const alt: string | null = altMatch && altMatch[1] ? altMatch[1] : null;
        images.push({ url: absoluteUrl, alt });
    }
    return images;
}

function extrairNomeArquivoDaUrl(urlString: string): string {
    try {
        const url: URL = new URL(urlString);
        const pathName: string = url.pathname;
        const segmentos: string[] = pathName.split("/").filter((segmento: string) => segmento !== "");
        const ultimoSegmento: string | undefined = segmentos[segmentos.length - 1];
        if (ultimoSegmento && ultimoSegmento.trim() !== "") {
            return ultimoSegmento;
        }
    } catch {
        return "imagem-seminova.jpg";
    }
    return "imagem-seminova.jpg";
}

function obterAltParaImagem(nome: string, imagem: SeminovaScrapedImage, indice: number): string {
    if (imagem.alt && imagem.alt.trim() !== "") {
        return imagem.alt;
    }
    if (indice === 0) {
        return nome;
    }
    return `${nome} galeria ${indice}`;
}

async function fazerUploadImagem(
    payload: any,
    imagem: SeminovaScrapedImage,
    nome: string,
    indice: number,
): Promise<number | null> {
    let tempFilePath: string | null = null;
    try {
        const response: Response = await fetch(imagem.url);
        if (!response.ok) {
            return null;
        }
        const contentType: string = response.headers.get("content-type") ?? "";
        const imagensBitmapPermitidas: readonly string[] = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
        ];
        if (!imagensBitmapPermitidas.some((tipo: string) => contentType.includes(tipo))) {
            return null;
        }
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const buffer: Buffer = Buffer.from(arrayBuffer);
        const filename: string = extrairNomeArquivoDaUrl(imagem.url);
        tempFilePath = join(tmpdir(), `seminova-${Date.now()}-${filename}`);
        await writeFile(tempFilePath, buffer);
        const alt: string = obterAltParaImagem(nome, imagem, indice);
        const midia: Midia = (await payload.create({
            collection: "midia",
            data: {
                alt,
            },
            filePath: tempFilePath,
        })) as Midia;
        return midia.id as number;
    } catch {
        return null;
    } finally {
        if (tempFilePath) {
            try {
                await unlink(tempFilePath);
            } catch {
                // Ignore cleanup errors
            }
        }
    }
}

async function processarImagens(payload: any, seminova: SeminovaScraped): Promise<ImagensProcessadas> {
    const imagens: readonly SeminovaScrapedImage[] = seminova.images;
    if (!imagens || imagens.length === 0) {
        return { imagemPrincipalId: null, galeria: [] };
    }
    const imagensLimitadas: readonly SeminovaScrapedImage[] = imagens.slice(0, MAX_SEMINOVA_GALLERY_IMAGES);
    const [imagemPrincipal, ...imagensGaleria] = imagensLimitadas;
    const imagemPrincipalId: number | null = await fazerUploadImagem(payload, imagemPrincipal, seminova.name, 0);
    const galeria: MotosSeminova["galeria"] = [];
    let indiceGaleria: number = 0;
    for (const imagem of imagensGaleria) {
        const idImagem: number | null = await fazerUploadImagem(payload, imagem, seminova.name, indiceGaleria + 1);
        if (idImagem !== null) {
            const altGaleria: string = obterAltParaImagem(seminova.name, imagem, indiceGaleria + 1);
            galeria.push({ imagem: idImagem, alt: altGaleria });
            indiceGaleria += 1;
        }
    }
    return { imagemPrincipalId, galeria };
}

function parsePreco(valor: string): number | null {
    const cleaned: string = valor.replace(/[^0-9,.]/g, "");
    if (cleaned === "") {
        return null;
    }
    const normalized: string = cleaned.replace(/\./g, "").replace(/,/g, ".");
    const parsed: number = Number.parseFloat(normalized);
    if (Number.isNaN(parsed)) {
        return null;
    }
    return parsed;
}

function inferirMarca(nome: string): string {
    const lower: string = nome.toLowerCase();
    if (lower.includes("honda")) {
        return "Honda";
    }
    if (lower.includes("yamaha")) {
        return "Yamaha";
    }
    if (lower.includes("bmw")) {
        return "BMW";
    }
    if (lower.includes("kawasaki")) {
        return "Kawasaki";
    }
    if (lower.includes("suzuki")) {
        return "Suzuki";
    }
    if (lower.includes("royal enfield")) {
        return "Royal Enfield";
    }
    return "Honda";
}

function formatarQuilometragem(seminova: SeminovaScraped): string {
    if (seminova.quilometragemTexto && seminova.quilometragemTexto !== "") {
        return seminova.quilometragemTexto;
    }
    if (seminova.quilometragemNumero !== null) {
        return seminova.quilometragemNumero.toLocaleString("pt-BR");
    }
    return "0";
}

function capitalizarPrimeiraLetra(texto: string): string {
    if (texto.length === 0) {
        return texto;
    }
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function construirSlugParaSeminova(seminova: SeminovaScraped): string {
    const partes: string[] = [];
    partes.push(seminova.name);
    if (seminova.cor && seminova.cor.trim() !== "") {
        partes.push(seminova.cor);
    }
    if (seminova.anoModelo !== null) {
        partes.push(String(seminova.anoModelo));
    }
    const base: string = partes.join(" ");
    const normalized: string = base
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const slug: string = normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug;
}

async function obterDefaultLocal(payload: any): Promise<string> {
    const dados: DadosInstitucionai = (await payload.findGlobal({
        slug: "dados-institucionais",
    })) as DadosInstitucionai;
    const concessionariaNome: string | undefined = dados.concessionarias?.[0]?.nome;
    if (concessionariaNome && concessionariaNome.trim() !== "") {
        return concessionariaNome;
    }
    return "Sem Local";
}

function construirDadosSeminova(
    seminova: SeminovaScraped,
    defaultLocal: string,
    imagemPrincipalId: number | null,
    galeria: MotosSeminova["galeria"],
): Partial<MotosSeminova> {
    const precoNumero: number | null = parsePreco(seminova.priceText);
    if (precoNumero === null || precoNumero <= 0) {
        return {};
    }
    if (seminova.anoFabricacao === null || seminova.anoModelo === null) {
        return {};
    }
    const placa: string = "SEM-0001";
    const marca: string = inferirMarca(seminova.name);
    const quilometragem: string = formatarQuilometragem(seminova);
    const corBruta: string | null = seminova.cor;
    const corFormatada: string =
        corBruta && corBruta.trim() !== "" ? capitalizarPrimeiraLetra(corBruta.trim()) : "Preto";
    const caracteristicasDefault: MotosSeminova["caracteristicas"] = [
        {
            caracteristica: "Baixa manutenção",
        },
        {
            caracteristica: "Econômica",
        },
    ];
    const adicionaisDefault: MotosSeminova["adicionais"] = [
        {
            adicional: "Sua moto usada na troca",
        },
        {
            adicional: "Revisada",
        },
    ];
    const dados: Partial<MotosSeminova> = {
        ativo: true,
        placa,
        marca,
        nome: seminova.name,
        anoFabricacao: seminova.anoFabricacao,
        anoModelo: seminova.anoModelo,
        quilometragem,
        combustivel: "Flex",
        cor: corFormatada,
        categoria: "City",
        preco: precoNumero,
        local: defaultLocal,
        imagem: imagemPrincipalId ?? undefined,
        galeria,
        caracteristicas: caracteristicasDefault,
        adicionais: adicionaisDefault,
    };
    return dados;
}

async function importarSeminova(detailUrl: string): Promise<ImportResult> {
    const payload: any = await getPayload({ config });
    const response: Response = await fetch(detailUrl);
    if (!response.ok) {
        return "skipped-fetch";
    }
    const html: string = await response.text();
    const detail: SeminovaScraped = extractDetailFromHtml(html, detailUrl);
    const yearsInfo: YearsInfo = extractYearsFromText(detail.yearText !== "" ? detail.yearText : html);
    const mileageInfo: MileageInfo = extractMileageFromText(detail.mileageText !== "" ? detail.mileageText : html);
    const corInferida: string | null = detail.cor ?? extractColorFromText(html || detail.name);
    const images: SeminovaScrapedImage[] = extractImagesFromHtml(html, detailUrl);
    const seminovaComDerivados: SeminovaScraped = {
        ...detail,
        anoFabricacao: yearsInfo.anoFabricacao,
        anoModelo: yearsInfo.anoModelo,
        quilometragemNumero: mileageInfo.quilometragemNumero,
        quilometragemTexto: mileageInfo.quilometragemTexto,
        cor: corInferida,
        images,
    };
    const imagensProcessadas: ImagensProcessadas = await processarImagens(payload, seminovaComDerivados);
    const slug: string = construirSlugParaSeminova(seminovaComDerivados);
    const defaultLocal: string = await obterDefaultLocal(payload);
    const dadosSeminova: Partial<MotosSeminova> = construirDadosSeminova(
        seminovaComDerivados,
        defaultLocal,
        imagensProcessadas.imagemPrincipalId,
        imagensProcessadas.galeria,
    );
    if (!dadosSeminova.preco || !dadosSeminova.anoFabricacao || !dadosSeminova.anoModelo) {
        return "skipped-preco-ou-ano";
    }
    const existentes = await payload.find({
        collection: "motos-seminovas",
        where: {
            id: {
                equals: slug,
            },
        },
        limit: 1,
    });
    const dadosComId: Partial<MotosSeminova> = {
        ...dadosSeminova,
        id: slug,
    };
    if (Array.isArray(existentes.docs) && existentes.docs.length > 0) {
        const existente: MotosSeminova = existentes.docs[0] as MotosSeminova;
        await payload.update({
            collection: "motos-seminovas",
            id: existente.id,
            data: dadosComId,
        });
        return "updated";
    }
    await payload.create({
        collection: "motos-seminovas",
        data: dadosComId,
    });
    return "created";
}

function extractDetailFromHtml(html: string, detailUrl: string): SeminovaScraped {
    const nameFallback: string = detailUrl;
    const name: string = matchSingle(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ?? nameFallback;
    const priceText: string =
        matchSingle(html, /class=["'][^"']*used-cars-internal-info-price[^"']*["'][^>]*>([\s\S]*?)<\//i) ?? "";
    let yearText: string = "";
    let mileageText: string = "";
    let colorRaw: string = "";
    const featureRegex: RegExp =
        /<div[^>]*class=["'][^"']*used-cars-internal-feature-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
    let featureMatch: RegExpMatchArray | null;
    while ((featureMatch = featureRegex.exec(html)) !== null) {
        const block: string = featureMatch[1] ?? "";
        const label: string =
            matchSingle(block, /used-cars-internal-feature-text[^>]*>([\s\S]*?)<\//i)?.toLowerCase() ?? "";
        const value: string = matchSingle(block, /used-cars-internal-feature-value[^>]*>([\s\S]*?)<\//i) ?? "";
        if (label.includes("ano")) {
            yearText = value;
        } else if (label.includes("km")) {
            mileageText = value;
        } else if (label.includes("cor")) {
            colorRaw = value;
        }
    }
    const locationText: string | null =
        matchSingle(html, /class=["'][^"']*(loja|local|filial)[^"']*["'][^>]*>([\s\S]*?)<\//i) ?? null;
    const anos: YearsInfo = extractYearsFromText(yearText !== "" ? yearText : html);
    const kmInfo: MileageInfo = extractMileageFromText(mileageText !== "" ? mileageText : html);
    const cor: string | null = colorRaw !== "" ? colorRaw.toLowerCase() : extractColorFromText(html || name);
    const images: SeminovaScrapedImage[] = extractImagesFromHtml(html, detailUrl);
    return {
        name,
        priceText,
        yearText,
        mileageText,
        locationText,
        anoFabricacao: anos.anoFabricacao,
        anoModelo: anos.anoModelo,
        quilometragemNumero: kmInfo.quilometragemNumero,
        quilometragemTexto: kmInfo.quilometragemTexto,
        cor,
        images,
    };
}

export async function POST(request: NextRequest): Promise<NextResponse<ImportResponseBody>> {
    let detailUrl: string;
    try {
        const body = (await request.json()) as { detailUrl?: string };
        detailUrl = body.detailUrl?.trim() ?? "";
    } catch {
        return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
    }
    if (!detailUrl || !detailUrl.startsWith("http")) {
        return NextResponse.json({ error: "Informe uma URL válida de seminovo." }, { status: 400 });
    }
    if (!detailUrl.includes("/seminovo/")) {
        return NextResponse.json({ error: "A URL deve ser de uma página de seminovo da ByMoto." }, { status: 400 });
    }
    try {
        const resultado: ImportResult = await importarSeminova(detailUrl);
        if (resultado === "created") {
            return NextResponse.json({ message: "Moto seminova criada com sucesso." }, { status: 200 });
        }
        if (resultado === "updated") {
            return NextResponse.json({ message: "Moto seminova atualizada com sucesso." }, { status: 200 });
        }
        if (resultado === "skipped-fetch") {
            return NextResponse.json(
                {
                    error: "Não foi possível acessar a página do seminovo na ByMoto (falha ao buscar a URL). Verifique a URL ou tente novamente mais tarde.",
                },
                { status: 422 },
            );
        }
        if (resultado === "skipped-preco-ou-ano") {
            return NextResponse.json(
                {
                    error: "A moto não pôde ser importada porque preço ou anos (fabricação/modelo) não foram encontrados na página.",
                },
                { status: 422 },
            );
        }
        return NextResponse.json(
            { error: "A moto não pôde ser importada por um motivo desconhecido." },
            { status: 422 },
        );
    } catch (erro: unknown) {
        // eslint-disable-next-line no-console
        console.error(erro);
        return NextResponse.json(
            { error: "Erro interno ao importar a moto seminova. Consulte os logs do servidor." },
            { status: 500 },
        );
    }
}
