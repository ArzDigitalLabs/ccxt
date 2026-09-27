import ccxt from './ts/ccxt.js';

const exchange = new ccxt.poulyar ({
    'enableRateLimit': true,
});

function printMarkets (label, markets) {
    console.log ('');
    console.log (`${label} markets: ${markets.length}`);
    console.table (markets.slice (0, 10).map ((market) => ({
        symbol: market['symbol'],
        id: market['id'],
        type: market['type'],
        spot: market['spot'],
    })));
}

function printTickers (label, tickers) {
    const values = Object.values (tickers);
    console.log ('');
    console.log (`${label} tickers: ${values.length}`);
    console.table (values.slice (0, 10).map ((ticker) => ({
        symbol: ticker['symbol'],
        bid: ticker['bid'],
        ask: ticker['ask'],
        last: ticker['last'],
    })));
}

async function main () {
    const otcMarkets = await exchange.fetchMarkets ();
    printMarkets ('otc', otcMarkets);

    const otcTickers = await exchange.fetchTickers ();
    printTickers ('otc', otcTickers);
}

main ();
