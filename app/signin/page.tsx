import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 ray-100 px-6 py-12 my-8">
        <div className="w-full max-w-md">

          

          {/* Welcome */}
          <h2 className="text-4xl font-bold mb-3 bg-gray-100">
            Welcome Back!
          </h2>

          <p className="text-gray-600 mb-8">
            Campus deals made simple.
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-5 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 "
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 "
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-6 text-sm">
           
            <button className="text-indigo-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
  className="flex items-center justify-center gap-2 
             px-4 py-2 rounded-full
             border border-yellow-400 
             w-full
             focus:outline-none 
             focus:ring-2 focus:ring-yellow-400"
>
  <LogIn size={18} className="text-black" />
  <span>Sign in</span>
</button>




          {/* Signup */}
          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <span className="text-indigo-600 font-semibold cursor-pointer">
              Sign Up
            </span>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
     <div className="hidden lg:flex lg:w-2/5 h-[80vh] items-center justify-center bg-yellow-400 p-8 my-24 bg-gray-100">

  <div className="max-w-md">

    <img
      src="/image.png"  // put your image inside public folder
      alt="Campus Marketplace"
      className="w-full h-auto mix-blend-multiply"
    />

  </div>
</div>

      </div>

    
  );
}
