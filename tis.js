// Necesitamos una función de alcance anónimo porque el oyente Keydown tiene que tener
// Acceso a NextCodeChar, y no queremos almacenarlo a nivel mundial. También podríamos
// almacéntelo en la función del controlador en sí, pero "argumentos.callee" es terriblemente
// largo...
(function() {
  var
      doc = document,
      addEventListener = 'addEventListener',
      charCodeAt = 'charCodeAt',
      keyCode = 'keyCode',
      keydown = 'keydown',

      nextCodeChar = 0,
      state; // 0 | Undefined = Quit, 1 = claro, 2 = perdido, 3 = jugar

  doc[addEventListener](keydown, function(e) {
    nextCodeChar = e[keyCode] == "&&((%'%'BA"[charCodeAt](nextCodeChar) ? nextCodeChar + 1 : 0;
    if (!state && nextCodeChar > 9) {
      state = 3;
      (function() {
        var
            win = window,

            createElement = 'createElement',
            removeEventListener = 'removeEventListener',
            keyup = 'keyup',

            math = Math,

            baseBass = 'LSOSLSOSKSNSKSNS',
            music = [
              // http://www.theoreticallycorrect.com/Helmholtz-Pitch-Numbering/
              //
                // Nota más baja en agudos: 60
               // Nota más alta en agudos: 83
               //
               // Resta 32, entonces:
               // - % 24 da el número de nota MIDI menos 60
               // - / 24 da duración: octavo, trimestre punteado, cuarto, mitad
               //
               // Otra manera:
               // Número de nota - 28 + 24 * [0: octavo, 1: cuarto punteado, 2: cuarto, 3: mitad]
               //
              '`+,^,+Y),`.,C,^`\\Yq^.1e31H,01.,C,^`\\Yq',
              'T$$T,+)$),Y))<$TTYTl.).1^..D,\\.,<$TTTTT`',
                // Todas las notas son octavas.
               // Resta 64 para obtener el número de nota MIDI - 33.

              'GNKNGNKN' + baseBass + 'LSNSL@BCESOSESOSCOCOCOCOBNBN?J?J@CGL@@@@'
            ],
            thirdVerse = [
              // Voces de agudos
              'xtvstqpsxtvs\\`}|x',
              'tqspqqpptqspY`xx\u007f',
              // Bajo
              baseBass+baseBass+baseBass+baseBass
            ],

              // bits 0-3: velocidad de desvanecimiento (0 más lenta, 15 más rápido)
             // bits 4-9: período 2
             // bits 10-11: período 1
            sounds = [],

            // Primero 2 líneas invisibles, luego 20 líneas visibles, luego 2 para la siguiente pantalla.
            grid = [],
            shadowGrid = [],
            w = 10,
            h = 22,
            s = w*h+20,

            // x I J L O S T Z
            colors = '08080890dd936f9e809dd090e09c0c9f22'.split(9),

            // http://tetris.wikia.com/wiki/SRS
            //
              // cadena de bytes codificada de base-64, que consta de 8 bytes para cada tetromino.
             // Cada bloque de 8 bytes es de 4 palabras de 2 bytes, cada palabra representa una rotación:
            //
            // 7 6 5 4 <- primer byte
            // 3 2 1 0 <- primer byte
            // 7 6 5 4 <- segundo byte
            // 3 2 1 0 <- segundo byte
            shapes = atob('8ABERAAPIiJxACYCcAQiA3QAIgZwASMCZgBmAGYAZgA2AGIEYAMxAnIAYgJwAjICYwBkAjAGMgE'),
              // Tablas de patada de pared: http://tetrisconcept.net/wiki/srs#wall_kicks
             //
             // Cada tabla se representa como 4 * 5 caracteres.
             // Los primeros 4 son para la orientación 0, etc., y los 5 caracteres son los
             // Posibles compensaciones para una rotación en el sentido de las agujas del reloj de esa orientación. (Para
             // en sentido antihorario, simplemente niegue los valores).
             //
             // Resta 32, entonces:
             // - bits 0-2 dar x desplazamiento más 2 (rango: 0..4)
             // - Bits 3-5 Dar desplazamiento Y invertido más 2 (Rango: 0..4)
             // (invertida porque la página de referencia anterior hace eso)
            //
            // y\x -2 -1  0 +1 +2
            // -2  sp  !  "  #  $
            // -1   (  )  *  +  ,
            //  0   0  1  2  3  4
            // +1   8  9  :  ;  <
            // +2   @  A  B  C  D
            wallKickTableI = '203(C214A,241<!230#8', // I
            wallKickTableRest = '219"!23+BC23;"#21)BA', // Otros bloques, incluyendo no-op o

            bag = [],
            currentTetromino,
            currentX,
            currentY,
            currentRotation,

            stateTime,
            linesClearing,

            score = 0,
            lines = 0,
            level = 1,

            delta,
            gravityTimer, // entre 0 y 1
            lockTimer = 2,
            keysPressed = [],
            lastFrame,

            i, j, x, y, tmp, tmp2, tmp3, tmp4, tmp5,

            divStyleMargin = '<div style="margin:',
            divEnd = '</div>',

            // 1pc = 16px
            html =
              divStyleMargin + '-14pc -10pc;position:fixed;width:20pc;left:50%;top:50%;font:12px Arial;background:rgba(0,0,0,.8);box-shadow:0 0 2pc #000;border-radius:1pc">' +
                divStyleMargin + '1pc 2pc;color:#888">' +
                  '<b><a href="https://entreunosyceros.net" style="color:inherit">TETAS</a></b>: Tetris Es Tan Asombrosamente Simple solo en 4 kB de JavaScript<br><br>' +
                  'Izquierda/derecha: mover | Arriba/Ctrl/Alt: rotas | Esc: Salir<br>' +
                  'Abajo/Espacio: Despacio/rápido abajo | M: música' +
                divEnd +
                divStyleMargin + '0 1pc;float:right;color:#eee;font-size:1pc">' +
                  '<div id="tis-status">' + divEnd +
                  'Siguiente' + divStyleMargin + '8px 0;width:4pc">'
            ;

        tmp2 = divStyleMargin + '0;width:1pc;height:1pc;float:left;box-shadow:-2px -2px 8px rgba(0,0,0,.4) inset,0 0 2px #000 inset" id="tis-';
        for (i = 220; i < s; i++) {
          if (i % w < 4) {
            html += tmp2 + i + '">' + divEnd;
          }
        }
        html +=   divEnd +
                divEnd +
                divStyleMargin + '0 2pc 2pc;background:#000;width:10pc;height:20pc">';

        for (i = 0; i < s; i++) {
          grid.push(0);
          if (i > 19 && i < 220) {
            html += tmp2 + i + '">' + divEnd;
          }
        }

        html += divEnd +
              divEnd;
        tmp = doc[createElement]('div');
        tmp.innerHTML = html;
        doc.body.appendChild(html = tmp);

        // Musica!
        // 4593 muestras/octavo * 8 octavos/bar * 24 barras = 881856 muestras
        tmp = new Uint8Array(881856);
        // Delta es el índice de voz; ¡Ten en cuenta que es una cadena!
        for (delta in music) {
          music[delta] += music[delta] + thirdVerse[delta];
          for (i = 0, j = 0; j < music[delta].length;) {
            tmp3 = music[delta][charCodeAt](j++) - (delta == 2 ? 64 : 32);
            // 2 * pi * 55 Hz / 22050 Hz = 0.0156723443
            // Pero dividimos el Pi
            // 2 * 55 Hz / 22050 Hz = 0.0049886621
            x = .00499 * math.pow(2, (tmp3 % 24 + (delta == 2 ? 0 : 27)) / 12);
            tmp2 = [15, 9, 9][delta];
            for (y = 0; y < 4593 * [1, 3, 2, 4][~~(tmp3 / 24)];) {
              // || Funciona porque no tenemos la amplitud para alcanzar el valor de la muestra 0.
               // y * x es el horario de fase dos: [0, 2).
              tmp[i++] = (tmp[i] || 127) + (y++ * x % 2 < 1 ? tmp2 : -tmp2);
              tmp2 *= 0.9999;
            }
          }
        }
        music = makeAudio(tmp);
        music.play();
        music.loop = 1;

        function playSoundEffect(encoding) {
          if (!(tmp5 = sounds[encoding])) {
            tmp5 = new Uint8Array(9e3);
            tmp4 = 50; // amplitud
            for (j in tmp5) {
              tmp3 = j > 1e3 ? (encoding >> 4) & 63 : encoding >> 10; // period
              tmp5[j] = 127 + (tmp4 *= 1 - (encoding&15) / 1e4) * (j/10%tmp3 < tmp3 / 2 ? -1 : 1);
            }
            tmp5 = sounds[i] = makeAudio(tmp5);
          } else {
            tmp5.currentTime = 0;
          }
          tmp5.play();
        }

        function makeAudio(wavArray) {
          tmp5 = wavArray.length;
          // https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
          //
          // wavArray.set([
          //   0x52, 0x49, 0x46, 0x46, // "RIFF"
          //   (tmp + 36) & 0xff, ((tmp + 36) >> 8) & 0xff, ((tmp + 36) >> 16), 0, // data size + 36 (little-endian)
          //   0x57, 0x41, 0x56, 0x45, // "WAVE"
          //
          //   0x66, 0x6d, 0x74, 0x20, // "fmt "
          //   16, 0, 0, 0, // size of this subchunk
          //   1, 0, // PCM
          //   1, 0, // mono
          //   34, 86, 0, 0, // sample rate: 22050 Hz
          //   34, 86, 0, 0, // byte rate: 22050 bytes/s
          //   1, 0, // block align
          //   8, 0, // bits per sample
          //
          //   0x64, 0x61, 0x74, 0x61, // "data"
          //   tmp & 0xFF, (tmp >> 8) & 0xff, tmp >> 16, 0 // data size
          // ]);
          return new Audio(URL.createObjectURL(new Blob([
            'RIFF',
// Suponiendo que esto se almacenará en Little-Endian.
             // en realidad es específico de la plataforma ...
            new Uint32Array([tmp5 + 36, 0x45564157, 0x20746d66, 16, 65537, 22050, 22050, 524289, 0x61746164, tmp5]),
            wavArray
          ], {type: 'audio/wav'})));
        }

        function isSolidAt(x, y, rotation, tetromino) {
          return currentTetromino &&
            !(x & ~3) && !(y & ~3) && // Verificación de rango para [0, 4)
            (shapes[charCodeAt](8*(tetromino || currentTetromino) - 8 + 2*rotation + (y>>1)) & (1 << (4 * (y&1) + x)));
        }

        function render() {
          tmp = currentY;
          while (currentTetromino && tryMove(currentX, currentY+1, currentRotation, 1));
          for (y = 0; y < h+4; y++) {
            for (x = 0; x < w; x++) {
              i = y*w + x;
              if (y >= h) {
                grid[i] = isSolidAt(x, y-h, 0, bag[0]) ? bag[0] : 0;
              }
              shadowGrid[i] =
                isSolidAt(x-currentX, y-tmp, currentRotation) ? currentTetromino :
                isSolidAt(x-currentX, y-currentY, currentRotation) ? currentTetromino + 8 :
                grid[i] || 0;
              if (tmp3 = win['tis-' + i]) {
                tmp3 = tmp3.style;
                tmp3.background = '#' + (
                    state == 1 && stateTime % 4 < 2 && linesClearing[y] ?
                    'fff' :
                    colors[shadowGrid[i] % 8]);
                tmp3.opacity = shadowGrid[i] > 7 ? 0.2 : 1;
              }
            }
          }
          currentY = tmp;
          tmp = divStyleMargin + '0;text-align:right;font-size:150%">';
          win['tis-status'].innerHTML = 'Puntuación' + tmp + score + divEnd + 'Líneas' + tmp + lines + divEnd + 'Nivel' + tmp + level + divEnd;
        }

        function tryMove(posX, posY, rotation, doNotRender) {
          for (j = 0; x = (j&3), y = (j>>2), j < 16; j++) {
            if (isSolidAt(x, y, rotation) &&
                ((x += posX) < 0 || x >= w || (y += posY) < 0 || y >= h || grid[y*w + x])) {
              return;
            }
          }
          currentX = posX;
          currentY = posY;
          currentRotation = rotation;
          lockTimer = 0;
          doNotRender || render();
          return 1;
        }

        function frame(now) {
          if (!state) return;
          delta = (now - lastFrame) / 1e3 || 0;
          if (delta > .1) delta = .1;
          lastFrame = now;
          if (state == 2) { // Game over
            if (stateTime-- > 4 && !(stateTime % 4)) {
              for (x = 0; x < w;) {
                grid[stateTime*w/4 + x++] = 1 + ~~(math.random() * 7);
              }
              render();
            }
          } else if (state == 1) { // Limpiando
            if (--stateTime < 0) {
              for (y in linesClearing) {
                for (i = y*w+w-1; i >= 0; i--) {
                  grid[i] = grid[i-w];
                }
              }
              state = 3;
            }
            render();
          } else { // Estado == 3: Juego regular
            // Manejo de la entrada del teclado
            for (tmp2 in keysPressed) {
              if (tmp2 == 37 || tmp2 == 39) {
                // Mover
                if (keysPressed[tmp2] >= 0) {
                  keysPressed[tmp2] -= keysPressed[tmp2] ? .05 : .2;
                  tryMove(currentX + 1 - 2 * (tmp2 == 37), currentY, currentRotation);
                }
              }
              if (tmp2 == 32) {
                // Espacio: caída dura
                if (!keysPressed[tmp2]) {
                  while (tryMove(currentX, currentY + 1, currentRotation));
                  lockTimer = 9;
                }
              }
              if (tmp2 == 38 || tmp2 == 18 || tmp2 == 17) {
                // Rotatar
                // -1 para izquierda, 1 para derecha
                tmp4 = 1 - 2 * (tmp2 == 17);
                if (!keysPressed[tmp2]) {
                  for (i = 0; i < 5;) {
                    tmp = (currentTetromino == 1 ? wallKickTableI : wallKickTableRest)[charCodeAt](((currentRotation + 4 + (tmp4-1)/2))%4 * 5 + i++) - 32;
                    if (tryMove(currentX + tmp4 * ((tmp & 7) - 2), currentY + tmp4 * (2 - (tmp >> 3)), (currentRotation+4+tmp4) % 4)) {
                      playSoundEffect(8303);
                      break;
                    }
                  }
                }
              }
              keysPressed[tmp2] += delta;
            }

            // Aplicar gravedad
            gravityTimer += math.max(
                keysPressed[40] ? 0.2 : 0,
                delta * math.pow(1.23, level));
            if (gravityTimer > 1) {
              gravityTimer = 0;
              tryMove(currentX, currentY + 1, currentRotation);
            }

            if (lockTimer > 1) {
              if (currentTetromino) playSoundEffect(31445);

              //Bloquearlo en su lugar; Suponemos que el render se acabó
              for (i in grid) grid[i] = shadowGrid[i];

              // Encuentra filas completas
              tmp2 = 0;
              linesClearing = [];
              rowNotFull:
              for (y = 0; y < h; y++) {
                for (x = 0; x < w;) {
                  if (!grid[y*w + x++]) {
                    continue rowNotFull;
                  }
                }
                linesClearing[y] = state = 1;
                tmp2++;
                stateTime = 6;
              }
              if (tmp2) playSoundEffect([, 8392, 8260, 8242, 8225][tmp2]);
              score += 100 * [0, 1, 3, 5, 8][tmp2] * level;
              lines += tmp2;
              level = 1 + ~~(lines / 10);

              // Bolsa de barato si es necesario
              if (bag.length < 2) {
                  // TMP es una masa de bits que rastrea qué tetrominos ya hemos agregado.
                 // bit 0 es solo un centinela, los bits 1-7 corresponden a tetrominos.
                for (tmp = 1; tmp != 255;) {
                  for (j = 0; tmp & (1 << j); j = 1 + ~~(math.random() * 7));
                  tmp |= 1 << j;
                  bag.push(j);
                }
              }

              // Engendrar nuevo tetromino
              currentTetromino = bag.shift();
              gravityTimer = 0;
              if (!tryMove(3, 0, 0)) {
                // Game over
                currentTetromino = 0;
                state = 2;
                stateTime = 4*h;
                playSoundEffect(31360);
              }
            }
            lockTimer += delta;
          }

          requestAnimationFrame(frame);
        }
        frame(0);

        function onKeyDown(e) {
          tmp = e[keyCode];
          if (tmp == 77) {
            music[music.paused ? 'play' : 'pause']();
          }
          if (tmp == 27) { // Salir
            doc.body.removeChild(html);
            doc[removeEventListener](keydown, onKeyDown);
            doc[removeEventListener](keyup, onKeyUp);
            music.pause();
            state = 0;
          }
          keysPressed[tmp] = keysPressed[tmp] || 0;
          if ([17, 18, 27, 37, 38, 39, 40, 77].indexOf(tmp) >= 0) {
            e.preventDefault();
          }
        }

        function onKeyUp(e) {
          delete keysPressed[e[keyCode]];
        }

        doc[addEventListener](keydown, onKeyDown);
        doc[addEventListener](keyup, onKeyUp);
      })();
    }
  });
})();
