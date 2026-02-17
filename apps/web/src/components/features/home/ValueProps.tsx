"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, HeadphonesIcon, Sparkles } from "lucide-react";

import { Card } from "@/components/atoms/Card";
import { Grid } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Kualitas Premium",
    description: "Bahan berkualitas tinggi yang nyaman dan halus di kulit.",
    color: "primary",
    iconBg: "bg-gradient-to-br from-primary-50 to-primary-100",
    iconColor: "text-primary-600",
    glowColor: "group-hover:shadow-primary-500/20",
  },
  {
    icon: Truck,
    title: "Gratis Ongkir",
    description:
      "Pengiriman gratis ke seluruh Indonesia untuk pembelian tertentu.",
    color: "info",
    iconBg: "bg-gradient-to-br from-blue-50 to-blue-100",
    iconColor: "text-blue-600",
    glowColor: "group-hover:shadow-blue-500/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Care",
    description:
      "Layanan konsultasi untuk membantu Anda memilih kerudung yang tepat.",
    color: "secondary",
    iconBg: "bg-gradient-to-br from-purple-50 to-purple-100",
    iconColor: "text-purple-600",
    glowColor: "group-hover:shadow-purple-500/20",
  },
  {
    icon: Sparkles,
    title: "Desain Modern",
    description:
      "Koleksi terbaru dengan desain trendy dan stylish untuk berbagai acara.",
    color: "warning",
    iconBg: "bg-gradient-to-br from-pink-50 to-pink-100",
    iconColor: "text-pink-600",
    glowColor: "group-hover:shadow-pink-500/20",
  },
];

export function ValueProps() {
  return (
    <Section
      background="muted"
      className="rounded-3xl border border-gray-100/50 shadow-sm bg-gradient-to-br from-white via-primary-50/20 to-white"
      spacing="md"
    >
      <Grid cols={1} md={2} lg={4} gap={6}>
        {valueProps.map((prop, index) => {
          const Icon = prop.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                hover
                className={`h-full flex flex-col items-center text-center p-8 group border-2 border-transparent hover:border-gray-200 transition-all duration-500 ${prop.glowColor}`}
              >
                <Stack align="center" spacing={6}>
                  <div className="relative">
                    {/* Outer glow effect */}
                    <div
                      className={`absolute inset-0 ${prop.iconBg} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                    />

                    {/* Icon container */}
                    <div
                      className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${prop.iconBg} ${prop.iconColor} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-md group-hover:shadow-xl`}
                    >
                      <Icon className="h-10 w-10" />
                    </div>
                  </div>

                  <Stack spacing={3}>
                    <h3 className="text-xl font-bold text-gray-900 font-heading group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-primary-700 group-hover:bg-clip-text transition-all duration-300">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {prop.description}
                    </p>
                  </Stack>
                </Stack>
              </Card>
            </motion.div>
          );
        })}
      </Grid>
    </Section>
  );
}
