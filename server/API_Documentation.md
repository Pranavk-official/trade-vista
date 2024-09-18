# REST API Documentation for Portfolio Management App

## Overview
This is the REST API documentation for the Portfolio Management application. The API allows clients to manage their portfolio and admins to manage stocks and clients.

---

## Endpoints

### Client Dashboard

#### 1. GET /api/client/dashboard
- **Description**: Fetch client dashboard details including funds, recent transactions, and open positions.
- **Request**: 
- **Response**: JSON object with:
  - Total Cash
  - Available to Trade
  - Margin Used
  - Recent Transactions (Stock Name, Buy/Sell Price, Profit/Loss)
  - Open/Closed Positions

#### 2. POST /api/client/update-password
- **Description**: Allows the client to securely update their password.
- **Request**: , , 
- **Response**: Status of password update.

---

### Admin Dashboard

#### 1. GET /api/admin/clients
- **Description**: Fetch list of clients and their portfolio status.
- **Response**: JSON array of clients with their portfolio details.

#### 2. POST /api/admin/update-client
- **Description**: Admin can update client details including resetting the password or updating cash balance.
- **Request**: , , , , 
- **Response**: Status of the update.

---

### Stock Management

#### 1. GET /api/stocks
- **Description**: Fetch all stocks managed by the admin.
- **Response**: JSON array of stocks with:
  - Stock Name
  - Stock Symbol
  - Current Price
  - Available Quantity

#### 2. POST /api/stocks/add
- **Description**: Admin can add a new stock to the portfolio.
- **Request**: , , , 
- **Response**: Status of stock creation.

#### 3. PUT /api/stocks/update/:stockId
- **Description**: Admin can update stock details such as price and available quantity.
- **Request**: , , 
- **Response**: Status of stock update.

#### 4. DELETE /api/stocks/delete/:stockId
- **Description**: Admin can delete a stock from the system.
- **Request**: 
- **Response**: Status of stock deletion.

---

### Portfolio Management

#### 1. GET /api/portfolio/:clientId
- **Description**: Fetch portfolio details of the client.
- **Response**: JSON array of stock holdings and their status (open/closed), profit/loss details.

#### 2. POST /api/portfolio/transaction
- **Description**: Record a transaction (buy/sell) for a stock.
- **Request**: , , , , , 
- **Response**: Status of the transaction record.

---

## Security
- **Authentication**: JWT-based authentication is used for both admin and client logins.
- **Password Encryption**: Passwords are encrypted using bcryptjs before being stored in the database.
- **SSL/TLS**: All data transmission should be done over SSL/TLS to ensure secure communication.

## Errors
All errors follow a consistent format:
- **Error Object**: 

