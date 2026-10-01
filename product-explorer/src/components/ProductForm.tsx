"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
          thumbnail: editing.thumbnail ?? "",
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
          category: "" as any,
          thumbnail: "",
        },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  const inputStyle = (hasError?: boolean) => ({
    padding: "8px 12px",
    borderRadius: "6px",
    border: hasError ? "1px solid #ef4444" : "1px solid #cbd5e1",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box" as const,
  });

  return (
    <form
      onSubmit={handleSubmit(saveProduct)}
      noValidate
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1e293b" }}>
        {editing ? "✏️ แก้ไขสินค้า" : "➕ เพิ่มสินค้าใหม่"}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        <div>
          <label htmlFor="title" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
            ชื่อสินค้า *
          </label>
          <input
            id="title"
            required
            {...register("title")}
            aria-invalid={!!errors.title}
            aria-describedby="title-error"
            style={inputStyle(!!errors.title)}
          />
          {errors.title && (
            <span id="title-error" role="alert" style={{ color: "#ef4444", fontSize: "12px" }}>
              {errors.title.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="price" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
            ราคา ($) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            required
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            aria-describedby="price-error"
            style={inputStyle(!!errors.price)}
          />
          {errors.price && (
            <span id="price-error" role="alert" style={{ color: "#ef4444", fontSize: "12px" }}>
              {errors.price.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="stock" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
            จำนวนคงเหลือ *
          </label>
          <input
            id="stock"
            type="number"
            required
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
            aria-describedby="stock-error"
            style={inputStyle(!!errors.stock)}
          />
          {errors.stock && (
            <span id="stock-error" role="alert" style={{ color: "#ef4444", fontSize: "12px" }}>
              {errors.stock.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="category" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
            หมวดหมู่ *
          </label>
          <select
            id="category"
            required
            {...register("category")}
            aria-invalid={!!errors.category}
            aria-describedby="category-error"
            style={inputStyle(!!errors.category)}
          >
            <option value="">กรุณาเลือกหมวดหมู่</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span id="category-error" role="alert" style={{ color: "#ef4444", fontSize: "12px" }}>
              {errors.category.message}
            </span>
          )}
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="thumbnail" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
            ลิงก์รูปภาพ (URL)
          </label>
          <input
            id="thumbnail"
            placeholder="https://..."
            {...register("thumbnail")}
            style={inputStyle()}
          />
        </div>
      </div>

      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          style={{
            padding: "8px 18px",
            borderRadius: "6px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            fontWeight: "600",
            cursor: !isDirty || !isValid ? "not-allowed" : "pointer",
            opacity: !isDirty || !isValid ? 0.6 : 1,
          }}
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              backgroundColor: "#64748b",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}