# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxt.base.exchange import Exchange
from ccxt.abstract.sarmayex import ImplicitAPI
from ccxt.base.types import Market, Strings, Ticker, Tickers
from typing import List


class sarmayex(Exchange, ImplicitAPI):

    def describe(self):
        return self.deep_extend(super(sarmayex, self).describe(), {
            'id': 'sarmayex',
            'name': 'Sarmayex',
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
                'fetchOHLCV': False,
                'fetchOpenInterestHistory': False,
                'fetchOpenOrders': False,
                'fetchOrder': False,
                'fetchOrderBook': False,
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
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/sarmayex/64x64.png',
                'api': {
                    'public': 'https://api.sarmayex.com',
                },
                'www': 'https://sarmayex.com',
                'doc': [
                    'https://sarmayex.com',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        'api/v1/public/currencies': 1,
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
        retrieves data on all markets for sarmayex
        :see: https://api.sarmayex.com/api/v1/public/currencies
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: an array of objects representing market data
        """
        response = self.publicGetApiV1PublicCurrencies(params)
        response = self.safe_dict(response, 'data')
        markets = self.safe_list(response, 'currencies')
        result = []
        quotes = ['IRT', 'USDT']
        for i in range(0, len(markets)):
            base = self.safe_string(markets[i], 'symbol')
            for index in range(0, len(quotes)):
                quote = quotes[index]
                markets[i]['base'] = base
                markets[i]['quote'] = quote
                if base == quote:
                    continue
                market = self.parse_market(markets[i])
                result.append(market)
        return result

    def parse_market(self, market) -> Market:
        #   {
        #     'id': 87,
        #     'title': 'تتر',
        #     'title_en': 'Tether',
        #     'symbol': 'USDT',
        #     'sell_price': '58,987',
        #     'sell_price_usd': '1.0000',
        #     'sell_price_wm': '1.062',
        #     'sell_price_pm': '1.085',
        #     'can_sell': 1,
        #     'can_sell_iw': 1,
        #     'can_buy': 1,
        #     'can_buy_iw': 1,
        #     'buy_price': '58,448',
        #     'min_buy': '0.00000000',
        #     'max_buy': '232348196.00000000',
        #     'percent_change_1h': 0.00495761,
        #     'percent_change_24h': 0.0333481,
        #     'percent_change_7d': 0.0540622,
        #     'tick': 4,
        #     'need_tag': 0,
        #     'need_address': 1,
        #     'use_copon': 1,
        #     'updated_at': 1717936143,
        #     'image': '',
        #     'has_content': 1,
        #     'withdraw_nets': [],
        #     'deposit_nets': [],
        #     'sell_request_gateway': 1,
        #     'exist_in_wallet': 1,
        #     'tags': [
        #         {
        #             'id': 3,
        #             'name': 'استیبل کوین',
        #         },
        #         {
        #             'id': 13,
        #             'name': 'قابل پرداخت',
        #         },
        #     ],
        # }
        baseId = self.safe_string(market, 'base')
        quoteId = self.safe_string(market, 'quote')
        base = self.safe_currency_code(baseId)
        quote = self.safe_currency_code(quoteId)
        id = base + quote
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
        :see: https://api.sarmayex.com/api/v1/public/currencies
        :param str[]|None symbols: unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `ticker structures <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        self.load_markets()
        if symbols is not None:
            symbols = self.market_symbols(symbols)
        response = self.publicGetApiV1PublicCurrencies(params)
        response = self.safe_dict(response, 'data')
        markets = self.safe_list(response, 'currencies')
        result = []
        quotes = ['IRT', 'USDT']
        for i in range(0, len(markets)):
            base = self.safe_string(markets[i], 'symbol')
            for index in range(0, len(quotes)):
                quote = quotes[index]
                if base == quote:
                    continue
                markets[i]['base'] = base
                markets[i]['quote'] = quote
                markets[i]['symbol'] = base + quote
                ticker = self.parse_ticker(markets[i])
                symbol = ticker['symbol']
                result[symbol] = ticker
        return self.filter_by_array_tickers(result, 'symbol', symbols)

    def fetch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://api.sarmayex.com/api/v1/public/currencies
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        ticker = self.fetch_tickers([symbol])
        return ticker[symbol]

    def parse_ticker(self, ticker, market: Market = None) -> Ticker:
        #   {
        #     'id': 87,
        #     'title': 'تتر',
        #     'title_en': 'Tether',
        #     'symbol': 'USDT',
        #     'sell_price': '58,987',
        #     'sell_price_usd': '1.0000',
        #     'sell_price_wm': '1.062',
        #     'sell_price_pm': '1.085',
        #     'can_sell': 1,
        #     'can_sell_iw': 1,
        #     'can_buy': 1,
        #     'can_buy_iw': 1,
        #     'buy_price': '58,448',
        #     'min_buy': '0.00000000',
        #     'max_buy': '232348196.00000000',
        #     'percent_change_1h': 0.00495761,
        #     'percent_change_24h': 0.0333481,
        #     'percent_change_7d': 0.0540622,
        #     'tick': 4,
        #     'need_tag': 0,
        #     'need_address': 1,
        #     'use_copon': 1,
        #     'updated_at': 1717936143,
        #     'image': '',
        #     'has_content': 1,
        #     'withdraw_nets': [],
        #     'deposit_nets': [],
        #     'sell_request_gateway': 1,
        #     'exist_in_wallet': 1,
        #     'tags': [
        #         {
        #             'id': 3,
        #             'name': 'استیبل کوین',
        #         },
        #         {
        #             'id': 13,
        #             'name': 'قابل پرداخت',
        #         },
        #     ],
        # }
        marketType = 'otc'
        marketId = self.safe_string(ticker, 'symbol')
        symbol = self.safe_symbol(marketId, market, None, marketType)
        ticker['sell_price'] = ticker['sell_price'].replace(',', '')
        ticker['sell_price_usd'] = ticker['sell_price'].replace(',', '')
        ticker['buy_price'] = ticker['sell_price'].replace(',', '')
        last = self.safe_float(ticker, 'sell_price_usd', 0)
        if ticker['quote'] == 'IRT':
            last = self.safe_float(ticker, 'sell_price', 0)
        change = self.safe_float(ticker, 'percent_change_24h', 0)
        timestamp = self.safe_integer(ticker, 'updated_at')
        return self.safe_ticker({
            'symbol': symbol,
            'timestamp': timestamp * 1000,
            'datetime': self.iso8601(timestamp * 1000),
            'high': None,
            'low': None,
            'bid': None,
            'bidVolume': None,
            'ask': None,
            'askVolume': None,
            'vwap': None,
            'open': None,
            'close': last,
            'last': last,
            'previousClose': None,
            'change': change,
            'percentage': None,
            'average': None,
            'baseVolume': None,
            'quoteVolume': None,
            'info': ticker,
        }, market)

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        url = self.urls['api']['public'] + '/' + path
        headers = {'Content-Type': 'application/json'}
        return {'url': url, 'method': method, 'body': body, 'headers': headers}
