const Game = (() => {
  // win combinations
  const row1 = [0, 1, 2];
  const row2 = [3, 4, 5];
  const row3 = [6, 7, 8];

  const col1 = [0, 3, 6];
  const col2 = [1, 4, 7];
  const col3 = [2, 5, 8];

  const dia1 = [0, 4, 8];
  const dia2 = [2, 4, 6];

  const winCombinations = [
    row1, row2, row3,
    col1, col2, col3,
    dia1, dia2 ];

  // game assets
  const playerMoves = [];
  const comptrMoves = [];
  const available   = [];
  const removedTiles     = [];

  // tile selection tracker
  let lastTile = -1;
  let currTile = -1;

  let playerScore = 0;
  let comptrScore = 0;

  let play = false;

  // DOM elemets
  let masks = document.querySelectorAll('.mask');
  const gameTiles = document.querySelectorAll('.tile');

  masks.forEach((mask, index) => {
    mask.addEventListener('click', () => {
      if (!play) return;

      currTile = index;

      if (currTile !== lastTile) {
        _playerMove(index);
        lastTile = currTile;
      } 
      
    });
  }, {once : true});

  //private game function methods
  const _newGame = () => {
    _resetBoard();
    play = true;
    console.log('new game');
  }

  const _resetBoard = () => {
    available.length = 0;

    for(let i = 0; i <= 8; i++ ) {
      available.push(i);
    }

    playerMoves.length = 0;
    comptrMoves.length = 0;

    lastTile = -1;
    currTile = -1;

    _resetTiles();

    removedTiles.length = 0;
  }

  const _playerMove = (tile) => {

    playerMoves.push(tile);

    _removeTileFromPlay(playerMoves[playerMoves.length-1]);
    _assignTile('player', tile);
            
    const isWinningCombo = _checkTileCombination('player', playerMoves);
    if (isWinningCombo) return;
    
    _computerPlay();
  }

  const _computerPlay = () => {
    if (available.length < 2) return;
    const cpuMove = available[Math.floor( Math.random() * available.length )];

    comptrMoves.push(cpuMove);

    _removeTileFromPlay(comptrMoves[comptrMoves.length-1]);

     setTimeout(() => {
       _assignTile('computer', cpuMove);
     }, 1000); 

    _checkTileCombination('computer', comptrMoves);
  }

  const _removeTileFromPlay = (tile) => {
    available.filter((compare, index) => {
      if (compare === tile) {
        available.splice(index, 1);
        removedTiles.push(index);
      }
    });
  }

  const _assignTile = (origin, tileNum) => {
    gameTiles[tileNum].style.backgroundColor = 'white';
    const tileContent = gameTiles[tileNum].querySelector('p');

    tileContent.textContent = 'O';
    if (origin === 'player') tileContent.textContent = 'X';

    _revealPlay(tileNum);
  }

  const _resetTiles = () => {
    if (removedTiles.length > 0) {

      masks.forEach(mask => {

        mask.style.cursor = 'pointer';
        mask.style.userSelect = 'auto';
        mask.classList.remove('dissolve-mask');

      });
    }
  }

  const _revealPlay = (position) => {
    masks[position].classList.add('dissolve-mask');
    
    setTimeout(() => {
      masks[position].style.userSelect = 'auto';
      masks[position].style.cursor = 'not-allowed';
    }, 300);
  }

  const _checkTileCombination = (origin, moveSet) => {
    if (moveSet.length < 3) return;
    
    let winSet;
    let winner = false;

    const moveSetToCompare = moveSet.sort((a, z) => a - z).join();

    winCombinations.forEach(combination => {
      if (moveSetToCompare === combination.join()) winner = true;

      let match = 0;
      
      for (number of combination) {
        
        if (moveSetToCompare.includes(number)) match++;
        if (match === 3) {
          winSet = combination;
          winner = true;
          break;
        }
      }
    });

    if (winner) _declareWinner(origin, winSet);
    return winner;
  }

  const _declareWinner = (winner, tilesToHighlight) => {

    for (tile of gameTiles) {
      tile.style.backgroundColor = 'black';

      if (tilesToHighlight.includes(Number(tile.id))) {
        tile.style.backgroundColor = 'yellow';
      }
    }

    switch(winner) {
      case 'player':
        playerScore++
        console.log( `You Win!` );
        console.log( `Your Score: ${playerScore}` );
        break;
      
      case 'computer':
        comptrScore++;
        console.log( `You Lose!` );
        console.log( `COM Score: ${comptrScore}` );
        break;
    }
    _endGame();
  }

  const _endGame = () => {
    play = false;
    console.log('end of game');

    gameTiles.forEach(tile => {
      // tile.style.backgroundColor = 'yellow';
    });

    masks.forEach(mask => {
      mask.style.userSelect = 'none';
    });
  }

  const _handleScore = () => {
  }

  return {
    begin: () => {
      _newGame();
    }
  }

})();

const tictactoe = Game;

const newGameBtn = document.querySelector('.js-new-game-btn');
newGameBtn.addEventListener('click', () => {
  // newGameBtn.textContent = 'Reset Game';
  tictactoe.begin();
});
