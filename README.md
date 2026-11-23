# Phone Catalog

A modern **Single Page Application (SPA)** built with **React** and **TypeScript** that simulates an online mobile phone store. Users can browse products by category, sort them, add items to favorites or the shopping cart, and explore detailed product pages.

---

## Live Preview

 **Demo:**
https://aleksanderchaika.github.io/Phone-catalog/

---

## Design Reference

**Figma Design:**
[https://www.figma.com/design/WMdJ24eHk4EkSr25mrt7Y2/Phone-catalog--V2--Original-Dark](https://www.figma.com/design/WMdJ24eHk4EkSr25mrt7Y2/Phone-catalog--V2--Original-Dark)

The application is built from the Figma design with responsive layouts and reusable components.

---

## Technologies Used

* **React** — Component-based UI architecture
* **TypeScript** — Static typing and improved code reliability
* **React Router** — Client-side routing and dynamic navigation
* **Context API** — Global state management
* **SCSS (Sass)** — Modular styling with BEM methodology
* **Vite (via @mate-academy/scripts)** — Fast development server and build tool
* **ESLint, Stylelint & Prettier** — Code quality and formatting

---

## Getting Started

### Prerequisites

Before running the project, make sure you have installed:

* Node.js 24 (the version used in CI)
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

Open the local URL shown in the terminal.

---

# Features

### Product Catalog

* Browse phones, tablets, and accessories
* Responsive product grid
* Product cards with pricing and specifications

### Browsing & Sorting

* Browse products by category (phones, tablets, accessories)
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
* Sorting, items per page and pagination stored in the URL

### Responsive Design

Responsive layout for mobile, tablet and desktop.

---

## Project Structure

```text
src/
├── api/
├── components/
│   └── pages/
├── context/
├── hooks/
├── styles/
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

