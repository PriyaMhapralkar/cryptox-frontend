import { useNavigate } from "react-router-dom";

function CoinTable({ coins }) {
  const navigate = useNavigate();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b">
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
            className="border-b hover:bg-gray-50 cursor-pointer"
          >
            <td className="py-3 px-2 text-gray-500">{coin.marketCapRank}</td>
            <td className="py-3 px-2 flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
              <span className="font-medium">{coin.name}</span>
              <span className="text-gray-400 uppercase">{coin.symbol}</span>
            </td>
            <td className="py-3 px-2 text-right">
              ${coin.currentPrice?.toLocaleString()}
            </td>
            <td
              className={`py-3 px-2 text-right font-medium ${
                coin.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {coin.priceChangePercentage24h?.toFixed(2)}%
            </td>
            <td className="py-3 px-2 text-right">
              ${coin.marketCap?.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CoinTable;