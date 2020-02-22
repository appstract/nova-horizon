export default {
    methods: {
        /**
         * Extract the job base name.
         */
        prettyJobName(name) {
            if (! name.includes('\\')) {
                return name;
            }

            var parts = name.split('\\');

            return parts[parts.length - 1];
        },
    }
}