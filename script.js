// ========================
// PART 1: Questions Data
// ========================
const questions = [
  {
    question: "How do you usually travel to work/school?",
    options: [
      { text: "Walk or bike", value: 0.1 },
      { text: "Public transport", value: 0.5 },
      { text: "Car (alone)", value: 2.0 },
      { text: "Carpool (2-4 people)", value: 0.8 }
    ]
  },
  {
    question: "How many flights do you take per year?",
    options: [
      { text: "None", value: 0 },
      { text: "1-2 short flights", value: 0.6 },
      { text: "3+ flights or long-haul", value: 2.5 }
    ]
  },
  {
    question: "What type of home do you live in?",
    options: [
      { text: "Small apartment", value: 1.0 },
      { text: "Medium house", value: 2.5 },
      { text: "Large house / villa", value: 4.0 }
    ]
  },
  // أضف أسئلة إضافية هنا إذا أردت
];

// ========================
// PART 2: State Variables
// ========================
let currentQuestion = 0;
let userAnswers = {};
let totalFootprint = 0;
const GLOBAL_AVERAGE = 4.7;

// متغير لحفظ الشارت عشان نقدر ندمره لاحقًا
let myChart = null;

// ========================
// PART 3: DOM Elements
// ========================
const questionTitle    = document.getElementById("question-title");
const optionsDiv       = document.getElementById("options");
const nextBtn          = document.getElementById("next-btn");
const questionSection  = document.getElementById("question-section");
const resultSection    = document.getElementById("result-section");
const resultText       = document.getElementById("result-text");
const comparisonText   = document.getElementById("comparison-text");
const recalculateBtn   = document.getElementById("recalculate-btn");

// ========================
// PART 4: Functions
// ========================

function showQuestion(index) {
  const q = questions[index];
  questionTitle.textContent = q.question;
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = opt.text;
    div.dataset.value = opt.value;

    div.addEventListener("click", () => {
      document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      nextBtn.disabled = false;
      userAnswers[index] = opt.value;
    });

    optionsDiv.appendChild(div);
  });

  nextBtn.disabled = true;
}

function calculateFootprint() {
  totalFootprint = Object.values(userAnswers).reduce((sum, val) => sum + Number(val), 0);
  totalFootprint = Math.round(totalFootprint * 10) / 10;
}

function showResult() {
  questionSection.style.display = "none";
  resultSection.style.display = "block";

  resultText.textContent = `Your estimated annual carbon footprint: ${totalFootprint} tons CO₂`;

  const status = totalFootprint > GLOBAL_AVERAGE ? "above" : "below";
  comparisonText.textContent = `Global average: ${GLOBAL_AVERAGE} tons CO₂ per person/year\nYour footprint is ${status} the global average.`;

  // تدمير الشارت القديم إذا موجود (حل مشكلة عدم التحديث)
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }

  // إنشاء شارت جديد
  const ctx = document.getElementById("compareChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Your Footprint", "Global Average"],
      datasets: [{
        label: "CO₂ emissions (tons/year)",
        data: [totalFootprint, GLOBAL_AVERAGE],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderColor: ["#2e8bc0", "#d9534f"],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Tons CO₂" } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function resetApp() {
  currentQuestion = 0;
  userAnswers = {};
  totalFootprint = 0;

  // تدمير الشارت عند إعادة الحساب
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }

  document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));

  resultSection.style.display = "none";
  questionSection.style.display = "block";

  showQuestion(0);
}

// ========================
// PART 5: Event Listeners
// ========================

nextBtn.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  } else {
    calculateFootprint();
    showResult();
  }
});

recalculateBtn.addEventListener("click", resetApp);

// Start
showQuestion(0);