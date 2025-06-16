
// Popup Functionality
var popupOverlay = document.querySelector(".popup-overlay");
var popupBox = document.querySelector(".popup-box");
var addPopupButton = document.getElementById("add-popup-button");
var cancelPopup = document.getElementById("cancel-popup");

addPopupButton.addEventListener("click", function () {
    popupOverlay.style.display = "block";
    popupBox.style.display = "block";
});

cancelPopup.addEventListener("click", function (event) {
    event.preventDefault();
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";
});

// Form Elements
var container = document.querySelector(".container");
var addDetails = document.getElementById("add-details");
var nameInput = document.getElementById("name-input");
var emailInput = document.getElementById("email-input");
var phoneNumberInput = document.getElementById("phonenumber-input");
var bloodGroupInput = document.getElementById("bloodgroup-input");
var locationInput = document.getElementById("location-input");

var map;
var markers = [];
var geocoder;

function initMap() {
    console.log("Google Maps API Loaded!");

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 13.0827, lng: 80.2707 },
        zoom: 10,
    });

    geocoder = new google.maps.Geocoder();
    console.log("Map initialized:", map);
}

window.initMap = initMap;

// Function to Add User Details
addDetails.addEventListener("click", async function (event) {
    event.preventDefault();

    var userData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneNumberInput.value,
        bloodGroup: bloodGroupInput.value.toUpperCase(),
        location: locationInput.value.trim()
    };

    if (userData.location) {
        try {
            const geoResult = await geocodeAddress(userData.location);
            if (geoResult) {
                addMarkerToMap(geoResult, userData.name);
            } else {
                console.warn("⚠️ Geocoding failed, but proceeding without coordinates.");
            }
        } catch (error) {
            console.error("❌ Error in geocoding:", error);
        }
    }
    saveToLocalStorage(userData);
    addUserCard(userData);
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";

    // Clear Input Fields
    nameInput.value = "";
    emailInput.value = "";
    phoneNumberInput.value = "";
    bloodGroupInput.value = "";
    locationInput.value = "";
});

// Function to Add User Card
function addUserCard(userData) {
    var div = document.createElement("div");
    div.setAttribute("class", "register-container");
    div.setAttribute("data-bloodgroup", userData.bloodGroup);

    div.innerHTML = `
        <h2>${userData.name}</h2>
        <h5>${userData.email}</h5>
        <h5>${userData.phone}</h5>
        <h2>${userData.bloodGroup}</h2>
        <h5>${userData.location}</h5>
        <button onclick="sendMessage(event, '${userData.phone}', '${userData.email}', '${userData.name}', '${userData.bloodGroup}', '${userData.location}')">Send</button>
        <button onclick="deleteDetails(event, '${userData.phone}')">Delete</button>
    `;
    container.append(div);
}

// Function to Search Blood Group
function searchBloodGroup() {
    var searchValue = document.getElementById("search-bar").value.toUpperCase().trim();
    console.log("🔎 Searching for:", searchValue);

    var donorCards = document.querySelectorAll(".register-container");
    var foundLocations = [];
    var matchFound = false;

    donorCards.forEach(card => {
        var bloodGroupElement = card.querySelector("h2:nth-of-type(2)");

        if (!bloodGroupElement) {
            console.warn("⚠️ Blood group element not found.");
            return;
        }

        var bloodGroup = bloodGroupElement.textContent.toUpperCase().trim();
        if (bloodGroup === searchValue) {
            card.style.display = "block";
            matchFound = true;
            var locationElement = card.querySelector("h5:nth-of-type(3)");
            if (locationElement) {
                foundLocations.push(locationElement.textContent);
            }
        } else {
            card.style.display = "none";
        }
    });

    if (matchFound) {
        document.getElementById("map-button").style.display = "block";
        document.getElementById("map-button").setAttribute("data-locations", JSON.stringify(foundLocations));
    } else {
        document.getElementById("map-button").style.display = "none";
        console.warn("❌ No donors found.");
    }
}

// Function to Geocode Address
function geocodeAddress(location) {
    return new Promise((resolve, reject) => {
        if (!location || location.trim() === "") {
            console.warn("⚠️ Empty location.");
            resolve(null);
            return;
        }

        if (!geocoder) {
            console.error("❌ Geocoder not initialized!");
            reject("Geocoder not initialized.");
            return;
        }

        geocoder.geocode({ address: location }, function (results, status) {
            if (status === "OK") {
                resolve(results[0].geometry.location);
            } else {
                console.error("❌ Geocode failed for:", location, "Status:", status);
                resolve(null);
            }
        });
    });
}

