from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_pro_capi_v1_markets = publicGetProCapiV1Markets = Entry('pro/capi/v1/markets', 'public', 'GET', {'cost': 1})
