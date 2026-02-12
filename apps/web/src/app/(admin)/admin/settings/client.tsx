"use client";

import { useState, Suspense } from "react";

import { Button } from "@/components/ui/Button";

interface Settings {
  [key: string]: unknown;
}

interface AdminSettingsClientProps {
  initialSettings: Settings;
}

function AdminSettingsContent({
  initialSettings: _initialSettings,
}: AdminSettingsClientProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "general", label: "Umum" },
    { id: "odoo", label: "Odoo ERP" },
    { id: "payment", label: "Pembayaran" },
    { id: "shipping", label: "Pengiriman" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>
          <p className="mt-1 text-sm text-gray-600">
            Konfigurasi global sistem, integrasi pihak ketiga, dan parameter
            bisnis
          </p>
        </div>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Simpan Perubahan
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <aside className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Content */}
        <main className="flex-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {activeTab === "general" && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Pengaturan Umum
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Toko
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="Ansania Store"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="support@ansania.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telepon Customer Service
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="+62 812 3456 7890"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="maintenance"
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="maintenance"
                    className="text-sm text-gray-700"
                  >
                    Aktifkan Maintenance Mode
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "odoo" && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Integrasi Odoo ERP
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Odoo URL
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="https://ansania.odoo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Database Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="ansania_prod"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      defaultValue="admin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <input
                      type="password"
                      title="Odoo API Key"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      defaultValue="********"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <div className="text-blue-500 mt-0.5">ⓘ</div>
                  <p className="text-xs text-blue-700">
                    Parameter ini digunakan untuk melakukan sinkronisasi produk,
                    stok, dan pesanan secara otomatis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Payment Gateway (DOKU)
              </h3>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Environment
                  </label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border">
                    <option>Sandbox (Testing)</option>
                    <option>Production (Live)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="DOKU_CLIENT_123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    title="Doku Secret Key"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="********"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Pengiriman (J&T)
              </h3>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    J&T VIP Account
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="ANSANIA_VIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Origin ID
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    defaultValue="JKT_HUD_01"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminSettingsClient({
  initialSettings,
}: AdminSettingsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">
          Memuat pengaturan sistem...
        </div>
      }
    >
      <AdminSettingsContent initialSettings={initialSettings} />
    </Suspense>
  );
}
