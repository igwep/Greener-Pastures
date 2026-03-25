import "./index.css";
import { render } from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ToastContainer />
  </QueryClientProvider>,
  document.getElementById("root")
);