
//  ---------------------------------------------------------------------------

import Exchange from './abstract/balinex.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class balinex
 * @augments Exchange
 */
export default class balinex extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'balinex',
            'name': 'Balinex',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': '1',
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'fetchMarkets': true,
                'fetchTicker': true,
                'fetchTickers': true,
            },
            'urls': {
                'logo': 'https://balinex.com/favicon.ico',
                'api': {
                    'public': 'https://api.balinex.com',
                },
                'www': 'https://balinex.com',
                'doc': [
                    'https://api.balinex.com/public/markets',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        'public/markets': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name balinex#fetchMarkets
         * @description retrieves data on all markets for balinex
         * @see https://api.balinex.com/public/markets
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetPublicMarkets (params);
        const data = this.safeDict (response, 'result', {});
        const items = this.safeList (data, 'items', []);
        const result = [];
        for (let i = 0; i < items.length; i++) {
            result.push (this.parseMarket (items[i]));
        }
        return result;
    }

    parseMarket (market): Market {
        // {
        //     "productId": "ADAUSDT",
        //     "baseCurrency": "ADA",
        //     "quoteCurrency": "USDT",
        //     "baseScale": 2,
        //     "quoteScale": 4,
        //     "lastPrice": "0.2047",
        //     "openPrice24h": "0.2089",
        //     "highPrice24h": "0.2103",
        //     "lowPrice24h": "0.2012",
        //     "volume24h": "1530110.38",
        //     "quoteVolume24h": "313213.5968",
        //     "priceChange24h": "-0.0042",
        //     "percentChange24h": "-2.01",
        //     "allowBuy": true,
        //     "allowSell": true
        // }
        const id = this.safeString (market, 'productId');
        const baseId = this.safeString (market, 'baseCurrency');
        const quoteId = this.safeString (market, 'quoteCurrency');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const allowBuy = this.safeBool (market, 'allowBuy', false);
        const allowSell = this.safeBool (market, 'allowSell', false);
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': 'spot',
            'spot': true,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': allowBuy && allowSell,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.parseNumber (this.parsePrecision (this.safeString (market, 'baseScale'))),
                'price': this.parseNumber (this.parsePrecision (this.safeString (market, 'quoteScale'))),
            },
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': { 'min': undefined, 'max': undefined },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': undefined, 'max': undefined },
            },
            'created': undefined,
            'info': market,
        };
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name balinex#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://api.balinex.com/public/markets
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await this.publicGetPublicMarkets (params);
        const data = this.safeDict (response, 'result', {});
        const items = this.safeList (data, 'items', []);
        const result = {};
        for (let i = 0; i < items.length; i++) {
            const ticker = this.parseTicker (items[i]);
            const symbol = ticker['symbol'];
            result[symbol] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name balinex#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://api.balinex.com/public/markets
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const ticker = await this.fetchTickers ([ symbol ], params);
        return ticker[symbol];
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        // {
        //     "productId": "BTCIRT",
        //     "baseCurrency": "BTC",
        //     "quoteCurrency": "IRT",
        //     "baseScale": 7,
        //     "quoteScale": 0,
        //     "lastPrice": "21703802224",
        //     "openPrice24h": "21816018777",
        //     "highPrice24h": "21823312074",
        //     "lowPrice24h": "21341032776",
        //     "volume24h": "1.4538258",
        //     "quoteVolume24h": "31553547631",
        //     "priceChange24h": "-112216553",
        //     "percentChange24h": "-0.51",
        //     "allowBuy": true,
        //     "allowSell": true
        // }
        const marketId = this.safeString (ticker, 'productId');
        market = this.safeMarket (marketId, market);
        const last = this.safeString (ticker, 'lastPrice');
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': undefined,
            'datetime': undefined,
            'high': this.safeString (ticker, 'highPrice24h'),
            'low': this.safeString (ticker, 'lowPrice24h'),
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'open': this.safeString (ticker, 'openPrice24h'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': this.safeString (ticker, 'priceChange24h'),
            'percentage': this.safeString (ticker, 'percentChange24h'),
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'volume24h'),
            'quoteVolume': this.safeString (ticker, 'quoteVolume24h'),
            'info': ticker,
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
