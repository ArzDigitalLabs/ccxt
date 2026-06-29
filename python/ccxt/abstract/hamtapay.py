from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_financial_api_market = publicGetFinancialApiMarket = Entry('/financial/api/market', 'public', 'GET', {'cost': 1})
