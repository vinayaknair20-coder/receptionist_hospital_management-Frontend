// CareHealth Hospital Website JavaScript with Dark Mode

document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentDate = document.getElementById('appointmentDate');
    if (appointmentDate) {
        appointmentDate.min = tomorrow.toISOString().split('T')[0];
    }

    // Form validation
    initializeFormValidation();

    // Initialize Dark Mode feature
    initializeDarkMode();
});

// -----------------------
// DARK MODE FUNCTIONALITY
// -----------------------
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;

    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    if (isDarkMode) {
        enableDarkMode();
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    function enableDarkMode() {
        body.classList.add('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.className = 'fas fa-sun';
        }
        localStorage.setItem('darkMode', 'enabled');
        showAlert('Dark mode enabled!', 'info');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.className = 'fas fa-moon';
        }
        localStorage.setItem('darkMode', 'disabled');
        showAlert('Light mode enabled!', 'info');
    }
}

// ------------------------------------------
// LOGIN HANDLER -- only called from loginForm
// ------------------------------------------
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginBtn = document.getElementById('loginBtn');

    clearValidationMessages();

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    loginBtn.innerHTML = '<span class="loading"></span> Logging in...';
    loginBtn.disabled = true;

    setTimeout(() => {
        if (email === 'receptionist@carehealth.com' && password === 'password123') {
            localStorage.setItem('receptionistLogin', 'true');
            localStorage.setItem('userRole', 'receptionist');
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
            window.location.href = '../html/receptionist-dashboard.html';
        } else {
            showValidationError('loginPassword', 'Invalid credentials. Use: receptionist@carehealth.com / password123');
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
            loginBtn.disabled = false;
        }
    }, 1200);
}

// ---------------------
// APPOINTMENT HANDLING
// ---------------------

// Doctor database organized by department
const doctorsByDepartment = {
    'cardiology': [
        'Dr. John Smith - Chief Cardiologist',
        'Dr. Emily Rodriguez - Interventional Cardiologist',
        'Dr. Michael Chen - Cardiac Surgeon',
        'Dr. Priya Patel - Pediatric Cardiologist'
    ],
    'neurology': [
        'Dr. Sarah Johnson - Neurologist',
        'Dr. David Kumar - Neurosurgeon',
        'Dr. Lisa Wong - Pediatric Neurologist',
        'Dr. Robert Martinez - Neuropsychologist'
    ],
    'pediatrics': [
        'Dr. Amal Thomas - Pediatric Specialist',
        'Dr. Jennifer Adams - Pediatric Surgeon',
        'Dr. Ahmed Hassan - Neonatologist',
        'Dr. Maria Santos - Pediatric Cardiologist'
    ],
    'orthopedics': [
        'Dr. James Wilson - Orthopedic Surgeon',
        'Dr. Rachel Green - Sports Medicine Specialist',
        'Dr. Mark Thompson - Spine Specialist',
        'Dr. Anna Petrov - Joint Replacement Surgeon'
    ],
    'emergency': [
        'Dr. Kevin Brown - Emergency Medicine Director',
        'Dr. Samantha Lee - Trauma Specialist',
        'Dr. Carlos Mendez - Critical Care Physician',
        'Dr. Helen Zhang - Emergency Pediatrician'
    ],
    'laboratory': [
        'Dr. Paul Anderson - Chief Laboratory Director',
        'Dr. Monica Davis - Clinical Pathologist',
        'Dr. Steven Kim - Molecular Diagnostics Specialist',
        'Dr. Rebecca Taylor - Hematology Specialist'
    ]
};

function updateDoctorList() {
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('selectedDoctor');
    const selectedDepartment = departmentSelect ? departmentSelect.value : "";

    doctorSelect.innerHTML = '<option value="">Select a Doctor</option>';

    if (selectedDepartment && doctorsByDepartment[selectedDepartment]) {
        doctorSelect.disabled = false;
        doctorsByDepartment[selectedDepartment].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        });
    } else {
        doctorSelect.disabled = true;
        doctorSelect.innerHTML = '<option value="">First select a department</option>';
    }
}

function handleAppointment() {
    const form = document.getElementById('appointmentForm');
    const requiredFields = ['patientName', 'patientEmail', 'patientPhone', 'appointmentDate', 'appointmentTime', 'department', 'selectedDoctor'];

    clearValidationMessages();
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showValidationError(fieldId, 'This field is required');
            isValid = false;
        }
    });

    // Validate email format
    const email = document.getElementById('patientEmail').value;
    if (email && !validateEmailFormat(email)) {
        showValidationError('patientEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (!isValid) return;

    // Gather info for confirmation
    const selectedDoctor = document.getElementById('selectedDoctor').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    const bookBtn = event.target;
    bookBtn.innerHTML = '<span class="loading"></span> Booking...';
    bookBtn.disabled = true;

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        if (modal) modal.hide();

        bookBtn.textContent = 'Book Appointment';
        bookBtn.disabled = false;
        form.reset();

        // Reset doctor dropdown
        document.getElementById('selectedDoctor').disabled = true;
        document.getElementById('selectedDoctor').innerHTML = '<option value="">First select a department</option>';

        const doctorName = selectedDoctor.split(' - ')[0];
        showAlert(`Appointment booked successfully with ${doctorName} on ${appointmentDate} at ${appointmentTime}. You will receive a confirmation email shortly.`, 'success');
    }, 1500);
}

// --------------------
// CONTACT FORM HANDLING
// --------------------
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');

            const phone = phoneInput ? phoneInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";

            if (!/^[0-9]{10}$/.test(phone)) {
                showAlert('Phone number must be exactly 10 digits.', 'danger');
                return;
            }

            if (!/^[\w.-]+@gmail\.com$/.test(email)) {
                showAlert('Email must be a valid @gmail.com address.', 'danger');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                this.reset();

                showAlert('Thank you for your message! We will get back to you within 24 hours.', 'success');
            }, 1500);
        });
    }
}

// --------------------------
// UTILITY & HELPER FUNCTIONS
// --------------------------

function validateEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showValidationError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    let errorDiv = document.getElementById(fieldId + '-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.id = fieldId + '-error';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearValidationMessages() {
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(error => {
        error.remove();
    });
}

// Shows an alert toast (info/success/danger)
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Keyboard shortcut for dark mode (Ctrl + D)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.click();
        }
    }
});

console.log('CareHealth Hospital Website Loaded Successfully!');
console.log('Staff Login: receptionist@carehealth.com / password123');
console.log('Press Ctrl + D to toggle dark mode');
