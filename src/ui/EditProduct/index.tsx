"use client";

import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { useState } from "react";
import {
  AdminField,
  AdminModal,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../AdminForm";

interface EditProductProps {
  id: number | undefined;
  onProductUpdate: () => void;
}

export default function EditProduct({ id, onProductUpdate }: EditProductProps) {
  const supabase = createClient();
  const [showFields, setShowFields] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setShowFields(false);
    setError(null);
  };

  async function fetchProduct() {
    setShowFields(true);
    const numericId = typeof id === "string" ? Number(id) : id;

    try {
      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("id", numericId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: (formData.get("description") as string) || null,
      purchase: formData.get("purchase") as string,
      mrp: formData.get("mrp") as string,
      pretax: formData.get("special") as string,
      tax: formData.get("tax") as string,
      price: formData.get("price") as string,
      inventory: formData.get("inventory") as string,
    };

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: data.name,
          category: data.category,
          description: data.description,
          purchase: data.purchase,
          mrp: data.mrp,
          pretax: data.pretax,
          tax: data.tax,
          price: data.price,
          inventory: data.inventory,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating product information to supabase", error);
        setError(error.message);
      } else {
        onProductUpdate(); // Trigger data refresh in the parent
        close();
      }
    } catch (err) {
      console.error("Unexpected error", err);
      setError("Something went wrong, please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fetchProduct()}
        className="text-sm font-medium text-field px-3 py-1.5 rounded-md hover:bg-field-soft transition-colors"
      >
        Edit
      </button>
      {showFields && (
        <AdminModal title={product?.name ?? "Edit product"} onClose={close}>
          {!product ? (
            <p className="text-sm text-ink-muted py-8 text-center">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AdminField label="Name" htmlFor="edit-name">
                <input
                  type="text"
                  name="name"
                  id="edit-name"
                  placeholder="Ceramic mug, 350 ml"
                  defaultValue={product.name}
                  className={adminInputClass}
                  required
                />
              </AdminField>
              <AdminField label="Category" htmlFor="edit-category">
                <input
                  type="text"
                  name="category"
                  id="edit-category"
                  placeholder="Category"
                  defaultValue={product.category}
                  className={adminInputClass}
                />
              </AdminField>
              <AdminField label="Description" htmlFor="edit-description">
                <textarea
                  name="description"
                  id="edit-description"
                  rows={3}
                  placeholder="Material, size, weight, care"
                  defaultValue={product.description}
                  className={adminInputClass}
                />
              </AdminField>
              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Purchase price" htmlFor="edit-purchase">
                  <input
                    type="number"
                    name="purchase"
                    id="edit-purchase"
                    placeholder="0"
                    defaultValue={product.purchase || 0}
                    className={adminInputClass}
                    step="any"
                  />
                </AdminField>
                <AdminField label="MRP" htmlFor="edit-mrp">
                  <input
                    type="number"
                    name="mrp"
                    id="edit-mrp"
                    placeholder="0"
                    defaultValue={product.mrp}
                    className={adminInputClass}
                    step="any"
                  />
                </AdminField>
                <AdminField label="Special" htmlFor="edit-special">
                  <input
                    type="number"
                    name="special"
                    id="edit-special"
                    placeholder="0"
                    defaultValue={product.pretax}
                    className={adminInputClass}
                    step="any"
                  />
                </AdminField>
                <AdminField label="Tax" htmlFor="edit-tax">
                  <input
                    type="number"
                    name="tax"
                    id="edit-tax"
                    placeholder="0"
                    defaultValue={product.tax}
                    className={adminInputClass}
                    step="any"
                  />
                </AdminField>
                <AdminField label="Price" htmlFor="edit-price">
                  <input
                    type="number"
                    name="price"
                    id="edit-price"
                    placeholder="0"
                    defaultValue={product.price}
                    className={adminInputClass}
                    step="any"
                  />
                </AdminField>
                <AdminField label="Inventory" htmlFor="edit-inventory">
                  <input
                    type="number"
                    name="inventory"
                    id="edit-inventory"
                    placeholder="0"
                    defaultValue={product.inventory}
                    className={adminInputClass}
                  />
                </AdminField>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={primaryButtonClass}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </AdminModal>
      )}
    </>
  );
}
