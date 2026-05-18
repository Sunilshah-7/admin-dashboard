# Project Features Overview

This project is a Vite React admin dashboard UI. It is mostly presentational and uses hardcoded sample data from `src/DummyData.jsx`; there is no backend/API integration, persistence layer, authentication, or real form submission flow currently implemented.

## Tech Stack

- React 19 with Vite.
- React Router for page routing.
- Material UI icons and MUI DataGrid for tables.
- Recharts for line charts.
- Plain CSS files colocated with each page/component.

## Application Layout

- `src/index.jsx` mounts the app into the root DOM element.
- `src/App.jsx` defines the main shell with a top bar, sidebar, and routed page content.
- The top bar shows the dashboard brand/logo area and utility icons.
- The sidebar provides grouped navigation sections for Dashboard, Quick Menu, Notifications, and Staff.
- Only Home, Users, and Products routes are wired as navigable app pages; other sidebar items are visual/static menu entries.

## Routes

- `/` renders the Home dashboard.
- `/users` renders the user list table.
- `/users/:userId` renders the user detail/edit screen.
- `/users/newUser` renders the new user form.
- `/products` renders the product list table.
- `/products/:productId` renders the product detail/edit screen.
- `/products/newProduct` renders a placeholder new product page.

## Dashboard Features

- Revenue, Sales, and Cost summary cards with month-over-month indicators.
- User analytics line chart using Recharts and `userData`.
- New members widget showing sample users with avatar, title, and display button.
- Latest transactions table with customer, date, amount, and status badges.

## User Management Features

- User list page displays sample users in a MUI DataGrid.
- Columns include ID, user/avatar, email, status, transaction, and action controls.
- Each row has an Edit link to the user detail route.
- Each row has a delete icon that removes the user from local component state for the current session.
- User detail page shows a static user profile summary with account and contact details.
- User detail page includes an edit form with fields for username, full name, email, phone, address, avatar upload control, and update button.
- New user page includes a form for username, full name, email, password, phone, address, gender, active status, and create button.

## Product Management Features

- Product list page displays sample products in a MUI DataGrid.
- Columns include ID, product/image, stock, status, price, and action controls.
- Each row has an Edit link to the product detail route.
- Each row has a delete icon that removes the product from local component state for the current session.
- Product detail page shows a sales performance chart using `productData`.
- Product detail page shows static product metadata including image, ID, sales, active status, and stock status.
- Product detail page includes an edit form for product name, stock status, active status, image upload control, and update button.
- New product page currently exists only as a placeholder showing "New Product".

## Data Model and Sample Data

- `userData` powers the dashboard user analytics chart.
- `productData` powers the product sales performance chart.
- `userRows` powers the users DataGrid.
- `productRows` powers the products DataGrid.
- Data edits/deletions are local to component state and are not persisted after refresh.

## Useful File Map

- `src/App.jsx`: application shell and route definitions.
- `src/DummyData.jsx`: static chart/table data.
- `src/components/TopBar/Topbar.jsx`: top navigation bar.
- `src/components/SideBar/Sidebar.jsx`: sidebar navigation.
- `src/components/FeaturedInfo/FeaturedInfo.jsx`: dashboard metric cards.
- `src/components/Chart/Chart.jsx`: reusable Recharts line chart.
- `src/components/WidgetSmall/WidgetSmall.jsx`: new members widget.
- `src/components/WidgetLarge/WidgetLarge.jsx`: latest transactions table.
- `src/pages/Home/Home.jsx`: dashboard page.
- `src/pages/UserList/UserList.jsx`: users table page.
- `src/pages/User/User.jsx`: user profile/edit page.
- `src/pages/NewUser/NewUser.jsx`: user creation form.
- `src/pages/ProductList/ProductList.jsx`: products table page.
- `src/pages/Product/Product.jsx`: product detail/edit page.
- `src/pages/NewProduct/NewProduct.jsx`: new product placeholder page.

## Current Limitations

- Forms are UI-only and do not submit or validate data.
- Edit pages display static records rather than loading by route parameter.
- Delete actions only update local in-memory state.
- Several sidebar navigation items are labels only and do not route anywhere.
- The README still contains default Create React App text even though the project uses Vite scripts.
