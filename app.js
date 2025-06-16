
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Handle Donor Registration Form Submission
document.getElementById('donorForm').addEventListener('submit', function () {
    const donorData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        bloodType: document.getElementById('bloodType').value,
        location: document.getElementById('location').value
    };
    console.log('Donor Registered:', donorData);
    alert('Thank you for registering as a donor!');
    // You can send this data to Firebase or a backend server here.
});

// Handle Donation Request Form Submission
document.getElementById('requestForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const requestData = {
        patientName: document.getElementById('patientName').value,
        requesterEmail: document.getElementById('requesterEmail').value,
        requesterPhone: document.getElementById('requesterPhone').value,
        donationType: document.getElementById('donationType').value,
        bloodType: document.getElementById('bloodType').value,
        hospitalName: document.getElementById('hospitalName').value,
        location: document.getElementById('location').value,
        additionalInfo: document.getElementById('additionalInfo').value
    };
    console.log('Donation Requested:', requestData);
    alert('Your request has been submitted!');
    // You can send this data to Firebase or a backend server here.
});


