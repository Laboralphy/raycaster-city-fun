<template>
    <div>
        <h1>{{ name }}</h1>
        <h2>{{ classe }} [{{ level }}]</h2>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';

    const { mapState } = createNamespacedHelpers('player');

    export default {
        name: "game-menu-personnage-infos-personnage",
        computed: mapState([
            'name',
            'classe',
            'level'
        ])
    }
</script>

<style scoped>
</style>