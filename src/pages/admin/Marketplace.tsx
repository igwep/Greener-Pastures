import React, { useState } from "react";
import {
  useAdminProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
} from "../../services/marketplace/hooks";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { formatNaira } from "../../utils/formatters";

export function Marketplace() {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING",
  );
  const { data, isLoading } = useAdminProductsQuery({ status });
  const approveMutation = useApproveProductMutation();
  const rejectMutation = useRejectProductMutation();

  const handleApprove = async (productId: string) => {
    try {
      await approveMutation.mutateAsync(productId);
      showSuccessToast("Product approved successfully!");
    } catch (error) {
      showErrorToast(error, "Failed to approve product.");
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await rejectMutation.mutateAsync(productId);
      showSuccessToast("Product rejected successfully!");
    } catch (error) {
      showErrorToast(error, "Failed to reject product.");
    }
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <div className="flex mb-4">
        <button
          className={`px-3 py-1 rounded-md ${status === "PENDING" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("PENDING")}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 rounded-md ml-2 ${status === "APPROVED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("APPROVED")}
        >
          Approved
        </button>
        <button
          className={`px-3 py-1 rounded-md ml-2 ${status === "REJECTED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("REJECTED")}
        >
          Rejected
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.products.map((product) => (
          <Card key={product.id} className="p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-bold">{formatNaira(product.price)}</p>
              <p className="text-sm text-gray-500">
                {product.user.firstName} {product.user.lastName}
              </p>
            </div>
            {status === "PENDING" && (
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReject(product.id)}
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(product.id)}
                  disabled={approveMutation.isPending}
                >
                  Approve
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
