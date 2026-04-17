# 🏢 Apartment Maintenance & Billing Portal

A full-stack **MERN** web app to manage apartment complexes — built for both admins and residents.

## ✨ Features

### 👨‍💼 Admin
- 🏠 Manage flats and resident details
- 💰 Generate monthly maintenance bills
- 📢 Post notices and announcements
- 🔧 View and resolve resident complaints
- 📊 Monitor resident feedback

### 👥 Resident
- 📋 Dashboard with pending bills and notices
- 💳 View bills and simulate payments
- 📣 Read society announcements
- 🛠️ Raise and track complaints
- 💬 Submit feedback to admin

## 🛠️ Tech Stack

|  Layer   | Tech |
|----------|--------|
| Frontend | React (Vite), Axios, CSS |
| Backend  | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth     | JWT (Admin / Resident roles) |

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/sahitya-koritala/Apartment-Maintenance-and-Billing-Portal.git
cd Apartment-Maintenance-and-Billing-Portal
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

➡️ Open [http://localhost:5173](http://localhost:5173)

## 🎯 Key Highlights

- Full-stack MERN implementation
- Role-based access (Admin & Resident)
- RESTful API architecture
- Clean and responsive UI
- Scalable and modular code structure

## 🚀 Future Improvements
- Online payment integration
- Email/SMS notifications
- Admin analytics dashboard
