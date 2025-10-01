// Définition du toaster

function info_popup() {
  var toaster = document.getElementById("snackbar");
  toaster.className = "show";
  setTimeout(function () {
    toaster.className = toaster.className.replace("show", "");
  }, 3000);
}

// Initialize animations and icons avec vérification
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
  });
}

if (typeof feather !== 'undefined') {
  feather.replace();
}

// Set today's date as default
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("journal-date").value = today;

  // Initialize Vanta.js background avec vérification et gestion d'instance
  // Nous gardons une référence à l'instance pour pouvoir la détruire proprement
  window.__VANTA_INSTANCE__ = window.__VANTA_INSTANCE__ || null;
  function initVantaBackground() {
    // Vérifier que Three.js est chargé
    if (typeof THREE === 'undefined') {
      console.warn('⚠️ Three.js non chargé');
      return false;
    }

    if (typeof VANTA === 'undefined') {
      console.warn('⚠️ VANTA non disponible');
      return false;
    }

    // Vérifier que TOPOLOGY est une fonction/constructeur
    const topologyFactory = VANTA.TOPOLOGY || (VANTA.init && VANTA.init.TOPOLOGY);
    if (!topologyFactory && typeof VANTA.TOPOLOGY !== 'function') {
      console.warn('⚠️ VANTA.TOPOLOGY n\'est pas disponible ou n\'est pas une fonction');
      return false;
    }

    try {
      // Diagnostics rapides
      try {
        console.log('🔎 VANTA keys:', Object.keys(VANTA || {}));
        console.log('🔎 typeof VANTA.TOPOLOGY:', typeof VANTA.TOPOLOGY);
        console.log('🔎 THREE revision:', (typeof THREE !== 'undefined' && THREE.REVISION) ? THREE.REVISION : 'unknown');
        // Lister les scripts chargés (utile pour détecter plusieurs three.js ou vanta inclus)
        const scripts = Array.from(document.scripts).map(s => s.src).filter(Boolean);
        console.log('📜 scripts loaded:', scripts);
        console.log('🔎 three.js scripts:', scripts.filter(s => /three(\.min)?\.js/i.test(s) || s.toLowerCase().includes('three.js')));
        console.log('🔎 vanta scripts:', scripts.filter(s => /vanta\./i.test(s)));
        // Vérifier AMD / CommonJS presence
        console.log('🔎 define:', typeof define, 'require:', typeof require, '🔎 module:', typeof module);
        // Aperçu du factory si c'est une fonction
        if (typeof VANTA.TOPOLOGY === 'function') {
          try {
            console.log('🔎 VANTA.TOPOLOGY (snippet):', VANTA.TOPOLOGY.toString().slice(0, 500));
          } catch (snipErr) {
            console.log('🔎 Unable to show snippet of VANTA.TOPOLOGY');
          }
        } else {
          console.log('🔎 VANTA.TOPOLOGY value:', VANTA.TOPOLOGY);
        }
      } catch (dlog) {
        // noop
      }

      // Détruire instance existante si présente
      if (window.__VANTA_INSTANCE__ && typeof window.__VANTA_INSTANCE__.destroy === 'function') {
        window.__VANTA_INSTANCE__.destroy();
        window.__VANTA_INSTANCE__ = null;
      }

      // Initialiser et stocker l'instance
      window.__VANTA_INSTANCE__ = VANTA.TOPOLOGY({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x85a53b,
        backgroundColor: 0xffffff,
      });

      console.log('✅ VANTA.TOPOLOGY initialisé dans journal.js');
      return true;
    } catch (error) {
      console.warn('⚠️ Erreur VANTA.TOPOLOGY dans journal.js:', error);
      // Tentative : recharger dynamiquement le script Vanta Topology (cache-bust)
      try {
        const existing = document.querySelector('script[src*="vanta.topology.min.js"]');
        if (existing) existing.remove();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.topology.min.js?cb=' + Date.now();
        s.async = true;
        s.onload = function() {
          console.log('🔁 vanta.topology rechargé, nouvelle tentative d\'init');
          setTimeout(initVantaBackground, 200);
        };
        s.onerror = function(ev) { console.warn('❌ Échec du rechargement de vanta.topology', ev); };
        document.head.appendChild(s);
      } catch (reloadErr) {
        console.warn('❌ Impossible de recharger dynamiquement vanta.topology:', reloadErr);
      }
      // fallback: appliquer une animation CSS légère sur #vanta-bg
      try {
        const el = document.getElementById('vanta-bg');
        if (el) {
          el.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #e0f2fe 100%)';
          el.style.transition = 'opacity 0.6s ease';
        }
      } catch (e) {
        // noop
      }
      return false;
    }
  }
  
  // Attendre que tout soit chargé
  function tryInitVanta() {
    if (typeof THREE !== 'undefined' && typeof VANTA !== 'undefined') {
      if (!initVantaBackground()) {
        console.log('✅ Utilisation du background CSS animé');
      }
    } else {
      console.log('⏳ Attente des scripts...');
      setTimeout(tryInitVanta, 500);
    }
  }
  
  // Essayer d'initialiser après un délai
  setTimeout(tryInitVanta, 1000);

  // Save journal function
  document
    .getElementById("save-journal")
    .addEventListener("click", function () {
      // Création d'une Map pour préserver l'ordre d'insertion
      const journalMap = new Map();

      // On ajoute chaque donnée dans l'ordre souhaité
      journalMap.set("date", document.getElementById("journal-date").value);
      journalMap.set(
        "day",
        document.querySelector('input[name="day"]:checked')?.value
      );
      journalMap.set(
        "mood",
        document.querySelector('input[name="mood"]:checked')?.value
      );
      journalMap.set(
        "feelingWords",
        Array.from(document.querySelectorAll(".mood-checkin")).map(
          (input) => input.value
        )
      );
      journalMap.set(
        "gratitude",
        Array.from(document.querySelectorAll(".gratitude-input")).map(
          (input) => input.value
        )
      );
      journalMap.set(
        "bestMoment",
        document.getElementById("bestmoment")?.value || ""
      );
      journalMap.set("sleep", document.querySelector("#sleep")?.value || "");
      journalMap.set(
        "exercise",
        document.getElementById("exercice")?.value || ""
      );
      journalMap.set(
        "nutrition",
        document.querySelector('input[name="nutrition"]:checked')?.value
      );
      journalMap.set(
        "productiveHabits",
        document.getElementById("good-habits")?.value || ""
      );
      journalMap.set(
        "slippedHabits",
        document.getElementById("bad-habits")?.value || ""
      );
      journalMap.set(
        "challenges",
        document.getElementById("challenges")?.value || ""
      );
      journalMap.set(
        "reaction",
        document.getElementById("reaction")?.value || ""
      );
      journalMap.set(
        "differentApproach",
        document.getElementById("approach")?.value || ""
      );
      journalMap.set(
        "patterns",
        document.getElementById("patterns")?.value || ""
      );
      journalMap.set(
        "lessons",
        document.getElementById("lessons")?.value || ""
      );
      journalMap.set(
        "energyGivers",
        document.getElementById("energyGivers")?.value || ""
      );
      journalMap.set(
        "energyDrainers",
        document.getElementById("energyDrainers")?.value || ""
      );
      journalMap.set(
        "improvement",
        document.getElementById("improve")?.value || ""
      );
      journalMap.set(
        "affirmation",
        document.getElementById("affirmation")?.value || ""
      );
      journalMap.set(
        "extraNotes",
        document.getElementById("extra-notes")?.value || ""
      );

      // Convertir en objet pour la compatibilité (si besoin d'envoyer en JSON)
      const journalData = Object.fromEntries(journalMap);

      // Stocker dans document ou ailleurs
      document.journalData = journalData;

      // ✅ Affichage ORDONNÉ dans la console
      console.log("Journal data (ordonné):", journalData);

      // Optionnel : afficher sous forme de tableau
      console.table(Object.fromEntries(journalMap));



      // Ici tu peux envoyer journalData à un serveur
      // ex: fetch('/api/save-journal', { method: 'POST', body: JSON.stringify(journalData) })
   
      fetch("http://localhost:3000/api/save-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(journalData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("✅ Journal envoyé et sauvegardé !");
          } else {
            console.error("❌ Échec de l’envoi");
          }
        })
        .catch((err) => {
          console.error("Erreur réseau :", err);
        });


      // For demo purposes, we'll just show an alert
      info_popup();

      // alert('Journal entry saved successfully!');

      // In a real app, you would:
      // 1. Send data to your backend API
      // 2. Handle the response
      // 3. Maybe redirect or show success message
    });
});
