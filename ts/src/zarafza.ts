//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class zarafza
 * @augments Exchange
 */
export default class zarafza extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'zarafza',
            'name': 'Zarafza',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': 'v2',
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
                    'public': 'https://api.zarafza.com',
                },
                'www': 'https://zarafza.com',
                'doc': 'https://api.zarafza.com/v2/prices',
            },
            'api': {
                'public': {
                    'get': {
                        'v2/prices': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await (this as any).publicGetV2Prices (params);
        return [ this.parseMarket (response) ];
    }

    parseMarket (response): Market {
        const data = this.safeDict (response, 'data', {});
        const gold = this.safeDict (data, 'G18', {});
        const sell = this.safeDict (gold, 'sell', {});
        return {
            'id': 'G18',
            'symbol': 'XAU18/IRT',
            'base': 'XAU18',
            'quote': 'IRT',
            'settle': undefined,
            'baseId': 'G18',
            'quoteId': 'IRT',
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeNumber (sell, 'price') !== undefined,
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
            'info': gold,
        };
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await (this as any).publicGetV2Prices (params);
        return this.parseTicker (response, market);
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await (this as any).publicGetV2Prices (params);
        const market = this.market ('XAU18/IRT');
        const ticker = this.parseTicker (response, market);
        const result = {};
        result[ticker['symbol']] = ticker;
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    parseTicker (response, market: Market = undefined): Ticker {
        const data = this.safeDict (response, 'data', {});
        const gold = this.safeDict (data, 'G18', {});
        const buy = this.safeDict (gold, 'buy', {});
        const sell = this.safeDict (gold, 'sell', {});
        const bid = this.safeNumber (buy, 'price');
        const ask = this.safeNumber (sell, 'price');
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
            'close': ask,
            'last': ask,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeNumber (sell, 'change'),
            'average': undefined,
            'baseVolume': this.safeNumber (gold, 'volume'),
            'quoteVolume': undefined,
            'info': gold,
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
