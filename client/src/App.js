import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import HomePage from "./scenes/homePage/HomePage";
import LoginPage from "./scenes/loginPage/LoginRegisterPage";
import ProfilePage from "./scenes/profilePage/ProfilePage";

function App() {
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* resets the material ui's styles to basic css */}
          {/* Basically, The MUI provides MuiCssBaseline that overrides some of our CSS styles. But MUI provides the flexibility to override its default style. Here is what I have implemented */}
          <CssBaseline />
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route
              exact
              path="/home"
              element={user ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/profile/:_id"
              element={user ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
