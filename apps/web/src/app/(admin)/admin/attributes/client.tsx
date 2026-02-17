"use client";

import { Attribute } from "@repo/shared";
import { ListChecks, Plus, X, Palette } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api";

interface AdminAttributesProps {
  attributes: Attribute[];
}

export default function AdminAttributesClient({
  attributes: initialAttributes,
}: AdminAttributesProps) {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [activeAttr, setActiveAttr] = useState<Attribute | null>(
    initialAttributes[0] || null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const getEndpoint = (code: string) => {
    if (code === "color") return "colors";
    if (code === "size") return "sizes";
    if (code === "finishing") return "finishing";
    return "";
  };

  const handleEditHex = async (
    colorId: number,
    currentName: string,
    currentHex: string,
  ) => {
    const newHex = prompt(
      `Edit Hex Code untuk "${currentName}":`,
      currentHex || "#000000",
    );
    if (!newHex || newHex === currentHex) return;

    try {
      setIsLoading(true);
      const response = await apiClient.put(
        `/admin/attributes/colors/${colorId}`,
        { hex_code: newHex },
      );

      if (response.status === 200) {
        // Update local state
        setAttributes((prev) =>
          prev.map((attr) => {
            if (attr.code === "color") {
              return {
                ...attr,
                values: attr.values?.map((val) =>
                  val.id === colorId ? { ...val, extra_data: newHex } : val,
                ),
              };
            }
            return attr;
          }),
        );

        // Update active selection
        setActiveAttr((prev) => {
          if (!prev || prev.code !== "color") return prev;
          return {
            ...prev,
            values: prev.values?.map((val) =>
              val.id === colorId ? { ...val, extra_data: newHex } : val,
            ),
          };
        });
      } else {
        alert("Gagal mengupdate hex code.");
      }
    } catch (error) {
      console.error("Update hex error:", error);
      alert("Gagal mengupdate hex code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddValue = async (attr: Attribute) => {
    const endpoint = getEndpoint(attr.code);
    if (!endpoint) return;

    const newValue = prompt(`Tambah ${attr.name} Baru:`);
    if (!newValue) return;

    let extraData = {};
    if (attr.code === "color") {
      const hex = prompt("Masukkan Hex Code (contoh: #FFFFFF):", "#000000");
      if (hex) extraData = { hex_code: hex };
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(`/admin/attributes/${endpoint}`, {
        name: newValue,
        ...extraData,
      });

      if (response.status === 201 || response.status === 200) {
        window.location.reload();
      } else {
        alert("Gagal menambahkan nilai.");
      }
    } catch (error) {
      console.error("Add attribute value error:", error);
      alert("Gagal menambahkan nilai.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (attrCode: string, id: number) => {
    const endpoint = getEndpoint(attrCode);
    if (!endpoint || !confirm("Yakin ingin menghapus ini?")) return;

    try {
      setIsLoading(true);
      const response = await apiClient.delete(
        `/admin/attributes/${endpoint}/${id}`,
      );

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete attribute error:", error);
      alert("Gagal menghapus atribut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-2.5 shadow-sm border border-violet-100/50 mb-4">
          <ListChecks className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">
            Manajemen Atribut
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Atribut Produk
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Kelola warna, ukuran, dan jenis finishing produk
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Attribute List Sidebar */}
        <aside className="lg:w-72 space-y-3">
          {attributes.map((attr) => (
            <button
              key={attr.id}
              onClick={() => setActiveAttr(attr)}
              className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all shadow-sm ${
                activeAttr?.id === attr.id
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-[1.02]"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-violet-300 hover:shadow-md"
              }`}
            >
              <span className="font-bold text-base">{attr.name}</span>
              <Badge
                variant={activeAttr?.id === attr.id ? "info" : "default"}
                className={`${activeAttr?.id === attr.id ? "bg-white/30 text-white" : "bg-gray-100"} text-xs px-2.5 py-0.5`}
              >
                {attr.values?.length || 0}
              </Badge>
            </button>
          ))}
        </aside>

        {/* Attribute Values Content */}
        <main className="flex-1">
          {activeAttr ? (
            <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    List {activeAttr.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeAttr.code === "color" && (
                      <span className="inline-flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5" />
                        Klik pada warna untuk mengedit Hex Code
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  className="rounded-2xl shadow-lg"
                  onClick={() => handleAddValue(activeAttr)}
                  isLoading={isLoading}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Tambah Baru
                </Button>
              </div>

              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeAttr.values?.map((val) => (
                    <div
                      key={val.id}
                      className="group relative flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-violet-300 hover:shadow-lg transition-all"
                    >
                      <div
                        className={`flex items-center gap-3 ${activeAttr.code === "color" ? "cursor-pointer" : ""}`}
                        onClick={() =>
                          activeAttr.code === "color" &&
                          handleEditHex(
                            val.id,
                            val.label,
                            val.extra_data || "#000000",
                          )
                        }
                      >
                        {activeAttr.code === "color" && (
                          <div
                            className="h-8 w-8 rounded-xl border-2 border-gray-300 shadow-md transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: val.extra_data || "#000000",
                            }}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {val.label}
                          </span>
                          {activeAttr.code === "color" && (
                            <span className="text-xs font-mono text-gray-500 group-hover:text-violet-600 transition-colors">
                              {val.extra_data || "#000000"}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(activeAttr.code, val.id)}
                        className="text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all p-1.5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {(!activeAttr.values || activeAttr.values.length === 0) && (
                    <div className="col-span-full py-16 text-center">
                      <ListChecks className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-base font-medium text-gray-500">
                        Belum ada nilai untuk atribut ini.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
              <ListChecks className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-base font-medium text-gray-500">
                Pilih atribut untuk mengelola nilainya
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
