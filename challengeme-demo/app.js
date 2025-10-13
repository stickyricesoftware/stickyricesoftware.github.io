document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const themeToggle = document.getElementById("themeToggle");

  // ✅ Apply saved theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");

  // ✅ Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const html = document.documentElement;
      const isDark = html.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ✅ Pages
  const pages = {
    welcome: `
      <h1 class="text-3xl font-bold mb-4">Welcome to Your App</h1>
      <p class="text-lg mb-8">Welcome your users here!</p>
      <div class="max-w-4xl mx-auto overflow-hidden">
        <div id="carousel" class="flex transition-transform duration-700 ease-in-out">
          ${[...Array(7)]
            .map(
              (_, i) => `
              <img src="https://picsum.photos/200/300?random=${i + 1}"
                   alt="Image ${i + 1}"
                   class="w-1/3 flex-shrink-0 p-2 rounded-lg">
            `
            )
            .join("")}
        </div>
        <div class="flex justify-center mt-4 space-x-3">
          <button id="prevBtn" class="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded">‹</button>
          <button id="nextBtn" class="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded">›</button>
        </div>
      </div>
    `,
    about: `
      <h1 class="text-3xl font-bold mb-4">About</h1>
      <p class="text-lg">Tell them about your app here!</p>
    `,
    feature: `
      <h1 class="text-3xl font-bold mb-4">Word Guess Game</h1>
      <p class="text-lg mb-4">Guess the secret 5-letter word!</p>
      <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <input id="guessInput" type="text" maxlength="5" placeholder="Enter guess..."
          class="w-full p-2 border dark:border-gray-700 rounded mb-3 text-center uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
        <button id="submitGuess" class="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
          Submit Guess
        </button>
        <p id="message" class="mt-4 font-semibold"></p>
      </div>
    `
  };

  // ✅ Navigation
  window.navigate = (page) => {
    content.innerHTML = pages[page];
    if (page === "feature") initWordGame();
    if (page === "welcome") initCarousel();
    mobileMenu.classList.add("hidden");
  };

  // ✅ Word Game
  function initWordGame() {
    const words = ["APPLE", "PLANT", "HOUSE", "MUSIC", "WATER", "CHAIR", "BRAIN"];
    const secret = words[Math.floor(Math.random() * words.length)];
    const input = document.getElementById("guessInput");
    const button = document.getElementById("submitGuess");
    const message = document.getElementById("message");
    let attempts = 0;

    button.addEventListener("click", () => {
      const guess = input.value.toUpperCase();
      attempts++;
      if (guess.length !== 5) {
        message.textContent = "Please enter a 5-letter word.";
        message.className = "mt-4 text-yellow-600 dark:text-yellow-400 font-semibold";
        return;
      }
      if (guess === secret) {
        message.textContent = `🎉 Correct! The word was "${secret}". You guessed it in ${attempts} tries.`;
        message.className = "mt-4 text-green-600 dark:text-green-400 font-semibold";
        button.disabled = true;
        input.disabled = true;
      } else {
        let feedback = "";
        for (let i = 0; i < 5; i++) {
          if (guess[i] === secret[i]) feedback += guess[i];
          else if (secret.includes(guess[i])) feedback += "?";
          else feedback += "_";
        }
        message.textContent = `Try again! Hint: ${feedback}`;
        message.className = "mt-4 text-red-600 dark:text-red-400 font-semibold";
      }
      input.value = "";
    });
  }

  // ✅ Carousel
  function initCarousel() {
    const carousel = document.getElementById("carousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const totalImages = 7;
    const visibleImages = 3;
    let currentIndex = 0;

    function updateCarousel() {
      const offset = -(currentIndex * (100 / visibleImages));
      carousel.style.transform = `translateX(${offset}%)`;
    }

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex < totalImages - visibleImages) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalImages - visibleImages;
      updateCarousel();
    });

    setInterval(() => nextBtn.click(), 3000);
  }

  // ✅ Mobile menu
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ✅ Default page
  navigate("welcome");
});
