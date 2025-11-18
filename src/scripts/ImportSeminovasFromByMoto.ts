import { JSDOM } from "jsdom";

type SeminovaListingItem = {
    readonly name: string;
    readonly detailUrl: string;
};

type SeminovaImage = {
    readonly url: string;
    readonly alt: string | null;
};

type SeminovaDetail = {
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
    readonly images: readonly SeminovaImage[];
};

function buildAbsoluteUrl(relativeOrAbsoluteUrl: string, baseUrl: string): string {
    try {
        const url: URL = new URL(relativeOrAbsoluteUrl, baseUrl);
        return url.toString();
    } catch {
        return relativeOrAbsoluteUrl;
    }
}

async function fetchHtml(url: string): Promise<string> {
    const response: Response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL ${url} with status ${response.status}`);
    }
    const html: string = await response.text();
    return html;
}

function extractTextContent(element: Element | null): string {
    const text: string | null = element?.textContent;
    if (!text) {
        return "";
    }
    return text.trim();
}

function extractYearsFromText(text: string): { anoFabricacao: number | null; anoModelo: number | null } {
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

function extractMileageFromText(text: string): {
    quilometragemNumero: number | null;
    quilometragemTexto: string | null;
} {
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

function parseListingHtml(html: string, baseUrl: string): SeminovaListingItem[] {
    const dom: JSDOM = new JSDOM(html);
    const document: Document = dom.window.document;
    const items: SeminovaListingItem[] = [];
    const headingElements: NodeListOf<HTMLHeadingElement> = document.querySelectorAll("h2, h3");
    headingElements.forEach((headingElement: HTMLHeadingElement) => {
        const name: string = extractTextContent(headingElement);
        if (name === "") {
            return;
        }
        const linkElement: HTMLAnchorElement | null = headingElement.closest("a") ?? headingElement.querySelector("a");
        const detailHref: string | null = linkElement?.getAttribute("href") ?? null;
        if (!detailHref) {
            return;
        }
        const detailUrl: string = buildAbsoluteUrl(detailHref, baseUrl);
        items.push({ name, detailUrl });
    });
    return items;
}

function extractImages(document: Document, baseUrl: string): SeminovaImage[] {
    const galleryContainer: Element | null =
        document.querySelector(".galeria, .gallery, .product-gallery, .swiper, .swiper-wrapper, .carousel, .slides") ??
        document.querySelector("main") ??
        document.body;
    if (!galleryContainer) {
        return [];
    }
    const imageElements: NodeListOf<HTMLImageElement> = galleryContainer.querySelectorAll("img");
    const images: SeminovaImage[] = [];
    imageElements.forEach((imageElement: HTMLImageElement) => {
        const src: string | null = imageElement.getAttribute("src");
        if (!src) {
            return;
        }
        const lowerSrc: string = src.toLowerCase();
        if (
            lowerSrc.includes("logo") ||
            lowerSrc.includes("icon") ||
            lowerSrc.includes("instagram") ||
            lowerSrc.includes("facebook") ||
            lowerSrc.includes("youtube") ||
            lowerSrc.includes("/themes/theme-by-moto-honda/")
        ) {
            return;
        }
        const url: string = buildAbsoluteUrl(src, baseUrl);
        const alt: string | null = imageElement.getAttribute("alt");
        images.push({ url, alt });
    });
    return images;
}

function parseDetailHtml(html: string, detailUrl: string, baseUrl: string): SeminovaDetail {
    const dom: JSDOM = new JSDOM(html);
    const document: Document = dom.window.document;
    const fullText: string = document.body?.textContent?.trim() ?? "";
    const titleElement: HTMLHeadingElement | null = document.querySelector("h1");
    const name: string = extractTextContent(titleElement) || detailUrl;
    const priceElement: Element | null = document.querySelector(".used-cars-internal-info-price");
    const priceText: string = extractTextContent(priceElement);

    let yearText: string = "";
    let mileageText: string = "";
    let colorRaw: string = "";

    const featureItems: NodeListOf<Element> = document.querySelectorAll(".used-cars-internal-feature-item");
    featureItems.forEach((item: Element) => {
        const labelElement: Element | null = item.querySelector(".used-cars-internal-feature-text");
        const valueElement: Element | null = item.querySelector(".used-cars-internal-feature-value");
        const label: string = extractTextContent(labelElement).toLowerCase();
        const value: string = extractTextContent(valueElement);
        if (label.includes("ano")) {
            yearText = value;
        } else if (label.includes("km")) {
            mileageText = value;
        } else if (label.includes("cor")) {
            colorRaw = value;
        }
    });

    const locationElement: Element | null = document.querySelector(".loja, .local, .filial");
    const locationText: string | null = extractTextContent(locationElement) || null;
    const yearSourceText: string = yearText === "" ? fullText : yearText;
    const { anoFabricacao, anoModelo } = extractYearsFromText(yearSourceText);
    const mileageSourceText: string = mileageText === "" ? fullText : mileageText;
    const { quilometragemNumero, quilometragemTexto } = extractMileageFromText(mileageSourceText);
    const cor: string | null = colorRaw !== "" ? colorRaw.toLowerCase() : extractColorFromText(fullText || name);
    const images: SeminovaImage[] = extractImages(document, baseUrl);
    return {
        name,
        priceText,
        yearText,
        mileageText,
        locationText,
        anoFabricacao,
        anoModelo,
        quilometragemNumero,
        quilometragemTexto,
        cor,
        images,
    };
}

async function importFromListing(listingUrl: string, baseUrl: string): Promise<SeminovaDetail[]> {
    const html: string = await fetchHtml(listingUrl);
    const listingItems: SeminovaListingItem[] = parseListingHtml(html, baseUrl);
    const details: SeminovaDetail[] = [];
    for (const listingItem of listingItems) {
        const detailHtml: string = await fetchHtml(listingItem.detailUrl);
        const detail: SeminovaDetail = parseDetailHtml(detailHtml, listingItem.detailUrl, baseUrl);
        details.push(detail);
    }
    return details;
}

async function main(): Promise<void> {
    const defaultListingUrl: string =
        "https://bymoto.com.br/seminovos?year-min=&year-max=&price_min=&price_max=&km_min=&km_max=&limit=100&page=1&order=";
    const listingUrl: string = process.argv[2] ?? defaultListingUrl;
    const baseUrl: string = "https://bymoto.com.br";
    const details: SeminovaDetail[] = await importFromListing(listingUrl, baseUrl);
    // Reason: imprimir JSON estruturado para ser consumido por scripts de importação no Payload
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(details, null, 2));
}

void main().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
});
