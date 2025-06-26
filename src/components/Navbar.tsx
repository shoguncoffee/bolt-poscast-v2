"use client";

import { useState, useEffect } from "react";
import { Bot, ChevronDown, User, LogOut } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

export default function Navbar() {
  const [user, setUser] = useState<null | { name: string; picture?: string; email: string }>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`
        );
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        const userData = {
          name: data.name,
          email: data.email,
          picture: data.picture,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setShowAuthModal(false);
      } catch {
        setErrorMsg("Google login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrorMsg("Google login failed. Please try again."),
  });

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    setShowLogoutConfirm(false);
  };

  const validateForm = () => {
    if (!email.trim() || !password) {
      setErrorMsg("Please enter email and password.");
      return false;
    }
    if (!email.includes("@")) {
      setErrorMsg("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return false;
    }
    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return false;
      }
    }
    return true;
  };

  const handleEmailPasswordLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await new Promise((r) => setTimeout(r, 1000)); // mock delay
      const mockUser = {
        name: email.split("@")[0],
        email,
      };
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setShowAuthModal(false);
      resetForm();
    } catch {
      setErrorMsg("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await new Promise((r) => setTimeout(r, 1000)); // mock delay
      alert("Signup success! Please login now.");
      setIsLoginMode(true);
      resetForm();
    } catch {
      setErrorMsg("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMsg("");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 select-none">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Botcats
                </h1>
                <p className="text-xs text-gray-300 font-medium tracking-wide">AI Podcast Creator</p>
              </div>
            </div>

            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 shadow-sm cursor-pointer transition-all text-white"
                  >
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full border-2 border-purple-400" />
                    ) : (
                      <User className="h-8 w-8 rounded-full border border-purple-400" />
                    )}
                    <ChevronDown className={`h-4 w-4 text-purple-300 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-purple-200 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition-colors flex items-center"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" /> Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginMode(true);
                    setShowAuthModal(true);
                  }}
                  className="px-5 py-2 border border-white/20 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-72 shadow-lg text-center relative">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
            >
              ✕
            </button>
            <p className="font-medium text-gray-800 mb-1 text-lg">Sign out?</p>
            <p className="text-sm text-gray-500 mb-4">You will need to log in again next time.</p>
            <div className="flex space-x-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 border rounded-lg py-2 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleLogout} className="flex-1 bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 cursor-pointer">Sign out</button>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => !loading && setShowAuthModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
              {isLoginMode ? "Welcome Back!" : "Create an Account"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                isLoginMode ? handleEmailPasswordLogin() : handleEmailPasswordSignup();
              }}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-lg border border-gray-300 px-5 py-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-5 py-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {!isLoginMode && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full rounded-lg border border-gray-300 px-5 py-3"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              )}
              {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 mt-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Loading..." : isLoginMode ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            <button
              onClick={() => loginGoogle()}
              className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold"
              disabled={loading}
            >
              <FcGoogle className="w-5 h-5 mr-2" /> Continue with Google
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-purple-600 hover:underline text-sm"
                onClick={toggleMode}
                disabled={loading}
              >
                {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
