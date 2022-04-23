const Game = (() => {
  let availableTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const masks = document.querySelectorAll('.mask');
  const gameTiles = document.querySelectorAll('.tile');

  masks.forEach((mask, index) => {
    mask.addEventListener('click', () => {
      mask.classList.toggle('dissolve-mask');

      setTimeout(() => {
        mask.remove();
      }, 300); 

      _assignTile('player', index);
    });
  });

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

    _updateAvailableTiles(tileNum);
  }

  const _updateAvailableTiles = number => {
    number-=1;

    availableTiles.splice(number, 1, '/');
    console.table(availableTiles);
  }

})();