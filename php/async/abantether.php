<?php

namespace ccxt\async;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\async\abstract\abantether as Exchange;
use React\Async;
use React\Promise\PromiseInterface;

class abantether extends Exchange {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'id' => 'abantether',
            'name' => 'Aban tether',
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
                'fetchOHLCV' => false,
                'fetchOpenInterestHistory' => false,
                'fetchOpenOrders' => false,
                'fetchOrder' => false,
                'fetchOrderBook' => false,
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
                'logo' => 'https://cdn.arz.digital/cr-odin/img/exchanges/abantether/64x64.png',
                'api' => array(
                    'public' => 'https://abantether.com',
                ),
                'www' => 'https://abantether.com',
                'doc' => array(
                    'https://abantether.com',
                ),
            ),
            'api' => array(
                'public' => array(
                    'get' => array(
                        'management/all-coins/' => 1,
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
             * retrieves data on all markets for abantether
             * @see https://abantether.com/management/all-coins/?format=json
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array[]} an array of objects representing $market data
             */
            $response = Async\await($this->publicGetManagementAllCoins ($params));
            $result = array();
            $quotes = array( 'IRT', 'USDT' );
            for ($i = 0; $i < count($response); $i++) {
                $base = $this->safe_string($response[$i], 'symbol');
                for ($index = 0; $index < count($quotes); $index++) {
                    $quote = $quotes[$index];
                    $response[$i]['base'] = $base;
                    $response[$i]['quote'] = $quote;
                    if ($base === $quote) {
                        continue;
                    }
                    $market = Async\await($this->parse_market($response[$i]));
                    $result[] = $market;
                }
            }
            return $result;
        }) ();
    }

    public function parse_market($market): array {
        // array(
        //     'symbol' => 'USDT',
        //     'name' => 'Tether',
        //     'categories' => array(),
        //     'tetherPrice' => '1',
        //     'priceBuy' => '59200.0',
        //     'priceSell' => '58800.0',
        //     'persianName' => '\u062a\u062a\u0631',
        //     'past24' => '0',
        //     'marketVolume' => '1',
        //     'id' => '1',
        //     'active' => true,
        //     'irtDecimalPoint' => '2',
        //     'tetherDecimalPoint' => '6',
        //     'amountDecimalPoint' => '6',
        //     'past24volume' => '767287.60530837810210936763',
        //     'operationStatus' => array(
        //         'buyActive' => true,
        //         'sellActive' => true,
        //         'withdrawalActive' => true,
        //         'depositActive' => true,
        //         'transferActive' => true,
        //     ),
        // );
        $baseId = $this->safe_string($market, 'base');
        $quoteId = $this->safe_string($market, 'quote');
        $base = $this->safe_currency_code($baseId);
        $quote = $this->safe_currency_code($quoteId);
        $id = $base . $quote;
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
             * @see https://abantether.com/management/all-coins/?format=json
             * @param {string[]|null} $symbols unified $symbols of the markets to fetch the $ticker for, all market tickers are returned if not assigned
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a dictionary of ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structures~
             */
            Async\await($this->load_markets());
            if ($symbols !== null) {
                $symbols = $this->market_symbols($symbols);
            }
            $response = Async\await($this->publicGetManagementAllCoins ($params));
            $result = array();
            $quotes = array( 'IRT', 'USDT' );
            for ($i = 0; $i < count($response); $i++) {
                $base = $this->safe_string($response[$i], 'symbol');
                for ($index = 0; $index < count($quotes); $index++) {
                    $quote = $quotes[$index];
                    if ($base === $quote) {
                        continue;
                    }
                    $response[$i]['base'] = $base;
                    $response[$i]['quote'] = $quote;
                    $response[$i]['symbol'] = $base . $quote;
                    $ticker = $this->parse_ticker($response[$i]);
                    $symbol = $ticker['symbol'];
                    $result[$symbol] = $ticker;
                }
            }
            return $this->filter_by_array_tickers($result, 'symbol', $symbols);
        }) ();
    }

    public function fetch_ticker(string $symbol, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $params) {
            /**
             * fetches a price $ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
             * @see https://abantether.com/management/all-coins/?format=json
             * @param {string} $symbol unified $symbol of the market to fetch the $ticker for
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structure~
             */
            $ticker = Async\await($this->fetch_tickers(array( $symbol )));
            return $ticker[$symbol];
        }) ();
    }

    public function parse_ticker($ticker, ?array $market = null): array {
        // array(
        //     'symbol' => 'USDT',
        //     'name' => 'Tether',
        //     'categories' => array(),
        //     'tetherPrice' => '1',
        //     'priceBuy' => '59200.0',
        //     'priceSell' => '58800.0',
        //     'persianName' => '\u062a\u062a\u0631',
        //     'past24' => '0',
        //     'marketVolume' => '1',
        //     'id' => '1',
        //     'active' => true,
        //     'irtDecimalPoint' => '2',
        //     'tetherDecimalPoint' => '6',
        //     'amountDecimalPoint' => '6',
        //     'past24volume' => '767287.60530837810210936763',
        //     'operationStatus' => array(
        //         'buyActive' => true,
        //         'sellActive' => true,
        //         'withdrawalActive' => true,
        //         'depositActive' => true,
        //         'transferActive' => true,
        //     ),
        // );
        $marketType = 'otc';
        $marketId = $this->safe_string($ticker, 'symbol');
        $symbol = $this->safe_symbol($marketId, $market, null, $marketType);
        $last = $this->safe_float($ticker, 'tetherPrice', 0);
        if ($ticker['quote'] === 'IRT') {
            $last = $this->safe_float($ticker, 'priceSell', 0);
        }
        $change = $this->safe_float($ticker, 'past24', 0);
        $baseVolume = $this->safe_float($ticker, 'past24volume', 0);
        return $this->safe_ticker(array(
            'symbol' => $symbol,
            'timestamp' => null,
            'datetime' => null,
            'high' => null,
            'low' => null,
            'bid' => null,
            'bidVolume' => null,
            'ask' => null,
            'askVolume' => null,
            'vwap' => null,
            'open' => null,
            'close' => $last,
            'last' => $last,
            'previousClose' => null,
            'change' => $change,
            'percentage' => null,
            'average' => null,
            'baseVolume' => $baseVolume,
            'quoteVolume' => null,
            'info' => $ticker,
        ), $market);
    }

    public function sign($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $url = $this->urls['api']['public'] . '/' . $path . '?format=json';
        $headers = array( 'Content-Type' => 'application/json', 'Cookie' => '__arcsco=9593a1412d8bfc752c7170b1d2264544' );
        return array( 'url' => $url, 'method' => $method, 'body' => $body, 'headers' => $headers );
    }
}
