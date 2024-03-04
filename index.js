const GameBoard = (() => {
    // Variables
    let player;

    // Functions
    const displayGameBoard = (function() {
        const gameDiv = document.querySelector('.game');
        const gameBoard = [];
        for (let i = 0; i < 9; i++) {
            gameBoard.push(i);
        }
        const populateBoard = (function (a = [], b) {
            b.innerHTML = a.map((i) => {        
                return `
                    <div data-list=tile${i}></div>
                `
            }    
            ).join('')

            return {b}

        })(gameBoard, gameDiv);
        document.querySelector('.scores').setAttribute('style', 'display:none');

        return {
            gameDiv,
            boardDivs: [...populateBoard.b.querySelectorAll('div')],
            player: 'player1',
        }
    })();


    const setPlayerName = (() => {
        let player1 = document.querySelector(`[name='pl1']`).value;
        let player2 = document.querySelector(`[name='pl2']`).value;
        (player1 === '') ? player1 = 'Player X' : player1 = player1;
        (player2 === '') ? player2 = 'Player O' : player2 = player2;
        return {player1, player2,};
    });

    const announcePlayer = (() => {document.querySelector('.names > h3').innerText = `${player}'s turn`;});

    const startGame = () => {
        document.querySelector('.module').setAttribute('style', 'display: none');
        document.querySelector('.game').removeAttribute('style');
        document.querySelector('.replay').removeAttribute('style');
        player = setPlayerName().player1;
        announcePlayer();
    }

    const Game = (() => {
        // Variables
        const announce = document.querySelector('h2');
        let xScore = 0;
        let oScore = 0;
        let rounds = 0;

        // Fns
        const playGame = (e) => {
            let target = e.target;
        
            if ((target.matches('.game')) || (target.hasAttribute('played'))) {return}
            else if (displayGameBoard.player === 'player1') {
                target.innerText = 'X'
                displayGameBoard.player = 'player2';
                player = setPlayerName().player2;
                announcePlayer();
                target.setAttribute('played', 'X');
                if (checkWin() === 'pl1') {
                    document.querySelector('.scores').removeAttribute('style');
                    xScore += 1;
                    rounds += 1;
                    announce.innerHTML = `${setPlayerName().player1} wins.`;
                    displayGameBoard.gameDiv.style.display = 'none';
                    document.querySelector('.replay').removeAttribute('disabled');
                    document.querySelector('.names > h3').setAttribute('style', 'display:none');
                    updateScore()
                }
            } else if (displayGameBoard.player === 'player2') {
                target.innerText = 'O'
                displayGameBoard.player = 'player1';
                player = setPlayerName().player1;
                announcePlayer();
                target.setAttribute('played', 'O');
                if (checkWin() === 'pl2') {
                    document.querySelector('.scores').removeAttribute('style');
                    oScore += 1;
                    rounds += 1;
                    announce.innerHTML = `${setPlayerName().player2} wins.`
                    displayGameBoard.gameDiv.style.display = 'none';
                    document.querySelector('.replay').removeAttribute('disabled');
                    document.querySelector('.names > h3').setAttribute('style', 'display:none');
                    updateScore()
                }
            };
            if (checkWin() === 'draw') {
                document.querySelector('.scores').removeAttribute('style');
                rounds += 1;
                announce.innerHTML = `It's a draw.`
                displayGameBoard.gameDiv.style.display = 'none';
                document.querySelector('.replay').removeAttribute('disabled');
                document.querySelector('.names > h3').setAttribute('style', 'display:none');
                updateScore()
            }    
        }

        const checkWin = () => {
            const tiles = displayGameBoard.boardDivs;
            const [t0, t1, t2, t3, t4, t5, t6, t7, t8] =
                [tiles.find(tile => tile.dataset.list === 'tile0'),
                tiles.find(tile => tile.dataset.list === 'tile1'),
                tiles.find(tile => tile.dataset.list === 'tile2'),
                tiles.find(tile => tile.dataset.list === 'tile3'),
                tiles.find(tile => tile.dataset.list === 'tile4'),
                tiles.find(tile => tile.dataset.list === 'tile5'),
                tiles.find(tile => tile.dataset.list === 'tile6'),
                tiles.find(tile => tile.dataset.list === 'tile7'),
                tiles.find(tile => tile.dataset.list === 'tile8')
            ];
            const combinations = [
                [t0, t1, t2],
                [t0, t3, t6],
                [t0, t4, t8],
                [t1, t4, t7],
                [t3, t4, t5],
                [t2, t4, t6],
                [t2, t5, t8],
                [t6, t7, t8]
            ]
            if (combinations.every(comb => comb.every(item => item.hasAttribute('played')))) {return 'draw'};
            for (let i of combinations) {
                if (i.every(item => item.getAttribute('played') === 'X')) {
                return 'pl1';
                } else if (i.every(item => item.getAttribute('played') === 'O')) {
                    return 'pl2';
                }
            }
        };

        const updateScore = () => {
            (setPlayerName().player1 === 'Player X') ? 
                document.querySelector('.x').innerHTML = 
                    `X : <span>${xScore}</span>` :
                document.querySelector('.x').innerHTML = 
                    `${setPlayerName().player1}: <span>${xScore}</span>`;

            (setPlayerName().player2 === 'Player O') ? 
                document.querySelector('.o').innerHTML =
                    `O : <span>${oScore}</span>` :
                document.querySelector('.o').innerHTML =
                    `${setPlayerName().player2}: <span>${oScore}</span>`;
            
            document.querySelector('.r > span').innerText = rounds;
        }

        const replay = (e) => {
            announce.innerHTML = '';
            displayGameBoard.player = 'player1';
            displayGameBoard.gameDiv.removeAttribute('style');
            displayGameBoard.boardDivs.forEach(div => {
                div.removeAttribute('played');
                div.innerText = '';
            })
            document.querySelector('.names > h3').removeAttribute('style');
            player = setPlayerName().player1;
            announcePlayer();
            e.target.setAttribute('disabled', '');
        }

        // Event Listeners
        displayGameBoard.gameDiv.addEventListener('click', playGame);
        document.querySelector('button.replay').addEventListener('click', replay);
    })();

    // Event Listeners
    document.querySelector('button.start').addEventListener('click', startGame);
})();