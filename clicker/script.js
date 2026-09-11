let score = 0;
let clickPower = 1;
let autoClickerRate = 0;
let multiplier = 1;

let autoClickerInterval = null;

// DOM elemendid
const scoreDisplay = document.getElementById("score");
const gertenImg = document.getElementById("gerten");
const clickPowerDisplay = document.getElementById("clickPower").querySelector("span");
const autoClickerRateDisplay = document.getElementById("autoClickerRate").querySelector("span");
const multiplierLevelDisplay = document.getElementById("multiplierLevel").querySelector("span");

// Gerteni pildile klõps
gertenImg.addEventListener("click", function() {
    addScore(clickPower * multiplier);
});

// Skoori lisamine
function addScore(points) {
    score += points;
    updateScoreDisplay();
}

// Skoori uuendamine HTML-is
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// Uuenda värskendatud andmeid
function updateShopDisplay() {
    clickPowerDisplay.textContent = clickPower;
    autoClickerRateDisplay.textContent = autoClickerRate > 0 ? (autoClickerRate + " sekundit") : "Pole aktiveeritud";
    multiplierLevelDisplay.textContent = multiplier + "x";
}

// Upgrade kliki tugevuse nupp
document.getElementById("upgrade-click").addEventListener("click", function() {
    if (score >= 100) {
        score -= 100;
        clickPower++;
        updateScoreDisplay();
        updateShopDisplay();
    } else {
        alert("Pole piisavalt punkte!");
    }
});

// Automaatklõpsaja nupp
document.getElementById("auto-clicker").addEventListener("click", function() {
    if (score >= 500) {
        score -= 500;
        autoClickerRate = 2;
        activateAutoClicker();
        updateScoreDisplay();
        updateShopDisplay();
    } else {
        alert("Pole piisavalt punkte!");
    }
});

// Automaatklõpsaja käivitamine
function activateAutoClicker() {
    if (autoClickerInterval === null && autoClickerRate > 0) {
        autoClickerInterval = setInterval(function() {
            addScore(clickPower * multiplier);
        }, autoClickerRate * 1000);
    }
}

// Kordaja nupp
document.getElementById("multiplier").addEventListener("click", function() {
    if (score >= 1000) {
        score -= 1000;
        multiplier++;
        updateScoreDisplay();
        updateShopDisplay();
    } else {
        alert("Pole piisavalt punkte!");
    }
});

// Funktsioon automaatklõpsaja peatamiseks
function stopAutoClicker() {
    if (autoClickerInterval !== null) {
        clearInterval(autoClickerInterval);
        autoClickerInterval = null;
    }
}

// Skoori lähtestamine
function resetGame() {
    score = 0;
    clickPower = 1;
    autoClickerRate = 0;
    multiplier = 1;
    stopAutoClicker();
    updateScoreDisplay();
    updateShopDisplay();
}

// Lehe laadimisel uuenda andmed
updateShopDisplay();
