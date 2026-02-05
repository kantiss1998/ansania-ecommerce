import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const now = new Date();

        await queryInterface.bulkInsert('users', [
            {
                email: 'admin@ansania.com',
                phone: '081234567890',
                password: hashedPassword,
                full_name: 'Admin Ansania',
                odoo_user_id: 1,
                odoo_partner_id: 1,
                email_verified: true,
                email_verified_at: now,
                created_at: now,    
                updated_at: now,
            },
            {
                email: 'budi@example.com',
                phone: '081234567891',
                password: hashedPassword,
                full_name: 'Budi Santoso',
                odoo_user_id: 2,
                odoo_partner_id: 2,
                email_verified: true,
                email_verified_at: now,
                created_at: now,
                updated_at: now,
            },
            {
                email: 'siti@example.com',
                phone: '081234567892',
                password: hashedPassword,
                full_name: 'Siti Rahayu',
                odoo_user_id: 3,
                odoo_partner_id: 3,
                email_verified: true,
                email_verified_at: now,
                created_at: now,
                updated_at: now,
            },
            {
                email: 'andi@example.com',
                phone: '081234567893',
                password: hashedPassword,
                full_name: 'Andi Wijaya',
                odoo_user_id: 4,
                odoo_partner_id: 4,
                email_verified: false,
                email_verified_at: null,
                created_at: now,
                updated_at: now,
            },
            
        ]);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.bulkDelete('users', {}, {});
    },
};
