
<a name="bidarz" id="bidarz"></a>

## bidarz{docsify-ignore}
**Kind**: global class  
**Extends**: <code>Exchange</code>  

* [fetchMarkets](#fetchmarkets)
* [fetchTickers](#fetchtickers)
* [fetchTicker](#fetchticker)

<a name="bidarz" id="bidarz"></a>

### bidarz{docsify-ignore}
Set rateLimit to 1000 if fully verified



```javascript
bidarz.bidarz ()
```


<a name="fetchMarkets" id="fetchmarkets"></a>

### fetchMarkets{docsify-ignore}
retrieves data on all markets for bidarz, including spot and OTC markets

**Kind**: instance method of [<code>bidarz</code>](#bidarz)  
**Returns**: <code>Array&lt;object&gt;</code> - an array of objects representing market data

**See**

- https://new-api.bidarz.ir/v1/arz-digital/spot/markets
- https://new-api.bidarz.ir/v1/arz-digital/otc/markets


| Param | Type | Required | Description |
| --- | --- | --- | --- |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
bidarz.fetchMarkets ([params])
```


<a name="fetchTickers" id="fetchtickers"></a>

### fetchTickers{docsify-ignore}
fetches price tickers for multiple markets

**Kind**: instance method of [<code>bidarz</code>](#bidarz)  
**Returns**: <code>object</code> - a dictionary of [ticker structures](https://docs.ccxt.com/#/?id=ticker-structure)

**See**

- https://new-api.bidarz.ir/v1/arz-digital/spot/markets
- https://new-api.bidarz.ir/v1/arz-digital/otc/markets


| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbols | <code>Array&lt;string&gt;</code>, <code>undefined</code> | Yes | unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
bidarz.fetchTickers (symbols[, params])
```


<a name="fetchTicker" id="fetchticker"></a>

### fetchTicker{docsify-ignore}
fetches a price ticker, defaulting duplicate raw spot/OTC symbols to the spot market

**Kind**: instance method of [<code>bidarz</code>](#bidarz)  
**Returns**: <code>object</code> - a [ticker structure](https://docs.ccxt.com/#/?id=ticker-structure)

**See**: https://new-api.bidarz.ir/v1/arz-digital/spot/markets  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified symbol of the market to fetch the ticker for |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
bidarz.fetchTicker (symbol[, params])
```

