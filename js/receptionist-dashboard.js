// Responsive CareHealth Receptionist Dashboard JS with enhanced validation and demo data

let patients = [];
let patientAutoId = 1006;
let appointments = [];
let appointmentId = 8;
let payments = [];
let statusPie = undefined;

// --- Hamburger Sidebar Toggle for Mobile ---
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('sidebarToggleBtn');
    if (btn) {
        btn.onclick = function() {
            document.body.classList.toggle('sidebar-open');
            document.querySelector('.sidebar-container').classList.toggle('active');
        };
        // Close sidebar if clicking overlay
        window.addEventListener('click', function(e) {
            if (document.body.classList.contains('sidebar-open') && e.target === document.body) {
                document.body.classList.remove('sidebar-open');
                document.querySelector('.sidebar-container')?.classList.remove('active');
            }
        });
    }
    setupDashDarkMode();
    loadPatientsSample();
    loadSampleAppointments();
    loadSamplePayments();
    showSection(null, 'dashboard');
    updateEverything();
    setInterval(updateEverything, 20000);
});

function loadPatientsSample() {
    patients = [
        {regno:"REG1000",name:"John Doe",age:35,blood:"O+",phone:"9876543210",email:"john.doe@email.com",address:"Main Street, City",gender:"Male",emergencyContact:"9876543299",checkedIn:true, disabled:false,dateAdded:todayStr()},
        {regno:"REG1001",name:"Jane Smith",age:29,blood:"A-",phone:"9876543211",email:"jane.smith@email.com",address:"Central Ave, Town",gender:"Female",emergencyContact:"9876543288",checkedIn:false, disabled:false,dateAdded:dateOffset(-1)},
        {regno:"REG1002",name:"Robert Lee",age:42,blood:"B+",phone:"9876543212",email:"",address:"Park Lane, MegaCity",gender:"Male",emergencyContact:"",checkedIn:true, disabled:false,dateAdded:dateOffset(-2)},
        {regno:"REG1003",name:"Maria Garcia",age:55,blood:"AB-",phone:"9923568723",email:"maria.garcia@email.com",address:"Hillview Towers, Uptown",gender:"Female",emergencyContact:"9923568799",checkedIn:false, disabled:false,dateAdded:dateOffset(-3)},
        {regno:"REG1004",name:"Rahul Mehta",age:22,blood:"A+",phone:"9014532345",email:"rahul.mehta@email.com",address:"Lake Road, Greenfield",gender:"Male",emergencyContact:"9014532399",checkedIn:true, disabled:false,dateAdded:dateOffset(-4)},
        {regno:"REG1005",name:"Fatima Noor",age:61,blood:"O-",phone:"9987123467",email:"",address:"Sunview Colony, Block 3",gender:"Female",emergencyContact:"9987123499",checkedIn:false, disabled:true,dateAdded:dateOffset(-5)}
    ];
    patientAutoId = 1006;
}

function loadSampleAppointments() {
    let today = todayStr(), tomorrow = dateOffset(1), yesterday = dateOffset(-1);
    appointments = [
        { id: 1, time: '09:00', patientId: 'REG1000', patientName: 'John Doe', doctor: 'Dr. Smith',   department: 'Cardiology',   status: 'confirmed', date: today },
        { id: 2, time: '10:15', patientId: 'REG1001', patientName: 'Jane Smith', doctor: 'Dr. Johnson', department: 'Neurology',    status: 'waiting',   date: today },
        { id: 3, time: '11:40', patientId: 'REG1003', patientName: 'Maria Garcia', doctor: 'Dr. Gupta', department: 'Pediatrics',   status: 'completed', date: today },
        { id: 4, time: '13:00', patientId: 'REG1004', patientName: 'Rahul Mehta', doctor: 'Dr. Agarwal',department: 'Radiology',   status: 'confirmed', date: today },
        { id: 5, time: '15:00', patientId: 'REG1002', patientName: 'Robert Lee', doctor: 'Dr. Martin', department: 'Orthopedics', status: 'confirmed', date: today },
        { id: 6, time: '16:30', patientId: 'REG1005', patientName: 'Fatima Noor', doctor: 'Dr. Jain', department: 'Cardiology',   status: 'cancelled', date: yesterday },
        { id: 7, time: '09:30', patientId: 'REG1004', patientName: 'Rahul Mehta', doctor: 'Dr. Gupta', department: 'Pediatrics',   status: 'confirmed', date: tomorrow }
    ];
    appointmentId = 8;
}

