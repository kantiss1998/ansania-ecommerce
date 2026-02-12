"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, HeadphonesIcon, Award } from "lucide-react";

import { Card } from "@/components/atoms/Card";
import { Grid } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Kualitas Terjamin",
    description: "Produk pilihan dengan standar kualitas terbaik.",
    color: "primary",
    iconBg: "bg-primary-50",
    iconColor: "text-primary",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Layanan pengiriman tepat waktu ke seluruh Indonesia.",
    color: "info",
    iconBg: "bg-info-light",
    iconColor: "text-info",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Layanan pelanggan siap membantu Anda kapan saja.",
    color: "secondary",
    iconBg: "bg-secondary-light",
    iconColor: "text-primary",
  },
  {
    icon: Award,
    title: "Garansi Resmi",
    description: "Produk bergaransi resmi untuk ketenangan pikiran Anda.",
    color: "warning",
    iconBg: "bg-warning-light",
    iconColor: "text-warning",
  },
];

export function ValueProps() {
  return (
    <Section
      background="muted"
      className="rounded-3xl border border-gray-100 shadow-sm"
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
                className="h-full flex flex-col items-center text-center p-8 group"
              >
                <Stack align="center" spacing={6}>
                  <div
                    className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${prop.iconBg} ${prop.iconColor} transition-all duration-base group-hover:rotate-6 group-hover:scale-110 shadow-sm group-hover:shadow-lg`}
                  >
                    <Icon className="h-10 w-10" />
                  </div>

                  <Stack spacing={2}>
                    <h3 className="text-xl font-bold text-gray-900 font-heading">
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
