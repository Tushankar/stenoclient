import React from "react";

const StatsCard = ({ title, value, icon, colorClass, highlight }) => {
  return (
    <div
      className={`p-6 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)] shadow-lg flex items-center gap-4 ${highlight ? "ring-1 ring-[var(--color-primary)]" : ""}`}
    >
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-xl bg-[var(--color-bg)] ${colorClass} text-2xl shadow-inner`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[var(--color-text-muted)] text-sm font-semibold tracking-wide uppercase">
          {title}
        </p>
        <p className={`text-4xl font-extrabold text-white mt-1`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
