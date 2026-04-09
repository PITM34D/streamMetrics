document.addEventListener("DOMContentLoaded", () => {
  const activeUsersValue = document.getElementById("active-users-value");
  const totalEventsValue = document.getElementById("total-events-value");
  const eventsChartContainer = document.getElementById("events-chart-container");
  const topPagesList = document.getElementById("top-pages-list");
  const topTitlesList = document.getElementById("top-titles-list");

  const API_BASE_URL = "http://localhost:3000";

  async function loadActiveUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/active-users`); //peticion GET

      if (!response.ok) {
        throw new Error("No se pudo obtener el KPI de usuarios activos");
      }

      const data = await response.json();
      console.log("Respuesta active-users RAW:", JSON.stringify(data, null, 2)); //

      let activeUsers = 0; // por si aca

      if (Array.isArray(data) && data.length > 0) {
        activeUsers = data[0].active_users ?? 0; //Lee el dato
      } else if (typeof data === "object" && data !== null) {
        activeUsers = data.active_users ?? 0;
      }

      activeUsersValue.textContent = activeUsers; // Pintamos el dato
    } catch (error) {
      console.error("Error al cargar usuarios activos:", error);
      activeUsersValue.textContent = "Error";
    }
  }

  async function loadTotalEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/total-events`);

    if (!response.ok) {
      throw new Error("No se pudo obtener el total de eventos");
    }

    const data = await response.json();
    console.log("Respuesta total-events RAW:", JSON.stringify(data, null, 2));

    const totalEvents = data.total_events ?? 0;

    totalEventsValue.textContent = totalEvents;
  } catch (error) {
    console.error("Error al cargar total de eventos:", error);
    totalEventsValue.textContent = "Error";
  }
}

async function loadEventsByDay() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/events-by-day`);//pedimos al back la info

    if (!response.ok) {
      throw new Error("No se pudo obtener la evolución de eventos");
    }

    const data = await response.json();
    console.log("Respuesta events-by-day RAW:", JSON.stringify(data, null, 2));

    if (!Array.isArray(data) || data.length === 0) {
      eventsChartContainer.innerHTML = "<p>No hay datos disponibles.</p>";
      return;
    }

    const chartHtml = data.map(item => {
      const date = item.date ?? "Fecha desconocida";
      const total = item.total ?? 0;

      return `
        <div class="chart-row">
          <span class="chart-label">${date}</span>
          <span class="chart-value">${total} eventos</span>
        </div>
      `;
    }).join("");

    eventsChartContainer.innerHTML = `
      <div class="chart-list">
        ${chartHtml}
      </div>
    `;
  } catch (error) {
    console.error("Error al cargar eventos por día:", error);
    eventsChartContainer.innerHTML = "<p>Error al cargar la gráfica.</p>";
  }
}



async function init() {
console.log("Dashboard de StreamMetrics cargado");

await loadActiveUsers(); //await para dejar claro que forma parte del arranque
await loadTotalEvents();
await loadEventsByDay();
}

  init();
});
