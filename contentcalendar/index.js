const quotes = [
  "Louis, I think this is the beginning of a beautiful content idea. - Casablanca (1942)",
  "Show me the content! - Jerry Maguire (1996)",
  "You're gonna need a bigger content idea. - Jaws (1948)",
  "Keep your friends close, but your content ideas closer. - The God Father Part II (1974)",
  "Say 'hello' to my little content idea! - Scarface (1983)",
  "A content idea. Shaken, not stirred. - Goldfinger (1964)",
  "I feel the need—the need for content! - Top Gun (1986)",
  "Nobody puts Content in a corner. - Dirty Dancing (1987)",
  "A boy's best friend is his content calendar. - Psycho (1960)",
  "I'm going to make him a content idea he can't refuse. - The God Father (1972)",
  "Reach for the content calendar! - Toy Story (1995)",
  "All we have to decide is what to do with the content idea that is given to us. - The Fellowship of the Ring (2001)",
  "My mom always said life was like a box of Content Ideas. You never know what you're gonna get. - Forest Gump (1994)",
  "To Content Ideas and beyond! -Toy Story (1995)",
  "May the Content be with you. - Star Wars  (1977)",
"Houston, we have a content idea. - Apollo 13 (1995)",
"Doc, you don't just walk into a store and buy content ideas! - Back to the future (1985)",
"Eat my content. - The Breakfast Club (1985)",
"Bend... and create! - Legally Blonde (2001)",
"Keep the content, ya filthy animal. - Home Alone (1990)",
"This one time, at content creation camp... - American Pie (1999)",
"We get the content and we hold the world ransom for… one million dollars. - Austin Powers: International Man of Mystery (1997)",
"That's why her content is so big. It's full of secrets. - Mean Girls (2004)" 



];

const q = document.getElementById("quote");
const randomQuote = document.createElement("p");
randomQuote.innerText = quotes[Math.floor(Math.random() * quotes.length)];
q.appendChild(randomQuote);


const toolName = [
"Fetchea 💡", "Fetchi 🐕", "Trigidea 📆", "IDEAGO 💪", "Contendar 📆", 
]
const tn = document.getElementById("tool-name");

tn.innerText = toolName[Math.floor(Math.random() * toolName.length)];






const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const monthCalendar = [
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30, 31],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30, 31]
]
console.log(monthCalendar)
var optionsDayandMonth = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();

const dateDiv = document.getElementById("date");
const dateNow = document.createElement("p");
dateNow.innerText = today.toLocaleDateString("en-US", optionsDayandMonth)

dateDiv.appendChild(dateNow);

var optionsMonth = { month: 'long',};
var formattedMonth = today.toLocaleDateString("en-US", optionsMonth);

var optionsMonthNumberTest = { month: 'numeric',};
var monthNumberTest = today.toLocaleDateString("en-US", optionsMonthNumberTest); 
var monthNumber = (monthNumberTest-1)
document.getElementById("display-month").innerHTML = month[monthNumber]

var optionsDay = { day: 'numeric' };
var formattedDay = today.toLocaleDateString("en-US", optionsDay); 




const months =  document.getElementById("days-of-the-month")
function forwardMonth(){
  if (!monthCalendar[monthNumber+1]){
    alert("It's December - Merry Christmas")
    return
  }

  months.innerHTML = ""
  monthNumber++
  document.getElementById("display-month").innerHTML = month[monthNumber]
  monthCalendar[monthNumber].forEach(element => {
   
    const oneDay = document.createElement('div')

  oneDay.setAttribute('class', 'each-day')
  oneDay.innerHTML = element
  oneDay.onclick = function() { alert('One step at a time please.'); };
  months.append(oneDay)
  });
}
function backMonth(){
  if (!monthCalendar[monthNumber-1]){
    alert("It's January - Happy New Year")
    return
  }
  

  months.innerHTML = ""
  monthNumber--
  document.getElementById("display-month").innerHTML = month[monthNumber]
  monthCalendar[monthNumber].forEach(element => {
   
    const oneDay = document.createElement('div')

  oneDay.setAttribute('class', 'each-day')
  oneDay.innerHTML = element
  oneDay.onclick = function() { alert('One step at a time please.'); };
  months.append(oneDay)
  });
}
//TO DO - currentMonth needs to be defined

monthCalendar[monthNumber].forEach(element => {
  const oneDay = document.createElement('div')
oneDay.setAttribute('class', 'each-day')
oneDay.innerHTML = element
oneDay.onclick = function() { alert('One step at a time please.'); };
months.append(oneDay)
});

