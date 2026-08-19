"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/auth/context";
import { Oval } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validatingUserCredentials, setValidatingUserCredentials] =
    useState(false);

  const validateNotEmptyValue = (value) => {
    if (value.length <= 0) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email.trim(),
      password: password.trim(),
    };
    const loginResult = await loginController(formData);
    console.log("Login Result:", loginResult);
  };

  const loginController = async (formData) => {
    setValidatingUserCredentials(true);
    console.log(
      "Attempting Logging In - Checking if Email and Password are not empty",
    );
    const nonEmptyEmail = validateNotEmptyValue(formData.email);
    const nonEmptyPassword = validateNotEmptyValue(formData.password);
    if (!nonEmptyEmail || !nonEmptyPassword) {
      setValidatingUserCredentials(false);
      toast.error("Please fill in all fields.");
      return {
        loginSuccess: false,
        message: "Please fill in all fields.",
      };
    } else {
      console.log("Email and Password are not empty, proceeding to login");
      const loginRes = await login(formData);
      console.log("Login Response:", loginRes);

      if (loginRes.success) {
        setTimeout(() => {
          setValidatingUserCredentials(false);
        }, 500);

        setTimeout(() => {
          toast.success("Login Successful");
        }, 2000);

        setTimeout(() => {
          router.push("/dashboard");
        }, 3500);

        return {
          loginSuccess: true,
          message: "Login Successful",
        };
      } else {
        setValidatingUserCredentials(false);
        toast.error(loginRes.message || "Login Failed");
        return {
          loginSuccess: false,
          message: loginRes.message || "Login Failed",
        };
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main */}
      <div className="mx-auto grid min-h-screen lg:max-h-screen w-full overflow-hidden bg-white lg:grid-cols-[60%_40%]">
        {/* Left Side */}
        <div className="flex justify-center items-center p-10 lg:h-[100%] ">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

            <p className="mt-2 text-gray-500">
              Sign in to your CenifyIT CRM account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@company.com"
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="h-12 w-full rounded-xl border border-gray-300 px-4 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                Sign In
              </button>

              {/* Divider
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              {/* <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-xl border transition hover:bg-gray-50"
                >
                  Google
                </button>

                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-xl border transition hover:bg-gray-50"
                >
                  Microsoft
                </button>
              </div> */}

              {/* Signup */}
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white lg:flex lg:flex-col text-center  ">
          <h2 className="mt-0 text-4xl font-bold leading-tight capitalize">
            AI-powered CRM
            <br />
            for modern
            <br />
            service businesses.
          </h2>

          <p className="mt-6 max-w-md text-blue-100 text-lg">
            Capture leads, manage conversations, automate follow-ups, and grow
            your business with AI.
          </p>

          <div className="mt-12 space-y-5 text-lg">
            <div>✓ AI Website Chatbot</div>
            <div>✓ Lead Management</div>
            <div>✓ Customer Conversations</div>
            <div>✓ Website Analytics</div>
            <div>✓ Appointment Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
