"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";
import {
  AdminField,
  AdminModal,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../AdminForm";

export default function AddProduct({
  onProductAdd,
}: {
  onProductAdd?: () => void;
}) {
  const supabase = createClient();
  const [showFields, setShowFields] = useState(false);
  const [imageURL, setImageURL] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const bucket = "productImages";

  const close = () => {
    setShowFields(false);
    setImageURL(undefined);
    setError(null);
  };

  const getURL = (path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setImageURL(data.publicUrl);
  };

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(file.name, file);
    setUploading(false);

    if (error) {
      setError(error.message);
    } else {
      getURL(data.path);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      purchase: formData.get("purchase"),
      mrp: formData.get("mrp") as string,
      pretax: formData.get("special") as string,
      tax: formData.get("tax") as string,
      price: formData.get("price") as string,
      inventory: formData.get("inventory") as string,
    };

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from("products").insert({
        name: data.name,
        category: data.category,
        purchase: data.purchase,
        mrp: data.mrp,
        pretax: data.pretax,
        tax: data.tax,
        price: data.price,
        inventory: data.inventory,
        image_url: imageURL,
      });

      if (error) {
        console.error("Error adding new product to supabase", error);
        setError(error.message);
      } else {
        onProductAdd?.();
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
        onClick={() => setShowFields(true)}
        className={primaryButtonClass}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add product
      </button>
      {showFields && (
        <AdminModal title="Add new product" onClose={close}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AdminField label="Name" htmlFor="add-name">
              <input
                type="text"
                name="name"
                id="add-name"
                placeholder="Some Product Name"
                className={adminInputClass}
                required
              />
            </AdminField>
            <AdminField label="Category" htmlFor="add-category">
              <input
                type="text"
                name="category"
                id="add-category"
                placeholder="Others"
                defaultValue="Others"
                className={adminInputClass}
                required
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Purchase price" htmlFor="add-purchase">
                <input
                  type="number"
                  name="purchase"
                  id="add-purchase"
                  placeholder="0"
                  className={adminInputClass}
                  step="any"
                />
              </AdminField>
              <AdminField label="MRP" htmlFor="add-mrp">
                <input
                  type="number"
                  name="mrp"
                  id="add-mrp"
                  placeholder="0"
                  className={adminInputClass}
                  step="any"
                />
              </AdminField>
              <AdminField label="Special" htmlFor="add-special">
                <input
                  type="number"
                  name="special"
                  id="add-special"
                  placeholder="0"
                  className={adminInputClass}
                  step="any"
                />
              </AdminField>
              <AdminField label="Tax" htmlFor="add-tax">
                <input
                  type="number"
                  name="tax"
                  id="add-tax"
                  placeholder="0"
                  className={adminInputClass}
                  step="any"
                  defaultValue="0"
                  required
                />
              </AdminField>
              <AdminField label="Price" htmlFor="add-price">
                <input
                  type="number"
                  name="price"
                  id="add-price"
                  placeholder="0"
                  className={adminInputClass}
                  step="any"
                  required
                />
              </AdminField>
              <AdminField label="Inventory" htmlFor="add-inventory">
                <input
                  type="number"
                  name="inventory"
                  id="add-inventory"
                  placeholder="0"
                  defaultValue={1}
                  className={adminInputClass}
                  required
                />
              </AdminField>
            </div>
            <AdminField
              label={
                <>
                  Image{" "}
                  <span className="font-normal text-ink-muted">
                    (resize{" "}
                    <Link
                      href="https://bulkresizephotos.com/en?preset=true&format=webp&quality=30&transparency=false"
                      target="_blank"
                      className="text-sm text-field"
                    >
                      here
                    </Link>{" "}
                    first)
                  </span>
                </>
              }
              htmlFor="add-upload"
            >
              <div className="flex items-center gap-3">
                {imageURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageURL}
                    alt=""
                    className="w-14 h-14 rounded-md object-cover border border-line flex-shrink-0"
                  />
                ) : null}
                <input
                  type="file"
                  name="upload"
                  id="add-upload"
                  accept="image/*"
                  required
                  onChange={uploadFile}
                  className="w-full text-sm text-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-field-soft file:text-field file:font-medium file:px-4 file:py-2 file:cursor-pointer"
                />
              </div>
              {uploading && (
                <span className="text-xs text-ink-muted">Uploading…</span>
              )}
            </AdminField>
            {error && <p className="text-sm text-danger">Error: {error}</p>}
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
                disabled={uploading || saving || !imageURL}
                className={primaryButtonClass}
              >
                {saving ? "Adding…" : "Add product"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}
