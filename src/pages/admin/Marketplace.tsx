import React, { useEffect, useMemo, useState } from "react";
import {
  useAdminProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useSuspendProductAdminMutation,
} from "../../services/marketplace/hooks";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { formatNaira } from "../../utils/formatters";

type Props = {
  onAddProduct?: () => void;
};

export function Marketplace({ onAddProduct }: Props) {
  const [status, setStatus] = useState<"PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED" | "REJECTED">(
    "PENDING",
  );
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const { data, isLoading } = useAdminProductsQuery({ status });
  const approveMutation = useApproveProductMutation();
  const rejectMutation = useRejectProductMutation();
  const suspendMutation = useSuspendProductAdminMutation();

  const filteredProducts = useMemo(() => {
    const products = data?.products ?? [];
    return products.filter((p) => p.status === status);
  }, [data?.products, status]);

  useEffect(() => {
    console.log("=== ADMIN MARKETPLACE PRODUCTS DEBUG ===");
    console.log("status:", status);
    console.log("data:", data);
    console.log("products:", data?.products);
    console.log("filteredProducts:", filteredProducts);
    console.log("nextCursor:", (data as any)?.nextCursor);
    console.log("=== END ADMIN MARKETPLACE PRODUCTS DEBUG ===");
  }, [data, filteredProducts, status]);

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

  const openSuspendModal = (productId: string) => {
    setSelectedProductId(productId);
    setShowSuspendModal(true);
  };

  const handleSuspendConfirm = async () => {
    const productId = selectedProductId;
    setShowSuspendModal(false);
    setSelectedProductId("");

    if (!productId) return;

    try {
      await suspendMutation.mutateAsync(productId);
      showSuccessToast("Product suspended successfully!");
    } catch (error) {
      showErrorToast(error, "Failed to suspend product.");
    }
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          className={`px-3 py-1 rounded-md ${status === "PENDING" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("PENDING")}
        >
          Pending
        </button>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-md ${status === "ACTIVE" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("ACTIVE")}
          >
            Approved
          </button>
          <button
            className={`px-3 py-1 rounded-md ${status === "SUSPENDED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("SUSPENDED")}
          >
            Suspended
          </button>
          <button
            className={`px-3 py-1 rounded-md ${status === "EXPIRED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("EXPIRED")}
          >
            Expired
          </button>
          <button
            className={`px-3 py-1 rounded-md ${status === "REJECTED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("REJECTED")}
          >
            Rejected
          </button>

          {onAddProduct && (
            <Button onClick={onAddProduct} size="sm">
              Add Product
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <img
              src={product.images?.[0]?.imagePath || product.imageUrls?.[0] || ""}
              alt={product.title}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-sm text-gray-500">{product.status}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-bold">{formatNaira(product.priceNaira)}</p>
              <p className="text-sm text-gray-500">
                {product.user?.firstName} {product.user?.lastName}
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

            {status === "ACTIVE" && (
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => openSuspendModal(product.id)}
                  disabled={suspendMutation.isPending}
                >
                  Suspend
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showSuspendModal}
        onClose={() => {
          if (suspendMutation.isPending) return;
          setShowSuspendModal(false);
          setSelectedProductId("");
        }}
        title="Suspend Product"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                if (suspendMutation.isPending) return;
                setShowSuspendModal(false);
                setSelectedProductId("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSuspendConfirm}
              disabled={!selectedProductId || suspendMutation.isPending}
              isLoading={suspendMutation.isPending}
            >
              Suspend
            </Button>
          </>
        }
      >
        <p className="text-ink-secondary">
          This will suspend the product and remove it from active listings. You can view suspended items in the
          Suspended tab.
        </p>
      </Modal>
    </div>
  );
}
