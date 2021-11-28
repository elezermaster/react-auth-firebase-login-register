import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import userService from "../services/user.service";
import { toast } from "react-toastify";
import axios from 'axios'
import {setTokens} from '../services/localStorage.service'

const AuthContext = React.createContext();
const httpAuth = axios.create()

export const useAuth = () => {
    return useContext(AuthContext);
};
const TOKEN_KEY = 'jwt-token'
const REFRESH_KEY = 'jwt-refresh-token'
const EXPIRES_KEY = 'jwt-expires'

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})
    const [error, setError] = useState(null);
    function setTokens({refreshToken, idToken, expiresIn}) {
        const expiresDate = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem(TOKEN_KEY, idToken)
        localStorage.setItem(REFRESH_KEY, refreshToken)
        localStorage.setItem(EXPIRES_KEY, expiresDate)
    }
    async function signUp({email, password, ...rest}) {
        // const apiKey = "AIzaSyAX8ORDX1fwi7yTR73kQKbWpktATUl8x2k"
        // REACT_APP_FIREBASE_KEY
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`
        try {
            const {data} = await httpAuth.post(url, {email, password,returnSecureToken: true})
            console.log('data',data)
            setTokens(data)
            await createUser({_id: data.localId, email, ...rest})
        } catch (e) {
            errorCatcher(e)
            const {code,message} = error.response.data.error
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = {
                        email: "User with email already exists"
                    }
                    throw errorObject
                }
            }
            //throw new Error
        }
    }
    async function signIn({email, password, ...rest}) {
        //const apiKey = "AIzaSyAX8ORDX1fwi7yTR73kQKbWpktATUl8x2k"
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.REACT_APP_FIREBASE_KEY}`

        try {
            const {data} = await httpAuth.post(url, {email, password,returnSecureToken: true})
            console.log('data',data)
            setTokens(data)
            await createUser({_id: data.localId, email, ...rest})
        } catch (e) {
            console.log('e',e)
            errorCatcher(e)
            const {code,message} = error.response.data.error
            // if (code === 400) {
            //     if (message === "EMAIL_EXISTS") {
            //         const errorObject = {
            //             email: "User with email already exists"
            //         }
            //         throw errorObject
            //     }
            // }
            //throw new Error
        }
    }
    async function createUser(data) {
        try {
            const {content} = userService.create(data)
            setCurrentUser(content)
        } catch (e) {
            console.log(e)
            errorCatcher(e)
        }
    }
    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }
    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);
    return (
        <AuthContext.Provider value={{signUp, signIn, currentUser}}>
            {children}
        </AuthContext.Provider>
    );
};

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX8ORDX1fwi7yTR73kQKbWpktATUl8x2k",
  authDomain: "fast-company-7b756.firebaseapp.com",
  databaseURL: "https://fast-company-7b756-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fast-company-7b756",
  storageBucket: "fast-company-7b756.appspot.com",
  messagingSenderId: "981892952107",
  appId: "1:981892952107:web:afd1786be8fa50278a3a6e"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
