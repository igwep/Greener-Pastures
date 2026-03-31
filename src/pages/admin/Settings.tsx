import React, { useState, useEffect } from "react";
import {
  useUpdateTransferAccountMutation,
  useTransferAccountQuery,
} from "../../services/admin/hooks";
import {
  useMarketplaceSettingsQuery,
  useUpdateAdminMarketplaceSettingsMutation,
} from "../../services/marketplace/hooks";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export function Settings() {
  const { data: transferAccountData, isLoading: transferAccountLoading } = useTransferAccountQuery();
  const mutation = useUpdateTransferAccountMutation();

  const { data: marketplaceSettings, isLoading: marketplaceSettingsLoading } =
    useMarketplaceSettingsQuery();
  const marketplaceMutation = useUpdateAdminMarketplaceSettingsMutation();

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [dailyListingFeeNaira, setDailyListingFeeNaira] = useState("");

  // Prefill from transfer account API
  useEffect(() => {
    if (transferAccountData?.transferAccount) {
      setBankName(transferAccountData.transferAccount.bankName);
      setAccountName(transferAccountData.transferAccount.accountName);
      setAccountNumber(transferAccountData.transferAccount.accountNumber);
    }
  }, [transferAccountData]);

  useEffect(() => {
    if (marketplaceSettings?.dailyListingFeeNaira != null) {
      setDailyListingFeeNaira(marketplaceSettings.dailyListingFeeNaira);
    }
  }, [marketplaceSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ bankName, accountName, accountNumber });
      showSuccessToast("Bank account details updated successfully!");
    } catch (error) {
      showErrorToast(error, 'Failed to update bank account details.');
    }
  };

  const handleMarketplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await marketplaceMutation.mutateAsync({ dailyListingFeeNaira });
      showSuccessToast("Marketplace settings updated successfully!");
    } catch (error) {
      showErrorToast(error, "Failed to update marketplace settings.");
    }
  };

  if (transferAccountLoading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Bank Account Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
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

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Marketplace Price Settings</h2>
        {marketplaceSettingsLoading ? (
          <p>Loading marketplace settings...</p>
        ) : (
          <form onSubmit={handleMarketplaceSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Daily Listing Fee (Naira)
              </label>
              <Input
                value={dailyListingFeeNaira}
                onChange={(e) => setDailyListingFeeNaira(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <Button type="submit" disabled={marketplaceMutation.isPending}>
              {marketplaceMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
