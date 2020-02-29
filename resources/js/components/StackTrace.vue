<template>
    <table class="table mb-0">
        <tbody>
            <tr v-for="line in lines">
                <td>
                    {{ line }}
                </td>
            </tr>

            <tr v-if="! showAll">
                <td>
                    <a href="*" v-on:click.prevent="showAll = true" class="no-underline dim text-primary font-bold">Show All</a>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import _take from "lodash/take"

    export default {
        props: ['trace'],

        /**
         * The component's data.
         */
        data() {
            return {
                minimumLines: 5,
                showAll: false,
            };
        },

        computed: {
            lines() {
                return this.showAll ? _take(this.trace, 1000) : _take(this.trace, this.minimumLines);
            }
        }
    }
</script>

<style scoped>
    .table td{
        background: transparent !important;
        height: auto;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
</style>