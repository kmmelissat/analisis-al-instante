"use client";

export function Hero() {
  return (
    <div className="relative">
      {/* Main hero content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        {/* Left side - Text content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">Explore data</span>
              <span className="text-white mx-4">→</span>
              <span className="text-white">deliver</span>
              <br />
              <span className="gradient-text">insights</span>
              <span className="text-white">, and take action</span>
              <br />
              <span className="text-white">with</span>{" "}
              <span className="gradient-text-secondary">MelissaAI</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Accelerate decision-making and eliminate repetitive tasks with
              MelissaAI Pulse and Einstein Copilot. Intelligent analytics at
              scale.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button className="btn-gradient px-8 py-4 rounded-full font-semibold text-white shadow-lg flex items-center space-x-2 hover:scale-105 transition-transform">
              <span>Watch Demo</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side - Dashboard preview with floating elements */}
        <div className="relative lg:h-[600px] flex items-center justify-center">
          {/* Floating dashboard cards */}
          <div className="relative w-full max-w-lg">
            {/* Main metric card */}
            <div className="glass-card p-6 rounded-2xl absolute top-0 right-0 z-20 floating-element">
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text mb-1">
                  10.7M
                </div>
                <div className="text-sm text-green-400 font-medium">
                  +37% Last Week
                </div>
              </div>
            </div>

            {/* Data Analysis card */}
            <div
              className="glass-card p-6 rounded-2xl absolute top-20 left-0 z-10 floating-element"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <div className="text-white font-semibold">Data Analysis</div>
                  <div className="text-gray-400 text-sm">Reimagined</div>
                </div>
                <div className="ml-auto">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Percentage metric */}
            <div
              className="glass-card p-8 rounded-2xl absolute bottom-0 right-4 z-15 floating-element"
              style={{ animationDelay: "2s" }}
            >
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text-secondary mb-2">
                  82%
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto"></div>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/10 to-pink-500/5 rounded-3xl blur-3xl"></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl floating-element"
              style={{ animationDelay: "3s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
