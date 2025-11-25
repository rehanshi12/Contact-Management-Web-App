// js/contacts.js

// Check authentication
if (!isAuthenticated()) {
    window.location.href = 'index.html';
}

// State
let contacts = [];
let currentContact = null;
let selectedPhoto = null;

// DOM Elements
const contactsList = document.getElementById('contactsList');
const emptyState = document.getElementById('emptyState');
const addContactBtn = document.getElementById('addContactBtn');
const contactModal = document.getElementById('contactModal');
const detailsModal = document.getElementById('detailsModal');
const contactForm = document.getElementById('contactForm');
const searchInput = document.getElementById('searchInput');
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const logoutBtn = document.getElementById('logoutBtn');
const photoInput = document.getElementById('photoInput');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const photoPreview = document.getElementById('photoPreview');

// Load contacts on page load
loadContacts();

// Event Listeners
addContactBtn.addEventListener('click', () => openAddContactModal());
document.getElementById('closeModal').addEventListener('click', closeContactModal);
document.getElementById('cancelBtn').addEventListener('click', closeContactModal);
document.getElementById('closeDetailsModal').addEventListener('click', closeDetailsModal);
contactForm.addEventListener('submit', saveContact);
searchInput.addEventListener('input', filterContacts);
searchToggle.addEventListener('click', toggleSearch);
logoutBtn.addEventListener('click', logout);
uploadPhotoBtn.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', handlePhotoSelect);

// Alphabet navigation
document.querySelectorAll('.alphabet-scroll span').forEach(span => {
    span.addEventListener('click', () => scrollToLetter(span.dataset.letter));
});

// Close modals on outside click
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
});
detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) closeDetailsModal();
});

