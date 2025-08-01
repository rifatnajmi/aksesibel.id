document.addEventListener('DOMContentLoaded', () => {
	// Helper Umami tracker
	function trackEvent(eventName, props = {}) {
		if (typeof umami !== 'undefined') {
			umami.track(eventName, props);
		} else {
			console.warn('[Umami] Tracker tidak tersedia.');
		}
	}

	const container = document.getElementById('quiz-container');

	if (!container || typeof quizData === 'undefined' || typeof quizList === 'undefined') {
		console.warn('Quiz container, quizData, atau quizList tidak ditemukan.');
		return;
	}

	const currentPath = window.location.pathname.replace(/^\/aksesibel/, '');
	const currentQuiz = quizList.find(q => q.url === currentPath);

	if (!currentQuiz) {
		console.warn(`Quiz tidak ditemukan di quizList.js untuk path: ${currentPath}`);
		return;
	}

	const quizId = currentQuiz.id;

	function getAnswerKey(index) {
		return `${quizId}_answer_${index}`;
	}

	function trackAnswer(index, isCorrect) {
		trackEvent('quiz_answer', {
			quiz_id: quizId,
			question_index: index,
			is_correct: isCorrect,
			category: 'quiz',
			label: `${quizId} - Q${index + 1}`
		});
	}

	function trackCompletion(correctCount, total) {
		trackEvent('quiz_completed', {
			quiz_id: quizId,
			total_questions: total,
			correct_answers: correctCount,
			score_percent: Math.round((correctCount / total) * 100),
			category: 'quiz',
			label: `${quizId} - completed`
		});
	}

	function showSummary() {
		const total = quizData.length;
		let correctCount = 0;

		quizData.forEach((item, i) => {
			const ans = localStorage.getItem(getAnswerKey(i));
			if (ans !== null && item.choices[parseInt(ans)].correct === '1') {
				correctCount++;
			}
		});

		const percent = (correctCount / total) * 100;
		const message = percent >= 75
			? 'Hebat! Kamu sudah menguasai sebagian besar materi. Terus pertahankan dan kembangkan pengetahuanmu.'
			: 'Jangan menyerah! Coba pelajari kembali materi yang kurang kamu pahami.';

		let summaryCard = document.getElementById('quiz-summary-card');
		if (!summaryCard) {
			summaryCard = document.createElement('div');
			summaryCard.id = 'quiz-summary-card';
			summaryCard.classList.add('card', 'mt-1');
			container.after(summaryCard);
		}

		summaryCard.innerHTML = `
      <div class="card-header">
        Kamu menjawab ${correctCount} / ${total} benar (${percent.toFixed(0)}%)
      </div>
      <div class="card-body">
        <p>${message}</p>
      </div>
    `;

		trackCompletion(correctCount, total);
	}

	function checkAllAnswered() {
		return quizData.every((_, i) => localStorage.getItem(getAnswerKey(i)) !== null);
	}

	quizData.forEach((item, index) => {
		const cardDiv = document.createElement('div');
		cardDiv.classList.add('card', 'mb-1');

		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		const q = document.createElement('p');
		q.classList.add('card-title', 'h5', 'mb-1');
		q.textContent = `${item.question}`;
		cardBody.appendChild(q);

		const choicesDiv = document.createElement('div');
		choicesDiv.setAttribute('role', 'radiogroup');
		choicesDiv.setAttribute('aria-labelledby', `question-label-${index}`);

		item.choices.forEach((choice, i) => {
			const choiceId = `q${index}_choice${i}`;
			const label = document.createElement('label');
			label.setAttribute('for', choiceId);
			label.classList.add('form-check-label', 'd-block');

			const radio = document.createElement('input');
			radio.type = 'radio';
			radio.name = `question-${index}`;
			radio.value = i;
			radio.id = choiceId;
			radio.classList.add('form-check-input', 'me-2');

			label.prepend(radio);
			label.append(choice.text);

			choicesDiv.appendChild(label);
		});

		cardBody.appendChild(choicesDiv);
		cardDiv.appendChild(cardBody);

		const cardFooter = document.createElement('div');
		cardFooter.classList.add('card-footer');

		const submitBtn = document.createElement('button');
		submitBtn.type = 'button';
		submitBtn.classList.add('btn', 'btn-primary', 'mt-1');
		submitBtn.textContent = 'Kirim';

		cardFooter.appendChild(submitBtn);

		const feedbackDiv = document.createElement('div');
		feedbackDiv.classList.add('alert', 'mt-1');
		feedbackDiv.setAttribute('role', 'alert');
		feedbackDiv.setAttribute('aria-live', 'polite');
		feedbackDiv.style.display = 'none';

		cardFooter.appendChild(feedbackDiv);
		cardDiv.appendChild(cardFooter);

		container.appendChild(cardDiv);

		function disableQuiz() {
			choicesDiv.querySelectorAll('input[type=radio]').forEach(radio => radio.disabled = true);
			submitBtn.disabled = true;
		}

		function showFeedback(isCorrect, text) {
			feedbackDiv.classList.remove('alert-success', 'alert-danger');
			feedbackDiv.innerHTML = '';

			const icon = document.createElement('i');
			icon.classList.add('me-2', 'fal');
			icon.classList.add(isCorrect ? 'fa-circle-check' : 'fa-circle-xmark');
			feedbackDiv.classList.add(isCorrect ? 'alert-success' : 'alert-danger');

			feedbackDiv.appendChild(icon);
			feedbackDiv.appendChild(document.createTextNode(text));
			feedbackDiv.style.display = 'block';
		}

		// Cek apakah sudah dijawab
		const storedAnswer = localStorage.getItem(getAnswerKey(index));
		if (storedAnswer !== null) {
			const ansIndex = parseInt(storedAnswer);
			const correct = item.choices[ansIndex].correct === '1';
			showFeedback(correct, item.choices[ansIndex].feedback);

			const radios = choicesDiv.querySelectorAll('input[type=radio]');
			radios.forEach(radio => {
				radio.disabled = true;
				if (parseInt(radio.value) === ansIndex) {
					radio.checked = true;
				}
			});
			submitBtn.disabled = true;
		}

		submitBtn.addEventListener('click', () => {
			const selected = choicesDiv.querySelector('input[type=radio]:checked');
			if (!selected) {
				alert('Silakan pilih jawaban terlebih dahulu.');
				return;
			}

			const selectedIndex = parseInt(selected.value);
			const selectedChoice = item.choices[selectedIndex];

			localStorage.setItem(getAnswerKey(index), selectedIndex);
			localStorage.setItem(`${quizId}_correct_${index}`, selectedChoice.correct);

			showFeedback(selectedChoice.correct === '1', selectedChoice.feedback);
			disableQuiz();

			// Kirim tracking jawaban ke Umami
			trackAnswer(index, selectedChoice.correct === '1');

			if (quizData.length && checkAllAnswered()) {
				localStorage.setItem(`${quizId}_completed`, '1');
				showSummary();
			}
		});
	});

	if (quizData.length && checkAllAnswered()) {
		showSummary();
	}
});
