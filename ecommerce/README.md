The client folder with the file Api.tsx sets up Axios with the Fake Store API, so API requests can be reused across the whole app.

The file components;
Cart.tsx it displays items in the cart, allows the user to update quantities or remove items, and it calculates the total number of items and the total price.
Home.tsx this is the home page of the shopping app. It displays products from the API, allows users to filter products by catafory, and lets users add products to the shopping cart.

In products folder the file useProducts.tsx creates 2 custom React Query hooks for fetching data from Fake Store API. useCategories retrieves all product categories. useProducts fetches products from all categories and from the selected one.

In the store folder the file;
cartSlice.tsx is used to manage the shopping cart. It in cludes actions for adding/removing/updating item quantities, and clearing the cart out. The cart is save to sessionStorage.
store.tsx registers the cartReducer so the cart can be managed globally. Also, it exports the rootStatev and AppDispatch.

the types folder with the Products.ts file describes the structure of the product(ID, title, price, category, description, image, and rating.

App.tsx sets up routes and allows navigation between them.

main.tsx wraps the app Redux Providerand React Query which enables the global state. It also imports the global CSS file copilot helped me.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
