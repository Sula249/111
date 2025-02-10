let tg = window.Telegram.WebApp;

tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const questionContainer = document.getElementById("questionContainer");
    const searchForm = document.getElementById('search-form');
    const queryInput = document.getElementById('query');

    // включаем кнопку "Назад" в Telegram
    tg.BackButton.onClick(() => {
        searchContainer.classList.remove("show");
        questionContainer.classList.remove("show");
        tg.BackButton.hide(); // Скрываем кнопку "Назад"
        searchButton.classList.remove("flipped");
        searchButton.innerText = "Начать поиск";
    });

    searchButton.addEventListener("click", () => {
        searchButton.classList.add("flipped");
        setTimeout(() => {
            if (searchButton.innerText === "Начать поиск") {
                searchButton.innerText = "Задать вопрос";
                searchContainer.classList.add("show");
                questionContainer.classList.remove("show");
            } else {
                searchButton.innerText = "Начать поиск";
                questionContainer.classList.add("show");
                searchContainer.classList.remove("show");
            }
            searchButton.classList.remove("flipped");
            // показываем кнопку "Назад", если есть активное поле ввода
            if (searchContainer.classList.contains("show") || questionContainer.classList.contains("show")) {
                tg.BackButton.show();
            } else {
                tg.BackButton.hide();
            }
        }, 300);
    });

    // Обработка события отправки формы
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = queryInput.value;
        if (!query) return;

        // Логирование запроса в Google Таблицы (Replace with your actual script URL)
        logQueryToGoogleSheets(query);

        // Установка значения в Google CSE
        const searchElement = document.querySelector('input.gsc-input');
        if (searchElement) {
            searchElement.value = query;
            const searchButtonCSE = document.querySelector('button.gsc-search-button');
            if (searchButtonCSE) {
                searchButtonCSE.click();
            }
        } else {
            console.error('Google CSE input field not found.');
        }

        searchContainer.classList.remove("show");
        questionContainer.classList.remove("show");
        tg.BackButton.hide();
        searchButton.classList.remove("flipped");
        searchButton.innerText = "Начать поиск";
    });

    // Функция для логирования запросов в Google Таблицы
    async function logQueryToGoogleSheets(query) {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbypBtYb0Y8XiGYlEpRyzJq_yqCrE5ieiFwXT92MPsSF29EIFQLmOcp0gZZXasgQb3S9/exec';
        try {
            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query
                })
            });
            console.log('Query logged to Google Sheets:', query);
        } catch (error) {
            console.error('Error logging query to Google Sheets:', error);
        }
    }
});
 
