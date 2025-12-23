export interface Configuration {
    id: string;
    ratePerUnit: number;
    vatPercentage: number;
    fixedServiceCharge: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateConfigDto {
    ratePerUnit: number;
    vatPercentage: number;
    fixedServiceCharge: number;
}

export interface CalculateBillDto {
    unitsConsumed: number;
}

export interface BillResponse {
    unitsConsumed: number;
    ratePerUnit: number;
    subtotal: number;
    vatPercentage: number;
    vatAmount: number;
    fixedServiceCharge: number;
    totalAmount: number;
    calculatedAt: string;
}
