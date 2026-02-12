import { QueryInterface } from "sequelize";

const banners = [
  {
    title: "Koleksi Lebaran 2024",
    description:
      "Tampil anggun dan menawan di hari raya dengan koleksi terbaru kami.",
    image_url:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80",
    link_url: "/products?collection=lebaran",
    link_text: "Belanja Sekarang",
    display_order: 1,
    is_active: true,
  },
  {
    title: "Diskon Spesial 50%",
    description: "Dapatkan potongan harga hingga 50% untuk item pilihan.",
    image_url:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80",
    link_url: "/products?sale=true",
    link_text: "Lihat Promo",
    display_order: 2,
    is_active: true,
  },
  {
    title: "Hijab Premium Series",
    description: "Bahan voal premium yang nyaman dan mudah dibentuk.",
    image_url:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80",
    link_url: "/products?category=hijab",
    link_text: "Beli Hijab",
    display_order: 3,
    is_active: true,
  },
];

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const now = new Date();
    console.log("🌱 Seeding CMS Banners...");

    // Check if table exists (it should, but safety first or just insert directly if handled by migration)
    // Assuming table `cms_banners` exists.

    // Clean existing seeds to avoid duplicates if re-running without truncate
    // Or check existence.
    // Simple way: Bulk Delete then Insert? Or check existence.
    // Let's check count.

    // Actually, let's just use bulkInsert and ignore duplicates logic implies unique constraints,
    // but often banners don't have unique slugs.
    // We will just clear table or append?
    // Safe approach: Check if any exist, if so skip seeding to retain custom user edits.

    const [results] = await queryInterface.sequelize.query(
      `SELECT count(*) as count FROM cms_banners`,
    );

    // @ts-expect-error - results[0] might not be typed strictly
    const count = results[0]?.count || 0;

    if (count > 0) {
      console.log("✅ Banners already exist, skipping seeding...");
      return;
    }

    try {
      await queryInterface.bulkInsert(
        "cms_banners",
        banners.map((b) => ({
          ...b,
          created_at: now,
          updated_at: now,
        })),
      );
      console.log(`✅ Seeded ${banners.length} banners.`);
    } catch (error) {
      console.error("❌ Failed to seed banners:", error);
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("cms_banners", {}, {});
  },
};
