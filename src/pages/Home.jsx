import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins, fetchCoinCount, setCategory, setPage } from "../redux/coin/coinSlice";
import CoinTable from "../components/CoinTable";

const tabs = [
  { label: "All", value: "all" },
  { label: "Top 50", value: "top50" },
  { label: "Top Gainers", value: "gainers" },
  { label: "Top Losers", value: "losers" },
];

function Home() {
  const dispatch = useDispatch();
  const { coins, status, category, page, pageSize, totalCoins } = useSelector(
    (state) => state.coin
  );

  useEffect(() => {
    dispatch(fetchCoins({ category, page, size: pageSize }));
  }, [dispatch, category, page, pageSize]);

  useEffect(() => {
    if (category === "all") {
      dispatch(fetchCoinCount());
    }
  }, [dispatch, category]);

  const totalPages = Math.ceil(totalCoins / pageSize);

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1">
        <div className="flex gap-2 mb-4">
  {tabs.map((tab) => (
    <button
      key={tab.value}
      onClick={() => dispatch(setCategory(tab.value))}
      className={`pill ${category === tab.value ? "pill-active" : "pill-inactive"}`}
    >
      {tab.label}
    </button>
  ))}
</div>

        <div className="card card-hover p-4">
  {status === "loading" ? (
    <p className="text-center text-gray-500 py-8">Loading coins...</p>
  ) : (
    <CoinTable coins={coins} />
  )}
</div>

        {category === "all" && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600 px-2">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="w-72 shrink-0">
  <div className="card p-4 bg-gradient-to-br from-slate-950 to-blue-950 text-white border-none">
    <h3 className="font-semibold mb-2">Bitcoin</h3>
    <p className="text-sm text-gray-300">Chart coming next</p>
  </div>
</div>
    </div>
  );
}

export default Home;