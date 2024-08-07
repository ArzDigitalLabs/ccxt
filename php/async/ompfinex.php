<?php

namespace ccxt\async;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\async\abstract\ompfinex as Exchange;
use React\Async;
use React\Promise\PromiseInterface;

class ompfinex extends Exchange {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'id' => 'ompfinex',
            'name' => 'OMPFinex',
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
                'logo' => 'https://cdn.arz.digital/cr-odin/img/exchanges/ompfinex/64x64.png',
                'api' => array(
                    'public' => 'https://api.ompfinex.com',
                ),
                'www' => 'https://www.ompfinex.com/',
                'doc' => array(
                    'https://docs.ompfinex.com/',
                ),
            ),
            'timeframes' => array(
                '1h' => '60',
                '3h' => '180',
                '6h' => '360',
                '12h' => '720',
                '1d' => '1D',
                '1W' => '1W',
                '1M' => '3M',
            ),
            'api' => array(
                'public' => array(
                    'get' => array(
                        'v1/market' => 1,
                        'v2/udf/real/history' => 1,
                        'v1/orderbook' => 1,
                    ),
                ),
            ),
            'commonCurrencies' => array(
                'IRR' => 'IRT',
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
             * retrieves data on all $markets for ompfinex
             * @see https://apidocs.ompfinex.ir/#6ae2dae4a2
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array[]} an array of objects representing $market data
             */
            $response = Async\await($this->publicGetV1Market ());
            $markets = $this->safe_list($response, 'data');
            $result = array();
            for ($i = 0; $i < count($markets); $i++) {
                $market = Async\await($this->parse_market($markets[$i]));
                $result[] = $market;
            }
            return $result;
        }) ();
    }

    public function parse_market($market): array {
        // {
        //     'id' => 1,
        //     'base_currency' => array(
        //         'id' => 'BTC',
        //         'icon_path' => 'https://s3.ir-thr-at1.arvanstorage.com/ompfinex-static/t/btc.png',
        //         'name' => 'بیت کوین',
        //         'decimal_precision' => 8,
        //     ),
        //     'quote_currency' => array(
        //         'id' => 'IRR',
        //         'icon_path' => 'https://s3.ir-thr-at1.arvanstorage.com/ompfinex-static/t/irt.png',
        //         'name' => 'تومان',
        //         'decimal_precision' => 0,
        //     ),
        //     'name' => 'بیت کوین - تومان',
        //     'quote_currency_precision' => 0,
        //     'base_currency_precision' => 8,
        //     'history' => array(
        //         '39904073000',
        //         '39869830000',
        //         '39724396000',
        //         '39701684000',
        //         '39712038000',
        //         '39528137000',
        //         '39639658000',
        //         '39644885000',
        //         '39654055000',
        //         '39574451000',
        //         '39615152000',
        //         '39677500800',
        //         '39606862870',
        //         '39737426850',
        //         '39546858000',
        //         '39593530000',
        //         '39385856000',
        //         '39502536080',
        //         '39527561000',
        //         '39581729000',
        //         '39637343000',
        //         '39806512800',
        //         '39616055090',
        //         '39516007000',
        //     ),
        //     'min_price' => '39382265000',
        //     'max_price' => '40128888990',
        //     'last_price' => '39516007000',
        //     'last_volume' => '186449950855',
        //     'day_change_percent' => -0.97,
        //     'week_change_percent' => 1.64,
        //     'tradingview_symbol' => 'BINANCE:BTCUSDT',
        //     'is_visible' => true,
        // }
        $baseAsset = $this->safe_dict($market, 'base_currency');
        $quoteAsset = $this->safe_dict($market, 'quote_currency');
        $baseId = $this->safe_string_upper($baseAsset, 'id');
        $quoteId = $this->safe_string_upper($quoteAsset, 'id');
        $id = $this->safe_value($market, 'id');
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
             * fetches price tickers for multiple $markets, statistical information calculated over the past 24 hours for each market
             * @see https://docs.ompfinex.com/?shell#5f1cfe9299
             * @param {string[]|null} $symbols unified $symbols of the $markets to fetch the $ticker for, all market tickers are returned if not assigned
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a dictionary of ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structures~
             */
            Async\await($this->load_markets());
            if ($symbols !== null) {
                $symbols = $this->market_symbols($symbols);
            }
            $response = Async\await($this->publicGetV1Market ());
            $markets = $this->safe_list($response, 'data');
            $result = array();
            for ($i = 0; $i < count($markets); $i++) {
                $ticker = Async\await($this->parse_ticker($markets[$i]));
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
             * @see https://docs.ompfinex.com/?shell#5f1cfe9299
             * @param {string} $symbol unified $symbol of the $market to fetch the $ticker for
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structure~
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $request = array(
                'id' => $market['id'],
            );
            $response = Async\await($this->publicGetV1Market ($request));
            $markets = $this->safe_dict($response, 'data');
            $ticker = Async\await($this->parse_ticker($markets));
            return $ticker;
        }) ();
    }

    public function parse_ticker($ticker, ?array $market = null): array {
        // {
        //     'id' => 1,
        //     'base_currency' => array(
        //         'id' => 'BTC',
        //         'icon_path' => 'https://s3.ir-thr-at1.arvanstorage.com/ompfinex-static/t/btc.png',
        //         'name' => 'بیت کوین',
        //         'decimal_precision' => 8,
        //     ),
        //     'quote_currency' => array(
        //         'id' => 'IRR',
        //         'icon_path' => 'https://s3.ir-thr-at1.arvanstorage.com/ompfinex-static/t/irt.png',
        //         'name' => 'تومان',
        //         'decimal_precision' => 0,
        //     ),
        //     'name' => 'بیت کوین - تومان',
        //     'quote_currency_precision' => 0,
        //     'base_currency_precision' => 8,
        //     'history' => array(
        //         '39904073000',
        //         '39869830000',
        //         '39724396000',
        //         '39701684000',
        //         '39712038000',
        //         '39528137000',
        //         '39639658000',
        //         '39644885000',
        //         '39654055000',
        //         '39574451000',
        //         '39615152000',
        //         '39677500800',
        //         '39606862870',
        //         '39737426850',
        //         '39546858000',
        //         '39593530000',
        //         '39385856000',
        //         '39502536080',
        //         '39527561000',
        //         '39581729000',
        //         '39637343000',
        //         '39806512800',
        //         '39616055090',
        //         '39516007000',
        //     ),
        //     'min_price' => '39382265000',
        //     'max_price' => '40128888990',
        //     'last_price' => '39516007000',
        //     'last_volume' => '186449950855',
        //     'day_change_percent' => -0.97,
        //     'week_change_percent' => 1.64,
        //     'tradingview_symbol' => 'BINANCE:BTCUSDT',
        //     'is_visible' => true,
        // }
        $marketType = 'spot';
        $marketId = $this->safe_value($ticker, 'id');
        $marketinfo = $this->market($marketId);
        $symbol = $this->safe_symbol($marketId, $market, null, $marketType);
        $high = $this->safe_float($ticker, 'max_price');
        $low = $this->safe_float($ticker, 'min_price');
        $change = $this->safe_float($ticker, 'day_change_percent');
        $last = $this->safe_float($ticker, 'last_price');
        $quoteVolume = $this->safe_float($ticker, 'last_volume');
        if ($marketinfo['quote'] === 'IRT') {
            $high /= 10;
            $low /= 10;
            $last /= 10;
            $quoteVolume /= 10;
        }
        return $this->safe_ticker(array(
            'symbol' => $symbol,
            'timestamp' => null,
            'datetime' => null,
            'high' => $high,
            'low' => $low,
            'bid' => null,
            'bidVolume' => null,
            'ask' => null,
            'askVolume' => null,
            'vwap' => null,
            'open' => $last,
            'close' => $last,
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
             * @see https://docs.ompfinex.com/?shell#ohlc
             * @param {string} $symbol unified $symbol of the $market to fetch OHLCV data for
             * @param {string} $timeframe the length of time each candle represents
             * @param {int} [$since] timestamp in ms of the earliest candle to fetch
             * @param {int} [$limit] the maximum amount of candles to fetch
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {int[][]} A list of candles ordered, open, high, low, close, volume
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            if ($market['quote'] === 'IRT') {
                $symbol = $market['base'] . 'IRR';
            }
            $endTime = Date.now ();
            $request = array(
                'symbol' => str_replace('/', '', $symbol),
                'from' => ($endTime / 1000) - (24 * 60 * 60),
                'to' => $endTime / 1000,
                'resolution' => $this->safe_string($this->timeframes, $timeframe, $timeframe),
                // 'limit' => 500,
            );
            if ($since !== null) {
                $request['from'] = $since / 1000;
            }
            $request['from'] = $this->safe_integer($request, 'from');
            $request['to'] = $this->safe_integer($request, 'to');
            if ($timeframe !== null) {
                $request['resolution'] = $this->safe_string($this->timeframes, $timeframe, $timeframe);
            }
            $response = Async\await($this->publicGetV2UdfRealHistory ($request));
            $openList = $this->safe_value($response, 'o', array());
            $highList = $this->safe_list($response, 'h', array());
            $lastList = $this->safe_list($response, 'l', array());
            $closeList = $this->safe_list($response, 'c', array());
            $volumeList = $this->safe_list($response, 'v', array());
            $timestampList = $this->safe_list($response, 't', array());
            $ohlcvs = array();
            for ($i = 0; $i < count($openList); $i++) {
                if ($market['quote'] === 'IRT') {
                    $openList[$i] /= 10;
                    $highList[$i] /= 10;
                    $lastList[$i] /= 10;
                    $closeList[$i] /= 10;
                    $volumeList[$i] /= 10;
                }
                $ohlcvs[] = [
                    $timestampList[$i],
                    $openList[$i],
                    $highList[$i],
                    $lastList[$i],
                    $closeList[$i],
                    $volumeList[$i],
                ];
            }
            return $this->parse_ohlcvs($ohlcvs, $market, $timeframe, $since, $limit);
        }) ();
    }

    public function fetch_order_book(string $symbol, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data for multiple markets
             * @see https://docs.ompfinex.com/?shell#f2150d7710
             * @param {string[]|null} symbols list of unified $market symbols, all symbols fetched if null, default is null
             * @param {int} [$limit] max number of entries per $orderbook to return, default is null
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a dictionary of ~@link https://docs.ccxt.com/#/?id=order-book-structure order book structures~ indexed by $market $symbol
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $response = Async\await($this->publicGetV1Orderbook ());
            $orderbook = $this->safe_dict($response, 'data');
            if ($market['quote'] === 'IRT') {
                $orderbook = $this->safe_dict($orderbook, $market['base'] . 'IRR');
                $bids = $this->safe_list($orderbook, 'bids');
                $asks = $this->safe_list($orderbook, 'asks');
                for ($i = 0; $i < count($bids); $i++) {
                    $bids[$i][0] /= 10;
                }
                for ($i = 0; $i < count($asks); $i++) {
                    $asks[$i][0] /= 10;
                }
                $orderbook['bids'] = $asks;
                $orderbook['asks'] = $bids;
            } else {
                $orderbook = $this->safe_dict($orderbook, $market['base'] . $market['quote']);
            }
            $timestamp = Date.now ();
            return $this->parse_order_book($orderbook, $symbol, $timestamp, 'bids', 'asks', 'price', 'amount');
        }) ();
    }

    public function sign($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $query = $this->omit($params, $this->extract_params($path));
        $url = $this->urls['api']['public'] . '/' . $path;
        if ($params['id'] !== null) {
            $url = $url . '/' . $params['id'];
        }
        if ($path === 'v2/udf/real/history') {
            $url = $this->urls['api']['public'] . '/' . $path . '?' . $this->urlencode($query);
        }
        $headers = array( 'Content-Type' => 'application/json' );
        return array( 'url' => $url, 'method' => $method, 'body' => $body, 'headers' => $headers );
    }
}
