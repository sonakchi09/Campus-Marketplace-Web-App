"use client";

import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, googleProvider, db } from "@/src/firebase/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const allowedDomain = "@kiit.ac.in";

  const handleSignup = async () => {
    try {
      if (!email.endsWith(allowedDomain)) {
        alert("Only campus email allowed!");
        return;
      }
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Create user node in RTDB
      await set(ref(db, `users/${result.user.uid}`), {
        email,
        phone,
        firstName,
        lastName,
        username,
        itemsBought: {},
        itemsSold: {},
        createdAt: Date.now(),
      });
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email.endsWith(allowedDomain)) {
        alert("Only campus email allowed!");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email ?? "";
      if (!userEmail.endsWith(allowedDomain)) {
        await auth.signOut();
        alert("Only campus email allowed!");
        return;
      }
      // Create user node if it doesn't exist
      await set(ref(db, `users/${result.user.uid}`), {
        email: userEmail,
        phone: "",
        firstName: result.user.displayName ?? "",
        lastName: "",
        username: "",
        itemsBought: {},
        itemsSold: {},
        createdAt: Date.now(),
      });
      router.push("/");
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        alert(error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!email.endsWith(allowedDomain)) {
        alert("Only campus email allowed!");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 my-8">
        <div className="w-full max-w-md">

          <h2 className="text-4xl font-semibold mb-3">
            {isSignup ? "Create Account" : "Welcome Back!"}
          </h2>

          <p className="text-gray-600 mb-8">
            {isSignup
              ? "Join CampusCart and start selling and buying."
              : "Campus deals made simple."}
          </p>

          {isSignup ? (
            <>
              <input type="text" placeholder="First Name" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input type="text" placeholder="Last Name" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <input type="tel" placeholder="Phone Number" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input type="text" placeholder="Username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="main-btn mt-4" onClick={handleSignup}>
                <UserPlus size={18} />
                Sign Up
              </button>
            </>
          ) : (
            <>
              <input type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex justify-end mb-6 text-sm">
                <button className="text-indigo-600 hover:underline" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              </div>
              <button className="main-btn" onClick={handleLogin}>
                <LogIn size={18} />
                Log In
              </button>
            </>
          )}

          <p className="text-center text-sm mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setEmail(""); setPassword("");
                setFirstName(""); setLastName("");
                setPhone(""); setUsername("");
              }}
              className="ml-2 text-indigo-600 font-semibold hover:underline"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex lg:w-2/5 h-[80vh] items-center justify-center p-8 my-24 bg-yellow-400">
        <div className="max-w-md">
          <img src="/image.png" alt="Campus Marketplace" className="w-full h-auto mix-blend-multiply" />
        </div>
      </div>

    </div>
  );
}