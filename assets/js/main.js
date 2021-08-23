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
let gameCustom = document.getElementById("gameCustom");
let gameActive = document.getElementById("gameActive");
let gamePlay = document.getElementById("gamePlay");
let gameMessages = document.getElementById("gameMessages");

//------------------------------ game setup elements -----------------------------------
let radioCustom = document.getElementById("radioCustom");
let lblCustomTries = document.getElementById("lblCustomTries");
let numCustomTries = document.getElementById("numCustomTries");
let numCustomMaximum = document.getElementById("numCustomMaximum");

//------------------------------ game play elements ------------------------------------
let lblGameProgress = document.getElementById("lblGameProgress");
let lblMaxNumber = document.getElementById("lblMaxNumber");

let numGuess = document.getElementById("numGuess");
let btnGuess = document.getElementById("btnGuess");


//********************************************************************************************
// consts / variables required for the game
const defaultMaximum = 100; // the default maximum number to guess
let maxNumber = 0; // the maximum number to guess
let triesMaximum = 0; // the maximum number to tries
let triesCount = 0; // the current number of tries
let numberToGuess = 0; // the random number the player has to guess


//********************************************************************************************
// call to radioCustomChecked() to setup the display style for custom game setup
radioCustomChecked();


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

    // set the maximum value for the input number field
    numGuess.max = maxNumber;

    // generate a random number between 1 and maxValue
    numberToGuess = getRandomNumber(maxNumber);

    // hide the game setup and show the game play section
    showHideElement(gameSetup, "grid", false);
    showHideElement(gamePlay, "block", true);

    // let the game start
    showGameProgress();
    numGuess.disabled = btnGuess.disabled = false;

    lblMaxNumber.innerHTML = maxNumber;

    gameMessages.innerHTML = "";
    numGuess.value = "";
    numGuess.focus();
}


//********************************************************************************************
// function endGame(): the game has ended, show the game setup user interface
async function endGame() {

    // disable input field and guess button
    numGuess.disabled = btnGuess.disabled = true;

    // short break before we continue...
    await sleep(8000);

    // hide the game play section and show the game setup
    showHideElement(gameSetup, "grid", true);
    showHideElement(gamePlay, "block", false);
}

// function showHideElement(element, display, showElement):
//      element: the element to hide or show
//      display: the default display style for the element
//      showElement: if true the element is visible, if false it's collapsed
function showHideElement(element, display, showElement) {
    if (showElement) {
        element.classList.remove("collapsed");
        element.classList.add(display);
    } else {
        element.classList.add("collapsed");
        element.classList.remove(display);
    }
}


//********************************************************************************************
// if the radio button for custom setup was checked, hide the label and show the input boxes
// otherwise show the label and hide the input boxes...
function radioCustomChecked() {

    gameCustom.style.display = (radioCustom.checked ? "grid" : "none");
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
// function checkNumber(): the player has entered a number
// 3 possible options for ending the game:
//  -   option 1: player has guessed the number
//  -   option 2: maximum number of tries has been reached
//  -   option 3: player gives up
function checkNumber() {

    // get the player's number
    let userNumber = Number("0" + numGuess.value);

    // check if the number the player entered is with the range from 1 to maxNumber
    if (userNumber < 1 || userNumber > maxNumber) {
        showHint("Invalid number entered", "p")
        return;
    }

    // increase the number of tries
    triesCount++;

    debugLog("userNumber =", userNumber);

    // use Math.sign() to compare the number the player entered 
    // gameResult = 0:  numbers are equal
    // gameResult = 1:  secret number is greater than user input
    // gameResult = -1: secret number is lower than user input
    let gameResult = Math.sign(numberToGuess - userNumber);
    if (gameResult == 0) {
        showPlayerWon();
    } else {
        let str = gameResult > 0 ? "greater" : "lower";
        showHint(`The secret number is ${str} than ${userNumber}!`);
        showGameProgress();
    }

    // max number of tries has been reached
    if ((triesCount == triesMaximum) && (gameResult != 0)) {
        showPlayerLost();
    }

    // set focus on number field
    numGuess.value = "";
    numGuess.focus();
}


//********************************************************************************************
// function showPlayerWon(): the player hit the secret number, so he has won...
function showPlayerWon() {

    showHint(`You hit the number within ${triesCount} ${triesCount > 1 ? 'tries' : 'try'}!`, "h2");
    showHint('You won!!!', "h1");

    // finally call endGame() to show the start screen
    endGame();
};


//********************************************************************************************
// function showPlayerLost(): the player wasn't able to guess  the secret number, which means:
// HE LOST!!!
function showPlayerLost() {

    showHint(`You didn't guess the number within ${triesMaximum} tries!`, "h2");
    showHint('You lost!!!', "h1");

    // finally call endGame() to show the start screen
    endGame();
};


//********************************************************************************************
// function surrender(): the player surrenders: game stopped, show the game setup user interface
async function playerSurrenders() {

    showHint('You give up? Really?', "");
    await sleep(2000);
    showHint("LOSER!!!", "h1");

    // finally call endGame() to show the start screen
    endGame();
}


//********************************************************************************************
// function showHint(text, tag = "p"): display text in the game hint area, use elementType to
// use a special element. default is '<p>'
function showHint(text, elementType = "p") {

    if (elementType.length == 0) {
        elementType = "p";
    }

    gameMessages.innerHTML = `<${elementType}>${text}</${elementType}>` + gameMessages.innerHTML
}


//********************************************************************************************
// function sleep(milliseconds): suspend execution of the javascript code for the given time
// Important: this function has to be called using await, otherwise the excution of the code
//            continues immediately. If this function is called within another function use 
//            async for the calling function!
// Sample: 
// async function callingFunction() {
//     console.log('before sleep()');
//     await sleep(5000);
//     console.log('after sleep()');
// }
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
