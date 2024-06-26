<?php

namespace ccxt\async\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class exir extends \ccxt\async\Exchange {
    public function public_get_v2_tickers($params = array()) {
        return $this->request('v2/tickers', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_ticker($params = array()) {
        return $this->request('v2/ticker', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_chart($params = array()) {
        return $this->request('v2/chart', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_orderbook($params = array()) {
        return $this->request('v2/orderbook', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Tickers($params = array()) {
        return $this->request('v2/tickers', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Ticker($params = array()) {
        return $this->request('v2/ticker', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Chart($params = array()) {
        return $this->request('v2/chart', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Orderbook($params = array()) {
        return $this->request('v2/orderbook', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
}
