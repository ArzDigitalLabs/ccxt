
//  ---------------------------------------------------------------------------
import Exchange from './abstract/hamtapay.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class hamtapay
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class hamtapay extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'hamtapay',
            'name': 'Hamtapay',
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
                'fetchL3OrderBook': false,
                'fetchLedger': false,
                'fetchLedgerEntry': false,
                'fetchLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': false,
                'fetchOHLCV': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': false,
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
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/hamtapay/64x64.png',
                'api': {
                    'public': 'https://oapi.hamtapay.org',
                },
                'www': 'https://hamtapay.net/',
                'doc': [
                    'https://hamtapay.net/',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        '/financial/api/market': 1,
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

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name hamtapay#fetchMarkets
         * @description retrieves data on all markets for hamtapay
         * @see https://oapi.hamtapay.org/financial/api/market
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetFinancialApiMarket (params);
        const result = [];
        const marketData = this.safeList (response, 'data', []);
        for (let i = 0; i < marketData.length; i++) {
            const market = this.parseMarket (marketData[i]);
            result.push (market);
        }
        return result;
    }

    parseMarket (market): Market {
        // {
        //     "symbol": "USDT-IRT",
        //     "base": "USDT",
        //     "quote": "IRT",
        //     "base_currency_decimals": 3,
        //     "quote_currency_decimals": 0,
        //     "amount_decimals": 0,
        //     "price_decimals": 0
        // }
        const baseId = this.safeString (market, 'base');
        const quoteId = this.safeString (market, 'quote');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const id = this.safeString (market, 'symbol');
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
                'amount': this.safeInteger (market, 'amount_decimals'),
                'price': this.safeInteger (market, 'price_decimals'),
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
         * @name hamtapay#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://oapi.hamtapay.org/financial/api/market
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await this.publicGetFinancialApiMarket (params);
        const data = this.safeList (response, 'data', []);
        const result = {};
        for (let i = 0; i < data.length; i++) {
            const ticker = this.parseTicker (data[i]);
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name hamtapay#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://oapi.hamtapay.org/financial/api/market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const tickers = await this.fetchTickers ([ symbol ], params);
        return tickers[symbol];
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        const marketType = 'spot';
        const marketId = this.safeString2 (ticker, 'id', 'symbol');
        const baseId = this.safeString (ticker, 'base');
        const quoteId = this.safeString (ticker, 'quote');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        let symbol = this.safeSymbol (marketId, market, undefined, marketType);
        if ((baseId !== undefined) && (quoteId !== undefined)) {
            symbol = base + '/' + quote;
        }
        const last = this.safeFloat (ticker, 'last_price');
        const baseVolume = this.safeFloat (ticker, 'volume_24h');
        const percentage = this.safeFloat (ticker, 'percent_change_24h');
        let quoteVolume = undefined;
        if ((baseVolume !== undefined) && (last !== undefined)) {
            quoteVolume = baseVolume * last;
        }
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': percentage,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let normalizedPath = path;
        while (normalizedPath.length && normalizedPath[0] === '/') {
            normalizedPath = normalizedPath.slice (1);
        }
        let url = this.urls['api']['public'] + '/' + this.implodeParams (normalizedPath, params);
        if (Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://hamtapay.net',
        };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
