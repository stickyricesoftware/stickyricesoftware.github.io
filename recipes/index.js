document.addEventListener("DOMContentLoaded", () => {
  const recipesBody = document.getElementById("recipes-body");

  // Example recipe objects (you can add as many as you like)
  const recipes = [

//         {
//       title: "Lamb saag",
//       photo:
//         "https://cdn.shopify.com/s/files/1/2554/4616/files/Orange_Keema_Saag_-_Saute_minced_beef_with_onions_garlic_ginger_4146fc4c-8f1f-4d8e-be84-9e21291580f5_480x480.png",
// ingredients: [
//   "Lamb mince",
//   "1 large onion, finely chopped",
//   "3 garlic cloves, minced",
//   "1 inch piece fresh ginger, grated",
//   "1 cup finely chopped fresh spinach",
//   "1 can diced tomatoes (400g)",
//   "2 tbsp vegetable oil",
//   "2 tsp ground cumin",
//   "2 tsp ground coriander",
//   "1 tsp turmeric",
//   "1 tsp garam masala",
//   "Salt, to taste",
//   "Chilli powder, to taste (optional)",
//   "1 tbsp fresh lemon juice",
//   "Yogurt and fresh coriander, for garnish",
// ],
// method: `
//   Heat the oil in a large saucepan over a medium heat. Add the chopped onions and sauté for 6–8 minutes, or until softened and golden.<br><br>
//   Stir in the minced garlic and grated ginger and cook for 1 minute, until the raw aroma disappears.<br><br>
//   Add the ground cumin, coriander, turmeric and garam masala. Fry for 1 minute, stirring constantly, to release the flavours.<br><br>
//   Add the minced lamb and cook for 5–7 minutes, breaking up any large clumps as it browns.<br><br>
//   Stir in the diced tomatoes, mix well, then reduce the heat to low. Cover and simmer for 15 minutes, stirring occasionally.<br><br>
//   Add the chopped spinach and continue cooking for 10–15 minutes, or until the spinach wilts and blends into the meat mixture.<br><br>
//   Season with salt and optional chilli powder to taste.<br><br>
//   Remove from the heat and stir in the fresh lemon juice. Serve hot, garnished with a spoonful of yogurt and fresh coriander.
// `,
//     },
//         {
//       title: "Spinach dal with tinned mackerel",
//       photo:
//         "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/spinach_dal_with_tinned_86503_16x9.jpg",
//       ingredients: [
// "1/2 tbsp ghee",
// "1 tsp cumin powder",
// "1 tsp coriander powder",
// "2 tsbp curry powder",
// "1 onion, finely diced",
// "2 garlic cloves, crushed",
// "2 red chillies, halved lengthwise",
// "thumb sized piece of ginger, peeled and grated",
// "250g red lentils",
// "1/2 tsp ground turmeric",
// "450ml vegetable stock",
// "100g spinach",
// "2 x 125g tins of mackerel",
// "15g/½oz coriander leaves, roughly chopped",
// "1 plum tomato, seeds removed and flesh diced",
// "1 lemon, juice only",
// "salt and white pepper",
//       ],
//       method: `
//         Add the ghee to a saucepan over a medium heat, then tip in the cumin, coriander and black mustard seeds and curry leaves. Leave to cook until they start to sizzle and become fragrant, then tip in the onions, garlic, chillies and ginger. Season with salt and white pepper.<br><br>
//         Cook until the onion is softened but not coloured. Add the lentils into the pan with the ground turmeric and pour over the vegetable stock. Bring to a simmer and leave to cook until the lentils are soft and tender, around 20 minutes.<br><br>
//         When the lentils are cooked and saucy, add in the spinach to wilt into the dhal. Open up the tins of mackerel and scoop out the fillets, then stir some of the tomato sauce into the dal.<br><br>
//         After the spinach has wilted, stir through the coriander, plum tomato and lemon juice. Taste for seasoning and serve in bowls, topping with the tinned mackerel.<br><br>
//       `,
//     },
//             {
//       title: "Marmite Chicken",
//       photo:
//         "https://cdn1.npcdn.net/images/15293817773f3df65614ec8dfa2a1fd3a1de3d9cec.webp?md5id=ba29c0a9d05316b187201c304b20120d&new_width=1000&new_height=1000&size=max&w=1751538575&from=jpg",
// ingredients: [
//   "600g chicken or other meat, chopped into bite-sized pieces",
//   "1 egg",
//   "1/2 tbsp sesame oil",
//   "Pinch of salt",
//   "Pinch of white pepper",
//   "2 tbsp plain flour",
//   "2 tbsp corn starch",
//   "Oil, for deep frying",
//   "2–3 garlic cloves, peeled",
//   "Masfood Marmite Paste",
// ],
// method: `
//   Prepare and clean 1kg of chicken (or other meat) that has been chopped into bite-sized pieces.<br><br>
//   Marinate the meat for 30 minutes with 1 egg, ½ tbsp seed oil, a pinch of salt, a little white pepper, 2 tbsp flour, and 2 tbsp corn starch.<br><br>
//   Heat oil in a deep pan and deep-fry the marinated meat until golden and cooked through. Remove and drain on paper towels.<br><br>
//   Leave about 1 tbsp of the used frying oil in the pan. Add peeled garlic and fry until it begins to turn medium brown.<br><br>
//   Stir in the Masfood Marmite Paste, then add the fried chicken back into the pan. Toss everything together until the meat is evenly coated.<br><br>
//   Serve hot, optionally topped with a sprinkle of fried sesame for extra flavour.
// `,
//     },
  //   {
  //     title: "Vegetable curry",
  //     photo:
  //       "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/vegetablecurry_80763_16x9.jpg",
  //     ingredients: [
  //       "3 medium potatoes (around 350g/12oz), peeled and cut into 2cm/¾in chunks",
  //       "1.5 large carrot, peeled and sliced diagonally",
  //       "½ cauliflower (around 400g), cut into small florets and halved",
  //       "4 tbsp sunflower or vegetable oil",
  //       "2 large onion, coarsely grated or very finely chopped",
  //       "2 tbsp medium or hot curry powder",
  //       "1.5 tin chopped tomatoes",
  //       "400ml oz vegetable or chicken stock (made with ½ cube), gluten-free if required",
  //       "150g frozen peas or two large handfuls young spinach leaves, or a mixture",
  //     ],
  //     method: `
  //       Half-fill a saucepan with cold water and add the potatoes and carrots. Bring to the boil and cook for 8 minutes. Add the cauliflower florets and cook for 2 minutes more. Drain in a colander and set aside.<br><br>
  //       Heat the oil in a large, non-stick frying pan or wide-based saucepan. Add the onion and cook over a medium heat for 8 minutes or until well softened and lightly browned, stirring regularly. Sprinkle over the curry powder and cook for 30 seconds more, stirring.<br><br>
  //       Add the tomatoes to the onions and cook for 2–3 minutes, stirring constantly. Add the stock and bring to a gentle simmer. Add the vegetables and peas or spinach and simmer gently for 5 minutes, stirring regularly. If the sauce thickens too much, add a splash of water.<br><br>
  //     `,
  //   },
  //   {
  //     title: "Spiced Meatball Curry",
  //     photo: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/meatball_curry_51206_16x9.jpg", // replace with a real image if you have one
  //     ingredients: [
  //       "600g lean beef mince",
  //       "2 tsp crushed garlic",
  //       "2 large onion, finely chopped",
  //       "1 tsp black pepper, coarsely ground",
  //       "2 tsp garam masala",
  //       "2 free-range egg",
  //       "2 tsp oil",
  //       "2 tsp cumin seeds",
  //       "2 tsp finely chopped root ginger",
  //       "2 cans chopped tomatoes",
  //       "2 tsp tomato purée",
  //       "1 tsp ground turmeric",
  //       "90–120ml/2–3fl oz water (optional)",
  
  //     ],
  //     method: `
  //   Mix the beef mince, garlic, half of the onion, pepper, garam masala and egg together in a bowl. Using your hands, shape the meat mixture into 30 balls.<br><br>
  //   Preheat the grill to hot. Line the bottom of a grill tray with aluminium foil and place the meatballs on the grill tray. (This will allow the fat to drain off into the lined tray, saving on washing up.) Grill the meatballs under a medium heat for 10–15 minutes, turning occasionally, or until nicely browned.<br><br>
  //   Heat the oil in a frying pan, and add the cumin seeds and the remaining onion. Cook for 4–5 minutes, or until softened, then stir in the ginger.<br><br>
  //   Add the chopped tomatoes, tomato purée and turmeric and cook for 10 minutes or until the sauce has thickened.<br><br>
  //   Add the cooked meatballs, reduce the heat and simmer for 20 minutes. Add 60–90ml/2–3fl oz water if the curry is a bit dry.
  // `,
  //   },
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


// {
//   title: "Quick Chicken & Veggie Stir-Fry", 
//   photo: "https://www.inspiredtaste.net/wp-content/uploads/2017/09/Vegetable-Chicken-Stir-Fry-Recipe-2-1200.jpg",

//   ingredients: [
//     "Chicken breast 400g (sliced thinly)",
//     "Garlic 3 cloves (minced)",
//     "Ginger 1 Tbsp (grated)",
//     "Onion 1 medium (sliced)",
//     "Broccoli 150g (cut into small florets)",
//     "Long beans 150g (cut into 5cm pieces)",
//     "Bok choy 200g (roughly chopped)",
//     "Soy sauce 3 Tbsp",
//     "Oyster sauce 2 Tbsp",
//     "Sesame oil 1 Tbsp",
//     "Vegetable oil 2 Tbsp",
//     "Optional: Sesame seeds for garnish",
//   ],
//   method: `
//     Heat vegetable oil in a large wok or frying pan over medium-high heat.<br><br>

//     Add the garlic and ginger, stir-fry for 30 seconds until fragrant.<br><br>

//     Add the chicken slices and stir-fry for 4–5 minutes until the meat is no longer pink.<br><br>

//     Toss in the onions, broccoli, and long beans. Stir-fry for 3–4 minutes until they begin to soften but stay crisp.<br><br>

//     Add the bok choy, soy sauce, oyster sauce, and sesame oil. Stir well and cook for another 2–3 minutes until vegetables are just tender and chicken is cooked through.<br><br>

//     Remove from heat and garnish with sesame seeds if desired. Serve hot with steamed rice or noodles.
//   `,
// }
      {
      title: "Ground Beef Stroganoff Recipe",
      photo: "https://natashaskitchen.com/wp-content/uploads/2020/01/Ground-Beef-Stroganoff-3-728x1092.jpg", // replace with a real image if you have one
      ingredients: [
        "Ground beef 300g",
        "2 Tbsp olive oil",
        "2 Tbsp butter",
        "200g onions sliced",
        "2 peppers sliced (green and yellow)",
        "1 pack of mushrooms sliced",
        "2 Tbsp chopped garlic",
            "1 Tbsp smnoked Paprika",
          "1 Tbsp Mustard",
          "200ml Chicken stock (from cube)",
          "250g Sour cream",
      
          "Salt and pepper to taste",
  
  
      ],
      method: `
    Heat 1 tbsp olive oil in a non-stick frying pan then add sliced onions and cook on a medium heat until completely softened, around 15 mins, adding a little splash of water if it starts to stick.<br><br>
    Crush in 2 Tbsp chopped garlic and cook for 2-3 mins more, then add butter.<br><br>
    Once the butter is foaming a little, add sliced mushrooms and peppers and cook for around 5 mins until completely softened.<br><br>
    Season everything well, then take everything out and put into a bowl.<br><br>
    Add ground pork, salt and pepper, and smoked paprika to the pan and cook until browned.<br><br>

    Add vegetables back to the pan and stir to combine.<br><br>
    Take off the heat and add mustard, chicken stock, and sour cream and stir.<br><br>
  `,
    },
        {
      title: "Pork Saag",
      photo:
        "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_saag_00975_16x9.jpg",
      ingredients: [
        "2.5 tbsp sunflower or vegetable oil",
        "1 large onion, finely chopped",
        "39g piece fresh root ginger, peeled and finely chopped",
        "3 garlic cloves, finely chopped",
        "2 heaped tsp medium curry powder",
        "Half tsp dried chilli flakes",
        "300g young spinach leaves",
         "200g FROZEN PEAS",
        "1 tsp fine sea salt",
        "600g Pork mince",
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
