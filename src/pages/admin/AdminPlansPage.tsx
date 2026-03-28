import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { useAdminPlansQuery, useCreateAdminPlanMutation } from "../../services/admin/hooks";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { formatNaira } from "../../utils/formatters";
import { PlusIcon } from "lucide-react";

type Props = {
  onBack?: () => void;
};

export function AdminPlansPage({ onBack }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contributionAmountNaira: "",
    isActive: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: plansData, isLoading, error, refetch } = useAdminPlansQuery();
  const createPlanMutation = useCreateAdminPlanMutation();

  const plans = plansData ?? [];

  // Debug: log the API response
  React.useEffect(() => {
    console.log("=== ADMIN PLANS DEBUG ===");
    console.log("plansData:", plansData);
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("plans:", plans);
    console.log("=== END ADMIN PLANS DEBUG ===");
  }, [plansData, isLoading, error, plans]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Plan name is required";
    if (!formData.contributionAmountNaira.trim()) errors.contributionAmountNaira = "Contribution amount is required";
    else if (isNaN(Number(formData.contributionAmountNaira)) || Number(formData.contributionAmountNaira) <= 0) {
      errors.contributionAmountNaira = "Must be a valid positive number";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createPlanMutation.mutateAsync({
        name: formData.name.trim(),
        contributionAmountNaira: formData.contributionAmountNaira.trim(),
        isActive: formData.isActive,
      });
      showSuccessToast("Plan created successfully!");
      setShowAddModal(false);
      setFormData({ name: "", contributionAmountNaira: "", isActive: true });
      setFieldErrors({});
    } catch (error) {
      showErrorToast(error, "Failed to create plan.");
    }
  };

  const handleCloseModal = () => {
    if (createPlanMutation.isPending) return;
    setShowAddModal(false);
    setFormData({ name: "", contributionAmountNaira: "", isActive: true });
    setFieldErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink tracking-tight">Savings Plans</h1>
        <div className="flex gap-3">
          <Button onClick={() => refetch()} variant="ghost" size="sm" className="rounded-xl">
            Refresh
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="rounded-xl">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="rounded-xl">
              Back
            </Button>
          )}
        </div>
      </div>

      <Card className="p-6 rounded-3xl border-none shadow-sm bg-white">
        {isLoading ? (
          <p className="text-ink-secondary">Loading plans...</p>
        ) : error ? (
          <div>
            <p className="text-sm text-red-600">Failed to load plans.</p>
            <p className="text-xs text-ink-secondary mt-1">{(error as any)?.message || JSON.stringify(error)}</p>
            <Button onClick={() => refetch()} className="mt-2" size="sm">
              Retry
            </Button>
          </div>
        ) : plans.length === 0 ? (
          <div>
            <p className="text-ink-secondary">No plans yet. Add your first plan to get started.</p>
            <details className="mt-2">
              <summary className="text-xs text-ink-secondary cursor-pointer">Debug info</summary>
              <pre className="text-xs bg-gray-50 p-2 mt-1 rounded overflow-auto">
                {JSON.stringify(plansData, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl"
              >
                <div>
                  <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
                  <p className="text-sm text-ink-secondary">Daily: {formatNaira(plan.contributionAmountNaira)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Add New Savings Plan"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={handleCloseModal} disabled={createPlanMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={createPlanMutation.isPending}
              disabled={createPlanMutation.isPending}
            >
              Create Plan
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Plan Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. Growth Plan - 2500"
              error={fieldErrors.name}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Daily Contribution (₦)</label>
            <Input
              type="number"
              value={formData.contributionAmountNaira}
              onChange={(e) => handleInputChange("contributionAmountNaira", e.target.value)}
              placeholder="2500"
              error={fieldErrors.contributionAmountNaira}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-ink">Active</label>
              <p className="text-xs text-ink-secondary">Whether users can select this plan</p>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="w-4 h-4 text-ajo-600 border-gray-300 rounded focus:ring-ajo-500"
            />
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
