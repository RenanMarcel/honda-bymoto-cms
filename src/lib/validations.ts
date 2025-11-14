/**
 * Biblioteca de validações reutilizáveis para campos do Payload CMS
 */

/**
 * Remove caracteres não numéricos de uma string
 */
export const removeNonNumeric = (value: string): string => {
    return value.replace(/\D/g, "");
};

/**
 * Valida CNPJ brasileiro
 */
export const validateCNPJ = (value: string): true | string => {
    if (!value || value.trim() === "") {
        return "CNPJ é obrigatório";
    }
    const cnpj = removeNonNumeric(value);
    if (cnpj.length !== 14) {
        return "CNPJ deve ter 14 dígitos";
    }
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) {
        return "CNPJ inválido";
    }
    // Validação dos dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
        return "CNPJ inválido";
    }
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
        return "CNPJ inválido";
    }
    return true;
};

/**
 * Formata CNPJ: 12.345.678/0001-90
 */
export const formatCNPJ = (value: string): string => {
    const digits = removeNonNumeric(value);
    if (digits.length === 0) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
};

/**
 * Valida CEP brasileiro
 */
export const validateCEP = (value: string): true | string => {
    if (!value || value.trim() === "") {
        return "CEP é obrigatório";
    }
    const cep = removeNonNumeric(value);
    if (cep.length !== 8) {
        return "CEP deve ter 8 dígitos";
    }
    if (!/^\d{8}$/.test(cep)) {
        return "CEP inválido";
    }
    return true;
};

/**
 * Formata CEP: 12345-678
 */
export const formatCEP = (value: string): string => {
    const digits = removeNonNumeric(value);
    if (digits.length === 0) return "";
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};

/**
 * Valida URL
 */
export const validateURL = (required: boolean = false) => {
    return (value: string): true | string => {
        if (!value || value.trim() === "") {
            return required ? "URL é obrigatória" : true;
        }
        try {
            const url = new URL(value);
            if (!url.protocol.startsWith("http")) {
                return "URL deve começar com http:// ou https://";
            }
            return true;
        } catch {
            return "URL inválida. Formato esperado: https://exemplo.com";
        }
    };
};

/**
 * Valida código do país (internacional)
 */
export const validateCountryCode = (value: string): true | string => {
    if (!value || value.trim() === "") {
        return "Código do país é obrigatório";
    }
    if (!/^\d{1,3}$/.test(value)) {
        return "Código do país deve conter apenas 1 a 3 dígitos";
    }
    return true;
};

/**
 * Valida telefone brasileiro com DDD
 */
export const validateBrazilianPhone = (value: string): true | string => {
    if (!value || value.trim() === "") {
        return "Número é obrigatório";
    }
    const cleaned = removeNonNumeric(value);
    if (cleaned.length < 10 || cleaned.length > 11) {
        return "Número deve ter 10 ou 11 dígitos (DDD + número)";
    }
    if (!/^[1-9]{2}[2-9]\d{7,8}$/.test(cleaned)) {
        return "Formato inválido. Use: DDD (2 dígitos) + Número (8 ou 9 dígitos)";
    }
    return true;
};

/**
 * Formata telefone brasileiro: (11) 98765-4321
 */
export const formatBrazilianPhone = (value: string): string => {
    const digits = removeNonNumeric(value);
    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

/**
 * Valida email (adicional à validação do tipo 'email' do Payload)
 */
export const validateEmail = (required: boolean = false) => {
    return (value: string): true | string => {
        if (!value || value.trim() === "") {
            return required ? "E-mail é obrigatório" : true;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "E-mail inválido";
        }
        return true;
    };
};

/**
 * Valida número inteiro positivo
 */
export const validatePositiveInteger = (required: boolean = false) => {
    return (value: number | null | undefined): true | string => {
        if (value === null || value === undefined || value === 0) {
            return required ? "Campo obrigatório" : true;
        }
        if (!Number.isInteger(value) || value < 0) {
            return "Deve ser um número inteiro positivo";
        }
        return true;
    };
};

/**
 * Valida string não vazia
 */
export const validateNotEmpty = (fieldName: string = "Campo") => {
    return (value: string): true | string => {
        if (!value || value.trim() === "") {
            return `${fieldName} é obrigatório`;
        }
        return true;
    };
};

/**
 * Valida URL de rede social (formato específico)
 */
export const validateSocialMediaURL = (platform: string) => {
    return (value: string): true | string => {
        if (!value || value.trim() === "") {
            return true; // Opcional
        }
        try {
            const url = new URL(value);
            const platformDomains: Record<string, string[]> = {
                instagram: ["instagram.com", "www.instagram.com"],
                facebook: ["facebook.com", "www.facebook.com", "fb.com"],
                youtube: ["youtube.com", "www.youtube.com", "youtu.be"],
                linkedin: ["linkedin.com", "www.linkedin.com"],
            };
            const validDomains = platformDomains[platform.toLowerCase()];
            if (validDomains && !validDomains.includes(url.hostname)) {
                return `URL deve ser do ${platform}`;
            }
            return true;
        } catch {
            return "URL inválida";
        }
    };
};
