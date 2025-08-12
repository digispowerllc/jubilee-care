module.exports = {
    // ... your existing config
    rules: {
        "no-console": "off",             // Disable no-console rule
        "react/react-in-jsx-scope": "off",  // Disable react-in-jsx-scope (common in Next.js 11+)
        "@typescript-eslint/no-explicit-any": "warn", // Turn explicit any warnings to warnings instead of errors
        // add or disable more rules here
    },
};
