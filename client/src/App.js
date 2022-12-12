import { BrowsesrRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../src/scenes/homePage";
import LoginPage from "../src/scenes/loginPage";
import ProfilePage from "../src/scenes/profilePage";

function App() {
  return (
    <div className="app">
      <BrowsesrRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/profile/:_id" element={<ProfilePage />} />
        </Routes>
      </BrowsesrRouter>
    </div>
  );
}

export default App;
