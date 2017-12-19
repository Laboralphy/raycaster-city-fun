export const CONST = {
    ITEMS: {
        EMPLACEMENTS: [
            "tete",
            "torse",
            "jambes",
            "pieds",
            "mainDroite",
            "mainGauche"
        ],
        RARITY: {
            COMMON: {
                COLOR: 'lightskyblue'
            },
            RARE: {
                COLOR: 'chocolate'
            },
            EPIC: {
                COLOR: 'mediumpurple'
            },
            LEGENDARY: {
                COLOR: 'lime'
            }
        }
    },
    PROPS: {
        DMG: {
            color: 'lightskyblue'
        }
    },
    STATS: {
        STR: { // Force
            color: 'red'
        },
        RES: { // Résistance
            color: 'blue'
        },
        DEX: { // Dexterité
            color: 'green'
        },
        PRE: { // Précision
            color: 'orange'
        },
        ANA: { // Analyse
            color: 'purple'
        }
    }
};
const ApplicationConst = {
    install(Vue, options) {
        Vue.prototype.CONST = CONST;
    }
};

export default ApplicationConst;