function loadSamplePayments() {
    let today = todayStr(), yesterday = dateOffset(-1);
    payments = [
        { id: 1, patientId: 'REG1000', patientName: 'John Doe',     service: 'Consultation', amount: 500,   method: 'cash',  date: today,     time: '09:15' },
        { id: 2, patientId: 'REG1004', patientName: 'Rahul Mehta',  service: 'Lab Tests',    amount: 1500,  method: 'card',  date: today,     time: '13:05' },
        { id: 3, patientId: 'REG1003', patientName: 'Maria Garcia', service: 'X-Ray',        amount: 800,   method: 'upi',   date: yesterday, time: '14:20' },
        { id: 4, patientId: 'REG1001', patientName: 'Jane Smith',   service: 'Consultation', amount: 500,   method: 'cash',  date: yesterday, time: '10:33' }
    ];
}

// Utility for demo time/dates and DOM set/get
function todayStr() { return new Date().toISOString().split('T')[0]; }
function dateOffset(days) { let d=new Date(); d.setDate(d.getDate()+days); return d.toISOString().split('T')[0]; }
function localTime() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function get(id) { let el=typeof id==='string'?document.getElementById(id):id; return el?el.value||el.textContent||'':''; }
function set(id,val){if(!id) return; let el=typeof id==='string'?document.getElementById(id):id; if(el) {el.value!==undefined?el.value=val:el.innerHTML=val;} }

// --- Dark Mode ---
function setupDashDarkMode() {
    if (localStorage.getItem('dashboardDarkMode') === 'enabled') enableDashDarkMode();
    const btn = document.getElementById('dashDarkModeToggle');
    if (btn) {
        btn.addEventListener('click',()=>{
            if (document.body.classList.contains('dark-mode')) disableDashDarkMode();
            else enableDashDarkMode();
        });
    }
    function enableDashDarkMode() {
        document.body.classList.add('dark-mode');
        document.getElementById('dashDarkModeIcon').className = 'fas fa-sun';
        localStorage.setItem('dashboardDarkMode','enabled');
        if(window.statusPie) { statusPie.options.plugins.legend.labels.color="#e0e5ee"; statusPie.update();}
    }
    function disableDashDarkMode() {
        document.body.classList.remove('dark-mode');
        document.getElementById('dashDarkModeIcon').className = 'fas fa-moon';
        localStorage.setItem('dashboardDarkMode','disabled');
        if(window.statusPie) { statusPie.options.plugins.legend.labels.color="#222"; statusPie.update();}
    }
}

