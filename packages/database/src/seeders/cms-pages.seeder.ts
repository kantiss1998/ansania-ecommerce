import { QueryInterface } from 'sequelize';

const pages = [
    {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        content: `
      <h2>Frequently Asked Questions</h2>
      <div class="faq-item">
        <h3>How do I place an order?</h3>
        <p>To place an order, simply browse our catalog, select the items you wish to purchase, and proceed to checkout.</p>
      </div>
      <div class="faq-item">
        <h3>What payment methods do you accept?</h3>
        <p>We accept various payment methods including credit cards, bank transfers, and e-wallets.</p>
      </div>
    `,
        meta_title: 'FAQ - Ansania Ecommerce',
        meta_description: 'Frequently Asked Questions about shipping, returns, and ordering.',
    },
    {
        slug: 'contact-us',
        title: 'Contact Us',
        content: `
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Reach out to us via the following channels:</p>
      <ul>
        <li>Email: support@ansania.com</li>
        <li>Phone: +62 812 3456 7890</li>
        <li>Address: Jl. Example No. 123, Jakarta, Indonesia</li>
      </ul>
    `,
        meta_title: 'Contact Us - Ansania Ecommerce',
        meta_description: 'Get in touch with Ansania Ecommerce support team.',
    },
    {
        slug: 'terms-and-conditions',
        title: 'Terms and Conditions',
        content: `
      <h2>Terms and Conditions</h2>
      <p>Welcome to Ansania Ecommerce. By using our website, you agree to these terms.</p>
      <h3>1. General</h3>
      <p>These terms apply to all visitors and users of our platform.</p>
      <h3>2. Purchases</h3>
      <p>All purchases are subject to availability and confirmation of the order price.</p>
    `,
        meta_title: 'Terms and Conditions - Ansania Ecommerce',
        meta_description: 'Read our Terms and Conditions before using our services.',
    },
    {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `
      <h2>Privacy Policy</h2>
      <p>Your privacy is important to us. This policy explains how we collect and use your data.</p>
      <h3>1. Data Collection</h3>
      <p>We collect information you provide directly to us, such as when you create an account.</p>
      <h3>2. Data Usage</h3>
      <p>We use your data to provide and improve our services.</p>
    `,
        meta_title: 'Privacy Policy - Ansania Ecommerce',
        meta_description: 'Learn how we handle your personal data.',
    },
    {
        slug: 'shipping-info',
        title: 'Shipping Info',
        content: `
      <h2>Shipping Information</h2>
      <p>We ship worldwide. Standard shipping takes 3-5 business days.</p>
      <h3>Shipping Rates</h3>
      <p>Free shipping on orders over $50.</p>
    `,
        meta_title: 'Shipping Info - Ansania Ecommerce',
        meta_description: 'Information about our shipping rates and policies.',
    },
    {
        slug: 'returns-and-exchanges',
        title: 'Returns & Exchanges',
        content: `
      <h2>Returns & Exchanges</h2>
      <p>If you are not satisfied with your purchase, you can return it within 30 days.</p>
      <h3>Return Policy</h3>
      <p>Items must be in original condition.</p>
    `,
        meta_title: 'Returns & Exchanges - Ansania Ecommerce',
        meta_description: 'Our returns and exchanges policy.',
    },
];

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        const now = new Date();

        console.log('🌱 Seeding CMS Pages...');

        for (const page of pages) {
            const [results] = await queryInterface.sequelize.query(
                `SELECT id FROM cms_pages WHERE slug = '${page.slug}' LIMIT 1`
            );

            if (Array.isArray(results) && results.length > 0) {
                console.log(`✅ Page "${page.title}" already exists, skipping...`);
                continue;
            }

            try {
                await queryInterface.bulkInsert('cms_pages', [{
                    ...page,
                    is_published: true,
                    published_at: now,
                    created_at: now,
                    updated_at: now,
                }]);
                console.log(`✅ Created page "${page.title}"`);
            } catch (error) {
                console.error(`❌ Failed to create page "${page.title}":`, error);
            }
        }
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        const slugs = pages.map(p => p.slug);
        await queryInterface.bulkDelete('cms_pages', { slug: slugs }, {});
    }
};