// Function to Add Marker to Map
function addMarkerToMap(location, name) {
    if (!map) {
        console.error("⚠️ Map not initialized!");
        return;
    }

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });

    markers.push(marker);
    map.setCenter(location);
    map.setZoom(12);
}

// Function to Show All Locations
async function showAllLocations() {
    var locations = JSON.parse(document.getElementById("map-button").getAttribute("data-locations"));

    if (!map) {
        console.error("Map is not initialized!");
        return;
    }

    if (!locations || locations.length === 0) {
        console.warn("No valid locations to show.");
        return;
    }

    markers.forEach(marker => marker.setMap(null));
    markers = [];

    var bounds = new google.maps.LatLngBounds();
    const results = await Promise.all(locations.map(loc => geocodeAddress(loc)));
    const validResults = results.filter(res => res !== null);

    if (validResults.length === 0) {
        console.warn("No valid geocode results.");
        return;
    }

    validResults.forEach(location => {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
        });

        markers.push(marker);
        bounds.extend(location);
    });

    map.fitBounds(bounds);
}
// Global array to store markers
var markers = [];

// Function to Add Marker and Link to Donor Card
function addMarkerToMap(location, userData) {
    if (!map) {
        console.error("⚠️ Map not initialized!");
        return;
    }

    console.log("📍 Adding Marker for:", userData.location, "at", location);
  
    var marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
        title: userData.name,
    });

    markers.push({ marker: marker, userData: userData });

    // ✅ Click Event for Marker
    marker.addEventListener("click", function () {
        console.log("📌 Marker Clicked:", userData.location);
        showDonorCard(userData.location);
    });

    map.setCenter(location);
    map.setZoom(12);
}

// Function to Show Donor Card
function showDonorCard(location) {
    var donorCards = document.querySelectorAll(".register-container");
    var found = false;

    donorCards.forEach(card => {
        var locationElement = card.getAttribute("data-location")?.trim().toLowerCase();
        console.log("🔎 Checking card location:", locationElement);

        if (locationElement === location.trim().toLowerCase()) {
            card.style.display = "block";
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.style.backgroundColor = "#ffeb3b";
            found = true;

            setTimeout(() => card.style.backgroundColor = "", 2000);
        } else {
            card.style.display = "none";
        }
    });

    if (!found) {
        console.warn("⚠️ No donor found for this location!");
    }
}

// Ensure that donor cards have a `data-location`
document.addEventListener("DOMContentLoaded", function () {
    var donorCards = document.querySelectorAll(".register-container");

    donorCards.forEach(card => {
        var locationText = card.querySelector("h5:last-of-type")?.textContent || "Unknown";
        card.setAttribute("data-location", locationText.trim().toLowerCase()); // Normalize for matching
        console.log("✅ Donor Card Set:", locationText.trim());
    });
});

// Save to Local Storage
function saveToLocalStorage(userData) {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
// Save to Firebase
}
// Load from Local Storage
function loadFromLocalStorage() {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach(user => addUserCard(user));

}

// Delete User Details
function deleteDetails(event, phone) {
    event.target.parentElement.remove();
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(user => user.phone !== phone);
    localStorage.setItem("users", JSON.stringify(users));
   
}

// Send WhatsApp & Email Messages
function sendMessage(event, phone, email, name, bloodGroup, location) {
    event.preventDefault();

    var whatsappMessage = `Hello ${name},%0A
    Urgent blood request for ${bloodGroup}.%0A
    Location: ${location}%0A
    Please donate. Thank you!`;
    
    var whatsappLink = `https://wa.me/${phone}?text=${whatsappMessage}`;
    window.open(whatsappLink, '_blank');

    var emailSubject = `Urgent Blood Donation Request`;
    var emailBody = `Dear ${name},%0A
    We have an urgent request for your blood group (${bloodGroup}).%0A
    Location: ${location}%0A
    Please consider donating.`;
    
    var emailLink = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
    window.open(emailLink, '_blank');
}
window.onload = loadFromLocalStorage;