// --- Navigation / Section Switching ---
function showSection(event, section) {
    if (event) event.preventDefault();
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
    document.querySelectorAll('.sidebar .list-group-item').forEach(item=>item.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    // On mobile, also auto-close sidebar for better UX
    if (window.innerWidth < 700) {
        document.body.classList.remove('sidebar-open');
        document.querySelector('.sidebar-container')?.classList.remove('active');
    }
    if (section === 'appointments') loadAppointmentsTable();
    if (section === 'patients') selectPatientTab('add');
    if (section === 'billing') { loadBillingData(); loadRecentPayments(); setupBillingForm(); }
    if (section === 'reports') updateReports();
}
function showMainMenu() { showSection(null,'dashboard'); }

// --- Dashboard Stats & Next Appointments ---
function updateEverything() {
    updateStats();
    updateNextAppointments();
    updateReports();
}

function updateStats() {
    const today = todayStr();
    set('todayAppointments', appointments.filter(a => a.date === today).length);
    set('checkedInPatients', patients.filter(p => !p.disabled && p.checkedIn).length);
    set('waitingPatients', appointments.filter(a => a.status === 'waiting' && a.date === today).length);
    set('todayRevenue', '₹'+payments.filter(p => p.date === today).reduce((sum, p) => sum + Number(p.amount), 0));
}

function updateNextAppointments() {
    const today = todayStr();
    const upcoming = appointments.filter(a => a.date === today && a.status === 'confirmed')
        .sort((a, b) => a.time.localeCompare(b.time)).slice(0, 4);
    const box = document.getElementById('nextAppointments');
    if (!box) return;
    if (!upcoming.length) box.innerHTML = '<div class="text-muted">None scheduled</div>';
    else box.innerHTML = upcoming.map(a =>
        `<div class="appointment-card mb-2 pb-2 border-bottom">
            <strong class="d-block">${a.time} - ${a.patientName}</strong>
            <span class="text-secondary small">${a.doctor}, ${a.department}</span>
        </div>`).join('');
}

// --- Enhanced Patient Management (CRUD, Validation) ---
function selectPatientTab(tab) {
    ['Add', 'List', 'Search'].forEach(t=> {
        const el=document.getElementById('patTab'+t); if (el) el.classList.remove('active');
    });
    const act=document.getElementById('patTab'+tab.charAt(0).toUpperCase()+tab.slice(1));
    if (act) act.classList.add('active');
    const pane = document.getElementById('patientTabPane');
    if (!pane) return;
    
    if (tab === "add") {
        pane.innerHTML = `
        <form id="addEditPatientForm" class="row g-3 mt-1" style="max-width:530px;">
            <div class="col-md-6">
                <label for="patFullName" class="form-label">Full Name *</label>
                <input type="text" class="form-control" id="patFullName" required>
                <div class="invalid-feedback" id="patFullName-error"></div>
            </div>
            <div class="col-md-3">
                <label for="patAge" class="form-label">Age *</label>
                <input type="number" class="form-control" id="patAge" required min="0" max="120">
                <div class="invalid-feedback" id="patAge-error"></div>
            </div>
            <div class="col-md-3">
                <label for="patBlood" class="form-label">Blood Group *</label>
                <select class="form-select" id="patBlood" required>
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+ (A Positive)</option>
                    <option value="A-">A- (A Negative)</option>
                    <option value="B+">B+ (B Positive)</option>
                    <option value="B-">B- (B Negative)</option>
                    <option value="AB+">AB+ (AB Positive)</option>
                    <option value="AB-">AB- (AB Negative)</option>
                    <option value="O+">O+ (O Positive)</option>
                    <option value="O-">O- (O Negative)</option>
                </select>
                <div class="invalid-feedback" id="patBlood-error"></div>
            </div>
            <div class="col-12 col-md-6">
                <label for="patPhone" class="form-label">Phone Number *</label>
                <input type="tel" class="form-control" id="patPhone" required maxlength="10">
                <div class="invalid-feedback" id="patPhone-error"></div>
                <div class="form-text">Enter 10-digit phone number</div>
            </div>
            <div class="col-12 col-md-6">
                <label for="patEmail" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="patEmail">
                <div class="invalid-feedback" id="patEmail-error"></div>
            </div>
            <div class="col-12">
                <label for="patAddress" class="form-label">Address *</label>
                <textarea class="form-control" id="patAddress" required rows="2" minlength="10" maxlength="200"></textarea>
                <div class="invalid-feedback" id="patAddress-error"></div>
                <div class="form-text">Minimum 10 characters, Maximum 200 characters</div>
            </div>
            <div class="col-12 col-md-6">
                <label for="patGender" class="form-label">Gender *</label>
                <select class="form-select" id="patGender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <div class="invalid-feedback" id="patGender-error"></div>
            </div>
            <div class="col-12 col-md-6">
                <label for="patEmergencyContact" class="form-label">Emergency Contact</label>
                <input type="tel" class="form-control" id="patEmergencyContact" maxlength="10">
                <div class="invalid-feedback" id="patEmergencyContact-error"></div>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary mt-2">
                    <i class="fas fa-user-plus me-2"></i>Add Patient
                </button>
            </div>
        </form>
        `;
        
        // Initialize real-time validation
        initializePatientFormValidation();
        
        document.getElementById('addEditPatientForm').onsubmit = function(e){
            e.preventDefault();
            addPatientWithValidation();
        };
    } else if (tab === "list") {
        showPatientListTab();
    } else if (tab === "search") {
        pane.innerHTML = `
        <div class="row g-3">
            <div class="col-sm-6">
                <form onsubmit="event.preventDefault();doPatientSearchTab('reg')" style="display:flex;gap:.5rem;">
                    <input type="text" class="form-control" id="psrch_reg" placeholder="Reg. Number">
                    <button class="btn btn-info" type="submit"><i class="fas fa-search"></i></button>
                </form>
            </div>
            <div class="col-sm-6">
                <form onsubmit="event.preventDefault();doPatientSearchTab('phone')" style="display:flex;gap:.5rem;">
                    <input type="tel" class="form-control" id="psrch_phone" placeholder="Phone Number">
                    <button class="btn btn-success" type="submit"><i class="fas fa-search"></i></button>
                </form>
            </div>
        </div>
        <div id="patientSearchResult" class="mt-4"></div>
        `;
    }
}

// Enhanced patient form validation
function initializePatientFormValidation() {
    // Real-time validation for patient name
    const nameField = document.getElementById('patFullName');
    if (nameField) {
        nameField.addEventListener('input', function(e) {
            const value = e.target.value.trim();
            if (value && !/^[A-Za-z\s]{2,50}$/.test(value)) {
                showPatientFieldError('patFullName', 'Name must contain only letters and spaces (2-50 characters)');
            } else {
                clearPatientFieldError('patFullName');
            }
        });
    }

    // Age validation
    const ageField = document.getElementById('patAge');
    if (ageField) {
        ageField.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (value && (value < 0 || value > 120)) {
                showPatientFieldError('patAge', 'Age must be between 0 and 120 years');
            } else {
                clearPatientFieldError('patAge');
            }
        });
    }

    // Phone validation with auto-formatting
    const phoneField = document.getElementById('patPhone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            // Remove non-digits
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
            
            if (value && !/^[0-9]{10}$/.test(value)) {
                showPatientFieldError('patPhone', 'Phone number must be exactly 10 digits');
            } else {
                clearPatientFieldError('patPhone');
            }
        });
    }

    // Email validation
    const emailField = document.getElementById('patEmail');
    if (emailField) {
        emailField.addEventListener('blur', function(e) {
            const value = e.target.value.trim();
            if (value && !validateEmailFormat(value)) {
                showPatientFieldError('patEmail', 'Please enter a valid email address');
            } else {
                clearPatientFieldError('patEmail');
            }
        });
    }

    // Address validation
    const addressField = document.getElementById('patAddress');
    if (addressField) {
        addressField.addEventListener('input', function(e) {
            const value = e.target.value.trim();
            if (value.length > 0 && value.length < 10) {
                showPatientFieldError('patAddress', 'Address must be at least 10 characters long');
            } else if (value.length > 200) {
                showPatientFieldError('patAddress', 'Address must not exceed 200 characters');
            } else {
                clearPatientFieldError('patAddress');
            }
        });
    }

    // Emergency contact validation
    const emergencyField = document.getElementById('patEmergencyContact');
    if (emergencyField) {
        emergencyField.addEventListener('input', function(e) {
            // Remove non-digits
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
            
            if (value && !/^[0-9]{10}$/.test(value)) {
                showPatientFieldError('patEmergencyContact', 'Emergency contact must be exactly 10 digits');
            } else {
                clearPatientFieldError('patEmergencyContact');
            }
        });
    }
}

