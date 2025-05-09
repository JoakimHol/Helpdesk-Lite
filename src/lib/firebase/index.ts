// src/lib/firebase/index.ts
import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; // Example for Storage

const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

const baseErrorMessage = "Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG because it is not valid JSON.";
const hintMessage = "Please check the NEXT_PUBLIC_FIREBASE_CONFIG environment variable in your .env file or deployment settings. It must be a complete and correctly formatted JSON string (e.g., '{\"projectId\":\"your-project-id\", \"apiKey\":\"your-key\", ...}').";


if (!firebaseConfigString) {
  console.error("Firebase config environment variable NEXT_PUBLIC_FIREBASE_CONFIG is not set.");
  throw new Error(`Missing Firebase config environment variable: NEXT_PUBLIC_FIREBASE_CONFIG. ${hintMessage}`);
}

let firebaseConfig: FirebaseOptions;

try {
  firebaseConfig = JSON.parse(firebaseConfigString);
} catch (e) {
  console.error(baseErrorMessage, e);
  if (e instanceof Error) {
     throw new Error(`${baseErrorMessage} The JSON parser reported: "${e.message}". ${hintMessage}`);
  } else {
     throw new Error(`${baseErrorMessage} ${hintMessage} An unexpected issue occurred during parsing: ${String(e)}`);
  }
}

// Validate essential config properties
if (!firebaseConfig.projectId) {
  console.error("Invalid Firebase config: 'projectId' is missing in NEXT_PUBLIC_FIREBASE_CONFIG.", firebaseConfig);
  throw new Error(`Invalid Firebase config: 'projectId' is missing. ${hintMessage}`);
}
if (!firebaseConfig.apiKey) {
    // Depending on auth needs, apiKey might be critical
    console.warn("Firebase config warning: 'apiKey' is missing. This might be an issue if you plan to use Firebase Authentication or other services requiring an API key.");
}


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
// const storage = getStorage(app); // Example for Storage, uncomment if needed

export { app, db }; // Add 'storage' if you uncomment and use it
