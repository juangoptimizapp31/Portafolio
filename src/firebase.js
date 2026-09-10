import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCZkf-CgJO1o-rvahNhtB_vR4eC6TYvu0Q",
    authDomain: "proyecto-portafolio-769d1.firebaseapp.com",
    projectId: "proyecto-portafolio-769d1",
    storageBucket: "proyecto-portafolio-769d1.firebasestorage.app",
    messagingSenderId: "245666904543",
    appId: "1:245666904543:web:ad930bba88ba1173c5ac6a",
    measurementId: "G-1HQTCFZT1N"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);