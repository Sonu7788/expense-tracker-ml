#  Expense Tracker with Voice Input & ML Predictions  
A smart **full-stack Expense Tracker** built using **MERN + FastAPI ML microservice**.  
Users can add expenses manually or through **voice commands**, view history, and get **next-month spending predictions** using a machine learning model.

---

##  Features

###  Authentication
- Secure JWT-based login & register  
- Protected user routes  

###  Expense Tracking
- Add expenses (amount, category, note)  
- Voice input for hands-free use  
- Real-time UI updates  
- Recent expenses list  

###  Machine Learning Suggestions
- Predicts next month’s spending  
- Suggests safe budget  
- Shows current month total  
- Detects trends and gives tips  

###  UI/UX
- Clean design  
- Light & Night mode  
- Soft blue-green theme  
- Smooth animations  

---

##  Tech Stack

### Frontend (React)
- React.js  
- Axios  
- SpeechRecognition API  
- Modern CSS (custom)

### Backend (Node + Express)
- Express.js  
- JWT Authentication  
- MongoDB Atlas  
- Mongoose  

### ML Microservice (Python)
- FastAPI  
- NumPy  
- Simple regression model  

---

## 📁 Folder Structure


---

##  2️ Setup Backend (Express)


Create `.env`:
MONGO_URI=mongodb+srv://<your-url>/expense_tracker
JWT_SECRET=yourSecretKey
ML_API_URL=http://localhost:8000
MONGO_URI=mongodb+srv://<your-url>/expense_tracker
JWT_SECRET=yourSecretKey
ML_API_URL=http://localhost:8000


/// for ml-
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

// frontend
cd client
npm install
npm run dev
