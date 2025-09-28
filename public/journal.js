// Définition du toaster

function info_popup() {
  var toaster = document.getElementById("snackbar");
  toaster.className = "show";
  setTimeout(function () {
    toaster.className = toaster.className.replace("show", "");
  }, 3000);
}

// Initialize animations and icons
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

feather.replace();

VANTA.GLOBE({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x1e88e5,      // bleu
    shininess: 50.00,
    waveHeight: 20.00,
    waveSpeed: 0.75,
    zoom: 1.00
  })

// Set today's date as default
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("journal-date").value = today;

  // Initialize Vanta.js background
  VANTA.GLOBE({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x10b981,
    backgroundColor: 0xf0fdf4,
    size: 0.8,
    index: -1 /* Derrière tout le contenu */
  });

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
