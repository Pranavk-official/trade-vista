export const ClientPositions = ({ client }) => {
  console.log(client);

  if (!client) return null;

  return (
    <div className="card bg-base-100 shadow-xl mt-8">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          Client Details: {client.name}
        </h2>
        <div className="stats shadow mb-4">
          <div className="stat">
            <div className="stat-title">Total Cash</div>
            <div className="stat-value">${client.totalCash.toFixed(2)}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Available to Trade</div>
            <div className="stat-value">
              ${client.availableToTrade.toFixed(2)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Margin Used</div>
            <div className="stat-value">${client.marginUsed.toFixed(2)}</div>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Open Positions</h3>
        {client.positions && client.positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Quantity</th>
                  <th>Buy Price</th>
                  <th>Current Price</th>
                  <th>P/L</th>
                  <th>P/L %</th>
                </tr>
              </thead>
              <tbody>
                {client.positions.map((position) => (
                  <tr key={position.id}>
                    <td>{position.stockId.stockName}</td>
                    <td>{position.quantity}</td>
                    <td>${position?.buyPrice?.toFixed(2)}</td>
                    <td>${position?.stockId.price?.toFixed(2)}</td>
                    <td
                      className={
                        position.profitLoss >= 0 ? "text-success" : "text-error"
                      }
                    >
                      ${position?.profitLoss?.toFixed(2)}
                    </td>
                    <td
                      className={
                        position.profitLoss >= 0 ? "text-success" : "text-error"
                      }
                    >
                      {(
                        (position.profitLoss /
                          (position.buyPrice * position.stockId.quantity)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No open positions for this client.</p>
        )}
      </div>
    </div>
  );
};
