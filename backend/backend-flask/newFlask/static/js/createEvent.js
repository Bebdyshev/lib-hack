let spinner = document.getElementById('spinner');

// Обработчик отправки формы
document.getElementById('EventForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let eventName = document.getElementById('event_name');
    let location = document.getElementById('event_option');
    let color = document.getElementById('event_color');
    let description = document.getElementById('event_description');
    let date = document.getElementById('startDate');
    let time = document.getElementById('starttime');

    // Проверка на null
    if (!eventName || !location || !color || !description || !date || !time) {
        alert("Некоторые поля формы отсутствуют.");
        return;
    }

    let newEvent = {
        'Event Name': eventName.value,
        'Location': location.value,
        'Colour': color.value,
        'Description': description.value,
        'Date': date.value,
        'Time': time.value
    };

    try {
        let response = await fetch('/events/add', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            alert("Event added successfully");
            window.location.href = "/calendar";  // Redirect to calendar page
        } else {
            let errorData = await response.json();
            alert(`Failed to add event: ${errorData.error}`);
        }
    } catch (err) {
        console.log("Error adding event:", err);
        alert("Error adding event");
    }
});

// Функция для получения всех событий
async function FetchAllEvents() {
    if (spinner) spinner.style.display = "flex";  // Показать индикатор загрузки

    try {
        let response = await fetch('/events', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            let data = await response.json();
            RenderCalendar(data.events);
        } else {
            console.error('Ошибка при загрузке событий');
        }
    } catch (err) {
        console.log(err);
        RenderCalendar(DummyEvents);  // Показать тестовые события в случае ошибки
    } finally {
        if (spinner) spinner.style.display = "none";  // Скрыть индикатор загрузки
    }
}

// Запуск функции для получения всех событий при загрузке страницы
FetchAllEvents();

// Функция для отрисовки событий на календаре
function RenderCalendar(events) {
    if (spinner) spinner.style.display = "flex";  // Показать индикатор загрузки

    events = events.map(event => ({
        title: event['Event Name'],
        start: `${event.Date}T${event.Time}`,
        description: event.Description,
        color: event.Colour
    }));

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
            alert(`Description: ${info.event.extendedProps.description}`);
        }
    });

    calendar.render();
    if (spinner) spinner.style.display = "none";  // Скрыть индикатор загрузки после отрисовки
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
