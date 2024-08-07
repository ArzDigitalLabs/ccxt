# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxt.async_support.base.exchange import Exchange
from ccxt.abstract.tabdeal import ImplicitAPI
from ccxt.base.types import Int, Market, OrderBook, Strings, Ticker, Tickers
from typing import List


class tabdeal(Exchange, ImplicitAPI):

    def describe(self):
        return self.deep_extend(super(tabdeal, self).describe(), {
            'id': 'tabdeal',
            'name': 'Tabdeal',
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
                'fetchL3OrderBook': False,
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
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/tabdeal/64x64.png',
                'api': {
                    'public': 'https://api.tabdeal.org',
                },
                'www': 'https://tabdeal.org',
                'doc': [
                    'https://docs.tabdeal.org',
                ],
            },
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '3h': '180',
                '4h': '240',
                '6h': '360',
                '8h': '480',
                '12h': '720',
                '1d': '1D',
                '1w': '1W',
            },
            'api': {
                'public': {
                    'get': {
                        'plots/market_information': 1,
                        'r/api/v1/depth': 1,
                        'r/plots/history/': 1,
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

    async def fetch_markets(self, symbols: Strings = None, params={}) -> List[Market]:
        """
        retrieves data on all markets for tabdeal
        :see: https://docs.tabdeal.org/#e626e3bd10
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: an array of objects representing market data
        """
        response = await self.publicGetPlotsMarketInformation(params)
        result = []
        for i in range(0, len(response)):
            market = await self.parse_market(response[i])
            result.append(market)
        return result

    def parse_market(self, market) -> Market:
        #         {
        # symbol: "BTC_IRT",
        # high: "4078258820",
        # low: "3923023941",
        # open: "3953000000",
        # volume: "0.52082058",
        # price: "4019250592",
        # created: "2021-08-09 12:37:18.731779+00:00",
        # name: "Bitcoin Toman",
        # name_fa: "بیت کوین تومان",
        # leverage: "5.00000000"
        #      },
        id = self.safe_string(market, 'symbol')
        baseId, quoteId = id.split('_')
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

    async def fetch_tickers(self, symbols: Strings = None, params={}) -> Tickers:
        """
        fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
        :see: https://docs.tabdeal.org/#e626e3bd10
        :param str[]|None symbols: unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `ticker structures <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        if symbols is not None:
            symbols = self.market_symbols(symbols)
        response = await self.publicGetPlotsMarketInformation(params)
        result = []
        for i in range(0, len(response)):
            market = await self.parse_ticker(response[i])
            symbol = market['symbol']
            result[symbol] = market
        return self.filter_by_array_tickers(result, 'symbol', symbols)

    async def fetch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://docs.tabdeal.org/#e626e3bd10
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        ticker = await self.fetch_tickers([symbol])
        return ticker[symbol]

    def parse_ticker(self, ticker, market: Market = None) -> Ticker:
        #         {
        # symbol: "BTC_IRT",
        # high: "4078258820",
        # low: "3923023941",
        # open: "3953000000",
        # volume: "0.52082058",
        # price: "4019250592",
        # created: "2021-08-09 12:37:18.731779+00:00",
        # name: "Bitcoin Toman",
        # name_fa: "بیت کوین تومان",
        # leverage: "5.00000000"
        #      },
        marketType = 'spot'
        marketId = self.safe_string(ticker, 'symbol')
        symbol = self.safe_symbol(marketId, market, None, marketType)
        high = self.safe_float(ticker, 'high', 0)
        low = self.safe_float(ticker, 'low', 0)
        open = self.safe_float(ticker, 'open', 0)
        bid = self.safe_float(ticker, 'price', 0)
        ask = self.safe_float(ticker, 'price', 0)
        last = self.safe_float(ticker, 'price', 0)
        baseVolume = self.safe_float(ticker, 'volume', 0)
        datetime = self.safe_string(ticker, 'created')
        return self.safe_ticker({
            'symbol': symbol,
            'timestamp': Date.parse(datetime),
            'datetime': datetime,
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': None,
            'ask': ask,
            'askVolume': None,
            'vwap': None,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': None,
            'change': None,
            'percentage': None,
            'average': None,
            'baseVolume': baseVolume,
            'quoteVolume': None,
            'info': ticker,
        }, market)

    async def fetch_ohlcv(self, symbol: str, timeframe='1m', since: Int = None, limit: Int = None, params={}) -> List[list]:
        """
        fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :see: https://docs.tabdeal.org/
        :param str symbol: unified symbol of the market to fetch OHLCV data for
        :param str timeframe: the length of time each candle represents
        :param int [since]: timestamp in ms of the earliest candle to fetch
        :param int [limit]: the maximum amount of candles to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns int[][]: A list of candles ordered, open, high, low, close, volume
        """
        await self.load_markets()
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
        response = await self.publicGetRPlotsHistory(request)
        ohlcvList = self.safe_list(response, 'data')
        ohlcvs = []
        for i in range(0, len(ohlcvList)):
            candle = ohlcvList[i]
            ts = self.safe_value(candle, 'time')
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

    async def fetch_order_book(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        fetches information on open orders with bid(buy) and ask(sell) prices, volumes and other data for multiple markets
        :see: https://docs.tabdeal.org/#89d8266ab8
        :param str[]|None symbols: list of unified market symbols, all symbols fetched if None, default is None
        :param int [limit]: max number of entries per orderbook to return, default is None
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbol
        """
        await self.load_markets()
        market = self.market(symbol)
        request = {
            'tabdealSymbol': market['id'],
        }
        response = await self.publicGetRApiV1Depth(request)
        timestamp = Date.now()
        return self.parse_order_book(response, symbol, timestamp)

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        query = self.omit(params, self.extract_params(path))
        url = self.urls['api']['public'] + '/' + path
        if path == 'r/plots/history/':
            url = url + '?' + self.urlencode(query)
        if path == 'r/api/v1/depth':
            url = url + '?' + self.urlencode(query)
        headers = {'Content-Type': 'application/json'}
        return {'url': url, 'method': method, 'body': body, 'headers': headers}
