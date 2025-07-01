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
      certifications: supplierData.certifications || [],
      products: supplierData.products || [],
      warehouses: supplierData.warehouses || [],
      shippingMethods: supplierData.shippingMethods || [],
      deliveryAreas: supplierData.deliveryAreas || [],
    });
  }, []);

  // Form inputs
  const [productInput, setProductInput] = useState({
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
    location: "",
    size: "",
    capacity: "",
    handlingCapacity: "",
  });

  const [certificationInput, setCertificationInput] = useState("");
  const [shippingMethodInput, setShippingMethodInput] = useState("");
  const [deliveryAreaInput, setDeliveryAreaInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSupplierData({ [name]: value });
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
      availableQuantity: Number(productInput.availableQuantity) || 0,
    };

    updateSupplierData({
      products: [...(supplierData.products || []), newProduct],
    });

    setProductInput({
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
    if (!warehouseInput.location.trim()) return;

    const newWarehouse = {
      ...warehouseInput,
      size: Number(warehouseInput.size) || 0,
      capacity: Number(warehouseInput.capacity) || 0,
      handlingCapacity: Number(warehouseInput.handlingCapacity) || 0,
    };

    updateSupplierData({
      warehouses: [...(supplierData.warehouses || []), newWarehouse],
    });

    setWarehouseInput({
      location: "",
      size: "",
      capacity: "",
      handlingCapacity: "",
    });
  };

  const removeWarehouse = (index) => {
    const updatedWarehouses = [...(supplierData.warehouses || [])];
    updatedWarehouses.splice(index, 1);
    updateSupplierData({ warehouses: updatedWarehouses });
  };

  const addItem = (type, input, setInput) => {
    console.log(`Adding ${type}:`, input);
    console.log(`Current ${type}:`, supplierData[type]);

    if (!input.trim()) return;

    const currentArray = supplierData[type] || [];
    const newArray = [...currentArray, input.trim()];

    console.log(`New ${type} array:`, newArray);

    updateSupplierData({
      [type]: newArray,
    });
    setInput("");
  };

  const removeItem = (type, index) => {
    const currentArray = [...(supplierData[type] || [])];
    currentArray.splice(index, 1);
    updateSupplierData({ [type]: currentArray });
  };

  const handlePreview = () => {
    console.log("Current supplierData before preview:", supplierData);
    setShowConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const businessData = {
        businessType: supplierData.businessType,
        yearsInBusiness: Number(supplierData.yearsInBusiness) || 0,
        certifications: supplierData.certifications || [],
        products: supplierData.products || [],
        warehouses: supplierData.warehouses || [],
        shippingMethods: supplierData.shippingMethods || [],
        deliveryAreas: supplierData.deliveryAreas || [],
        paymentTerms: supplierData.paymentTerms,
        preferredCurrency: supplierData.preferredCurrency,
      };

      console.log("=== DEBUG: Final Submit Data ===");
      console.log("Full businessData:", businessData);
      console.log("shippingMethods:", businessData.shippingMethods);
      console.log("deliveryAreas:", businessData.deliveryAreas);
      console.log("shippingMethods type:", typeof businessData.shippingMethods);
      console.log("deliveryAreas type:", typeof businessData.deliveryAreas);
      console.log(
        "shippingMethods length:",
        businessData.shippingMethods?.length
      );
      console.log("deliveryAreas length:", businessData.deliveryAreas?.length);

      const response = await axios.patch(
        `https://delicious-emerald-penalty.glitch.me/api/suppliers/${id}/business`,
        businessData
      );

      console.log("Backend response:", response.data);
      navigate("/success");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      console.error("Full error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={supplierData.businessType || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Business Type</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Other">Other</option>
                </select>
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

            {/* Certifications */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                Certifications
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Add certification (e.g., ISO 9001)"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addItem(
                      "certifications",
                      certificationInput,
                      setCertificationInput
                    ))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    addItem(
                      "certifications",
                      certificationInput,
                      setCertificationInput
                    )
                  }
                  className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>

              {supplierData.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {supplierData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeItem("certifications", index)}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                name="name"
                value={productInput.name}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Product name"
              />
              <input
                type="text"
                name="category"
                value={productInput.category}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Category"
              />
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
              <input
                type="number"
                name="availableQuantity"
                value={productInput.availableQuantity}
                onChange={handleProductChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Available qty"
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                name="size"
                value={warehouseInput.size}
                onChange={handleWarehouseChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Size (sq ft)"
              />
              <input
                type="number"
                name="capacity"
                value={warehouseInput.capacity}
                onChange={handleWarehouseChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Capacity (units)"
              />
              <input
                type="number"
                name="handlingCapacity"
                value={warehouseInput.handlingCapacity}
                onChange={handleWarehouseChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Daily handling"
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
                        {warehouse.location}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeWarehouse(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-gray-500">Size</p>
                        <p className="font-semibold">{warehouse.size} sq ft</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-gray-500">Capacity</p>
                        <p className="font-semibold">{warehouse.capacity}</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-gray-500">Daily</p>
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
                    Shipping Methods
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={shippingMethodInput}
                      onChange={(e) => setShippingMethodInput(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add shipping method"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addItem(
                          "shippingMethods",
                          shippingMethodInput,
                          setShippingMethodInput
                        ))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addItem(
                          "shippingMethods",
                          shippingMethodInput,
                          setShippingMethodInput
                        )
                      }
                      className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {supplierData.shippingMethods?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {supplierData.shippingMethods.map((method, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm"
                        >
                          {method}
                          <button
                            type="button"
                            onClick={() => removeItem("shippingMethods", index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Delivery Areas
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={deliveryAreaInput}
                      onChange={(e) => setDeliveryAreaInput(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add delivery area"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addItem(
                          "deliveryAreas",
                          deliveryAreaInput,
                          setDeliveryAreaInput
                        ))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addItem(
                          "deliveryAreas",
                          deliveryAreaInput,
                          setDeliveryAreaInput
                        )
                      }
                      className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {supplierData.deliveryAreas?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {supplierData.deliveryAreas.map((area, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeItem("deliveryAreas", index)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={supplierData.paymentTerms || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Payment Terms</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Advance Payment">Advance Payment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Currency
                  </label>
                  <select
                    name="preferredCurrency"
                    value={supplierData.preferredCurrency || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
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
      <div className="max-w-4xl mx-auto">
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

          {/* Profile Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
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
                    {supplierData.businessType || "Not specified"}
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
                  <Award className="mx-auto text-yellow-500 mb-1" size={20} />
                  <p className="text-2xl font-bold text-gray-800">
                    {supplierData.certifications?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Certifications</p>
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
