import ccxt from './ccxt';
async function testTalasea() {
    const exchange = new ccxt.talasea({
        enableRateLimit: true,
        timeout: 20000,
    });
    try {
        const markets = await exchange.fetchMarkets();
        if (markets.length === 0) {
            throw new Error('Talasea returned no markets');
        }
        const market = markets[0];
        if (market['symbol'] !== 'XAU18/IRT') {
            throw new Error('Talasea did not return the XAU18/IRT market');
        }
        const tickers = await exchange.fetchTickers();
        const goldTicker = tickers['XAU18/IRT'];
        if (goldTicker === undefined) {
            throw new Error('Talasea did not return an XAU18/IRT ticker');
        }
        const ticker = await exchange.fetchTicker('XAU18/IRT');
        if (ticker['last'] === undefined) {
            throw new Error('Talasea did not return a gold price');
        }
        console.log('Talasea test passed:', {
            endpoint: 'https://api.talasea.ir/api/market/getGoldPrice',
            markets: markets.length,
            tickers: Object.keys(tickers).length,
            gold: {
                symbol: ticker.symbol,
                last: ticker.last,
                percentage: ticker.percentage,
                minOrderValue: market.limits.cost.min,
                maxOrderValue: market.limits.cost.max,
                active: market.active,
            },
        });
    }
    finally {
        await exchange.close();
    }
}
testTalasea().catch((error) => {
    console.error('Talasea test failed:', error);
    process.exitCode = 1;
});
