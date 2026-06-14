from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_financial_api_market = publicGetFinancialApiMarket = Entry('/financial/api/market', 'public', 'GET', {'cost': 1})
    public_get_financial_api_market_symbol = publicGetFinancialApiMarketSymbol = Entry('/financial/api/market/{symbol}', 'public', 'GET', {'cost': 1})
