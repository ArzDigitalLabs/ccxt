
<a name="swapwallet" id="swapwallet"></a>

## swapwallet{docsify-ignore}
**Kind**: global class  
**Extends**: <code>Exchange</code>  

* [fetchMarkets](#fetchmarkets)
* [fetchTickers](#fetchtickers)
* [fetchTicker](#fetchticker)

<a name="fetchMarkets" id="fetchmarkets"></a>

### fetchMarkets{docsify-ignore}
retrieves all OTC markets

**Kind**: instance method of [<code>swapwallet</code>](#swapwallet)  
**Returns**: <code>Array&lt;object&gt;</code> - an array of market structures

**See**: https://swapwallet.app/api/v2/market/crypto/stats  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
swapwallet.fetchMarkets ([params])
```


<a name="fetchTickers" id="fetchtickers"></a>

### fetchTickers{docsify-ignore}
fetches 24 hour price statistics for multiple OTC markets

**Kind**: instance method of [<code>swapwallet</code>](#swapwallet)  
**Returns**: <code>object</code> - a dictionary of ticker structures indexed by symbol

**See**: https://swapwallet.app/api/v2/market/crypto/stats  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbols | <code>Array&lt;string&gt;</code> | No | unified symbols, all markets are returned if undefined |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
swapwallet.fetchTickers ([symbols, params])
```


<a name="fetchTicker" id="fetchticker"></a>

### fetchTicker{docsify-ignore}
fetches 24 hour price statistics for a single OTC market

**Kind**: instance method of [<code>swapwallet</code>](#swapwallet)  
**Returns**: <code>object</code> - a ticker structure

**See**: https://swapwallet.app/api/v2/market/crypto/stats  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
swapwallet.fetchTicker (symbol[, params])
```

