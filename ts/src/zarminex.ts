//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class zarminex
 * @augments Exchange
 */
export default class zarminex extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'zarminex',
            'name': 'Zarminex',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': '1',
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
                    'public': 'https://api.zarminex.ir',
                },
                'www': 'https://zarminex.ir',
                'doc': 'https://api.zarminex.ir/function_url/',
            },
            'api': {
                'public': {
                    'get': {
                        'function_url': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await (this as any).publicGetFunctionUrl (params);
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
            'active': this.safeNumber (response, 'cached_price') !== undefined,
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
        const response = await (this as any).publicGetFunctionUrl (params);
        return this.parseTicker (response, market);
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await (this as any).publicGetFunctionUrl (params);
        const market = this.market ('XAU18/IRT');
        const ticker = this.parseTicker (response, market);
        const result = {};
        result[ticker['symbol']] = ticker;
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    parseTicker (response, market: Market = undefined): Ticker {
        let bid = this.safeNumber (response, 'sell');
        let ask = this.safeNumber (response, 'buy');
        let last = this.safeNumber (response, 'cached_price');
        if (bid !== undefined) {
            bid = bid / 10;
        }
        if (ask !== undefined) {
            ask = ask / 10;
        }
        if (last !== undefined) {
            last = last / 10;
        }
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': response,
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
