# Project3: Guess Country Game

## Project Objective
Guess Country Game is an interactive educational web application that helps users learn world geography through a flag-based quiz game. Players test their knowledge by identifying countries from their flags, while administrators can manage the country database through a comprehensive CRUD interface. The application combines an engaging game experience with robust content management capabilities.

## Screenshot
<img width="1463" height="808" alt="A thumbnail of Guess Country Game App" src="https://raw.githubusercontent.com/RanFukazawa/project3-guess-country-game-react/project3_thumbnail.png" />


## Tech Requirements
### Frontend
- React (v19.1.1)
- React Router DOM (v7.9.6)
- Vite (v7.1.7)
- React BootStrap (v2.10.10)
- Bootstrap (v5.3.8)

### Backend
- Node.js (v22.x)
- Express.js (v4.16.1)
- MongoDB Driver (v7.0.0)
- ES6 Modules

### Database
- MongoDB Atlas (cloud database)

### External Services
- [Flagpedia CDN](https://flagcdn.com) for country flag images

### Deployment
- Render (web service platform)

## How to Install/Use Locally
### Prerequisites
- Node.js (v22.x or higher)
- MongoDB Atlas account (free tier)

### Installation Steps
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/RanFukazawa/project3-guess-country-game-react
   cd project3-guess-country-game-react

2. Install backend dependencies:
   ```bash
   cd backend
   npm install

3. Install frontend dependencies:
    ```bash
    cd ../frontend
    npm install

4. Set up environment variables: Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/guessCountryGame?retryWrites=true&w=majorityrecipeFinder
   PORT=3000
   NODE_ENV=production

5. Populate the database with initial country data (15-20 countries) via the Admin Panel after starting the servers.

6. Start the backend server:
    ```bash
    cd backend
    npm start
    # Backend will run on http://localhost:3000

7. Start the frontend development server (in a new terminal):
    ```bash
    cd frontend
    npm run dev
    # Frontend will run on http://localhost:5173

8. Open your browser and navigate to:
    ```bash
    http://localhost:5173

## How to Deploy to Render

### Prerequisites
- Render account (free tier works)
- MongoDB Atlas account (free tier works)
- GitHub repository with your code

### Deployment Steps
1. Set up MongoDB Atlas:
    - Create a free cluster at MongoDB Atlas
    - Create a database named `guessCountryGame`
    - Create a database user with read/write permissions    
    - Whitelist all IPs (0.0.0.0/0) under Network Access
    - Get your connection string

2. Prepare your repository:
    - Ensure your code is pushed to GitHub
    - Verify `.env` is in `.gitignore` (never commit credenitals!)
    - Update `backend/server.js` to server static React files in production

3. Deploy via Render Dashboard:
    - Go to render.com
    - Click "New+" -> "Web Service"
    - Connect to your GitHub repository
    - Configure project settings:
        - **Name**: guess-country-game
        - **Runtime**: Node
        - **Build Command**:
        ```bash
            cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install
        ```
        - **Start Command**:
        ```bash
        cd backend && npm start

4. Add environment variables in Render:
- Go to Environment tab
- Add the following variables:
    - `NODE_ENV` = `production`
    - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/guessCountryGame?retryWrites=true&w=majorityrecipeFinder`
    - Click "Save Changes"

5. Deploy:
    - Render will automatically build and deploy your application
    - Wait for the build to complete (5-10 minutes)

6. Access your live app:
    ```bash
    https://guess-country-game.onrender.com

7. Populate the database:
    - Navigate to `/admin` on your deployed site
    - Add 15-20 countries through the admin panel

## Author
Ran Fukazawa

[Visit Guess Country Game App](https://project3-guess-country-game-react.onrender.com/)

## Reference
This project was created as part of [CS5610 Project 3](https://northeastern.instructure.com/courses/225993/assignments/2901102) coursework.

## Video Demonstration
[Link to video](https://youtu.be/zweU2uy4QmQ)

## Generative AI Usage
This project used **Claude.ai Sonnet4.5** (by Anthropic) for assistance in the following areas:  

1. **Backend API Development**  
   - **Prompt:**  
     *"I'm getting 'myDB.getCountries is not a function' error. Here's my MongoDB code..."*  
   - **Outcome:** Fixed function naming mismatches, implemented proper MongoDB connection handling, corrected module exports, and established RESTful API endpoints for CRUD operations.  

2. **React State Management and Form Handling**  
   - **Prompt:**  
     *"My form is submitting but country data isn't being saved to MongoDB. No errors are showing."*  
   - **Outcome:** Implemented proper controlled components with useState, fixed form submission handlers, established proper data flow from frontend to backend, and added proper error handling and validation.  

3. **Deployment Configuration**  
   - **Prompt:**  
     *"I'm deploying to Render but getting 502 Bad Gateway. Here are my logs..."*  
   - **Outcome:** Configured proper build commands for monorepo structure, fixed server binding to 0.0.0.0, set up environment variables correctly, and configured Express to serve React static files in production.

4. **Documentation**
    - **Prompt:**  
     *"Help me create a professional design document and README for my Guess Country Game project"*  
    - **Outcome:** Created comprehensive design document with user stories, structured README with installation and deployment guides, and documented API endpoints and project architecture.

