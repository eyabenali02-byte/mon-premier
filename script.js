/* ============ MES COURS ============ */
const mesCours = [
    { titre: "Nom du cours", matiereNom: "Matière", description: "", chapitres: [{ titre: "", fichier: "" }] },
    { titre: "Mathématique", matiereNom: "Algèbre", description: "", chapitres: [{ titre: "", fichier: "" }] },
    { titre: "Algorithmique - Structures de données", matiereNom: "ASD", description: "", chapitres: [{ titre: "notion de base", fichier: "coursalgo.pdf" }, { titre: "", fichier: "" }] },
    { titre: "Atelier de programmation", matiereNom: "Language C", description: "", chapitres: [{ titre: "", fichier: "" }, { titre: "", fichier: "" }] },
    { titre: "Électricité électronique", matiereNom: "Département de Physique", description: "", chapitres: [{ titre: "", fichier: "" }] },
    { titre: "Propagation et rayonnement", matiereNom: "Département de Physique", description: "", chapitres: [{ titre: "", fichier: "" }] },
    { titre: "Système logique", matiereNom: "Département de Physique", description: "", chapitres: [{ titre: "", fichier: "" }] },
    { titre: "Français", matiereNom: "Technique de communication", description: "", chapitres: [{ titre: "", fichier: "" }] }
];

const grille = document.getElementById('coursesGrid');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const modal = document.getElementById('modal');
const modalMatiere = document.getElementById('modalMatiere');
const modalTitre = document.getElementById('modalTitre');
const modalDescription = document.getElementById('modalDescription');
const modalListe = document.getElementById('modalListe');
const modalFermer = document.getElementById('modalFermer');

function chapitresValides(cours) {
    return cours.chapitres.filter(c => (c.titre && c.titre.trim()) || (c.fichier && c.fichier.trim()));
}

function initFiltre() {
    const matieres = [...new Set(mesCours.map(c => c.matiereNom))].sort();
    matieres.forEach(m => {
        const o = document.createElement('option');
        o.value = m; o.textContent = m;
        filterSelect.appendChild(o);
    });
}

function afficherCours(liste) {
    grille.innerHTML = '';
    if (liste.length === 0) {
        grille.innerHTML = '<p class="vide">Aucun cours trouvé 😕</p>';
        return;
    }
    liste.forEach(cours => {
        const carte = document.createElement('div');
        carte.className = 'carte';
        carte.tabIndex = 0;
        carte.setAttribute('role', 'button');
        const valides = chapitresValides(cours);
        const compteur = valides.length > 0 ? `${valides.length} document${valides.length > 1 ? 's' : ''}` : 'Bientôt disponible';
        const descHTML = cours.description && cours.description.trim() ? `<p>${cours.description}</p>` : '';
        carte.innerHTML = `<h3>${cours.titre}</h3>${descHTML}<span class="compteur">📄 ${compteur}</span>`;
        const ouvrir = () => ouvrirModal(cours);
        carte.addEventListener('click', ouvrir);
        carte.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } });
        grille.appendChild(carte);
    });
}

function ouvrirModal(cours) {
    modalMatiere.textContent = cours.matiereNom;
    modalTitre.textContent = cours.titre;
    if (cours.description && cours.description.trim()) {
        modalDescription.textContent = cours.description;
        modalDescription.style.display = 'block';
    } else {
        modalDescription.textContent = ''; modalDescription.style.display = 'none';
    }
    modalListe.innerHTML = '';
    const valides = chapitresValides(cours);
    if (valides.length === 0) {
        modalListe.innerHTML = '<p class="vide">Aucun document disponible pour l\'instant.</p>';
    } else {
        valides.forEach(chap => {
            const ligne = document.createElement('div');
            ligne.className = 'chapitre-ligne';
            const lienHTML = chap.fichier && chap.fichier.trim()
    ? `<button class="btn-lire" data-fichier="${chap.fichier}" data-titre="${chap.titre || 'Document'}">👁️ Lire</button>`
    : `<span class="indisponible">Bientôt disponible</span>`;
            ligne.innerHTML = `<span class="chapitre-nom">${chap.titre || ''}</span>${lienHTML}`;
            modalListe.appendChild(ligne);
        });
    }
    modal.classList.add('ouvert');
    modalFermer.focus();
    document.body.style.overflow = 'hidden';
}
// ============================================================
// LECTEUR PDF INTÉGRÉ
// ============================================================
const pdfModal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');
const pdfTitre = document.getElementById('pdfTitre');
const pdfFermer = document.getElementById('pdfFermer');

function ouvrirPDF(fichier, titre) {
    pdfTitre.textContent = "📄 " + titre;
    // Utilisation d'un blob pour cacher l'URL réelle
    pdfViewer.src = fichier + "#toolbar=0&navpanes=0&scrollbar=1&view=FitH";
    pdfModal.classList.add('ouvert');
    document.body.style.overflow = 'hidden';
}

