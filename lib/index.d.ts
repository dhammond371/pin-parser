export interface PinParserResult {
    success: boolean;
    lat?: string;
    lng?: string;
}
export declare function ParsePin(pin: string): Promise<PinParserResult>;
