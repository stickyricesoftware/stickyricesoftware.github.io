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
      <p class="text-lg">This is a demo app to help you visualise the basics of your project.</p>
      <p class="text-lg">Got any questions? Jsut reach out to me directly</p>
    
      `,
play: `
  <h1 class="text-3xl font-bold mb-4">Play Chess ♟️</h1>
  <div id="board" class="max-w-md mx-auto"></div>
  <div class="mt-4 text-center">
    <button id="resetBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">Restart Game</button>
  </div>
  <p id="status" class="mt-4 text-center font-semibold"></p>
`,

  };

  // ✅ Navigation
  window.navigate = (page) => {
    content.innerHTML = pages[page];
    if (page === "play") initChessGame();
    if (page === "welcome") initCarousel();
    mobileMenu.classList.add("hidden");
  };

// Initialize Chess Game
function initChessGame() {
  const game = new Chess(); // from chess.js

const board = Chessboard("board", {
  draggable: true,
  position: "start",
  pieceTheme: "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",
  onDrop: (source, target) => {
    const move = game.move({ from: source, to: target, promotion: "q" });
    if (move === null) return "snapback";
    board.position(game.fen());
    setTimeout(makeComputerMove, 300);
  }
});

  function handleMove(source, target) {
    // Try to make player move
    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (move === null) return "snapback"; // illegal move

    // Update board after player's move
    board.position(game.fen());

    // Delay computer move a bit for realism
    setTimeout(makeComputerMove, 500);
  }

  function makeComputerMove() {
    if (game.game_over()) {
      alert("Game over!");
      return;
    }

    const moves = game.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
    board.position(game.fen());
  }
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