// Functions
async function loadContacts() {
    try {
        const response = await apiCall(API_CONFIG.ENDPOINTS.CONTACTS, {
            method: 'GET'
        });

        if (response.ok) {
            contacts = await response.json();
            renderContacts(contacts);
        } else {
            console.error('Failed to load contacts');
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function renderContacts(contactsToRender) {
    contactsList.innerHTML = '';

    if (contactsToRender.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Group contacts by first letter
    const grouped = contactsToRender.reduce((acc, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(contact);
        return acc;
    }, {});

    // Sort and render
    Object.keys(grouped).sort().forEach(letter => {
        const group = document.createElement('div');
        group.className = 'contact-group';
        group.id = `group-${letter}`;

        const letterHeader = document.createElement('div');
        letterHeader.className = 'group-letter';
        letterHeader.textContent = letter;
        group.appendChild(letterHeader);

        grouped[letter].sort((a, b) => a.name.localeCompare(b.name)).forEach(contact => {
            const item = createContactItem(contact);
            group.appendChild(item);
        });

        contactsList.appendChild(group);
    });
}

function createContactItem(contact) {
    const item = document.createElement('div');
    item.className = 'contact-item';
    item.onclick = () => showContactDetails(contact);

    const avatar = document.createElement('div');
    avatar.className = 'contact-avatar';

    // Backend returns photoUrl field
    if (contact.photoUrl) {
        const img = document.createElement('img');
        img.src = contact.photoUrl;
        img.alt = contact.name;
        avatar.appendChild(img);
    } else {
        avatar.textContent = contact.name.charAt(0).toUpperCase();
    }

    const info = document.createElement('div');
    info.className = 'contact-info';

    const name = document.createElement('div');
    name.className = 'contact-name';
    name.textContent = contact.name;

    const phone = document.createElement('div');
    phone.className = 'contact-phone';
    // Backend uses phoneNo field
    phone.textContent = contact.phoneNo;

    info.appendChild(name);
    info.appendChild(phone);
    item.appendChild(avatar);
    item.appendChild(info);

    return item;
}

function openAddContactModal() {
    currentContact = null;
    selectedPhoto = null;
    document.getElementById('modalTitle').textContent = 'Add Contact';
    contactForm.reset();
    resetPhotoPreview();
    contactModal.classList.add('active');
}

function openEditContactModal(contact) {
    currentContact = contact;
    selectedPhoto = null;
    document.getElementById('modalTitle').textContent = 'Edit Contact';
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactPhone').value = contact.phoneNo; // Backend uses phoneNo
    document.getElementById('contactEmail').value = contact.email || '';
    document.getElementById('contactGender').value = contact.gender || '';

    if (contact.photoUrl) {
        const img = document.createElement('img');
        img.src = contact.photoUrl;
        photoPreview.innerHTML = '';
        photoPreview.appendChild(img);
    } else {
        resetPhotoPreview();
    }

    closeDetailsModal();
    contactModal.classList.add('active');
}

function closeContactModal() {
    contactModal.classList.remove('active');
    contactForm.reset();
    currentContact = null;
    selectedPhoto = null;
    resetPhotoPreview();
}

function closeDetailsModal() {
    detailsModal.classList.remove('active');
}

function resetPhotoPreview() {
    photoPreview.innerHTML = `
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    `;
}

function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (file) {
        selectedPhoto = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            photoPreview.innerHTML = '';
            photoPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

async function saveContact(e) {
    e.preventDefault();

    // Backend expects FormData with specific field names
    const formData = new FormData();
    formData.append('name', document.getElementById('contactName').value);
    formData.append('phoneNo', document.getElementById('contactPhone').value); // Backend uses phoneNo
    formData.append('email', document.getElementById('contactEmail').value || '');
    formData.append('gender', document.getElementById('contactGender').value || '');

    // Add photo if selected
    if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
    }

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        let response;
        if (currentContact) {
            // Update existing contact - PUT method with FormData
            response = await apiCallFormData(
                API_CONFIG.ENDPOINTS.CONTACT_BY_ID.replace(':id', currentContact.id),
                formData,
                'PUT'
            );
        } else {
            // Create new contact - POST method with FormData
            response = await apiCallFormData(
                API_CONFIG.ENDPOINTS.CONTACTS,
                formData,
                'POST'
      
            );

        }

        if (response.ok) {
            const data = await response.json();
            console.log('Contact saved:', data);

            await loadContacts();
            closeContactModal();

            // Show success message
            alert(data.message || 'Contact saved successfully!');
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to save contact');
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        alert('Network error. Please try again.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Contact';
    }
}

function showContactDetails(contact) {
    const detailsDiv = document.getElementById('contactDetails');

    detailsDiv.innerHTML = `
        <div class="details-photo">
            <div class="details-photo-avatar">
                ${contact.photoUrl
            ? `<img src="${contact.photoUrl}" alt="${contact.name}">`
            : contact.name.charAt(0).toUpperCase()}
            </div>
        </div>
        <div class="details-info">
            <div class="detail-item">
                <div class="detail-label">Name</div>
                <div class="detail-value">${contact.name}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Phone Number</div>
                <div class="detail-value">${contact.phoneNo}</div>
            </div>
            ${contact.email ? `
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${contact.email}</div>
                </div>
            ` : ''}
            ${contact.gender ? `
                <div class="detail-item">
                    <div class="detail-label">Gender</div>
                    <div class="detail-value">${contact.gender}</div>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('editContactBtn').onclick = () => openEditContactModal(contact);
    document.getElementById('deleteContactBtn').onclick = () => deleteContact(contact.id);

    detailsModal.classList.add('active');
}

async function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    try {
        const response = await apiCall(
            API_CONFIG.ENDPOINTS.CONTACT_BY_ID.replace(':id', contactId),
            {
                method: 'DELETE'
            }
        );

        if (response.ok) {
            const data = await response.json();
            await loadContacts();
            closeDetailsModal();
            alert(data.message || 'Contact deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to delete contact');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Network error. Please try again.');
    }
}

function filterContacts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phoneNo.includes(searchTerm) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm))
    );
    renderContacts(filtered);
}

function toggleSearch() {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
        renderContacts(contacts);
    }
}

function scrollToLetter(letter) {
    const group = document.getElementById(`group-${letter}`);
    if (group) {
        group.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        removeAuthToken();
        window.location.href = 'index.html';
    }
}