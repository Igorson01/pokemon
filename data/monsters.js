const monsters = {
   Emby: {
        position: {
            x: 280,
            y: 325
        },
        image: {
            src:'./img/embySprite.png'
        },
            frames: {
                max:4,
                hold: 25
            },
        animate: true,
        name: 'Emby',
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Windslash]
    },

    Draggle: {
        position: {
            x: 780,
            y: 30
        },
        image: {
            src: './img/charmanderSprite.png'
        },
            frames: {
                max:8,
                hold: 10
            },
        animate: true,
        isEnemy: true,
        name: 'Charmander',
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Fireblaze]
    }
}

