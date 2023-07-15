// Un objet qui stocke les paramètres du tachistoscope
let tachistoscope = {
  // Le texte à afficher
  text: "",
  // La vitesse d'affichage en millisecondes
  speed: 1000,
  // L'index du mot courant
  index: 0,
  // L'identifiant du timer
  timer: null,
  // La fonction qui démarre le tachistoscope
  start: function() {
    // On vérifie si le texte n'est pas vide
    if (this.text) {
      // On annule le timer précédent si il existe
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // On initialise l'index à zéro
      this.index = 0;
      // On appelle la fonction qui affiche le mot suivant
      this.next();
    }
  },
  // La fonction qui affiche le mot suivant
  next: function() {
    // On récupère le tableau des mots du texte
    let words = this.text.split(" ");
    // On vérifie si l'index est dans les limites du tableau
    if (this.index < words.length) {
      // On récupère le mot à afficher
      let word = words[this.index];
      // On envoie un message au popup pour afficher le mot
      this.sendMessage({word: word});
      // On incrémente l'index
      this.index++;
      // On crée un nouveau timer pour appeler la fonction suivante
      this.timer = setTimeout(() => this.next(), this.speed);
    } else {
      // On envoie un message au popup pour signaler la fin du texte
      this.sendMessage({end: true});
    }
  },
  // La fonction qui arrête le tachistoscope
  stop: function() {
    // On annule le timer si il existe
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // On envoie un message au popup pour effacer le mot affiché
    this.sendMessage({word: ""});
  },
  // La fonction qui envoie un message au popup
  sendMessage: function(message) {
    // On récupère les vues de l'extension
    let views = chrome.runtime.getViews();
    // On filtre les vues par leur type et leur URL
    let popup = views.find(view => view.location.pathname === "/popup.html");
    // On vérifie si le popup existe
    if (popup) {
      // On envoie un message au popup avec la méthode chrome.runtime.sendMessage
      popup.chrome.runtime.sendMessage(message);
    }
  }
};

// Un écouteur qui reçoit les messages du popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // On vérifie si le message contient la vitesse à régler
  if (message.speed) {
    // On stocke la vitesse dans l'objet tachistoscope
    tachistoscope.speed = message.speed;
    // On redémarre le tachistoscope si il était en cours
    if (tachistoscope.timer) {
      tachistoscope.start();
    }
  }
  // On vérifie si le message demande d'arrêter le tachistoscope
  if (message.stop) {
    // On arrête le tachistoscope
    tachistoscope.stop();
  }
});

// Un écouteur qui reçoit les messages du menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // On vérifie si l'id du menu cliqué est "read"
  if (info.menuItemId === "read") {
    // On récupère le texte sélectionné par la souris
    let selectedText = info.selectionText;
    // On stocke le texte dans l'objet tachistoscope
    tachistoscope.text = selectedText;
    // On démarre le tachistoscope
    tachistoscope.start();
  }
});

// Un menu contextuel avec l'id "read", le titre "Lire le texte sélectionné", et le type "normal"
chrome.contextMenus.create({
  id: "read",
  title: "Lire le texte sélectionné",
  type: "normal"
});
