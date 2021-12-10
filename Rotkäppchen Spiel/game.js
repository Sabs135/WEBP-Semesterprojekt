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


//-------- Ende Definition Konstanten ---------/

//-------- laden der Bilder bzw. Sprites  ---------/
loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('ant', 'vbXlL4I.png')
loadSprite('block', 'LhCBppg.png')   /* Boden */
loadSprite('brick', 'rLgxPJd.png')   /* vertikale Säule Lvl 2 */

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
loadSprite('bubble', 'mHi5rD4.png')
loadSprite('fledermaus', 'AY7h3ZQ.png')

loadSprite('door', '7BzohG3.png')


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

        '^': [sprite('ant'), solid(), 'bad', body()], /*body = fügt gravity dazu*/
        '/':[sprite('fledermaus'), solid(), scale(0.6), 'tot'],
        '%': [sprite('bubble'), solid(), 'blub'],
        
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

    const player = add([
        sprite('tiles'), solid(),
        pos(30, 0),
        body(),
        origin('bot'),
      ])
    
    player.collides('coin', (c) => {        /*zählt und zerstört gesammelte Coins*/
        destroy(c)
        scoreLabel.value++  
        scoreLabel.text = scoreLabel.value
    })

    action('fledermaus', (n) => {   /* kann vermutlich entfernt werden weil doppelt mit 'tot' unten */
    n.move(20, 0)   
})

    action('bad', (d) => {        /* Pilze: -enemy_speed (x-Achse) damit sie sich nach links bewegen. / y-Achse = 0) */
        d.move(-ENEMY_SPEED, 0)
    })
    
    action('tot', (a) => {              /* Fledermaus: -enemy_speed (x-Achse) damit sie sich nach links bewegen. / y-Achse = 0) */
        a.move(-ENEMY_SPEED, 0)
    })

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

    player.collides('blub', (b) => {                /*Level 5:wenn man den blauen "Blubb" berührt, stirbt man*/
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

