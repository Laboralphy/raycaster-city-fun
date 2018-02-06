<template>
    <bordered-card color="rgb(255, 0, 0)" class="game-menu-tab">
        <div class="row">
            <div>
                <infos-personnage></infos-personnage>
            </div>
        </div>
        <div class="row">
            <div>
                <stats-araignee></stats-araignee>
            </div>
        </div>
    </bordered-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import {BorderedCard} from '../../ui/index';
    import StatsAraignee from './StatsAraignee.vue';
    import InfosPersonnage from './InfosPersonnage.vue';

    const { mapState } = createNamespacedHelpers('player');

    export default {
        name: "game-menu-personnage",
        components: {
            BorderedCard,
            StatsAraignee,
            InfosPersonnage
        },
        computed: mapState([
            'stats'
        ])
    }
</script>

<style scoped>

</style>