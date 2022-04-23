const Game = (() => {
  let availableTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let unavailableTiles = [];

  let playTracker = availableTiles.slice(0);

  const masks = document.querySelectorAll('.mask');
  const gameTiles = document.querySelectorAll('.tile');

  masks.forEach((mask, index) => {
    mask.addEventListener('click', () => {
      // mask.classList.add('dissolve-mask');

      // setTimeout(() => {
      //   mask.remove();
      // }, 300);

      _assignTile('player', index);
      _comPlay();
    });
  });

  const _revealPlay = (position) => {
    masks[position].classList.add('dissolve-mask');
    
    setTimeout(() => {
      masks[position].remove();
    }, 300);    
  }

  const _assignTile = (origin, tileNum) => {
    let tileContent = gameTiles[tileNum].querySelector('p')

    console.dir(gameTiles[tileNum]);
    console.dir(tileContent);

    if (origin === 'player') {
      tileContent.textContent = 'X';
    }
    else {
      tileContent.textContent = 'O';
    }
    
    gameTiles[tileNum].appendChild(tileContent);

    _revealPlay(tileNum);
    _updateAvailableTiles(tileNum, tileContent.textContent);
  }

  const _updateAvailableTiles = (number, play) => {
    unavailableTiles.push(number+1);

    availableTiles.splice(number, 1, '/');
    playTracker.splice(number, 1, play);
    
    console.table(availableTiles);
    console.table(unavailableTiles);
    console.table(playTracker);
  }

  const _checkAvailableTiles = () => {
    unavailableTiles.forEach(unavailableTile => {
      return unavailableTile;
    });
  }

  const _getRandomPlay = () => {
    let count = 0;
    let random = '/';
    let lastPosition;

    availableTiles.forEach((tile, index) => {
      if (typeof tile === 'number') lastPosition = index;
      if (tile === '/') count++;
    });

    while (random === '/') {
      random = availableTiles[ Math.floor( Math.random() * availableTiles.length )];
      
      if (count === availableTiles.length && random === '/') {
        return lastPosition;
      };
    }

    return random;
  }

  const _comPlay = () => {
    if (unavailableTiles.length === 9) return;

    setTimeout(() => {
      _assignTile('computer', _getRandomPlay()-1);
    }, 1000);   
  }

})();