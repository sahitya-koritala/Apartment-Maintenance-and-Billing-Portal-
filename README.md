# 🏢 Apartment Maintenance and Billing Portal

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A comprehensive, full-stack **MERN** (MongoDB, Express, React, Node.js) web application designed to streamline the management of apartment complexes. This portal provides administrators with full control over flats, residents, billing, and notices, while empowering residents to view their bills, make payments, submit feedback, and raise complaints seamlessly.

## ✨ Features

### 👨‍💼 For Administrators
- **User & Flat Management**: Easily add, edit, and keep track of flats and resident details.
- **Billing System**: Generate monthly maintenance bills manually or systematically for all flats.
- **Notice Board Management**: Broadcast announcements and notices to all residents.
- **Complaint Resolution**: View complaints raised by residents (mapped to their respective flats) and update their statuses.
- **Feedback Analysis**: Monitor feedback submitted by residents to continuously improve apartment services.

### 👥 For Residents
- **Dashboard Overview**: A quick glance at recent activities, pending bills, and active notices.
- **Billings & Payments**: View individual maintenance bills and simulate payments.
- **Notice Board**: Stay updated with the latest society announcements.
- **Complaint Box**: Raise issues and track their resolution status.
- **Feedback System**: Provide valuable feedback directly to the administration.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Router DOM, Axios, Vanilla CSS (Premium & modern UI/UX).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Authentication**: JWT (JSON Web Tokens) or session-based authentication based on user roles (Admin/Resident).

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Database (Local or MongoDB Atlas)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahitya-koritala/Apartment-Maintenance-and-Billing-Portal.git
   cd Apartment-Maintenance-and-Billing-Portal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory and configure the environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the React (Vite) development server:
     ```bash
     npm run dev
     ```

4. **Access the Application**
   - Head over to `http://localhost:5173` (or the port specified by Vite) in your browser.

## 📸 Screenshots

*(You can add screenshots of your application here by uploading them to your repository and linking them)*

- **Dashboard:** `<img src="link-to-image" width="600" />`
- **Billing Portal:** `<img src="link-to-image" width="600" />`
- **Notice Board:** `<img src="link-to-image" width="600" />`

## 🛣️ Project Structure

```text
├── backend/                # Node.js + Express backend
│   ├── models/             # Mongoose schemas (User, Flat, Bill, Payment, Complaint, Feedback, Notice)
│   ├── routes/             # API endpoints
│   ├── server.js           # Entry point for backend
│   └── .env                # Backend environment variables
├── frontend/               # Vite + React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application views/pages
│   │   ├── index.css       # Core vanilla CSS styles
│   │   └── App.jsx         # Main application routing
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is [MIT](LICENSE) licensed.
