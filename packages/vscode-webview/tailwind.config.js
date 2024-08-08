/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            fontFamily: {
                pcb: "'Inconsolata Variable', monospace",
            },
            backgroundColor: {
                "pcb-green": "rgb(11, 111, 59)",
                "pcb-copper": "#FF9D07",
            },
            backgroundImage: {
                "pcb-overlay": "url('https://sprig.hackclub.com/pcb.svg')",
            },
        },
    },
    plugins: [],
};
