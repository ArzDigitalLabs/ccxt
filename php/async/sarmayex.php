<?php

namespace ccxt\async;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\async\abstract\sarmayex as Exchange;
use React\Async;
use React\Promise\PromiseInterface;

class sarmayex extends Exchange {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'id' => 'sarmayex',
            'name' => 'Sarmayex',
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
                'logo' => 'https://cdn.arz.digital/cr-odin/img/exchanges/sarmayex/64x64.png',
                'api' => array(
                    'public' => 'https://api.sarmayex.com',
                ),
                'www' => 'https://sarmayex.com',
                'doc' => array(
                    'https://sarmayex.com',
                ),
            ),
            'api' => array(
                'public' => array(
                    'get' => array(
                        'api/v1/public/currencies' => 1,
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
             * retrieves data on all $markets for sarmayex
             * @see https://api.sarmayex.com/api/v1/public/currencies
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array[]} an array of objects representing $market data
             */
            $response = Async\await($this->publicGetApiV1PublicCurrencies ($params));
            $response = $this->safe_dict($response, 'data');
            $markets = $this->safe_list($response, 'currencies');
            $result = array();
            $quotes = array( 'IRT', 'USDT' );
            for ($i = 0; $i < count($markets); $i++) {
                $base = $this->safe_string($markets[$i], 'symbol');
                for ($index = 0; $index < count($quotes); $index++) {
                    $quote = $quotes[$index];
                    $markets[$i]['base'] = $base;
                    $markets[$i]['quote'] = $quote;
                    if ($base === $quote) {
                        continue;
                    }
                    $market = Async\await($this->parse_market($markets[$i]));
                    $result[] = $market;
                }
            }
            return $result;
        }) ();
    }

    public function parse_market($market): array {
        //   array(
        //     'id' => 87,
        //     'title' => 'تتر',
        //     'title_en' => 'Tether',
        //     'symbol' => 'USDT',
        //     'sell_price' => '58,987',
        //     'sell_price_usd' => '1.0000',
        //     'sell_price_wm' => '1.062',
        //     'sell_price_pm' => '1.085',
        //     'can_sell' => 1,
        //     'can_sell_iw' => 1,
        //     'can_buy' => 1,
        //     'can_buy_iw' => 1,
        //     'buy_price' => '58,448',
        //     'min_buy' => '0.00000000',
        //     'max_buy' => '232348196.00000000',
        //     'percent_change_1h' => 0.00495761,
        //     'percent_change_24h' => 0.0333481,
        //     'percent_change_7d' => 0.0540622,
        //     'tick' => 4,
        //     'need_tag' => 0,
        //     'need_address' => 1,
        //     'use_copon' => 1,
        //     'updated_at' => 1717936143,
        //     'image' => '',
        //     'has_content' => 1,
        //     'withdraw_nets' => array(),
        //     'deposit_nets' => array(),
        //     'sell_request_gateway' => 1,
        //     'exist_in_wallet' => 1,
        //     'tags' => array(
        //         array(
        //             'id' => 3,
        //             'name' => 'استیبل کوین',
        //         ),
        //         array(
        //             'id' => 13,
        //             'name' => 'قابل پرداخت',
        //         ),
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
             * fetches price tickers for multiple $markets, statistical information calculated over the past 24 hours for each market
             * @see https://api.sarmayex.com/api/v1/public/currencies
             * @param {string[]|null} $symbols unified $symbols of the $markets to fetch the $ticker for, all market tickers are returned if not assigned
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a dictionary of ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structures~
             */
            Async\await($this->load_markets());
            if ($symbols !== null) {
                $symbols = $this->market_symbols($symbols);
            }
            $response = Async\await($this->publicGetApiV1PublicCurrencies ($params));
            $response = $this->safe_dict($response, 'data');
            $markets = $this->safe_list($response, 'currencies');
            $result = array();
            $quotes = array( 'IRT', 'USDT' );
            for ($i = 0; $i < count($markets); $i++) {
                $base = $this->safe_string($markets[$i], 'symbol');
                for ($index = 0; $index < count($quotes); $index++) {
                    $quote = $quotes[$index];
                    if ($base === $quote) {
                        continue;
                    }
                    $markets[$i]['base'] = $base;
                    $markets[$i]['quote'] = $quote;
                    $markets[$i]['symbol'] = $base . $quote;
                    $ticker = Async\await($this->parse_ticker($markets[$i]));
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
             * @see https://api.sarmayex.com/api/v1/public/currencies
             * @param {string} $symbol unified $symbol of the market to fetch the $ticker for
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=$ticker-structure $ticker structure~
             */
            $ticker = Async\await($this->fetch_tickers(array( $symbol )));
            return $ticker[$symbol];
        }) ();
    }

    public function parse_ticker($ticker, ?array $market = null): array {
        //   array(
        //     'id' => 87,
        //     'title' => 'تتر',
        //     'title_en' => 'Tether',
        //     'symbol' => 'USDT',
        //     'sell_price' => '58,987',
        //     'sell_price_usd' => '1.0000',
        //     'sell_price_wm' => '1.062',
        //     'sell_price_pm' => '1.085',
        //     'can_sell' => 1,
        //     'can_sell_iw' => 1,
        //     'can_buy' => 1,
        //     'can_buy_iw' => 1,
        //     'buy_price' => '58,448',
        //     'min_buy' => '0.00000000',
        //     'max_buy' => '232348196.00000000',
        //     'percent_change_1h' => 0.00495761,
        //     'percent_change_24h' => 0.0333481,
        //     'percent_change_7d' => 0.0540622,
        //     'tick' => 4,
        //     'need_tag' => 0,
        //     'need_address' => 1,
        //     'use_copon' => 1,
        //     'updated_at' => 1717936143,
        //     'image' => '',
        //     'has_content' => 1,
        //     'withdraw_nets' => array(),
        //     'deposit_nets' => array(),
        //     'sell_request_gateway' => 1,
        //     'exist_in_wallet' => 1,
        //     'tags' => array(
        //         array(
        //             'id' => 3,
        //             'name' => 'استیبل کوین',
        //         ),
        //         array(
        //             'id' => 13,
        //             'name' => 'قابل پرداخت',
        //         ),
        //     ),
        // );
        $marketType = 'otc';
        $marketId = $this->safe_string($ticker, 'symbol');
        $symbol = $this->safe_symbol($marketId, $market, null, $marketType);
        $ticker['sell_price'] = str_replace(',', '', $ticker['sell_price']);
        $ticker['sell_price_usd'] = str_replace(',', '', $ticker['sell_price']);
        $ticker['buy_price'] = str_replace(',', '', $ticker['sell_price']);
        $last = $this->safe_float($ticker, 'sell_price_usd', 0);
        if ($ticker['quote'] === 'IRT') {
            $last = $this->safe_float($ticker, 'sell_price', 0);
        }
        $change = $this->safe_float($ticker, 'percent_change_24h', 0);
        $timestamp = $this->safe_integer($ticker, 'updated_at');
        return $this->safe_ticker(array(
            'symbol' => $symbol,
            'timestamp' => $timestamp * 1000,
            'datetime' => $this->iso8601($timestamp * 1000),
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
            'baseVolume' => null,
            'quoteVolume' => null,
            'info' => $ticker,
        ), $market);
    }

    public function sign($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $url = $this->urls['api']['public'] . '/' . $path;
        $headers = array( 'Content-Type' => 'application/json' );
        return array( 'url' => $url, 'method' => $method, 'body' => $body, 'headers' => $headers );
    }
}
