kaboom({
    global: true, 
    fullscreen: true,
    scale: 1,                       /*vergrössert alles, je höher die Zahl*/
    debug: true,
    clearColor: [0, 0, 0, 1],      /*definiert Hintergrundfarbe,*/
})

const MOOVE_SPEED = 120 
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const ENEMY_SPEED = 20
let isJumping = true
const FALL_DEATH = 400

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png') /*   KPO3fR9*/
loadSprite('brick', 'rLgxPJd.png') /* pogC9x5*/
loadSprite('block', 'rLgxPJd.png') /*M6rwarW*/
loadSprite('mario', 'kPW6E9f.png')   /*Mario-Link: Wb1qfhK.png*/
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

loadSprite('fledermaus', 'FpYqXiP.png')


scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
       
        [
            '                                                    ',         /*array für die Levels*/
            '                                                    ',
            '                                                    ',
            '                                                    ',         /*Level 1*/
            '                                                    ',
            '                                                    ',
            '              $$                                      ',
            '           =====                                         ',
            '    $  =                                             ',
            '              $$                    -+              ',
            '                           ^    ^   ()        $$        ',
            '=======================================    ==========',],
        [
            '                                                    ',         
            '                                                    ',
            '                                                    ',
            '                                                    ',                 /*Level 2*/
            '                                                    ',
            '                                                    ',
            '                                                    ',
            '                           $$                         ',
            '            $                             = =       ',
            '         ======   =====                 $ = = =  $    ',
            '                                      = = = =  =  -+',
            '         ^    $    ^        ^       = = = = =  =  ()',
            '=====================     =======  =================',],
        [
            '                                     /               ',         
            '                                                     -+ ',
            '                                                     () ',
            '                                                   ==   ',             /*Level 3*/
            '                                              ===     ',
            '                                 /         =          ',
            '          /                          =====             ',
            '                                 ==         ',
            '                   $       ====                      ',
            '     ==        ========                                ',
            '         ==                                             ',
            '                                                    ',
            '               ^    $       ^    ^             $S      ',
            '======================================     ==========',],
        [
            '                                                           ',
            '                                                           ',
            '                        /                   /                ',              /*Level 4*/
            '                                                            ',
            '                            -+                                  ',
            '                  /          ()                               ',
            '                        =            =                           ',
            '                                  /          =       ^            ',
            '           ==       =                               =             ',
            '   $ $                                                           ',
            ' $     $        $     ^               ^$        ^            $        ',
            '===========   =   ====    ==    ========    ======    ========',],
        [
            
        ]             
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid(), scale(0.8)],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()], /*body = fügt gravity dazu*/
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '£': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
        '/':[sprite('fledermaus'), solid(), scale(0.15), 'tot'],
    }

    const gameLevel = addLevel(maps[level], levelCfg)       /*maps[level] ist Zugriff auf Aarrays für die Levels*/

    const scoreLabel = add([
        text(score, 16),
        pos(20, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    add([text(', level ' + parseInt(level + 1) + ' von 5', 16), pos(42, 6)])

   /* function big() {
        let timer = 0
        let isBig = false
        return {
            update(){
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                timer = 0
                isBig = false
            },
            biggify(time) {
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }*/

    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        /*big(),*/
        origin('bot'),
        /*scale(2)*/
      ])

/*mushroom move*/
action('mushroom', (m) => {
    m.move(20, 0)       /*gibt Geschwindigkeit an, in welcher Mushroom sich bewegt*/
})

action('fledermaus', (n) => {
    n.move(20, 0)       /*gibt Geschwindigkeit an, in welcher Fledermaus sich bewegt*/
})

/* wenn Mario ? berührt, wird daraus ein Coin*/
 /*   player.on('headbump', (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
    })*/

    /*player.collides('mushroom', (m) => {   
        destroy(m)
        player.biggify(6)
    })
 /*figur kollidiert mit Pilz, wächst er für 6 sek.*/

    player.collides('coin', (c) => {        /*zählt gesammelte Coins*/
        destroy(c)
        scoreLabel.value++  
        scoreLabel.text = scoreLabel.value
    })

    action('dangerous', (d) => {        /*lässt Pilzli sich bewegen*/
        d.move(-ENEMY_SPEED, 0)
    })
    
    action('tot', (a) => {              /*lässt Fledermaus fliegen*/
        a.move(-ENEMY_SPEED, 0)
    })

    player.collides('dangerous', (d) => {       /*wenn man in Pilzli rennt, stirbt man, wenn man drauf hüpft, verschwinden Pilzli*/
        if (isJumping) {
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value})
        }
    })

    player.collides('tot', (a) => {                  /*wenn man Fledermaus berührt, stirbt man*/
        destroy(player, go('lose', { score: scoreLabel.value}))
    })

    player.action(() => {
        camPos(player.pos)                  /*führt dazu, dass sich Bild mit Figur mitbewegt*/
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value})
        }
    })

    player.collides('pipe', () => {         /*neues Level hinzufügen*/
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })
    
    keyDown('left', () => {
        player.move(-MOOVE_SPEED, 0)       /*-moove_speed damit man nach links gehen kann*/
    })

    keyDown('right', () => {
        player.move(MOOVE_SPEED, 0)       
    })

    player.action(() => {
        if (player.grounded()) {
            isJumping = false
        }
    })

    keyPress('space', () => {               /*Jumping-Befehl*/
        if (player.grounded()) {            /* wenn Player grounded, kann man ihn dazu bringen, zu springen*/
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })
    
})


    










scene('lose', ({ score}) => {                                                           /*Text beim Game-Over*/
    add([text('Game over', 50), origin('center'), pos(width()/2, height()/3)]);      /*zeigt bei Game-Over den Begriff GAme over an*/
    add([text('Du hast ' + score + ' Punkte gesammelt', 30), origin('center'), pos(width()/2, height()/2)]);          /*zeigt bei Game-Over den Punktestand an*/
    add([text('Versuch es nochmal', 30), origin('center'), pos(width()/2, height()/1.5)]);
   
})


start("game", { level: 0, score:0})

