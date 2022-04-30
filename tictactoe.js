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
  const playerMoves  = [];
  const comptrMoves  = [];
  const available    = [];
  const removedTiles = [];

  // tile selection tracker
  let lastTile = -1;
  let currTile = -1;

  let winSet;
  let playerScore = 0;
  let comptrScore = 0;

  let play = false;
  let gameNumber = 3;

  let hasComPlayed = true;

  // DOM elemets
  const masks = document.querySelectorAll('.mask');
  const gameTiles = document.querySelectorAll('.tile');

  const title = document.querySelector('h1');

  const displayContainer = document.querySelector('.winner');
  const announcement = displayContainer.querySelector('p');

  // new game animation
  const _initTiles = () => {
    gameTiles.forEach((tile, index) => {

      masks[index].style.userSelect = 'none';
      if (index <= 2) tile.style.transform = 'translate(0px, 260px)';
      if (index >= 3 && index < 6) tile.style.transform = 'translate(0px, 130px)';

    });    
  }

  _initTiles();
  
  const scoreBoard = document.querySelector('.score');
  scoreBoard.style.transform = 'translate(0, 120px)';

  masks.forEach((mask, index) => {
    mask.addEventListener('click', () => {
      if (!play) return;

      if (hasComPlayed) currTile = index;

      if (currTile !== lastTile && available.includes(index)) {
        hasComPlayed = false;
        _playerMove(index);
        lastTile = currTile;
      } 
    });
  });

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

    _introAnimation();
    _resetTiles();

    removedTiles.length = 0;
    hasComPlayed = true;
  }

  const _introAnimation = () => {
    displayContainer.style.zIndex = 1;
    announcement.style.color = 'transparent';

    title.style.color = 'transparent';
    scoreBoard.style.transform = 'translate(0, 0)';

  }

  const _playerMove = (tile) => {

    playerMoves.push(tile);

    _removeTileFromPlay(playerMoves[playerMoves.length-1]);
    _assignTile('player', tile);
            
    const isWinningCombo = _checkTileCombination(playerMoves);
    if (isWinningCombo) return _declareWinner('player', playerMoves);
    
    _computerPlay();

    if (available.length === 0) {

      gameNumber--;
      _gameTracker('draw');

    }
  }

  const _computerPlay = () => {
    if (available.length < 2) return;
   
    const cpuMove = _generatePlay();

    comptrMoves.push(cpuMove);

    _removeTileFromPlay(comptrMoves[comptrMoves.length-1]);

     setTimeout(() => {

       _assignTile('computer', cpuMove);

       if (_checkTileCombination(comptrMoves)) _declareWinner('computer', comptrMoves);
       hasComPlayed = true;

     }, 1000); 
  }

  const _generatePlay = () => {
    const tilesToConsider = [];
    const tileSetsToConsider = [];

    const comptrMovesCopy = comptrMoves.slice(0);
    const sortPlayerMoves = playerMoves.sort((a, z) => a - z);
    const sortComptrMoves = comptrMoves.sort((a, z) => a - z);

    // consider any winCombinations if moveSet matches any two tiles
    winCombinations.forEach(combination => {
      let accumulator = 0;

      let moves = sortPlayerMoves;
      if (sortComptrMoves.length >= 2 && !_checkTileCombination(playerMoves)) moves = sortComptrMoves;

      for (move of moves) {
        if (combination.includes(move)) accumulator++;

        if (accumulator === 2) {
          tileSetsToConsider.push(combination);
          break;
        }
      }
    });

    // flatten winCombo arrays to one long list
    const oneDimesionalTiles = tileSetsToConsider.flat();

    // if potential move is available add it to final consideration list
    for (tile of oneDimesionalTiles) {
      if (available.includes(tile)) tilesToConsider.push(tile);
    }

    // default for second computer play
    let tileToPlay = tilesToConsider[ Math.floor ( Math.random() * tilesToConsider.length ) ];

    if (comptrMoves.length >= 2) {
      for ( tile of tilesToConsider ) {

        // add potential tile choice to end of already played computer move list
        comptrMovesCopy.push(tile);

        // test if above could win game // break loop if true
        if ( _checkTileCombination(comptrMovesCopy) ) {
          tileToPlay = tile;
          comptrMovesCopy.length = 0;
          break;
        } 

        // remove potenital tile from list - not a winCombo - ready for next tile
        comptrMovesCopy.pop();

      };
    }

    // default first computer play - comptrMoves [] is always empty on first play
    if (tileToPlay === undefined) tileToPlay = available[Math.floor( Math.random() * available.length )];

    //console.log(tileToPlay);
    return tileToPlay;
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

      masks.forEach((mask, index) => {

        mask.style.cursor = 'pointer';
        mask.style.userSelect = 'auto';
        mask.classList.remove('dissolve-mask');

        gameTiles[index].style.color = 'black';
        //gameTiles[index].style.border = '0.1rem solid black';
      });
    }

    if (gameNumber === 0) return;

    let delayTimer = 600;

    gameTiles.forEach(tile => {

      setTimeout(() => {
        tile.style.transform = 'translate(0, 0)';
      }, delayTimer);
      
      delayTimer+=300;
    });
  }

  const _revealPlay = (position) => {
    masks[position].classList.add('dissolve-mask');
    
    setTimeout(() => {

      masks[position].style.userSelect = 'auto';
      masks[position].style.cursor = 'not-allowed';

    }, 300);
  }

  const _checkTileCombination = (moveSet) => {
    if (moveSet.length < 3) return;
    
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

    // console.log(`Winning Set: ${winSet}`);
    return winner;
  }

  const _declareWinner = (winner) => {
    _updateScore(winner);

    for (tile of gameTiles) {
    
      if (winSet.includes(+tile.id)) {
        tile.style.backgroundColor = 'white';
        //tile.style.border = '0.5rem dashed transparent';
      }

      else {
        tile.style.color   = 'aqua';
        //tile.style.border  = 'none';
        tile.style.backgroundColor = 'pink';
      }
    }

    gameNumber--;
    _gameTracker();
  }

  const _updateScore = (recipient) => {
    let pointTo;
    let selector;

    switch(recipient) {
      case 'player':
        playerScore++;
        pointTo = playerScore;
        selector = '.you';

        console.log( `You Win!` );
        console.log( `Your Score: ${playerScore}` );
        break;

      case 'computer':
        comptrScore++;
        pointTo = comptrScore;
        selector = '.com';

        console.log( `You Lose!` );
        console.log( `COM Score: ${comptrScore}` );
        break;
    }

    const getPoints = document.querySelectorAll(`${selector}`);

    setTimeout(() => {
      for(let i = 0; i < pointTo; i++) {
        getPoints[i].classList.remove('fa-circle');
        getPoints[i].classList.add('fa-check-circle');
      }
    }, 2000);

  }

  const _gameTracker = (outcome = '') => {
    if (outcome !== '') console.log('draw game');

    gameNumber !== 0 
    ? setTimeout(_newGame, 2500)
    : setTimeout(_endGame, 2500);
  }

  const _endGame = () => {
    play = false;
    console.log('end of game');

    masks.forEach(mask => {
      mask.style.userSelect = 'none';
    });
    _resetTiles();
    _initTiles();

    announcement.textContent = 'Draw Game!';
    
    if (playerScore > comptrScore) {
      announcement.textContent = 'You Won!';
    }
    if (comptrScore > playerScore) {
      announcement.textContent = 'You Lost!';
    }

    announcement.style.color = 'black';
    displayContainer.appendChild(announcement);

    displayContainer.style.zIndex = 4;

    newGameBtn.style.width = '10ch';
    newGameBtn.style.color = 'black';
    newGameBtn.style.border = '0.1rem dashed rgb(0, 0, 0)';
  }

  const _resetPoints = () => {

    gameNumber = 3;    
    playerScore = 0;
    comptrScore = 0;
  }

  const _resetScoreBoard = () => {
    const points = document.querySelectorAll('.point')
    points.forEach(point => {
      point.classList.remove('fa-check-circle');
      point.classList.add('fa-circle');
    });  
  }

  const _getGameNumber = () => { 
    return gameNumber; 
  }

  const _getPlayerScore = () => {
    return playerScore;
  }

  return {
    gamesLeft: () => {
      return _getGameNumber() !== 0 ? true : _resetScoreBoard();
    },

    newPlayer: (name) => {

      const score = () => {
        return _getPlayerScore();
      }

      const newGame = () => {
        _resetPoints();
        _newGame();
      }

      return { name, score, newGame }
    }
  }

})();

const tictactoe = Game;
const newPlayer = tictactoe.newPlayer('user');
//console.log(newPlayer.name);

const newGameBtn = document.querySelector('.js-new-game-btn');

newGameBtn.addEventListener('click', () => {
  newGameBtn.style.color = 'transparent';

  setTimeout(() => {
    newGameBtn.style.width = 0;
    newGameBtn.style.border = 'none';

    newPlayer.newGame();
  }, 600)

  tictactoe.gamesLeft();
}); 



