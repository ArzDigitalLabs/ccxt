# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxt.base.exchange import Exchange
from ccxt.abstract.exir import ImplicitAPI
from ccxt.base.types import Int, Market, OrderBook, Strings, Ticker, Tickers
from typing import List


class exir(Exchange, ImplicitAPI):

    def describe(self):
        return self.deep_extend(super(exir, self).describe(), {
            'id': 'exir',
            'name': 'Exir',
            'country': ['IR'],
            'rateLimit': 1000,
            'version': '1',
            'certified': False,
            'pro': False,
            'has': {
                'CORS': None,
                'spot': True,
                'margin': False,
                'swap': False,
                'future': False,
                'option': False,
                'addMargin': False,
                'cancelAllOrders': False,
                'cancelOrder': False,
                'cancelOrders': False,
                'createDepositAddress': False,
                'createOrder': False,
                'createStopLimitOrder': False,
                'createStopMarketOrder': False,
                'createStopOrder': False,
                'editOrder': False,
                'fetchBalance': False,
                'fetchBorrowInterest': False,
                'fetchBorrowRateHistories': False,
                'fetchBorrowRateHistory': False,
                'fetchClosedOrders': False,
                'fetchCrossBorrowRate': False,
                'fetchCrossBorrowRates': False,
                'fetchCurrencies': False,
                'fetchDepositAddress': False,
                'fetchDeposits': False,
                'fetchFundingHistory': False,
                'fetchFundingRate': False,
                'fetchFundingRateHistory': False,
                'fetchFundingRates': False,
                'fetchIndexOHLCV': False,
                'fetchIsolatedBorrowRate': False,
                'fetchIsolatedBorrowRates': False,
                'fetchL2OrderBook': False,
                'fetchLedger': False,
                'fetchLedgerEntry': False,
                'fetchLeverageTiers': False,
                'fetchMarkets': True,
                'fetchMarkOHLCV': False,
                'fetchMyTrades': False,
                'fetchOHLCV': True,
                'fetchOpenInterestHistory': False,
                'fetchOpenOrders': False,
                'fetchOrder': False,
                'fetchOrderBook': True,
                'fetchOrders': False,
                'fetchOrderTrades': 'emulated',
                'fetchPositions': False,
                'fetchPremiumIndexOHLCV': False,
                'fetchTicker': True,
                'fetchTickers': True,
                'fetchTime': False,
                'fetchTrades': False,
                'fetchTradingFee': False,
                'fetchTradingFees': False,
                'fetchWithdrawals': False,
                'setLeverage': False,
                'setMarginMode': False,
                'transfer': False,
                'withdraw': False,
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
                    'tierBased': False,
                    'percentage': True,
                    'maker': self.parse_number('0.001'),
                    'taker': self.parse_number('0.001'),
                },
            },
        })

    def fetch_markets(self, symbols: Strings = None, params={}) -> List[Market]:
        """
        retrieves data on all markets for exir
        :see: https://apidocs.exir.io/#tickers
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: an array of objects representing market data
        """
        response = self.publicGetV2Tickers()
        marketKeys = list(response.keys())
        result = []
        for i in range(0, len(marketKeys)):
            symbol = marketKeys[i]
            response[symbol]['symbol'] = symbol
            market = self.parse_market(response[symbol])
            result.append(market)
        return result

    def parse_market(self, market) -> Market:
        #        {
        # symbol: btc-usdt
        # isClosed: False,
        # bestSell: "39659550020",
        # bestBuy: "39650000000",
        # volumeSrc: "11.6924501388",
        # volumeDst: "464510376461.05263193275",
        # latest: "39659550020",
        # mark: "39817678220",
        # dayLow: "38539978000",
        # dayHigh: "40809999990",
        # dayOpen: "38553149810",
        # dayClose: "39659550020",
        # dayChange: "2.87"
        # },
        symbol = self.safe_value(market, 'symbol')
        id = symbol
        baseId, quoteId = symbol.split('-')
        base = self.safe_currency_code(baseId)
        quote = self.safe_currency_code(quoteId)
        baseId = baseId.lower()
        quoteId = quoteId.lower()
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': None,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': None,
            'type': 'spot',
            'spot': True,
            'margin': False,
            'swap': False,
            'future': False,
            'option': False,
            'active': True,
            'contract': False,
            'linear': None,
            'inverse': None,
            'contractSize': None,
            'expiry': None,
            'expiryDatetime': None,
            'strike': None,
            'optionType': None,
            'precision': {
                'amount': None,
                'price': None,
            },
            'limits': {
                'leverage': {
                    'min': None,
                    'max': None,
                },
                'amount': {
                    'min': None,
                    'max': None,
                },
                'price': {
                    'min': None,
                    'max': None,
                },
                'cost': {
                    'min': None,
                    'max': None,
                },
            },
            'created': None,
            'info': market,
        }

    def fetch_tickers(self, symbols: Strings = None, params={}) -> Tickers:
        """
        fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
        :see: https://apidocs.exir.io/#tickers
        :param str[]|None symbols: unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `ticker structures <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        self.load_markets()
        if symbols is not None:
            symbols = self.market_symbols(symbols)
        response = self.publicGetV2Tickers()
        marketKeys = list(response.keys())
        result = []
        for i in range(0, len(marketKeys)):
            symbol = marketKeys[i]
            response[symbol]['symbol'] = symbol
            ticker = self.parse_ticker(response[symbol])
            symbol = ticker['symbol']
            result[symbol] = ticker
        return self.filter_by_array_tickers(result, 'symbol', symbols)

    def fetch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://apidocs.exir.io/#ticker
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        response = self.publicGetV2Ticker(request)
        response['symbol'] = market['id']
        response['time'] = response['timestamp']
        ticker = self.parse_ticker(response)
        return ticker

    def parse_ticker(self, ticker, market: Market = None) -> Ticker:
        #  {
        #     'time': '2024-05-26T08:40:02.305Z',
        #     'open': 26125,
        #     'close': 26298,
        #     'high': 26939,
        #     'low': 25791,
        #     'last': 26298,
        #     'volume': 32167,
        #     'symbol': 'ada-irt',
        # },
        marketType = 'spot'
        symbol = self.safe_value(ticker, 'symbol')
        marketId = symbol
        symbol = self.safe_symbol(marketId, market, None, marketType)
        high = self.safe_float(ticker, 'high')
        low = self.safe_float(ticker, 'low')
        bid = self.safe_float(ticker, 'last')
        ask = self.safe_float(ticker, 'last')
        open = self.safe_float(ticker, 'open')
        close = self.safe_float(ticker, 'close')
        last = self.safe_float(ticker, 'last')
        quoteVolume = self.safe_float(ticker, 'volume')
        datetime = self.safe_string(ticker, 'time')
        return self.safe_ticker({
            'symbol': symbol,
            'timestamp': self.parse8601(datetime),
            'datetime': datetime,
            'high': high,
            'low': low,
            'bid': self.safe_float(bid, 0),
            'bidVolume': None,
            'ask': self.safe_float(ask, 0),
            'askVolume': None,
            'vwap': None,
            'open': open,
            'close': close,
            'last': last,
            'previousClose': None,
            'change': None,
            'percentage': None,
            'average': None,
            'baseVolume': None,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market)

    def fetch_ohlcv(self, symbol: str, timeframe='1h', since: Int = None, limit: Int = None, params={}) -> List[list]:
        """
        fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :see: https://apidocs.exir.io/#chart
        :param str symbol: unified symbol of the market to fetch OHLCV data for
        :param str timeframe: the length of time each candle represents
        :param int [since]: timestamp in ms of the earliest candle to fetch
        :param int [limit]: the maximum amount of candles to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns int[][]: A list of candles ordered, open, high, low, close, volume
        """
        self.load_markets()
        market = self.market(symbol)
        endTime = Date.now()
        request = {
            'symbol': market['id'],
            'from': (endTime / 1000) - (24 * 60 * 60),
            'to': endTime / 1000,
            'resolution': self.safe_string(self.timeframes, timeframe, timeframe),
        }
        if since is not None:
            request['from'] = since / 1000
        request['from'] = self.safe_integer(request, 'from')
        request['to'] = self.safe_integer(request, 'to')
        if timeframe is not None:
            request['resolution'] = self.safe_string(self.timeframes, timeframe, timeframe)
        response = self.publicGetV2Chart(request)
        ohlcvs = []
        for i in range(0, len(response)):
            candle = response[i]
            ts = Date.parse(candle['time'])
            open = self.safe_float(candle, 'open')
            high = self.safe_float(candle, 'high')
            low = self.safe_float(candle, 'low')
            close = self.safe_float(candle, 'close')
            volume = self.safe_float(candle, 'volume')
            ohlcvs.append([
                ts,
                open,
                high,
                low,
                close,
                volume,
            ])
        return self.parse_ohlcvs(ohlcvs, market, timeframe, since, limit)

    def fetch_order_book(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        fetches information on open orders with bid(buy) and ask(sell) prices, volumes and other data for multiple markets
        :see: https://apidocs.exir.io/#orderbook
        :param str[]|None symbols: list of unified market symbols, all symbols fetched if None, default is None
        :param int [limit]: max number of entries per orderbook to return, default is None
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbol
        """
        self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        response = self.publicGetV2Orderbook(request)
        timestamp = Date.parse(response[market['id']]['timestamp'])
        return self.parse_order_book(response[market['id']], symbol, timestamp)

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        query = self.omit(params, self.extract_params(path))
        url = self.urls['api']['public'] + '/' + path
        if path == 'v2/ticker':
            url = self.urls['api']['public'] + '/' + path + '?' + self.urlencode(query)
        if path == 'v2/chart':
            url = url + '?' + self.urlencode(query)
        if path == 'v2/orderbook':
            url = url + '?' + self.urlencode(query)
        headers = {'Content-Type': 'application/json'}
        return {'url': url, 'method': method, 'body': body, 'headers': headers}
