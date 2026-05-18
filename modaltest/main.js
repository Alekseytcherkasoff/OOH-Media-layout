const successModal = document.getElementById('success-modal')
const closeButton = successModal.querySelector('.close-button')

// Функция для открытия модального окна
function openSuccessModal() {
  if (successModal) {
    successModal.style.display = 'flex' // Показываем модальное окно
    document.body.style.overflow = 'hidden' // Запрещаем прокрутку страницы под модальным окном
  }
}

// Функция для закрытия модального окна
function closeSuccessModal() {
  if (successModal) {
    successModal.style.display = 'none' // Скрываем модальное окно
    document.body.style.overflow = '' // Разрешаем прокрутку страницы
  }
}

// Прикрепляем обработчики событий

// 1. Закрыть при клике на кнопку "крестик"
if (closeButton) {
  closeButton.onclick = function () {
    closeSuccessModal()
  }
}

// 2. Закрыть при клике вне модального окна (по затемненному фону)
if (successModal) {
  successModal.onclick = function (event) {
    // Если клик был непосредственно по фону модального окна (.modal), а не по его содержимому (.modal-content)
    if (event.target === successModal) {
      closeSuccessModal()
    }
  }
}

// 3. Закрыть при нажатии клавиши Esc
document.addEventListener('keydown', function (event) {
  if (
    event.key === 'Escape' &&
    successModal &&
    successModal.style.display === 'flex'
  ) {
    closeSuccessModal()
  }
})

// --- ИЗМЕНЕНИЕ В handleFormSubmit ---
// В вашей функции handleFormSubmit, после успешной обработки:
// Замените alert('Ваша заявка успешно отправлена!');
// на вызов функции открытия модального окна:

function handleFormSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  // ... (ваша валидация и сбор данных) ...

  fetch('/path/to/your/send_form.php', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка сервера: ' + response.statusText)
      }
      return response.json()
    })
    .then((result) => {
      if (result.status === 'success') {
        // !!! ЗАМЕНИТЕ АЛЕРТ НА ЭТО !!!
        openSuccessModal() // Открываем модальное окно благодарности
        form.reset() // Очищаем форму
      } else {
        // Обработка ошибок от бэкенда (например, если есть ошибки валидации)
        console.error('Ошибка ответа сервера:', result)
        alert(
          result.message ||
            'Произошла ошибка при отправке заявки. Попробуйте позже.'
        )
      }
    })
    .catch((error) => {
      console.error('Ошибка:', error)
      alert('Произошла ошибка при отправке заявки. Попробуйте позже.')
    })
}
