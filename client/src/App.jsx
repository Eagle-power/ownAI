import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // 1. Import Navigate
import PurchaseOrderPage from "./pages/PurchaseOrderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. Add a redirect for the root path */}
        <Route path="/" element={<Navigate to="/purchase-order" replace />} />

        {/* Route for Creating New PO */}
        <Route path="/purchase-order" element={<PurchaseOrderPage />} />

        {/* Route for Viewing/Editing PO */}
        <Route path="/purchase-order/:id" element={<PurchaseOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
