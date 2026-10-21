//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class swapwallet
 * @augments Exchange
 */
export default class swapwallet extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'swapwallet',
            'name': 'Swapwallet',
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
                    'public': 'https://swapwallet.app/api/v2',
                },
                'www': 'https://swapwallet.app',
                'doc': 'https://swapwallet.app/api/v2/market/crypto/stats',
            },
            'api': {
                'public': {
                    'get': {
                        'market/crypto/stats': 1,
                    },
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name swapwallet#fetchMarkets
         * @description retrieves all OTC markets
         * @see https://swapwallet.app/api/v2/market/crypto/stats
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of market structures
         */
        const response = await (this as any).publicGetMarketCryptoStats (params);
        const markets = this.safeDict (response, 'result', {});
        const ids = Object.keys (markets);
        const result = [];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            result.push (this.parseMarket (this.extend (markets[id], { 'id': id })));
        }
        return result;
    }

    parseMarket (market): Market {
        // {
        //     "source": "USOON",
        //     "destination": "USDT",
        //     "marketData": {
        //         "bestSell": "165.72",
        //         "bestBuy": "162.43",
        //         "latestPrice": "164.08",
        //         "dayChange": "2.98",
        //         "volume24h": "3753.99"
        //     }
        // }
        const baseId = this.safeString (market, 'source');
        const quoteId = this.safeString (market, 'destination');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const id = this.safeString (market, 'id', baseId + '-' + quoteId);
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
            'active': undefined,
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
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': market,
        };
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name swapwallet#fetchTickers
         * @description fetches 24 hour price statistics for multiple OTC markets
         * @see https://swapwallet.app/api/v2/market/crypto/stats
         * @param {string[]} [symbols] unified symbols, all markets are returned if undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of ticker structures indexed by symbol
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const response = await (this as any).publicGetMarketCryptoStats (params);
        const tickers = this.safeDict (response, 'result', {});
        const ids = Object.keys (tickers);
        const result = {};
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const ticker = this.parseTicker (tickers[id]);
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name swapwallet#fetchTicker
         * @description fetches 24 hour price statistics for a single OTC market
         * @see https://swapwallet.app/api/v2/market/crypto/stats
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a ticker structure
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const tickers = await this.fetchTickers ([ market['symbol'] ], params);
        return tickers[market['symbol']];
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        const baseId = this.safeString (ticker, 'source');
        const quoteId = this.safeString (ticker, 'destination');
        const marketId = baseId + '-' + quoteId;
        const symbol = this.safeSymbol (marketId, market, '-', 'otc');
        const data = this.safeDict (ticker, 'marketData', {});
        const last = this.safeString (data, 'latestPrice');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': this.safeString (data, 'bestBuy'),
            'bidVolume': undefined,
            'ask': this.safeString (data, 'bestSell'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeString (data, 'dayChange'),
            'average': undefined,
            'baseVolume': this.safeString (data, 'volume24h'),
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let url = this.urls['api'][api] + '/' + this.implodeParams (path, params);
        if (Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
