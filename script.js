function connect() {
    var searchTerm = document.getElementById("searchBox").value.trim();
    document.getElementById("searchBox").value = "";
    document.getElementById("suggestionBox").style.display = "none";
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
  
    fetch(url)
        .then((res) => res.json())
        .then((data) => display(data));
  }
  
  function display(data) {
    const allMeals = data.meals;
    const displayArea = document.getElementById("displayArea");
    const showAllBtn = document.getElementById("showAllBtn");
  
    displayArea.innerHTML = "";
    showAllBtn.classList.add("d-none");
  
    if (!allMeals) {
        displayArea.innerHTML = "<p>No meals found!</p>";
        return;
    }
  
    allMeals.slice(0, 5).forEach((meal) => createMealCard(meal, displayArea));
  
    if (allMeals.length > 5) {
        showAllBtn.classList.remove("d-none");
        showAllBtn.onclick = () => {
            allMeals.slice(5).forEach((meal) => createMealCard(meal, displayArea));
            showAllBtn.classList.add("d-none");
        };
    }
  }
  
  function createMealCard(meal, parent) {
    const card = document.createElement("div");
    card.className = "meal-card";
  
    const instructions = meal.strInstructions || "No instructions available.";
    const shortInstructions = instructions.slice(0, 100);
    const isLong = instructions.length > 100;
  
    card.innerHTML = `
        <div class="meal-card-inner">
            <div class="meal-card-front">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h5>${meal.strMeal}</h5>
                <p>ID: ${meal.idMeal}</p>
            </div>
            <div class="meal-card-back">
                <h4>${meal.strMeal}</h4>
                <p class="instructions">${shortInstructions}${isLong ? '...' : ''}</p>
                ${isLong ? `<button class="btn btn-link see-more-btn">See More</button>` : ''}
            </div>
        </div>
    `;
  
    if (isLong) {
      const seeMoreBtn = card.querySelector('.see-more-btn');
      const instructionsEl = card.querySelector('.instructions');
  
      seeMoreBtn.addEventListener('click', () => {
        const isExpanded = instructionsEl.textContent.length > 100;
        instructionsEl.textContent = isExpanded ? `${shortInstructions}...` : instructions;
        seeMoreBtn.textContent = isExpanded ? 'See More' : 'See Less';
      });
    }
  
    parent.appendChild(card);
  }
  
  function showSuggestions() {
    const input = document.getElementById("searchBox").value.toLowerCase();
    const suggestionBox = document.getElementById("suggestionBox");
  
    if (input.length < 1) {
        suggestionBox.style.display = "none";
        return;
    }
  
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`;
  
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.meals) {
                const suggestions = data.meals
                    .map((meal) => meal.strMeal.toLowerCase())
                    .filter((name) => name.includes(input))
                    .slice(0, 4);
  
                suggestionBox.innerHTML = suggestions
                    .map((item) => `<li onclick="selectSuggestion('${item}')">${item}</li>`)
                    .join("");
  
                suggestionBox.style.display = suggestions.length ? "block" : "none";
            } else {
                suggestionBox.style.display = "none";
            }
        });
  }
  
  function selectSuggestion(value) {
    document.getElementById("searchBox").value = value;
    document.getElementById("suggestionBox").style.display = "none";
  }
  