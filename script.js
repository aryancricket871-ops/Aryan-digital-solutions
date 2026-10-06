// Central Configuration
const CONFIG = {
    companyName: "Aryan Digital Solutions",
    whatsappNumber: "9128692966", // Configurable WhatsApp Number
    adminPassword: "Zxcvbnm", // Requested Admin Password
};

// State setup from LocalStorage (for static prototype persistence)
function loadConfig() {
    const savedWa = localStorage.getItem('aryan_wa_number');
    if (savedWa) CONFIG.whatsappNumber = savedWa;
}
loadConfig();

// --- 1. WhatsApp Redirection Logic ---

function generateWhatsAppLink(service, budget) {
    const text = `Hi ${CONFIG.companyName},\n\nI'm interested in your development service.\n\nRequirement: ${service}\nBudget: ${budget}\n\nI would like to discuss my project.`;
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// Handle Form Submit
document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const service = document.getElementById('user-service').value;
    const budget = document.getElementById('user-budget').value;
    
    if(!service || !budget) {
        alert("Please select both Requirement and Budget.");
        return;
    }

    // Save lead locally (For Admin demo purposes)
    let leads = JSON.parse(localStorage.getItem('aryan_leads') || '[]');
    leads.push({ service, budget, date: new Date().toLocaleString() });
    localStorage.setItem('aryan_leads', JSON.stringify(leads));

    // Redirect to WhatsApp
    window.location.href = generateWhatsAppLink(service, budget);
});

// Direct WA Buttons (Hero & Sticky)
const directWaBtns = document.querySelectorAll('.whatsapp-btn-direct');
directWaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // If clicking generic interest button, open filter form instead of direct WA
        // Because prompt explicitly states: Meta Ad -> Website -> Customer understands -> Selects Budget -> WA
        // So we anchor them to the form.
        if(btn.getAttribute('href') === '#lead-filter') {
            return; // Normal anchor jump behavior
        }
    });
});

// --- 2. Admin Panel Logic (Double Tap/Click) ---

const logo = document.getElementById('logo');
const adminModal = document.getElementById('admin-modal');
const closeAdmin = document.querySelector('.close-admin');

// Double click for Desktop
logo.addEventListener('dblclick', openAdminModal);

// Double tap for Mobile
let lastTap = 0;
logo.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
        openAdminModal();
        e.preventDefault();
    }
    lastTap = currentTime;
});

function openAdminModal() {
    adminModal.style.display = 'flex';
    document.getElementById('admin-login-view').style.display = 'block';
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('admin-pwd').value = '';
    document.getElementById('admin-error').innerText = '';
}

closeAdmin.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

// Admin Login
document.getElementById('admin-login-btn').addEventListener('click', () => {
    const pwd = document.getElementById('admin-pwd').value;
    if (pwd === CONFIG.adminPassword) {
        document.getElementById('admin-login-view').style.display = 'none';
        showAdminDashboard();
    } else {
        document.getElementById('admin-error').innerText = "Incorrect Password!";
    }
});

function showAdminDashboard() {
    document.getElementById('admin-dashboard-view').style.display = 'block';
    document.getElementById('cfg-wa').value = CONFIG.whatsappNumber;
    
    // Load local demo leads
    const leads = JSON.parse(localStorage.getItem('aryan_leads') || '[]');
    const list = document.getElementById('local-leads-list');
    list.innerHTML = '';
    if(leads.length === 0) {
        list.innerHTML = '<li>No recent leads found.</li>';
    } else {
        leads.slice().reverse().forEach(lead => {
            let li = document.createElement('li');
            li.innerText = `${lead.date} - ${lead.service} (${lead.budget})`;
            list.appendChild(li);
        });
    }
}

// Save Admin Config
document.getElementById('save-config-btn').addEventListener('click', () => {
    const newWa = document.getElementById('cfg-wa').value;
    localStorage.setItem('aryan_wa_number', newWa);
    CONFIG.whatsappNumber = newWa;
    alert("Configuration Saved!");
    adminModal.style.display = 'none';
});
