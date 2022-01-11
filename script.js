"use strict"

const serverAddress = 'https://cpa.ruki-iz-plech.ru/api/leads/create';

const form = document.querySelector('#form');
const tokenSelect = form.querySelector('select[name=token]');
const phoneInput = form.querySelector('input[name=phone]');
const messageTextarea = form.querySelector('textarea[name=message]');
const sendButton = form.querySelector('button[type=submit]');

const successModal = new bootstrap.Modal(document.getElementById('successModal'), {
  keyboard: false
});

const phoneNumberErrorEl = document.querySelector('#phoneNumberError');

form.addEventListener('submit', ev => {

  ev.preventDefault();

  if (!phoneInput.value) {
    phoneNumberErrorEl.textContent = 'Это поле обязательно для заполнения.';
    return;
  }

  const token = tokenSelect.value;
  const phone = phoneInput.value;
  const message = messageTextarea.value;

  const data = {
    phone: phone,
    message: message
  }

  phoneNumberErrorEl.innerHTML = "&nbsp;"
  lockControls(true);
  sendRequest(serverAddress, data, token)
});


function sendRequest(address, data, token) {
  fetch(address, {
    method: 'POST',
    headers: {
      'auth': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        phoneNumberErrorEl.textContent = 'Неверный формат номера телефона.';
        throw new Error();
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      successModal.toggle();
      form.reset();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      lockControls(false);
    });
}

function lockControls(locked) {
  sendButton.disabled = locked;
  phoneInput.disabled = locked;
  messageTextarea.disabled = locked;
}
