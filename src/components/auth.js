import React, { Component, useState }  from 'react';
import {auth, googleProvider} from '../config/firebase';
import {createUserWithEmailAndPassword,signInWithPopup,signOut} from 'firebase/auth';


export const Auth = () => {

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    console.log(auth?.currentUser?.email);
    const signIn = async() => {
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed in");
        } catch (err){
            console.error(err.message);
        }    
    };
    const signInWithGoogle = async () =>{
        try{
            await signInWithPopup(auth,googleProvider);

        } catch(err){
            console.error(err);
        }
    };
    const logout = async () =>{
        try{
            await signOut(auth);

        }catch(err){
            console.error(err.message);
        }
    }
    return (
        <div>
        <input 
            placeholder="Email..." 
            
            onChange = {(e) => setEmail(e.target.value)}
            />
        <input 
            placeholder="Password..." 
            type = "password"
            onChange = {(p) => setPassword(p.target.value)}/>
        <button onClick = {signIn}> Sign In</button>
        <button onClick={signInWithGoogle}> Sign in with Google</button>
        <button onClick={logout}> Logout</button>
       </div>
    );
};