// Admin Dashboard JavaScript

// Handle logout
function logout() {
    console.log('Logging out...');
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).finally(() => {
        localStorage.removeItem('user');
        window.location.replace('/login.html');
    });
}

// Service Management
async function addService(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/services/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).id}`
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert('success', 'Service added successfully');
            form.reset();
            // Refresh service list if on services page
            if (typeof loadServices === 'function') {
                loadServices();
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error adding service:', error);
        showAlert('error', 'Failed to add service: ' + error.message);
    }
}

async function applyFilter(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/services/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).id}`
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (!response.ok) {
            throw new Error('Failed to filter services');
        }

        const services = await response.json();
        updateServiceTable(services);
    } catch (error) {
        console.error('Error filtering services:', error);
        showAlert('error', 'Failed to apply filters');
    }
}

function exportServices() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
        showAlert('error', 'Please log in to export services');
        return;
    }

    window.location.href = `/api/services/export?token=${user.id}`;
}

// User Management
async function addUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).id}`
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert('success', 'User added successfully');
            form.reset();
            // Refresh user list if on users page
            if (typeof loadUsers === 'function') {
                loadUsers();
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showAlert('error', 'Failed to add user: ' + error.message);
    }
}

// Initialize dashboard
async function initializeDashboard() {
    try {
        console.log('Initializing dashboard...');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email || !user.name) {
            console.log('No valid user data found during initialization');
            window.location.replace('/login.html');
            return;
        }

        console.log('Loading dashboard stats for user:', user.email);

        const response = await fetch('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${user.id}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load dashboard stats');
        }
        
        const data = await response.json();
        console.log('Dashboard stats loaded:', data);
        
        // Update statistics
        document.getElementById('totalApplications').textContent = data.total || 0;
        document.getElementById('pendingReview').textContent = data.pending || 0;
        document.getElementById('approved').textContent = data.approved || 0;
        document.getElementById('rejected').textContent = data.rejected || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showAlert('error', 'Failed to load dashboard statistics');
    }
}

// Load recent applications
async function loadRecentApplications() {
    try {
        console.log('Loading recent applications...');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email || !user.name) {
            console.log('No valid user data found while loading applications');
            window.location.replace('/login.html');
            return;
        }

        console.log('Loading applications for user:', user.email);

        const response = await fetch('/api/dashboard/recent-applications', {
            headers: {
                'Authorization': `Bearer ${user.id}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load recent applications');
        }
        
        const applications = await response.json();
        console.log('Recent applications loaded:', applications);
        
        const tbody = document.getElementById('recentApplications');
        if (!tbody) {
            console.log('Applications table not found');
            return;
        }

        if (!applications || applications.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="bi bi-inbox text-muted d-block mb-2" style="font-size: 2rem;"></i>
                        <p class="text-muted mb-0">No applications found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = applications.map(app => `
            <tr>
                <td>${app.id}</td>
                <td>${app.full_name || ''}</td>
                <td>${app.service || ''}</td>
                <td>Rp ${formatNumber(app.amount || 0)}</td>
                <td><span class="status-badge status-${(app.status || '').toLowerCase()}">${app.status || 'Unknown'}</span></td>
                <td>${formatDate(app.created_at)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewApplication(${app.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading recent applications:', error);
        const tbody = document.getElementById('recentApplications');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="bi bi-exclamation-triangle text-warning d-block mb-2" style="font-size: 2rem;"></i>
                        <p class="text-muted mb-0">Failed to load applications. Please try again later.</p>
                    </td>
                </tr>
            `;
        }
        showAlert('error', 'Failed to load recent applications');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing dashboard...');
    initializeDashboard();
    loadRecentApplications();

    // Add event listeners for forms if they exist
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', addService);
    }

    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', applyFilter);
    }

    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', addUser);
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportServices);
    }
});

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

function formatDate(dateStr) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function viewApplication(id) {
    window.location.href = `/admin/application-detail.html?id=${id}`;
}

// Alert system
function showAlert(type, message, duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    if (duration > 0) {
        setTimeout(() => {
            alert.remove();
        }, duration);
    }
}

// Service table update
function updateServiceTable(services) {
    const tbody = document.getElementById('servicesList');
    if (!tbody) return;

    if (!services || services.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="bi bi-inbox text-muted d-block mb-2" style="font-size: 2rem;"></i>
                    <p class="text-muted mb-0">No services found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = services.map(service => `
        <tr>
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>Rp ${formatNumber(service.price)}</td>
            <td>${service.category}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editService(${service.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}
