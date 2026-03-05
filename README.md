# Traffic Stats UI

A React + TypeScript frontend built with Vite, using Firebase Authentication.

## Prerequisites

- Node.js 18+
- A Firebase project set up at [console.firebase.google.com](https://console.firebase.google.com)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=https://us-central1-your-project-id.cloudfunctions.net/api/on_request
```

You can find all Firebase values in the Firebase Console under **Project Settings → Your apps**.

> **Note:** In development, `VITE_API_BASE_URL` can point to your local emulator URL (e.g. `http://127.0.0.1:5001/your-project-id/us-central1/api`) if you are running the backend locally with the Firebase emulators.

### 3. Enable Google Sign-In

In the Firebase Console, go to **Authentication → Sign-in method** and enable **Google**.

## Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to be deployed or served statically.
