"use client";

import {
  LayoutDashboard,
  Package,
  List,
  Archive,
  MessageSquare,
  ListChecks,
  ShoppingCart,
  Users,
  Ticket,
  Zap,
  Megaphone,
  Image as ImageIcon,
  FileText,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Shield,
  Mail,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

/**
 * Admin sidebar navigation with grouped sections
 */
export function AdminSidebar() {
  const pathname = usePathname();

  const sections: SidebarSection[] = [
    {
      label: "Utama",
      items: [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
      ],
    },
    {
      label: "Katalog",
      items: [
        {
          title: "Produk",
          href: "/admin/products",
          icon: <Package className="h-5 w-5" />,
        },
        {
          title: "Kategori",
          href: "/admin/categories",
          icon: <List className="h-5 w-5" />,
        },
        {
          title: "Stok",
          href: "/admin/stock",
          icon: <Archive className="h-5 w-5" />,
        },
        {
          title: "Ulasan",
          href: "/admin/reviews",
          icon: <MessageSquare className="h-5 w-5" />,
        },
        {
          title: "Atribut Produk",
          href: "/admin/attributes",
          icon: <ListChecks className="h-5 w-5" />,
        },
      ],
    },
    {
      label: "Penjualan",
      items: [
        {
          title: "Pesanan",
          href: "/admin/orders",
          icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
          title: "Pelanggan",
          href: "/admin/customers",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Voucher",
          href: "/admin/vouchers",
          icon: <Ticket className="h-5 w-5" />,
        },
        {
          title: "Flash Sale",
          href: "/admin/flash-sales",
          icon: <Zap className="h-5 w-5" />,
        },
      ],
    },
    {
      label: "Marketing",
      items: [
        {
          title: "Alat Marketing",
          href: "/admin/marketing",
          icon: <Megaphone className="h-5 w-5" />,
        },
      ],
    },
    {
      label: "Konten",
      items: [
        {
          title: "Banner",
          href: "/admin/cms/banners",
          icon: <ImageIcon className="h-5 w-5" />,
        },
        {
          title: "Halaman",
          href: "/admin/cms/pages",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      label: "Sistem",
      items: [
        {
          title: "Odoo Sync",
          href: "/admin/sync",
          icon: <RefreshCw className="h-5 w-5" />,
        },
        {
          title: "Laporan",
          href: "/admin/reports",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          title: "Analitik",
          href: "/admin/analytics",
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: "Log Aktivitas",
          href: "/admin/system/activity-logs",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          title: "Email Queue",
          href: "/admin/system/email-queue",
          icon: <Mail className="h-5 w-5" />,
        },
        {
          title: "Pengaturan",
          href: "/admin/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ];

  return (
    <nav className="space-y-8">
      {sections.map((section) => (
        <div key={section.label}>
          <div className="mb-3 px-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {section.label}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
          <div className="space-y-1.5">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:scale-[1.01]"
                  }`}
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isActive
                        ? "text-white scale-110"
                        : "text-gray-400 group-hover:text-indigo-500 group-hover:scale-110"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.title}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
