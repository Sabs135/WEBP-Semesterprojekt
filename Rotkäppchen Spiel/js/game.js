/* Anmerkungen zu den Quellen: Alle Quellen zum Game sind zuunterst zu finden */


//-------- Start LocalStorage ---------/

/* für die Anzeige in der Konsole */
var retrievedObject = localStorage.getItem('userDetails');
    console.log('retrievedObject: ', JSON.parse(retrievedObject));

window.onload = function() {
        document.getElementById('post_name').innerText = "Viel Erfolg beim Spielen " + JSON.parse(localStorage.getItem('name')) + "!"; 
    };
    /* 
    Notizen:
    'post_name' 
    ---> 1. kommt vom login.html, Benutzername welcher sich eingelogt hat
    ---> 2. wird in spiel.html dort angezeigt wo id='post_name' ist
    JSON.parse damit das Objekt nicht in "" erscheint /*
    */

//-------- Ende LocalStorage ---------/

//-------- Start grundsätzliche Einstellungen zum Spiel ---------//

kaboom({
    global: true, 
    //fullscreen: true,//           /* in Ursprungscode (WEBP) war auf fullscreen */
    width: 1300,                    /* Grösse so angepasst, damit es gut in Browserfenster passt */
    scale: 1,                       /*vergrössert alles, je höher die Zahl*/
    debug: true,                    /*zeigt alle Fehler direkt an*/
    clearColor: [0,0,0,1],      /* definiert Hintergrundfarbe. RGBA color value */
})

//-------- Ende grundsätzliche Einstellungen zum Spiel ---------//

//-------- Start Definition Konstanten ---------//

/* die Konstanten werden weiter unten verwendet */
const MOVE_SPEED = 120 
const JUMP_FORCE = 360
let CURRENT_JUMP_FORCE = JUMP_FORCE
const ENEMY_SPEED_1 = 20
const ENEMY_SPEED_2 = 40
let isJumping = true
const FALL_DEATH = 400


//-------- Ende Definition Konstanten ---------/

//-------- Start laden der Bilder bzw. Sprites  ---------/
loadRoot('https://i.imgur.com/')

loadSprite('coin', 'wbKxhcd.png')
loadSprite('diamond', 'uy91fDA.png')

loadSprite('ant1', 'vbXlL4I.png') /* Sprites aller Gegner */
loadSprite('ant2', 'vbXlL4I.png') /* 2x Ant, damit sie korrekt runterfallen */
loadSprite('bear', 'O5xgG52.png')
loadSprite('bat', 'AY7h3ZQ.png')

loadSprite('block', 'LhCBppg.png')   /* Boden */
loadSprite('brick', 'rLgxPJd.png')   /* vertikale Säulen */
loadSprite('door', '7BzohG3.png')
loadSprite('cup', 'YMha7Un.png')

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

//-------- Ende laden der Bilder bzw. Sprites  ---------/

//---------------------------------- Start Scene Game ----------------------------------//

scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj') 
    /* Defintion von 3 Layers. "ui" wird die oberste Oberfläche sein. Default Lauyer ist "obj" - object
    Auf dem "ui" layer erscheint die Anzeige der Punktezahl. 
    Auf "bg" könnte ein Background-Bild gelegt werden. Wurde hier verzichtet */

    const maps = [
       
        //----------------------- Start Lvl 1 -----------------------//

        [
            '                                                        ',         
            '                                                        ',
            '                                                        ',
            '                                                        ',       
            '              $                                         ',
            '                                                        ',
            '                                                        ',
            '           =====                                        ',
            '    $  =                                                ',
            '              $$                         ==   i  o      ',
            '            ^                     *  +        i         ',
            '===========================   ===========     ==========',],

        //----------------------- Ende Lvl 1 -----------------------//
        //----------------------- Start Lvl 2 ----------------------//

        [
            '                                                    ',         
            '                                                    ',
            '                                                    ',
            '                                                    ',                 
            '                                                    ',
            '                                           o        ',
            '                                                    ',
            '                           $$                       ',
            '            $    ==                       i i       ',
            '         ======     ===                 $ i i i  $  ',
            '                                      i i i i  i    ',
            '         ^    $    *        v       i i i i i  i  + ',
            '=====================     =======  =================',],

        //----------------------- Ende Lvl 2 -----------------------//
        //----------------------- Start Lvl 3 ----------------------//

        [
            '                                 o   /                 ',         
            '                                                       ',
            '                                                     + ',
            '                                 =                 === ',             
            '                                              ===      ',
            '                                 /         =           ',
            '          /                          =====             ',
            '                                ===                    ',
            '                   $       ====                        ',
            '     ==        ========                                ',
            '         ==                                     o      ',
            '                                                       ',
            '               ^    $             *            $S     v',
            '======================================     =========== ',], 

        //----------------------- Ende Lvl 3 -----------------------//
        //----------------------- Start Lvl 4 ----------------------//
        
        [
            '                                                              ',
            '                                                              ',
            '                        /                   /                 ',              
            '                                                              ',
            '                                                              ',
            '                  /           +              o                ',
            '                        =    ==    =                          ',
            '       $                          /     =    =                ',
            '   $       ==       =                             =           ',
            '     $                                                    o $ ',
            '           ^                        $  *                      ',
            '============  =   ====    ==    ========    ======    ========',],

        //----------------------- Ende Lvl 4 -----------------------//
        //----------------------- Start Lvl 5 ----------------------//

        [
            '                               $                            $   ',    
            '                                                   /            =',        
            '                                         =====             ======',
            '             o                      ==           =   ==         =',
            '                       /                                        =',
            '                                *             o                 =',
            '                  =   ====    ===                        ==     =',
            '==                                            ==     i          =',
            '             ==           $  =                       i       ====',
            ' $                                   $               i       o  =',
            '          ^         =   ===         %         X      i     $    =',
            '===================              =======   ======    ============',],

        //----------------------- Ende Lvl 5 -----------------------//
            
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        /* jedes Pixel hat jene Dimensionen */

        //--------- Start Definition der Platzhalter in den Levels ---------//

        '=': [sprite('block'), solid(), scale(0.8)],  /* 'solid' weil "festes Element", nicht wie bei coins*/
        'i': [sprite('brick'), solid(), scale(0.8)],  /* scale : div. Sprites benötigten Grössenanpassung*/

        '$': [sprite('coin'), 'coin'],
        'o': [sprite('diamond'), 'diamond', scale(0.8)],

        '+': [sprite('door'), scale(0.05), origin('center'), 'door'], /*origin('center') = Icon wird genau auf Ebene positioniert */
        'X': [sprite('cup'), origin('center'), 'cup'],

        '^': [sprite('ant1'), solid(), 'bad', body()], /*body = fügt gravity dazu*/
        'v': [sprite('ant2'), solid(), 'bad', body()], /*body = fügt gravity dazu*/

        '*': [sprite('bear'), solid(), 'bad', scale(1.2), body()],
        '/': [sprite('bat'), solid(), scale(0.6), 'dead'],

        //--------- Ende Definition der Platzhalter in den Levels ---------//
    }

    //--------- Start Level und Score-Definitionen ---------//

    const gameLevel = addLevel(maps[level], levelCfg)       /*maps[level] ist Zugriff auf Arrays für die Levels*/

    const scoreLabel = add([
        text(score, 16),
        pos(20, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    add([text('  Punkte, level ' + parseInt(level + 1) + ' von 5', 16), pos(42, 6)])

    //--------- Ende Level und Score-Definitionen ---------//

    //----------- Start Player Definitionen und Player-Kollisionen -----------// 

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

    player.collides('diamond', (o) => {        /*zählt und zerstört gesammelte Diamonds*/
        destroy(o)
        scoreLabel.value++ && scoreLabel.value++  /* Diamonds zählen doppelt! */
        scoreLabel.text = scoreLabel.value
    })

    //----------- Ende Player Definitionen und Player-Kollisionen -----------// 

    //----------- Start Gegner-Definitionen und Gegner-Kollisionen -----------// 
    
    action('bad', (d) => {        /* Ameise: -enemy_speed (x-Achse) damit sie sich nach links bewegen. / y-Achse = 0) */
        d.move(-ENEMY_SPEED_1, 0)
    })
    
    action('dead', (a) => {          /* Fledermaus: -enemy_speed (x-Achse) damit sie sich nach links bewegen. / y-Achse = 0) */
        a.move(-ENEMY_SPEED_2, 0)
    })

    player.collides('bad', (d) => {      /*wenn man in Boden-Gegner rennt, stirbt man, wenn man drauf hüpft, verschwinden Gegner*/
        if (isJumping) {
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value})
        }
    })

    player.collides('dead', (a) => {         /*wenn man Fledermaus berührt, stirbt man*/
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

    player.collides('cup', () => {            /* wenn man den Cup berührt, gewinnt man */
        go('win', { score: scoreLabel.value})
    })

    //----------- Ende Gegner-Definitionen und Gegner-Kollisionen -----------// 


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

    //------------------Start Pause einleiten ----------------------------------------------//
    
    keyPress('p', () => {
        go('pause', { 
            score: scoreLabel.value, 
            level: level,
        })
    })
        
    localStorage.setItem('score', scoreLabel.value),
    localStorage.setItem('level', level)
 
    //----------------------Ende Pause einleiten-------------------------------//

})
//---------------------------------- Ende Scene Game ----------------------------------//


//--------------------------- Start Game Over Definitionen ---------------------------//

scene('lose', ({ score}) => {                                                           /*Text beim Game-Over*/
    add([text('Game over', 50), origin('center'), pos(width()/2, height()/3)]);      /*zeigt bei Game-Over den Begriff Game over an*/
    add([text('Du hast ' + score + ' Punkte gesammelt', 30), origin('center'), pos(width()/2, height()/2)]);          /*zeigt bei Game-Over den Punktestand an*/
    add([text('Nochmal spielen: klicke die Leertaste', 25), origin('center'), pos(width()/2, height()/1.5)]);
    
    localStorage.setItem("mostRecentScore", score); /* setzt meinen letzten Spielstand in Localstorage */
    
    /* Klick auf Leertaste -> Start erneut */
    keyPress('space', () => {
        go('game', { level: 0, score:0})
    })
})
//--------------------------- Ende Game Over Definitionen ---------------------------//

//----------------------------Start Definition Win ---------------------------------//
scene('win', ({ score}) => {
    add([text('Du hast gewonnen', 50), origin('center'), pos(width()/2, height()/3)]);
    add([text('Du hast ' + score + ' Punkte gesammelt', 30), origin('center'), pos(width()/2, height()/2)]);
    add([text('Nochmal spielen, klicke die Leertaste', 30), origin('center'), pos(width()/2, height()/1.5)]);
    
    localStorage.setItem("mostRecentScore", score); /* setzt meinen letzten Spielstand in Localstorage */
    
    /* Klick auf Leertaste -> Start erneut */
    keyPress('space', () => {
        go('game', { level: 0, score:0})
    })
})

//----------------------------Ende Definition Win ---------------------------------------//

//----------------------------Start Pausenfenster -----------------------------------//
scene('pause', ({ score, level}) => {
    add([text('See you later', 50), origin('center'), pos(width()/2, height()/3)]);
    add([text('Um weiterzuspielen "b" klicken', 30), origin('center'), pos(width()/2, height()/2)]) 
    keyPress('b', () => {
        go('game',{   
            score: localStorage.getItem('score'),
            level: level
        })       
    })
})

//---------------------------Ende Pausenfenster-------------------------------------//

/* Die oben definierte Scene "game" wird gestartet und Level / Score starten bei Null */ 
start("game", { level: 0, score:0})


//----------------------------------------------------------------------------//
//---------------------------- Quellen ---------------------------------------//
/* 

//-- Bilder: --//

admiralpxl. FREE Spring Sprite-Sheets Pixelart. Verfügbar unter https://admiral- pxl.itch.io/spring-sprite-sheets-pixelart
aniakubow20 (2021). Super Mario Bros. Verfügbar unter https://imgur.com/a/F8Jkryq BONESGFX (2020). Sprites. Verfügbar unter https://imgur.com/gallery/Y21S7zW
Freepik Company S.L. Ant free icon. Verfügbar unter https://www.flaticon.com/free- icon/ant_809140?term=ant&related_id=809140
Freepik Company S.L. Bat free icon. Verfügbar unter https://www.flaticon.com/free- icon/bat_3526546
Freepik Company S.L. Bear premium icon. Verfügbar unter https://www.flaticon.com/pre- mium-icon/bear_2097915?term=bear&page=1&position=18&page=1&position=18&rela- ted_id=2097915
Freepik Company S.L. Trophy free icon. Verfügbar unter https://www.flaticon.com/free- icon/trophy_708906?term=cup&page=1&position=39&page=1&position=39&rela- ted_id=708906
La Red Games. Gems / Coins Free. Verfügbar unter https://laredgames.itch.io/gems-coins- free
mawwyncha. (2014). Sprites. Verfügbar unter https://imgur.com/gallery/eYw55 of_imperfect. 2d Door. Verfügbar unter https://of-imperfect.itch.io/2d-door

//-- Tutorials und sonstiges: --//

Code with Ania Kubów. (2021). Code Mario in JavaScript with Kaboom.js! [Video]. https://www.youtube.com/watch?v=2nucjefSr6I
Kaboom.js. Verfügbar unter https://kaboomjs.com/
Stackoverflog. Verfügbar unter https://stackoverflow.com/questions/35329180/localstorage-save-name-through-form-show-on-other-page 


*/