"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FileUpload } from "@/components/FileUpload";
import { Logo } from "@/components/Logo";

export function AppContainer() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log("File uploaded:", file.name, file.size, file.type);
    // Here you would typically send the file to your AI analysis endpoint
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating-element"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating-element"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl floating-element"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-16">
            <nav className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Logo
                  size="md"
                  className="hover:scale-110 transition-transform duration-300"
                />
                <span className="text-xl font-bold text-white">MelissaAI</span>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Examples
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <button className="btn-glass px-6 py-2 rounded-lg">
                  Sign In
                </button>
              </div>
            </nav>
          </header>

          {/* Hero Section */}
          <Hero />

          {/* File Upload Section */}
          <section className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Start your analysis
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Drag your file or click to select it. Our AI engine will process
                your data and generate valuable insights automatically.
              </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} className="mb-12" />
          </section>

          {/* Features Preview */}
          <section className="max-w-6xl mx-auto mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                What can you do?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover the power of artificial intelligence applied to your
                data
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-card p-8 rounded-2xl glass-card-hover">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Automatic Analysis
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  AI identifies patterns, trends and anomalies in your data
                  automatically, without manual configuration.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-8 rounded-2xl glass-card-hover">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Smart Visualizations
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Generate charts and visualizations that best represent your
                  data, optimized for maximum visual impact.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-8 rounded-2xl glass-card-hover">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Instant Dashboards
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Create professional and elegant dashboards in seconds, ready
                  to present or share with your team.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-24 pt-12 border-t border-white/10">
            <div className="text-center">
              <p className="text-gray-500">
                © 2024 MelissaAI. Transforming data into insights with AI.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
