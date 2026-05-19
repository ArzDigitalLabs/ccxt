from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v2_market = publicGetV2Market = Entry('v2/market', 'public', 'GET', {'cost': 1})
