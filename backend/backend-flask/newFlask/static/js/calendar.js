let EventBaseURL = 'https://my-cal-com-backend.vercel.app';

// Тестовые события
let DummyEvents = [
    // Ваши тестовые события
];

// Получение всех событий
async function FetchAllEvents() {
    spinner.style.display = "flex";  // Показать индикатор загрузки

    try {
        let response = await fetch(`${EventBaseURL}/events`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            let Data = await response.json();
            console.log(Data.events);
            RenderCalendar(Data.events);
        } else {
            console.error('Ошибка при загрузке событий');
            RenderCalendar(DummyEvents);  // Показать тестовые события в случае ошибки
        }
    } catch (err) {
        console.log(err);
        RenderCalendar(DummyEvents);  // Показать тестовые события в случае ошибки
    } finally {
        spinner.style.display = "none";  // Скрыть индикатор загрузки
    }
}

// Запуск функции для получения всех событий при загрузке страницы
FetchAllEvents();

// Функция для отрисовки событий на календаре
function RenderCalendar(events) {
    spinner.style.display = "flex";  // Показать индикатор загрузки

    if (events.length === 0) {
        events = DummyEvents;  // Показать тестовые события, если нет данных
    } else {
        events = events.map(event => ({
            title: event['Event Name'],
            start: `${event.Date}T${event.Time}`,
            end: `${event.Date}T${event.Time}`,  // Используем одно и то же время для начала и конца
            description: event.Description,
            color: event.Colour
        }));
    }

    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events,
        eventClick: function(info) {
            // Показать описание события при клике
            alert(`Description: ${info.event.extendedProps.description}`);
        }
    });

    calendar.render();
    spinner.style.display = "none";  // Скрыть индикатор загрузки после отрисовки
}

// Проверка и отображение email пользователя
let UserEmail = localStorage.getItem("username");
if (UserEmail) {
    let fullnameX = UserEmail.split("@")[0];
    let UserShow3 = document.getElementById("UserShow3");
    UserShow3.innerHTML = fullnameX;
}

// Функция выхода из системы
let Logout = document.getElementsByClassName("namecircle")[0];
if (Logout) {
    Logout.addEventListener("click", () => {
        swal("Logging Out..", "", "info");
        localStorage.clear();
        setTimeout(() => {
            window.location.href = "./index.html";
        }, 1000);
    });
}
