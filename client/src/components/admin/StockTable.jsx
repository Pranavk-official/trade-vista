const StockTable = ({ stocks, onStockSelect }) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr>
          <th>Stock Name</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>Available Quantity</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr
            key={stock._id}
            onClick={() => onStockSelect(stock)}
            className="hover cursor-pointer"
          >
            <td>{stock.stockName}</td>
            <td>{stock.stockSymbol}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>{stock.availableQuantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StockTable;
