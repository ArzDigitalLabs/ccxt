from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_market_crypto_stats = publicGetMarketCryptoStats = Entry('market/crypto/stats', 'public', 'GET', {'cost': 1})
