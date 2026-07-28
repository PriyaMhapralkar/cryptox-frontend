import { useNavigate } from "react-router-dom";

function CoinTable({ coins }) {
  const navigate = useNavigate();

  return (
    <table className="w-full text-sm table-glass">
      <thead>
        <tr>
          <th className="py-3 px-2">#</th>
          <th className="py-3 px-2">Coin</th>
          <th className="py-3 px-2 text-right">Price</th>
          <th className="py-3 px-2 text-right">24h %</th>
          <th className="py-3 px-2 text-right">Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <tr
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.coinId}`)}
            className="cursor-pointer"
          >
            <td className="py-3 px-2 text-gray-500">{coin.marketCapRank}</td>
            <td className="py-3 px-2">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <span className="font-medium text-white">{coin.name}</span>
                <span className="text-gray-500 uppercase text-xs">{coin.symbol}</span>
              </div>
            </td>
            <td className="py-3 px-2 text-right text-gray-200">
              ${coin.currentPrice?.toLocaleString()}
            </td>
            <td
              className={`py-3 px-2 text-right font-medium ${
                coin.priceChangePercentage24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {coin.priceChangePercentage24h?.toFixed(2)}%
            </td>
            <td className="py-3 px-2 text-right text-gray-200">
              ${coin.marketCap?.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CoinTable;