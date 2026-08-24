import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { registerSchema, type RegisterFormData } from "../../utils/validators";

import { registerUser } from "../../services/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser(data);
      alert("Backend connection coming soon.");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-600/40">
            👑
          </div>
        </div>

        <h1 className="mt-5 text-4xl font-bold text-white">Bharat-Sign AI</h1>

        <p className="text-slate-400 mt-2">Create your account</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-8">Register</h2>

        {/* Name */}

        <label className="text-sm text-slate-300">Full Name</label>

        <div className="mt-2 flex items-center rounded-xl border border-slate-700 px-4">
          <User className="text-slate-400" size={18} />

          <input
            {...register("name")}
            className="w-full bg-transparent p-4 text-white outline-none"
            placeholder="Full Name"
          />
        </div>

        <p className="text-red-400 text-sm mt-2">{errors.name?.message}</p>

        {/* Email */}

        <label className="text-sm text-slate-300 mt-5 block">Email</label>

        <div className="mt-2 flex items-center rounded-xl border border-slate-700 px-4">
          <Mail className="text-slate-400" size={18} />

          <input
            {...register("email")}
            type="email"
            className="w-full bg-transparent p-4 text-white outline-none"
            placeholder="Email"
          />
        </div>

        <p className="text-red-400 text-sm mt-2">{errors.email?.message}</p>

        {/* Password */}

        <label className="text-sm text-slate-300 mt-5 block">Password</label>

        <div className="mt-2 flex items-center rounded-xl border border-slate-700 px-4">
          <Lock className="text-slate-400" size={18} />

          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="w-full bg-transparent p-4 text-white outline-none"
            placeholder="Password"
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <p className="text-red-400 text-sm mt-2">{errors.password?.message}</p>

        {/* Confirm Password */}

        <label className="text-sm text-slate-300 mt-5 block">
          Confirm Password
        </label>

        <div className="mt-2 flex items-center rounded-xl border border-slate-700 px-4">
          <Lock className="text-slate-400" size={18} />

          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            className="w-full bg-transparent p-4 text-white outline-none"
            placeholder="Confirm Password"
          />

          <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <p className="text-red-400 text-sm mt-2">
          {errors.confirmPassword?.message}
        </p>

        {/* Terms */}

        <div className="flex items-center gap-3 mt-6">
          <input type="checkbox" {...register("terms")} />

          <span className="text-sm text-slate-400">
            I agree to the Terms & Privacy Policy
          </span>
        </div>

        <p className="text-red-400 text-sm mt-2">{errors.terms?.message}</p>

        <button
          disabled={isSubmitting}
          className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Account"}

          {!isSubmitting && <ArrowRight size={18} />}
        </button>

        <div className="text-center mt-8 text-slate-400">
          Already have an account?
          <Link to="/login" className="ml-2 text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
