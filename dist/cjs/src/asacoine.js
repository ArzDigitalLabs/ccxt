'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');
var Precise = require('./base/Precise.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class asacoine
 * @augments Exchange
 */
class asacoine extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'asacoine',
            'name': 'Asacoine',
            'countries': ['IR'],
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
                'otc': true,
            },
            'urls': {
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/asacoine/64x64.png',
                'api': {
                    'public': 'https://api.asacoine.com/api',
                },
                'www': 'https://asacoine.com',
                'doc': 'https://api.asacoine.com/api/v1/market/pairs/pricing',
            },
            'api': {
                'public': {
                    'get': {
                        'v1/market/pairs/pricing': 1,
                        'v1/market/pairs/cumulative': 1,
                    },
                },
            },
            'commonCurrencies': {
                'TMN': 'IRT',
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber('0'),
                    'taker': this.parseNumber('0'),
                },
            },
        });
    }
    parseMarket(market) {
        const baseId = this.safeString(market, 'baseId');
        const quoteId = this.safeString(market, 'quoteId');
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        return {
            'id': baseId + '/' + quoteId,
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
            'info': this.safeValue(market, 'info', market),
        };
    }
    parseOtcMarket(market) {
        const baseId = this.safeString(market, 'baseId');
        const quoteId = this.safeString(market, 'quoteId');
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        return {
            'id': baseId + '/' + quoteId,
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
            'info': this.safeValue(market, 'info', market),
        };
    }
    parseMarkets(response) {
        const data = this.safeDict(response, 'data', {});
        const baseIds = Object.keys(data);
        const result = [];
        for (let i = 0; i < baseIds.length; i++) {
            const baseId = baseIds[i];
            const quotes = this.safeDict(data, baseId, {});
            const quoteIds = Object.keys(quotes);
            for (let j = 0; j < quoteIds.length; j++) {
                const quoteId = quoteIds[j];
                const ticker = this.safeDict(quotes, quoteId, {});
                result.push(this.parseMarket({ 'baseId': baseId, 'quoteId': quoteId, 'info': ticker }));
            }
        }
        return result;
    }
    parseCumulativeMarkets(response) {
        const data = this.safeDict(response, 'data', {});
        const keys = this.safeList(data, 'keys', []);
        const values = this.safeList(data, 'values', []);
        const result = [];
        for (let i = 0; i < values.length; i++) {
            const row = values[i];
            const market = {};
            for (let j = 0; j < keys.length; j++) {
                market[keys[j]] = row[j];
            }
            const marketTypes = this.safeList(market, 'marketTypes', []);
            if (!this.inArray('otc', marketTypes)) {
                continue;
            }
            const name = this.safeString(market, 'name');
            const [baseId, quoteId] = name.split('-');
            market['baseId'] = baseId;
            market['quoteId'] = quoteId;
            result.push(this.parseOtcMarket(market));
        }
        return result;
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name asacoine#fetchMarkets
         * @description retrieves data on all markets for asacoine
         * @see https://api.asacoine.com/api/v1/market/pairs/pricing
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const type = this.safeString(params, 'type', 'spot');
        const request = this.omit(params, ['type']);
        if (type === 'otc') {
            const cumulativeResponse = await this.publicGetV1MarketPairsCumulative(request);
            return this.parseCumulativeMarkets(cumulativeResponse);
        }
        const response = await this.publicGetV1MarketPairsPricing(request);
        return this.parseMarkets(response);
    }
    parseTicker(ticker, market = undefined) {
        const bid = this.safeList(ticker, 'bid', []);
        const ask = this.safeList(ticker, 'ask', []);
        const nestedOrderBook = this.safeDict(ticker, 'orderBook');
        const cumulativeOrderBook = nestedOrderBook === undefined && this.safeString(ticker, 'bestBid') !== undefined ? ticker : nestedOrderBook;
        const orderBook = cumulativeOrderBook === undefined ? {} : cumulativeOrderBook;
        const bidPriceString = cumulativeOrderBook === undefined ? this.safeString(bid, 0) : this.safeString(orderBook, 'bestBid');
        const askPriceString = cumulativeOrderBook === undefined ? this.safeString(ask, 0) : this.safeString(orderBook, 'bestAsk');
        const bidPrice = this.parseNumber(bidPriceString);
        const askPrice = this.parseNumber(askPriceString);
        const bidVolume = cumulativeOrderBook === undefined ? this.safeNumber(bid, 1) : this.safeNumber(orderBook, 'bidSize');
        const askVolume = cumulativeOrderBook === undefined ? this.safeNumber(ask, 1) : this.safeNumber(orderBook, 'askSize');
        let last = undefined;
        if ((bidPriceString !== undefined) && (askPriceString !== undefined)) {
            last = this.parseNumber(Precise["default"].stringDiv(Precise["default"].stringAdd(bidPriceString, askPriceString), '2'));
        }
        return this.safeTicker({
            'symbol': this.safeString(market, 'symbol'),
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': bidPrice,
            'bidVolume': bidVolume,
            'ask': askPrice,
            'askVolume': askVolume,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': last,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name asacoine#fetchTickers
         * @description fetches price tickers for multiple markets
         * @see https://api.asacoine.com/api/v1/market/pairs/pricing
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the tickers for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const type = this.safeString(params, 'type', 'spot');
        const request = this.omit(params, ['type']);
        await this.loadMarkets(false, { 'type': type });
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        let response;
        if (type === 'otc') {
            response = await this.publicGetV1MarketPairsCumulative(request);
        }
        else {
            response = await this.publicGetV1MarketPairsPricing(request);
        }
        if (type === 'otc') {
            const cumulativeData = this.safeDict(response, 'data', {});
            const keys = this.safeList(cumulativeData, 'keys', []);
            const values = this.safeList(cumulativeData, 'values', []);
            const cumulativeTickers = {};
            for (let i = 0; i < values.length; i++) {
                const row = values[i];
                const raw = {};
                for (let j = 0; j < keys.length; j++) {
                    raw[keys[j]] = row[j];
                }
                const name = this.safeString(raw, 'name');
                const [baseId, quoteId] = name.split('-');
                const base = this.safeCurrencyCode(baseId);
                const quote = this.safeCurrencyCode(quoteId);
                const market = this.safeMarket(base + '/' + quote);
                const parsed = this.parseTicker(this.safeDict(raw, 'orderBook', {}), market);
                cumulativeTickers[parsed['symbol']] = parsed;
            }
            return this.filterByArrayTickers(cumulativeTickers, 'symbol', symbols);
        }
        const data = this.safeDict(response, 'data', {});
        const baseIds = Object.keys(data);
        const result = {};
        for (let i = 0; i < baseIds.length; i++) {
            const baseId = baseIds[i];
            const quotes = this.safeDict(data, baseId, {});
            const quoteIds = Object.keys(quotes);
            for (let j = 0; j < quoteIds.length; j++) {
                const quoteId = quoteIds[j];
                const ticker = this.safeDict(quotes, quoteId, {});
                const market = this.safeMarket(baseId + '/' + quoteId);
                const parsed = this.parseTicker(ticker, market);
                result[parsed['symbol']] = parsed;
            }
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name asacoine#fetchTicker
         * @description fetches a price ticker, a statistical calculation for a specific market
         * @see https://api.asacoine.com/api/v1/market/pairs/pricing
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const tickers = await this.fetchTickers([symbol], params);
        return tickers[symbol];
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit(params, this.extractParams(path));
        let url = this.urls['api'][api] + '/' + this.implodeParams(path, params);
        if (Object.keys(query).length) {
            url += '?' + this.urlencode(query);
        }
        headers = {
            'Content-Type': 'application/json',
        };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}

exports["default"] = asacoine;
