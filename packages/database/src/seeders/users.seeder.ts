import bcrypt from "bcryptjs";
import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const [results] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'it@kantiss.com' LIMIT 1",
    );

    if (Array.isArray(results) && results.length > 0) {
      console.log("✅ IT user already exists, skipping...");
      return;
    }

    console.log("🌱 Seeding IT user...");
    const hashedPassword = await bcrypt.hash("123", 10);
    const now = new Date();

    try {
      await queryInterface.bulkInsert("users", [
        {
          email: "it@kantiss.com",
          password: hashedPassword,
          full_name: "IT Kantiss",
          role: "admin",
          phone: "081234567899",
          email_verified: true,
          email_verified_at: now,
          created_at: now,
          updated_at: now,
          odoo_user_id: null,
          odoo_partner_id: null,
        },
      ]);
    } catch (error) {
      console.error("❌ SEEDER ERROR DETAILS:", JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("users", { email: "it@kantiss.com" }, {});
  },
};
