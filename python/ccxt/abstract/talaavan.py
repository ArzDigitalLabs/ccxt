from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_price = publicGetV1Price = Entry('v1/price', 'public', 'GET', {'cost': 1})
