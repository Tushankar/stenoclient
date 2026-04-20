import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

const ProgressChart = ({ data, movingAvg }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)]">
        No session data available yet.
      </div>
    );
  }

  // Merge moving average into data for the composed chart
  const chartData = data.map((d, i) => ({
    ...d,
    movingAvg: movingAvg[i] || null,
    displayDate: new Date(d.date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    }),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-lg shadow-xl">
          <p className="font-bold text-white mb-2">{label}</p>
          <p className="text-[var(--color-primary-light)]">
            Speed: <span className="font-bold">{payload[0].value} WPM</span>
          </p>
          {payload[1] && (
            <p className="text-[var(--color-accent)]">
              Average: <span className="font-bold">{payload[1].value} WPM</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-primary)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="displayDate"
            stroke="var(--color-text-muted)"
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="var(--color-text-muted)"
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--color-border)",
              strokeWidth: 2,
              strokeDasharray: "4 4",
            }}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="var(--color-primary)"
            fillOpacity={1}
            fill="url(#colorWpm)"
          />
          <Line
            type="monotone"
            dataKey="movingAvg"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
