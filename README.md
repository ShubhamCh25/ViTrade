# VitTrade – Student Marketplace Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![Built With](https://img.shields.io/badge/Built%20With-MERN-Stack-blue.svg)](https://github.com/ShubhamCh25/VitTrade)

## 🚀 Project Overview  
VitTrade is a full-stack web application designed to enable students within a campus ecosystem to **buy**, **sell**, and **trade** items in a secure, intuitive, and responsive interface.  
It supports user authentication, product uploads/listings, cart and order management, and real-time notifications.

## 🧩 Features  
## 🧩 Features  
• User registration, login, and protected routes using JWT authentication.  
• Product listing with image uploads, item viewing, and trading/bidding functionality.  
• Shopping cart system with real-time order confirmation flow.  
• Event-driven notifications implemented through AWS SNS and Lambda functions.  
• Centralized user dashboard for product uploads, order history, profile, and cart management.  
• Responsive UI  built using React and Tailwind CSS.  


## 🛠️ Technology Stack  
**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Cloud / Hosting / Services:** AWS Lambda (backend functions), AWS SNS (notifications), AWS S3 (image storage)  
**Authentication:** JWT (JSON Web Token)  
**Architecture:** MERN Stack  

## 📁 Repository Structure  
/
├── client/ # React frontend source
├── server/ # Express backend source
├── models/ # MongoDB schema definitions
├── routes/ # API endpoints (Express)
├── aws/ # AWS Lambda & SNS setup scripts
├── uploads/ # Temporary local file storage (or S3 references)
├── .env.example # Environment variables template
├── README.md # Project overview
└── LICENSE # MIT License

bash
Copy code

## 🧬 Installation & Setup  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/ShubhamCh25/VitTrade.git
   cd VitTrade
Set up environment variables
Create a .env file in server/ with the following sample:

dotenv
Copy code
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_SNS_TOPIC_ARN=your_sns_topic_arn
AWS_S3_BUCKET=your_s3_bucket_name
Install dependencies

bash
Copy code
# In server/
npm install  
# In client/
cd client && npm install  
Run the application

bash
Copy code
# In server/
npm run dev    # or whatever start script  
# In client/
cd client && npm start  
The frontend should open (e.g., on http://localhost:3000) and backend on its port (e.g., http://localhost:5000).

