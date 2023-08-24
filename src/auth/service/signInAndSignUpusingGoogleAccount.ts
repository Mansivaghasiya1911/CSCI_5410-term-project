import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../CloudConfig/getFirebaseConfig";

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signUpWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        console.log(token);
        console.log(user);
        return user;
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential_1 = GoogleAuthProvider.credentialFromError(error);

        console.log(errorCode);

        console.log(errorMessage);

        console.log(email);

        console.log(credential_1);

        alert(errorMessage);
        return null;
    }
};
