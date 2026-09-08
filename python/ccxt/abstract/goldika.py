from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_v2_public_price = publicGetApiV2PublicPrice = Entry('api/v2/public/price', 'public', 'GET', {'cost': 1})
