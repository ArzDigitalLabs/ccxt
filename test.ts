import ccxt from './ts/ccxt.js';

const exchange = new ccxt.asacoine ({
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
    const spotMarkets = await exchange.fetchMarkets ({ 'type': 'spot' });
    printMarkets ('spot', spotMarkets);

    const spotTickers = await exchange.fetchTickers (undefined, { 'type': 'spot' });
    printTickers ('spot', spotTickers);

    const otcMarkets = await exchange.fetchMarkets ({ 'type': 'otc' });
    printMarkets ('otc', otcMarkets);

    const otcTickers = await exchange.fetchTickers (undefined, { 'type': 'otc' });
    printTickers ('otc', otcTickers);
}

main ();
