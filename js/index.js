let fullNameInput = document.getElementById("fullName");
let phoneNumberInput = document.getElementById("phoneNumber");
let emailAddressInput = document.getElementById("emailAddress");
let addressInput = document.getElementById("address");
let groupInput = document.getElementById("group");
let notesInput = document.getElementById("notes");
let isFavoriteInput = document.getElementById("isFavorite");
let isEmergencyInput = document.getElementById("isEmergency");

let rowData = document.getElementById("rowData");
let totalContacts = document.getElementById("totalContacts");
let favoritesCount = document.getElementById("favoritesCount");
let emergencyCount = document.getElementById("emergencyCount");
let favoritesList = document.getElementById("favoritesList");
let emergencyList = document.getElementById("emergencyList");

let saveContactBtn = document.getElementById("saveContactBtn");
let updateContactBtn = document.getElementById("updateContactBtn");
let searchInput = document.getElementById("searchInput");

let contacts = [];
let currentIndex = null;

//LOCAL STORAGE
if (localStorage.getItem("contactsList")) {
  contacts = JSON.parse(localStorage.getItem("contactsList"));
}
displayContacts(contacts);

function saveToLocalStorage() {
  localStorage.setItem("contactsList", JSON.stringify(contacts));
}

// ADD CONTACT
function addContact() {
  let newContact = {
    fullName: fullNameInput.value,
    phoneNumber: phoneNumberInput.value,
    emailAddress: emailAddressInput.value,
    address: addressInput.value,
    group: groupInput.value,
    notes: notesInput.value,
    isFavorite: isFavoriteInput.checked,
    isEmergency: isEmergencyInput.checked,
  };

  contacts.push(newContact);
  saveToLocalStorage();
  clearInput();
  displayContacts(contacts);

  Swal.fire({
    title: "Good job!",
    text: "Your Contact Added",
    icon: "success",
  });

  clearInput();
  displayContacts(contacts);

  let addContactModal = document.getElementById("addContactModal");
  let modal = bootstrap.Modal.getInstance(addContactModal);
  modal.hide();
}

// CLEAR INPUT
function clearInput() {
  fullNameInput.value = "";
  phoneNumberInput.value = "";
  emailAddressInput.value = "";
  addressInput.value = "";
  groupInput.value = "";
  notesInput.value = "";
  isFavoriteInput.checked = false;
  isEmergencyInput.checked = false;
}

