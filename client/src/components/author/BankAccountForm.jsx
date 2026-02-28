import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Building2, Hash } from "lucide-react";
import Button from "../common/Button";
import Card, { CardBody } from "../common/Card";
import toast from "react-hot-toast";
import api from "../../api/axios";

const BankAccountForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
    upi_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.account_number !== formData.confirm_account_number) {
      toast.error("Account numbers do not match");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/author/bank-account", {
        account_holder_name: formData.account_holder_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code.toUpperCase(),
        bank_name: formData.bank_name,
        branch_name: formData.branch_name,
        upi_id: formData.upi_id,
      });

      toast.success("Bank account added successfully!");

      // Reset form
      setFormData({
        account_holder_name: "",
        account_number: "",
        confirm_account_number: "",
        ifsc_code: "",
        bank_name: "",
        branch_name: "",
        upi_id: "",
      });

      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error("Error adding bank account:", error);
      toast.error(
        error.response?.data?.message || "Failed to add bank account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Add Bank Account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
              placeholder="As per bank records"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter account number"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Confirm Account Number
            </label>
            <input
              type="text"
              name="confirm_account_number"
              value={formData.confirm_account_number}
              onChange={handleChange}
              placeholder="Re-enter account number"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleChange}
              placeholder="e.g., SBIN0001234"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
              required
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="e.g., State Bank of India"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Branch Name
            </label>
            <input
              type="text"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              placeholder="e.g., Connaught Place"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* UPI ID (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              UPI ID (Optional)
            </label>
            <input
              type="text"
              name="upi_id"
              value={formData.upi_id}
              onChange={handleChange}
              placeholder="yourname@upi"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
          >
            {loading ? "Adding..." : "Add Bank Account"}
          </Button>

          {/* Info */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Your bank details are encrypted and secure. Donations will be
            transferred to this account.
          </p>
        </form>
      </CardBody>
    </Card>
  );
};

export default BankAccountForm;
