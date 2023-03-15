import { ParsePin } from "../src";

describe('PinParser', () => {
    
    it('should return correct result when null is passed in', async () => {
        await expect(ParsePin((null as unknown) as string)).resolves.toEqual({ success: false });
        await expect(ParsePin((undefined as unknown) as string)).resolves.toEqual({ success: false });
    });

    it('should return correct result when lat,lng or (lat,lng) or ( lat, lng ) passed in', async () => {
        await expect(ParsePin('123.456,78.910')).resolves.toEqual({ success: true, lat: '123.456', lng: '78.910' });
        await expect(ParsePin('54.2391739,-111.89087521')).resolves.toEqual({ success: true, lat: '54.2391739', lng: '-111.89087521' });
        await expect(ParsePin('(123.456,78.910)')).resolves.toEqual({ success: true, lat: '123.456', lng: '78.910' });
        await expect(ParsePin('(54.2391739,-111.89087521)')).resolves.toEqual({ success: true, lat: '54.2391739', lng: '-111.89087521' });
        await expect(ParsePin('( 123.456, 78.910 )')).resolves.toEqual({ success: true, lat: '123.456', lng: '78.910' });
        await expect(ParsePin('( 54.2391739, -111.89087521 )')).resolves.toEqual({ success: true, lat: '54.2391739', lng: '-111.89087521' });
    });

   it('should return correct result when shortened google maps link is supplied', async () => {
        await expect(ParsePin('https://maps.app.goo.gl/c3rjbowSs23hQnhR8?g_st=ic')).resolves.toEqual({
            success: true,
            lat: '54.8348920',
            lng: '-113.4811306',
        });
   });

   it('should return correct result when apple maps link is supplied', async () => {
    await expect(ParsePin('https://maps.apple.com/?ll=54.735301,-113.446062&q=Dropped%20Pin&t=m')).resolves.toEqual({
        success: true,
        lat: '54.735301',
        lng: '-113.446062',
    });
});
})