import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Package,
  Warehouse,
  Truck,
  DollarSign,
  Award,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Edit3,
  Eye,
  Upload,
  FileText,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import axios from "axios";

const DetailsPage = ({ supplierData, updateSupplierData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure arrays are initialized
  useEffect(() => {
    updateSupplierData({
      businessType: supplierData.businessType || [],
      products: supplierData.products || [],
      warehouses: supplierData.warehouses || [],
      shippingMethods: supplierData.shippingMethods || [],
      deliveryAreas: supplierData.deliveryAreas || [],
      paymentTerms: supplierData.paymentTerms || [],
      documents: supplierData.documents || [],
      preferredCurrency: "IDR",
    });
  }, []);

  // Form inputs
  const [productInput, setProductInput] = useState({
    brandName: "",
    name: "",
    category: "",
    description: "",
    minOrderQuantity: "",
    price: "",
    unit: "",
    availableQuantity: "",
    leadTime: "",
  });

  const [warehouseInput, setWarehouseInput] = useState({
    warehouseName: "",
    location: "",
    handlingCapacity: "",
  });

  const [documentInput, setDocumentInput] = useState({
    documentId: "",
    documentImage: null,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSupplierData({ [name]: value });
  };

  // Handle multiple business type selection
  const handleBusinessTypeChange = (type) => {
    const currentTypes = supplierData.businessType || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    updateSupplierData({ businessType: updatedTypes });
  };

  // Handle checkbox arrays (shipping methods, delivery areas, payment terms)
  const handleCheckboxChange = (field, value) => {
    const currentArray = supplierData[field] || [];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateSupplierData({ [field]: updatedArray });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    if (!productInput.name.trim()) return;

    const newProduct = {
      ...productInput,
      minOrderQuantity: Number(productInput.minOrderQuantity) || 0,
      price: Number(productInput.price) || 0,
    };

    updateSupplierData({
      products: [...(supplierData.products || []), newProduct],
    });

    setProductInput({
      brandName: "",
      name: "",
      category: "",
      description: "",
      minOrderQuantity: "",
      price: "",
      unit: "",
      availableQuantity: "",
      leadTime: "",
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = [...(supplierData.products || [])];
    updatedProducts.splice(index, 1);
    updateSupplierData({ products: updatedProducts });
  };

  const handleWarehouseChange = (e) => {
    const { name, value } = e.target;
    setWarehouseInput((prev) => ({ ...prev, [name]: value }));
  };

  const addWarehouse = () => {
    if (!warehouseInput.warehouseName.trim()) return;

    const newWarehouse = {
      ...warehouseInput,
      handlingCapacity: Number(warehouseInput.handlingCapacity) || 0,
    };

    updateSupplierData({
      warehouses: [...(supplierData.warehouses || []), newWarehouse],
    });

    setWarehouseInput({
      warehouseName: "",
      location: "",
      handlingCapacity: "",
    });
  };

  const removeWarehouse = (index) => {
    const updatedWarehouses = [...(supplierData.warehouses || [])];
    updatedWarehouses.splice(index, 1);
    updateSupplierData({ warehouses: updatedWarehouses });
  };

  const handleDocumentChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documentImage" && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentInput((prev) => ({
          ...prev,
          documentImage: e.target.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setDocumentInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addDocument = () => {
    if (!documentInput.documentId.trim() || !documentInput.documentImage)
      return;

    const newDocument = {
      ...documentInput,
      uploadedAt: new Date().toISOString(),
    };

    updateSupplierData({
      documents: [...(supplierData.documents || []), newDocument],
    });

    setDocumentInput({
      documentId: "",
      documentImage: null,
      description: "",
    });
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...(supplierData.documents || [])];
    updatedDocuments.splice(index, 1);
    updateSupplierData({ documents: updatedDocuments });
  };

  const handlePreview = () => {
    console.log("Current supplierData before preview:", supplierData);
    setShowConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const businessData = {
        businessType: supplierData.businessType || [],
        yearsInBusiness: Number(supplierData.yearsInBusiness) || 0,
        products: supplierData.products || [],
        warehouses: supplierData.warehouses || [],
        shippingMethods: supplierData.shippingMethods || [],
        deliveryAreas: supplierData.deliveryAreas || [],
        paymentTerms: supplierData.paymentTerms || [],
        preferredCurrency: "IDR",
        documents: supplierData.documents || [],
      };

      console.log("=== DEBUG: Final Submit Data ===");
      console.log("Full businessData:", businessData);

      const response = await axios.patch(
        `https://delicious-emerald-penalty.glitch.me/api/suppliers/${id}/business`,
        businessData
      );

      console.log("Backend response:", response.data);
      navigate("/success");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error saving business details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <ConfirmationPanel
        supplierData={supplierData}
        onEdit={() => setShowConfirmation(false)}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Building2 className="text-purple-600" size={40} />
                Business Details
              </h1>
              <p className="text-gray-600 mt-2">
                Complete your supplier profile with business information
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
        </div>

        <form className="space-y-8">
          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 className="text-blue-600" size={24} />
              Business Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Business Type (Select Multiple)
                </label>
                <div className="space-y-2">
                  {[
                    "Manufacturer",
                    "Wholesaler",
                    "Distributor",
                    "Importer",
                    "Other",
                  ].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          supplierData.businessType?.includes(type) || false
                        }
                        onChange={() => handleBusinessTypeChange(type)}
                        className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years in Business
                </label>
                <input
                  type="number"
                  name="yearsInBusiness"
                  value={supplierData.yearsInBusiness || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter years in business"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="text-green-600" size={24} />
              Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                name="brandName"
                value={productInput.brandName}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Brand name"
              />
              <input
                type="text"
                name="name"
                value={productInput.name}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Product name"
              />
              <select
                name="category"
                value={productInput.category}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Category</option>
                <option value="Cement">Cement</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                name="minOrderQuantity"
                value={productInput.minOrderQuantity}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Min order qty"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="price"
                  value={productInput.price}
                  onChange={handleProductChange}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Price"
                />
                <select
                  name="unit"
                  value={productInput.unit}
                  onChange={handleProductChange}
                  className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Unit</option>
                  <option value="piece">Piece</option>
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                  <option value="box">Box</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
              <select
                name="availableQuantity"
                value={productInput.availableQuantity}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Available Quantity</option>
                <option value="1kg">1kg</option>
                <option value="2kg">2kg</option>
                <option value="5kg">5kg</option>
                <option value="10kg">10kg</option>
                <option value="20kg">20kg</option>
                <option value="25kg">25kg</option>
                <option value="40kg">40kg</option>
                <option value="50kg">50kg</option>
              </select>
              <input
                type="text"
                name="leadTime"
                value={productInput.leadTime}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Lead time (e.g., 2-4 weeks)"
              />
              <textarea
                name="description"
                value={productInput.description}
                onChange={handleProductChange}
                rows="2"
                className="md:col-span-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Product description"
              />
            </div>

            <button
              type="button"
              onClick={addProduct}
              className="mb-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </button>

            {supplierData.products?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Brand
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Min Qty
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Available
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierData.products.map((product, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">
                            {product.brandName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product.minOrderQuantity}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-green-600">
                            {product.price} {product.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product.availableQuantity}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <X size={16} />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Warehouses */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Warehouse className="text-orange-600" size={24} />
              Warehouse Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                name="warehouseName"
                value={warehouseInput.warehouseName}
                onChange={handleWarehouseChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Warehouse Name"
              />
              <input
                type="text"
                name="location"
                value={warehouseInput.location}
                onChange={handleWarehouseChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Location"
              />
              <input
                type="number"
                name="handlingCapacity"
                value={warehouseInput.handlingCapacity}
                onChange={handleWarehouseChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Daily handling capacity"
              />
            </div>

            <button
              type="button"
              onClick={addWarehouse}
              className="mb-6 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Warehouse
            </button>

            {supplierData.warehouses?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplierData.warehouses.map((warehouse, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 p-4 rounded-xl border border-orange-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-800">
                        {warehouse.warehouseName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeWarehouse(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-gray-500">Location</p>
                        <p className="font-semibold">{warehouse.location}</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-gray-500">Daily Capacity</p>
                        <p className="font-semibold">
                          {warehouse.handlingCapacity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logistics & Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logistics */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="text-blue-600" size={24} />
                Logistics
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Shipping Methods (Select Multiple)
                  </label>
                  <div className="space-y-2">
                    {[
                      "Air Freight",
                      "Sea Freight",
                      "Land Transport",
                      "Express Delivery",
                      "Standard Delivery",
                    ].map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            supplierData.shippingMethods?.includes(method) ||
                            false
                          }
                          onChange={() =>
                            handleCheckboxChange("shippingMethods", method)
                          }
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Delivery Areas (Select Multiple)
                  </label>
                  <div className="space-y-2">
                    {["Seminyak", "Bali"].map((area) => (
                      <label key={area} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            supplierData.deliveryAreas?.includes(area) || false
                          }
                          onChange={() =>
                            handleCheckboxChange("deliveryAreas", area)
                          }
                          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="text-green-600" size={24} />
                Payment Terms
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Payment Terms (Select Multiple)
                  </label>
                  <div className="space-y-2">
                    {[
                      "Net 30",
                      "Net 60",
                      "Advance Payment",
                      "Cash on Delivery",
                      "Other",
                    ].map((term) => (
                      <label key={term} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            supplierData.paymentTerms?.includes(term) || false
                          }
                          onChange={() =>
                            handleCheckboxChange("paymentTerms", term)
                          }
                          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{term}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Currency
                  </label>
                  <input
                    type="text"
                    value="IDR"
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="text-red-600" size={24} />
              ID / Document Verification - No Scam Happens
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                name="documentId"
                value={documentInput.documentId}
                onChange={handleDocumentChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Document ID / Name"
              />
              <div className="relative">
                <input
                  type="file"
                  name="documentImage"
                  onChange={handleDocumentChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center gap-2 text-gray-600">
                  <Upload size={20} />
                  {documentInput.documentImage
                    ? "Image Selected"
                    : "Upload Document Image"}
                </div>
              </div>
              <input
                type="text"
                name="description"
                value={documentInput.description}
                onChange={handleDocumentChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Document Description"
              />
            </div>

            <button
              type="button"
              onClick={addDocument}
              className="mb-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Document
            </button>

            {supplierData.documents?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplierData.documents.map((document, index) => (
                  <div
                    key={index}
                    className="bg-red-50 p-4 rounded-xl border border-red-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-800">
                        {document.documentId}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {document.documentImage && (
                      <img
                        src={document.documentImage}
                        alt="Document"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm text-gray-600">
                      {document.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back to Profile
              </button>

              <button
                type="button"
                onClick={handlePreview}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
              >
                <Eye size={20} />
                Preview & Submit
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Support Box */}
      <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-purple-200 z-50">
        <div className="flex items-start gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <MessageCircle className="text-purple-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reach out to us while you need help filling this form
            </p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                <Phone size={16} />
                Call Support
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm">
                <Mail size={16} />
                Email Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Panel Component
const ConfirmationPanel = ({
  supplierData,
  onEdit,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Review Your Application
            </h1>
            <p className="text-gray-600">
              Please review all information before submitting your supplier
              application
            </p>
          </div>

          {/* Company Profile & Business Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="text-blue-600" size={20} />
                Company Profile
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Company:</span>
                  <span className="ml-2 text-gray-800">
                    {supplierData.companyName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Contact:</span>
                  <span className="ml-2 text-gray-800">
                    {supplierData.contactPerson}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">
                    {supplierData.email}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-800">
                    {supplierData.phone}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Business Type:
                  </span>
                  <span className="ml-2 text-gray-800">
                    {supplierData.businessType?.join(", ") || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Years in Business:
                  </span>
                  <span className="ml-2 text-gray-800">
                    {supplierData.yearsInBusiness || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Business Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <Package className="mx-auto text-green-500 mb-1" size={20} />
                  <p className="text-2xl font-bold text-gray-800">
                    {supplierData.products?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Warehouse
                    className="mx-auto text-orange-500 mb-1"
                    size={20}
                  />
                  <p className="text-2xl font-bold text-gray-800">
                    {supplierData.warehouses?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Warehouses</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <FileText className="mx-auto text-red-500 mb-1" size={20} />
                  <p className="text-2xl font-bold text-gray-800">
                    {supplierData.documents?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Documents</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Truck className="mx-auto text-blue-500 mb-1" size={20} />
                  <p className="text-2xl font-bold text-gray-800">
                    {supplierData.shippingMethods?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Shipping Methods</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Product Information */}
          {supplierData.products?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="text-green-600" size={24} />
                Product Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Brand
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Min Qty
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Available
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Lead Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierData.products.map((product, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {product.brandName}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product.minOrderQuantity}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-green-600">
                            {product.price} {product.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {product.availableQuantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product.leadTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed Warehouse Information */}
          {supplierData.warehouses?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Warehouse className="text-orange-600" size={24} />
                Warehouse Details ({supplierData.warehouses.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplierData.warehouses.map((warehouse, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 p-6 rounded-xl border border-orange-200"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Warehouse className="text-orange-600" size={20} />
                      <h4 className="font-bold text-gray-800 text-lg">
                        {warehouse.warehouseName || `Warehouse ${index + 1}`}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Location:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {warehouse.location || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Daily Handling Capacity:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {warehouse.handlingCapacity
                              ? `${warehouse.handlingCapacity} units`
                              : "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logistics & Payment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="text-blue-600" size={24} />
                Logistics Details
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Shipping Methods:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {supplierData.shippingMethods?.length > 0 ? (
                      supplierData.shippingMethods.map((method, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {method}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        None selected
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Delivery Areas:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {supplierData.deliveryAreas?.length > 0 ? (
                      supplierData.deliveryAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        None selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="text-green-600" size={24} />
                Payment Details
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Payment Terms:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {supplierData.paymentTerms?.length > 0 ? (
                      supplierData.paymentTerms.map((term, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {term}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        None selected
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Preferred Currency:
                  </h4>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
                    IDR (Indonesian Rupiah)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Verification Details */}
          {supplierData.documents?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-red-600" size={24} />
                Document Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplierData.documents.map((document, index) => (
                  <div
                    key={index}
                    className="bg-red-50 p-6 rounded-xl border border-red-200"
                  >
                    <h4 className="font-bold text-gray-800 text-lg mb-3">
                      {document.documentId}
                    </h4>
                    {document.documentImage && (
                      <img
                        src={document.documentImage}
                        alt="Document"
                        className="w-full h-32 object-cover rounded-lg mb-3 border"
                      />
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Description:</strong> {document.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded:{" "}
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onEdit}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <Edit3 size={20} />
              Edit Details
            </button>

            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirm & Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