// GET INITIALS
function getInitals(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

//DISPLAY CONTACTS
displayContacts(contacts);

function displayContacts(array) {
  let favCount = 0;
  let emCount = 0;

  if (array.length === 0) {
    rowData.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="d-flex align-items-center justify-content-center mx-auto  rounded-3 bg-light" style="width:30px;height:30px;">
          <i class="fa-solid fa-address-book text-secondary" style="font-size:30px;"></i>
        </div>
        <p class="text-secondary fw-medium mb-1">No contacts found</p>
        <p class="text-muted small">Click "Add Contact" to get started</p>
      </div>`;

    totalContacts.innerHTML = 0;
    document.getElementById("contactsCount").innerHTML = 0;
    favoritesCount.innerHTML = 0;
    emergencyCount.innerHTML = 0;
    favoritesList.innerHTML = "no favourites";
    emergencyList.innerHTML = "no emergencies";
    return;
  }

  let box = "";
  let favContainer = "";
  let emContainer = "";

  for (let i = 0; i < array.length; i++) {
    //Favorites Sidebar
    if (array[i].isFavorite) {
      favCount++;
      favContainer += `
        <div class="sidebar-contact-card">
          <div class="sidebar-contact-avatar" style="background:#3b82f6">
            ${getInitals(array[i].fullName)}
          </div>
          <div class="sidebar-contact-info">
            <h5>${array[i].fullName}</h5>
            <p>${array[i].phoneNumber}</p>
          </div>
          <button class="sidebar-call-btn favorites-call">
            <i class="fas fa-phone"></i>
          </button>
        </div>`;
    }

    //Emergency Sidebar
    if (array[i].isEmergency) {
      emCount++;
      emContainer += `
        <div class="sidebar-contact-card">
          <div class="sidebar-contact-avatar" style="background:#ef4444">
            ${getInitals(array[i].fullName)}
          </div>
          <div class="sidebar-contact-info">
            <h5>${array[i].fullName}</h5>
            <p>${array[i].phoneNumber}</p>
          </div>
          <button class="sidebar-call-btn favorites-call">
            <i class="fas fa-phone"></i>
          </button>
        </div>`;
    }

    // Main Card
    box += `
      <div class="col-lg-6">
        <div class="contact-card">
          <div class="contact-header">
            <div class="contact-avatar 
              ${array[i].isFavorite ? "favorite" : ""} 
              ${array[i].isEmergency ? "emergency" : ""}">
              ${getInitals(array[i].fullName)}
            </div>
            <div class="contact-info">
              <h4>${array[i].fullName}</h4>
            </div>
          </div>

          <div class="contact-details">
            <div class="contact-detail phone">
              <i class="fas fa-phone"></i>
              <span>${array[i].phoneNumber}</span>
            </div>
            <div class="contact-detail email">
              <i class="fas fa-envelope"></i>
              <span>${array[i].emailAddress}</span>
            </div>
            <div class="contact-detail address">
              <i class="fas fa-map-marker-alt"></i>
              <span>${array[i].address}</span>
            </div>
          </div>

          <div class="contact-tags">
            <span class="tag family">${array[i].group}</span>
            ${
              array[i].isEmergency
                ? `<span class="tag emergency"><i class="fas fa-heartbeat"></i> Emergency</span>`
                : ""
            }
          </div>

          <div class="contact-actions">
            <button class="contact-action call"><i class="fas fa-phone"></i></button>
            <button class="contact-action email"><i class="fas fa-envelope"></i></button>
            <button onclick="toggleFavourite(${i})" class="contact-action favorite ${
      array[i].isFavorite ? "active" : ""
    }">
              <i class="fas fa-star"></i>
            </button>
            <button onclick="toggleEmergency(${i})" class="contact-action emergency ${
      array[i].isEmergency ? "active" : ""
    }">
              <i class="fas fa-heart-pulse"></i>
            </button>
            <button onclick='preUpdate(${i})' class="contact-action"><i class="fas fa-edit"></i></button>
            <button onclick='deleteContact(${i})' class="contact-action delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>`;
  }

  rowData.innerHTML = box;
  totalContacts.innerHTML = contacts.length;
  document.getElementById("contactsCount").innerHTML = contacts.length;
  favoritesCount.innerHTML = favCount;
  emergencyCount.innerHTML = emCount;
  favoritesList.innerHTML = favContainer || "no favourites";
  emergencyList.innerHTML = emContainer || "no emergencies";
}
// delete
function deleteContact(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to delete contact!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "red",
    cancelButtonColor: "#787D87",
    confirmButtonText: "Yes, delete contact!",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      displayContacts(contacts);
      localStorage.setItem("contactsList", JSON.stringify(contacts));
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}
// update
function preUpdate(index) {
  let addContactModal = document.getElementById("addContactModal");
  let modal = bootstrap.Modal.getOrCreateInstance(addContactModal);
  modal.show();
  fullNameInput.value = contacts[index].fullName;
  phoneNumberInput.value = contacts[index].phoneNumber;
  emailAddressInput.value = contacts[index].emailAddress;
  addressInput.value = contacts[index].address;
  notesInput.value = contacts[index].notes;
  groupInput.value = contacts[index].group;
  isFavoriteInput.checked = contacts[index].isFavorite;
  isEmergencyInput.checked = contacts[index].isEmergency;
  updateContactBtn.classList.remove("d-none");
  saveContactBtn.classList.add("d-none");
  editIndex = index;
}
function updateContact() {
  let newContact = {
    fullName: fullNameInput.value,
    phoneNumber: phoneNumberInput.value,
    emailAddress: emailAddressInput.value,
    address: addressInput.value,
    group: groupInput.value,
    notes: notesInput.value,
    isFavorite: isFavoriteInput.checked,
    isEmergency: isEmergencyInput.checked,
  };
  contacts.splice(editIndex, 1, newContact);
  displayContacts(contacts);
  let addContactModal = document.getElementById("addContactModal");
  let modal = bootstrap.Modal.getInstance(addContactModal);
  modal.hide();
  saveToLocalStorage();
  clearInput();
  updateContactBtn.classList.add("d-none");
  saveContactBtn.classList.remove("d-none");
}

// toggle
function toggleFavourite(index) {
  contacts[index].isFavorite = !contacts[index].isFavorite;
  displayContacts(contacts);
  saveToLocalStorage();
}
function toggleEmergency(index) {
  contacts[index].isEmergency = !contacts[index].isEmergency;
  displayContacts(contacts);
  saveToLocalStorage();
}
// search
function search() {
  var searchArr = [];
  for (var i = 0; i < contacts.length; i++) {
    if (
      contacts[i].fullName
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()) ||
      contacts[i].phoneNumber
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()) ||
      (contacts[i].emailAddress || "")
        .toLowerCase()
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      searchArr.push(contacts[i]);
    }
  }
  displayContacts(searchArr);
}

var selectedInputs = document.querySelectorAll(".selectedInput");
console.log(selectedInputs);

for (var i = 0; i < selectedInputs.length; i++) {
  selectedInputs[i].addEventListener("input", function (e) {
    console.log(e.target);
    var inputId = e.target.id;
    var inputVal = e.target.value;
    validateInput(inputId, inputVal);
  });
}

function validateInput(id, value) {
  var regex = {
    fullName: /^[a-z\s]{3,15}$/,
    phoneNumber: /^01[0125][0-9]{8}$/,
  };
  var ele = document.getElementById(id);
  if (regex[id].test(value) == true) {
    ///^[a-z]{3,15}$/.test(mmm)
    ele.classList.add("is-valid");
    ele.classList.remove("is-invalid");
    ele.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    ele.classList.add("is-invalid");
    ele.classList.remove("valid");
    ele.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}
