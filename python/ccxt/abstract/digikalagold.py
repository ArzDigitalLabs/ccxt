from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_non_inventory_v1_prices = publicGetNonInventoryV1Prices = Entry('non-inventory/v1/prices/', 'public', 'GET', {'cost': 1})
