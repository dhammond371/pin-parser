import { IncomingMessage, request as httpReq } from 'http'
import { request as httpsReq, RequestOptions } from 'https'
export interface PinParserResult {
    success: boolean,
    lat?: string,
    lng?: string,
}

export async function parsePin(pin: string): Promise<PinParserResult> {
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


// The following is from 'tall' npm package:
export class Follow {
  follow: URL
  constructor(follow: URL) {
    this.follow = follow
  }
}

export class Stop {
  stop: URL
  constructor(stop: URL) {
    this.stop = stop
  }
}

export interface TallPlugin {
  (url: URL, response: IncomingMessage, previous: Follow | Stop): Promise<
    Follow | Stop
  >
}

export async function locationHeaderPlugin(
  url: URL,
  response: IncomingMessage,
  previous: Follow | Stop
): Promise<Follow | Stop> {
  const { protocol, host } = url

  if (response.headers.location) {
    const followUrl = new URL(
      response.headers.location.startsWith('http')
        ? response.headers.location
        : `${protocol}//${host}${response.headers.location}`
    )
    return new Follow(followUrl)
  }

  return previous
}

export interface TallOptions extends RequestOptions {
  maxRedirects: number
  timeout: number
  plugins: TallPlugin[]
}

const defaultOptions: TallOptions = {
  method: 'GET',
  maxRedirects: 3,
  headers: {},
  timeout: 120000,
  plugins: [locationHeaderPlugin]
}

function makeRequest(url: URL, options: TallOptions): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const request = url.protocol === 'https:' ? httpsReq : httpReq
    const req = request(url, options as RequestOptions, (response) => {
      resolve(response)
    })
    req.on('error', reject)
    req.setTimeout(options.timeout, () => req.destroy())
    req.end()
  })
}

export const tall = async (
  url: string,
  options?: Partial<TallOptions>
): Promise<string> => {
  const opt = Object.assign({}, defaultOptions, options)
  if (opt.maxRedirects <= 0) {
    return url.toString()
  }

  const parsedUrl = new URL(url)
  let prev: Stop | Follow = new Stop(parsedUrl)
  const response = await makeRequest(parsedUrl, opt)
  for (const plugin of opt.plugins) {
    prev = await plugin(parsedUrl, response, prev)
  }

  const maxRedirects = opt.maxRedirects - 1
  if (prev instanceof Follow) {
    return await tall(prev.follow.toString(), { ...options, maxRedirects })
  }

  return prev.stop.toString()
}