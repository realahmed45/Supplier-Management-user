import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import DetailsPage from "./components/DetailsPage";
import SubmissionSuccess from "./components/SubmissionSuccess";

function App() {
  const [supplierData, setSupplierData] = useState({
    profilePicture: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    website: "",
    taxId: "",
    businessType: "",
    yearsInBusiness: 0,
    certifications: [],
    products: [],
    warehouses: [],
    shippingMethods: [],
    deliveryAreas: [],
    paymentTerms: "",
    preferredCurrency: "",
  });

  const [supplierId, setSupplierId] = useState(null); // Add this line

  const updateSupplierData = (newData) => {
    setSupplierData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProfilePage
                  supplierData={supplierData}
                  updateSupplierData={updateSupplierData}
                  setSupplierId={setSupplierId} // Pass this down
                />
              }
            />
            <Route
              path="/details/:id" // Update this route to accept ID
              element={
                <DetailsPage
                  supplierData={supplierData}
                  updateSupplierData={updateSupplierData}
                  supplierId={supplierId}
                />
              }
            />
            <Route path="/success" element={<SubmissionSuccess />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
