# Phone Catalog

A modern **Single Page Application (SPA)** built with **React** and **TypeScript** that simulates an online mobile phone store. Users can browse products, search, filter, sort, add items to favorites or the shopping cart, and explore detailed product pages.

---

## Live Preview

 **Demo:**
https://aleksanderchaika.github.io/Phone-catalog/

---

## Design Reference

**Figma Design:**
[https://www.figma.com/design/3dVbRBfoY6f9cQZQ0fJz9A/Phone-catalog--V2--Rounded-Style](https://www.figma.com/design/WMdJ24eHk4EkSr25mrt7Y2/Phone-catalog--V2--Original-Dark?node-id=0-1&p=f&t=rPKTYGZ5LKYPpymd-0)

The application was developed based on the original Figma design with attention to responsive layouts, reusable UI components, and pixel-perfect implementation.

---

## Technologies Used

* **React** — Component-based UI architecture
* **TypeScript** — Static typing and improved code reliability
* **React Router** — Client-side routing and dynamic navigation
* **Context API** — Global state management
* **SCSS (Sass)** — Modular styling with BEM methodology
* **Vite** — Fast development server and build tool
* **ESLint & Prettier** — Code quality and formatting

---

## Getting Started

### Prerequisites

Before running the project, make sure you have installed:

* Node.js (v18 or higher recommended)
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/AleksanderChaika/Phone-catalog.git
```

Navigate to the project directory:

```bash
cd Phone-catalog
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open your browser:

```text
http://localhost:3000
```

---

# Features

### Product Catalog

* Browse phones, tablets, and accessories
* Responsive product grid
* Product cards with pricing and specifications

### Search & Filtering

* Search products by name
* Filter products by category
* Sort products by age, name, or price
* Change the number of displayed items per page

### Product Details

* Detailed product information
* Image gallery
* Available colors and capacities
* Technical specifications
* Suggested related products

### Shopping Cart

* Add and remove products
* Increase or decrease product quantity
* Automatic total price calculation
* Cart data persists after page refresh

### Favorites

* Add products to favorites
* Remove products from favorites
* Favorites persist between sessions

### Navigation

* Client-side routing with React Router
* Breadcrumb navigation
* URL-based search, filtering, sorting, and pagination

### Responsive Design

The application is fully optimized for:

*  Mobile devices
*  Tablets
*  Laptops
*  Desktop screens

---

## Project Structure

```text
src/
├── api/
├── assets/
├── components/
├── context/
├── helpers/
├── hooks/
├── pages/
├── types/
└── utils/
```

---

## Known Limitations

Current version limitations:

* No user authentication
* No backend or database integration
* No online payment system
* Product data is loaded from static JSON files
* No product reviews or rating system

---

## Author

**Aleksander Chaika**

GitHub: https://github.com/AleksanderChaika