function fermerPDF() {
    pdfModal.classList.remove('ouvert');
    pdfViewer.src = ''; // Libère la mémoire
    document.body.style.overflow = '';
}

// Déléguer les clics sur les boutons "Lire"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-lire')) {
        const fichier = e.target.dataset.fichier;
        const titre = e.target.dataset.titre;
        ouvrirPDF(fichier, titre);
    }
});

pdfFermer.addEventListener('click', fermerPDF);
pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) fermerPDF();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('ouvert')) fermerPDF();
});

// 🚫 Désactiver le clic droit sur le lecteur PDF
pdfViewer.addEventListener('contextmenu', (e) => e.preventDefault());

function fermerModal() {
    modal.classList.remove('ouvert');
    document.body.style.overflow = '';
}

modalFermer.addEventListener('click', fermerModal);
modal.addEventListener('click', e => { if (e.target === modal) fermerModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('ouvert')) fermerModal(); });

function filtrer() {
    const texte = searchInput.value.trim().toLowerCase();
    const matiere = filterSelect.value;
    const resultats = mesCours.filter(cours => {
        const tc = chapitresValides(cours).map(c => c.titre.toLowerCase()).join(' ');
        const okTexte = cours.titre.toLowerCase().includes(texte) || (cours.description || '').toLowerCase().includes(texte) || cours.matiereNom.toLowerCase().includes(texte) || tc.includes(texte);
        const okMatiere = matiere === 'all' || cours.matiereNom === matiere;
        return okTexte && okMatiere;
    });
    afficherCours(resultats);
}

searchInput.addEventListener('input', filtrer);
filterSelect.addEventListener('change', filtrer);
initFiltre();
afficherCours(mesCours);


/* ============ FORUM ============ */
const FORUM_STORAGE_KEY = "forum_messages";
const forumPseudo = document.getElementById('forumPseudo');
const forumMessage = document.getElementById('forumMessage');
const forumPublierBtn = document.getElementById('forumPublierBtn');
const forumMessages = document.getElementById('forumMessages');

function lireMessages() {
    try { return JSON.parse(localStorage.getItem(FORUM_STORAGE_KEY)) || []; } catch { return []; }
}
function sauverMessages(m) { localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(m)); }

function chargerMessages() {
    const messages = lireMessages();
    forumMessages.innerHTML = '';

    if (messages.length === 0) {
        forumMessages.innerHTML = '<p class="forum-vide">Aucun message pour l\'instant. Sois la première à écrire ! ✨</p>';
        return;
    }

    messages.slice().reverse().forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';

        const date = new Date(msg.date);
        const dateStr = date.toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        div.innerHTML = `
            <button class="message-supprimer" title="Supprimer">✕</button>
            <div class="message-entete">
                <span class="message-auteur">${echapperHTML(msg.auteur)}</span>
                <span class="message-date">${dateStr}</span>
            </div>
            <div class="message-texte">${formaterMentions(msg.texte)}</div>
        `;

        div.querySelector('.message-supprimer').addEventListener('click', () => {
            const pseudoActuel = forumPseudo.value.trim() || "Anonyme";
            if (msg.auteur !== pseudoActuel) {
                alert("Tu ne peux supprimer que tes propres messages.");
                return;
            }
            if (confirm("Supprimer ce message ?")) {
                sauverMessages(lireMessages().filter(m => m.id !== msg.id));
                chargerMessages();
            }
        });

        // Rendre les mentions cliquables
        div.querySelectorAll('.mention').forEach(mentionEl => {
            mentionEl.addEventListener('click', (e) => {
                e.preventDefault();
                const pseudo = mentionEl.dataset.pseudo;
                // Pré-remplir le champ avec la mention
                const texteActuel = forumMessage.value;
                forumMessage.value = texteActuel + (texteActuel ? ' ' : '') + '@' + pseudo + ' ';
                forumMessage.focus();
            });
        });

        forumMessages.appendChild(div);
    });
}

// 🔑 NOUVELLE FONCTION : détecte les @mentions et les stylise
function formaterMentions(texte) {
    // 1. Échapper le HTML pour la sécurité
    let texteSecurise = echapperHTML(texte);

    // 2. Remplacer les @nom par un span coloré
    // Regex : @ suivi de lettres/chiffres/tirets/underscores
    texteSecurise = texteSecurise.replace(
        /@([a-zA-Z0-9À-ÿ_-]+)/g,
        '<span class="mention" data-pseudo="$1">@$1</span>'
    );

    return texteSecurise;
}

