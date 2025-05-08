import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PromptProvider } from '@/components/prompt'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PromptProvider>
      <App />
    </PromptProvider>
  </React.StrictMode>,
);
