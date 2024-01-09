export default {
    methods: {
        /**
         * Classes for table cells.
         */
        cellClass(more = null) {
            return `p-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800 ${more}`;
        },

        /**
         * Manual dark mode.
         */
        darkModeClass() {
            let activeDarkMode = localStorage.novaTheme === 'dark';

            let prefersDarkMode = (! ('novaTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

            return (activeDarkMode ||  prefersDarkMode) ? 'dark' : '';
        },
    },
}
