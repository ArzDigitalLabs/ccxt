from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_v1_price = publicGetApiV1Price = Entry('api/v1/price', 'public', 'GET', {'cost': 1})