const events1 = [
  {
    id: 1001,
    calendarDate: "2023-04-01",
    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "Fun day",
    idea: [ 
      { 
        category: "edu",
        description: "Host a virtual dance party - Invite followers to join in a live, interactive dance party. Ask followers to submit their favorite dance playlist to get the party started and assign different followers to be the designated DJs for the event. "
      },
      { 
        category: "edu",
        description: "Create a virtual scavenger hunt - Ask followers to find objects in their homes that match the clues that you provide. They can then post pictures of their finds on social media with a special hashtag so that everyone can follow along with their progress.",

      },
      { 
        category: "ent",
        description:   "Create a “Fun Day-themed” challenge – Ask your audience to come up with their own “Fun Day-themed” challenge and post it with a hashtag. Ask your followers to get creative and come up with their own unique challenge for others to complete."
      },
      { 
        category: "ent",
        description:   "Host a virtual dance party – Invite your audience to join you for a virtual dance session. Play some fun music and provide instructions on how to dance along. This would be a great way to let go and have some fun while engaging with your followers."
      },
      { 
        category: "pro",
        description:   "Partner with a local charity or organization to host a Fun Day themed event. Ask your customers to donate to the organization and then come out and join the event to celebrate Fun Day. Offer special discounts to anyone who participates in the event. This is a great way to help out a worthy cause while also encouraging your customers to get out and have some Fun Day fun."
      },
            { 
        category: "pro",
        description:   "Create a ‘Create Your Own Fun’ campaign. Collaborate with influencers and customers to create curated videos and images that show off all the ways they celebrated Fun Day with your brand. Ask customers to share their own content, tagging your brand and using a special hashtag, and reward the most creative content with a special Fun Day prize."
      },     

    ]
  },
  {
    id: 1002,
    calendarDate: "2023-04-01",
    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "Reading Is Funny Day",
    idea: [ 
      { 
        category: "edu",
        description: "Host a virtual dance party - Invite followers to join in a live, interactive dance party. Ask followers to submit their favorite dance playlist to get the party started and assign different followers to be the designated DJs for the event. "
      },
      { 
        category: "edu",
        description: "Create a virtual scavenger hunt - Ask followers to find objects in their homes that match the clues that you provide. They can then post pictures of their finds on social media with a special hashtag so that everyone can follow along with their progress.",

      },
      { 
        category: "ent",
        description:   "Create a “Fun Day-themed” challenge – Ask your audience to come up with their own “Fun Day-themed” challenge and post it with a hashtag. Ask your followers to get creative and come up with their own unique challenge for others to complete."
      },
      { 
        category: "ent",
        description:   "Host a virtual dance party – Invite your audience to join you for a virtual dance session. Play some fun music and provide instructions on how to dance along. This would be a great way to let go and have some fun while engaging with your followers."
      },
      { 
        category: "pro",
        description:   "Partner with a local charity or organization to host a Fun Day themed event. Ask your customers to donate to the organization and then come out and join the event to celebrate Fun Day. Offer special discounts to anyone who participates in the event. This is a great way to help out a worthy cause while also encouraging your customers to get out and have some Fun Day fun."
      },
            { 
        category: "pro",
        description:   "Create a ‘Create Your Own Fun’ campaign. Collaborate with influencers and customers to create curated videos and images that show off all the ways they celebrated Fun Day with your brand. Ask customers to share their own content, tagging your brand and using a special hashtag, and reward the most creative content with a special Fun Day prize."
      },     

    ]
  },
  {
    id: 1002,
    calendarDate: "2023-04-01",
    day: formattedDay,
    month: formattedMonth,
    type: "w",
    name: "Reading Is Funny Week",
    idea: [ 
      { 
        category: "edu",
        description: "Host a virtual dance party - Invite followers to join in a live, interactive dance party. Ask followers to submit their favorite dance playlist to get the party started and assign different followers to be the designated DJs for the event. "
      },
      { 
        category: "edu",
        description: "Create a virtual scavenger hunt - Ask followers to find objects in their homes that match the clues that you provide. They can then post pictures of their finds on social media with a special hashtag so that everyone can follow along with their progress.",

      },
      { 
        category: "ent",
        description:   "Create a “Fun Day-themed” challenge – Ask your audience to come up with their own “Fun Day-themed” challenge and post it with a hashtag. Ask your followers to get creative and come up with their own unique challenge for others to complete."
      },
      { 
        category: "ent",
        description:   "Host a virtual dance party – Invite your audience to join you for a virtual dance session. Play some fun music and provide instructions on how to dance along. This would be a great way to let go and have some fun while engaging with your followers."
      },
      { 
        category: "pro",
        description:   "Partner with a local charity or organization to host a Fun Day themed event. Ask your customers to donate to the organization and then come out and join the event to celebrate Fun Day. Offer special discounts to anyone who participates in the event. This is a great way to help out a worthy cause while also encouraging your customers to get out and have some Fun Day fun."
      },
            { 
        category: "pro",
        description:   "Create a ‘Create Your Own Fun’ campaign. Collaborate with influencers and customers to create curated videos and images that show off all the ways they celebrated Fun Day with your brand. Ask customers to share their own content, tagging your brand and using a special hashtag, and reward the most creative content with a special Fun Day prize."
      },     

    ]
  },
  {
    id: 1002,
    calendarDate: "2023-04-01",
    day: formattedDay,
    month: formattedMonth,
    type: "m",
    name: "Reading Is Funny Month",
    idea: [ 
      { 
        category: "edu",
        description: "Host a virtual dance party - Invite followers to join in a live, interactive dance party. Ask followers to submit their favorite dance playlist to get the party started and assign different followers to be the designated DJs for the event. "
      },
      { 
        category: "edu",
        description: "Create a virtual scavenger hunt - Ask followers to find objects in their homes that match the clues that you provide. They can then post pictures of their finds on social media with a special hashtag so that everyone can follow along with their progress.",

      },
      { 
        category: "ent",
        description:   "Create a “Fun Day-themed” challenge – Ask your audience to come up with their own “Fun Day-themed” challenge and post it with a hashtag. Ask your followers to get creative and come up with their own unique challenge for others to complete."
      },
      { 
        category: "ent",
        description:   "Host a virtual dance party – Invite your audience to join you for a virtual dance session. Play some fun music and provide instructions on how to dance along. This would be a great way to let go and have some fun while engaging with your followers."
      },
      { 
        category: "pro",
        description:   "Partner with a local charity or organization to host a Fun Day themed event. Ask your customers to donate to the organization and then come out and join the event to celebrate Fun Day. Offer special discounts to anyone who participates in the event. This is a great way to help out a worthy cause while also encouraging your customers to get out and have some Fun Day fun."
      },
            { 
        category: "pro",
        description:   "Create a ‘Create Your Own Fun’ campaign. Collaborate with influencers and customers to create curated videos and images that show off all the ways they celebrated Fun Day with your brand. Ask customers to share their own content, tagging your brand and using a special hashtag, and reward the most creative content with a special Fun Day prize."
      },     

    ]
  },
]

