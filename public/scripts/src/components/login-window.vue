<template>
    <div v-show="visible" class="login-window window">
        <div class="row">
            <div class="col lg-12">
                <h2 class="title blue">{{ STRINGS.title }}</h2>
            </div>
        </div>
        <form>
            <div class="row">
                <div class="col lg-12">
                    <label>{{ STRINGS.login }}<input v-model="inputLogin" type="text"/></label>
                </div>
            </div>
            <div class="row">
                <div class="col lg-12">
                    <label>{{ STRINGS.pass }}<input v-model="inputPass" type="text"/></label>
                </div>
            </div>
            <div class="row">
                <div class="col lg-offset-8 lg-4">
                    <button ref="connect" type="button" class="connect">{{ STRINGS.connect }}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import STRINGS from '../data/strings';
    import * as types from '../store/clients/mutation-types';

    export default {
        name: "login-window",
        data: function() {
            return {
                STRINGS: STRINGS.ui.login,
                visible: false,
                inputLogin: '',
                inputPass: ''
            };
        },
        mounted: function() {
            this.$refs.connect.addEventListener('click', (function(event) {
                this.$store.dispatch(types.CLIENT_LOGIN, {
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