// 1. Déclaration des vrais sons de l'univers de Naruto !
const sonClic = new Audio("clic.mp3");
const sonPermut = new Audio("pouf.mp3");
const sonVictoire = new Audio("https://www.myinstants.com/media/sounds/rasengan_2.mp3");

// On baisse un tout petit peu le volume du Rasengan pour ne pas exploser les oreilles
sonVictoire.volume = 0.5; 

const ecran = document.getElementById('ecran');

// 2. La fonction magique pour jouer les sons
function faireBruitage(type) {
    if (type === 'clic') {
        sonClic.currentTime = 0; // Permet de rejouer le son rapidement même si on clique vite
        sonClic.play().catch(e => console.log("Chrome bloque le son, clique sur la page d'abord !"));
    } else if (type === 'permut') {
        sonPermut.currentTime = 0;
        sonPermut.play().catch(e => console.log("Erreur son"));
    } else if (type === 'victoire') {
        sonVictoire.currentTime = 0;
        sonVictoire.play().catch(e => console.log("Erreur son"));
    }
}

// 3. Les fonctions de la calculatrice
function ajouter(valeur) {
    faireBruitage('clic'); // 🔊 Lance le bruit de Shuriken
    if (ecran.value === "ERREUR" || ecran.value === "Ø") {
        nettoyer();
    }
    ecran.value += valeur;
}

function nettoyer() {
    faireBruitage('permut'); // 🔊 Lance le "Pouf" de fumée
    ecran.value = '';
}

function calculer() {
    try {
        let calcul = ecran.value;
        calcul = calcul.replace(/÷/g, '/');
        calcul = calcul.replace(/x/g, '*');

        let resultat = eval(calcul);

        if (!isFinite(resultat)) {
            ecran.value = "Ø";
        } else {
            // 🎹 Fabrication de la fanfare de victoire en code pure !
            const contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
            
            // Notes de la fanfare : Do (261Hz), Mi (329Hz), Sol (392Hz), Do supérieur (523Hz)
            const notes = [261.63, 329.63, 392.00, 523.25];
            const rythmes = [0, 0.15, 0.30, 0.45]; // Décalage pour chaque note
            
            notes.forEach((frequence, index) => {
                const oscillateur = contexteAudio.createOscillator();
                const noeudGain = contexteAudio.createGain();
                
                oscillateur.type = 'triangle'; // Style rétro 8-bit très sympa
                oscillateur.frequency.value = frequence;
                
                // Gestion du volume pour que le son s'arrête proprement
                noeudGain.gain.setValueAtTime(0.2, contexteAudio.currentTime + rythmes[index]);
                noeudGain.gain.exponentialRampToValueAtTime(0.001, contexteAudio.currentTime + rythmes[index] + 0.4);
                
                oscillateur.connect(noeudGain);
                noeudGain.connect(contexteAudio.destination);
                
                oscillateur.start(contexteAudio.currentTime + rythmes[index]);
                oscillateur.stop(contexteAudio.currentTime + rythmes[index] + 0.4);
            });

            ecran.value = resultat;
        }
    } catch (error) {
        ecran.value = "ERREUR";
    }
}// 🌓 Mode Akatsuki
function changerMode() {
    faireBruitage('permut');
    document.body.classList.toggle('mode-akatsuki');
}

// ⌨️ Écouteur du clavier
document.addEventListener('keydown', function(evenement) {
    const touche = evenement.key;
    if (touche >= '0' && touche <= '9') ajouter(touche);
    else if (touche === '+') ajouter('+');
    else if (touche === '-') ajouter('-');
    else if (touche === '*') ajouter('x');
    else if (touche === '/') ajouter('÷');
    else if (touche === 'Enter') {
        evenement.preventDefault();
        calculer();
    }
    else if (touche === 'Backspace') nettoyer();
});