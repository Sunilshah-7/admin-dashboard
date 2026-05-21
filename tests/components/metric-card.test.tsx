import { render, screen } from "@testing-library/react";
import { Cpu } from "lucide-react";
import { describe, expect, it } from "vitest";

import { MetricCard } from "@/components/dashboard/metric-card";

describe("MetricCard", () => {
  it("renders the metric value, label, description, and trend", () => {
    render(
      <MetricCard
        description="avg cluster load"
        icon={Cpu}
        label="GPU Utilization"
        tone="text-blue-500"
        trend={{ direction: "down", label: "-8.1% vs earlier", positive: true }}
        value="57%"
      />,
    );

    expect(screen.getByText("GPU Utilization")).toBeInTheDocument();
    expect(screen.getByText("57%")).toBeInTheDocument();
    expect(screen.getByText("-8.1% vs earlier")).toBeInTheDocument();
    expect(screen.getByText("avg cluster load")).toBeInTheDocument();
  });
});
