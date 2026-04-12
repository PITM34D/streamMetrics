document.addEventListener("DOMContentLoaded", () => {
  const activeUsersValue = document.getElementById("active-users-value");
  const totalEventsValue = document.getElementById("total-events-value");
  const eventsChartContainer = document.getElementById("events-chart-container",);
  const topPagesList = document.getElementById("top-pages-list");
  const topTitlesList = document.getElementById("top-titles-list");
  const fromDateInput = document.getElementById("from-date");
  const toDateInput = document.getElementById("to-date");
  const applyFiltersBtn = document.getElementById("apply-filters-btn");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  const filtersError = document.getElementById("filters-error");

  const API_BASE_URL = "http://localhost:3000";

  function buildQueryParams() {
    const params = new URLSearchParams();

    if (fromDateInput.value) {
      params.append("from", fromDateInput.value);
    }

    if (toDateInput.value) {
      params.append("to", toDateInput.value);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }

  function validateDates(from, to) {
    if (from && to && from > to) {
      return "La fecha 'Desde' no puede ser mayor que 'Hasta'";
    }

    return null;
  }

  async function loadActiveUsers() {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(
        `${API_BASE_URL}/stats/active-users${queryParams}`,
      ); //peticion GET

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
      const queryParams = buildQueryParams();
      const response = await fetch(
        `${API_BASE_URL}/stats/total-events${queryParams}`,
      );

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
      const queryParams = buildQueryParams();
      const response = await fetch(`${API_BASE_URL}/stats/events-by-day${queryParams}`); //pedimos al back la info

      if (!response.ok) {
        throw new Error("No se pudo obtener la evolución de eventos");
      }

      const data = await response.json();
      console.log(
        "Respuesta events-by-day RAW:",
        JSON.stringify(data, null, 2),
      );

      if (!Array.isArray(data) || data.length === 0) {
        eventsChartContainer.innerHTML = "<p>No hay datos disponibles.</p>";
        return;
      }

      const maxTotal = Math.max(...data.map((item) => item.total));

      const chartHtml = data
        .map((item) => {
          const date = item.date ?? "Fecha desconocida";
          const total = item.total ?? 0;
          const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

          return `
            <div class="chart-row">
              <span class="chart-label">${date}</span>

              <div class="chart-bar-wrapper">
                <div class="chart-bar-track">
                  <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                </div>
              </div>

              <span class="chart-value">${total}</span>
            </div>
          `;
        })
        .join("");

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

  async function loadTopPages() {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`${API_BASE_URL}/stats/top-pages${queryParams}`);

      if (!response.ok) {
        throw new Error("No se pudo obtener el ranking de páginas");
      }

      const data = await response.json();
      console.log("Respuesta top-pages RAW:", JSON.stringify(data, null, 2));

      if (!Array.isArray(data) || data.length === 0) {
        topPagesList.innerHTML = "<li>No hay datos</li>";
        return;
      }

      const listHtml = data
        .map((item) => {
          const page = item.page;
          const total = item.total;

          return `
        <li class="ranking-item">
          <span class="ranking-label">${page}</span>
          <span class="ranking-value">${total}</span>
        </li>
      `;
        })
        .join("");

      topPagesList.innerHTML = listHtml;
    } catch (error) {
      console.error("Error al cargar top pages:", error);
      topPagesList.innerHTML = "<li>Error al cargar</li>";
    }
  }

  async function loadTopTitles() {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`${API_BASE_URL}/stats/top-titles${queryParams}`);

      if (!response.ok) {
        throw new Error("No se pudo obtener el ranking de títulos");
      }

      const data = await response.json();
      console.log("Respuesta top-titles RAW:", JSON.stringify(data, null, 2));

      if (!Array.isArray(data) || data.length === 0) {
        topTitlesList.innerHTML = "<li>No hay datos</li>";
        return;
      }

      const listHtml = data
        .map((item) => {
          const title = item.title;
          const total = item.total;

          return `
        <li class="ranking-item">
          <span class="ranking-label">${title}</span>
          <span class="ranking-value">${total}</span>
        </li>
      `;
        })
        .join("");

      topTitlesList.innerHTML = listHtml;
    } catch (error) {
      console.error("Error al cargar top titles:", error);
      topTitlesList.innerHTML = "<li>Error al cargar</li>";
    }
  }

  function setLoadingState() {
  activeUsersValue.textContent = "...";
  totalEventsValue.textContent = "...";

  eventsChartContainer.innerHTML = "<p>Cargando datos...</p>";

  topPagesList.innerHTML = "<li>Cargando...</li>";
  topTitlesList.innerHTML = "<li>Cargando...</li>";
}

  async function loadDashboardData() {
    setLoadingState();

    await loadActiveUsers();
    await loadTotalEvents();
    await loadEventsByDay();
    await loadTopPages();
    await loadTopTitles();
  }

  async function init() {
    console.log("Dashboard de StreamMetrics cargado");

    applyFiltersBtn.addEventListener("click", async () => {
      const from = fromDateInput.value;
      const to = toDateInput.value;

      const error = validateDates(from, to);

      if (error) {
        filtersError.textContent = error;
        return;
      }

      filtersError.textContent = "";

      console.log("Filtros aplicados:", {
        from,
        to,
        query: buildQueryParams()
      });

      await loadDashboardData();
    });

    resetFiltersBtn.addEventListener("click", async () => {
      fromDateInput.value = "";
      toDateInput.value = "";
      filtersError.textContent = "";

      await loadDashboardData();
    });

    await loadDashboardData();
  }

  init();
});
