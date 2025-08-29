import React from "react";

interface QuantumBadgeProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const QuantumBadge = ({
  text = "AI Productivity Platform",
  size = "md",
  className = "",
}: QuantumBadgeProps) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "px-2 py-1",
      icon: "w-2.5 h-2.5",
      text: "text-[10px]",
      iconText: "text-[5px]",
      gap: "gap-1.5",
    },
    md: {
      container: "px-3 py-1.5",
      icon: "w-4 h-4",
      text: "text-xs",
      iconText: "text-[6px]",
      gap: "gap-2",
    },
    lg: {
      container: "px-4 py-2",
      icon: "w-5 h-5",
      text: "text-sm",
      iconText: "text-[8px]",
      gap: "gap-3",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`relative ${className}`}>
      {/* Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 via-blue-500/40 to-purple-500/40 rounded-lg blur-sm opacity-20 animate-pulse"></div>

      {/* Main Container */}
      <div
        className={`relative flex items-center ${config.gap} ${config.container} rounded-md border border-cyan-400/30 bg-white/80 backdrop-blur-sm`}
      >
        {/* Animated Quantum Icon */}
        <div className={`relative ${config.icon}`}>
          {/* Outer Ring */}
          <div
            className={`absolute inset-0 ${config.icon} border border-cyan-400 rounded-full animate-spin flex items-center justify-center`}
          >
            <span
              className={`font-mono ${config.iconText} font-black text-cyan-400`}
            >
              Q
            </span>
          </div>

          {/* Inner Ring (Counter Rotation) */}
          <div
            className={`absolute inset-0 ${config.icon} border-t border-pink-400 rounded-full animate-spin`}
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>

        {/* Text */}
        <span
          className={`${config.text} font-exo font-semibold text-[#3377FF] tracking-wider`}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default QuantumBadge;
