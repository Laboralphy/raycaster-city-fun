<template>
    <div v-show="isVisible" class="login-window window">
        <div class="row">
            <div class="col lg-12">
                <h2 :class="'title ' + (error ? 'red' : 'blue')">{{ STRINGS.ui.login.title }}</h2>
            </div>
        </div>
        <form>
            <div class="row">
                <div class="col lg-12">
                    <label>{{ STRINGS.ui.login.login }}<input v-model="inputLogin" type="text"/></label>
                </div>
            </div>
            <div class="row">
                <div class="col lg-12">
                    <label>{{ STRINGS.ui.login.pass }}<input v-model="inputPass" type="text"/></label>
                </div>
            </div>
            <div class="row">
                <div class="col lg-8 error">
                    {{ error ? STRINGS.ui.login.error : '' }}
                </div>
                <div class="col lg-4">
                    <button ref="connect" type="button" class="connect">{{ STRINGS.ui.login.connect }}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "login-window",
        data: function() {
            return {
            	error: false,
                inputLogin: '',
                inputPass: ''
            };
        },

        computed: Object.assign(
            mapGetters({
                isVisible: 'ui/isVisibleLogin'
            })
        ),

        methods: {
            raiseError: function() {
            	this.error = true;
            }
        },

        mounted: function() {
			this.inputLogin = 'test';
            this.$refs.connect.addEventListener('click', (function(event) {
            	this.error = false;
            	this.$store.dispatch('clients/submit', {login: this.inputLogin, pass: this.inputPass});
            }).bind(this));
        }
    }
</script>

<style scoped>

    .login-window {
        width: 40em;
        margin: auto;
        margin-top: 20vh;
    }

    .connect {
        width: 100%;
    }

    .error {
        color: #800;
        font-weight: bold;
    }

</style>