
(function () {
    'use strict';

    // ------------------------------------------------------------
    // TOAST SYSTEM
    // ------------------------------------------------------------
    const toastContainer = document.getElementById('toastContainer');

    function showToast(type, title, message, duration) {
        duration = duration || 4200;
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
                    <div class="toast-icon ${type}"><i class="${icons[type] || icons.info}"></i></div>
                    <div class="toast-body">
                        <div class="toast-title">${title}</div>
                        <div class="toast-msg">${message}</div>
                    </div>
                    <button class="toast-close" aria-label="Dismiss notification">&times;</button>
                `;
        toastContainer.appendChild(toast);
        // trigger show
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            dismissToast(toast);
        });
        if (duration > 0) {
            setTimeout(() => {
                dismissToast(toast);
            }, duration);
        }
        return toast;
    }

    function dismissToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }

    // ------------------------------------------------------------
    // NAVIGATION
    // ------------------------------------------------------------
    const views = {
        index: document.getElementById('viewndex'),
        login: document.getElementById('viewLogin'),
        dashboard: document.getElementById('viewDashboard'),
    };

    let currentView = 'viewindex';

    function navigateTo(viewName) {
        if (viewName === currentView) return;
        // Hide all
        Object.values(views).forEach(v => v.classList.remove('active'));
        // Show target
        const target = views[viewName];
        if (target) {
            target.classList.add('active');
            currentView = viewName;
            // If dashboard, render users
            if (viewName === 'dashboard') {
                renderUsers();
                updateKPIs();
            }
        }
        // Close mobile sidebar if open
        closeSidebar();
        // Close any open drawers/modals
        closeDrawer();
        closeModal();
        closeConfirmModal();
    }

    // Nav links
    document.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.getAttribute('data-nav');
            navigateTo(target);
        });
    });

    // ------------------------------------------------------------
    // SIDEBAR (dashboard)
    // ------------------------------------------------------------
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlayDashboard');
    const mobileToggle = document.getElementById('mobileNavToggle');

    function toggleSidebar() {
        sidebar.classList.toggle('mobile-open');
        sidebarOverlay.classList.toggle('open');
    }

    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('open');
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Sidebar nav items
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.sidebar .nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            // Close sidebar on mobile
            if (window.innerWidth <= 1024) closeSidebar();
            // Show toast as placeholder
            const section = this.getAttribute('data-section') || 'users';
            if (section !== 'users') {
                showToast('info', section.charAt(0).toUpperCase() + section.slice(1),
                    `Navigating to ${section} section.`);
            }
        });
    });

    // ------------------------------------------------------------
    // MOCK USER DATA
    // ------------------------------------------------------------
    const mockUsers = [];
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Quinn', 'Parker', 'Rowan', 'Ellis',
        'Morgan', 'Cameron', 'Logan', 'Sawyer', 'Brooklyn', 'Harper', 'Eden', 'Reese', 'Lennon', 'River'
    ];
    const lastNames = ['Rivera', 'Chen', 'Patel', 'Kim', 'Martinez', 'Singh', 'Okafor', 'Dubois', 'Hasegawa',
        'Moreno', 'Silva', 'Van der Meer', 'Nguyen', 'Kowalski', 'Fitzgerald', 'West', 'Hunt', 'Rose', 'Ford',
        'Pearce'
    ];
    const roles = ['admin', 'moderator', 'member', 'member', 'member', 'guest'];
    const statuses = ['active', 'active', 'active', 'active', 'pending', 'suspended', 'inactive'];
    const domains = ['company.com', 'startup.io', 'enterprise.co', 'global.org', 'nexus.app'];

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function formatDate(d) {
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function generateUsers(count) {
        const users = [];
        for (let i = 0; i < count; i++) {
            const fn = firstNames[i % firstNames.length];
            const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = fn + ' ' + ln;
            const email = fn.toLowerCase() + '.' + ln.toLowerCase() + '@' + domains[Math.floor(Math.random() *
                domains.length)];
            const role = roles[Math.floor(Math.random() * roles.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const joined = randomDate(new Date(2023, 0, 1), new Date(2026, 7, 15));
            const lastActive = randomDate(new Date(2026, 5, 1), new Date(2026, 8, 1));
            users.push({
                id: i + 1,
                name,
                email,
                role,
                status,
                joined: joined.toISOString().split('T')[0],
                joinedDisplay: joined.toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric',
                    year: 'numeric'
                }),
                lastActive: lastActive,
                lastActiveDisplay: formatDate(lastActive),
                avatar: fn.charAt(0) + ln.charAt(0),
            });
        }
        // Ensure some variety
        users[0].status = 'active';
        users[1].status = 'pending';
        users[2].status = 'suspended';
        users[3].status = 'inactive';
        users[0].role = 'admin';
        users[1].role = 'moderator';
        return users;
    }

    // Generate 48 users for pagination
    const allUsers = generateUsers(48);

    // ------------------------------------------------------------
    // STATE
    // ------------------------------------------------------------
    let filteredUsers = [...allUsers];
    let currentPage = 1;
    const pageSize = 10;
    let selectedUserIds = new Set();
    let sortField = 'name';
    let sortAsc = true;
    let editingUserId = null;

    // ------------------------------------------------------------
    // RENDER FUNCTIONS
    // ------------------------------------------------------------
    function getFilteredAndSorted() {
        const search = document.getElementById('userSearch').value.toLowerCase().trim();
        const statusFilter = document.getElementById('statusFilter').value;
        const roleFilter = document.getElementById('roleFilter').value;

        let result = allUsers.filter(u => {
            const matchSearch = u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(
                search);
            const matchStatus = statusFilter === 'all' || u.status === statusFilter;
            const matchRole = roleFilter === 'all' || u.role === roleFilter;
            return matchSearch && matchStatus && matchRole;
        });

        // Sort
        result.sort((a, b) => {
            let va = a[sortField] || '';
            let vb = b[sortField] || '';
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortAsc ? -1 : 1;
            if (va > vb) return sortAsc ? 1 : -1;
            return 0;
        });

        return result;
    }

    function renderUsers() {
        filteredUsers = getFilteredAndSorted();
        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * pageSize;
        const end = Math.min(start + pageSize, total);
        const pageUsers = filteredUsers.slice(start, end);

        const tbody = document.getElementById('userTableBody');
        if (total === 0) {
            tbody.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
                                <i class="fas fa-users-slash" style="font-size:1.8rem;display:block;margin-bottom:0.5rem;opacity:0.3;"></i>
                                <div style="font-weight:500;font-size:1rem;color:var(--text-secondary);">No users found</div>
                                <div style="font-size:0.85rem;">Try adjusting your search or filters.</div>
                            </td>
                        </tr>
                    `;
        } else {
            let html = '';
            pageUsers.forEach(u => {
                const checked = selectedUserIds.has(u.id) ? 'checked' : '';
                html += `
                            <tr class="table-row" data-id="${u.id}" style="cursor:pointer;">
                                <td onclick="event.stopPropagation();">
                                    <input type="checkbox" class="table-checkbox user-checkbox" data-id="${u.id}" ${checked} />
                                </td>
                                <td>
                                    <div class="user-cell">
                                        <div class="avatar-premium">${u.avatar}</div>
                                        <div>
                                            <div class="name">${u.name}</div>
                                            <div class="email">${u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span style="text-transform:capitalize;font-weight:500;color:var(--text-secondary);">${u.role}</span></td>
                                <td><span class="badge-premium ${u.status}"><span class="badge-dot ${u.status}"></span> ${u.status}</span></td>
                                <td style="color:var(--text-secondary);font-size:0.85rem;">${u.lastActiveDisplay}</td>
                                <td style="text-align:right;">
                                    <div class="actions-cell" style="justify-content:flex-end;">
                                        <button class="action-btn view-user" data-id="${u.id}" aria-label="View user"><i class="fas fa-eye"></i></button>
                                        <button class="action-btn edit-user" data-id="${u.id}" aria-label="Edit user"><i class="fas fa-pen"></i></button>
                                        <button class="action-btn danger suspend-user" data-id="${u.id}" aria-label="Suspend user"><i class="fas fa-ban"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `;
            });
            tbody.innerHTML = html;

            // Attach row click for selection
            tbody.querySelectorAll('.table-row').forEach(row => {
                row.addEventListener('click', function (e) {
                    if (e.target.closest('input') || e.target.closest('.actions-cell')) return;
                    const id = parseInt(this.dataset.id);
                    toggleSelectUser(id);
                });
            });

            // Checkbox events
            tbody.querySelectorAll('.user-checkbox').forEach(cb => {
                cb.addEventListener('change', function (e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    if (this.checked) {
                        selectedUserIds.add(id);
                    } else {
                        selectedUserIds.delete(id);
                    }
                    updateSelectedUI();
                });
            });

            // View user
            tbody.querySelectorAll('.view-user').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    openUserDrawer(id);
                });
            });

            // Edit user
            tbody.querySelectorAll('.edit-user').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    openEditUserModal(id);
                });
            });

            // Suspend user
            tbody.querySelectorAll('.suspend-user').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    openConfirmModal('Suspend user?',
                        `This will suspend ${allUsers.find(u => u.id === id)?.name || 'this user'}. They will lose access until reactivated.`,
                        () => {
                            const u = allUsers.find(x => x.id === id);
                            if (u) {
                                u.status = 'suspended';
                                renderUsers();
                                updateKPIs();
                                showToast('success', 'User suspended',
                                    `${u.name} has been suspended.`);
                            }
                        });
                });
            });
        }

        // Select all
        const selectAll = document.getElementById('selectAll');
        selectAll.checked = pageUsers.length > 0 && pageUsers.every(u => selectedUserIds.has(u.id));
        selectAll.addEventListener('change', function () {
            const pageIds = pageUsers.map(u => u.id);
            if (this.checked) {
                pageIds.forEach(id => selectedUserIds.add(id));
            } else {
                pageIds.forEach(id => selectedUserIds.delete(id));
            }
            renderUsers();
            updateSelectedUI();
        });

        updatePagination(total, totalPages);
        updateSelectedUI();
    }

    function updateSelectedUI() {
        const count = selectedUserIds.size;
        document.getElementById('selectedCount').textContent = count + ' selected';
        document.getElementById('bulkSuspendBtn').disabled = count === 0;
        document.getElementById('bulkDeleteBtn').disabled = count === 0;
    }

    function toggleSelectUser(id) {
        if (selectedUserIds.has(id)) {
            selectedUserIds.delete(id);
        } else {
            selectedUserIds.add(id);
        }
        renderUsers();
        updateSelectedUI();
    }

    function updatePagination(total, totalPages) {
        const info = document.getElementById('paginationInfo');
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(start + pageSize - 1, total);
        info.textContent = total === 0 ? 'Showing 0 users' :
            `Showing ${start}–${end} of ${total} users`;

        const controls = document.getElementById('paginationControls');
        let html = '';
        html +=
            `<button class="page-btn" data-page="prev" ${currentPage <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<button class="page-btn" disabled>…</button>`;
            }
        }
        html +=
            `<button class="page-btn" data-page="next" ${currentPage >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
        controls.innerHTML = html;

        controls.querySelectorAll('.page-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', function () {
                const val = this.dataset.page;
                if (val === 'prev' && currentPage > 1) {
                    currentPage--;
                    renderUsers();
                }
                if (val === 'next' && currentPage < totalPages) {
                    currentPage++;
                    renderUsers();
                }
                if (val !== 'prev' && val !== 'next') {
                    currentPage = parseInt(val);
                    renderUsers();
                }
            });
        });
    }

    function updateKPIs() {
        const total = allUsers.length;
        const active = allUsers.filter(u => u.status === 'active').length;
        const pending = allUsers.filter(u => u.status === 'pending').length;
        const suspended = allUsers.filter(u => u.status === 'suspended').length;
        document.getElementById('kpiTotal').textContent = total.toLocaleString();
        document.getElementById('kpiActive').textContent = active.toLocaleString();
        document.getElementById('kpiPending').textContent = pending.toLocaleString();
        document.getElementById('kpiSuspended').textContent = suspended.toLocaleString();
    }

    // ------------------------------------------------------------
    // USER DRAWER
    // ------------------------------------------------------------
    const drawer = document.getElementById('userDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerBody = document.getElementById('drawerBody');
    let currentDrawerUserId = null;

    function openUserDrawer(id) {
        const u = allUsers.find(x => x.id === id);
        if (!u) return;
        currentDrawerUserId = id;
        drawerBody.innerHTML = `
                    <div class="detail-avatar">
                        <div class="avatar-premium lg">${u.avatar}</div>
                        <div class="info">
                            <div class="name">${u.name}</div>
                            <div class="email">${u.email}</div>
                            <span class="badge-premium ${u.status}" style="margin-top:0.2rem;"><span class="badge-dot ${u.status}"></span> ${u.status}</span>
                        </div>
                    </div>
                    <div class="detail-row"><span class="label">Role</span><span class="value" style="text-transform:capitalize;">${u.role}</span></div>
                    <div class="detail-row"><span class="label">Joined</span><span class="value">${u.joinedDisplay}</span></div>
                    <div class="detail-row"><span class="label">Last active</span><span class="value">${u.lastActiveDisplay}</span></div>
                    <div class="detail-row"><span class="label">User ID</span><span class="value" style="font-family:monospace;font-size:0.8rem;">#${String(u.id).padStart(4, '0')}</span></div>
                    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border-subtle);">
                        <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem;">Recent activity</div>
                        <div style="font-size:0.85rem;color:var(--text-secondary);">
                            <div style="display:flex;gap:0.5rem;padding:0.2rem 0;"><i class="fas fa-circle" style="font-size:0.3rem;color:var(--accent-blue);align-self:center;"></i> Logged in from Chrome · ${u.lastActiveDisplay}</div>
                            <div style="display:flex;gap:0.5rem;padding:0.2rem 0;"><i class="fas fa-circle" style="font-size:0.3rem;color:var(--text-muted);align-self:center;"></i> Updated profile · ${u.joinedDisplay}</div>
                        </div>
                    </div>
                `;
        drawer.classList.add('open');
        drawerOverlay.classList.add('open');
        // focus management
        document.getElementById('closeDrawer').focus();
        // Update actions
        document.getElementById('drawerEditBtn').onclick = () => {
            closeDrawer();
            openEditUserModal(id);
        };
        document.getElementById('drawerSuspendBtn').onclick = () => {
            closeDrawer();
            openConfirmModal('Suspend user?',
                `This will suspend ${u.name}. They will lose access until reactivated.`,
                () => {
                    u.status = 'suspended';
                    renderUsers();
                    updateKPIs();
                    showToast('success', 'User suspended', `${u.name} has been suspended.`);
                });
        };
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        currentDrawerUserId = null;
    }

    document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // ------------------------------------------------------------
    // MODAL (Add/Edit User)
    // ------------------------------------------------------------
    const modalOverlay = document.getElementById('userModalOverlay');
    const modalTitle = document.getElementById('userModalTitle');
    const modalForm = document.getElementById('userModalForm');
    const modalUserName = document.getElementById('modalUserName');
    const modalUserEmail = document.getElementById('modalUserEmail');
    const modalUserRole = document.getElementById('modalUserRole');
    const modalUserStatus = document.getElementById('modalUserStatus');
    const modalUserPassword = document.getElementById('modalUserPassword');
    const modalPasswordField = document.getElementById('modalPasswordField');
    const modalSaveBtn = document.getElementById('modalSaveBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalClose = document.getElementById('userModalClose');

    function openEditUserModal(id) {
        const u = allUsers.find(x => x.id === id);
        if (!u) return;
        editingUserId = id;
        modalTitle.textContent = 'Edit user';
        modalPasswordField.style.display = 'none';
        modalUserName.value = u.name;
        modalUserEmail.value = u.email;
        modalUserRole.value = u.role;
        modalUserStatus.value = u.status;
        modalOverlay.classList.add('open');
        modalUserName.focus();
    }

    function openAddUserModal() {
        editingUserId = null;
        modalTitle.textContent = 'Add user';
        modalPasswordField.style.display = 'block';
        modalForm.reset();
        modalUserRole.value = 'member';
        modalUserStatus.value = 'active';
        modalOverlay.classList.add('open');
        modalUserName.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        editingUserId = null;
    }

    modalClose.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });

    modalSaveBtn.addEventListener('click', function () {
        const name = modalUserName.value.trim();
        const email = modalUserEmail.value.trim();
        const role = modalUserRole.value;
        const status = modalUserStatus.value;
        const password = modalUserPassword.value;

        if (!name || !email) {
            showToast('error', 'Validation error', 'Please fill in all required fields.');
            return;
        }

        this.classList.add('loading');
        this.disabled = true;

        setTimeout(() => {
            if (editingUserId) {
                const u = allUsers.find(x => x.id === editingUserId);
                if (u) {
                    u.name = name;
                    u.email = email;
                    u.role = role;
                    u.status = status;
                    showToast('success', 'User updated', `${name}'s profile has been updated.`);
                }
            } else {
                const newUser = {
                    id: allUsers.length + 1,
                    name,
                    email,
                    role,
                    status,
                    joined: new Date().toISOString().split('T')[0],
                    joinedDisplay: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric', year: 'numeric'
                    }),
                    lastActive: new Date(),
                    lastActiveDisplay: 'Just now',
                    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                };
                allUsers.push(newUser);
                showToast('success', 'User added', `${name} has been added to the team.`);
            }
            closeModal();
            renderUsers();
            updateKPIs();
            this.classList.remove('loading');
            this.disabled = false;
        }, 600);
    });

    document.getElementById('addUserBtn').addEventListener('click', openAddUserModal);

    // ------------------------------------------------------------
    // CONFIRM MODAL
    // ------------------------------------------------------------
    const confirmOverlay = document.getElementById('confirmModalOverlay');
    const confirmTitle = document.getElementById('confirmModalTitle');
    const confirmDesc = document.getElementById('confirmModalDesc');
    const confirmConfirm = document.getElementById('confirmModalConfirm');
    const confirmCancel = document.getElementById('confirmModalCancel');
    const confirmClose = document.getElementById('confirmModalClose');
    let confirmCallback = null;

    function openConfirmModal(title, desc, callback) {
        confirmTitle.textContent = title;
        confirmDesc.textContent = desc;
        confirmCallback = callback;
        confirmOverlay.classList.add('open');
        confirmConfirm.focus();
    }

    function closeConfirmModal() {
        confirmOverlay.classList.remove('open');
        confirmCallback = null;
    }

    confirmCancel.addEventListener('click', closeConfirmModal);
    confirmClose.addEventListener('click', closeConfirmModal);
    confirmOverlay.addEventListener('click', function (e) {
        if (e.target === this) closeConfirmModal();
    });
    confirmConfirm.addEventListener('click', function () {
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
        closeConfirmModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && confirmOverlay.classList.contains('open')) closeConfirmModal();
    });

    // ------------------------------------------------------------
    // FILTERS & SEARCH
    // ------------------------------------------------------------
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        currentPage = 1;
        renderUsers();
        showToast('info', 'Filters applied', 'Your filters have been applied to the user list.');
    });

    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        document.getElementById('userSearch').value = '';
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('roleFilter').value = 'all';
        currentPage = 1;
        renderUsers();
        showToast('info', 'Filters cleared', 'All filters have been reset.');
    });

    // Enter key on search
    document.getElementById('userSearch').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('applyFiltersBtn').click();
        }
    });

    // ------------------------------------------------------------
    // BULK ACTIONS
    // ------------------------------------------------------------
    document.getElementById('bulkSuspendBtn').addEventListener('click', function () {
        const count = selectedUserIds.size;
        if (count === 0) return;
        const names = allUsers.filter(u => selectedUserIds.has(u.id)).map(u => u.name).join(', ');
        openConfirmModal('Suspend selected users?',
            `This will suspend ${count} user${count > 1 ? 's' : ''}: ${names}. They will lose access until reactivated.`,
            () => {
                allUsers.forEach(u => {
                    if (selectedUserIds.has(u.id)) u.status = 'suspended';
                });
                selectedUserIds.clear();
                renderUsers();
                updateKPIs();
                showToast('success', 'Users suspended', `${count} user${count > 1 ? 's' : ''} have been suspended.`);
            });
    });

    document.getElementById('bulkDeleteBtn').addEventListener('click', function () {
        const count = selectedUserIds.size;
        if (count === 0) return;
        openConfirmModal('Delete selected users?',
            `This will permanently delete ${count} user${count > 1 ? 's' : ''}. This action cannot be undone.`,
            () => {
                const ids = new Set(selectedUserIds);
                for (let i = allUsers.length - 1; i >= 0; i--) {
                    if (ids.has(allUsers[i].id)) {
                        allUsers.splice(i, 1);
                    }
                }
                selectedUserIds.clear();
                renderUsers();
                updateKPIs();
                showToast('success', 'Users deleted', `${count} user${count > 1 ? 's' : ''} have been deleted.`);
            });
    });

    // ------------------------------------------------------------
    // SIGNUP LOGIC
    // ------------------------------------------------------------
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirm = document.getElementById('signupConfirm');
    const signupBtn = document.getElementById('signupBtn');
    const signupTerms = document.getElementById('signupTerms');

    // Toggle password visibility
    document.querySelectorAll('.toggle-vis').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.closest('.input-group').querySelector('input');
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            this.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    });

    // Password strength
    const strengthSegments = document.querySelectorAll('#strengthBar .segment');
    const strengthLabel = document.getElementById('strengthLabel');

    function evaluateStrength(pw) {
        if (!pw) return { score: 0, label: 'Password must be at least 8 characters' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^a-zA-Z0-9]/.test(pw)) score++;
        const normalized = Math.min(score, 4);
        const labels = ['', 'Weak', 'Medium', 'Strong', 'Strong'];
        const classes = ['', 'weak', 'medium', 'strong', 'strong'];
        return { score: normalized, label: labels[normalized] || '', cls: classes[normalized] || '' };
    }

    signupPassword.addEventListener('input', function () {
        const pw = this.value;
        const result = evaluateStrength(pw);
        strengthSegments.forEach((seg, idx) => {
            seg.className = 'segment';
            if (idx < result.score) {
                seg.classList.add('active', result.cls);
            }
        });
        strengthLabel.textContent = result.label || 'Password must be at least 8 characters';
        strengthLabel.className = 'strength-label ' + result.cls;
    });

    // Signup validation
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        // Name
        const nameVal = signupName.value.trim();
        const nameMsg = signupName.parentElement.querySelector('.validation-msg');
        if (!nameVal || nameVal.length < 2) {
            nameMsg.textContent = 'Please enter your full name.';
            nameMsg.style.display = 'block';
            signupName.classList.add('error');
            valid = false;
        } else {
            nameMsg.style.display = 'none';
            signupName.classList.remove('error');
        }

        // Email
        const emailVal = signupEmail.value.trim();
        const emailMsg = signupEmail.parentElement.querySelector('.validation-msg');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            emailMsg.textContent = 'Please enter a valid email address.';
            emailMsg.style.display = 'block';
            signupEmail.classList.add('error');
            valid = false;
        } else {
            emailMsg.style.display = 'none';
            signupEmail.classList.remove('error');
        }

        // Password
        const pwVal = signupPassword.value;
        if (pwVal.length < 8) {
            const msg = signupPassword.parentElement.parentElement.querySelector('.validation-msg');
            if (msg) {
                msg.textContent = 'Password must be at least 8 characters.';
                msg.style.display = 'block';
            }
            signupPassword.classList.add('error');
            valid = false;
        } else {
            signupPassword.classList.remove('error');
            const msg = signupPassword.parentElement.parentElement.querySelector('.validation-msg');
            if (msg) msg.style.display = 'none';
        }

        // Confirm
        const confirmVal = signupConfirm.value;
        const confirmMsg = signupConfirm.parentElement.parentElement.querySelector('.validation-msg');
        if (confirmVal !== pwVal || !confirmVal) {
            confirmMsg.textContent = 'Passwords do not match.';
            confirmMsg.style.display = 'block';
            signupConfirm.classList.add('error');
            valid = false;
        } else {
            confirmMsg.style.display = 'none';
            signupConfirm.classList.remove('error');
        }

        // Terms
        if (!signupTerms.checked) {
            showToast('warning', 'Terms required', 'Please agree to the Terms of Service.');
            valid = false;
        }

        if (!valid) return;

        // Submit
        signupBtn.classList.add('loading');
        signupBtn.disabled = true;
        setTimeout(() => {
            signupBtn.classList.remove('loading');
            signupBtn.disabled = false;
            showToast('success', 'Account created!',
                `Welcome, ${nameVal}. Your account has been created.`);
            // Navigate to dashboard
            navigateTo('dashboard');
        }, 1400);
    });

    // ------------------------------------------------------------
    // LOGIN LOGIC
    // ------------------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginDefault = document.getElementById('loginDefault');
    const login2fa = document.getElementById('login2fa');
    const loginForgot = document.getElementById('loginForgot');
    const loginForgotSuccess = document.getElementById('loginForgotSuccess');
    const forgotLink = document.getElementById('forgotLink');
    const forgotBackLink = document.getElementById('forgotBackLink');
    const forgotSuccessBack = document.getElementById('forgotSuccessBack');
    const otpBack = document.getElementById('otpBack');
    const otpVerifyBtn = document.getElementById('otpVerifyBtn');
    const otpInputs = document.querySelectorAll('.otp-input');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = loginEmail.value.trim();
        const pw = loginPassword.value;
        if (!email || !pw) {
            showToast('error', 'Missing credentials', 'Please enter your email and password.');
            return;
        }
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        setTimeout(() => {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            // Simulate 2FA for demo
            loginDefault.style.display = 'none';
            login2fa.style.display = 'block';
            // Focus first OTP
            document.querySelector('.otp-input')?.focus();
            showToast('info', '2FA required',
                'Enter the verification code from your authenticator app.');
        }, 1000);
    });

    // OTP input navigation
    otpInputs.forEach((input, idx) => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
            if (this.value && idx < otpInputs.length - 1) {
                otpInputs[idx + 1].focus();
            }
            if (this.value) this.classList.add('filled');
            else this.classList.remove('filled');
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !this.value && idx > 0) {
                otpInputs[idx - 1].focus();
                otpInputs[idx - 1].value = '';
                otpInputs[idx - 1].classList.remove('filled');
            }
            if (e.key === 'Enter') {
                const allFilled = Array.from(otpInputs).every(inp => inp.value.length === 1);
                if (allFilled) otpVerifyBtn.click();
            }
        });
        // Paste support
        input.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digits = paste.replace(/\D/g, '').slice(0, otpInputs.length);
            digits.split('').forEach((d, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = d;
                    otpInputs[i].classList.add('filled');
                }
            });
            const nextIdx = Math.min(digits.length, otpInputs.length - 1);
            if (digits.length < otpInputs.length) {
                otpInputs[digits.length]?.focus();
            } else {
                otpInputs[otpInputs.length - 1]?.focus();
            }
        });
    });

    otpVerifyBtn.addEventListener('click', function () {
        const code = Array.from(otpInputs).map(inp => inp.value).join('');
        if (code.length !== 6) {
            showToast('error', 'Invalid code', 'Please enter all 6 digits.');
            return;
        }
        this.classList.add('loading');
        this.disabled = true;
        setTimeout(() => {
            this.classList.remove('loading');
            this.disabled = false;
            showToast('success', 'Welcome back!',
                'You have been successfully authenticated.');
            navigateTo('dashboard');
        }, 1000);
    });

    otpBack.addEventListener('click', function () {
        login2fa.style.display = 'none';
        loginDefault.style.display = 'block';
        loginPassword.value = '';
        otpInputs.forEach(inp => {
            inp.value = '';
            inp.classList.remove('filled');
        });
    });

    // Forgot password
    forgotLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginDefault.style.display = 'none';
        loginForgot.style.display = 'block';
        loginForgotSuccess.style.display = 'none';
        document.getElementById('forgotEmail').value = loginEmail.value || '';
        document.getElementById('forgotEmail').focus();
    });

    forgotBackLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginForgot.style.display = 'none';
        loginForgotSuccess.style.display = 'none';
        loginDefault.style.display = 'block';
    });

    forgotSuccessBack.addEventListener('click', function (e) {
        e.preventDefault();
        loginForgotSuccess.style.display = 'none';
        loginDefault.style.display = 'block';
    });

    document.getElementById('forgotForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value.trim();
        if (!email) {
            showToast('error', 'Email required', 'Please enter your email address.');
            return;
        }
        const btn = document.getElementById('forgotBtn');
        btn.classList.add('loading');
        btn.disabled = true;
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.disabled = false;
            loginForgot.style.display = 'none';
            loginForgotSuccess.style.display = 'block';
            showToast('success', 'Reset link sent',
                `We've sent a password reset link to ${email}.`);
        }, 1200);
    });

    // ------------------------------------------------------------
    // INIT
    // ------------------------------------------------------------
    // Start on signup by default
    // navigateTo('signup');

    // Expose some functions globally for inline handlers
    window.toggleSelectUser = toggleSelectUser;
    window.openUserDrawer = openUserDrawer;
    window.openEditUserModal = openEditUserModal;
    window.openConfirmModal = openConfirmModal;
    window.closeDrawer = closeDrawer;
    window.closeModal = closeModal;
    window.closeConfirmModal = closeConfirmModal;
    window.navigateTo = navigateTo;
    window.showToast = showToast;

    console.log('🚀 Nexus · Premium SaaS ready.');

})();
