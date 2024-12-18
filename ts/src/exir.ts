
//  ---------------------------------------------------------------------------

import Exchange from './abstract/exir.js';
import { Int, Market, OHLCV, OrderBook, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class exir
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class exir extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'exir',
            'name': 'Exir',
            'country': [ 'IR' ],
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
                'addMargin': false,
                'cancelAllOrders': false,
                'cancelOrder': false,
                'cancelOrders': false,
                'createDepositAddress': false,
                'createOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'editOrder': false,
                'fetchBalance': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDeposits': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchL2OrderBook': false,
                'fetchLedger': false,
                'fetchLedgerEntry': false,
                'fetchLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': false,
                'fetchOHLCV': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': true,
                'fetchOrders': false,
                'fetchOrderTrades': 'emulated',
                'fetchPositions': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': false,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchWithdrawals': false,
                'setLeverage': false,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'comment': 'This comment is optional',
            'urls': {
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/exir/64x64.png',
                'api': {
                    'public': 'https://api.exir.io',
                },
                'www': 'https://www.exir.io/',
                'doc': [
                    'https://apidocs.exir.io',
                ],
            },
            'timeframes': {
                '15m': '15',
                '1h': '60',
                '4h': '240',
                '1d': '1D',
                '1w': '1W',
            },
            'api': {
                'public': {
                    'get': {
                        'v2/tickers': 1,
                        'v2/ticker': 1,
                        'v2/chart': 1,
                        'v2/orderbook': 1,
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber ('0.001'),
                    'taker': this.parseNumber ('0.001'),
                },
            },
        });
    }

    async fetchMarkets (symbols: Strings = undefined, params = {}): Promise<Market[]> {
        /**
         * @method
         * @name exir#fetchMarkets
         * @description retrieves data on all markets for exir
         * @see https://apidocs.exir.io/#tickers
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetV2Tickers ();
        const marketKeys = Object.keys (response);
        const result = [];
        for (let i = 0; i < marketKeys.length; i++) {
            const symbol = marketKeys[i];
            response[symbol]['symbol'] = symbol;
            const market = await this.parseMarket (response[symbol]);
            result.push (market);
        }
        return result;
    }

    parseMarket (market): Market {
        //        {
        // symbol: btc-usdt
        // isClosed: false,
        // bestSell: "39659550020",
        // bestBuy: "39650000000",
        // volumeSrc: "11.6924501388",
        // volumeDst: "464510376461.05263193275",
        // latest: "39659550020",
        // mark: "39817678220",
        // dayLow: "38539978000",
        // dayHigh: "40809999990",
        // dayOpen: "38553149810",
        // dayClose: "39659550020",
        // dayChange: "2.87"
        // },
        const symbol = this.safeValue (market, 'symbol');
        const id = symbol;
        let [ baseId, quoteId ] = symbol.split ('-');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        baseId = baseId.toLowerCase ();
        quoteId = quoteId.toLowerCase ();
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

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name exir#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://apidocs.exir.io/#tickers
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await this.publicGetV2Tickers ();
        const marketKeys = Object.keys (response);
        const result = [];
        for (let i = 0; i < marketKeys.length; i++) {
            let symbol = marketKeys[i];
            response[symbol]['symbol'] = symbol;
            const ticker = await this.parseTicker (response[symbol]);
            symbol = ticker['symbol'];
            result[symbol] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name exir#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://apidocs.exir.io/#ticker
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetV2Ticker (request);
        response['symbol'] = market['id'];
        response['time'] = response['timestamp'];
        const ticker = await this.parseTicker (response);
        return ticker;
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        //  {
        //     'time': '2024-05-26T08:40:02.305Z',
        //     'open': 26125,
        //     'close': 26298,
        //     'high': 26939,
        //     'low': 25791,
        //     'last': 26298,
        //     'volume': 32167,
        //     'symbol': 'ada-irt',
        // },
        const marketType = 'spot';
        let symbol = this.safeValue (ticker, 'symbol');
        const marketId = symbol;
        symbol = this.safeSymbol (marketId, market, undefined, marketType);
        const high = this.safeFloat (ticker, 'high');
        const low = this.safeFloat (ticker, 'low');
        const bid = this.safeFloat (ticker, 'last');
        const ask = this.safeFloat (ticker, 'last');
        const open = this.safeFloat (ticker, 'open');
        const close = this.safeFloat (ticker, 'close');
        const last = this.safeFloat (ticker, 'last');
        const quoteVolume = this.safeFloat (ticker, 'volume');
        const datetime = this.safeString (ticker, 'time');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': this.parse8601 (datetime),
            'datetime': datetime,
            'high': high,
            'low': low,
            'bid': this.safeFloat (bid, 0),
            'bidVolume': undefined,
            'ask': this.safeFloat (ask, 0),
            'askVolume': undefined,
            'vwap': undefined,
            'open': open,
            'close': close,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }

    async fetchOHLCV (symbol: string, timeframe = '1h', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name exir#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see https://apidocs.exir.io/#chart
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const endTime = Date.now ();
        const request = {
            'symbol': market['id'],
            'from': (endTime / 1000) - (24 * 60 * 60),
            'to': endTime / 1000,
            'resolution': this.safeString (this.timeframes, timeframe, timeframe),
        };
        if (since !== undefined) {
            request['from'] = since / 1000;
        }
        request['from'] = this.safeInteger (request, 'from');
        request['to'] = this.safeInteger (request, 'to');
        if (timeframe !== undefined) {
            request['resolution'] = this.safeString (this.timeframes, timeframe, timeframe);
        }
        const response = await this.publicGetV2Chart (request);
        const ohlcvs = [];
        for (let i = 0; i < response.length; i++) {
            const candle = response[i];
            const ts = Date.parse (candle['time']);
            const open = this.safeFloat (candle, 'open');
            const high = this.safeFloat (candle, 'high');
            const low = this.safeFloat (candle, 'low');
            const close = this.safeFloat (candle, 'close');
            const volume = this.safeFloat (candle, 'volume');
            ohlcvs.push ([
                ts,
                open,
                high,
                low,
                close,
                volume,
            ]);
        }
        return this.parseOHLCVs (ohlcvs, market, timeframe, since, limit);
    }

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        /**
         * @method
         * @name exir#fetchOrderBooks
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data for multiple markets
         * @see https://apidocs.exir.io/#orderbook
         * @param {string[]|undefined} symbols list of unified market symbols, all symbols fetched if undefined, default is undefined
         * @param {int} [limit] max number of entries per orderbook to return, default is undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbol
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetV2Orderbook (request);
        const timestamp = Date.parse (response[market['id']]['timestamp']);
        return this.parseOrderBook (response[market['id']], symbol, timestamp);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let url = this.urls['api']['public'] + '/' + path;
        if (path === 'v2/ticker') {
            url = this.urls['api']['public'] + '/' + path + '?' + this.urlencode (query);
        }
        if (path === 'v2/chart') {
            url = url + '?' + this.urlencode (query);
        }
        if (path === 'v2/orderbook') {
            url = url + '?' + this.urlencode (query);
        }
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
