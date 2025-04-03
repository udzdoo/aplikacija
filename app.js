document.addEventListener("DOMContentLoaded", function () {
    const vetProfileKey = "vet_profile";

    function getVetProfile() {
        return localStorage.getItem(vetProfileKey);
    }

    function setVetProfile(profile) {
        localStorage.setItem(vetProfileKey, profile);
    }

    function logVisitToAirtable(profile) {
        fetch("https://api.airtable.com/v0/appDOXjqLW2Q32Vep/Imena%20ordinacija", {
            method: "POST",
            headers: {
                "Authorization": "Bearer patmB1z0VvhCg5l2g.666c06905afc2c05c75bc5076ec121b6ce9774b3b101ce964d2af3670aba2380",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fields: {
                    Name: profile,
                    Timestamp: new Date().toISOString()
                }
            })
        })
        .then(response => response.json())
        .then(data => console.log("Visit logged:", data))
        .catch(error => console.error("Error logging visit:", error));
    }

    let profile = getVetProfile();
    if (!profile) {
        profile = prompt("Unesite ime ordinacije:");
        if (profile) {
            setVetProfile(profile);
        }
    }

    if (profile) {
        logVisitToAirtable(profile);
    }
});
