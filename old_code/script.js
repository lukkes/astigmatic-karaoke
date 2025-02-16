// Global variables
let currentLineIndex = -1; // Start above the first line
let lines = [];
let correctCount = 0;      // Count of correctly marked lines
let spaceHeld = false;     // True if the space bar is held
let navDirection = 0;      // 1 for S (down), -1 for W (up)

// Process the input lyrics, apply blur based on difficulty, and switch phases.
function startBlurring(difficulty) {
  let inputText = document.getElementById("inputLyrics").value;
  if (inputText.trim() === "") {
    alert("Please enter lyrics before blurring.");
    return;
  }

  // Determine blur percentage based on difficulty.
  let blurPercent;
  if (difficulty === "easy") {
    // Random integer between 20 and 40.
    blurPercent = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
  } else if (difficulty === "medium") {
    blurPercent = Math.floor(Math.random() * (60 - 40 + 1)) + 40;
  } else if (difficulty === "hard") {
    blurPercent = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
  } else if (difficulty === "blind") {
    blurPercent = 100;
  }

  correctCount = 0;
  lines = inputText.split("\n");
  let processedLines = lines.map(line => {
    // Split the line while preserving spaces.
    let words = line.split(/(\s+)/);
    // Collect indices of non-space tokens.
    let nonSpaceIndices = [];
    for (let i = 0; i < words.length; i++) {
      if (words[i].trim() !== "") {
        nonSpaceIndices.push(i);
      }
    }
    let totalWords = nonSpaceIndices.length;
    // Calculate how many words to blur.
    let numBlurred = Math.floor(totalWords * (blurPercent / 100));
    // Shuffle the indices array.
    let shuffledIndices = nonSpaceIndices.sort(() => Math.random() - 0.5);
    // Choose the first numBlurred indices.
    let indicesToBlur = shuffledIndices.slice(0, numBlurred);
    // Wrap the chosen words in the blurred span.
    indicesToBlur.forEach(index => {
      words[index] = `<span class="blurred">${words[index]}</span>`;
    });
    return `<span class="line">${words.join("")}</span>`;
  });
  document.getElementById("lyrics").innerHTML = processedLines.join("<br>");
  currentLineIndex = -1;
  updateHighlightPosition();
  // Switch to the Blurred Phase.
  document.getElementById("input-phase").classList.add("hidden");
  document.getElementById("blurred-phase").classList.remove("hidden");
  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("keyup", handleKeyUp);
}

// Return to the input phase.
function goBack() {
  document.getElementById("input-phase").classList.remove("hidden");
  document.getElementById("blurred-phase").classList.add("hidden");
  document.removeEventListener("keydown", handleKeyPress);
  document.removeEventListener("keyup", handleKeyUp);
}

