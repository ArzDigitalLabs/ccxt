from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_v1_market_symbols = publicGetApiV1MarketSymbols = Entry('api/v1/market/symbols', 'public', 'GET', {'cost': 1})
    public_get_api_v1_market_symbols_symbol = publicGetApiV1MarketSymbolsSymbol = Entry('api/v1/market/symbols/{symbol}/', 'public', 'GET', {'cost': 1})
    public_get_api_v1_market_depth_symbol = publicGetApiV1MarketDepthSymbol = Entry('api/v1/market/depth/{symbol}', 'public', 'GET', {'cost': 1})
    public_get_api_v1_market = publicGetApiV1Market = Entry('api/v1/market', 'public', 'GET', {'cost': 1})