// Enhanced patient addition with comprehensive validation
function addPatientWithValidation() {
    // Clear all previous errors
    clearAllPatientErrors();
    
    // Get form data
    const formData = {
        name: get('patFullName').trim(),
        age: get('patAge').trim(),
        blood: get('patBlood'),
        phone: get('patPhone').trim(),
        email: get('patEmail').trim(),
        address: get('patAddress').trim(),
        gender: get('patGender'),
        emergencyContact: get('patEmergencyContact').trim()
    };

    let isValid = true;

    // Required field validation
    const requiredFields = ['name', 'age', 'blood', 'phone', 'address', 'gender'];
    requiredFields.forEach(field => {
        if (!formData[field]) {
            showPatientFieldError(getFieldId(field), 'This field is required');
            isValid = false;
        }
    });

    // Name validation
    if (formData.name && !/^[A-Za-z\s]{2,50}$/.test(formData.name)) {
        showPatientFieldError('patFullName', 'Name must contain only letters and spaces (2-50 characters)');
        isValid = false;
    }

    // Age validation
    const age = parseInt(formData.age);
    if (formData.age && (isNaN(age) || age < 0 || age > 120)) {
        showPatientFieldError('patAge', 'Age must be between 0 and 120 years');
        isValid = false;
    }

    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
        showPatientFieldError('patPhone', 'Phone number must be exactly 10 digits');
        isValid = false;
    }

    // Check for duplicate phone number
    if (formData.phone && patients.some(p => p.phone === formData.phone)) {
        showPatientFieldError('patPhone', 'A patient with this phone number already exists');
        isValid = false;
    }

    // Email validation (optional)
    if (formData.email && !validateEmailFormat(formData.email)) {
        showPatientFieldError('patEmail', 'Please enter a valid email address');
        isValid = false;
    }

    // Address validation
    if (formData.address && (formData.address.length < 10 || formData.address.length > 200)) {
        showPatientFieldError('patAddress', 'Address must be between 10-200 characters');
        isValid = false;
    }

    // Emergency contact validation (optional)
    if (formData.emergencyContact && !/^[0-9]{10}$/.test(formData.emergencyContact)) {
        showPatientFieldError('patEmergencyContact', 'Emergency contact must be exactly 10 digits');
        isValid = false;
    }

    if (!isValid) {
        showAlert('Please correct the errors in the form before submitting.', 'danger');
        return;
    }

    // Confirmation before adding
    if (!confirm(`Add patient: ${formData.name}, Age: ${formData.age}, Phone: ${formData.phone}?`)) {
        return;
    }

    // Create patient record
    const regno = "REG" + String(patientAutoId++);
    const newPatient = {
        regno,
        name: formData.name,
        age: formData.age,
        blood: formData.blood,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        checkedIn: false,
        disabled: false,
        dateAdded: todayStr()
    };

    patients.push(newPatient);
    showAlert(`Patient added successfully! Registration Number: <strong>${regno}</strong>`, 'success');
    
    // Reset form
    document.getElementById('addEditPatientForm').reset();
    clearAllPatientErrors();
    
    // Update displays
    showPatientListTab();
    updateEverything();
}