// Handle keydown events.
function handleKeyPress(event) {
  // Prevent auto-repeat for space, s, and w.
  if ((event.key === " " || event.key === "s" || event.key === "w") && event.repeat) {
    event.preventDefault();
    return;
  }

  if (event.key === "s") {
    event.preventDefault();
    if (navDirection === 0) {
      navDirection = 1;
      unblurCurrentLine();
    }
  } else if (event.key === "w") {
    event.preventDefault();
    if (navDirection === 0) {
      navDirection = -1;
      unblurCurrentLine();
    }
  } else if (event.key === " ") {
    event.preventDefault();
    if (!spaceHeld) {
      spaceHeld = true;
      unblurCurrentLine();
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    let lineElements = [...document.querySelectorAll(".line")].filter(line => line.innerText);
    if (currentLineIndex >= 0 && currentLineIndex < lineElements.length) {
      let currentLine = lineElements[currentLineIndex];
      // Process Enter only if the current line is fully unblurred.
      if (!currentLine.querySelector('.blurred')) {
        markCurrentLineCorrect();
        moveHighlight(1);
        // Reset spaceHeld so that keyup doesn't move an extra line.
        if (spaceHeld) {
          spaceHeld = false;
        }
      }
    }
  }
}

// Handle keyup events.
function handleKeyUp(event) {
  if (event.key === " ") {
    if (spaceHeld) {
      moveHighlight(1);
      spaceHeld = false;
    }
  } else if (event.key === "s") {
    if (navDirection === 1) {
      moveHighlight(1);
      navDirection = 0;
    }
  } else if (event.key === "w") {
    if (navDirection === -1) {
      moveHighlight(-1);
      navDirection = 0;
    }
  }
}

// Moves the highlight up or down.
function moveHighlight(direction) {
  let lineElements = [...document.querySelectorAll(".line")].filter(line => line.innerText);
  if (currentLineIndex + direction >= -1 && currentLineIndex + direction < lineElements.length) {
    currentLineIndex += direction;
    updateHighlightPosition();
  }
}

// Unblurs the words in the currently highlighted line.
function unblurCurrentLine() {
  let lineElements = [...document.querySelectorAll(".line")].filter(line => line.innerText);
  if (currentLineIndex >= 0 && currentLineIndex < lineElements.length) {
    lineElements[currentLineIndex].querySelectorAll(".blurred").forEach(word => {
      word.classList.remove("blurred");
      word.classList.add("unblurred");
    });
  }
}

// Updates the position of the highlight bar.
function updateHighlightPosition() {
  let lineElements = [...document.querySelectorAll(".line")].filter(line => line.innerText);
  let lyricsContainer = document.getElementById("lyrics-container");
  let highlight = document.getElementById("highlight");
  if (currentLineIndex === -1) {
    highlight.style.transform = `translateY(-1.5em)`;
    lyricsContainer.scrollTop = 0;
  } else if (lineElements.length > 0) {
    let targetLine = lineElements[currentLineIndex];
    let offset = targetLine.offsetTop - lyricsContainer.offsetTop;
    highlight.style.transform = `translateY(${offset}px)`;
    window.scrollTo({
      top: targetLine.offsetTop - 200,
      left: 0,
      behavior: "smooth",
    });
  }
}

// Toggles the current line's "correct" state and updates the overall percentage.
function markCurrentLineCorrect() {
  let lineElements = [...document.querySelectorAll(".line")].filter(line => line.innerText);
  if (currentLineIndex >= 0 && currentLineIndex < lineElements.length) {
    let currentLine = lineElements[currentLineIndex];
    // Only toggle if the line is fully unblurred.
    if (currentLine.querySelector('.blurred')) {
      return;
    }
    if (currentLine.classList.contains("correct")) {
      currentLine.classList.remove("correct");
      let indicator = currentLine.querySelector(".correct-indicator");
      if (indicator) {
        indicator.remove();
      }
      correctCount--;
    } else {
      currentLine.classList.add("correct");
      correctCount++;
      let totalLines = lineElements.length;
      let percentage = Math.round((correctCount / totalLines) * 100);
      let indicatorSpan = document.createElement("span");
      indicatorSpan.classList.add("correct-indicator");
      indicatorSpan.innerHTML = `<strong>${percentage}%</strong>`;
      currentLine.appendChild(indicatorSpan);
    }
  }
}

function startSong() {
  const lyricsContainer = document.getElementById("lyrics-container");

  if (lyricsContainer.classList.contains("blurred")) {
    lyricsContainer.classList.remove("blurred");
  }
}

function resetBlurredPhase() {
  currentLineIndex = -1;
  correctCount = 0;
  document.querySelectorAll(".line").forEach(line => {
    line.classList.remove("correct");
    let indicator = line.querySelector(".correct-indicator");
    if (indicator) {
      indicator.remove();
    }
    line.querySelectorAll(".unblurred").forEach(word => {
      word.classList.remove("unblurred");
      word.classList.add("blurred");
    });
  });
  updateHighlightPosition();
  window.scrollTo({
    top: 0,
  });
}