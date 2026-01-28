
export default function Logo() {
  return (
    <div className="p-3 border-gray-200">
      <div className="flex items-center">
        <div className="mr-3 w-10 h-10 flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            aria-label="Investment Tracker Logo"
          >
            <defs>
              <linearGradient id="logoBarGradient" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="10" fill="url(#logoBarGradient)" />
            {/* Bar Chart/Graph Icon for Investment */}
            <rect x="9" y="21" width="4" height="10" rx="2" fill="white" />
            <rect x="17" y="15" width="4" height="16" rx="2" fill="#60a5fa" />
            <rect x="25" y="11" width="4" height="20" rx="2" fill="#a5b4fc" />
            {/* Arrow representing upward trend */}
            <polyline
              points="10,28 18,18 25,23 30,13"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polygon
              points="30,13 28,15 32,15"
              fill="#22c55e"
            />
            {/* Small coin/dollar circle */}
            <circle cx="31" cy="31" r="3" fill="white" stroke="#6366f1" strokeWidth="1.5" />
            <text
              x="31"
              y="32.5"
              textAnchor="middle"
              fontSize="2.5"
              fontWeight="bold"
              fill="#6366f1"
              fontFamily="sans-serif"
              alignmentBaseline="middle"
            >
              $
            </text>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Investment
          </h1>
          <p className="text-xs text-gray-500">Tracker</p>
        </div>
      </div>
    </div>
  );


}
