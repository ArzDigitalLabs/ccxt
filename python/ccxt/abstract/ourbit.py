from ccxt.base.types import Entry


class ImplicitAPI:
    spot_get_api_platform_spot_market_v2_tickers = spotGetApiPlatformSpotMarketV2Tickers = Entry('api/platform/spot/market/v2/tickers', 'spot', 'GET', {})
    spot_get_api_platform_spot_market_v2_symbol_ticker = spotGetApiPlatformSpotMarketV2SymbolTicker = Entry('api/platform/spot/market/v2/symbol/ticker', 'spot', 'GET', {})
    futures_get_api_v1_contract_ticker = futuresGetApiV1ContractTicker = Entry('api/v1/contract/ticker', 'futures', 'GET', {})
