import { describe, expect, it } from "vitest";

import {
  formatCompactNumber,
  formatCurrency,
  formatDuration,
  formatPercent,
} from "@/lib/formatters";

describe("formatters", () => {
  it("formats compact numbers and currency", () => {
    expect(formatCompactNumber(15320)).toBe("15.3K");
    expect(formatCurrency(64100)).toBe("$64.1K");
  });

  it("formats durations and missing percentages", () => {
    expect(formatDuration(142)).toBe("2m 22s");
    expect(formatDuration()).toBe("n/a");
    expect(formatPercent(57)).toBe("57%");
    expect(formatPercent(undefined)).toBe("--");
  });
});
