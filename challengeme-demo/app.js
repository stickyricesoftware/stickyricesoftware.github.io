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
<h1 class="text-3xl font-bold mb-4">Welcome to Your Demo Chess App by Sunny</h1>



<div class="max-w-4xl mx-auto overflow-hidden">

  <div id="carousel" class="flex transition-transform duration-700 ease-in-out">
    <img src="https://images.pexels.com/photos/6115019/pexels-photo-6115019.jpeg"
         alt="Image 1"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

    <img src="https://images.pexels.com/photos/277124/pexels-photo-277124.jpeg"
         alt="Image 2"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

    <img src="https://images.pexels.com/photos/8438871/pexels-photo-8438871.jpeg"
         alt="Image 3"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

    <img src="https://images.pexels.com/photos/459275/pexels-photo-459275.jpeg"
         alt="Image 4"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

             <img src="https://images.pexels.com/photos/5234272/pexels-photo-5234272.jpeg"
         alt="Image 4"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

           <div id="carousel" class="flex transition-transform duration-700 ease-in-out">
    <img src="https://images.pexels.com/photos/6115019/pexels-photo-6115019.jpeg"
         alt="Image 1"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

    <img src="https://images.pexels.com/photos/277124/pexels-photo-277124.jpeg"
         alt="Image 2"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

    <img src="https://images.pexels.com/photos/8438871/pexels-photo-8438871.jpeg"
         alt="Image 3"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

    <img src="https://images.pexels.com/photos/459275/pexels-photo-459275.jpeg"
         alt="Image 4"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">

             <img src="https://images.pexels.com/photos/5234272/pexels-photo-5234272.jpeg"
         alt="Image 4"
         class="w-1/3 flex-shrink-0 p-2 rounded-lg object-cover">
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
      <br>
      <p class="text-lg">This is in no way a production ready app - this is purely a demo with almost zero functionality in the real world. </p>
      <br>
      <p class="text-lg">Saying that, you can go ahead and play Chess against the computer. </p>
<br>

      
      
      <p class="text-lg">Got any questions? Just reach out to me directly</p>


    
      `,
play: `
  <h1 class="text-3xl font-bold mb-4">Play Chess ♟️</h1>
  <div id="board" class="max-w-md mx-auto"></div>

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
  const boardContainer = document.getElementById("board");

  let board;

  // Function to create/update the board
  function createBoard() {
    // Make board square and fit container
    const containerWidth = boardContainer.offsetWidth;
    const boardSize = containerWidth; // board will always be square

    // Destroy old board if it exists
    if (board) board.destroy();

    board = Chessboard("board", {
      draggable: true,
      position: "start",
      pieceTheme: "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",
      width: boardSize,
      onDrop: (source, target) => {
        const move = game.move({ from: source, to: target, promotion: "q" });
        if (move === null) return "snapback";
        board.position(game.fen());
        setTimeout(makeComputerMove, 300);
      }
    });
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

  // Initial board
  createBoard();

  // Update board on window resize (debounced for performance)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createBoard, 100);
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
