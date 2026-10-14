//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class ariomex
 * @augments Exchange
 */
export default class ariomex extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'ariomex',
            'name': 'Ariomex',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': 'v1',
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
                'fetchTime': true,
            },
            'urls': {
                'api': {
                    'public': 'https://api.ariomex.ir',
                },
                'www': 'https://ariomex.ir',
                'doc': 'https://api.ariomex.ir/v1/public/markets_details',
            },
            'api': {
                'public': {
                    'get': {
                        'v1/public/markets_details': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name ariomex#fetchMarkets
         * @description retrieves data on all markets for ariomex
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await (this as any).publicGetV1PublicMarketsDetails (params);
        const markets = this.safeList (response, 'result');
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseMarket (markets[i]));
        }
        return result;
    }

    parseMarket (market): Market {
        // {
        //     'symbol': 'btcusdt',
        //     'base': 'btc',
        //     'quote': 'usdt',
        //     'spot_enabled': 'true',
        //     'base_market_precision': '5',
        //     'quote_market_precision': '2',
        //     'base_coin_precision': '8',
        //     'quote_coin_precision': '8',
        // }
        const id = this.safeString (market, 'symbol');
        const baseId = this.safeString (market, 'base');
        const quoteId = this.safeString (market, 'quote');
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
            'type': 'spot',
            'spot': true,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeBool (market, 'spot_enabled'),
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber (market, 'base_market_precision'),
                'price': this.safeNumber (market, 'quote_market_precision'),
            },
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': { 'min': undefined, 'max': undefined },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': undefined, 'max': undefined },
            },
            'created': this.safeInteger (market, 'time_listed'),
            'info': market,
        };
    }

    async fetchTime (params = {}): Promise<number> {
        const response = await (this as any).publicGetV1PublicMarketsDetails (params);
        return this.safeInteger (response, 'serverTime');
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name ariomex#fetchTicker
         * @description fetches a price ticker for a market
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
         * @name ariomex#fetchTickers
         * @description fetches price tickers for all markets
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the tickers for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await (this as any).publicGetV1PublicMarketsDetails (params);
        const timestamp = this.safeInteger (response, 'serverTime');
        const markets = this.safeList (response, 'result');
        const result = {};
        for (let i = 0; i < markets.length; i++) {
            markets[i]['timestamp'] = timestamp;
            const ticker = this.parseTicker (markets[i]);
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        const marketId = this.safeString (ticker, 'symbol');
        market = this.safeMarket (marketId, market);
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': this.safeInteger (ticker, 'timestamp'),
            'datetime': undefined,
            'high': this.safeString (ticker, 'highest_price'),
            'low': this.safeString (ticker, 'lowest_price'),
            'bid': this.safeString (ticker, 'bid_price'),
            'bidVolume': undefined,
            'ask': this.safeString (ticker, 'ask_price'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': this.safeString (ticker, 'last_price'),
            'last': this.safeString (ticker, 'last_price'),
            'previousClose': undefined,
            'change': this.safeString (ticker, 'change_price'),
            'percentage': this.safeString (ticker, 'change_percentage'),
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'volume'),
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
