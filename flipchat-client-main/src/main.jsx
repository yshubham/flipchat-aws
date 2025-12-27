import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import SidebarContextProvider from "./context/SidebarContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

const GoogleWrapper = ({ children }) => (
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    {children}
  </GoogleOAuthProvider>
)


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SidebarContextProvider>
          <GoogleWrapper>
            <App />
          </GoogleWrapper>
        </SidebarContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