const events = [
  {
    id: 1001,
    calendarDate: "2023-03-01",
    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "World Tapir Day",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1002,
    calendarDate: "2023-03-01",


    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "Tell A Story Day",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1003,
    calendarDate: "2023-03-01",



    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "Geologist Day",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1004,
    calendarDate: "2023-03-01",



    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "National Tea Day",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1005,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "m",
    name: "Stress Awareness Month",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1006,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "w",
    name: "National Stationery Week",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1007,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "m",
    name: "National Poetry Month",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1008,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "m",
    name: "National Jazz Appreciation Month",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1009,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "World Cat Day",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1010,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "d",
    name: "World Dog Day",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1012,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "m",
    name: "National Car Month",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
  {
    id: 1013,
    calendarDate: "2023-03-01",

    day: formattedDay,
    month: formattedMonth,
    type: "m",
    name: "National Bike Month",
    education:
      "Coming Soon",
    promo:
      "Coming Soon",
    entertainment:
      "Coming Soon",
  },
];
//days
events1.forEach((e) => {
  if (e.type === "d") {
    const days = document.getElementById("days");
    const card = document.createElement("div");
    card.innerText = e.name;
    card.setAttribute("id", e.id);
    card.className += "card";
    card.className += " day";
    days.appendChild(card);
  }
});
//weeks
events1.forEach((e) => {
  if (e.type === "w") {
    const weeksmonths = document.getElementById("weeks");
    const card = document.createElement("div");
    card.innerText = e.name;
    card.setAttribute("id", e.id);
    card.className += "card";
    card.className += " week";

    weeksmonths.appendChild(card);
  }
});
//months
events1.forEach((e) => {
  if (e.type === "m") {
    const weeksmonths = document.getElementById("months");
    const card = document.createElement("div");
    card.innerText = e.name;
    card.setAttribute("id", e.id);
    card.className += "card";
    card.className += " month";
    weeksmonths.appendChild(card);
  }
});

// Original
// document.querySelectorAll(".card").forEach(function (item) {

//     //item.style.backgroundImage="url(https://picsum.photos/200/300)"; // specify the image path here
//   item.addEventListener("click", function () {    
//     events.forEach((e) => {
//       if (item.innerHTML === e.name) {
//         const eventInfo = document.getElementById("event-info");
//         const eventDescription = document.getElementById("event-description");
//         const eventTitle = document.getElementById("event-title");
//         const eventIdeas = document.getElementById("event-ideas");
//         const ideaOption = document.getElementById("idea-option");
//         const testButton = document.getElementById("test-button");

//         testButton.setAttribute('name', e.name)
//         testButton.setAttribute('startDate', e.calendarDate )
//         testButton.setAttribute('description', "Visit CCC for a great content creation idea - Don't forget to tag us in your post and use the hashtag #madewithCCC to be in with a chance of being featured on our page!!"  )
//         testButton.setAttribute('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)

        


//         eventInfo.innerHTML = "";
//         eventDescription.innerHTML = "";
//         eventTitle.innerHTML = "";
//         eventIdeas.innerHTML = "";
//         ideaOption.innerHTML = "";

//         const promoButton = document.createElement("button");
//         // promoButton.setAttribute("class", "material-icons");
//         const eduButton = document.createElement("button");
//         // eduButton.setAttribute("class", "material-icons");
//         const entertainmentButton = document.createElement("button");
        
//         // entertainmentButton.setAttribute("class", "material-icons");

//         // promoButton.innerHTML = "paid";
//         // eduButton.innerHTML = "menu_book";
//         // entertainmentButton.innerHTML = "movie";
//         promoButton.innerHTML = "💵";
//         eduButton.innerHTML = "📚";
//         entertainmentButton.innerHTML = "🎥";

//         promoButton.onclick = function () {
//           eventIdeas.innerHTML = "Promotional Idea: " + e.promo
//         };
//         eduButton.onclick = function () {
//           eventIdeas.innerHTML = "Educational Idea: " + e.education
//         };
//         entertainmentButton.onclick = function () {
//           eventIdeas.innerHTML = "Entertainment Idea: " + e.entertainment
//         };
//         ideaOption.append(promoButton);
//         ideaOption.append(eduButton);
//         ideaOption.append(entertainmentButton);

//         eventInfo.append(e.day + " " + e.month);
//         eventDescription.append(
//           e.name +
//             " is Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate."
//         );


//         eventTitle.append(e.name);

//         openModal();
//       }
//     });


//   });
// });


document.querySelectorAll(".card").forEach(function (item) {

  //item.style.backgroundImage="url(https://picsum.photos/200/300)"; // specify the image path here
item.addEventListener("click", function () {    
  events1.forEach((e) => {
    if (item.innerHTML === e.name) {
      const eventInfo = document.getElementById("event-info");
      const eventDescription = document.getElementById("event-description");
      const eventTitle = document.getElementById("event-title");
      const eventIdeas = document.getElementById("event-ideas");
      const ideaOption = document.getElementById("idea-option");
      const testButton = document.getElementById("test-button");

      testButton.setAttribute('name', e.name)
      testButton.setAttribute('startDate', e.calendarDate )
      testButton.setAttribute('description', "Visit CCC for a great content creation idea - Don't forget to tag us in your post and use the hashtag #madewithCCC to be in with a chance of being featured on our page!!"  )
      testButton.setAttribute('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)

      


      eventInfo.innerHTML = "";
      eventDescription.innerHTML = "";
      eventTitle.innerHTML = "";
      eventIdeas.innerHTML = "";
      ideaOption.innerHTML = "";

      const ideaButton = document.createElement("button");
      

      ideaButton.innerHTML = "💡";
      

      ideaButton.onclick = function () {
        eventIdeas.innerHTML = "Idea: " + e.idea[Math.floor(Math.random() * (e.idea).length)].description

      };
      
      ideaOption.append(ideaButton);

      eventInfo.append(e.day + " " + e.month);
      eventDescription.append(
        e.name +
          " is Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate."
      );


      eventTitle.append(e.name);

      openModal();
    }
  });


});
});

function openModal() {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // ADD THIS LINE
  document.body.style.height = "100%"; // ADD THIS LINE
  span.onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // ADD THIS LINE
    document.body.style.height = "auto"; // ADD THIS LINE
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // ADD THIS LINE
      document.body.style.height = "auto"; // ADD THIS LINE
    }
  };
}
