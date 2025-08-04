// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            keyframes: {
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(16px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.7s ease-out forwards',
            },
        },
    },
};
