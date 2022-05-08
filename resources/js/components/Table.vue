<template>
    <div class="flex-1 overflow-hidden overflow-x-auto relative">
        <table cellpadding="0" cellspacing="0" class="w-full table-default">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th v-for="th in header" class="text-left p-2 whitespace-nowrap uppercase text-gray-500 text-xxs" v-html="th.label" :class="th.class"></th>
                </tr>
            </thead>
            <tbody>
                <slot></slot>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: ['header'],
    }
</script>
