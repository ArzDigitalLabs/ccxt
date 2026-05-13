from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_pro_capi_v1_markets = publicGetProCapiV1Markets = Entry('pro/capi/v1/markets', 'public', 'GET', {'cost': 1})
    public_get_api_v1_coins_simple_list = publicGetApiV1CoinsSimpleList = Entry('api/v1/coins/simple-list', 'public', 'GET', {'cost': 1})
