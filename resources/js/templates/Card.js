export default {
    methods: {
        /**
         * Classes for table cells.
         */
        cellClass(more = null) {
            return `p-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800 ${more}`;
        },
    },
}
