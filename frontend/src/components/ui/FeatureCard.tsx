import React from "react";

export type CardVariant =
  | "cosmic"
  | "indigo"
  | "violet"
  | "emerald"
  | "ocean"
  | "cyan"
  | "sunset"
  | "coral"
  | "pink"
  | "amber"
  | "lime"
  | "graphite"
  | "neutral";

interface FeatureCardProps {
  variant?: CardVariant;
  icon?: React.ReactNode;
  badge?: string;
  title: string;
  description: string;
  footerText?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const VARIANT_STYLES: Record<
  CardVariant,
  {
    cardBg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
    badgeStyle: string;
    hoverShadow: string;
  }
> = {
  cosmic: {
    cardBg: "bg-[#171A3A]",
    border: "border-[#3730A3]",
    iconBg: "bg-[#2B2B68]",
    iconColor: "text-[#A5B4FC]",
    titleColor: "text-[#E0E7FF]",
    textColor: "text-[#C7D2FE]",
    badgeStyle: "bg-[#3730A3]/40 text-[#A5B4FC] border-[#3730A3]",
    hoverShadow: "hover:shadow-indigo-900/50",
  },
  cyan: {
    cardBg: "bg-[#083344]",
    border: "border-[#0E7490]",
    iconBg: "bg-[#154E63]",
    iconColor: "text-[#67E8F9]",
    titleColor: "text-[#ECFEFF]",
    textColor: "text-[#A5F3FC]",
    badgeStyle: "bg-[#0E7490]/40 text-[#67E8F9] border-[#0E7490]",
    hoverShadow: "hover:shadow-cyan-900/50",
  },
  ocean: {
    cardBg: "bg-[#E0F2FE]",
    border: "border-[#BAE6FD]",
    iconBg: "bg-[#BAE6FD]",
    iconColor: "text-[#0284C7]",
    titleColor: "text-[#0369A1]",
    textColor: "text-[#334155]",
    badgeStyle: "bg-[#0284C7]/15 text-[#0369A1] border-[#0284C7]/30",
    hoverShadow: "hover:shadow-sky-200/50",
  },
  violet: {
    cardBg: "bg-[#F3E8FF]",
    border: "border-[#E9D5FF]",
    iconBg: "bg-[#E9D5FF]",
    iconColor: "text-[#7E22CE]",
    titleColor: "text-[#6B21A8]",
    textColor: "text-[#475569]",
    badgeStyle: "bg-[#7E22CE]/15 text-[#6B21A8] border-[#7E22CE]/30",
    hoverShadow: "hover:shadow-purple-200/50",
  },
  emerald: {
    cardBg: "bg-[#DCFCE7]",
    border: "border-[#BBF7D0]",
    iconBg: "bg-[#BBF7D0]",
    iconColor: "text-[#15803D]",
    titleColor: "text-[#166534]",
    textColor: "text-[#334155]",
    badgeStyle: "bg-[#15803D]/15 text-[#166534] border-[#15803D]/30",
    hoverShadow: "hover:shadow-emerald-200/50",
  },
  sunset: {
    cardBg: "bg-[#FFF7ED]",
    border: "border-[#FED7AA]",
    iconBg: "bg-[#FED7AA]",
    iconColor: "text-[#C2410C]",
    titleColor: "text-[#9A3412]",
    textColor: "text-[#475569]",
    badgeStyle: "bg-[#C2410C]/15 text-[#9A3412] border-[#C2410C]/30",
    hoverShadow: "hover:shadow-orange-200/50",
  },
  coral: {
    cardBg: "bg-[#FFF1F2]",
    border: "border-[#FECDD3]",
    iconBg: "bg-[#FECDD3]",
    iconColor: "text-[#BE123C]",
    titleColor: "text-[#9F1239]",
    textColor: "text-[#475569]",
    badgeStyle: "bg-[#BE123C]/15 text-[#9F1239] border-[#BE123C]/30",
    hoverShadow: "hover:shadow-rose-200/50",
  },
  pink: {
    cardBg: "bg-[#FCE7F3]",
    border: "border-[#FBCFE8]",
    iconBg: "bg-[#FBCFE8]",
    iconColor: "text-[#BE185D]",
    titleColor: "text-[#9D174D]",
    textColor: "text-[#475569]",
    badgeStyle: "bg-[#BE185D]/15 text-[#9D174D] border-[#BE185D]/30",
    hoverShadow: "hover:shadow-pink-200/50",
  },
  amber: {
    cardBg: "bg-[#FEF3C7]",
    border: "border-[#FDE68A]",
    iconBg: "bg-[#FDE68A]",
    iconColor: "text-[#B45309]",
    titleColor: "text-[#92400E]",
    textColor: "text-[#451A03]",
    badgeStyle: "bg-[#B45309]/15 text-[#92400E] border-[#B45309]/30",
    hoverShadow: "hover:shadow-amber-200/50",
  },
  lime: {
    cardBg: "bg-[#ECFCCB]",
    border: "border-[#D9F99D]",
    iconBg: "bg-[#D9F99D]",
    iconColor: "text-[#4D7C0F]",
    titleColor: "text-[#3F6212]",
    textColor: "text-[#1A2E05]",
    badgeStyle: "bg-[#4D7C0F]/15 text-[#3F6212] border-[#4D7C0F]/30",
    hoverShadow: "hover:shadow-lime-200/50",
  },
  indigo: {
    cardBg: "bg-[#E0E7FF]",
    border: "border-[#C7D2FE]",
    iconBg: "bg-[#C7D2FE]",
    iconColor: "text-[#4338CA]",
    titleColor: "text-[#3730A3]",
    textColor: "text-[#334155]",
    badgeStyle: "bg-[#4338CA]/15 text-[#3730A3] border-[#4338CA]/30",
    hoverShadow: "hover:shadow-indigo-200/50",
  },
  graphite: {
    cardBg: "bg-[#1E293B]",
    border: "border-[#334155]",
    iconBg: "bg-[#334155]",
    iconColor: "text-[#38BDF8]",
    titleColor: "text-[#F8FAFC]",
    textColor: "text-[#94A3B8]",
    badgeStyle: "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40",
    hoverShadow: "hover:shadow-slate-900/80",
  },
  neutral: {
    cardBg: "bg-[#FFFFFF]",
    border: "border-[#E2E8F0]",
    iconBg: "bg-[#F1F5F9]",
    iconColor: "text-[#475569]",
    titleColor: "text-[#0F172A]",
    textColor: "text-[#475569]",
    badgeStyle: "bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]/20",
    hoverShadow: "hover:shadow-slate-200/60",
  },
};

export default function FeatureCard({
  variant = "ocean",
  icon,
  badge,
  title,
  description,
  footerText,
  actionText,
  onAction,
  className = "",
}: FeatureCardProps) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.ocean;

  return (
    <div
      className={`group relative rounded-3xl border ${styles.cardBg} ${styles.border} p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${styles.hoverShadow} flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header with Icon and Badge */}
        <div className="flex items-center justify-between mb-5">
          {icon && (
            <div
              className={`p-3.5 rounded-2xl ${styles.iconBg} ${styles.iconColor} shadow-inner flex items-center justify-center`}
            >
              {icon}
            </div>
          )}
          {badge && (
            <span
              className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${styles.badgeStyle}`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-extrabold tracking-wide mb-2 ${styles.titleColor}`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`text-sm leading-relaxed font-normal ${styles.textColor}`}>
          {description}
        </p>
      </div>

      {/* Footer / Action */}
      {(footerText || actionText) && (
        <div className={`mt-6 pt-4 border-t ${styles.border} flex items-center justify-between text-xs font-semibold`}>
          {footerText && <span className={styles.textColor}>{footerText}</span>}
          {actionText && (
            <button
              onClick={onAction}
              className={`font-extrabold hover:underline flex items-center gap-1 ${styles.iconColor}`}
            >
              {actionText} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
