from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_backend_api_v1_pricing_spot = publicGetBackendApiV1PricingSpot = Entry('backend/api/v1/pricing/spot', 'public', 'GET', {'cost': 1})