// Helper functions for patient validation
function getFieldId(field) {
    const fieldMap = {
        'name': 'patFullName',
        'age': 'patAge',
        'blood': 'patBlood',
        'phone': 'patPhone',
        'email': 'patEmail',
        'address': 'patAddress',
        'gender': 'patGender',
        'emergencyContact': 'patEmergencyContact'
    };
    return fieldMap[field] || field;
}

function showPatientFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('is-invalid');
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function clearPatientFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('is-invalid');
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

function clearAllPatientErrors() {
    const fields = ['patFullName', 'patAge', 'patBlood', 'patPhone', 'patEmail', 'patAddress', 'patGender', 'patEmergencyContact'];
    fields.forEach(fieldId => {
        clearPatientFieldError(fieldId);
    });
}

// Email validation helper
function validateEmailFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && 
           email.length <= 254 && 
           !email.includes('..') && 
           !email.startsWith('.') && 
           !email.endsWith('.');
}

function showPatientListTab() {
    const pane = document.getElementById('patientTabPane');
    let html = `
    <input class="form-control mb-3" type="text" id="patListSearchInput" placeholder="Search by Name / Phone / Reg # ..." onkeyup="showPatientListTab()">
    <div class="table-responsive"><table class="table table-sm align-middle">
        <thead>
            <tr>
                <th>Reg. No</th><th>Name</th><th>Age</th><th>Gender</th>
                <th>Blood</th><th>Phone</th><th>Address</th><th>Status</th><th>Action</th>
            </tr>
        </thead><tbody>
    `;
    let search = (document.getElementById('patListSearchInput')||{}).value?.toLowerCase() || '';
    let filtered = patients.filter(p =>
        (!search || p.name.toLowerCase().includes(search) || p.phone.includes(search) || p.regno.toLowerCase().includes(search))
    );
    if (!filtered.length) html += `<tr><td colspan="9" class="text-center">No patients found.</td></tr>`;
    filtered.forEach(p => {
        html += `<tr${p.disabled?' style="color:#b0b0b0;background:#f7f7f7;"':''}>
            <td>${p.regno}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.gender || 'N/A'}</td>
            <td>${p.blood}</td>
            <td>${p.phone}</td>
            <td>${p.address}</td>
            <td>${p.disabled?'<span class="badge bg-danger">Disabled</span>':'<span class="badge bg-success">Active</span>'}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="showPatientDetailModal('${p.regno}')"><i class="fas fa-eye"></i></button>
            </td>
        </tr>`;
    });
    html += "</tbody></table></div>";
    pane.innerHTML = html;
}

