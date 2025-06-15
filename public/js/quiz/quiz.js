const questions = [
  {
    question: "¿En qué juego principal se basa el canal de Hoopp?",
    answers: ["Minecraft", "Genshin Impact", "Fortnite", "Among Us"],
    correctIndex: 1,
  },
  {
    question: "¿Cuál es el color predominante en el estilo pastel de la página?",
    answers: ["Rojo fuerte", "Celeste y rosado suave", "Negro y gris", "Verde neón"],
    correctIndex: 1,
  },
  {
    question: "¿Qué plataforma usamos para mostrar videos?",
    answers: ["Vimeo", "YouTube", "Twitch", "Facebook"],
    correctIndex: 1,
  },
  {
    question: "¿Cuál es el máximo de palabras permitidas en las sugerencias?",
    answers: ["300", "500", "1000", "Sin límite"],
    correctIndex: 1,
  },
  {
    question: "¿Hoopp es una hamburguesa?",
    answers: ["Si", "No", "Hell nah", "Puede ser"],
    correctIndex: 1,
  },
];

const questionContainer = document.getElementById("question-container");
const answersContainer = document.getElementById("answers-container");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const scoreSpan = document.getElementById("score");
const playerNameInput = document.getElementById("player-name");
const saveScoreBtn = document.getElementById("save-score-btn");
const leaderboardList = document.getElementById("leaderboard-list");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  resultContainer.style.display = "none";
  nextBtn.style.display = "none";
  playerNameInput.value = "";
  showQuestion();
}

function showQuestion() {
  answered = false;
  nextBtn.style.display = "none";
  const q = questions[currentQuestionIndex];
  questionContainer.textContent = q.question;
  answersContainer.innerHTML = "";
  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.className = "answer-btn";
    btn.addEventListener("click", () => selectAnswer(i));
    answersContainer.appendChild(btn);
  });
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;
  const q = questions[currentQuestionIndex];
  const buttons = answersContainer.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add("correct");
    else if (i === index) btn.classList.add("wrong");
  });

  if (index === q.correctIndex) score++;

  if (currentQuestionIndex < questions.length - 1) {
    nextBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "none";
    showResult();
  }
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  showQuestion();
});

function showResult() {
  scoreSpan.textContent = score;
  resultContainer.style.display = "block";
}

// Cargar puntajes desde backend
async function loadScores() {
  try {
    const res = await fetch('/api/scores');
    if (!res.ok) throw new Error('Error al cargar puntajes');
    const leaderboard = await res.json();
    leaderboardList.innerHTML = "";
    if (leaderboard.length === 0) {
      leaderboardList.innerHTML = "<li>Aún no hay puntajes guardados.</li>";
      return;
    }
    leaderboard.forEach(({ name, score }, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${name} - ${score} / ${questions.length}`;
      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    leaderboardList.innerHTML = "<li>Error al cargar puntajes.</li>";
  }
}

// Guardar puntaje al backend
async function saveScoreToServer(name, score) {
  try {
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, score }),
    });
    if (!res.ok) throw new Error('Error al guardar puntaje');
    alert('Puntaje guardado en servidor.');
    loadScores();
  } catch (err) {
    console.error(err);
    alert('No se pudo guardar el puntaje en servidor.');
  }
}

saveScoreBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) return alert("Por favor escribe tu nombre para el top.");
  saveScoreToServer(name, score);
  startQuiz();
});

window.addEventListener("DOMContentLoaded", () => {
  startQuiz();
  loadScores();
});