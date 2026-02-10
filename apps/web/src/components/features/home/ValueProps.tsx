'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, HeadphonesIcon, Award } from 'lucide-react';

const valueProps = [
    {
        icon: ShieldCheck,
        title: 'Kualitas Terjamin',
        description: 'Material pilihan dan pengerjaan rapi untuk kepuasan Anda.',
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'from-emerald-50 to-teal-50',
        iconColor: 'text-emerald-600'
    },
    {
        icon: Truck,
        title: 'Pengiriman Cepat',
        description: 'Layanan pengiriman tepat waktu ke seluruh Indonesia.',
        gradient: 'from-blue-500 to-cyan-600',
        iconBg: 'from-blue-50 to-cyan-50',
        iconColor: 'text-blue-600'
    },
    {
        icon: HeadphonesIcon,
        title: '24/7 Support',
        description: 'Layanan pelanggan siap membantu Anda kapan saja.',
        gradient: 'from-purple-500 to-pink-600',
        iconBg: 'from-purple-50 to-pink-50',
        iconColor: 'text-purple-600'
    },
    {
        icon: Award,
        title: 'Garansi Resmi',
        description: 'Produk bergaransi resmi untuk ketenangan pikiran Anda.',
        gradient: 'from-amber-500 to-orange-600',
        iconBg: 'from-amber-50 to-orange-50',
        iconColor: 'text-amber-600'
    }
];

export function ValueProps() {
    return (
        <section className="my-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {valueProps.map((prop, index) => {
                    const Icon = prop.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:border-transparent transition-all duration-300 overflow-hidden"
                        >
                            {/* Background Gradient (appears on hover) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${prop.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            {/* Icon Container */}
                            <div className="relative mb-6">
                                <div className={`absolute inset-0 bg-gradient-to-br ${prop.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                                <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${prop.iconBg} ${prop.iconColor} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-sm group-hover:shadow-lg`}>
                                    <Icon className="h-10 w-10" strokeWidth={1.5} />
                                </div>
                            </div>

                            <h3 className={`mb-3 text-xl font-bold text-gray-900 font-heading group-hover:bg-gradient-to-r group-hover:${prop.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                                {prop.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed text-sm">
                                {prop.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
