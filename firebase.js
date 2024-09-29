// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7v-9AuU1TgsJWGwLbbdiiK3fD1DwWaRc",
  authDomain: "moiden69.firebaseapp.com",
  projectId: "moiden69",
  storageBucket: "moiden69.appspot.com",
  messagingSenderId: "317697788980",
  appId: "1:317697788980:web:71391ecdb8fd528ee90e61",
  measurementId: "G-7C0S50S8CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Handle sign-up form submission
document
  .getElementById("signup-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    // Get the values from the input fields
    const email = document.getElementById("input-email-signup").value; // Ensure unique IDs
    const password = document.getElementById("input-password-signup").value;
    const reenterPassword = document.getElementById(
      "input-reenter-password"
    ).value;
    const errorMessage = document.getElementById("error-message");

    // Clear previous error message
    errorMessage.textContent = "";

    // Check password length
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // Check if passwords match
    if (password !== reenterPassword) {
      errorMessage.textContent = "Mật khẩu không khớp. Vui lòng kiểm tra lại.";
      return;
    }

    // Disable the submit button to prevent double submission
    const signupButton = document.getElementById("signup-form-btn");
    signupButton.disabled = true;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up successfully
        alert("Đã đăng ký thành công!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;
        console.log("Error Code:", errorCode);
        console.log("Error Message:", errorMsg);

        if (errorCode === "auth/email-already-in-use") {
          errorMessage.textContent =
            "Email này đã được sử dụng. Vui lòng sử dụng một email khác.";
        } else {
          errorMessage.textContent = errorMsg;
        }
      })
      .finally(() => {
        // Re-enable the submit button in case of error or success
        signupButton.disabled = false;
      });
  });

// Handle sign-in form submission
document
  .getElementById("login-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("input-email-login").value; // Ensure unique IDs
    const password = document.getElementById("input-password-login").value;
    const rememberMe = document.getElementById("remember-me-btn").checked;
    const errorMessage = document.getElementById("signin-error-message");

    // Clear previous error message
    if (errorMessage) {
      errorMessage.textContent = "";
    }

    // Check for empty fields
    if (!email || !password) {
      alert("Vui lòng điền cả email và mật khẩu.");
      return;
    }

    // Sign in using Firebase Auth
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (rememberMe) {
          const encodedEmail = encodeBase64(email);
          localStorage.setItem("dXNlckVtYWls", encodedEmail);
        }
        window.location.href = "./index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;

        if (errorMessage) {
          errorMessage.textContent = errorMsg; // Display error message
        }

        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          alert("Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.");
        } else {
          alert(errorMsg); // Show other error messages as alerts
        }
      });
  });

// Function to encode Base64
function encodeBase64(str) {
  return btoa(str); // btoa() encodes a string to Base64
}

// Function to decode Base64
function decodeBase64(encodedStr) {
  return atob(encodedStr); // atob() decodes a Base64 encoded string
}

// Function to check if the user has bought a service
async function check_service(user_id, bought_service) {
  try {
    console.log(
      "Checking service for user ID:",
      user_id,
      "and bought service:",
      bought_service
    );

    const userBoughtServiceRef = collection(db, "user-bought-service");
    const q = query(
      userBoughtServiceRef,
      where("user_id", "==", user_id),
      where("bought_service", "==", bought_service)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    } else {
      querySnapshot.forEach((doc) => {
        console.log("Document data:", doc.data());
      });
      return true;
    }
  } catch (error) {
    console.error("Error checking service:", error.message);
    return false;
  }
}

// Check if localStorage for bought service exists
if (localStorage.getItem("Ym91Z2h0X3NlcnZpY2U=") === null) {
  console.log("localStorage for bought service has not been created!");
  localStorage.setItem("Ym91Z2h0X3NlcnZpY2U=", "bWllbnBoaQ==");
}

// Uncomment this to check service when needed
// const userId = decodeBase64(localStorage.getItem('dXNlckVtYWls')).trim();
// const service = 'sieuden'.trim();

// check_service(userId, service).then((result) => {
//   if (result) {
//     console.log('The user has already bought sieuden.');
//     localStorage.setItem('Ym91Z2h0X3NlcnZpY2U=', 'c2lldWRlbg==');
//   } else {
//     console.log('The user has not bought sieuden.');
//   }
// }).catch((error) => {
//   console.error("Error in check_service function:", error.message);
// });