function doPatientSearchTab(type) {
    let val = type==='reg' ? get('psrch_reg').trim() : get('psrch_phone').trim();
    const pat = type==='reg'
        ? patients.find(p=>p.regno.toLowerCase()===val.toLowerCase())
        : patients.find(p=>p.phone===val);
    let html = "";
    if (!pat) html = `<div class="alert alert-danger">Patient not found.</div>`;
    else html = getPatientDetailHtml(pat);
    set('patientSearchResult', html);
}

function getPatientDetailHtml(p) {
    return `
    <ul class="list-group list-group-flush mb-2">
        <li class="list-group-item"><b>Reg. Number:</b> ${p.regno}</li>
        <li class="list-group-item"><b>Name:</b> ${p.name}</li>
        <li class="list-group-item"><b>Age:</b> ${p.age}</li>
        <li class="list-group-item"><b>Gender:</b> ${p.gender || 'N/A'}</li>
        <li class="list-group-item"><b>Blood Group:</b> ${p.blood}</li>
        <li class="list-group-item"><b>Phone:</b> ${p.phone}</li>
        <li class="list-group-item"><b>Email:</b> ${p.email || 'N/A'}</li>
        <li class="list-group-item"><b>Address:</b> ${p.address}</li>
        <li class="list-group-item"><b>Emergency Contact:</b> ${p.emergencyContact || 'N/A'}</li>
        <li class="list-group-item"><b>Status:</b> ${p.disabled?'<span class="badge bg-danger">Disabled</span>':'<span class="badge bg-success">Active</span>'}</li>
    </ul>
    <div class="mb-2">
        <button class="btn btn-primary me-1" onclick="openEditPatientModal('${p.regno}')"><i class="fas fa-edit me-1"></i>Edit</button>
        <button class="btn btn-danger me-1" onclick="toggleDisablePatient('${p.regno}')"><i class="fas fa-ban me-1"></i>${p.disabled?'Enable':'Disable'}</button>
        <button class="btn btn-dark" onclick="selectPatientTab('search')">Go Back</button>
    </div>
    `;
}

function showPatientDetailModal(regno) {
    const p = patients.find(p=>p.regno===regno);
    if (!p) return;
    set('patientDetailBody', getPatientDetailHtml(p));
    set('patientDetailFooter', "");
    new bootstrap.Modal(document.getElementById('patientDetailModal')).show();
}

function openAddPatientModal() { selectPatientTab('add'); }

function openEditPatientModal(regno) {
    const p = patients.find(p=>p.regno===regno);
    if (!p) return;
    set('addPatientLabel',"Edit Patient");
    set('patModalSubmitBtn',"Save");
    set('patFullName',p.name);
    set('patAge',p.age);
    set('patBlood',p.blood);
    set('patPhone',p.phone);
    set('patAddress',p.address);
    set('editPatientRegNo',regno);
    document.getElementById('addEditPatientForm').onsubmit = function(e) {
        e.preventDefault();
        let name = get('patFullName').trim();
        let age = get('patAge').trim();
        let blood = get('patBlood').trim().toUpperCase();
        let phone = get('patPhone').trim();
        let address = get('patAddress').trim();
        if (!name || !age || !blood || !phone || !address) return showAlert('Please fill all fields.','danger');
        if (!/^[A-Za-z\s]+$/.test(name)) return showAlert('Name must be letters only.','danger');
        if (isNaN(age)||age<0||age>120) return showAlert('Invalid age.','danger');
        if (!/^(A|B|AB|O)[+-]$/.test(blood)) return showAlert('Blood group must be like A+, O-, etc.','danger');
        if (!/^\d{10}$/.test(phone)) return showAlert('Enter valid 10-digit phone.','danger');
        Object.assign(p, {name,age,blood,phone,address});
        showAlert('Patient updated!','success');
        bootstrap.Modal.getInstance(document.getElementById('patientModal')).hide();
        selectPatientTab('list');
        updateEverything();
    };
    new bootstrap.Modal(document.getElementById('patientModal')).show();
}

