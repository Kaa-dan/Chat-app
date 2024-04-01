import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import { Home } from "./pages/Home";
import SignIn from "./pages/SignIn";
import { Chat } from "./components/Chat";
import { Search } from "./components/Search";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          Switc
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
