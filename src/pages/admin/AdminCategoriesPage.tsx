import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "../../services/marketplace/adminCategories";

type CategoryRow = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
};

type Props = {
  onBack?: () => void;
};

export function AdminCategoriesPage({ onBack }: Props) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(
    null,
  );
  const [deleteCategory, setDeleteCategory] = useState<CategoryRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    isActive: boolean;
  }>({
    name: "",
    description: "",
    isActive: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    void refreshCategories();
  }, [showInactive]);

  const refreshCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminListCategories({
        includeInactive: true,
      });
      const rows: CategoryRow[] = (res.categories ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? "",
        isActive: c.isActive ?? true,
        productCount: c.productCount,
      }));
      setCategories(rows);
    } catch (err) {
      console.error("Failed to load categories", err);
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = categories;
    if (!showInactive) {
      list = list.filter((c) => c.isActive);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [categories, search, showInactive]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", isActive: true });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryRow) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description ?? "",
      isActive: cat.isActive,
    });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Name must be at most 100 characters";
    }
    if (formData.description.trim().length > 500) {
      errors.description = "Description must be at most 500 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const payload: UpdateCategoryRequest = {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
        };
        await adminUpdateCategory(editingCategory.id, payload);
        showSuccessToast("Category updated");
      } else {
        const payload: CreateCategoryRequest = {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
        };
        await adminCreateCategory(payload);
        showSuccessToast("Category created");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      await refreshCategories();
    } catch (err: any) {
      console.error("Failed to save category", err);
      showErrorToast(err, "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: CategoryRow) => {
    try {
      await adminDeleteCategory(cat.id);
      showSuccessToast("Category deleted");
      await refreshCategories();
    } catch (err: any) {
      console.error("Failed to delete category", err);
      showErrorToast(err, "Failed to delete category");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Marketplace Categories
          </h1>
          <p className="text-ink-secondary mt-1 text-sm">
            Add, edit, and deactivate categories used in the marketplace.
          </p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-secondary">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-ajo-600 border-gray-300 rounded focus:ring-ajo-500"
            />
            Show inactive
          </label>
          <Button onClick={refreshCategories} variant="ghost" size="sm">
            Refresh
          </Button>
          <Button onClick={openCreateModal} size="sm">
            Add Category
          </Button>
          {onBack && (
            <Button onClick={onBack} variant="ghost" size="sm">
              Back
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-ink-secondary text-sm py-6">Loading categories…</p>
        ) : error ? (
          <div className="text-sm text-red-600 py-4">
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-ink-secondary text-sm py-6">
            No categories found. Try adjusting filters or add a new category.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-ink truncate">
                      {cat.name}
                    </span>
                    <Badge variant={cat.isActive ? "success" : "neutral"}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {typeof cat.productCount === "number" && (
                      <span className="text-xs text-ink-secondary">
                        {cat.productCount} products
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-ink-secondary line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteCategory(cat)}
                    disabled={cat.productCount && cat.productCount > 0}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (isSubmitting) return;
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Category" : "Add Category"}
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                if (isSubmitting) return;
                setIsModalOpen(false);
                setEditingCategory(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Electronics"
              error={fieldErrors.name}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Short description shown in admin only"
              className="w-full min-h-24 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ajo-500 focus:border-transparent text-sm"
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Active</p>
              <p className="text-xs text-ink-secondary">
                Inactive categories won’t be available to users.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className="w-4 h-4 text-ajo-600 border-gray-300 rounded focus:ring-ajo-500"
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteCategory}
        onClose={() => {
          if (isSubmitting) return;
          setDeleteCategory(null);
        }}
        title="Delete Category"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteCategory(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isSubmitting}
              disabled={!deleteCategory}
              onClick={async () => {
                if (!deleteCategory) return;
                setIsSubmitting(true);
                try {
                  await handleDelete(deleteCategory);
                  setDeleteCategory(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Yes, Delete
            </Button>
          </div>
        }
      >
        <div className="p-1 text-sm text-ink-secondary">
          {deleteCategory ? (
            <p>
              Delete category <span className="font-semibold text-ink">"{deleteCategory.name}"</span>?
              This will fail if it has products.
            </p>
          ) : null}
        </div>
      </Modal>
    </motion.div>
  );
}

