
//  ---------------------------------------------------------------------------

import Exchange from './abstract/exino.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

export default class exino extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'exino',
            'name': 'Exino',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': '2',
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
            'urls': {
                'logo': 'https://exino.org/favicon.ico',
                'api': {
                    'public': 'https://exino.org/api',
                },
                'www': 'https://exino.org',
                'doc': [
                    'https://exino.org/api/crypto/v2/public/market',
                ],
            },
            'api': {
                'public': {
                    'post': {
                        'crypto/v2/public/market': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name exino#fetchMarkets
         * @description retrieves all OTC markets for exino
         * @see https://exino.org/api/crypto/v2/public/market
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of market structures
         */
        const response = await this.publicPostCryptoV2PublicMarket (params);
        const data = this.safeDict (response, 'data', {});
        const coins = this.safeDict (data, 'coins', {});
        const items = this.safeList (coins, 'items', []);
        const result = [];
        const quotes = [ 'IRT', 'USDT' ];
        for (let i = 0; i < items.length; i++) {
            const base = this.safeString (items[i], 'sym');
            if (base === undefined) {
                continue;
            }
            for (let j = 0; j < quotes.length; j++) {
                const quote = quotes[j];
                if (base === quote) {
                    continue;
                }
                result.push (this.parseMarket ({
                    'base': base,
                    'quote': quote,
                    'info': items[i],
                }));
            }
        }
        return result;
    }

    parseMarket (market): Market {
        const baseId = this.safeString (market, 'base');
        const quoteId = this.safeString (market, 'quote');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        return {
            'id': base + quote,
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
            'info': this.safeDict (market, 'info', market),
        };
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name exino#fetchTickers
         * @description fetches OTC tickers for all exino assets
         * @see https://exino.org/api/crypto/v2/public/market
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of ticker structures
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await this.publicPostCryptoV2PublicMarket (params);
        const data = this.safeDict (response, 'data', {});
        const coins = this.safeDict (data, 'coins', {});
        const items = this.safeList (coins, 'items', []);
        const result = {};
        const quotes = [ 'IRT', 'USDT' ];
        for (let i = 0; i < items.length; i++) {
            const base = this.safeString (items[i], 'sym');
            if (base === undefined) {
                continue;
            }
            for (let j = 0; j < quotes.length; j++) {
                const quote = quotes[j];
                if (base === quote) {
                    continue;
                }
                const market = this.market (base + '/' + quote);
                const ticker = this.parseTicker (items[i], market);
                result[ticker['symbol']] = ticker;
            }
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        const tickers = await this.fetchTickers ([ symbol ], params);
        return tickers[symbol];
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        const base = this.safeString (market, 'base');
        const quote = this.safeString (market, 'quote');
        const marketId = base + quote;
        const symbol = this.safeSymbol (marketId, market, undefined, 'otc');
        let last = this.safeFloat (ticker, 'priceUsd');
        let bid = this.safeFloat (ticker, 'sellPriceUsd');
        let ask = this.safeFloat (ticker, 'buyPriceUsd');
        if (quote === 'IRT') {
            last = this.safeFloat (ticker, 'priceToman');
            bid = this.safeFloat (ticker, 'sellPriceToman');
            ask = this.safeFloat (ticker, 'buyPriceToman');
        }
        const percentage = this.safeFloat (ticker, 'chg24h');
        return this.safeTicker ({
            'symbol': symbol,
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
            'percentage': percentage,
            'average': undefined,
            'baseVolume': this.safeFloat (ticker, 'volume24h'),
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const url = this.urls['api'][api] + '/' + path;
        if (method === 'POST') {
            body = this.json (params);
            headers = { 'Content-Type': 'application/json' };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
