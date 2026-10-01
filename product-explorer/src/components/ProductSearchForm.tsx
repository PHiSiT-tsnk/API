"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr)) auto",
        gap: "14px",
        alignItems: "end",
        backgroundColor: "#f8fafc",
        padding: "18px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="q" style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
          คำค้น
        </label>
        <input
          id="q"
          {...register("q")}
          placeholder="เช่น phone, perfume..."
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="limit" style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
          จำนวนรายการ (1-30)
        </label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          aria-describedby="limit-error"
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: errors.limit ? "1px solid #ef4444" : "1px solid #cbd5e1",
            fontSize: "14px",
          }}
        />
        {errors.limit && (
          <span id="limit-error" role="alert" style={{ color: "#ef4444", fontSize: "12px" }}>
            {errors.limit.message}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="sortBy" style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
          เรียงตาม
        </label>
        <select
          id="sortBy"
          {...register("sortBy")}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
            backgroundColor: "#fff",
          }}
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "9px 20px",
          borderRadius: "6px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          fontWeight: "600",
          fontSize: "14px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          height: "38px",
        }}
      >
        {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}