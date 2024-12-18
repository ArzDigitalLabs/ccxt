<?php

namespace ccxt\async;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\async\abstract\bitimen as Exchange;
use React\Async;
use React\Promise\PromiseInterface;

class bitimen extends Exchange {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'id' => 'bitimen',
            'name' => 'Bitimen',
            'country' => array( 'IR' ),
            'rateLimit' => 1000,
            'version' => '1',
            'certified' => false,
            'pro' => false,
            'has' => array(
                'CORS' => null,
                'spot' => true,
                'margin' => false,
                'swap' => false,
                'future' => false,
                'option' => false,
                'addMargin' => false,
                'cancelAllOrders' => false,
                'cancelOrder' => false,
                'cancelOrders' => false,
                'createDepositAddress' => false,
                'createOrder' => false,
                'createStopLimitOrder' => false,
                'createStopMarketOrder' => false,
                'createStopOrder' => false,
                'editOrder' => false,
                'fetchBalance' => false,
                'fetchBorrowInterest' => false,
                'fetchBorrowRateHistories' => false,
                'fetchBorrowRateHistory' => false,
                'fetchClosedOrders' => false,
                'fetchCrossBorrowRate' => false,
                'fetchCrossBorrowRates' => false,
                'fetchCurrencies' => false,
                'fetchDepositAddress' => false,
                'fetchDeposits' => false,
                'fetchFundingHistory' => false,
                'fetchFundingRate' => false,
                'fetchFundingRateHistory' => false,
                'fetchFundingRates' => false,
                'fetchIndexOHLCV' => false,
                'fetchIsolatedBorrowRate' => false,
                'fetchIsolatedBorrowRates' => false,
                'fetchL2OrderBook' => false,
                'fetchL3OrderBook' => false,
                'fetchLedger' => false,
                'fetchLedgerEntry' => false,
                'fetchLeverageTiers' => false,
                'fetchMarkets' => true,
                'fetchMarkOHLCV' => false,
                'fetchMyTrades' => false,
                'fetchOHLCV' => true,
                'fetchOpenInterestHistory' => false,
                'fetchOpenOrders' => false,
                'fetchOrder' => false,
                'fetchOrderBook' => true,
                'fetchOrders' => false,
                'fetchOrderTrades' => 'emulated',
                'fetchPositions' => false,
                'fetchPremiumIndexOHLCV' => false,
                'fetchTicker' => true,
                'fetchTickers' => true,
                'fetchTime' => false,
                'fetchTrades' => false,
                'fetchTradingFee' => false,
                'fetchTradingFees' => false,
                'fetchWithdrawals' => false,
                'setLeverage' => false,
                'setMarginMode' => false,
                'transfer' => false,
                'withdraw' => false,
            ),
            'comment' => 'This comment is optional',
            'urls' => array(
                'logo' => 'https://cdn.arz.digital/cr-odin/img/exchanges/bitimen/64x64.png',
                'api' => array(
                    'public' => 'https://api.bitimen.com',
                ),
                'www' => 'https://bitimen.com',
                'doc' => array(
                    'https://bitimen.com',
                ),
            ),
            'timeframes' => array(
                '1h' => '60',
                '3h' => '180',
                '6h' => '360',
                '12h' => '720',
                '1d' => '1440',
            ),
            'api' => array(
                'public' => array(
                    'get' => array(
                        'api/market/stats' => 1,
                        'api/orderbook/depth' => 1,
                        'api/kline/history' => 1,
                    ),
                ),
            ),
            'fees' => array(
                'trading' => array(
                    'tierBased' => false,
                    'percentage' => true,
                    'maker' => $this->parse_number('0.001'),
                    'taker' => $this->parse_number('0.001'),
                ),
            ),
        ));
    }

    public function fetch_markets(?array $symbols = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbols, $params) {
            /**
             * retrieves data on all markets for bitimen
             * @see https://bitimen.com
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array[]} an array of objects representing $market data
             */
            $response = Async\await($this->publicGetApiMarketStats ($params));
            $marketKeys = is_array($response) ? array_keys($response) : array();
            $result = array();
            for ($i = 0; $i < count($marketKeys); $i++) {
                $index = $marketKeys[$i];
                $market = Async\await($this->parse_market($response[$index]));
                $result[] = $market;
            }
            return $result;
        }) ();
    }

    public function parse_market($market): array {
        //         BTC_IRT => array(
        // identifier => "BTC_IRT",
        // name => "بیت‌کوین / تومان",
        // base_asset_name => "بیت‌کوین",
        // base_asset_ticker => "BTC",
        // base_asset_prec => "8",
        // base_asset_logo => "6c912caf_9517_210428023944.png",
        // quote_asset_name => "تومان",
        // quote_asset_ticker => "IRT",
        // quote_asset_prec => "0",
        // quote_asset_logo => "57caf3ea_7105_201105152450.png",
        // amount_prec => 8,
        // price_prec => 0,
        // min_price => 50,
        // max_price => 50,
        // min_amount => 50000,
        // change => -1.2210559541451,
        // change_display => "-1.22",
        // volume => "33,399,207,748",
        // best_ask => "3,901,117,155",
        // best_bid => "3,899,860,005",
        // best_bid_raw => 3899860005,
        // best_ask_raw => 3901117155,
        // open => "3,948,151,038",
        // close => "3,900,523,464",
        // last => "3,900,523,464",
        // high => "3,961,685,769",
        // low => "3,839,720,912"
        // ),
        $id = $this->safe_string($market, 'identifier');
        $baseId = $this->safe_string($market, 'base_asset_ticker');
        $quoteId = $this->safe_string($market, 'quote_asset_ticker');
        $base = $this->safe_currency_code($baseId);
        $quote = $this->safe_currency_code($quoteId);
        $baseId = strtolower($baseId);
        $quoteId = strtolower($quoteId);
        return array(
            'id' => $id,
            'symbol' => $base . '/' . $quote,
            'base' => $base,
            'quote' => $quote,
            'settle' => null,
            'baseId' => $baseId,
            'quoteId' => $quoteId,
            'settleId' => null,
            'type' => 'spot',
            'spot' => true,
            'margin' => false,
            'swap' => false,
            'future' => false,
            'option' => false,
            'active' => true,
            'contract' => false,
            'linear' => null,
            'inverse' => null,
            'contractSize' => null,
            'expiry' => null,
            'expiryDatetime' => null,
            'strike' => null,
            'optionType' => null,
            'precision' => array(
                'amount' => null,
                'price' => null,
            ),
            'limits' => array(
                'leverage' => array(
                    'min' => null,
                    'max' => null,
                ),
                'amount' => array(
                    'min' => null,
                    'max' => null,
                ),
                'price' => array(
                    'min' => null,
                    'max' => null,
                ),
                'cost' => array(
                    'min' => null,
                    'max' => null,
                ),
            ),
            'created' => null,
            'info' => $market,
        );
    }

    public function fetch_tickers(?array $symbols = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbols, $params) {
            /**
             * fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
             * @see https://bitimen.com
             * @param {string[]|null} $symbols unified $symbols of the markets to fetch the $ticker for, all market tickers are returned if not assigned
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a dictionary of ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structures~
             */
            Async\await($this->load_markets());
            if ($symbols !== null) {
                $symbols = $this->market_symbols($symbols);
            }
            $response = Async\await($this->publicGetApiMarketStats ($params));
            $marketKeys = is_array($response) ? array_keys($response) : array();
            $result = array();
            for ($i = 0; $i < count($marketKeys); $i++) {
                $index = $marketKeys[$i];
                if ($response[$index]['last'] === '0') {
                    continue;
                }
                $ticker = Async\await($this->parse_ticker($response[$index]));
                $symbol = $ticker['symbol'];
                $result[$symbol] = $ticker;
            }
            return $this->filter_by_array_tickers($result, 'symbol', $symbols);
        }) ();
    }

    public function fetch_ticker(string $symbol, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $params) {
            /**
             * fetches a price $ticker, a statistical calculation with the information calculated over the past 24 hours for a specific $market
             * @see https://bitimen.com
             * @param {string} $symbol unified $symbol of the $market to fetch the $ticker for
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structure~
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $response = Async\await($this->publicGetApiMarketStats ($params));
            $ticker = Async\await($this->parse_ticker($response[$market['id']]));
            return $ticker;
        }) ();
    }

    public function parse_ticker($ticker, ?array $market = null): array {
        //         BTC_IRT => array(
        // identifier => "BTC_IRT",
        // name => "بیت‌کوین / تومان",
        // base_asset_name => "بیت‌کوین",
        // base_asset_ticker => "BTC",
        // base_asset_prec => "8",
        // base_asset_logo => "6c912caf_9517_210428023944.png",
        // quote_asset_name => "تومان",
        // quote_asset_ticker => "IRT",
        // quote_asset_prec => "0",
        // quote_asset_logo => "57caf3ea_7105_201105152450.png",
        // amount_prec => 8,
        // price_prec => 0,
        // min_price => 50,
        // max_price => 50,
        // min_amount => 50000,
        // $change => -1.2210559541451,
        // change_display => "-1.22",
        // volume => "33,399,207,748",
        // best_ask => "3,901,117,155",
        // best_bid => "3,899,860,005",
        // best_bid_raw => 3899860005,
        // best_ask_raw => 3901117155,
        // $open => "3,948,151,038",
        // $close => "3,900,523,464",
        // $last => "3,900,523,464",
        // $high => "3,961,685,769",
        // $low => "3,839,720,912"
        // ),
        $ticker['high'] = str_replace(',', '', $ticker['high']);
        $ticker['low'] = str_replace(',', '', $ticker['low']);
        $ticker['close'] = str_replace(',', '', $ticker['close']);
        $ticker['open'] = str_replace(',', '', $ticker['open']);
        $ticker['best_bid'] = str_replace(',', '', $ticker['best_bid']);
        $ticker['best_ask'] = str_replace(',', '', $ticker['best_ask']);
        $ticker['best_ask'] = str_replace(',', '', $ticker['best_ask']);
        $ticker['volume'] = str_replace(',', '', $ticker['volume']);
        $marketType = 'spot';
        $marketId = $this->safe_string($ticker, 'identifier');
        $symbol = $this->safe_symbol($marketId, $market, null, $marketType);
        $high = $this->safe_float($ticker, 'high', 0);
        $low = $this->safe_float($ticker, 'low', 0);
        $close = $this->safe_float($ticker, 'close', 0);
        $open = $this->safe_float($ticker, 'open', 0);
        $bid = $this->safe_float($ticker, 'best_bid', 0);
        $ask = $this->safe_float($ticker, 'best_ask', 0);
        $last = $this->safe_float($ticker, 'last', 0);
        $change = $this->safe_float($ticker, 'change', 0);
        $quoteVolume = $this->safe_float($ticker, 'volume', 0);
        return $this->safe_ticker(array(
            'symbol' => $symbol,
            'timestamp' => null,
            'datetime' => null,
            'high' => $high,
            'low' => $low,
            'bid' => $bid,
            'bidVolume' => null,
            'ask' => $ask,
            'askVolume' => null,
            'vwap' => null,
            'open' => $open,
            'close' => $close,
            'last' => $last,
            'previousClose' => null,
            'change' => $change,
            'percentage' => null,
            'average' => null,
            'baseVolume' => null,
            'quoteVolume' => $quoteVolume,
            'info' => $ticker,
        ), $market);
    }

    public function fetch_ohlcv(string $symbol, $timeframe = '1h', ?int $since = null, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $timeframe, $since, $limit, $params) {
            /**
             * fetches historical candlestick data containing the open, high, low, and close price, and the volume of a $market
             * @see https://bitimen.com
             * @param {string} $symbol unified $symbol of the $market to fetch OHLCV data for
             * @param {string} $timeframe the length of time each candle represents
             * @param {int} [$since] timestamp in ms of the earliest candle to fetch
             * @param {int} [$limit] the maximum amount of candles to fetch
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {int[][]} A list of candles ordered, open, high, low, close, volume
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $endTime = Date.now ();
            $request = array(
                'symbol' => $market['id'],
                'from' => ($endTime / 1000) - (24 * 60 * 60),
                'to' => $endTime / 1000,
                'resolution' => $this->safe_string($this->timeframes, $timeframe, $timeframe),
            );
            if ($since !== null) {
                $request['from'] = $since / 1000;
            }
            $request['from'] = $this->safe_integer($request, 'from');
            $request['to'] = $this->safe_integer($request, 'to');
            if ($timeframe !== null) {
                $request['resolution'] = $this->safe_string($this->timeframes, $timeframe, $timeframe);
            }
            $response = Async\await($this->publicGetApiKlineHistory ($request));
            $ohlcvs = array();
            for ($i = 0; $i < count($response); $i++) {
                $ohlcvs[] = [
                    $this->safe_value($response[$i], 'time'),
                    $this->safe_float($response[$i], 'open'),
                    $this->safe_float($response[$i], 'high'),
                    $this->safe_float($response[$i], 'low'),
                    $this->safe_float($response[$i], 'close'),
                    $this->safe_float($response[$i], 'volume'),
                ];
            }
            return $this->parse_ohlcvs($ohlcvs, $market, $timeframe, $since, $limit);
        }) ();
    }

    public function fetch_order_book(string $symbol, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data for multiple markets
             * @see https://bitimen.com
             * @param {string[]|null} symbols list of unified $market symbols, all symbols fetched if null, default is null
             * @param {int} [$limit] max number of entries per orderbook to return, default is null
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a dictionary of ~@link https://docs.ccxt.com/#/?id=order-book-structure order book structures~ indexed by $market $symbol
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $request = array(
                'symbol' => $market['id'],
            );
            $response = Async\await($this->publicGetApiOrderbookDepth ($request));
            $timestamp = Date.now ();
            return $this->parse_order_book($response, $symbol, $timestamp, 'bids', 'asks');
        }) ();
    }

    public function sign($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $query = $this->omit($params, $this->extract_params($path));
        $url = $this->urls['api']['public'] . '/' . $path;
        if ($path === 'api/kline/history') {
            $url = $url . '?' . $this->urlencode($query);
        }
        if ($path === 'api/orderbook/depth') {
            $url = $url . '/' . $params['symbol'];
        }
        $headers = array( 'Content-Type' => 'application/json' );
        return array( 'url' => $url, 'method' => $method, 'body' => $body, 'headers' => $headers );
    }
}