function toggleDisablePatient(regno) {
    let p = patients.find(p=>p.regno===regno);
    if (p) {
        p.disabled = !p.disabled;
        showAlert(p.disabled ? "Patient disabled." : "Patient enabled.", p.disabled ? 'danger':'success');
        selectPatientTab('list');
        updateEverything();
    }
}

// --- Appointments ---
function loadAppointmentsTable(list = appointments) {
    const tbody = document.getElementById('appointmentsTable');
    if (!tbody) return;
    tbody.innerHTML = list.map(a => `
    <tr>
        <td>${a.time}</td>
        <td>${a.patientName}</td>
        <td class="d-none d-md-table-cell">${a.doctor || ''}</td>
        <td class="d-none d-lg-table-cell">${a.department || ''}</td>
        <td>
            <span class="badge status-${a.status}">
                ${capitalize(a.status)}
            </span>
            ${a.status !== 'completed' ? ' <button class="btn btn-sm btn-outline-success ms-2" onclick="setStatus('+a.id+',\'completed\')">Done</button>' : ''}
        </td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="editAppointment(${a.id})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${a.id})"><i class="fas fa-times"></i></button>
        </td>
    </tr>`).join('');
}

function searchAppointments() {
    const search = get('searchAppointments').toLowerCase();
    if (!search) { loadAppointmentsTable(); return; }
    const filtered = appointments.filter(a =>
        a.patientName.toLowerCase().includes(search) ||
        (a.doctor && a.doctor.toLowerCase().includes(search)) ||
        (a.department && a.department.toLowerCase().includes(search))
    );
    loadAppointmentsTable(filtered);
}

function openAddAppointmentModal() {
    showAlert('Add Appointment not implemented in demo','info');
}

function setStatus(id, status) {
    const apt = appointments.find(a=>a.id===id);
    if (apt) { apt.status = status; loadAppointmentsTable(); updateEverything(); }
    showAlert("Status updated to "+capitalize(status),'info');
}

function editAppointment(id) { showAlert("Edit appointment not available in this demo.","info"); }

function cancelAppointment(id) {
    if (confirm("Cancel this appointment?")) {
        appointments = appointments.filter(a => a.id !== id);
        showAlert("Appointment cancelled.","warning");
        loadAppointmentsTable();
        updateEverything();
    }
}

function capitalize(str) { return str?str[0].toUpperCase()+str.slice(1):''; }

// --- Billing, Payments, Receipt ---
function loadBillingData() {
    const sel = document.getElementById('billingPatient');
    if(sel) sel.innerHTML = patients.filter(p=>!p.disabled).map(p => `<option value="${p.regno}">${p.name}</option>`).join('');
}

function loadRecentPayments() {
    const div = document.getElementById('recentPayments');
    if(!div) return;
    let recent = payments.slice(-5).reverse();
    if(!recent.length) { div.innerHTML = '<p class="text-muted">No payments yet.</p>'; return;}
    div.innerHTML = recent.map(p =>
        `<div class="card mb-2">
            <div class="card-body p-3">
                <strong>${p.patientName}</strong><br>
                <span class="small text-muted">${p.service}</span><br>
                <span>${p.method}, <b>₹${p.amount}</b></span>
                <div class="small text-muted">${p.date} ${p.time}</div>
                <button class="btn btn-sm btn-outline-info mt-2" onclick="generateReceipt('${p.patientName}','${p.service}',${p.amount},'${p.method}','${p.date}','${p.time}')"><i class="fas fa-print"></i> Print Receipt</button>
            </div>
        </div>`
    ).join('');
}

