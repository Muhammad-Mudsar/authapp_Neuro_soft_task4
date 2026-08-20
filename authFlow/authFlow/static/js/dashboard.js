// dashboard.js – full user management

(function () {
    // ---------- MOCK DATA ----------
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Quinn', 'Parker', 'Rowan', 'Ellis', 'Morgan', 'Cameron', 'Logan', 'Sawyer', 'Brooklyn', 'Harper', 'Eden', 'Reese', 'Lennon', 'River'];
    const lastNames = ['Rivera', 'Chen', 'Patel', 'Kim', 'Martinez', 'Singh', 'Okafor', 'Dubois', 'Hasegawa', 'Moreno', 'Silva', 'Van der Meer', 'Nguyen', 'Kowalski', 'Fitzgerald', 'West', 'Hunt', 'Rose', 'Ford', 'Pearce'];
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
            const email = fn.toLowerCase() + '.' + ln.toLowerCase() + '@' + domains[Math.floor(Math.random() * domains.length)];
            const role = roles[Math.floor(Math.random() * roles.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const joined = randomDate(new Date(2023, 0, 1), new Date(2026, 7, 15));
            const lastActive = randomDate(new Date(2026, 5, 1), new Date(2026, 8, 1));
            users.push({
                id: i + 1,
                name, email, role, status,
                joined: joined.toISOString().split('T')[0],
                joinedDisplay: joined.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastActive,
                lastActiveDisplay: formatDate(lastActive),
                avatar: fn.charAt(0) + ln.charAt(0)
            });
        }
        // force variety
        if (users.length > 3) {
            users[0].status = 'active'; users[0].role = 'admin';
            users[1].status = 'pending'; users[1].role = 'moderator';
            users[2].status = 'suspended';
            users[3].status = 'inactive';
        }
        return users;
    }

    const allUsers = generateUsers(48);

    // ---------- STATE ----------
    let filteredUsers = [...allUsers];
    let currentPage = 1;
    const pageSize = 10;
    let selectedUserIds = new Set();
    let sortField = 'name';
    let sortAsc = true;
    let editingUserId = null;
    let confirmCallback = null;

    // ---------- DOM REFS ----------
    const tbody = document.getElementById('userTableBody');
    const selectAll = document.getElementById('selectAll');
    const paginationControls = document.getElementById('paginationControls');
    const paginationInfo = document.getElementById('paginationInfo');
    const selectedCount = document.getElementById('selectedCount');

    // ---------- FILTER & SORT ----------
    function getFilteredAndSorted() {
        const search = document.getElementById('userSearch').value.toLowerCase().trim();
        const statusFilter = document.getElementById('statusFilter').value;
        const roleFilter = document.getElementById('roleFilter').value;

        let result = allUsers.filter(u => {
            const matchSearch = u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
            const matchStatus = statusFilter === 'all' || u.status === statusFilter;
            const matchRole = roleFilter === 'all' || u.role === roleFilter;
            return matchSearch && matchStatus && matchRole;
        });

        result.sort((a, b) => {
            let va = a[sortField] || '', vb = b[sortField] || '';
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortAsc ? -1 : 1;
            if (va > vb) return sortAsc ? 1 : -1;
            return 0;
        });
        return result;
    }

    // ---------- RENDER ----------
    function renderUsers() {
        filteredUsers = getFilteredAndSorted();
        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * pageSize;
        const end = Math.min(start + pageSize, total);
        const pageUsers = filteredUsers.slice(start, end);

        if (total === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
        <i class="fas fa-users-slash" style="font-size:1.8rem;display:block;margin-bottom:0.5rem;opacity:0.3;"></i>
        <div style="font-weight:500;font-size:1rem;color:var(--text-secondary);">No users found</div>
        <div style="font-size:0.85rem;">Try adjusting your search or filters.</div>
      </td></tr>`;
        } else {
            let html = '';
            pageUsers.forEach(u => {
                const checked = selectedUserIds.has(u.id) ? 'checked' : '';
                html += `<tr class="table-row" data-id="${u.id}" style="cursor:pointer;">
          <td onclick="event.stopPropagation();"><input type="checkbox" class="table-checkbox user-checkbox" data-id="${u.id}" ${checked} /></td>
          <td><div class="user-cell"><div class="avatar-premium">${u.avatar}</div><div><div class="name">${u.name}</div><div class="email">${u.email}</div></div></div></td>
          <td><span style="text-transform:capitalize;font-weight:500;color:var(--text-secondary);">${u.role}</span></td>
          <td><span class="badge-premium ${u.status}"><span class="badge-dot ${u.status}"></span> ${u.status}</span></td>
          <td style="color:var(--text-secondary);font-size:0.85rem;">${u.lastActiveDisplay}</td>
          <td style="text-align:right;"><div class="actions-cell" style="justify-content:flex-end;">
            <button class="action-btn view-user" data-id="${u.id}" aria-label="View user"><i class="fas fa-eye"></i></button>
            <button class="action-btn edit-user" data-id="${u.id}" aria-label="Edit user"><i class="fas fa-pen"></i></button>
            <button class="action-btn danger suspend-user" data-id="${u.id}" aria-label="Suspend user"><i class="fas fa-ban"></i></button>
          </div></td>
        </tr>`;
            });
            tbody.innerHTML = html;

            // Attach events
            tbody.querySelectorAll('.table-row').forEach(row => {
                row.addEventListener('click', function (e) {
                    if (e.target.closest('input') || e.target.closest('.actions-cell')) return;
                    const id = parseInt(this.dataset.id);
                    toggleSelectUser(id);
                });
            });
            tbody.querySelectorAll('.user-checkbox').forEach(cb => {
                cb.addEventListener('change', function (e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    this.checked ? selectedUserIds.add(id) : selectedUserIds.delete(id);
                    updateSelectedUI();
                });
            });
            tbody.querySelectorAll('.view-user').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    openUserDrawer(parseInt(this.dataset.id));
                });
            });
            tbody.querySelectorAll('.edit-user').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    openEditUserModal(parseInt(this.dataset.id));
                });
            });
            tbody.querySelectorAll('.suspend-user').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    openConfirmModal('Suspend user?', `This will suspend ${allUsers.find(u => u.id === id)?.name || 'this user'}. They will lose access until reactivated.`, () => {
                        const u = allUsers.find(x => x.id === id);
                        if (u) { u.status = 'suspended'; renderUsers(); updateKPIs(); showToast('success', 'User suspended', `${u.name} has been suspended.`); }
                    });
                });
            });
        }

        // Select all
        selectAll.checked = pageUsers.length > 0 && pageUsers.every(u => selectedUserIds.has(u.id));
        selectAll.onchange = function () {
            const pageIds = pageUsers.map(u => u.id);
            if (this.checked) pageIds.forEach(id => selectedUserIds.add(id));
            else pageIds.forEach(id => selectedUserIds.delete(id));
            renderUsers();
            updateSelectedUI();
        };

        updatePagination(total, totalPages);
        updateSelectedUI();
    }

    function updateSelectedUI() {
        const count = selectedUserIds.size;
        selectedCount.textContent = count + ' selected';
        document.getElementById('bulkSuspendBtn').disabled = count === 0;
        document.getElementById('bulkDeleteBtn').disabled = count === 0;
    }

    function toggleSelectUser(id) {
        selectedUserIds.has(id) ? selectedUserIds.delete(id) : selectedUserIds.add(id);
        renderUsers();
    }

    function updatePagination(total, totalPages) {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(start + pageSize - 1, total);
        paginationInfo.textContent = total === 0 ? 'Showing 0 users' : `Showing ${start}–${end} of ${total} users`;

        let html = `<button class="page-btn" data-page="prev" ${currentPage <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<button class="page-btn" disabled>…</button>`;
            }
        }
        html += `<button class="page-btn" data-page="next" ${currentPage >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
        paginationControls.innerHTML = html;

        paginationControls.querySelectorAll('.page-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', function () {
                const val = this.dataset.page;
                if (val === 'prev' && currentPage > 1) { currentPage--; renderUsers(); }
                if (val === 'next' && currentPage < totalPages) { currentPage++; renderUsers(); }
                if (val !== 'prev' && val !== 'next') { currentPage = parseInt(val); renderUsers(); }
            });
        });
    }

    // ---------- KPI ----------
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

    // ---------- DRAWER ----------
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
        <div class="info"><div class="name">${u.name}</div><div class="email">${u.email}</div>
        <span class="badge-premium ${u.status}" style="margin-top:0.2rem;"><span class="badge-dot ${u.status}"></span> ${u.status}</span></div>
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
        document.getElementById('drawerEditBtn').onclick = () => { closeDrawer(); openEditUserModal(id); };
        document.getElementById('drawerSuspendBtn').onclick = () => {
            closeDrawer();
            openConfirmModal('Suspend user?', `This will suspend ${u.name}. They will lose access until reactivated.`, () => {
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
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });

    // ---------- MODAL (Add/Edit) ----------
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
    modalOverlay.addEventListener('click', function (e) { if (e.target === this) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });

    modalSaveBtn.addEventListener('click', function () {
        const name = modalUserName.value.trim();
        const email = modalUserEmail.value.trim();
        const role = modalUserRole.value;
        const status = modalUserStatus.value;
        const password = modalUserPassword.value;
        if (!name || !email) { showToast('error', 'Validation error', 'Please fill in all required fields.'); return; }

        this.classList.add('loading');
        this.disabled = true;
        setTimeout(() => {
            if (editingUserId) {
                const u = allUsers.find(x => x.id === editingUserId);
                if (u) { u.name = name; u.email = email; u.role = role; u.status = status; showToast('success', 'User updated', `${name}'s profile has been updated.`); }
            } else {
                const newUser = {
                    id: allUsers.length + 1,
                    name, email, role, status,
                    joined: new Date().toISOString().split('T')[0],
                    joinedDisplay: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

    // ---------- CONFIRM MODAL ----------
    const confirmOverlay = document.getElementById('confirmModalOverlay');
    const confirmTitle = document.getElementById('confirmModalTitle');
    const confirmDesc = document.getElementById('confirmModalDesc');
    const confirmConfirm = document.getElementById('confirmModalConfirm');
    const confirmCancel = document.getElementById('confirmModalCancel');
    const confirmClose = document.getElementById('confirmModalClose');

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
    confirmOverlay.addEventListener('click', function (e) { if (e.target === this) closeConfirmModal(); });
    confirmConfirm.addEventListener('click', function () {
        if (typeof confirmCallback === 'function') confirmCallback();
        closeConfirmModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && confirmOverlay.classList.contains('open')) closeConfirmModal(); });

    // ---------- FILTERS ----------
    document.getElementById('applyFiltersBtn').addEventListener('click', () => { currentPage = 1; renderUsers(); showToast('info', 'Filters applied', 'Your filters have been applied.'); });
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        document.getElementById('userSearch').value = '';
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('roleFilter').value = 'all';
        currentPage = 1;
        renderUsers();
        showToast('info', 'Filters cleared', 'All filters have been reset.');
    });
    document.getElementById('userSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('applyFiltersBtn').click(); } });

    // ---------- BULK ACTIONS ----------
    document.getElementById('bulkSuspendBtn').addEventListener('click', function () {
        const count = selectedUserIds.size;
        if (count === 0) return;
        const names = allUsers.filter(u => selectedUserIds.has(u.id)).map(u => u.name).join(', ');
        openConfirmModal('Suspend selected users?', `This will suspend ${count} user${count > 1 ? 's' : ''}: ${names}. They will lose access until reactivated.`, () => {
            allUsers.forEach(u => { if (selectedUserIds.has(u.id)) u.status = 'suspended'; });
            selectedUserIds.clear();
            renderUsers();
            updateKPIs();
            showToast('success', 'Users suspended', `${count} user${count > 1 ? 's' : ''} have been suspended.`);
        });
    });

    document.getElementById('bulkDeleteBtn').addEventListener('click', function () {
        const count = selectedUserIds.size;
        if (count === 0) return;
        openConfirmModal('Delete selected users?', `This will permanently delete ${count} user${count > 1 ? 's' : ''}. This action cannot be undone.`, () => {
            const ids = new Set(selectedUserIds);
            for (let i = allUsers.length - 1; i >= 0; i--) {
                if (ids.has(allUsers[i].id)) allUsers.splice(i, 1);
            }
            selectedUserIds.clear();
            renderUsers();
            updateKPIs();
            showToast('success', 'Users deleted', `${count} user${count > 1 ? 's' : ''} have been deleted.`);
        });
    });

    // ---------- SIDEBAR (mobile) ----------
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileToggle = document.getElementById('mobileNavToggle');

    function toggleSidebar() {
        sidebar.classList.toggle('mobile-open');
        sidebarOverlay.classList.toggle('open');
    }
    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('open');
    }
    mobileToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Sidebar nav items (demo)
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.sidebar .nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            if (window.innerWidth <= 1024) closeSidebar();
            const section = this.getAttribute('data-section') || 'users';
            if (section !== 'users') showToast('info', section.charAt(0).toUpperCase() + section.slice(1), `Navigating to ${section} section.`);
        });
    });

    // ---------- INIT ----------
    renderUsers();
    updateKPIs();

    // expose some functions for inline use
    window.toggleSelectUser = toggleSelectUser;
    window.openUserDrawer = openUserDrawer;
    window.openEditUserModal = openEditUserModal;
    window.openConfirmModal = openConfirmModal;
    window.closeDrawer = closeDrawer;
    window.closeModal = closeModal;
    window.closeConfirmModal = closeConfirmModal;
    window.showToast = showToast;

    console.log('🚀 Dashboard ready.');
})();