import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';

import '@/App.css';
import App from "@/App";
import i18n from '@/contexts/i18n';
import { PromptProvider } from '@/components/prompt';


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <PromptProvider>
                    <App />
                </PromptProvider>
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
