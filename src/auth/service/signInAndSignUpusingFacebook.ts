import {FacebookAuthProvider, getAuth, signInWithPopup, User} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from "../../CloudConfig/getFirebaseConfig";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get the Firebase auth instance
const auth = getAuth(app);

// Create the Facebook provider
const facebookProvider = new FacebookAuthProvider();

// Function to perform Facebook authentication
export const signInWithFacebook = async (): Promise<User> => {
    // Sign in with the Facebook popup
    const result = await signInWithPopup(auth, facebookProvider);
    console.log(result);
    // Get the user data
    const user = result.user;

    // Return the user object
    return user;
};
