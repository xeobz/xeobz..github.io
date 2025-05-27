const testData = [];

function getTestDataFromUI() {
  const testTitle = document.querySelector('input[placeholder="Введите название теста"]').value;
  const testInstruction = document.querySelector('textarea[placeholder*="инструкцию"]').value;

  const partBlocks = document.querySelectorAll('[placeholder^="Блок"]');
  const testParts = [];

  partBlocks.forEach((blockEl, partIndex) => {
    const part = {
      title: blockEl.value || `Блок ${partIndex + 1}`,
      questions: []
    };

    const partCard = blockEl.closest('.card');
    const questionCards = partCard.querySelectorAll('.question-item');

    questionCards.forEach((qEl) => {
      const questionText = qEl.querySelector('textarea').value;
      const options = [];

      const optionRows = qEl.querySelectorAll('.flex.items-center');

      optionRows.forEach((row) => {
        const text = row.querySelector('input[type="text"]').value;
        const most = row.querySelector('.checkbox-success').checked;
        const least = row.querySelector('.checkbox-error').checked;

        options.push({ text, most, least });
      });

      part.questions.push({ text: questionText, options });
    });

    testParts.push(part);
  });

  const testObject = {
    id: 'test-' + Date.now(),
    title: testTitle,
    instruction: testInstruction,
    parts: testParts
  };

  return testObject;
}

function saveTestToMemory() {
  const test = getTestDataFromUI();
  testData.push(test);
  console.log('Тест сохранён:', test);
  alert('Тест успешно сохранён в памяти');
}

function sendTestToServer() {
  const test = getTestDataFromUI();
  fetch("https://your-api.onrender.com/api/tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(test)
  })
  .then(res => res.json())
  .then(data => alert("Тест отправлен на сервер"))
  .catch(err => console.error("Ошибка:", err));
}

function sendTestToServer() {
  const test = getTestDataFromUI();

  fetch("https://your-api.onrender.com/api/tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(test)
  })
  .then(res => res.json())
  .then(data => alert("Тест отправлен"))
  .catch(err => console.error("Ошибка:", err));
}