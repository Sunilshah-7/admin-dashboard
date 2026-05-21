"use client";

import dynamic from "next/dynamic";

const chartLoading = () => (
  <div className="h-full min-h-48 w-full animate-pulse rounded-md bg-muted" />
);

const ChartContainer = dynamic(
  () => import("@/components/ui/chart").then((module) => module.ChartContainer),
  { loading: chartLoading, ssr: false },
);
const ChartTooltip = dynamic(
  () => import("@/components/ui/chart").then((module) => module.ChartTooltip),
  { ssr: false },
);
const ChartTooltipContent = dynamic(
  () => import("@/components/ui/chart").then((module) => module.ChartTooltipContent),
  { ssr: false },
);

const Area = dynamic(() => import("recharts").then((module) => module.Area), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((module) => module.AreaChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((module) => module.Bar), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((module) => module.BarChart), {
  ssr: false,
});
const CartesianGrid = dynamic(() => import("recharts").then((module) => module.CartesianGrid), {
  ssr: false,
});
const Cell = dynamic(() => import("recharts").then((module) => module.Cell), { ssr: false });
const Line = dynamic(() => import("recharts").then((module) => module.Line), { ssr: false });
const LineChart = dynamic(() => import("recharts").then((module) => module.LineChart), {
  ssr: false,
});
const Pie = dynamic(() => import("recharts").then((module) => module.Pie), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((module) => module.PieChart), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((module) => module.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((module) => module.YAxis), { ssr: false });

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
};
