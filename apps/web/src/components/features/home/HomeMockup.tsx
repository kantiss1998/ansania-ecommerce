"use client";

import { motion, Variants } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Star,
  ChevronRight,
  Layers,
  Heart,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother feel
    },
  },
};

export function HomeMockup() {
  return (
    <div className="space-y-24 pb-20">
      {/* --- HERO MOCKUP --- */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#171717] min-h-[600px] flex items-center">
        {/* Decorative Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-700/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-900/10 rounded-full blur-[100px]" />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="container relative z-10 mx-auto px-8 md:px-16 grid lg:grid-cols-2 gap-12 items-center text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-100 uppercase tracking-widest">
                Koleksi Ramadhan 2026
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold font-heading text-white leading-[1.1]">
              Elegansi dalam <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-200 to-primary-500 bg-clip-text text-transparent">
                Kesederhanaan
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
              Temukan koleksi eksklusif Ansania yang dirancang khusus untuk
              kenyamanan dan keanggunan gaya modern Anda.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <Button
                size="lg"
                className="h-16 px-10 rounded-full bg-primary-600 hover:bg-primary-500 text-lg font-semibold shadow-xl shadow-primary-900/20 group"
              >
                Belanja Sekarang
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-full border-white/10 text-white hover:bg-white/5 text-lg font-semibold backdrop-blur-sm"
              >
                Lihat Lookbook
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-20 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-1 backdrop-blur-2xl">
              <div className="aspect-[4/5] bg-neutral-800 rounded-[1.8rem] flex items-center justify-center relative overflow-hidden group">
                {/* Placeholder for high-end fashion image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Layers className="h-20 w-20 text-white/10" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                    <p className="text-white font-semibold text-lg">
                      Signature Series
                    </p>
                    <p className="text-white/60 text-sm">
                      Edisi Terbatas • Tersedia Sekarang
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-30 bg-primary-600 p-8 rounded-full shadow-2xl flex flex-col items-center justify-center text-white border-4 border-[#171717]"
            >
              <span className="text-xs font-bold uppercase tracking-tighter">
                Diskon
              </span>
              <span className="text-3xl font-black italic">30%</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- CATEGORIES MOCKUP --- */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-heading text-gray-900">
              Kategori Populer
            </h2>
            <p className="text-gray-500 max-w-md">
              Jelajahi berbagai pilihan koleksi terbaik kami yang sesuai dengan
              kebutuhan gaya Anda.
            </p>
          </div>
          <Link
            href="/categories"
            className="group inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Lihat Semua Kategori
            <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {
              name: "Hijab Voice",
              icon: Sparkles,
              count: "120+ Produk",
              color: "bg-rose-50",
            },
            {
              name: "Gamis Premium",
              icon: Layers,
              count: "85+ Produk",
              color: "bg-blue-50",
            },
            {
              name: "Mukena Series",
              icon: Heart,
              count: "40+ Produk",
              color: "bg-amber-50",
            },
            {
              name: "Accessories",
              icon: ShoppingBag,
              count: "60+ Produk",
              color: "bg-emerald-50",
            },
          ].map((cat, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div
                className={`aspect-square rounded-[2rem] ${cat.color} flex flex-col items-center justify-center p-8 transition-shadow hover:shadow-xl hover:shadow-primary-500/10 border border-transparent hover:border-primary-100`}
              >
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{cat.count}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- NEW ARRIVALS MOCKUP --- */}
      <section className="bg-gray-50 py-24 -mx-4 px-4 overflow-hidden text-center">
        <div className="container mx-auto">
          <div className="mb-16 space-y-4">
            <div className="inline-block px-4 py-1.5 bg-primary-50 rounded-full text-primary-600 text-xs font-bold uppercase tracking-widest">
              Terbaru
            </div>
            <h2 className="text-5xl font-bold font-heading text-gray-900 italic">
              Koleksi Teranyar
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto italic">
              Desain eksklusif yang memadukan tren terkini dengan sentuhan
              klasik yang abadi.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left"
          >
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                variants={itemVariants}
                key={item}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] bg-white overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  {/* Mock Image */}
                  <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-900 border border-gray-100 shadow-sm">
                    New Arrival
                  </div>

                  {/* Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <Button className="w-full bg-primary-700 hover:bg-primary-800 text-white rounded-2xl h-14 font-bold shadow-lg shadow-primary-900/20">
                      Tambah ke Keranjang
                    </Button>
                  </div>

                  {/* Wishlist */}
                  <button className="absolute top-5 right-5 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-primary-600 hover:scale-110 transition-all shadow-sm">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-6 space-y-2 px-2">
                  <div className="flex justify-between items-start text-left">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors italic">
                      Premium Silk Scarf {item}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs font-bold text-gray-900">
                        4.9
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-primary-700">
                      Rp 149.000
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      Rp 199.000
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 text-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-12 border-2 border-primary-100 hover:border-primary-600 hover:bg-primary-50 text-gray-900 font-bold transition-all h-14"
            >
              Lihat Semua Koleksi Baru
            </Button>
          </div>
        </div>
      </section>

      {/* --- BRAND PROMISE MOCKUP --- */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12 text-left">
          {[
            {
              title: "Material Premium",
              desc: "Kami hanya menggunakan bahan kualitas terbaik untuk kenyamanan Anda.",
              icon: ShieldCheck,
            },
            {
              title: "Pengiriman Seluruh Dunia",
              desc: "Layanan pengiriman terpercaya hingga ke depan pintu rumah Anda.",
              icon: ShoppingBag,
            },
            {
              title: "Dukungan 24/7",
              desc: "Tim kami siap membantu Anda kapan saja untuk pengalaman belanja terbaik.",
              icon: Sparkles,
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                <item.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-gray-500 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
