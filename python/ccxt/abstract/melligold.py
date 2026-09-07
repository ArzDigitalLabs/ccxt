from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_v1_exchange_buy_sell_price = publicGetApiV1ExchangeBuySellPrice = Entry('api/v1/exchange/buy-sell-price/', 'public', 'GET', {'cost': 1})
