"use client";

import { Settings, Save, Loader2, Info } from "lucide-react";
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
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-zinc-50 to-gray-50 px-5 py-2.5 shadow-sm border border-zinc-100/50 mb-4">
              <Settings className="h-4 w-4 text-zinc-600" />
              <span className="text-sm font-semibold text-zinc-700">
                Konfigurasi Sistem
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Site Settings
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Konfigurasi global sistem, integrasi pihak ketiga, dan parameter
              bisnis
            </p>
          </div>
          <Button
            variant="gradient"
            size="md"
            className="shadow-lg hover:shadow-xl rounded-2xl"
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <aside className="lg:w-72 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 rounded-2xl text-sm font-bold transition-all shadow-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-zinc-500 to-gray-600 text-white shadow-lg scale-[1.02]"
                  : "bg-white border-2 border-gray-200 text-gray-600 hover:border-zinc-300 hover:shadow-md"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Content */}
        <main className="flex-1 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
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
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-zinc-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat pengaturan sistem...
            </p>
          </div>
        </div>
      }
    >
      <AdminSettingsContent initialSettings={initialSettings} />
    </Suspense>
  );
}
