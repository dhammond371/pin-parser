export interface PinParserResult {
    success: boolean,
    lat?: string,
    lng?: string,
}

export const ParsePin = (pin: string): PinParserResult => {
    if (pin == null) return { success: false };
    
    // handle various formats here
    return { success: true };
}