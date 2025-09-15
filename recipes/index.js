document.addEventListener("DOMContentLoaded", () => {
  const recipesBody = document.getElementById("recipes-body");

  // Example recipe objects (you can add as many as you like)
  const recipes = [
    {
      title: "Chicken saag",
      photo:
        "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_saag_00975_16x9.jpg",
      ingredients: [
        "2.5 tbsp sunflower or vegetable oil",
        "2 large onion, finely chopped",
        "40g piece fresh root ginger, peeled and finely chopped",
        "5 garlic cloves, finely chopped",
        "3 heaped tsp medium curry powder",
        "Half tsp dried chilli flakes",
        "400g young spinach leaves",
        "1 tsp fine sea salt",
        "4-5 boneless, skinless chicken breasts (around 800g), cut into roughly 2.5cm/1in chunks",
        "5tsp fresh lemon juice",
        "Salt and freshly ground black pepper",
      ],
      method: `
        Heat 1.5 tablespoon of the oil in large non-stick saucepan over a medium heat. Add the onion, ginger and garlic, cover with a lid and fry for 8–10 minutes or until softened, stirring occasionally.<br><br>
        Remove the lid, increase the heat a little and cook for 2–3 minutes more, or until the onions are lightly browned. Stir in the curry powder and chilli flakes (if using) and fry for 1 minute, stirring constantly.<br><br>
        Add the spinach, a handful at a time, and sprinkle with the salt. Pour over 225ml cold water and cook for 5 minutes, stirring regularly. Remove from the heat and blitz with a blender until almost smooth. Set aside.<br><br>
        Heat the remaining tablespoon of oil in a large non-stick frying pan. Season the chicken with a little salt and freshly ground black pepper and fry for 5–6 minutes over a medium-high heat, turning regularly until lightly browned in places.<br><br>
        Pour the spinach sauce into the pan and bring to a simmer. Cook for 3–4 minutes, or until the chicken is cooked through, adding an extra splash of water if needed.<br><br>
        Season with a little lemon juice and extra salt and pepper, to taste. Serve.
      `,
    },
    {
      title: "Vegetable curry",
      photo:
        "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/vegetablecurry_80763_16x9.jpg",
      ingredients: [
        "3 medium potatoes (around 350g/12oz), peeled and cut into 2cm/¾in chunks",
        "1.5 large carrot, peeled and sliced diagonally",
        "½ cauliflower (around 400g), cut into small florets and halved",
        "4 tbsp sunflower or vegetable oil",
        "2 large onion, coarsely grated or very finely chopped",
        "2 tbsp medium or hot curry powder",
        "1.5 tin chopped tomatoes",
        "400ml oz vegetable or chicken stock (made with ½ cube), gluten-free if required",
        "150g frozen peas or two large handfuls young spinach leaves, or a mixture",
      ],
      method: `
        Half-fill a saucepan with cold water and add the potatoes and carrots. Bring to the boil and cook for 8 minutes. Add the cauliflower florets and cook for 2 minutes more. Drain in a colander and set aside.<br><br>
        Heat the oil in a large, non-stick frying pan or wide-based saucepan. Add the onion and cook over a medium heat for 8 minutes or until well softened and lightly browned, stirring regularly. Sprinkle over the curry powder and cook for 30 seconds more, stirring.<br><br>
        Add the tomatoes to the onions and cook for 2–3 minutes, stirring constantly. Add the stock and bring to a gentle simmer. Add the vegetables and peas or spinach and simmer gently for 5 minutes, stirring regularly. If the sauce thickens too much, add a splash of water.<br><br>
      `,
    },
    {
      title: "Spiced Meatball Curry",
      photo: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/meatball_curry_51206_16x9.jpg", // replace with a real image if you have one
      ingredients: [
        "600g lean beef mince",
        "2 tsp crushed garlic",
        "2 large onion, finely chopped",
        "1 tsp black pepper, coarsely ground",
        "2 tsp garam masala",
        "2 free-range egg",
        "2 tsp oil",
        "2 tsp cumin seeds",
        "2 tsp finely chopped root ginger",
        "2 cans chopped tomatoes",
        "2 tsp tomato purée",
        "1 tsp ground turmeric",
        "90–120ml/2–3fl oz water (optional)",
  
      ],
      method: `
    Mix the beef mince, garlic, half of the onion, pepper, garam masala and egg together in a bowl. Using your hands, shape the meat mixture into 30 balls.<br><br>
    Preheat the grill to hot. Line the bottom of a grill tray with aluminium foil and place the meatballs on the grill tray. (This will allow the fat to drain off into the lined tray, saving on washing up.) Grill the meatballs under a medium heat for 10–15 minutes, turning occasionally, or until nicely browned.<br><br>
    Heat the oil in a frying pan, and add the cumin seeds and the remaining onion. Cook for 4–5 minutes, or until softened, then stir in the ginger.<br><br>
    Add the chopped tomatoes, tomato purée and turmeric and cook for 10 minutes or until the sauce has thickened.<br><br>
    Add the cooked meatballs, reduce the heat and simmer for 20 minutes. Add 60–90ml/2–3fl oz water if the curry is a bit dry.
  `,
    },
    {
      title: "Massaman Chicken",
      photo: "https://blueelephant.com/wp-content/uploads/2024/09/massaman_chicken.webp", // replace with a real image if you have one
      ingredients: [
        "Massaman curry paste 70g",
        "Chicken 800g",
        "Salt 1/2 Tsp",
        "Sugar 3 Tbsp",
        "2 chopped Onions",
        "2 chopped Potatoes",
        "2 chopped Carrots",
        "Coconut milk 800ml",
        "Oil 3 Tbsp",
        "Peanuts 80g",
        "Water 400ml",
  
      ],
      method: `
    Heat vegetable oil in a saucepan and stir-fry the Massaman curry paste until aroma develops. Add in half of the coconut cream until some oil separates on top of the surface.<br><br>
    Add the remaining coconut cream and 400ml of water, stir and bring to a boil.<br><br>
    Add the chicken, the <strong>parboiled</strong> potatoes, carrots, onions and let it simmer until cooked though (15-20min)<br><br>
    Season with sugar and salt.<br><br>
    Add the crushed peanuts before turning off the heat
  `,
    },

{
  title: "Quick Chicken & Veggie Stir-Fry", 
  photo: "https://www.inspiredtaste.net/wp-content/uploads/2017/09/Vegetable-Chicken-Stir-Fry-Recipe-2-1200.jpg",

  ingredients: [
    "Chicken breast 400g (sliced thinly)",
    "Garlic 3 cloves (minced)",
    "Ginger 1 Tbsp (grated)",
    "Onion 1 medium (sliced)",
    "Broccoli 150g (cut into small florets)",
    "Long beans 150g (cut into 5cm pieces)",
    "Bok choy 200g (roughly chopped)",
    "Soy sauce 3 Tbsp",
    "Oyster sauce 2 Tbsp",
    "Sesame oil 1 Tbsp",
    "Vegetable oil 2 Tbsp",
    "Optional: Sesame seeds for garnish",
  ],
  method: `
    Heat vegetable oil in a large wok or frying pan over medium-high heat.<br><br>

    Add the garlic and ginger, stir-fry for 30 seconds until fragrant.<br><br>

    Add the chicken slices and stir-fry for 4–5 minutes until the meat is no longer pink.<br><br>

    Toss in the onions, broccoli, and long beans. Stir-fry for 3–4 minutes until they begin to soften but stay crisp.<br><br>

    Add the bok choy, soy sauce, oyster sauce, and sesame oil. Stir well and cook for another 2–3 minutes until vegetables are just tender and chicken is cooked through.<br><br>

    Remove from heat and garnish with sesame seeds if desired. Serve hot with steamed rice or noodles.
  `,
}


  ];

  function createRecipeAccordion(recipe) {
    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");

    const header = document.createElement("button");
    header.classList.add("accordion-header");
    header.textContent = recipe.title;

    const content = document.createElement("div");
    content.classList.add("accordion-content");

    const photo = document.createElement("img");
    photo.src = recipe.photo;
    photo.alt = recipe.title;
    photo.classList.add("recipe-photo");

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingredients";

    const ul = document.createElement("ul");
    recipe.ingredients.forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = ing;
      ul.appendChild(li);
    });

    const methodTitle = document.createElement("h3");
    methodTitle.textContent = "Method";

    const methodText = document.createElement("p");
    methodText.innerHTML = recipe.method;

    content.appendChild(photo);
    content.appendChild(ingredientsTitle);
    content.appendChild(ul);
    content.appendChild(methodTitle);
    content.appendChild(methodText);

    header.addEventListener("click", () => {
      const allContents = document.querySelectorAll(".accordion-content");
      allContents.forEach((c) => {
        if (c !== content) {
          c.classList.remove("open");
        }
      });
      content.classList.toggle("open");
    });

    accordionItem.appendChild(header);
    accordionItem.appendChild(content);

    return accordionItem;
  }

  // Loop through all recipes and append them
  recipes.forEach((recipe) => {
    recipesBody.appendChild(createRecipeAccordion(recipe));
  });
});
