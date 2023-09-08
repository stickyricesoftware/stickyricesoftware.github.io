let PLAYER_ONE_SCORE = 6
let PLAYER_TWO_SCORE = 2

let a = 0;
const score1 = document.getElementById('score1');
const intervala = setInterval(() => {
  if (a++ < PLAYER_ONE_SCORE) {
    return score1.click();
  }
  clearInterval(intervala);
}, 200);

score1.addEventListener('click', () => score1.innerHTML = a);

let b = 0;
const score2 = document.getElementById('score2');
const intervalb = setInterval(() => {
  if (b++ < PLAYER_TWO_SCORE) {
    return score2.click();
  }
  clearInterval(intervalb);
}, 200);

score2.addEventListener('click', () => score2.innerHTML = b);

