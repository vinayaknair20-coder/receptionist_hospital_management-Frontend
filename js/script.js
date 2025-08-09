// CareHealth Hospital Website JavaScript - Clean & Stable Version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeDateLimits();
    initializeDarkMode();
    initializeFormValidation();
    initializeAppointmentValidation();
    initializeSmoothScrolling();
    initializeKeyboardShortcuts();
    
    console.log('CareHealth Hospital Website Loaded Successfully!');
    console.log('Staff Login: receptionist@carehealth.com / password123');
    console.log('Press Ctrl + D to toggle dark mode');
});

// -----------------------
// DATE INITIALIZATION
// -----------------------
function initializeDateLimits() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentDate = document.getElementById('appointmentDate');
    if (appointmentDate) {
        appointmentDate.min = tomorrow.toISOString().split('T')[0];
        
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);
        appointmentDate.max = maxDate.toISOString().split('T')[0];
    }
}

// -----------------------
// DARK MODE FUNCTIONALITY
// -----------------------
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;

    // Check saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    // Toggle event listener
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
        if (darkModeIcon) darkModeIcon.className = 'fas fa-sun';
        localStorage.setItem('darkMode', 'enabled');
        showNotification('Dark mode enabled!', 'info');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        if (darkModeIcon) darkModeIcon.className = 'fas fa-moon';
        localStorage.setItem('darkMode', 'disabled');
        showNotification('Light mode enabled!', 'info');
    }
}

// ---------------------------
// LOGIN FUNCTIONALITY
// ---------------------------
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginBtn = document.getElementById('loginBtn');

    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'danger');
        return;
    }

    // Show loading state
    loginBtn.innerHTML = '<span class="loading"></span> Logging in...';
    loginBtn.disabled = true;

    // Simulate authentication
    setTimeout(() => {
        if (email === 'receptionist@carehealth.com' && password === 'password123') {
            localStorage.setItem('receptionistLogin', 'true');
            localStorage.setItem('userRole', 'receptionist');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
            
            window.location.href = '../html/receptionist-dashboard.html';
        } else {
            showFieldError('loginPassword', 'Invalid credentials. Use: receptionist@carehealth.com / password123');
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
            loginBtn.disabled = false;
        }
    }, 1500);
}

// ---------------------------
// APPOINTMENT SYSTEM
// ---------------------------
const DOCTORS_DATABASE = {
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
    
    if (!departmentSelect || !doctorSelect) return;
    
    const selectedDepartment = departmentSelect.value;
    
    // Clear doctor options
    doctorSelect.innerHTML = '<option value="">Select a Doctor</option>';
    
    if (selectedDepartment && DOCTORS_DATABASE[selectedDepartment]) {
        doctorSelect.disabled = false;
        DOCTORS_DATABASE[selectedDepartment].forEach(doctor => {
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

function initializeAppointmentValidation() {
    // Real-time validation for appointment form
    const fields = {
        'patientName': {
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Name must contain only letters and spaces (2-50 characters)'
        },
        'patientEmail': {
            validator: validateEmail,
            message: 'Please enter a valid email address'
        },
        'patientPhone': {
            pattern: /^[0-9]{10}$/,
            message: 'Phone number must be exactly 10 digits',
            format: true
        }
    };

    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener('input', function() {
            const value = this.value.trim();
            const config = fields[fieldId];
            
            // Auto-format phone numbers
            if (config.format && fieldId === 'patientPhone') {
                this.value = value.replace(/\D/g, '');
                return;
            }
            
            if (value) {
                let isValid;
                if (config.validator) {
                    isValid = config.validator(value);
                } else {
                    isValid = config.pattern.test(value);
                }
                
                if (!isValid) {
                    showFieldError(fieldId, config.message);
                } else {
                    clearFieldError(fieldId);
                }
            } else {
                clearFieldError(fieldId);
            }
        });
    });
}

function handleAppointment() {
    clearAllErrors();
    
    // Get form data
    const formData = {
        patientName: getValue('patientName'),
        patientEmail: getValue('patientEmail'),
        patientPhone: getValue('patientPhone'),
        appointmentDate: getValue('appointmentDate'),
        appointmentTime: getValue('appointmentTime'),
        department: getValue('department'),
        selectedDoctor: getValue('selectedDoctor'),
        symptoms: getValue('symptoms')
    };

    let isValid = true;

    // Validate all required fields
    const requiredFields = ['patientName', 'patientEmail', 'patientPhone', 'appointmentDate', 'appointmentTime', 'department', 'selectedDoctor'];
    
    requiredFields.forEach(field => {
        if (!formData[field]) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    // Specific validations
    if (formData.patientName && !/^[a-zA-Z\s]{2,50}$/.test(formData.patientName)) {
        showFieldError('patientName', 'Name must contain only letters and spaces (2-50 characters)');
        isValid = false;
    }

    if (formData.patientEmail && !validateEmail(formData.patientEmail)) {
        showFieldError('patientEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (formData.patientPhone && !/^[0-9]{10}$/.test(formData.patientPhone)) {
        showFieldError('patientPhone', 'Phone number must be exactly 10 digits');
        isValid = false;
    }

    if (formData.appointmentDate && !isValidAppointmentDate(formData.appointmentDate)) {
        showFieldError('appointmentDate', 'Please select a valid date (tomorrow to 3 months ahead)');
        isValid = false;
    }

    if (formData.symptoms && formData.symptoms.length > 0 && formData.symptoms.length < 10) {
        showFieldError('symptoms', 'Please provide more detailed symptoms (at least 10 characters)');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Please correct the errors in the form before submitting.', 'danger');
        return;
    }

    // Confirmation
    const doctorName = formData.selectedDoctor.split(' - ')[0];
    const confirmMsg = `Confirm appointment with ${doctorName} on ${formData.appointmentDate} at ${formData.appointmentTime}?`;
    
    if (!confirm(confirmMsg)) return;

    // Process booking
    const bookBtn = event.target;
    bookBtn.innerHTML = '<span class="loading"></span> Booking...';
    bookBtn.disabled = true;

    setTimeout(() => {
        // Reset form
        document.getElementById('appointmentForm').reset();
        document.getElementById('selectedDoctor').disabled = true;
        document.getElementById('selectedDoctor').innerHTML = '<option value="">First select a department</option>';
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        if (modal) modal.hide();
        
        // Reset button
        bookBtn.textContent = 'Book Appointment';
        bookBtn.disabled = false;
        
        // Success message
        showNotification(`Appointment booked successfully with ${doctorName} on ${formData.appointmentDate} at ${formData.appointmentTime}. You will receive a confirmation email shortly.`, 'success');
    }, 1500);
}

// ---------------------------
// CONTACT FORM VALIDATION
// ---------------------------
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactSubmission();
    });

    // Real-time validation
    const contactFields = ['firstName', 'lastName', 'email', 'phone', 'message'];
    
    contactFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener('input', function() {
            validateContactField(fieldId, this.value.trim());
        });
    });
}

