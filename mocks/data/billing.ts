import { faker } from "@faker-js/faker";

import type { BillingInvoice, BillingUsage } from "@/types/api";

function generateBillingUsage(): BillingUsage {
  faker.seed(2606);

  const periodStart = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));
  const periodEnd = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 0),
  );
  const trainingCostUsd = faker.number.int({ min: 12_000, max: 36_000 });
  const inferenceCostUsd = faker.number.int({ min: 18_000, max: 54_000 });
  const storageCostUsd = faker.number.int({ min: 2_000, max: 8_000 });

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    budgetUsd: 100_000,
    totalCostUsd: trainingCostUsd + inferenceCostUsd + storageCostUsd,
    trainingCostUsd,
    inferenceCostUsd,
    storageCostUsd,
    gpuHours: faker.number.int({ min: 3_200, max: 12_000 }),
    tokenCount: faker.number.int({ min: 8_000_000_000, max: 52_000_000_000 }),
  };
}

function generateBillingInvoices(count = 12): BillingInvoice[] {
  faker.seed(2607);

  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index + 1, 0));
    const issuedAt = new Date(periodEnd.getTime() + 2 * 24 * 60 * 60 * 1000);
    const invoiceNumber = `RA-${periodStart.getUTCFullYear()}-${String(periodStart.getUTCMonth() + 1).padStart(2, "0")}`;

    return {
      id: `invoice_${invoiceNumber.toLowerCase()}`,
      invoiceNumber,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      issuedAt: issuedAt.toISOString(),
      dueAt: new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status:
        index === 0 ? "open" : faker.helpers.arrayElement(["paid", "paid", "paid", "overdue"]),
      amountUsd: faker.number.int({ min: 28_000, max: 92_000 }),
      pdfUrl: `/mock-invoices/${invoiceNumber}.pdf`,
    };
  });
}

export { generateBillingInvoices, generateBillingUsage };