function setupBillingForm() {
    const form = document.getElementById('billingForm');
    if (!form) return;
    form.onsubmit = function(e){
        e.preventDefault();
        const patientId = get('billingPatient');
        const patientObj = patients.find(p => p.regno === patientId);
        const serviceStr = get('billingService') || "";
        const [service, amt] = serviceStr.split("|");
        const amount = Number(get('billingAmount')) || Number(amt);
        const method = get('paymentMethod');
        if (!patientObj || !service || !amount || !method) {
            showAlert('Fill all payment fields.','danger'); return;
        }
        const pmt = {
            id: Date.now(), patientId, patientName: patientObj.name,
            service, amount, method, date: todayStr(), time: localTime()
        };
        payments.push(pmt);
        form.reset();
        showAlert('Payment processed!','success');
        loadRecentPayments();
        generateReceipt(patientObj.name, service, amount, method, pmt.date, pmt.time);
        updateEverything();
    };
}

function generateReceipt(patient, service, amount, method, date, time) {
    date = date || todayStr();
    time = time || localTime();
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Payment Receipt</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 28px; margin:0; background: #f6f9ff; color: #222; }
                    .receipt-card { background: #fff; border-radius: 14px; box-shadow:0 6px 26px #2255b208; max-width:340px; margin:32px auto; padding:28px 28px 14px 28px; }
                    .receipt-card h2 { color: #4285f4; margin-bottom: 0.55em; font-weight:700; }
                    .receipt-row { display:flex; justify-content:space-between; padding:4px 0; }
                    .receipt-label { color:#888;}
                    .total { font-size:1.15rem; font-weight:700; }
                    .thanks { text-align:center; margin-top:16px; color:#5ab882; }
                    .print-btn {margin:14px auto 0 auto; display:block; padding:8px 36px; font-size:1rem;}
                </style>
            </head>
            <body>
                <div class="receipt-card">
                    <h2>CareHealth Hospital</h2>
                    <h5 style="color:#0aa;text-align:center; margin-bottom:18px;">Payment Receipt</h5>
                    <div class="receipt-row"><span class="receipt-label">Patient</span><span>${patient}</span></div>
                    <div class="receipt-row"><span class="receipt-label">Service</span><span>${service}</span></div>
                    <div class="receipt-row"><span class="receipt-label">Amount</span><span>₹${amount}</span></div>
                    <div class="receipt-row"><span class="receipt-label">Payment Method</span><span>${method}</span></div>
                    <div class="receipt-row"><span class="receipt-label">Date</span><span>${date}</span></div>
                    <div class="receipt-row"><span class="receipt-label">Time</span><span>${time}</span></div>
                    <div class="receipt-row total mt-2 mb-1"><span>Total Paid</span><span>₹${amount}</span></div>
                    <hr>
                    <div class="thanks">Thank you for your payment!</div>
                    <button class="print-btn btn btn-primary" onclick="window.print()">Print Receipt</button>
                </div>
            </body>
        </html>
    `);
    setTimeout(()=>{ try{ win.print(); }catch(e){} }, 350);
}

// --- Reports ---
function updateReports() {
    set('reportAppointments', appointments.length);
    set('reportRevenue', '₹' + payments.reduce((sum,p)=>sum+Number(p.amount),0));
    set('reportPatients', patients.length);
    let dist = {confirmed:0,waiting:0,completed:0,cancelled:0};
    appointments.forEach(a=>{ dist[a.status]?dist[a.status]++:(dist[a.status]=1); });
    const ctx = document.getElementById('statusPieChart').getContext('2d');
    if(statusPie) statusPie.destroy();
    statusPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Confirmed','Waiting','Completed','Cancelled'],
            datasets: [{
                data: [dist.confirmed||0,dist.waiting||0,dist.completed||0,dist.cancelled||0],
                backgroundColor: ['#42a5f5','#ffd600','#43ea70','#ea4335']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 },
                        color: document.body.classList.contains('dark-mode') ? "#e0e5ee" : "#222"
                    }
                }
            }
        }
    });
}

// --- Alerts, Logout ---
function showAlert(message, type='info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => { if (alertDiv.parentNode) alertDiv.remove(); }, 4200);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('receptionistLogin');
        localStorage.removeItem('userRole');
        setTimeout(() => { window.location.href = '../index.html'; }, 800);
    }
}
