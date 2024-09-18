# trade-vista
# TradeVista

TradeVista is a trading portfolio management application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides comprehensive dashboards for both clients and administrators, allowing for efficient management and monitoring of trading activities and portfolios.

## Table of Contents

1. [Modules Overview](#modules-overview)
2. [Functional Requirements](#functional-requirements)
   - [Client Dashboard](#client-dashboard)
   - [Admin Dashboard](#admin-dashboard)
   - [Portfolio Management](#portfolio-management)
3. [Non-Functional Requirements](#non-functional-requirements)
   - [Security](#security)
   - [Scalability](#scalability)
   - [Performance](#performance)
4. [User Interface Requirements](#user-interface-requirements)
   - [Client Dashboard UI](#client-dashboard-ui)
   - [Admin Dashboard UI](#admin-dashboard-ui)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

## Modules Overview

- **Client Dashboard**: Displays client information, portfolio details, and allows management of positions and recent transactions.
- **Admin Dashboard**: Admin functionality to manage client portfolios and monitor trading activities.

## Functional Requirements

### Client Dashboard

**Funds**
- **Total Cash**: Displays the total invested amount by the client.
- **Available to Trade**: Shows the available balance for the client to use for trades.
- **Margin Used**: Indicates the amount of margin that has been utilized by the client.
- **Recent Transactions**: Displays a list of recent trades that have been closed, including details like stock name, buy/sell price, and profit/loss (P/L).

**Profile**
- **Name**: Displays the client's full name.
- **User ID**: Shows the client’s unique identification number.
- **Password Management**: Allows the client to change their password securely.

**Positions**
- **Stock Name**: Lists the stocks in which the client has current investments.
- **Status (Open/Closed)**: Displays the status of positions that are still active or closed. If the position is closed:
  - **Close Rate**: Displays the price at which the stock was sold.
  - **Profit/Loss (P/L)**: Shows the profit or loss associated with the trade.

### Admin Dashboard

**Client Management**
- **Client Name**: Displays the full name of the client.
- **User ID**: Shows the unique ID for each client.
- **Password**: Allows the admin to view or reset the client's password.
- **Total Cash**: Displays the total invested amount for each client.
- **Available to Trade**: Shows the remaining balance that the client can use for trades.
- **Margin Used**: Displays the amount of margin that has been used by the client.

### Portfolio Management

The portfolio section allows both clients and admins to track and manage investments:
- **Stock Name**: Lists the names of the stocks in the portfolio.
- **Buy Price**: Shows the price at which the stock was bought.
- **Sell Price**: Displays the price at which the stock was sold (if closed).
- **Profit/Loss (P/L)**: Displays the profit or loss associated with the trade.
- **Status (Open/Closed)**: Displays the status of positions that are still active or closed. If the position is closed:
  - **Close Rate**: Displays the price at which the stock was sold.
  - **Profit/Loss (P/L)**: Shows the profit or loss associated with the trade.

## Non-Functional Requirements

### Security
- Passwords should be encrypted and stored securely.
- User authentication should be handled via a secure login mechanism.
- Secure data transmission (**SSL/TLS**) should be implemented for both client and admin dashboards.

### Scalability
- The application should be able to handle multiple clients simultaneously.
- It should support growth in data volume as client portfolios expand.

### Performance
- The system should ensure real-time updates on portfolio status and available funds.
- Response times for retrieving portfolio and transaction data should be optimized for a seamless user experience.

## User Interface Requirements

### Client Dashboard UI
- The dashboard should be intuitive, with real-time updates on available funds, recent transactions, and open positions.
- A simple form for password change.
- A clear tab or section to view closed trades (recent transactions).
- References for UI:
  - [Upstox](https://upstox.com)
  - [Dhan](https://dhan.co)
  - [Angel One](https://angelone.in)

### Admin Dashboard UI
- A search function to easily locate specific clients.
- An editable view for updating client details (password, funds, etc.).
- A consolidated portfolio view for each client, showing key metrics like P/L, total cash, and margin used.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tradevista.git
   cd tradevista
