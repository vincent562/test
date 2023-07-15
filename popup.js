// On récupère les éléments du document
let word = document.getElementById("word");
let form = document.getElementById("form");
let speed = document.getElementById("speed");
let submit = document.getElementById("submit");

// On initialise une variable qui indique si le tachistoscope est en cours ou pas
let running = false;

// On ajoute un écouteur sur l'événement submit du formulaire
form.addEventListener("submit", (event) => {
  // On empêche le comportement par défaut du formulaire
  event.preventDefault();
  // On vérifie si le tachistoscope est en cours ou pas
  if (running) {
    // Si il est en cours, on envoie un message au background pour l'arrêter
    chrome.runtime.sendMessage({stop: true});
    // On change la valeur du bouton submit
    submit.value = "Démarrer";
    // On change la valeur de la variable running
    running = false;
  } else {
    // Si il n'est pas en cours, on envoie un message au background avec la vitesse saisie
    chrome.runtime.sendMessage({speed: speed.value});
    // On change la valeur du bouton submit
    submit.value = "Arrêter";
    // On change la valeur de la variable running
    running = true;
  }
});

// On ajoute un écouteur sur l'événement input du input speed
speed.addEventListener("input", (event) => {
  // On envoie un message au background avec la nouvelle vitesse saisie
  chrome.runtime.sendMessage({speed: speed.value});
});

// On ajoute un écouteur qui reçoit les messages du background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // On vérifie si le message contient le mot à afficher
  if (message.word) {
    // On affiche le mot dans l'élément word
    word.textContent = message.word;
  }
  // On vérifie si le message signale la fin du texte
  if (message.end) {
    // On change la valeur du bouton submit
    submit.value = "Démarrer";
    // On change la valeur de la variable running
    running = false;
  }
});
