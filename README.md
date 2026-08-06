# 🧵 TexTrade – AI Powered Textile Marketplace

TexTrade is a full-stack B2B textile marketplace that connects textile suppliers and buyers through a modern web platform. The application enables users to browse fabrics, view detailed specifications, manage products, and experience AI-assisted recommendations with secure online payments.

---

## 🚀 Live Demo

**Application:** http://44.255.68.238

**GitHub Repository:** https://github.com/Poornima-Tembad/market-application

---

## ✨ Features

- User Authentication
- Browse Textile Products
- Product Categories & Search
- Product Details
- Supplier Dashboard
- Shopping Cart
- Razorpay Payment Gateway (Test Mode)
- AI Integration using Hugging Face API
- Responsive User Interface
- MongoDB Atlas Database
- Dockerized Deployment
- AWS EC2 Hosting

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### AI
- Hugging Face API

### Payment
- Razorpay Test Mode

### DevOps & Deployment
- Docker
- Docker Compose
- AWS EC2
- Git & GitHub

---

## 📂 Project Structure

```
market-application
│
├── client/
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── .env
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

HUGGINGFACE_API_KEY=your_huggingface_api_key

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 💻 Installation

### Clone Repository

```bash
git clone https://github.com/Poornima-Tembad/market-application.git

cd market-application
```

---

### Backend

```bash
cd server

npm install

npm run dev
```

---

### Frontend

```bash
cd client

npm install

npm start
```

---

## 🐳 Docker Deployment

Build and run the complete application:

```bash
docker compose up --build
```

Run in background

```bash
docker compose up -d
```

Stop

```bash
docker compose down
```

---

## ☁️ AWS Deployment

The application is deployed on an AWS EC2 Ubuntu instance using Docker Compose.

Services:

- Frontend Container
- Backend Container
- MongoDB Atlas
- Razorpay Integration
- Hugging Face API

---

## 📸 Screenshots

Add screenshots here.

- Home Page
- Marketplace
- Product Details
- Supplier Dashboard
- Payment Page

---

## 🔮 Future Improvements

- Order Tracking
- Inventory Analytics Dashboard
- Email Notifications
- Supplier Image Upload
- AI Chat Assistant
- Product Recommendation Engine
- Admin Dashboard

---

## 👩‍💻 Author

**Poornima Tembad**

GitHub: https://github.com/Poornima-Tembad

LinkedIn: *(Add your LinkedIn profile here)*

---

## 📄 License

This project is developed for educational and hackathon purposes.
