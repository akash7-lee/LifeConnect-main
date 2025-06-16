// Sample hospital data
const hospitals = [
    { name: "Apollo Hospitals", email: "info@apollohospitals.com", city: "Chennai" },
    { name: "KMCH", email: "contact@kmchhospitals.com", city: "Coimbatore" },
    { name: "Madurai Meenakshi Mission Hospital", email: "info@mmhrc.in", city: "Madurai" }
];

// Load donors from local storage
document.addEventListener("DOMContentLoaded", loadDonors);

// Handle form submission
document.getElementById("donorForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const bloodGroup = document.getElementById("bloodGroup").value;
    const organs = document.getElementById("organs").value;

    const donor = { name, age, bloodGroup, organs };
    
    // Save to local storage
    let donors = JSON.parse(localStorage.getItem("donors")) || [];
    donors.push(donor);
    localStorage.setItem("donors", JSON.stringify(donors));

    // Update UI
    displayDonors();
    
    // Clear form
    document.getElementById("donorForm").reset();
});

// Display donors in container format
function displayDonors() {
    const donorList = document.getElementById("donorList");
    donorList.innerHTML = ""; // Clear previous entries
    let donors = JSON.parse(localStorage.getItem("donors")) || [];
    
    donors.forEach(donor => {
        const donorCard = document.createElement("div");
        donorCard.classList.add("donor-card");
        donorCard.innerHTML = `
            <strong>${donor.name}</strong><br>
            Age: ${donor.age} | Blood: ${donor.bloodGroup} <br>
            Organs: ${donor.organs}
        `;
        donorList.appendChild(donorCard);
    });
}

// Load stored donors on page load
function loadDonors() {
    displayDonors();
}

// Notify hospitals via email
document.getElementById("notifyHospitals").addEventListener("click", function () {
    let donors = JSON.parse(localStorage.getItem("donors")) || [];

    if (donors.length === 0) {
        alert("No donors registered yet!");
        return;
    }

    hospitals.forEach(hospital => {
        let subject = encodeURIComponent("New Organ Donor Available");
        let body = encodeURIComponent(`Dear ${hospital.name},\n\nWe have a new organ donor:\n\nName: ${donors[0].name}\nAge: ${donors[0].age}\nBlood Group: ${donors[0].bloodGroup}\nOrgans: ${donors[0].organs}\n\nPlease contact us for more details.`);
        
        window.open(`mailto:${hospital.email}?subject=${subject}&body=${body}`);
    });

    alert("Hospitals have been notified!");
});
