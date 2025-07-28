document.addEventListener('DOMContentLoaded', () => {
  console.log('Isi quizList saat DOMContentLoaded:', window.quizList);

  const summaryContainer = document.getElementById('quiz-summary-list');
  if (!summaryContainer || typeof quizList === 'undefined') return;

  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalCompleted = 0;

  // 1. Kelompokkan quizList berdasarkan category
  const groupedByCategory = {};
  quizList.forEach(quiz => {
    const category = quiz.category || 'Lainnya';
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }
    groupedByCategory[category].push(quiz);
  });

  // 2. Untuk tiap kategori, render heading dan daftar kuisnya
  Object.entries(groupedByCategory).forEach(([category, quizzes]) => {
    const heading = document.createElement('h2');
    heading.className = 'mt-2 mb-1';
    heading.textContent = category;
    summaryContainer.appendChild(heading);

    quizzes.forEach(quiz => {
      const total = quiz.totalQuestions;
      let answeredCount = 0;
      let correctCount = 0;
      let incorrectCount = 0;

      for (let i = 0; i < total; i++) {
        const answerKey = `${quiz.id}_answer_${i}`;
        const correctKey = `${quiz.id}_correct_${i}`;

        const answer = localStorage.getItem(answerKey);
        const isCorrect = localStorage.getItem(correctKey);

        if (answer !== null) answeredCount++;
        if (isCorrect === '1') correctCount++;
        else if (isCorrect === '0') incorrectCount++;
      }

      const isCompleted = answeredCount === total;
      const correctPercent = total > 0 ? ((correctCount / total) * 100).toFixed(0) : 0;
      const incorrectPercent = total > 0 ? ((incorrectCount / total) * 100).toFixed(0) : 0;

      const card = document.createElement('div');
      card.className = 'card mb-1';

      const progressBar = `
        <div class="progress mb-1">
          <div role="progressbar" class="progress-bar progress-bar-striped progress-bar-animated progress-correct" style="width: ${correctPercent}%;">
            ${correctPercent > 10 ? correctPercent + '%' : ''}
          </div>
          <div class="progress-bar progress-incorrect" style="width: ${incorrectPercent}%;">
            ${incorrectPercent > 10 ? incorrectPercent + '%' : ''}
          </div>
        </div>
      `;

      let infoText = '';
      let button = '';

      if (isCompleted) {
        infoText = `<p>Kamu sudah menyelesaikan kuis ini.<br>Nilai: ${correctPercent}%</p>`;
      } else {
        infoText = `<p>Kamu menjawab: ${answeredCount} dari ${total} pertanyaan.<br> Nilai sementara: ${correctPercent}%</p>`;
        button = `<a href="${quiz.url}" class="btn btn-sm btn-primary mt-1">Lanjutkan kuis</a>`;
      }

      card.innerHTML = `
        <div class="card-header mb-1">
          <a href="${quiz.url}"><h3 class="h4 mb-0">${quiz.title}</h3></a>
        </div>
        <div class="card-body">
          ${progressBar}
          ${infoText}
          ${button}
        </div>
      `;

      summaryContainer.appendChild(card);

      totalQuestions += total;
      totalCorrect += correctCount;
      totalIncorrect += incorrectCount;
      if (isCompleted) totalCompleted++;
    });
  });

  // 3. Tambahkan Ringkasan keseluruhan di atas
  const correctTotalPercent = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(0) : 0;
  const incorrectTotalPercent = totalQuestions > 0 ? ((totalIncorrect / totalQuestions) * 100).toFixed(0) : 0;

  const totalCard = document.createElement('div');
  totalCard.id = 'quiz-summary-card';
  totalCard.className = 'card mb-1';

  const overallProgressBar = `
    <div class="progress mb-1">
      <div role="progressbar" class="progress-bar progress-bar-striped progress-bar-animated progress-correct" style="width: ${correctTotalPercent}%;">
        ${correctTotalPercent > 10 ? correctTotalPercent + '%' : ''}
      </div>
      <div class="progress-bar progress-incorrect" style="width: ${incorrectTotalPercent}%;">
        ${incorrectTotalPercent > 10 ? incorrectTotalPercent + '%' : ''}
      </div>
    </div>
  `;

  totalCard.innerHTML = `
    <div class="card-header mb-1">
      <h2 class="h3 mt-0">Nilai Keseluruhan</h2>
    </div>
    <div class="card-body">
      ${overallProgressBar}
      <p>Kuis selesai: ${totalCompleted} dari ${quizList.length}</p>
      <p>Nilai keseluruhan: <!-- ${totalCorrect} dari ${totalQuestions} --> ${correctTotalPercent}%</p>
    </div>
  `;

  summaryContainer.prepend(totalCard);
});
