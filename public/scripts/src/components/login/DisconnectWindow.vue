<template>
    <div v-show="isVisible" class="disco-window window">
        <div class="row">
            <div class="col lg-12">
                <h2 :class="'title red'">{{ STRINGS.ui.disconnect.title }}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <p>{{ STRINGS.ui.disconnect.message }}</p>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <button type="button" class="btn" ref="reload">{{ STRINGS.ui.disconnect.reload }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    /** Composant d'affichage de la fenètre de déconnexion" */

	import {mapGetters} from 'vuex';

    export default {
        name: "disco-window",

        computed: Object.assign(
            mapGetters({
                isVisible: 'ui/isVisibleDisco'
            })
        ),

        mounted: function() {
        	this.$refs.reload.addEventListener('click', event => window.location.reload());
        }
    }
</script>

<style scoped>

    .disco-window {
        width: 40em;
        margin: auto;
        margin-top: 20vh;
    }


</style>