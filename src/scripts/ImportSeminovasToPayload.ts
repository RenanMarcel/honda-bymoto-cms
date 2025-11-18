import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import { getPayload } from "payload";
import payloadConfig from "@payload-config";
import type { Midia, MotosSeminova, DadosInstitucionai } from "../payload-types";

dotenv.config();

let payloadClient: any;

// eslint-disable-next-line no-console
console.log("[seminovas-import] Script carregado");

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

type ImportContext = {
    readonly defaultCombustivel: MotosSeminova["combustivel"];
    readonly defaultCategoria: MotosSeminova["categoria"];
    readonly defaultLocal: string;
};

type ImportResult = "created" | "updated" | "skipped";

function slugify(value: string): string {
    const normalized: string = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const slug: string = normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug;
}

function parsePreco(valor: string): number | null {
    const cleaned: string = valor.replace(/[^0-9,\.]/g, "");
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

function decodeTextoPossivelmenteUtf16(buffer: Buffer): string {
    let texto: string;
    if (buffer.length >= 2) {
        const firstByte: number = buffer[0];
        const secondByte: number = buffer[1];
        const isUtf16Bom: boolean =
            (firstByte === 0xff && secondByte === 0xfe) || (firstByte === 0xfe && secondByte === 0xff);
        if (isUtf16Bom) {
            texto = buffer.toString("utf16le");
        } else {
            texto = buffer.toString("utf8");
        }
    } else {
        texto = buffer.toString("utf8");
    }
    if (texto.charCodeAt(0) === 0xfeff) {
        texto = texto.slice(1);
    }
    return texto;
}

async function obterDefaultLocal(): Promise<string> {
    const dados: DadosInstitucionai = (await payloadClient.findGlobal({
        slug: "dados-institucionais",
    })) as DadosInstitucionai;
    const concessionariaNome: string | undefined = dados.concessionarias?.[0]?.nome;
    if (concessionariaNome && concessionariaNome.trim() !== "") {
        return concessionariaNome;
    }
    return "Sem Local";
}

async function fazerUploadImagem(imagem: SeminovaScrapedImage, nome: string): Promise<number | null> {
    const response: Response = await fetch(imagem.url);
    if (!response.ok) {
        return null;
    }
    const urlInstance: URL = new URL(imagem.url);
    const pathParts: string[] = urlInstance.pathname.split("/").filter((segment: string) => segment !== "");
    const filename: string = pathParts[pathParts.length - 1] ?? "imagem.jpg";
    const alt: string = imagem.alt && imagem.alt.trim() !== "" ? imagem.alt : nome;
    const tempDir: string = path.resolve(process.cwd(), "tmp", "seminovas-import");
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath: string = path.join(tempDir, filename);
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    const buffer: Buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(tempFilePath, buffer);
    const midia: Midia = (await payloadClient.create({
        collection: "midia",
        data: {
            alt,
        },
        filePath: tempFilePath,
    })) as Midia;
    await fs.unlink(tempFilePath).catch((_erro: unknown): void => undefined);
    return midia.id;
}

async function processarImagens(
    seminova: SeminovaScraped,
    nome: string,
): Promise<{ principalId: number | null; galeriaIds: number[] }> {
    if (seminova.images.length === 0) {
        return { principalId: null, galeriaIds: [] };
    }
    const [imagemPrincipal, ...imagensGaleria] = seminova.images;
    const principalId: number | null = await fazerUploadImagem(imagemPrincipal, nome);
    const galeriaIds: number[] = [];
    for (const imagem of imagensGaleria) {
        const id: number | null = await fazerUploadImagem(imagem, nome);
        if (id !== null) {
            galeriaIds.push(id);
        }
    }
    return { principalId, galeriaIds };
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
    const slug: string = slugify(base);
    return slug;
}

function criarPlacaFicticia(indice: number): string {
    const numero: string = (indice + 1).toString().padStart(4, "0");
    const placa: string = `SEM-${numero}`;
    return placa;
}

function capitalizarPrimeiraLetra(texto: string): string {
    if (texto.length === 0) {
        return texto;
    }
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

async function criarOuAtualizarSeminova(
    seminova: SeminovaScraped,
    contexto: ImportContext,
    indice: number,
): Promise<ImportResult> {
    const slugId: string = construirSlugParaSeminova(seminova);
    const precoNumero: number | null = parsePreco(seminova.priceText);
    if (precoNumero === null || precoNumero <= 0) {
        return "skipped";
    }
    if (seminova.anoFabricacao === null || seminova.anoModelo === null) {
        return "skipped";
    }
    const { principalId, galeriaIds } = await processarImagens(seminova, seminova.name);
    if (principalId === null) {
        return "skipped";
    }
    const placa: string = criarPlacaFicticia(indice);
    const marca: string = inferirMarca(seminova.name);
    const quilometragem: string = formatarQuilometragem(seminova);
    const corBruta: string | null = seminova.cor;
    const corFormatada: string =
        corBruta && corBruta.trim() !== "" ? capitalizarPrimeiraLetra(corBruta.trim()) : "Preto";
    const galeriaPayload: MotosSeminova["galeria"] = galeriaIds.map((idImagem: number, indiceGaleria: number) => ({
        imagem: idImagem,
        alt: indiceGaleria === 0 ? `${seminova.name} galeria` : `${seminova.name} galeria ${indiceGaleria + 1}`,
    }));
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
    const existentes = await payloadClient.find({
        collection: "motos-seminovas",
        where: {
            id: {
                equals: slugId,
            },
        },
        limit: 1,
    });
    const dadosSeminova: Partial<MotosSeminova> = {
        id: slugId,
        ativo: true,
        placa,
        marca,
        nome: seminova.name,
        anoFabricacao: seminova.anoFabricacao,
        anoModelo: seminova.anoModelo,
        quilometragem,
        combustivel: contexto.defaultCombustivel,
        cor: corFormatada,
        categoria: contexto.defaultCategoria,
        preco: precoNumero,
        local: contexto.defaultLocal,
        imagem: principalId,
        galeria: galeriaPayload,
        caracteristicas: caracteristicasDefault,
        adicionais: adicionaisDefault,
    };
    if (Array.isArray(existentes.docs) && existentes.docs.length > 0) {
        const existente: MotosSeminova = existentes.docs[0] as MotosSeminova;
        await payloadClient.update({
            collection: "motos-seminovas",
            id: existente.id,
            data: dadosSeminova,
        });
        return "updated";
    }
    await payloadClient.create({
        collection: "motos-seminovas",
        data: dadosSeminova,
    });
    return "created";
}

async function executarImportacao(): Promise<void> {
    const seminovasJsonPath: string = path.resolve(process.cwd(), "seminovas.json");
    const buffer: Buffer = await fs.readFile(seminovasJsonPath);
    const bruto: string = decodeTextoPossivelmenteUtf16(buffer);
    const primeiraChave: number = bruto.indexOf("[");
    const primeiroObjeto: number = bruto.indexOf("{");
    const inicioJson: number =
        primeiraChave === -1
            ? primeiroObjeto
            : primeiroObjeto === -1
              ? primeiraChave
              : Math.min(primeiraChave, primeiroObjeto);
    const jsonTexto: string = inicioJson > 0 ? bruto.slice(inicioJson) : bruto;
    const seminovas: SeminovaScraped[] = JSON.parse(jsonTexto) as SeminovaScraped[];
    const total: number = seminovas.length;
    const defaultLocal: string = await obterDefaultLocal();
    const contexto: ImportContext = {
        defaultCombustivel: "Flex",
        defaultCategoria: "City",
        defaultLocal,
    };
    let indice: number = 0;
    let criadas: number = 0;
    let atualizadas: number = 0;
    let puladas: number = 0;
    // eslint-disable-next-line no-console
    console.log(`Iniciando importação de ${total} motos seminovas...`);
    for (const seminova of seminovas) {
        const resultado: ImportResult = await criarOuAtualizarSeminova(seminova, contexto, indice);
        if (resultado === "created") {
            criadas += 1;
        } else if (resultado === "updated") {
            atualizadas += 1;
        } else {
            puladas += 1;
        }
        indice += 1;
    }
    // eslint-disable-next-line no-console
    console.log(
        `Importação concluída. Total: ${total}, criadas: ${criadas}, atualizadas: ${atualizadas}, puladas: ${puladas}.`,
    );
}

// eslint-disable-next-line no-console
console.log("[seminovas-import] Iniciando getPayload no topo...");

try {
    const payloadInstance: any = await getPayload({ config: payloadConfig });
    payloadClient = payloadInstance;
    // eslint-disable-next-line no-console
    console.log("[seminovas-import] getPayload concluído, iniciando executarImportacao()...");
    await executarImportacao();
} catch (erro: unknown) {
    // eslint-disable-next-line no-console
    console.error(erro);
    process.exitCode = 1;
}
