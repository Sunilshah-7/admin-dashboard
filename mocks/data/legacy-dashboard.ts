import type {
  LegacyProduct,
  LegacyUser,
  MonthlyProductMetric,
  MonthlyUserMetric,
} from "@/types/legacy-dashboard";

const userAnalyticsFixture: MonthlyUserMetric[] = [
  { month: "Jan", activeUsers: 4000 },
  { month: "Feb", activeUsers: 3000 },
  { month: "Mar", activeUsers: 5000 },
  { month: "Apr", activeUsers: 1000 },
  { month: "May", activeUsers: 3000 },
  { month: "Jun", activeUsers: 2000 },
  { month: "Jul", activeUsers: 4000 },
  { month: "Aug", activeUsers: 6000 },
  { month: "Sep", activeUsers: 2000 },
  { month: "Oct", activeUsers: 4000 },
  { month: "Nov", activeUsers: 5000 },
  { month: "Dec", activeUsers: 5000 },
];

const productSalesFixture: MonthlyProductMetric[] = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 1000 },
  { month: "May", sales: 3000 },
  { month: "Jun", sales: 2000 },
];

const usersFixture: LegacyUser[] = [
  {
    id: 1,
    username: "Jon Snow",
    avatarUrl:
      "https://www.seekpng.com/png/detail/60-601088_jon-snow-png-image-free-download-can-t.png",
    email: "jon@gmail.com",
    status: "active",
    transaction: "$100",
  },
  {
    id: 2,
    username: "Cersei Lannister",
    avatarUrl:
      "https://www.seekpng.com/png/detail/60-601088_jon-snow-png-image-free-download-can-t.png",
    email: "cersei@gmail.com",
    status: "active",
    transaction: "$200",
  },
  {
    id: 3,
    username: "Jaime Lannister",
    avatarUrl:
      "https://www.seekpng.com/png/detail/60-601088_jon-snow-png-image-free-download-can-t.png",
    email: "jaime@gmail.com",
    status: "active",
    transaction: "$50",
  },
  {
    id: 4,
    username: "Arya Stark",
    avatarUrl:
      "https://www.seekpng.com/png/detail/60-601088_jon-snow-png-image-free-download-can-t.png",
    email: "arya@gmail.com",
    status: "active",
    transaction: "$1000",
  },
];

const productsFixture: LegacyProduct[] = [
  {
    id: 1,
    name: "Airpods",
    imageUrl: "https://www.nicepng.com/png/detail/298-2982212_apple-airpods-png.png",
    stock: 12,
    status: "active",
    price: "$100",
  },
  {
    id: 2,
    name: "Laptop",
    imageUrl: "https://toppng.com/uploads/preview/samsung-laptop-png-11552846920ggjwoxjcy6.png",
    stock: 10,
    status: "active",
    price: "$200",
  },
  {
    id: 3,
    name: "Earphones",
    imageUrl: "https://www.kindpng.com/picc/m/309-3093277_earphones-png-transparent-png.png",
    stock: 15,
    status: "active",
    price: "$50",
  },
  {
    id: 4,
    name: "Mobile",
    imageUrl: "https://www.vhv.rs/dpng/d/7-72850_new-mobile-phone-png-transparent-png.png",
    stock: 20,
    status: "active",
    price: "$500",
  },
];

function getUserAnalytics() {
  return userAnalyticsFixture;
}

function getProductSales() {
  return productSalesFixture;
}

function getLegacyUsers() {
  return usersFixture;
}

function getLegacyUser(userId: string | number) {
  return usersFixture.find((user) => String(user.id) === String(userId)) ?? null;
}

function getLegacyProducts() {
  return productsFixture;
}

function getLegacyProduct(productId: string | number) {
  return productsFixture.find((product) => String(product.id) === String(productId)) ?? null;
}

export {
  getLegacyProduct,
  getLegacyProducts,
  getLegacyUser,
  getLegacyUsers,
  getProductSales,
  getUserAnalytics,
};
