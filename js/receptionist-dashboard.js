// Responsive CareHealth Receptionist Dashboard JS with demo data and sidebar hamburger

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
        {regno:"REG1000",name:"John Doe",age:35,blood:"O+",phone:"9876543210",address:"Main Street, City",checkedIn:true, disabled:false},
        {regno:"REG1001",name:"Jane Smith",age:29,blood:"A-",phone:"9876543211",address:"Central Ave, Town",checkedIn:false, disabled:false},
        {regno:"REG1002",name:"Robert Lee",age:42,blood:"B+",phone:"9876543212",address:"Park Lane, MegaCity",checkedIn:true, disabled:false},
        {regno:"REG1003",name:"Maria Garcia",age:55,blood:"AB-",phone:"9923568723",address:"Hillview Towers, Uptown",checkedIn:false, disabled:false},
        {regno:"REG1004",name:"Rahul Mehta",age:22,blood:"A+",phone:"9014532345",address:"Lake Road, Greenfield",checkedIn:true, disabled:false},
        {regno:"REG1005",name:"Fatima Noor",age:61,blood:"O-",phone:"9987123467",address:"Sunview Colony, Block 3",checkedIn:false, disabled:true}
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

// --- Patient Management (CRUD, Validation) ---
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
                <label for="patFullName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="patFullName" required pattern="[A-Za-z\\s]+" title="Only letters and spaces">
            </div>
            <div class="col-md-3">
                <label for="patAge" class="form-label">Age</label>
                <input type="number" class="form-control" id="patAge" required min="0" max="120">
            </div>
            <div class="col-md-3">
                <label for="patBlood" class="form-label">Blood Group</label>
                <input type="text" class="form-control" id="patBlood" required maxlength="4" pattern="^(A|B|AB|O)[+-]$" placeholder="O+, AB-">
            </div>
            <div class="col-12 col-md-6">
                <label for="patPhone" class="form-label">Phone Number</label>
                <input type="tel" class="form-control" id="patPhone" required pattern="\\d{10}" title="Enter 10 digits only">
            </div>
            <div class="col-12 col-md-6">
                <label for="patAddress" class="form-label">Address</label>
                <input type="text" class="form-control" id="patAddress" required>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary mt-2"><i class="fas fa-user-plus me-2"></i>Add Patient</button>
            </div>
        </form>
        `;
        document.getElementById('addEditPatientForm').onsubmit = function(e){
            e.preventDefault();
            addPatientTab();
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
function addPatientTab() {
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
    let regno = "REG" + String(patientAutoId++);
    patients.push({regno,name,age,blood,phone,address,checkedIn:false,disabled:false});
    showAlert('Successfully added. Reg. No: <b>'+regno+'</b>', 'success');
    document.getElementById('addEditPatientForm').reset();
    showPatientListTab();
    updateEverything();
}
function showPatientListTab() {
    const pane = document.getElementById('patientTabPane');
    let html = `
    <input class="form-control mb-3" type="text" id="patListSearchInput" placeholder="Search by Name / Phone / Reg # ..." onkeyup="showPatientListTab()">
    <div class="table-responsive"><table class="table table-sm align-middle">
        <thead>
            <tr>
                <th>Reg. No</th><th>Name</th><th>Age</th>
                <th>Blood</th><th>Phone</th><th>Address</th><th>Status</th><th>Action</th>
            </tr>
        </thead><tbody>
    `;
    let search = (document.getElementById('patListSearchInput')||{}).value?.toLowerCase() || '';
    let filtered = patients.filter(p =>
        (!search || p.name.toLowerCase().includes(search) || p.phone.includes(search) || p.regno.toLowerCase().includes(search))
    );
    if (!filtered.length) html += `<tr><td colspan="8" class="text-center">No patients found.</td></tr>`;
    filtered.forEach(p => {
        html += `<tr${p.disabled?' style="color:#b0b0b0;background:#f7f7f7;"':''}>
            <td>${p.regno}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
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
        <li class="list-group-item"><b>Blood Group:</b> ${p.blood}</li>
        <li class="list-group-item"><b>Phone:</b> ${p.phone}</li>
        <li class="list-group-item"><b>Address:</b> ${p.address}</li>
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
        <td>${a.doctor || ''}</td>
        <td>${a.department || ''}</td>
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
        setTimeout(() => { window.location.href = '../html/index.html'; }, 800);
    }
}
