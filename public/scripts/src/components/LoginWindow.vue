<template>
    <div v-show="visible" class="login-window window">
        <div class="row">
            <div class="col lg-12">
                <h2 class="title blue">{{ STRINGS.ui.login.title }}</h2>
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
                <div class="col lg-offset-8 lg-4">
                    <button ref="connect" type="button" class="connect">{{ STRINGS.ui.login.connect }}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import * as types from '../store/clients/mutation-types';

    export default {
        name: "login-window",
        data: function() {
            return {
                visible: false,
                inputLogin: '',
                inputPass: ''
            };
        },
        mounted: function() {
            this.$refs.connect.addEventListener('click', (function(event) {
                this.$store.dispatch('clients/' + types.CLIENT_LOGIN, {
                    login: this.inputLogin,
                    pass: this.inputPass
                }).then(() => this.$emit('login'));
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

</style>