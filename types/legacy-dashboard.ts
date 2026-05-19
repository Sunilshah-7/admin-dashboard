type MonthlyUserMetric = {
  month: string;
  activeUsers: number;
};

type MonthlyProductMetric = {
  month: string;
  sales: number;
};

type LegacyUser = {
  id: number;
  username: string;
  avatarUrl: string;
  email: string;
  status: "active" | "inactive";
  transaction: string;
};

type LegacyProduct = {
  id: number;
  name: string;
  imageUrl: string;
  stock: number;
  status: "active" | "inactive";
  price: string;
};

export type { LegacyProduct, LegacyUser, MonthlyProductMetric, MonthlyUserMetric };
