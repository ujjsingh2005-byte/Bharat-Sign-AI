import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { loginSchema, type LoginFormData } from "../../utils/validators";
import { loginUser } from "../../services/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setLoading(true);

      const response = await loginUser(data);

      if (response.success) {
        // Save JWT Token
        localStorage.setItem("token", response.token);

        // Save User Info
        localStorage.setItem("user", JSON.stringify(response.user));

        alert("Login Successful!");

        navigate("/dashboard");
      } else {
        alert(response.message);
      }
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-600/40">
            👑
          </div>
        </div>

        <h1 className="mt-5 text-4xl font-bold text-white">Bharat-Sign AI</h1>

        <p className="mt-2 text-slate-400">Welcome Back</p>
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h2 className="mb-8 text-2xl font-bold">Login</h2>

        {/* Email */}
        <label className="text-sm text-slate-300">Email</label>

        <div className="mt-2 flex items-center rounded-xl border border-slate-700 px-4">
          <Mail className="text-slate-400" size={18} />

          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent p-4 text-white outline-none"
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
        )}

        {/* Password */}
        <label className="mt-6 block text-sm text-slate-300">Password</label>

        <div className="mt-2 flex items-center rounded-xl border border-slate-700 px-4">
          <Lock className="text-slate-400" size={18} />

          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent p-4 text-white placeholder:text-slate-500 outline-none autofill:bg-transparent"
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} className="text-slate-400" />
            ) : (
              <Eye size={20} className="text-slate-400" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
        )}

        {/* Forgot Password */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}

          {!loading && <ArrowRight size={18} />}
        </button>

        {/* Register */}
        <div className="mt-8 text-center text-slate-400">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
