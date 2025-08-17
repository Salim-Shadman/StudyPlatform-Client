# StudyPlatform - Frontend (Client-Side)

This is the client-side code for the StudyPlatform project, built with React and Vite. This application provides a beautiful and functional interface for users to browse study sessions, book them, and access learning materials.

---

## 🔗 Live Site URL

**Live Site:** `https://ph-assignment-12-ameo.web.app`
**Admin email:** admin@gmail.com
**Admin pass:** admin123

---

## ✨ Features

#### General Features
* View all study sessions and filter them by category.
* View detailed information for any session, including tutor info and reviews.
* Register and log in using email/password or Google.

#### Student Dashboard
* View all booked sessions.
* Submit reviews for booked sessions.
* Create, update, and delete personal notes.
* View and download study materials uploaded for a session.
* Process payments for paid sessions via Stripe.

#### Tutor Dashboard
* Submit new study sessions for admin approval.
* View the status (Pending, Approved, Rejected) of created sessions.
* Upload, update, and delete study materials for their approved sessions.

#### Admin Dashboard
* Manage all users (including changing their roles).
* Manage all study sessions (Approve/Reject).
* View and delete any study materials.
* View user login history.

---

## 🛠️ Technology Stack

* **Framework/Library:** React, Vite
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS, DaisyUI
* **Authentication:** Firebase Authentication
* **Data Fetching:** Axios
* **Payment:** Stripe.js
* **Notifications:** React Hot Toast

---

## 🚀 Local Setup and Installation

Follow these steps to run the project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/study-platform-client.git](https://github.com/your-username/study-platform-client.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd study-platform-client
    ```

3.  **Install the necessary packages:**
    ```bash
    npm install
    ```

4.  **Create an Environment File:**
    Create a `.env` file in the root directory and add your Firebase and server configuration variables.

    ```env
    # Backend Server URL
    VITE_API_URL=http://localhost:5000

    # Firebase Configuration
    VITE_API_KEY="your_firebase_api_key"
    VITE_AUTH_DOMAIN="your_firebase_auth_domain"
    VITE_PROJECT_ID="your_firebase_project_id"
    VITE_STORAGE_BUCKET="your_firebase_storage_bucket"
    VITE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
    VITE_APP_ID="your_firebase_app_id"

    # Stripe Publishable Key
    VITE_STRIPE_PUBLISHABLE_KEY="your_stripe_pk_key"
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```