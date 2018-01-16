<!--    Simple Tabs component
        Forked from:  Spatie bvba info@spatie.be (https://github.com/spatie/vue-tabs-component)-->
<template>
    <div class="tabs-component">
        <ul role="tablist" class="tabs-component-tabs">
            <li
                    v-for="(tab, i) in tabs"
                    :key="i"
                    :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }"
                    class="tabs-component-tab"
                    role="presentation"
                    v-show="tab.isVisible"
            >
                <a v-html="tab.header"
                   :aria-controls="tab.hash"
                   :aria-selected="tab.isActive"
                   @click="selectTab(tab.hash, $event)"
                   :href="tab.hash"
                   class="tabs-component-tab-a"
                   role="tab"
                ></a>
            </li>
        </ul>
        <div class="tabs-component-panels">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabs',
        props: {
            options: {
                type: Object,
                required: false,
                default: () => ({
                    useUrlFragment: true,
                }),
            },
        },
        data: () => ({
            tabs: [],
            activeTabHash: '',
        }),
        created() {
            this.tabs = this.$children;
        },
        mounted() {
            window.addEventListener('hashchange', () => this.selectTab(window.location.hash));
            if (this.findTab(window.location.hash)) {
                this.selectTab(window.location.hash);
                return;
            }
            if (this.tabs.length) {
                this.selectTab(this.tabs[0].hash);
            }
        },
        methods: {
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },
            selectTab(selectedTabHash, event) {
                // See if we should store the hash in the url fragment.
                if (event && !this.options.useUrlFragment) {
                    event.preventDefault();
                }
                const selectedTab = this.findTab(selectedTabHash);
                if (! selectedTab) {
                    return;
                }
                if (selectedTab.isDisabled) {
                    return;
                }
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });
                this.activeTabHash = selectedTab.hash;
                this.$nextTick(() => {
                    this.$emit('changed', { tab: selectedTab });
                });
            },
            setTabVisible(hash, visible) {
                const tab = this.findTab(hash);
                if (! tab) {
                    return;
                }
                tab.isVisible = visible;
                if (tab.isActive) {
                    // If tab is active, set a different one as active.
                    tab.isActive = visible;
                    this.tabs.every((tab, index, array) => {
                        if (tab.isVisible) {
                            tab.isActive = true;
                            return false;
                        }
                        return true;
                    });
                }
            },
        },
    };
</script>

<style scoped>

    .tabs-component-tabs {
        margin: 0;
        align-items: stretch;
        display: flex;
        justify-content: flex-start;
        margin-bottom: -1px;
        color: rgb(227, 190, 88);
        font-size: 14px;
        font-weight: 600;
        list-style: none;
    }

    .tabs-component-tab:hover {
        color: rgb(255, 217, 94);
    }

    .tabs-component-tab.is-active {
        filter: drop-shadow(0 0 10px);
    }

    .tabs-component-tab.is-disabled * {
        opacity: 0.25;
        cursor: not-allowed !important;
    }

    .tabs-component-tab {
        /*background-color: #fff;*/
        margin-right: .5em;
        transform: translateY(2px);
        transition: transform .3s ease;
    }

    .tabs-component-tab.is-active {
        z-index: 2;
        transform: translateY(0);
    }

    .tabs-component-tab-a {
        align-items: center;
        color: inherit;
        display: flex;
        padding: .75em 1em;
        text-decoration: none;
    }

    .tabs-component-panels {
        padding: 0 0;
        color: rgb(227, 190, 88);
    }

    .tabs-component-panels {
        background-color: transparent;
        box-shadow: 0 0 10px rgba(0, 0, 0, .05);
        padding: 0 1em;
    }

</style>