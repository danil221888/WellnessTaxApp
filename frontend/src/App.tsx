import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { OrdersPage } from "./pages/OrdersPage";
import { CreateOrderPage } from "./pages/CreateOrderPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Orders</Link> |{" "}
        <Link to="/create">Create Order</Link>
      </nav>

      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/create" element={<CreateOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;