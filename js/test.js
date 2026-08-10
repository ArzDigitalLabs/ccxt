import ccxt from './ccxt';
async function testSaraf() {
    const exchange = new ccxt.saraf({
        enableRateLimit: true,
        timeout: 20000,
    });
    try {
        const markets = await exchange.fetchMarkets();
        if (markets.length === 0) {
            throw new Error('Saraf returned no markets');
        }
        const tickers = await exchange.fetchTickers();
        const btcTicker = tickers['BTC/IRT'];
        if (btcTicker === undefined) {
            throw new Error('Saraf did not return a BTC/IRT ticker');
        }
        console.log('Saraf test passed:', {
            endpoint: 'https://api.saraf.app/v1/prices/arzdigital',
            markets: markets.length,
            tickers: Object.keys(tickers).length,
            btc: {
                last: btcTicker.last,
                high: btcTicker.high,
                low: btcTicker.low,
                timestamp: btcTicker.timestamp,
            },
        });
    }
    finally {
        await exchange.close();
    }
}
testSaraf().catch((error) => {
    console.error('Saraf test failed:', error);
    process.exitCode = 1;
});
