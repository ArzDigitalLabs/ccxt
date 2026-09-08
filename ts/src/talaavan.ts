//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class talaavan
 * @augments Exchange
 */
export default class talaavan extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'talaavan',
            'name': 'Talaavan',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': 'v1',
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'fetchMarkets': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'otc': true,
            },
            'options': {
                'defaultType': 'otc',
            },
            'urls': {
                'api': {
                    'public': 'https://goldcore.talaavan.com',
                },
                'www': 'https://goldcore.talaavan.com',
                'doc': 'https://goldcore.talaavan.com/v1/price',
            },
            'api': {
                'public': {
                    'get': {
                        'v1/price': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await (this as any).publicGetV1Price (params);
        return [ this.parseMarket (response) ];
    }

    parseMarket (response): Market {
        return {
            'id': 'XAU18IRT',
            'symbol': 'XAU18/IRT',
            'base': 'XAU18',
            'quote': 'IRT',
            'settle': undefined,
            'baseId': 'XAU18',
            'quoteId': 'IRT',
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeBool (response, 'status', false),
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': undefined,
                'price': undefined,
            },
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': { 'min': undefined, 'max': undefined },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': undefined, 'max': undefined },
            },
            'created': undefined,
            'info': response,
        };
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await (this as any).publicGetV1Price (params);
        return this.parseTicker (response, market);
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await (this as any).publicGetV1Price (params);
        const market = this.market ('XAU18/IRT');
        const ticker = this.parseTicker (response, market);
        const result = {};
        result[ticker['symbol']] = ticker;
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    parseTicker (response, market: Market = undefined): Ticker {
        const data = this.safeDict (response, 'data', {});
        let price = this.safeNumber (data, 'rate');
        if (price !== undefined) {
            price = price / 10;
        }
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': this.parse8601 (this.safeString (data, 'date')),
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': price,
            'bidVolume': undefined,
            'ask': price,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': price,
            'last': price,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': data,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        if (Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = { 'Accept': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
