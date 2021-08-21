//****************************************************************************
// Debugging helpers

// Greeting from StackOverflow :-)
const varToString = varObj => Object.keys(varObj)[0];

const DEBUG = true;
function debugVar(expr) {
    if (!DEBUG) return;
    console.log(varToString(expr) + ": ", eval(expr));
}
function debugLog(...expr) {
    if (!DEBUG) return;
    let text = "";
    expr.forEach(s => text = text.concat(s, " "));
    console.log(text);
}


//********************************************************************************************
// all elements used in JS at one place
let divGameCustom = document.getElementById("divGameCustom");
let divGameActive = document.getElementById("divGameActive");
let divGamePlay = document.getElementById("divGamePlay");
let divGameHints = document.getElementById("divGameHints");

//------------------------------ game setup elements -----------------------------------
let radioCustom = document.getElementById("radioCustom");
let lblCustomTries = document.getElementById("lblCustomTries");
let numCustomTries = document.getElementById("numCustomTries");
let numCustomMaximum = document.getElementById("numCustomMaximum");

//------------------------------ game play elements ------------------------------------
let lblGameProgress = document.getElementById("lblGameProgress");
let numGuess = document.getElementById("numGuess");


//********************************************************************************************
// consts / variables required for the game
const defaultMaximum = 100; // the default maximum number to guess
let maxNumber = 0; // the maximum number to guess
let triesMaximum = 0; // the maximum number to tries
let triesCount = 0; // the current number of tries
let numberToGuess = 0; // the random number the player has to guess


//********************************************************************************************
// function initialize(): initialize the user interface
initialize();
function initialize() {

    radioCustomChecked();


}


//********************************************************************************************
// function startGame(): initialize the gameplay
//  -   reset number of tries
//  -   get the maximum number of tries
//  -   "calculate" a random number between 1 and maxValue
//  -   hide the game setup UI and show the game UI
function startGame() {

    // reset number of tries, ...
    triesCount = 0;

    // ... get the maximum number of tries...
    triesMaximum = getNumberofTries();

    // ... and get the maximum number to guess
    maxNumber = getMaximumNumber();

    // generate a random number between 1 and maxValue
    numberToGuess = getRandomNumber(maxNumber);

    // show the game interface and let the game start


    // hide the game setup and show the game play section
    divGameSetup.classList.add("hidden");
    divGameSetup.classList.remove("grid");

    divGameActive.classList.toggle("hidden");

    divGamePlay.classList.remove("hidden");
    divGamePlay.classList.add("grid");

    divGameHints.classList.toggle("hidden");

    divGameHints.innerHTML = "";
    numGuess.value = "";

    showGameProgress();
}


//********************************************************************************************
// function endGame(): the game has ended, show the game setup user interface
async function endGame() {

    // short break before we continue...
    await Sleep(5000);

    // hide the game play section and show the game setup
    divGameSetup.classList.remove("hidden");
    divGameSetup.classList.add("grid");

    divGameActive.classList.toggle("hidden");

    divGamePlay.classList.add("hidden");
    divGamePlay.classList.remove("grid");

    divGameHints.classList.toggle("hidden");
}


//********************************************************************************************
// if the radio button for custom setup was checked, hide the label and show the input boxes
// otherwise show the label and hide the input boxes...
function radioCustomChecked() {

    divGameCustom.style.display = (radioCustom.checked ? "grid" : "none");
}


//********************************************************************************************
// function getNumberofTries(): when the game starts get the number of tries
// Either one of the radio buttons "4" to "6" is checked, or the player has chosen the custom
// option. In this case get the number of tries from input...
function getNumberofTries() {

    let tries = -1;

    tries = getTries("radioTries4", 4, tries);
    tries = getTries("radioTries5", 5, tries);
    tries = getTries("radioTries6", 6, tries);
    tries = getTries("radioCustom", numCustomTries.value, tries);

    return tries;

    // internal function
    function getTries(id, value, defaultValue) {
        return (document.getElementById(id).checked ? value : defaultValue);
    }
}


//********************************************************************************************
// function getMaximumNumber(): get the maximum number to guess. 
// Called when the game starts. If radioCustom is checked get the maximum number to guess
// from input...
function getMaximumNumber() {

    return (radioCustom.checked ? numCustomMaximum.value : defaultMaximum);
}


//********************************************************************************************
// function getRandomNumber(maximum): Get the random number to guess. 
// Called when the game starts.
function getRandomNumber(maximum) {

    return Math.floor(Math.random() * maximum) + 1;
}


//********************************************************************************************
// function getRandomNumber(maximum): Get the random number to guess. 
// Called when the game starts.
function showGameProgress() {
    lblGameProgress.innerHTML = `Try ${triesCount + 1} of ${triesMaximum}`;
}


//********************************************************************************************
// function guessNumber(): the player has entered number
// 3 possible options for ending the game:
//  -   option 1: player has guessed the number
//  -   option 2: maximum number of tries has been reached
//  -   option 3: player gives up
function guessNumber() {

    // check if the number the player entered is with the range from 1 to maxNumber


    // increase the number of tries
    triesCount++;

    debugVar({ numberToGuess });
    debugLog("numGuess =", numGuess.value)

    // use Math.sign() to compare the number the player entered 
    // gameResult = 0:  numbers are equal
    // gameResult = 1:  secret number is greater than user input
    // gameResult = -1: secret number is lower than user input
    let gameResult = Math.sign(numberToGuess - numGuess.value);
    if (gameResult == 0) {
        showPlayerWon();
    } else {
        let str = gameResult > 0 ? "greater" : "lower";
        showHint(`The secret number is ${str} than ${numGuess.value}!`);
        showGameProgress();
    }

    // number of tries has been reached
    if ((triesCount == triesMaximum) && (gameResult != 0)) {
        showPlayerLost();
    }
}


//********************************************************************************************
async function showPlayerWon() {

    showHint(`You hit the number within ${triesCount} ${triesCount > 1 ? 'tries' : 'try'}!`, "h2");
    showHint('You won!!!', "h1");

    // short break before we continue...
    await Sleep(5000);

    // finally call endGame() to show the start screen
    endGame();
};


//********************************************************************************************
function showPlayerLost() {

    showHint(`You didn't guess the number within ${triesMaximum} tries!`, "h2");
    showHint('You lost!!!', "h1");

    // finally call endGame() to show the start screen
    endGame();
};

//********************************************************************************************
// function surrender(): the player surrenders: game stopped, show the game setup user interface
async function playerSurrenders() {

    showHint('You give up?', "");
    await Sleep(2000);
    showHint("LOSER!!!", "h1");

    // finally call endGame() to show the start screen
    endGame();
}

//********************************************************************************************
// function showHint(text, tag = "p"): display text in the game hint area, use tag to 
function showHint(text, tag = "p") {
    if (tag.length == 0) {
        tag = "p";
    }
    divGameHints.innerHTML = `<${tag}>${text}</${tag}>` + divGameHints.innerHTML

}

//********************************************************************************************
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
