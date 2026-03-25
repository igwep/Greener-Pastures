import React, { useState, useEffect } from "react";
import {
  useAdminDashboardQuery,
  useUpdateTransferAccountMutation,
} from "../../services/admin/hooks";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export function Settings() {
  const { data: dashboard, isLoading } = useAdminDashboardQuery();
  const mutation = useUpdateTransferAccountMutation();

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (dashboard?.transferAccount) {
      setBankName(dashboard.transferAccount.bankName);
      setAccountName(dashboard.transferAccount.accountName);
      setAccountNumber(dashboard.transferAccount.accountNumber);
    }
  }, [dashboard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ bankName, accountName, accountNumber });
      showSuccessToast("Bank account details updated successfully!");
    } catch (error) {
      showErrorToast(error, 'Failed to update bank account details.');
    }
  };

  if (isLoading) {
    return <p>Loading settings...</p>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bank Account Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <Input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Account Name
          </label>
          <Input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <Input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Card>
  );
}