forumPublierBtn.addEventListener('click', () => {
    const auteur = forumPseudo.value.trim() || "Anonyme";
    const texte = forumMessage.value.trim();
    if (!texte) { alert("Écris un message avant de publier 😊"); return; }
    const messages = lireMessages();
    messages.push({ id: Date.now() + "_" + Math.random().toString(36).slice(2, 8), auteur, texte, date: new Date().toISOString() });
    sauverMessages(messages);
    forumMessage.value = '';
    chargerMessages();
});

function echapperHTML(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
chargerMessages();


/* ============ FIREBASE AUTH + PAIEMENT ============ */
const loginScreen = document.getElementById('loginScreen');
const waitingScreen = document.getElementById('waitingScreen');
const siteContent = document.getElementById('siteContent');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authBtn = document.getElementById('authBtn');
const authError = document.getElementById('authError');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const authSwitchText = document.getElementById('authSwitchText');
const authSwitchLink = document.getElementById('authSwitchLink');
const waitingLogoutBtn = document.getElementById('waitingLogoutBtn');

let mode = "login";

function mettreAJourAffichage() {
    if (mode === "login") {
        authTitle.textContent = "🔐 Accès réservé";
        authSubtitle.textContent = "Connecte-toi pour accéder aux cours";
        authBtn.textContent = "Se connecter";
        authSwitchText.textContent = "Pas encore de compte ?";
        authSwitchLink.textContent = "Créer un compte";
    } else {
        authTitle.textContent = "📝 Créer un compte";
        authSubtitle.textContent = "Inscris-toi avec ton email";
        authBtn.textContent = "S'inscrire";
        authSwitchText.textContent = "Déjà un compte ?";
        authSwitchLink.textContent = "Se connecter";
    }
    authError.textContent = "";
}

authSwitchLink.addEventListener('click', (e) => {
    e.preventDefault();
    mode = mode === "login" ? "signup" : "login";
    mettreAJourAffichage();
});

function traduireErreur(code) {
    const messages = {
        "auth/email-already-in-use": "Cet email est déjà utilisé. Connecte-toi plutôt.",
        "auth/invalid-email": "Email invalide.",
        "auth/weak-password": "Mot de passe trop faible (minimum 6 caractères).",
        "auth/user-not-found": "Aucun compte avec cet email.",
        "auth/wrong-password": "Mot de passe incorrect.",
        "auth/invalid-credential": "Email ou mot de passe incorrect.",
        "auth/too-many-requests": "Trop de tentatives. Réessaie plus tard."
    };
    return messages[code] || "Erreur : " + code;
}

window.addEventListener('firebaseReady', () => {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    const { 
        createUserWithEmailAndPassword, signInWithEmailAndPassword,
        onAuthStateChanged, signOut, doc, setDoc, getDoc 
    } = window.firebaseFunctions;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Vérifier si payé dans Firestore
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().paye === true) {
                    // Payé → afficher le site
                    loginScreen.style.display = 'none';
                    waitingScreen.style.display = 'none';
                    siteContent.style.display = 'block';
                } else {
                    // Pas payé → écran d'attente
                    loginScreen.style.display = 'none';
                    waitingScreen.style.display = 'flex';
                    siteContent.style.display = 'none';
                }
            } catch (err) {
                console.error("Erreur Firestore:", err);
                loginScreen.style.display = 'none';
                waitingScreen.style.display = 'flex';
                siteContent.style.display = 'none';
            }
        } else {
            loginScreen.style.display = 'flex';
            waitingScreen.style.display = 'none';
            siteContent.style.display = 'none';
        }
    });

    authBtn.addEventListener('click', async () => {
        const email = authEmail.value.trim();
        const password = authPassword.value;
        if (!email || !password) { authError.textContent = "Remplis tous les champs."; return; }
        try {
            if (mode === "login") {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                // Créer le doc Firestore
                await setDoc(doc(db, "users", userCred.user.uid), {
                    email: email,
                    paye: false,
                    dateInscription: new Date().toISOString()
                });
            }
        } catch (err) {
            authError.textContent = traduireErreur(err.code);
        }
    });

    authPassword.addEventListener('keydown', (e) => { if (e.key === 'Enter') authBtn.click(); });

    waitingLogoutBtn.addEventListener('click', async () => { await signOut(auth); });

    // Bouton déconnexion flottant (sur le site)
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = "🚪 Se déconnecter";
    logoutBtn.style.cssText = `position:fixed;top:1rem;right:1rem;padding:0.5rem 1rem;background:#4a6cf7;color:white;border:none;border-radius:8px;cursor:pointer;z-index:50;font-size:0.85rem;`;
    logoutBtn.addEventListener('click', async () => { await signOut(auth); });
    document.body.appendChild(logoutBtn);

    mettreAJourAffichage();
});
