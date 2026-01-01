# MediStore Pro

A MERN stack application for Medical Store Management and Checkups.

## Features
- **Medicine Inventory**: 
  - Upload Medicines via XLSX.
  - Edit Quantity and Price.
  - Add to Cart and Generate Receipt (Print/Download).
- **Patient Checkups**:
  - Register new checkup (CBC, Widal, etc.).
  - Print Diagnostic Reports.
  - View Checkup History.

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB installed and running locally on port 27017.

### 2. Backend Setup
1. Open a terminal in the root directory.
2. Navigate to server:
   ```bash
   cd server
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal.
2. Navigate to client:
   ```bash
   cd client
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Client runs on `http://localhost:5173` (or 5174 if 5173 is busy).

## Usage
- Go to `http://localhost:5173` in your browser.
- Use the **Inventory** tab to manage medicines.
- Use the **Checkups** tab to handle patient tests.
