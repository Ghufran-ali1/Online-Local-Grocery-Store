# Online Local Grocery Store – React + Vite Client

A modern and responsive web application for a neighborhood grocery store, allowing customers to browse available products, check stock quantities, view item details, and make online reservations — while store staff can manage inventory through an admin interface.

This project is the **client-side (frontend)** of the Ali Groceries system, built with **React + Vite** for optimal performance, modularity, and development speed.

Live Preview → [ghufran-grocery-store.vercel.app](https://ghufran-grocery-store.vercel.app)

<br>

## Features

### Customer Features
- View available grocery items with name, price, and stock quantity.
- Filter by categories such as fruits, vegetables, and dairy.
- Add items to favorites or watchlist.
- Make and manage reservations for in-store pickup.
- Fully responsive for desktop and mobile use.

### Admin Features
- Secure login authentication.
- Dashboard to manage inventory (CRUD operations).
- Update quantities, prices, and product information.
- View and manage customer reservations.
- Real-time UI feedback on updates.

### UI & UX Highlights
- Clean and modern design using React components.
- Fast load times with Vite HMR (Hot Module Replacement).
- Consistent color palette and spacing for visual harmony.
- Accessible navigation and intuitive layout.

<br>

## Technologies Used

| Category | Technology | Description |
|-----------|-------------|-------------|
| **Frontend** | React 19 + Vite | Component-based UI with blazing-fast builds |
| **Styling** | CSS3 | Responsive and adaptive layout design |
| **State Management** | React Hooks / Context API | Manage global and local state |
| **Routing** | React Router | Client-side routing for pages and admin dashboard |
| **Deployment** | Vercel | Fast and reliable hosting for modern web apps |
| **Version Control** | Git + GitHub | Branching, PRs, and issue tracking |

<br>

## Installation & Setup

Follow these steps to run the client locally.

### 1. Clone the repository
```bash
git clone https://github.com/Ghufran-ali1/Online-Local-Grocery-Store.git
cd Online-Local-Grocery-Store
```
### 2. Install dependencies
```
npm install
```
### 3. Run the development server
```
npm run dev
```
The app will run locally at:
```
http://localhost:5173
```
### 4. Build for production
```
npm run build
```

<br>

### Version History
- v1.0.0 (Oct 2025): Initial MVP release with customer reservation, admin CRUD, and responsive design.

<br>

## Project Structure

\`\`\`
Online-Local-Grocery-Store/
│
├── public/                # Static assets (logos, images, manifest, etc.)
│
├── src/
│   ├── assets/            # Images, icons, and media files specific to components or pages
│   ├── components/        # Reusable UI components (e.g., Navbar, ItemCard, Footer)
│   ├── pages/             # Page-level views (e.g., Home, AdminDashboard, Reservations)
│   ├── context/           # Global state management using React Context API (e.g., AuthContext, CartContext)
│   ├── utils/             # Helper functions and utilities (e.g., API calls, data formatting)
│   ├── App.jsx            # The root React component that sets up routing and context providers
│   ├── main.jsx           # Application entry point, mounts the React app to the DOM
│   └── styles.css         # Global stylesheet for consistent theming and basic layout
│
├── .gitignore             # Specifies files and directories to be ignored by Git (e.g., node_modules, build outputs)
├── eslint.config.js       # ESLint rules configuration for code quality enforcement
├── index.html             # The main HTML entry file where the Vite build is injected
├── package.json           # Project metadata, script definitions, and dependency list
├── vite.config.js         # Vite configuration for development server, bundling, and HMR (Hot Module Replacement)
└── README.md              # Project documentation (overview, setup, structure, and usage)
\`\`\`

<br>


### Notes

- **src/** contains the main source code for the React + Vite client application.
- **components/** are designed to be modular and reusable UI building blocks across different pages.
- **pages/** correspond directly to full-page views rendered via React Router.
- **context/** manages shared global state such as user sessions, shopping cart data, and application settings.
- **utils/** holds general-purpose helper functions for tasks like data formatting, validation, and managing API calls.
- The project follows a consistent file naming convention and indentation style to ensure high maintainability and readability.
"


## Testing

### Manual Test Scenarios

| Test ID | Description | Expected Result |
|----------|-------------|-----------------|
| **TC-01** | Load homepage | Items and categories display correctly |
| **TC-02** | Search for “Milk” | Displays all items with name “Milk” |
| **TC-03** | Add to Favorites | Item saved in user’s favorites |
| **TC-04** | Admin Login | Redirects to admin dashboard after authentication |
| **TC-05** | Update Stock Quantity | Reflects changes instantly in item list |

> **Note:** Unit testing setup can be integrated with **Jest** or **Vitest** for component-level validation.


<br>

## Code Quality & Documentation

- Consistent **indentation**, **naming**, and **folder structure**.  
- Each component and function includes **comments** explaining purpose, inputs, and expected outputs.  
- **ESLint** ensures clean and maintainable code.  
- Every file has a **sensible name and extension** matching its content and purpose.  


<br>

## GitHub Repository Standards

- ✅ `.gitignore` properly configured (node_modules, dist, env, etc.)  
- ✅ Issue tracker used for bug reports and enhancements  
- ✅ Feature branches for isolated development  
- ✅ Pull Requests for merging updates  
- ✅ Clean commit history with meaningful messages  

<br>

## Roadmap

- [ ] Add low-stock alerts on admin dashboard  
- [ ] Introduce dark mode for better accessibility  
- [ ] Enable item delivery scheduling  
- [ ] Add analytics section for store insights  

<br>

## License

This project is open source under the **MIT License**.  
Feel free to use, modify, and distribute with proper credit.

<br>


## Author

**Ghufran Ali**  
Full-Stack Developer | CISC 4900 Capstone 2025  
📧 Contact: [Email Available Upon Request]

> Built with ❤️ using **React + Vite**, for local stores moving into the digital era.
EOF

