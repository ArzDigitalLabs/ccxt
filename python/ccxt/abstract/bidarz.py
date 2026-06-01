from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_arz_digital_spot_markets = publicGetV1ArzDigitalSpotMarkets = Entry('v1/arz-digital/spot/markets', 'public', 'GET', {'cost': 1})
    public_get_v1_arz_digital_otc_markets = publicGetV1ArzDigitalOtcMarkets = Entry('v1/arz-digital/otc/markets', 'public', 'GET', {'cost': 1})
