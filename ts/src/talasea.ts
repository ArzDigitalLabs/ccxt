//  ---------------------------------------------------------------------------

import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class talasea
 * @augments Exchange
 */
export default class talasea extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'talasea',
            'name': 'Talasea',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': 'api',
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': false,
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
                'otc': true,
                'setLeverage': false,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'options': {
                'defaultType': 'otc',
            },
            'urls': {
                'api': {
                    'public': 'https://api.talasea.ir/api',
                },
                'www': 'https://talasea.ir',
                'doc': 'https://talasea.ir',
            },
            'api': {
                'public': {
                    'get': {
                        'market/getGoldPrice': 1,
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber ('0.01'),
                    'taker': this.parseNumber ('0.01'),
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name talasea#fetchMarkets
         * @description retrieves the available market from talasea
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await (this as any).publicGetMarketGetGoldPrice (params);
        const market = this.parseMarket (response);
        const result = [ market ];
        return result;
    }

    parseMarket (market): Market {
        const disableBuy = this.safeBool (market, 'disableBuy', false);
        const disableSell = this.safeBool (market, 'disableSell', false);
        let active = true;
        if (disableBuy || disableSell) {
            active = false;
        }
        const result: Market = {
            'id': 'XAU18IRT',
            'symbol': 'XAU18/IRT',
            'base': 'XAU18',
            'quote': 'IRT',
            'settle': undefined,
            'baseId': 'XAU18',
            'quoteId': 'IRT',
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': active,
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
                    'min': this.safeNumber (market, 'minOrderValue'),
                    'max': this.safeNumber (market, 'maxOrderValue'),
                },
            },
            'created': undefined,
            'info': market,
        };
        return result;
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name talasea#fetchTicker
         * @description fetches a price ticker, a statistical calculation for a specific market
         * @see https://api.talasea.ir/api/market/getGoldPrice
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await (this as any).publicGetMarketGetGoldPrice (params);
        const ticker = this.parseTicker (response, market);
        return ticker;
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name talasea#fetchTickers
         * @description fetches price tickers for all markets
         * @see https://api.talasea.ir/api/market/getGoldPrice
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the tickers for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await (this as any).publicGetMarketGetGoldPrice (params);
        const market = this.market ('XAU18/IRT');
        const ticker = this.parseTicker (response, market);
        const result = {};
        result[ticker['symbol']] = ticker;
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        const result = this.safeTicker ({
            'symbol': market['symbol'],
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
            'close': this.safeNumber (ticker, 'price') * 1000,
            'last': this.safeNumber (ticker, 'price') * 1000,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeNumber (ticker, 'change24h'),
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
        return result;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let url = this.urls['api'][api] + '/' + this.implodeParams (path, params);
        if (Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = {
            'Content-Type': 'application/json',
        };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
