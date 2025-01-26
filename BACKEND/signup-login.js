// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCT5VEPzxAz01SLVeV9CoH9l_E5vLoTuvQ",
    authDomain: "login-96cbb.firebaseapp.com",
    projectId: "login-96cbb",
    storageBucket: "login-96cbb.firebasestorage.app",
    messagingSenderId: "41040779933",
    appId: "1:41040779933:web:9b5ccae2401c5f44e41274",
    databaseURL: "https://test-b0116-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.innerText = message;
    } else {
        console.error(`Div with id "${divId}" not found.`);
    }
}

const signUp = document.getElementById("sign-up-button");

if (signUp) {
    signUp.addEventListener("click", async (event) => {
        event.preventDefault();

        // Get form values
        const email = document.getElementById("email-input")?.value || "";
        const password = document.getElementById("confirm-password-input")?.value || "";
        const username = document.getElementById("username-input")?.value || "";

        // Basic validation
        if (!email || !password || !username) {
            showMessage("All fields are required.", "bottom-text");
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user data to Firestore
            const userData = { email, username };
            const docRef = doc(db, "users", user.uid);
            await setDoc(docRef, userData);

            // Success message and redirection
            showMessage("Account created successfully.", "bottom-text");
            window.location.href = "LOGIN.html";
        } catch (error) {
            console.error("Error during sign-up:", error);
            if (error.code === "auth/email-already-in-use") {
                showMessage("Email already in use.", "bottom-text");
            } else {
                showMessage("Unable to create account.", "bottom-text");
            }
        }
    });
} else {
    console.error('Sign-up button not found.');
}

const signIn = document.getElementById("login-button");
signIn.addEventListener("click", (event) => {
    event.preventDefault();
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            showMessage("Login succesful", "bottom-text");
            const user = userCredential.user;
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "home.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/invalid-credential") {
                showMessage("Incorrect Email or Password", "bottom-text");
            }
            else {
                showMessage("Account does not exist...", "bottom-text");
            }
        })
});
