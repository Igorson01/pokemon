const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')



canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i,70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i,70 + i))
}
const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70) {
    charactersMap.push(charactersMapData.slice(i,70 + i))
}

const boundaries = []
const offset = {
    x: -550,
    y: -820
}
collisionsMap.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        if(symbol === 1025)
        boundaries.push(
          new Boundary({position: {
            x:j * Boundary.width + offset.x,
            y:i * Boundary.height + offset.y
        }
     })
    )
  })
})

const battleZones = []

battleZonesMap.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        if(symbol === 1025)
        battleZones.push(
          new Boundary({position: {
            x:j * Boundary.width + offset.x,
            y:i * Boundary.height + offset.y
        }
     })
    )
  })
})
const characters = []
const villagerImg = new Image()
const oldmanImg = new Image()
oldmanImg.src = './img/oldman/Idle.png'
villagerImg.src = './img/villager/Idle.png'
charactersMap.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        if(symbol === 1026) { 
        boundaries.push(
            new Boundary({position: {
              x:j * Boundary.width + offset.x,
              y:i * Boundary.height + offset.y
          }
       })
      )
        characters.push(
          new Sprite({position: {
            x:j * Boundary.width + offset.x,
            y:i * Boundary.height + offset.y
        },
        image: villagerImg,
        frames: {
            max: 4,
            hold:60
        },
        scale:3.5,
        animate: true
     })
    )
    } else if (symbol === 1028) { 
        boundaries.push(
            new Boundary({position: {
              x:j * Boundary.width + offset.x,
              y:i * Boundary.height + offset.y
          }
       })
      )
        characters.push(
          new Sprite({position: {
            x:j * Boundary.width + offset.x,
            y:i * Boundary.height + offset.y
        },
        image: villagerImg,
        frames: {
            max: 4,
            hold:60
        },
        scale:3.5,
        animate: false
     })
    )
    } else if (symbol === 1030) { 
        boundaries.push(
            new Boundary({position: {
              x:j * Boundary.width + offset.x,
              y:i * Boundary.height + offset.y
          }
       })
      )
        characters.push(
          new Sprite({position: {
            x:j * Boundary.width + offset.x,
            y:i * Boundary.height + offset.y
        },
        image: oldmanImg,
        frames: {
            max: 4,
            hold:100
        },
        scale:3.5,
        animate: true
     })
    )
    }
  })
})



const image = new Image()
image.src = './img/Pellet Town.png.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown1.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp1.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft1.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight1.png'

const player = new Sprite({
    position:{
        x: canvas.width / 2 -192 /4 /2,
        y: canvas.height / 2 -68 /2
        },
        image: playerDownImage,
        frames: {
            max:4,
            hold:10
        },
        sprites: {
            up: playerUpImage,
            left: playerLeftImage,
            right: playerRightImage,
            down: playerDownImage
        }
})


const background = new Sprite({
position:{
    x: offset.x,
    y: offset.y
    },
    image: image
})

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    s:{
        pressed: false
    }
}


const movables = [background, ...boundaries, ...battleZones, ...characters,]
const rendeables =[background, ...boundaries, ...battleZones,...characters, player]


const battle = {
    initiated: false
}
function animete() {
    const animationId = window.requestAnimationFrame(animete)
    
    rendeables.forEach((rendeable) => {
    rendeable.draw()
    })

    const speed = 3

    const speedXY = Math.sqrt(speed*speed/2)
    
   let moving = true
   player.animate = false

   if(battle.initiated) return
   //activate  a battle 
   if(keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
    for (let i = 0; i <battleZones.length; i++) {
        const battleZone = battleZones[i]
        const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
                    
            })&&
            overlappingArea > (player.width * player.height) / 2 &&
            Math.random() < 0.01
         ) {
            //deactivate current animation loop
            window.cancelAnimationFrame(animationId)
            gsap.to('#overlappingDiv', {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete() {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                            //activate a new animation loop
                            initBattle()
                            animateBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4     
                            })
                        }
                    })
                }
            })
            audio.Map.stop()
            audio.ojoj.play()
            audio.czempions.play()
            battle.initiated = true
            break
         }
        } 
   }


    if(keys.s.pressed && !keys.a.pressed && !keys.d.pressed){
        player.animate = true
        player.image = player.sprites.down
        checkForCharacterCollision({characters, player, characterOffset: {x:0 , y: -speed}})

        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - speed
                        }
                    }
                })
                
             ) {
                moving = false
                break
             }
            } if(moving)
        movables.forEach((movable) => {
            movable.position.y -=speed
        }) 
        
    }else if(keys.w.pressed && !keys.d.pressed && !keys.a.pressed) {
        player.animate = true
        player.image = player.sprites.up
        checkForCharacterCollision({characters, player, characterOffset: {x:0 , y: speed}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + speed
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.y +=speed
        })
    }else if(keys.a.pressed && !keys.w.pressed && !keys.s.pressed) {
        player.animate = true
        player.image = player.sprites.left
        checkForCharacterCollision({characters, player, characterOffset: {x:speed , y: 0}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x +speed,
                            y: boundary.position.y
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.x +=speed})
    }else if(keys.d.pressed && !keys.w.pressed && !keys.s.pressed) {
        player.animate = true
        player.image = player.sprites.right
        checkForCharacterCollision({characters, player, characterOffset: {x:-speed , y:0}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x -speed,
                            y: boundary.position.y
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.x -=speed})
    }
    else if(keys.w.pressed && keys.d.pressed ) {
        player.animate = true
        player.image = player.sprites.up
        checkForCharacterCollision({characters, player, characterOffset: {x:-speedXY , y: speedXY}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x -speedXY,
                            y: boundary.position.y +speedXY
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.x -= speedXY
            movable.position.y += speedXY
        })
    }
    else if(keys.w.pressed && keys.a.pressed ) {
        player.animate = true
        player.image = player.sprites.up
        checkForCharacterCollision({characters, player, characterOffset: {x:speedXY , y: speedXY}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x +speedXY,
                            y: boundary.position.y +speedXY
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.x += speedXY
            movable.position.y += speedXY
        })
    }
    else if(keys.s.pressed && keys.a.pressed ) {
        player.animate = true
        player.image = player.sprites.down
        checkForCharacterCollision({characters, player, characterOffset: {x:speedXY , y: -speedXY}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x +speedXY,
                            y: boundary.position.y -speedXY
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.x += speedXY
            movable.position.y -= speedXY
        })
    }
    else if(keys.s.pressed && keys.d.pressed ) {
        player.animate = true
        player.image = player.sprites.down
        checkForCharacterCollision({characters, player, characterOffset: {x:-speedXY , y: speedXY}})
        for (let i = 0; i <boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x -speedXY,
                            y: boundary.position.y +speedXY
                        }
                    }
                })
             ) {
                moving = false
                break
            }
        } if(moving)
        movables.forEach((movable) => {
            movable.position.x -= speedXY
            movable.position.y -= speedXY
        })
    }

  }


let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':           
            keys.w.pressed = true
                         
        break        
        case 'a':            
            keys.a.pressed = true 
            
        break        
        case 'd':           
            keys.d.pressed = true
            
        break                
        case 's':        
             keys.s.pressed = true
             
         break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false 
        break        
        case 'a':
            keys.a.pressed = false 
        break        
        case 'd':
            keys.d.pressed = false 
        break 
        case 's':
             keys.s.pressed = false 
         break
    }
})

let clicked = false
addEventListener('click', () => {
    if(!clicked) {
        audio.Map.play()
        audio.jedziemy.play()
        clicked = true
    }
})
