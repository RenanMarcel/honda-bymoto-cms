import React from "react";
import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Caixa de alerta simples exibida na interface do admin.
 */
export const AlertBox: React.FC = () => {
    return (
        <div className="grid w-full max-w-sm items-start gap-4 rounded-2xl">
            <Alert>
                <CheckCircle2Icon />
                <AlertTitle>Alterações salvas com sucesso</AlertTitle>
                <AlertDescription>Este é um exemplo de alerta com ícone, título e descrição.</AlertDescription>
            </Alert>
        </div>
    );
};

export default AlertBox;
