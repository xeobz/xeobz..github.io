
let results = [];

fetch("https://your-api.onrender.com/api/results")
  .then(res => res.json())
  .then(data => {
    results = data;
    renderTable();
  })
  .catch(err => {
    console.error("Ошибка загрузки результатов:", err);
  });

function renderTable() {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  results.forEach((result, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${result.name}</td>
      <td>${result.email}</td>
      <td>${result.date}</td>
      <td>${result.test}</td>
      <td>
        <div class="radial-progress text-primary" style="--value:${result.accuracy}; --size:2rem; --thickness:3px;">${result.accuracy}%</div>
      </td>
      <td><span class="badge badge-primary">${result.style}</span></td>
      <td><button class="btn btn-sm btn-outline" onclick="showResultModal(${index})">Подробнее</button></td>
    `;

    tbody.appendChild(row);
  });
}

function showResultModal(index) {
  const modal = document.getElementById("result-modal");
  const result = results[index];

  modal.querySelector("h3").textContent = "Результаты теста: " + result.test;
  modal.querySelector("p.py-2").textContent = `${result.name} | ${result.date} | Точность: ${result.accuracy}%`;

  const tabs = modal.querySelector(".tabs");
  const questionsContainer = modal.querySelector(".space-y-4");
  const recommendationBox = modal.querySelector(".card-body p");

  // Очистка
  tabs.innerHTML = "";
  questionsContainer.innerHTML = "";

  result.parts.forEach((part, i) => {
    const tab = document.createElement("a");
    tab.className = "tab tab-lifted" + (i === 0 ? " tab-active" : "");
    tab.textContent = `Часть ${i + 1}: ${part.title}`;
    tabs.appendChild(tab);

    part.questions.forEach((q, qIndex) => {
      const question = document.createElement("div");
      question.className = "collapse collapse-plus bg-base-200";
      question.innerHTML = `
        <input type="radio" name="accordion-${index}" ${qIndex === 0 ? "checked" : ""} />
        <div class="collapse-title text-lg font-medium">${q.text}</div>
        <div class="collapse-content space-y-2">
          <div><span class="font-medium">Выбранный ответ:</span> <span class="badge badge-outline">${q.selected}</span></div>
          <div><span class="font-medium">Наиболее эффективно:</span> <span class="badge badge-success">${q.mostEffective}</span></div>
          <div><span class="font-medium">Наименее эффективно:</span> <span class="badge badge-error">${q.leastEffective}</span></div>
        </div>
      `;
      questionsContainer.appendChild(question);
    });
  });

  recommendationBox.textContent = result.recommendation;

  modal.showModal();
}

// Автоматический запуск
document.addEventListener("DOMContentLoaded", () => {
  renderTable();
});

function filterResults() {
  const testFilter = document.querySelector('select:nth-of-type(1)').value;
  const dateFilter = document.querySelector('input[type="date"]').value;
  const styleFilter = document.querySelector('select:nth-of-type(2)').value;

  const filtered = results.filter(r => {
    return (testFilter === "Все тесты" || r.test === testFilter) &&
           (!dateFilter || r.date === dateFilter) &&
           (styleFilter === "Все стили" || r.style === styleFilter);
  });

  renderTable(filtered);
}