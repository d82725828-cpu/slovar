

const dictionary = {

    en: {
        name: "Английский 🇬🇧",
        speech: "en-US",
        words: [
            ["Hello", "Привет", "хэлоу"],
            ["Water", "Вода", "уотэр"],
            ["House", "Дом", "хаус"],
            ["Friend", "Друг", "фрэнд"],
            ["Book", "Книга", "бук"],
            ["School", "Школа", "скул"],
            ["Love", "Любовь", "лав"],
            ["Beautiful", "Красивый", "бьютифул"],
            ["Morning", "Утро", "морнинг"],
            ["Family", "Семья", "фэмили"]
        ]
    },

    de: {
        name: "Немецкий 🇩🇪",
        speech: "de-DE",
        words: [
            ["Hallo", "Привет", "халло"],
            ["Wasser", "Вода", "вассер"],
            ["Haus", "Дом", "хаус"],
            ["Freund", "Друг", "фройнд"],
            ["Buch", "Книга", "бух"],
            ["Schule", "Школа", "шуле"],
            ["Liebe", "Любовь", "либе"],
            ["Schön", "Красивый", "шён"],
            ["Morgen", "Утро", "морген"],
            ["Familie", "Семья", "фамилие"]
        ]
    },

    fr: {
        name: "Французский 🇫🇷",
        speech: "fr-FR",
        words: [
            ["Bonjour", "Здравствуйте", "бонжур"],
            ["Eau", "Вода", "о"],
            ["Maison", "Дом", "мэзон"],
            ["Ami", "Друг", "ами"],
            ["Livre", "Книга", "ливр"],
            ["École", "Школа", "эколь"],
            ["Amour", "Любовь", "амур"],
            ["Beau", "Красивый", "бо"],
            ["Matin", "Утро", "матэн"],
            ["Famille", "Семья", "фамий"]
        ]
    },

    es: {
        name: "Испанский 🇪🇸",
        speech: "es-ES",
        words: [
            ["Hola", "Привет", "ола"],
            ["Agua", "Вода", "агуа"],
            ["Casa", "Дом", "каса"],
            ["Amigo", "Друг", "амиго"],
            ["Libro", "Книга", "либро"],
            ["Escuela", "Школа", "эскуэла"],
            ["Amor", "Любовь", "амор"],
            ["Bonito", "Красивый", "бонито"],
            ["Mañana", "Утро", "маньяна"],
            ["Familia", "Семья", "фамилия"]
        ]
    }

};

let currentLanguage = null;
let currentIndex = 0;
let currentQuestion = null;
let answered = false;

let progress = JSON.parse(
    localStorage.getItem("polyglotProgress") ||
    '{"xp":0,"words":0}'
);

function saveProgress() {
    localStorage.setItem(
        "polyglotProgress",
        JSON.stringify(progress)
    );
    updateStats();
}

function updateStats() {
    const level = Math.floor(progress.xp / 100) + 1;
    const currentXP = progress.xp % 100;

    document.getElementById("wordsLearned").textContent =
        progress.words;

    document.getElementById("xp").textContent =
        progress.xp;

    document.getElementById("level").textContent =
        level;

    document.getElementById("progressFill").style.width =
        currentXP + "%";
}

function selectLanguage(language) {

    currentLanguage = language;
    currentIndex = 0;

    document.querySelectorAll(".language").forEach(button => {
        button.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

    document.getElementById("languageName").textContent =
        dictionary[language].name;

    document.getElementById("learning").classList.remove("hidden");

    showWord();
    nextQuestion();
}

function showWord() {

    const word = dictionary[currentLanguage].words[currentIndex];

    document.getElementById("word").textContent = word[0];
    document.getElementById("translation").textContent = word[1];

    document.getElementById("pronunciation").textContent =
        "Произношение: " + word[2];
}

function speakWord() {

    const word = dictionary[currentLanguage].words[currentIndex][0];

    const speech = new SpeechSynthesisUtterance(word);

    speech.lang = dictionary[currentLanguage].speech;
    speech.rate = 0.8;

    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
}

function nextWord() {

    currentIndex++;

    if (currentIndex >= dictionary[currentLanguage].words.length) {
        currentIndex = 0;
    }

    showWord();

    progress.words++;
    progress.xp += 5;

    saveProgress();
}

function nextQuestion() {

    if (!currentLanguage) return;

    answered = false;

    const words = dictionary[currentLanguage].words;

    const randomIndex = Math.floor(Math.random() * words.length);

    currentQuestion = words[randomIndex];

    document.getElementById("quizQuestion").textContent =
        "Как переводится слово: " + currentQuestion[0] + "?";

    document.getElementById("feedback").textContent = "";

    document.getElementById("quizButton").disabled = true;

    let answers = [currentQuestion[1]];

    while (answers.length < 4) {

        const randomWord = words[
            Math.floor(Math.random() * words.length)
        ][1];

        if (!answers.includes(randomWord)) {
            answers.push(randomWord);
        }
    }

    answers.sort(() => Math.random() - 0.5);

    const options = document.getElementById("quizOptions");

    options.innerHTML = "";

    answers.forEach(answer => {

        const button = document.createElement("button");

        button.className = "option";
        button.textContent = answer;

        button.onclick = () => checkAnswer(answer, button);

        options.appendChild(button);
    });
}

function checkAnswer(answer, button) {

    if (answered) return;

    answered = true;

    const buttons = document.querySelectorAll(".option");

    buttons.forEach(btn => {
        btn.disabled = true;
    });

    if (answer === currentQuestion[1]) {

        document.getElementById("feedback").textContent =
            "✅ Правильно! +10 XP";

        progress.xp += 10;

    } else {

        document.getElementById("feedback").textContent =
            "❌ Неправильно. Правильный ответ: " +
            currentQuestion[1];
    }

    document.getElementById("quizButton").disabled = false;

    saveProgress();
}

updateStats();

