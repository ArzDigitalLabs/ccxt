# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxt.async_support.base.exchange import Exchange
from ccxt.abstract.bitimen import ImplicitAPI
from ccxt.base.types import Int, Market, OrderBook, Strings, Ticker, Tickers
from typing import List


class bitimen(Exchange, ImplicitAPI):

    def describe(self):
        return self.deep_extend(super(bitimen, self).describe(), {
            'id': 'bitimen',
            'name': 'Bitimen',
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
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/bitimen/64x64.png',
                'api': {
                    'public': 'https://api.bitimen.com',
                },
                'www': 'https://bitimen.com',
                'doc': [
                    'https://bitimen.com',
                ],
            },
            'timeframes': {
                '1h': '60',
                '3h': '180',
                '6h': '360',
                '12h': '720',
                '1d': '1440',
            },
            'api': {
                'public': {
                    'get': {
                        'api/market/stats': 1,
                        'api/orderbook/depth': 1,
                        'api/kline/history': 1,
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
        retrieves data on all markets for bitimen
        :see: https://bitimen.com
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: an array of objects representing market data
        """
        response = await self.publicGetApiMarketStats(params)
        marketKeys = list(response.keys())
        result = []
        for i in range(0, len(marketKeys)):
            index = marketKeys[i]
            market = await self.parse_market(response[index])
            result.append(market)
        return result

    def parse_market(self, market) -> Market:
        #         BTC_IRT: {
        # identifier: "BTC_IRT",
        # name: "بیت‌کوین / تومان",
        # base_asset_name: "بیت‌کوین",
        # base_asset_ticker: "BTC",
        # base_asset_prec: "8",
        # base_asset_logo: "6c912caf_9517_210428023944.png",
        # quote_asset_name: "تومان",
        # quote_asset_ticker: "IRT",
        # quote_asset_prec: "0",
        # quote_asset_logo: "57caf3ea_7105_201105152450.png",
        # amount_prec: 8,
        # price_prec: 0,
        # min_price: 50,
        # max_price: 50,
        # min_amount: 50000,
        # change: -1.2210559541451,
        # change_display: "-1.22",
        # volume: "33,399,207,748",
        # best_ask: "3,901,117,155",
        # best_bid: "3,899,860,005",
        # best_bid_raw: 3899860005,
        # best_ask_raw: 3901117155,
        # open: "3,948,151,038",
        # close: "3,900,523,464",
        # last: "3,900,523,464",
        # high: "3,961,685,769",
        # low: "3,839,720,912"
        # },
        id = self.safe_string(market, 'identifier')
        baseId = self.safe_string(market, 'base_asset_ticker')
        quoteId = self.safe_string(market, 'quote_asset_ticker')
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
        :see: https://bitimen.com
        :param str[]|None symbols: unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `ticker structures <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        if symbols is not None:
            symbols = self.market_symbols(symbols)
        response = await self.publicGetApiMarketStats(params)
        marketKeys = list(response.keys())
        result = {}
        for i in range(0, len(marketKeys)):
            index = marketKeys[i]
            if response[index]['last'] == '0':
                continue
            ticker = await self.parse_ticker(response[index])
            symbol = ticker['symbol']
            result[symbol] = ticker
        return self.filter_by_array_tickers(result, 'symbol', symbols)

    async def fetch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://bitimen.com
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        response = await self.publicGetApiMarketStats(params)
        ticker = await self.parse_ticker(response[market['id']])
        return ticker

    def parse_ticker(self, ticker, market: Market = None) -> Ticker:
        #         BTC_IRT: {
        # identifier: "BTC_IRT",
        # name: "بیت‌کوین / تومان",
        # base_asset_name: "بیت‌کوین",
        # base_asset_ticker: "BTC",
        # base_asset_prec: "8",
        # base_asset_logo: "6c912caf_9517_210428023944.png",
        # quote_asset_name: "تومان",
        # quote_asset_ticker: "IRT",
        # quote_asset_prec: "0",
        # quote_asset_logo: "57caf3ea_7105_201105152450.png",
        # amount_prec: 8,
        # price_prec: 0,
        # min_price: 50,
        # max_price: 50,
        # min_amount: 50000,
        # change: -1.2210559541451,
        # change_display: "-1.22",
        # volume: "33,399,207,748",
        # best_ask: "3,901,117,155",
        # best_bid: "3,899,860,005",
        # best_bid_raw: 3899860005,
        # best_ask_raw: 3901117155,
        # open: "3,948,151,038",
        # close: "3,900,523,464",
        # last: "3,900,523,464",
        # high: "3,961,685,769",
        # low: "3,839,720,912"
        # },
        ticker['high'] = ticker['high'].replace(',', '')
        ticker['low'] = ticker['low'].replace(',', '')
        ticker['close'] = ticker['close'].replace(',', '')
        ticker['open'] = ticker['open'].replace(',', '')
        ticker['best_bid'] = ticker['best_bid'].replace(',', '')
        ticker['best_ask'] = ticker['best_ask'].replace(',', '')
        ticker['best_ask'] = ticker['best_ask'].replace(',', '')
        ticker['volume'] = ticker['volume'].replace(',', '')
        marketType = 'spot'
        marketId = self.safe_string(ticker, 'identifier')
        symbol = self.safe_symbol(marketId, market, None, marketType)
        high = self.safe_float(ticker, 'high', 0)
        low = self.safe_float(ticker, 'low', 0)
        close = self.safe_float(ticker, 'close', 0)
        open = self.safe_float(ticker, 'open', 0)
        bid = self.safe_float(ticker, 'best_bid', 0)
        ask = self.safe_float(ticker, 'best_ask', 0)
        last = self.safe_float(ticker, 'last', 0)
        change = self.safe_float(ticker, 'change', 0)
        quoteVolume = self.safe_float(ticker, 'volume', 0)
        return self.safe_ticker({
            'symbol': symbol,
            'timestamp': None,
            'datetime': None,
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': None,
            'ask': ask,
            'askVolume': None,
            'vwap': None,
            'open': open,
            'close': close,
            'last': last,
            'previousClose': None,
            'change': change,
            'percentage': None,
            'average': None,
            'baseVolume': None,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market)

    async def fetch_ohlcv(self, symbol: str, timeframe='1h', since: Int = None, limit: Int = None, params={}) -> List[list]:
        """
        fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :see: https://bitimen.com
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
        response = await self.publicGetApiKlineHistory(request)
        ohlcvs = []
        for i in range(0, len(response)):
            ohlcvs.append([
                self.safe_value(response[i], 'time'),
                self.safe_float(response[i], 'open'),
                self.safe_float(response[i], 'high'),
                self.safe_float(response[i], 'low'),
                self.safe_float(response[i], 'close'),
                self.safe_float(response[i], 'volume'),
            ])
        return self.parse_ohlcvs(ohlcvs, market, timeframe, since, limit)

    async def fetch_order_book(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        fetches information on open orders with bid(buy) and ask(sell) prices, volumes and other data for multiple markets
        :see: https://bitimen.com
        :param str[]|None symbols: list of unified market symbols, all symbols fetched if None, default is None
        :param int [limit]: max number of entries per orderbook to return, default is None
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbol
        """
        await self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        response = await self.publicGetApiOrderbookDepth(request)
        timestamp = Date.now()
        return self.parse_order_book(response, symbol, timestamp, 'bids', 'asks')

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        query = self.omit(params, self.extract_params(path))
        url = self.urls['api']['public'] + '/' + path
        if path == 'api/kline/history':
            url = url + '?' + self.urlencode(query)
        if path == 'api/orderbook/depth':
            url = url + '/' + params['symbol']
        headers = {'Content-Type': 'application/json'}
        return {'url': url, 'method': method, 'body': body, 'headers': headers}
