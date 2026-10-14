//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class poulyar
 * @augments Exchange
 */
export default class poulyar extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'poulyar',
            'name': 'Poulyar',
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
                    'public': 'https://api.poulyar.com',
                },
                'www': 'https://poulyar.com',
                'doc': 'https://api.poulyar.com/api/v2/market-data',
            },
            'api': {
                'public': {
                    'get': {
                        'api/v2/market-data': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name poulyar#fetchMarkets
         * @description retrieves data on all OTC markets for poulyar
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await (this as any).publicGetApiV2MarketData (params);
        const result = this.safeDict (response, 'result', {});
        const markets = this.safeDict (result, 'symbols', {});
        const marketIds = Object.keys (markets);
        const parsedMarkets = [];
        for (let i = 0; i < marketIds.length; i++) {
            parsedMarkets.push (this.parseMarket (markets[marketIds[i]]));
        }
        return parsedMarkets;
    }

    parseMarket (market): Market {
        const id = this.safeString (market, 'symbol');
        const baseId = this.safeString (market, 'baseAsset');
        const quoteId = this.safeString (market, 'quoteAsset');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': true,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber (market, 'basePrecision'),
                'price': this.safeNumber (market, 'quotePrecision'),
            },
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': { 'min': this.safeNumber (market, 'minQty'), 'max': undefined },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': this.safeNumber (market, 'minNotional'), 'max': undefined },
            },
            'created': undefined,
            'info': market,
        };
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name poulyar#fetchTicker
         * @description fetches a price ticker for an OTC market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const tickers = await this.fetchTickers ([ symbol ], params);
        return tickers[symbol];
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name poulyar#fetchTickers
         * @description fetches price tickers for all OTC markets
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the tickers for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await (this as any).publicGetApiV2MarketData (params);
        const result = this.safeDict (response, 'result', {});
        const markets = this.safeDict (result, 'symbols', {});
        const marketIds = Object.keys (markets);
        const tickers = {};
        for (let i = 0; i < marketIds.length; i++) {
            const ticker = this.parseTicker (markets[marketIds[i]]);
            tickers[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers (tickers, 'symbol', symbols);
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        const marketId = this.safeString (ticker, 'symbol');
        market = this.safeMarket (marketId, market);
        const stats = this.safeDict (ticker, 'stats', {});
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': this.parse8601 (this.safeString (ticker, 'updatedAt')),
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': this.safeString (stats, 'bidPrice'),
            'bidVolume': undefined,
            'ask': this.safeString (stats, 'askPrice'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': this.safeString (stats, 'lastPrice'),
            'last': this.safeString (stats, 'lastPrice'),
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeString (stats, '24h_ch'),
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
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
