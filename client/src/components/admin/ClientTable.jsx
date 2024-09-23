const ClientTable = ({ clients, onClientSelect }) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr>
          <th>Client Name</th>
          <th>User ID</th>
          <th>Total Cash</th>
          <th>Available to Trade</th>
          <th>Margin Used</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr
            key={client._id}
            onClick={() => onClientSelect(client)}
            className="hover cursor-pointer"
          >
            <td>{client.name}</td>
            <td>{client.userId}</td>
            <td>${client.totalCash.toFixed(2)}</td>
            <td>${client.availableToTrade.toFixed(2)}</td>
            <td>${client.marginUsed.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ClientTable;
