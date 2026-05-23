/// <reference types="vite/client" />

import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,
);
