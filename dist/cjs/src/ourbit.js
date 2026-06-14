'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class ourbit
 * @augments Exchange
 */
class ourbit extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'ourbit',
            'name': 'Ourbit',
            'countries': ['VG'],
            'rateLimit': 100,
            'pro': false,
            'certified': false,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': true,
                'option': false,
                'cancelAllOrders': false,
                'cancelOrder': false,
                'createOrder': false,
                'fetchBalance': false,
                'fetchBidsAsks': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDeposits': false,
                'fetchMarkets': true,
                'fetchMyTrades': false,
                'fetchOHLCV': false,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': false,
                'fetchOrders': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': false,
                'fetchWithdrawals': false,
                'transfer': false,
                'withdraw': false,
            },
            'urls': {
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/ourbit/64x64.png',
                'api': {
                    'spot': 'https://www.ourbit.com',
                    'futures': 'https://futures.ourbit.com',
                },
                'www': 'https://www.ourbit.com',
                'doc': 'https://www.ourbit.com',
            },
            'options': {
                'defaultType': 'spot',
            },
            'api': {
                'spot': {
                    'get': [
                        'api/platform/spot/market/v2/tickers',
                        'api/platform/spot/market/v2/symbol/ticker',
                    ],
                },
                'futures': {
                    'get': [
                        'api/v1/contract/ticker',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber('0.001'),
                    'taker': this.parseNumber('0.001'),
                },
            },
        });
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name ourbit#fetchMarkets
         * @description retrieves data on all available markets for ourbit
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const type = this.safeString(params, 'type');
        params = this.omit(params, ['type']);
        const fetchSpot = (type === undefined) || (type === 'spot');
        const fetchFutures = (type === undefined) || (type === 'future') || (type === 'swap');
        const result = [];
        if (fetchSpot) {
            const response = await this.spotGetApiPlatformSpotMarketV2Tickers(params);
            let markets = response;
            if (!Array.isArray(markets)) {
                markets = this.safeList(response, 'data', []);
            }
            for (let i = 0; i < markets.length; i++) {
                result.push(this.parseSpotMarket(markets[i]));
            }
        }
        if (fetchFutures) {
            const response = await this.futuresGetApiV1ContractTicker(params);
            const markets = this.safeList(response, 'data', []);
            for (let i = 0; i < markets.length; i++) {
                result.push(this.parseFutureMarket(markets[i]));
            }
        }
        return result;
    }
    parseSpotMarket(market) {
        const marketId = this.safeString(market, 'sb');
        let parts = [];
        if (marketId !== undefined) {
            parts = marketId.split('_');
        }
        const baseId = this.safeString(parts, 0);
        const quoteId = this.safeString(parts, 1);
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        return {
            'id': marketId,
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
            'info': market,
        };
    }
    parseFutureMarket(market) {
        const marketId = this.safeString(market, 'symbol');
        let parts = [];
        if (marketId !== undefined) {
            parts = marketId.split('_');
        }
        const baseId = this.safeString(parts, 0);
        const quoteId = this.safeString(parts, 1);
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        const settle = quote;
        return {
            'id': marketId,
            'symbol': base + '/' + quote + ':' + settle,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': quoteId,
            'type': 'future',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': true,
            'option': false,
            'active': true,
            'contract': true,
            'linear': true,
            'inverse': false,
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
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name ourbit#fetchTickers
         * @description fetches price tickers for multiple markets
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const type = this.safeString(params, 'type');
        params = this.omit(params, ['type']);
        const result = {};
        const fetchSpot = (type === undefined) || (type === 'spot');
        const fetchFutures = (type === undefined) || (type === 'future') || (type === 'swap');
        if (fetchSpot) {
            const response = await this.spotGetApiPlatformSpotMarketV2Tickers(params);
            let tickers = response;
            if (!Array.isArray(tickers)) {
                tickers = this.safeList(response, 'data', []);
            }
            for (let i = 0; i < tickers.length; i++) {
                const ticker = tickers[i];
                const parsed = this.parseTicker(ticker, undefined, 'spot');
                result[parsed['symbol']] = parsed;
            }
        }
        if (fetchFutures) {
            const response = await this.futuresGetApiV1ContractTicker(params);
            const tickers = this.safeList(response, 'data', []);
            for (let i = 0; i < tickers.length; i++) {
                const ticker = tickers[i];
                const parsed = this.parseTicker(ticker, undefined, 'future');
                result[parsed['symbol']] = parsed;
            }
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name ourbit#fetchTicker
         * @description fetches a price ticker for a single market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const marketType = this.safeString(params, 'type', this.safeString(market, 'type'));
        params = this.omit(params, ['type']);
        const request = {
            'symbol': market['id'],
        };
        if ((marketType === 'future') || (marketType === 'swap')) {
            const responseData = await this.futuresGetApiV1ContractTicker(this.extend(request, params));
            const tickerList = this.safeDict(responseData, 'data', responseData);
            tickerList['timestamp'] = this.safeString(responseData, 'timestamp');
            return this.parseTicker(tickerList, market, 'future');
        }
        const response = await this.spotGetApiPlatformSpotMarketV2SymbolTicker(this.extend(request, params));
        const ticker = this.safeDict(response, 'data', response);
        ticker['timestamp'] = this.safeString(response, 'timestamp');
        return this.parseTicker(ticker, market, 'spot');
    }
    parseTicker(ticker, market = undefined, marketType = undefined) {
        const isFuture = (marketType === 'future') || (marketType === 'swap') || (market === undefined && this.safeString(ticker, 'contractId') !== undefined);
        const marketId = this.safeString2(ticker, 'sb', 'symbol');
        const timestamp = this.safeInteger2(ticker, 'timestamp', 'ts');
        const last = this.safeNumber2(ticker, 'c', 'lastPrice');
        const high = this.safeNumber2(ticker, 'h', 'high24Price');
        const low = this.safeNumber2(ticker, 'l', 'lower24Price');
        let open = this.safeNumber(ticker, 'o');
        let change = this.safeNumber(ticker, 'riseFallValue');
        let percentage = this.safeNumber2(ticker, 'r8', 'riseFallRate');
        const bid = this.safeNumber2(ticker, 'bid1', 'bid1Price');
        const ask = this.safeNumber2(ticker, 'ask1', 'ask1Price');
        const bidVolume = this.safeNumber2(ticker, 'bid1Size', 'bidSz');
        const askVolume = this.safeNumber2(ticker, 'ask1Size', 'askSz');
        const baseVolume = this.safeNumber2(ticker, 'q', 'volume24');
        const quoteVolume = this.safeNumber2(ticker, 'a', 'amount24');
        const indexPrice = this.safeNumber(ticker, 'indexPrice');
        const markPrice = this.safeNumber2(ticker, 'fairPrice', 'markPrice');
        if (percentage !== undefined) {
            percentage *= 100;
        }
        if (isFuture) {
            if ((open === undefined) && (last !== undefined) && (change !== undefined)) {
                open = last - change;
            }
        }
        else {
            if ((change === undefined) && (open !== undefined) && (last !== undefined)) {
                change = last - open;
            }
        }
        if (market === undefined) {
            let parts = [];
            if (marketId !== undefined) {
                parts = marketId.split('_');
            }
            const base = this.safeCurrencyCode(this.safeString(parts, 0));
            const quote = this.safeCurrencyCode(this.safeString(parts, 1));
            const quoteId = this.safeString(parts, 1);
            let settle = undefined;
            let symbol = base + '/' + quote;
            let inferredMarketType = 'spot';
            if (isFuture) {
                settle = quote;
                symbol = base + '/' + quote + ':' + settle;
                inferredMarketType = 'future';
            }
            market = this.safeMarketStructure({
                'id': marketId,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': this.safeString(parts, 0),
                'quoteId': quoteId,
                'settleId': quoteId,
                'type': inferredMarketType,
                'spot': !isFuture,
                'margin': false,
                'swap': false,
                'future': isFuture,
                'option': false,
                'active': true,
                'contract': isFuture,
                'linear': isFuture,
                'inverse': false,
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
                'info': ticker,
            });
        }
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': bidVolume,
            'ask': ask,
            'askVolume': askVolume,
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': change,
            'percentage': percentage,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'markPrice': markPrice,
            'indexPrice': indexPrice,
            'info': ticker,
        }, market);
    }
    sign(path, api = 'spot', method = 'GET', params = {}, headers = undefined, body = undefined) {
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

exports["default"] = ourbit;
