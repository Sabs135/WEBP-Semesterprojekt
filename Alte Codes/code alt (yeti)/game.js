kaboom({
    global: true,
    fullscreen: true,
    scale: 1, /* Ansicht grösser oder kleiner. Kann auch 1.5, 2 oder so sein */
    debug: true, /* damit man si    eht wenn es einen Fehler gibt*/
    clearColor: [0,0,0,1],
});  


const MOVE_SPEED = 120
const JUMP_FORCE = 360
/* const ENEMY_SPEED = 20 */
let isJumping = true
const FALL_DEATH = 400



loadRoot('https://i.imgur.com/')
loadSprite('boden','pogC9x5.png')
loadSprite('yeti','OqVwAm6.png')
loadSprite('muenze','wbKxhcd.png')
loadSprite('hinderniss','uaUm9sN.png')

scene("game", () => {
    layers(['bg', 'obj', 'ui'],'obj')
    
   const maps = [
        '              %                                   %  ',
        '     %                    %                 =        ',
        '                                                     ',
        '                   %                    =            ',
        '                                                     ',
        '                                    =                ',
        '             =   =                                   ',
        '                           x     x                   ',
        '=====================================================',
    ]   

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('boden'), solid()],
        '%': [sprite('muenze'), solid(), 'sammeln'],
        'x': [sprite('hinderniss'), solid(), 'danger'],
    }
    const gameLevel = addLevel(maps, levelCfg)

    const player = add([
        sprite('yeti'), solid(),
        pos(30,0),
        body(),
        origin('bot'),
        scale(0.5),
    ])


    
    /*TODO mit Score....*/
    player.collides('sammeln', (s) => {  /*hier einfach in Klammern auf was es sich bezieht*/
          destroy(s)
          /*scoreLabel.value++
          scoreLabel.text = scoreLabel.value*/
      })  

    /* action('danger', (d) => {
        d.move(-ENEMY_SPEED, 0)
      })  */

    player.collides('danger', (d) => {
        if (isJumping) {
          destroy(d)
        } else {
          go('lose')
        }
      })
    
    player.action(() => {
        camPos(player.pos)                  /*führt dazu, dass sich Bild mit Figur mitbewegt*/
        if (player.pos.y >= FALL_DEATH) {
            go('lose')
        }
    })
    

    keyPress("space", () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(JUMP_FORCE);
        }
    });

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })
    
});

scene('lose', () => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
  })

start("game");