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

let radioCustom = document.getElementById("radioCustom");
let lblCustomTries = document.getElementById("lblCustomTries");

let numCustomTries = document.getElementById("numCustomTries");
let numCustomMaximum = document.getElementById("numCustomMaximum");
let numGuess = document.getElementById("numGuess");


//********************************************************************************************
// /consts/variables required for the game
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
}


//********************************************************************************************
// function endGame(): the game has ended, show the game setup user interface
function endGame() {

    // hide the game play section and show the game setup
    divGameSetup.classList.remove("hidden");
    divGameSetup.classList.add("grid");

    divGameActive.classList.toggle("hidden");

    divGamePlay.classList.add("hidden");
    divGamePlay.classList.remove("grid");

    divGameHints.classList.toggle("hidden");
}


//********************************************************************************************
// function surrender(): the player surrenders: game stopped, show the game setup user interface
function surrender() {


    // finally call endGame() to show the start screen
    endGame();
}


//********************************************************************************************
// if the radio button for custom setup was checked, hide the label and show the input boxes
// otherwise show the label and hide the input boxes...
function radioCustomChecked() {

    //divGameCustom.style.display = (radioCustom.checked ? "grid" : "none");
    debugLog(radioCustom.checked);

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
    let gameResult = Math.sign(numGuess.value - numberToGuess);

    switch (gameResult) {
        case 0: //player has guessed the number
            showPlayerWon();
            break;
        case -1: // player's number ist lower than the number to guess
            showHintGreater(numGuess.value);
            break;
        case 1: // player's number ist greater than the number to guess
            showHintLower(numGuess.value);
            break;
    }

    // number of tries has been reached
    if ((triesCount == triesMaximum) && (gameResult != 0)) {
        showPlayerLost();
    }
}


//********************************************************************************************
function showPlayerWon() {
    showHint(`<h2>You hit the number!</h2>`);
    alert(`You hit the number!`);
    //endGame();

};
function showPlayerLost() {
    showHint(`You didn't guess the number within ${triesMaximum} tries!`);
    alert(`You didn't guess the number within ${triesMaximum} tries!`);
    endGame();
};



function showHintLower(number) {
    showHint(`The secret number is lower than ${number}`);
};


function showHintGreater(number) {
    showHint(`The secret number is greater than ${number}`);
};

//********************************************************************************************
function showHint(text) {
    divGameHints.innerHTML = `<p>${text}</p>` + divGameHints.innerHTML
}
