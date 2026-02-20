"use client";

import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

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

          {/* SIGNUP FORM */}
          {isSignup ? (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="input"
              />

              <input
                type="text"
                placeholder="Last Name"
                className="input"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
              />

              <input
                type="text"
                placeholder="Username"
                className="input"
              />

              <input
                type="email"
                placeholder="Email"
                className="input"
              />

              <input
                type="password"
                placeholder="Password"
                className="input"
              />

              <button className="main-btn mt-4">
                <UserPlus size={18} />
                Sign Up
              </button>
            </>
          ) : (
            <>
              {/* LOGIN FORM */}
              <input
                type="email"
                placeholder="Email"
                className="input"
              />

              <input
                type="password"
                placeholder="Password"
                className="input"
              />

              <div className="flex justify-end mb-6 text-sm">
                <button className="text-indigo-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <button className="main-btn">
                <LogIn size={18} />
                Log In
              </button>
            </>
          )}

          {/* TOGGLE BUTTON */}
          <p className="text-center text-sm mt-6">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
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
          <img
            src="/image.png"
            alt="Campus Marketplace"
            className="w-full h-auto mix-blend-multiply"
          />
        </div>
      </div>

    </div>
  );
}
