import React from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { SignIn } from "@clerk/react";
import DotField from "../components/DotField.jsx";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full bg-white overflow-y-auto flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={60}
          glowRadius={180}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#0054ff"
          gradientTo="#B497CF"
          glowColor="#0020ff"
        />
      </div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-10 py-10">

        {/* ================= LEFT SIDE ================= */}
        <div className="flex flex-col justify-center text-center lg:text-left">

          {/* Brand */}
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">
            SakshaMedia
          </h1>

          {/* Trust */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <img src={assets.group_users} className="h-10" alt="users" />

            <div>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Trusted by 12+ users worldwide
              </p>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Build. Share. Connect Globally.
          </h2>

          {/* Description */}
          <p className="mt-4 text-gray-600 text-base lg:text-lg max-w-md mx-auto lg:mx-0">
            SakshaMedia is a modern digital media platform where creators connect,
            share stories, and grow communities worldwide through impactful content.
          </p>

          {/* Features */}
          <div className="mt-6 space-y-3 text-sm text-gray-700">

            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Create and publish content easily
            </div>

            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Connect with global communities
            </div>

            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Built for creators, brands & innovators
            </div>
          </div>

          {/* CEO quote */}
          <p className="mt-6 text-sm text-gray-500 italic">
            “SakshaMedia is designed to bring people closer through meaningful digital experiences.”
            <span className="block font-semibold text-gray-700 mt-1">
              — CEO of SakshaMedia
            </span>
          </p>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center justify-center">

          <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-3xl p-8">

            {/* Accent line */}
            <div className="w-20 h-1 bg-indigo-500 rounded-full mx-auto mb-6"></div>

            {/* Title */}
            <h3 className="text-2xl font-semibold text-gray-900 text-center">
              Welcome Back
            </h3>

            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Sign in to continue to SakshaMedia
            </p>

            {/* Clerk Login */}
            <div className="flex justify-center">
              <SignIn />
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 text-center mt-6">
              By continuing, you agree to SakshaMedia Terms & Privacy Policy
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;