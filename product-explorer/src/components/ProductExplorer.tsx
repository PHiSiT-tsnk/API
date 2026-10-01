"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  // 4.1 โหลดอัตโนมัติเมื่อเปิดหน้าครั้งแรก
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  // 3.7 & 4.2 เพิ่มและแก้ไขสินค้า (สร้าง Array ใหม่เสมอ)
  function saveProduct(draft: ProductDraft) {
    if (editingId !== null) {
      setProducts(
        products.map((item) =>
          item.id === editingId ? { ...draft, id: editingId } : item
        )
      );
      setEditingId(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  // 4.2 ลบสินค้า
  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  const currentEditingProduct =
    editingId !== null ? products.find((p) => p.id === editingId) ?? null : null;

  return (
    <main style={{ padding: "32px 16px", maxWidth: "960px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#0f172a" }}>📦 รายการสินค้า</h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>จัดการและค้นหาสินค้าจาก External API</p>
        </div>
        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {status === "loading" ? "กำลังโหลด..." : "🔄 โหลดข้อมูลซ้ำ"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <ProductSearchForm onSearch={loadProducts} />

        <ProductForm
          key={editingId ?? "new"}
          editing={currentEditingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingId(null)}
        />

        <section aria-live="polite" style={{ marginTop: "12px" }}>
          {status === "loading" && (
            <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>⏳ กำลังโหลดข้อมูล...</p>
          )}
          {status === "error" && (
            <p role="alert" style={{ color: "#ef4444", backgroundColor: "#fee2e2", padding: "12px", borderRadius: "8px" }}>
              ⚠️ {errorMessage}
            </p>
          )}
          {status === "ready" && products.length === 0 && (
            <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>🔍 ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
          )}
          {status === "ready" && products.length > 0 && (
            <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "12px 16px" }}>รูปภาพ</th>
                    <th style={{ padding: "12px 16px" }}>ชื่อสินค้า</th>
                    <th style={{ padding: "12px 16px" }}>ราคา</th>
                    <th style={{ padding: "12px 16px" }}>คงเหลือ</th>
                    <th style={{ padding: "12px 16px" }}>หมวดหมู่</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 16px" }}>
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                              width: "56px",
                              height: "56px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              backgroundColor: "#f1f5f9",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "8px",
                              backgroundColor: "#e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              color: "#64748b",
                            }}
                          >
                            No Pic
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "10px 16px", fontWeight: "600", color: "#1e293b" }}>{item.title}</td>
                      <td style={{ padding: "10px 16px", color: "#059669", fontWeight: "600" }}>
                        ${item.price.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            backgroundColor: item.stock > 0 ? "#dcfce7" : "#fee2e2",
                            color: item.stock > 0 ? "#166534" : "#991b1b",
                          }}
                        >
                          {item.stock} ชิ้น
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px" }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => setEditingId(item.id)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "4px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProduct(item.id)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "#ef4444",
                            color: "white",
                            marginLeft: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}