function validateContactField(fieldId, value) {
    let isValid = true;
    let message = '';

    switch(fieldId) {
        case 'firstName':
        case 'lastName':
            if (value && !/^[a-zA-Z]{2,30}$/.test(value)) {
                isValid = false;
                message = 'Must contain only letters (2-30 characters)';
            }
            break;
        case 'email':
            if (value && !validateEmail(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            // Auto-format phone
            const phoneField = document.getElementById('phone');
            if (phoneField) {
                phoneField.value = value.replace(/\D/g, '');
            }
            if (value && !/^[0-9]{10}$/.test(value)) {
                isValid = false;
                message = 'Phone number must be exactly 10 digits';
            }
            break;
        case 'message':
            if (value.length > 0 && value.length < 20) {
                isValid = false;
                message = `Message too short. Need at least 20 characters (${value.length}/20)`;
            } else if (value.length > 1000) {
                isValid = false;
                message = 'Message too long. Maximum 1000 characters allowed';
            }
            break;
    }

    if (!isValid) {
        showFieldError(fieldId, message);
    } else {
        clearFieldError(fieldId);
    }

    return isValid;
}

function handleContactSubmission() {
    clearAllErrors();
    
    const formData = {
        firstName: getValue('firstName'),
        lastName: getValue('lastName'),
        email: getValue('email'),
        phone: getValue('phone'),
        message: getValue('message')
    };

    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(field => {
        if (!formData[field]) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (!validateContactField(field, formData[field])) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please correct the errors in the form before submitting.', 'danger');
        return;
    }

    // Confirmation
    const confirmMsg = `Send message from ${formData.firstName} ${formData.lastName} (${formData.email})?`;
    if (!confirm(confirmMsg)) return;

    // Submit
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        document.getElementById('contactForm').reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        showNotification(`Thank you ${formData.firstName}! Your message has been sent successfully. We will get back to you within 24 hours.`, 'success');
    }, 1500);
}

// ---------------------------
// UTILITY FUNCTIONS
// ---------------------------
function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && 
           email.length <= 254 && 
           !email.includes('..') && 
           !email.startsWith('.') && 
           !email.endsWith('.');
}

function isValidAppointmentDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= tomorrow && selectedDate <= maxDate;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

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

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('is-invalid');
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearAllErrors() {
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(error => {
        error.remove();
    });
}

function showNotification(message, type = 'info') {
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

// ---------------------------
// ADDITIONAL FEATURES
// ---------------------------
function initializeSmoothScrolling() {
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
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.click();
            }
        }
    });
}
