const baseConfig = require('./index.js');

module.exports = {
    ...baseConfig,
    extends: [...baseConfig.extends, 'next/core-web-vitals'],
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
    rules: {
        ...baseConfig.rules,
        '@next/next/no-html-link-for-pages': 'off',
        'react/react-in-jsx-scope': 'off',
    },
};
