kaboom({
    global: true, 
    fullscreen: true,
    scale: 1,                       /*vergrössert alles, je höher die Zahl*/
    debug: true,                    /*zeigt alle Fehler direkt an*/
    clearColor: [0,0,0,1],      /* definiert Hintergrundfarbe. RGBA color value zB 1,1,1,1 -> weiss
                                    https://www.w3schools.com/css/css_colors_rgb.asp*/
})

//-------- Start Definition Konstanten ---------/

/* die Konstanten werden weiter unten verwendet */
const MOVE_SPEED = 120 
const JUMP_FORCE = 360
let CURRENT_JUMP_FORCE = JUMP_FORCE
const ENEMY_SPEED = 20
let isJumping = true
const FALL_DEATH = 400

/* kann ziemlich sicher weg, da keine Verwendung
const BIG_JUMP_FORCE = 550  */

//-------- Ende Definition Konstanten ---------/


//-------- laden der Bilder bzw. Sprites  ---------/
loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png') /*   KPO3fR9*/
loadSprite('block', 'LhCBppg.png') /*M6rwarW*/
loadSprite('brick', 'rLgxPJd.png')   /* ----- vertikale Säule old: pogC9x5*/

/* Laden des TileSheets von Rotkäppchen mit verschiedenen Positionen*/
loadSprite('tiles','vSTvkix.png',{   
    /* Das Tile Sheet hat Horizontal (x) 3 Spalten und Vertikal (y) 4 Zeilen */
    sliceX: 3,   
    sliceY: 4,
    anims: {
        normalwalk: {from: 3, to: 3 },  /* Gehen nach Rechts habe ich Sprite an Position 3/3 gewählt*/
        idle: {from: 7, to: 7 },    /* idle=stehen bleiben: Position 7/7 gewählt*/
        runleft: {from: 10, to: 10 } /* Gehen nach links habe ich Sprite an Position 10/10 gewählt*/
    }
})
loadSprite('mushroom', '0wMd92p.png')
loadSprite('bubble', 'mHi5rD4.png') /*https://imgur.com/mHi5rD4  gesQ1KP*/
loadSprite('fledermaus', 'FpYqXiP.png')

loadSprite('door', '7BzohG3.png')





//------------ löschen?? ----//
/*
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadSprite('unboxed', 'bdrLpi6.png')

loadSprite('mario', 'kPW6E9f.png')   ----- Mario-Link: Wb1qfhK.png
loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')
*/
//------------ löschen?? ----//



//---------------------------------- Start Scene Game ----------------------------------//

scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj') 
    /* Defintion von 3 Layers. "ui" wird die oberste Oberfläche sein. Default Lauyer ist "obj" - object
    verwendet wurde bisher nur der "ui" layer für Anzeige Punktezahl. 
    ggf. wird auf "bg" noch ein Background gelegt */

    const maps = [
       
        //----------------------- Start Lvl 1 -----------------------//

        [
            '                                                        ',         
            '                                                        ',
            '                                                        ',
            '                                                        ',       
            '                                                        ',
            '                                                        ',
            '              $$                                        ',
            '           =====                                        ',
            '    $  =                                                ',
            '              $$                                        ',
            '            ^                     ^    +        $$      ',
            '===========================   ============    ==========',],

        //----------------------- Ende Lvl 1 -----------------------//
        //----------------------- Start Lvl 2 -----------------------//

        [
            '                                                    ',         
            '                                                    ',
            '                                                    ',
            '                                                    ',                 
            '                                                    ',
            '                                                    ',
            '                                                    ',
            '                           $$                       ',
            '            $                             i i       ',
            '         ======   =====                 $ i i i  $  ',
            '                                      i i i i  i    ',
            '         ^    $    ^        ^       i i i i i  i  + ',
            '=====================     =======  =================',],

        //----------------------- Ende Lvl 2 -----------------------//
        //----------------------- Start Lvl 3 -----------------------//

        [
            '                                     /                 ',         
            '                                                       ',
            '                                                     + ',
            '                                                   === ',             
            '                                              ===      ',
            '                                 /         =           ',
            '          /                          =====             ',
            '                                 ==                    ',
            '                   $       ====                        ',
            '     ==        ========                                ',
            '         ==                                            ',
            '                                                       ',
            '               ^    $       ^    ^             $S      ',
            '======================================     =========== ',],

        //----------------------- Ende Lvl 3 -----------------------//
        //----------------------- Start Lvl 4 -----------------------//
        
        [
            '                                                              ',
            '                                                              ',
            '                        /                   /                 ',              
            '                                                              ',
            '                                                              ',
            '                  /           +                               ',
            '                        =    ==      =                        ',
            '                                  /          =       ^        ',
            '           ==       =                               =         ',
            '   $ $                                                        ',
            ' $     $        $     ^               ^$        ^            $',
            '===========   =   ====    ==    ========    ======    ========',],

        //----------------------- Ende Lvl 4 -----------------------//
        //----------------------- Start Lvl 5 -----------------------//

        [
            '                                                                 ',    
            '                                           $                  $ =',        
            '                                         =====             ======',
            '                                    ==               ==         =',
            '                                  /                     /       =',
            '                       $                                        =',
            '                  =   ====    ===                        ==     =',
            '==                                            ==                =',
            '             ==              =                               ====',
            ' $                        $                                     =',
            '          ^      ^      ===         %$       $             $    =',
            '===================              =======   ======    ============',],

        //----------------------- Ende Lvl 5 -----------------------//
            
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        /* jedes Pixel hat jene Dimensionen */

        //--------- Start Definition der Platzhalter in den Levels ---------//

        '=': [sprite('block'), solid(), scale(0.8)],
        '$': [sprite('coin'), 'coin'],
        'i': [sprite('brick'), solid(), scale(0.8)],

        '+': [sprite('door'),scale(0.05),origin('center'), 'door'],

        '^': [sprite('evil-shroom'), solid(), 'bad', body()],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()], /*body = fügt gravity dazu*/
        '/':[sprite('fledermaus'), solid(), scale(0.15), 'tot'],
        '%': [sprite('bubble'), solid(), 'blub'],


        /*
    
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],

        '}': [sprite('unboxed'), solid()],
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '£': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
        */
        
        //--------- Ende Definition der Platzhalter in den Levels ---------//


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

    add([text('Punkte, level ' + parseInt(level + 1) + ' von 5', 16), pos(42, 6)])

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
        sprite('tiles'), solid(),
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
    })    /*figur kollidiert mit Pilz, wächst er für 6 sek.*/

    player.collides('coin', (c) => {        /*zählt und zerstört gesammelte Coins*/
        destroy(c)
        scoreLabel.value++  
        scoreLabel.text = scoreLabel.value
    })

    action('bad', (d) => {        /* Pilze: -enemy_speed (x-Achse) damit sie sich nach links bewegen. / y-Achse = 0) */
        d.move(-ENEMY_SPEED, 0)
    })
    
    action('tot', (a) => {              /* Fledermaus: -enemy_speed (x-Achse) damit sie sich nach links bewegen. / y-Achse = 0) */
        a.move(-ENEMY_SPEED, 0)
    })

    /*
    action('dangerous', (s) => {            
        s.move(-ENEMY_SPEED, 0)
    })
    */


    //----------- Start Kollisionen -----------// 

    player.collides('bad', (d) => {       /*wenn man in Pilzli rennt, stirbt man, wenn man drauf hüpft, verschwinden Pilzli*/
        if (isJumping) {
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value})
        }
    })

    player.collides('tot', (a) => {                  /*wenn man Fledermaus berührt, stirbt man*/
        destroy(player, go('lose', { score: scoreLabel.value}))
    })

    player.collides('blub', (b) => {                /*wenn man den blauen "Blubb" berührt, stirbt man*/
        destroy(player, go('lose', { score: scoreLabel.value}))
    })

    player.collides('door', () => {         /*neues Level, wenn bei Tür Keydown macht*/
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    //----------- Ende Kollisionen -----------// 


    //----------- Start Bild bewegt sich mit Figur -----------// 

    player.action(() => {
        camPos(player.pos)              
        if (player.pos.y >= FALL_DEATH) {             /* wenn Player stirbt, zeigt es den "Game Over"=lose Bildschirm an */
            go('lose', { score: scoreLabel.value})
        }
    })
    
    //----------- Ende Bild bewegt sich mit Figur -----------// 

    
    //------------------ Start Player Bewegungen  ----------------------------------//

    player.play('idle')  /* Idle als Default Position am Anfang */

    /* Wenn der Player nach links läuft, soll Sprite anims 'runleft' genommen werden */
    keyDown('left', () => {
        player.play('runleft')
        player.move(-MOVE_SPEED, 0)    /* -move_speed (x-Achse) damit man nach links gehen kann. / y-Achse = 0) */
    })
    
    /* Dasselbe einfach für rechts definieren - 'normalwalk' */
    keyDown('right', () => {
        player.play('normalwalk')
        player.move(MOVE_SPEED, 0)       
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
    
    /* lässt man die links- oder rechts-Tasten los, soll die Spielfigur in die Idle-Position */ 
    keyRelease('left', () => {
        player.play('idle')
    })

    keyRelease('right', () => {
        player.play('idle')
    })
    //------------------ Ende Player Bewegungen  ----------------------------------//

})
//---------------------------------- Ende Scene Game ----------------------------------//


//--------------------------- Start Game Over Definitionen ---------------------------//

scene('lose', ({ score}) => {                                                           /*Text beim Game-Over*/
    add([text('Game over', 50), origin('center'), pos(width()/2, height()/3)]);      /*zeigt bei Game-Over den Begriff Game over an*/
    add([text('Du hast ' + score + ' Punkte gesammelt', 30), origin('center'), pos(width()/2, height()/2)]);          /*zeigt bei Game-Over den Punktestand an*/
    add([text('Versuch es nochmal', 30), origin('center'), pos(width()/2, height()/1.5)]);
   
})
//--------------------------- Ende Game Over Definitionen ---------------------------//


start("game", { level: 0, score:0})

