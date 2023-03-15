import { tall } from 'tall';
export interface PinParserResult {
    success: boolean,
    lat?: string,
    lng?: string,
}

export async function ParsePin(pin: string): Promise<PinParserResult> {
    if (pin == null) return { success: false };

    // Handle the form: '12.3456,78.91011' or '(12.3456,78.91011)'
    const splitByComma = pin.replace(/\s/g, '').split(',').map(a => a.replace('(', '').replace(')', ''));
    if (
        !Number.isNaN(+(splitByComma?.[0] as string)) &&
        !Number.isNaN(+(splitByComma?.[1] as string)) &&
        splitByComma?.[0] != null &&
        splitByComma?.[1] != null
        ) {
        return {
            success: true,
            lat: splitByComma[0],
            lng: splitByComma[1],
        }
    }

    // handle google maps link: https://maps.app.goo.gl/c3rjbowSs23hQnhR8?g_st=ic
    // handle apple maps link: https://maps.apple.com/?ll=54.745391,-110.146062&q=Dropped%20Pin&t=m
    if (pin.slice(0, 4) === 'http') {
        return tall(pin)
            .then((unshortenedUrl: string) => {
                const latLng = unshortenedUrl.match(/-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?/g)?.[0];
                const split = latLng?.split(',');
                const lat = split?.[0];
                const lng = split?.[1];
                if (!!lat && !!lng) {
                    return {
                        success: true,
                        lat,
                        lng,
                    }
                }
                return {
                    success: false,
                }
               
            })
            .catch(() => {
                return { success: false }
            });
    }
    
    
    // handle various formats here
    return { success: false };
}