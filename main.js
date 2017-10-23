window.onload = function() {
    var width = 340,
        height = 340,
        pinLength = 0,
        startX = 0,
        startY = 0,
        startPinDistance = 0,
        contenders = [],
        shuffledContenders = [],
        tournament = [
            new Array(1),
            new Array(2),
            new Array(4),
            new Array(8)
        ],
        colors = (function() {
            var array = new Array(tournament[3].length);

            for (var i = 0, len = array.length; i < len; i++) {
                /* Ohh!!!! The memory, ohhhh!!!!!! */
                array[i] = "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ", 1)";
            }
            // console.log(array);
            return array;
        })(),
        matches = [],
        players = JSON.parse(localStorage.getItem('players')) || {
            // "1": player({
            //     id: 1,
            //     name: "kitanga"
            // })
        },
        playerIDs = 0,
        playerImages = {},
        currentMatch = {},
        canvas = need.canvas({
            "id": "tournament-stuff" /* , */
                // "width": width,
                // "height": height
        }),
        context = canvas.getContext('2d');

    window.t = tournament;

    function clear(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    function prepTournament() {
        for (var i = 0, len = tournament.length; i < len; i++) {
            var id = 0;
            // if (tournament[i].hasOwnProperty('length')) {
            for (var k = 0, len2 = tournament[i].length; k < len2; k++) {
                if (i === len - 1) {
                    /* The first stage (aka quarter-finals) */
                    tournament[i][k] = pin({
                        "drawDownLane": false,
                        "p_id": players[contenders[k]] ? players[contenders[k]].id : 1,
                        "drawFace": true
                    });
                } else if (i) {
                    /* The normal stages */
                    tournament[i][k] = pin({
                        "active": false,
                        "isMatch": true,
                        "drawFace": false
                    });
                } else {
                    /* The winner */
                    tournament[i][k] = pin({
                        "drawSideLane": false,
                        "active": false,
                        "isMatch": true,
                        "drawFace": false
                    });
                }
            }
        }

        /* Fill up the matches array */
        for (var i = 0, len = tournament.length; i < len; i++) {
            for (var k = 0, len2 = tournament[i].length; k < len2; k++) {
                if (tournament[i][k].isMatch) {
                    matches[matches.length] = tournament[i][k];
                    matches[matches.length - 1].prevPins = [];
                    // console.log("PrevPin[0]:", k * 2);
                    // console.log("PrevPin[1]:", (k * 2) + 1);
                    // console.log("");
                    matches[matches.length - 1].prevPins[0] = tournament[i + 1] ? tournament[i + 1][k * 2] : "";
                    matches[matches.length - 1].prevPins[1] = tournament[i + 1] ? tournament[i + 1][(k * 2) + 1] : "";
                }
            }
        }
        matches.reverse();

        console.log(matches);
        console.log(tournament);

        // tournament[3][0].isWinner = true;
        // tournament[3][0].active = true;

        // tournament[3][1].active = false;
        // tournament[3][1].hasPlayed = true;

        // tournament[2][0].turnOnDownLane = true;
        // tournament[2][0].active = true;
    }

    function processStage(context, stage, sX, sY) {
        var i = 0,
            length = stage.length,
            distance = (canvas.width / length),
            halfWidth = (distance / 2),
            halfHeight = ((canvas.height * 0.25) * 0.5),
            lightColor = '#7fa5dd',
            darkColor = '#082f67';

        context.fillStyle = lightColor;
        context.strokeStyle = lightColor;

        for (; i < length; i++) {
            var x = sX + (distance * i) + halfWidth,
                y = sY + halfHeight;

            /* Draw down lane */
            if (stage[i].drawDownLane) {
                if (!stage[i].turnOnDownLane) {
                    context.strokeStyle = darkColor;
                } else {
                    context.strokeStyle = lightColor;
                }
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x, y + halfHeight);
                context.stroke();
                context.closePath();
            }

            /* Draw side lane */
            if (stage[i].drawSideLane) {
                if (!stage[i].isWinner) {
                    context.strokeStyle = darkColor;
                } else {
                    context.strokeStyle = lightColor;
                }
                context.beginPath();
                if (i % 2) {
                    /* Odd, draw to the left */
                    context.moveTo(x, y);
                    context.lineTo(x, y - halfHeight);
                    context.moveTo(x, y - halfHeight);
                    context.lineTo(x - halfWidth, y - halfHeight);
                } else {
                    /* Even, draw to the right */
                    context.moveTo(x, y);
                    context.lineTo(x, y - halfHeight);
                    context.moveTo(x, y - halfHeight);
                    context.lineTo(x + halfWidth, y - halfHeight);
                }
                context.stroke();
                context.closePath();
            }

            /* Pick color for pin depending on whether the player has played, won, or lost */
            if (stage[i].active) {

                /* Used to test user colors */
                // var color = colors[stage[i].p_id];
                // console.log(colors);
                // console.log(color);
                // console.log(stage[i].p_id);
                // context.fillStyle = color;

                context.fillStyle = lightColor;
            } else {
                context.fillStyle = darkColor;
            }

            /* Draw box */
            context.fillRect(x - (pinLength / 2), y - (pinLength / 2), pinLength, pinLength);

            /* We are drawing the pin of a knocked out p_ */
            if (!stage[i].isWinner && stage[i].hasPlayed) {
                stage[i].p_id !== '' ? context.drawImage(playerImages[stage[i].p_id].greyscale, x - Math.round(pinLength * 0.5), y - Math.round(pinLength * 0.5)) : '';
                context.strokeStyle = darkColor;
                context.lineWidth = 2;
                context.strokeRect(x - (pinLength / 2), y - (pinLength / 2), pinLength, pinLength);
                context.lineWidth = 4;
                context.strokeStyle = 'rgba(255, 0, 0, 0.43)';

                // context.beginPath();
                // context.moveTo(x - Math.round(pinLength * 0.5) + 7, y - Math.round(pinLength * 0.5) + 7);
                // context.lineTo(x + Math.round(pinLength * 0.5) - 7, y + Math.round(pinLength * 0.5) - 7);

                // context.moveTo(x + Math.round(pinLength * 0.5) - 7, y - Math.round(pinLength * 0.5) + 7);
                // context.lineTo(x - Math.round(pinLength * 0.5) + 7, y + Math.round(pinLength * 0.5) - 7);

                // // context.moveTo(x, y);
                // // context.lineTo(x, y);

                // context.stroke();
                // context.closePath();

                // document.body.appendChild(playerImages[stage[i].p_id].greyscale);
            } else {
                context.lineWidth = 2;
                stage[i].p_id !== '' ? context.drawImage(playerImages[stage[i].p_id].normal, x - Math.round(pinLength * 0.5), y - Math.round(pinLength * 0.5)) : '';
                context.strokeStyle = lightColor;
                context.strokeRect(x - (pinLength / 2), y - (pinLength / 2), pinLength, pinLength);
            }

            /* Do this so that the other line draws are not affected */
            context.lineWidth = 1;
        }

    }

    function playMatch() {
        currentMatch = matches.shift();

        currentMatch.active = true;
        currentMatch.turnOnDownLane = true;

        currentMatch.prevPins[0].drawFace = true;
        currentMatch.prevPins[1].drawFace = true;

        /* For testing */
        var player1winner = Math.round(Math.random());

        if (player1winner) {
            currentMatch.p_id = currentMatch.prevPins[0].p_id;

            /* The winner */
            currentMatch.prevPins[0].isWinner = true;
            currentMatch.prevPins[0].active = true;
            currentMatch.prevPins[0].hasPlayed = true;

            /* The loser */
            currentMatch.prevPins[1].active = false;
            currentMatch.prevPins[1].hasPlayed = true;
        } else {
            currentMatch.p_id = currentMatch.prevPins[1].p_id;

            /* The winner */
            currentMatch.prevPins[1].isWinner = true;
            currentMatch.prevPins[1].active = true;
            currentMatch.prevPins[1].hasPlayed = true;

            /* The loser */
            currentMatch.prevPins[0].active = false;
            currentMatch.prevPins[0].hasPlayed = true;
        }
        drawTable(context);
    }

    function drawTable(context) {
        clear(context);
        for (var i = 0, len = tournament.length; i < len; i++) {
            processStage(context, tournament[i], 0, canvas.height * (0.25 * i));
        }
    }

    function updatePlayerPool() {
        localStorage.setItem("players", JSON.stringify(players));
    }


    function processPlayerInfo() {
        // if (player[0]) {
        function getCanvasImage(index, type, /* playerCanvas, */ dataURL, x, y, _width, _height) {
            var canvas = need.canvas(),
                context = canvas.getContext('2d'),
                img = new Image();

            canvas.width = _width;
            canvas.height = _height;

            var canvas2 = need.canvas({
                    "width": pinLength,
                    "height": pinLength
                }),
                context2 = canvas2.getContext('2d');
            img.onload = function() {
                img.width = pinLength;
                img.height = pinLength;
                context.drawImage(img, x, y, _width, _height, 0, 0, pinLength, pinLength);

                context2.drawImage(canvas, 0, 0, _width, _height /*  */ );
                canvas2.style.border = "1px solid white";
                // canvas = canvas2;
                // playerImages[index][type] = canvas2;
                // document.body.appendChild(playerCanvas);
            };
            img.src = dataURL;
            // canvas.width = pinLength;
            // canvas.height = pinLength;
            return canvas2;
        }

        var count = 0;
        availablePlayers.innerHTML = "<h3>Available Players</h3>";
        for (var i in players) {
            if (players[i]) {
                playerImages[i] = {
                    "normal": need.canvas(),
                    "greyscale": need.canvas()
                };

                // playerImages[i].normal.src = players[i].normal;
                // playerImages[i].greyscale.src = players[i].greyscale;

                playerImages[i].normal = getCanvasImage(i, 'normal', players[i].images.normal.string, 0, 0, players[i].images.normal.pinLength, players[i].images.normal.pinLength);
                playerImages[i].greyscale = getCanvasImage(i, 'normal', players[i].images.greyscale.string, 0, 0, players[i].images.greyscale.pinLength, players[i].images.greyscale.pinLength);

                // console.log(playerImages[i])
                // document.body.appendChild(playerImages[i].greyscale);

                /* Add the player's info into the available players list */
                var playerDiv = need.element("p", {
                    "class": "playerCard"
                });

                playerDiv.innerText = count + 1 + ". Name: " + players[i].name + " | ID: " + players[i].id;
                availablePlayers.appendChild(playerDiv);
                count++;
            }
        }
        playerIDs = count;
        // }
    }

    function shuffleContenders() {
        // for (var i = 0, len = contenders.length, total = 8; i < total; i++) {
        //     contenders[i] = i;
        // }

        for (var i = 0, len = contenders.length; i < len; i++) {
            var item = contenders.splice(need.math.randomInt(0, contenders.length - 1), 1)[0];
            // item = item[0];
            shuffledContenders[i] = item;
        }
        contenders = shuffledContenders.concat();
        console.log(contenders);
    }

    function renderContenderList() {
        // if (contenders.length) {
        contendersList.innerHTML = "<h3>Contenders (<span id=contenderCount>0</span>/8)</h3>";
        for (var i = 0, len = contenders.length; i < len; i++) {
            var contender = need.element('p'),
                player = players[contenders[[i]]];

            contenderCount.innerText - 0 < 8 ? (contenderCount.innerText = (contenderCount.innerText - 0) + 1) : '';
            contender.innerText = i + 1 + ". Name: " + player.name + " | ID: " + player.id;
            i < 8 ? (contender.style.color = "#7fa5dd") : (contender.style.color = "red");
            contendersList.appendChild(contender);
        }
        // } else {
        // contendersList.innerHTML = "<h3>Contenders (<span id=contenderCount>0</span>/8)</h3>";
        // }
    }

    function removeContenderFromList() {
        var id = prompt("Player to be removed as contender");
        id ? (id -= 0) : (id = '');
        for (var i = 0, len = contenders.length; i < len; i++) {
            if (contenders[i] === id) {
                console.log(contenders);
                contenders.splice(i, 1);
                console.log(contenders);
                contenderCount.innerText - 0 !== 0 ? (contenderCount.innerText = (contenderCount.innerText - 0) - 1) : '';
                renderContenderList();
            }
        }
    }

    function addContenderToList() {
        var id = prompt("Player to be added as contender"),
            failed = false;
            id ? (id -= 0) : (id = '');
        for (var i = 0, len = contenders.length; i < len; i++) {
            if (contenders[i] === id) {
                failed = true;
            }
        }
        if (players[id] && !failed) {
            contenders.push(id);
            // contendersList.innerHTML = "<h3>Contenders (<span id=contenderCount>0</span>/8)</h3>";
            contenderCount.innerText - 0 < 8 ? (contenderCount.innerText = (contenderCount.innerText - 0) + 1) : '';
            renderContenderList();
        } else {
            if (!players[id]) {
                alert("You put an ID that doesn't exist.");
            } else {
                alert("The player's already a contender.");
            }
        }
    }

    function player(options) {
        var obj = {
            "id": 0,
            "name": '',
            "images": {
                "normal": {
                    "string": '',
                    "pinLength": 0
                },
                "grayscale": {
                    "string": '',
                    "pinLength": 0
                }
            }
        };

        if (options) {
            for (var i in options) {
                obj[i] = options[i];
            }
        }

        return obj;
    }

    function pin(options) {
        var obj = {
            "isWinner": false,
            "p_id": '',
            "turnOnDownLane": false,
            "turnOnSideLane": false,
            "active": true,
            "drawDownLane": true,
            "drawSideLane": true,
            "hasPlayed": false,
            "drawFace": false
                // "nextPin": {},
                // "prevPins": []
        };

        if (options) {
            for (var i in options) {
                obj[i] = options[i];
            }
        }

        return obj;
    }

    function startTournamentBracket() {
        canvas.hidden = false;
        playersList.hidden = true;

        /* For testing */
        var i = 0,
            len = matches.length;
        var interval = setInterval(function() {
            // console.log("Match in progress");
            if (i == len) {
                clearInterval(interval);
            } else {
                i++;
                playMatch();
            }
        }, 1420);
    }

    function createPlayer() {
        var name = prompt("New player's name"),
            normalDataUrl = '',
            greyscaleDataUrl = '',
            canvas = need.canvas({
                "width": pinLength,
                "height": pinLength
            }),
            context = canvas.getContext('2d'),
            constraints = { video: true, audio: false };

        preview.hidden = false;
        playersList.hidden = true;

        takePhoto.onclick = function() {
            context.drawImage(picPreview, 0, 0, pinLength, pinLength);
            document.body.appendChild(canvas);
            normalDataUrl = canvas.toDataURL();
            greyscaleDataUrl = (function() {
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                var data = imageData.data;

                for (var i = 0; i < data.length; i += 4) {
                    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    // red
                    data[i] = brightness;
                    // green
                    data[i + 1] = brightness;
                    // blue
                    data[i + 2] = brightness;

                    data[i + 3] = 255 * 0.25;
                }

                imageData.data = data;
                context.putImageData(imageData, 0, 0);
                return canvas.toDataURL();
            })();

            players[playerIDs++] = player({
                id: playerIDs - 1,
                name: name,
                images: {
                    normal: {
                        "string": normalDataUrl,
                        "pinLength": pinLength
                    },
                    greyscale: {
                        "string": greyscaleDataUrl,
                        "pinLength": pinLength
                    }
                }
            });

            updatePlayerPool();
            processPlayerInfo();
            preview.hidden = true;
            playersList.hidden = false;
        };

        var promisifiedOldGUM = function(constraints) {

            // First get ahold of getUserMedia, if present
            var getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia);

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });

        }

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                picPreview.src = window.URL.createObjectURL(stream);
                picPreview.play();
                canvas.width = picPreview.clientWidth;
                canvas.height = picPreview.clientHeight;
            })
            .catch(function(err) {
                console.log(err.name + ": " + err.message);
            });
        // The Polyfill above was extracted from https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    }

    function addFirst8() {
        // if (players[0]) {
        for (var i = 0; i < playerIDs; i++) {
            contenders[i] = players[i].id;
        }
        renderContenderList();
        // }
    }

    function init() {
        game.appendChild(canvas);
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        /* Now we set the starting x, y, width, heights of the tournament tree pins */
        pinLength = Math.round(game.clientWidth / 8) - ((game.clientWidth / 8) * 0.34);
        canvas.hidden = true;
        playersList.hidden = false;

        processPlayerInfo();

        /* Used for testing */
        addFirst8();

        addContenderBtn.onclick = function() {
            addContenderToList();
        };

        removeContenderBtn.onclick = function() {
            removeContenderFromList();
        };

        createPlayerBtn.onclick = function() {
            createPlayer();
        };

        startTournamentBtn.onclick = function() {
            if (contenders.length > 7) {
                prepTournament();
                drawTable(context);
                shuffleContenders();
                startTournamentBracket();
            }
        };
    }

    init();
};