const BASE_URL =
  "https://proxy.fpltoolbox.com/http://fantasy.premierleague.com/api/";
//  const BASE_URL =
//  "http://fantasy.premierleague.com/api/";

let fpltoolbox_version = 5.7;

let currentGw;
let nextGw;
let bootstrap = {};
let eventStatus = {};
let savedLeagueID;
var leagueInfo = [];
let footballer = {};

let liveGameweekFixturesData;

let loggedInTeamName;
let managerData = {};

let league = [];
let leagueLength;
let leagueName;

let weeklyPicksForLeagueUpdated = null; // Tracks if the weekly picks have been added to the league
let myCurrentPicks = {};
let seasonData = [];
let createLeaguePromise = null;

let top5TransferredIn;

const rootStyles = getComputedStyle(document.documentElement);

const colors = {
  cyanNeon: rootStyles.getPropertyValue("--color-cyan-neon").trim(),
  greenNeon: rootStyles.getPropertyValue("--color-green-neon").trim(),
  pinkHot: rootStyles.getPropertyValue("--color-pink-hot").trim(),
  yellowBright: rootStyles.getPropertyValue("--color-yellow-bright").trim(),
  dashboardBlue: rootStyles.getPropertyValue("--color-dashboard-blue").trim(),
};
function generateTeamName() {
  // Inject HTML
  const app = document.getElementById("app");

  const teamNamesForGenerator = [
    // Arsenal
    { name: "Livin' Saliba Loca", tags: ["arsenal", "music"] },

    { name: "Old Havertz Kai Hard", tags: ["arsenal"] },
    { name: "Ødegaardians of the Galaxy", tags: ["arsenal"] },
    { name: "Curious Jorginho", tags: ["arsenal"] },
    { name: "Major League Saka", tags: ["arsenal"] },
    { name: "The Cesc Pistols", tags: ["classic", "arsenal", "music"] },
    { name: "Trossard Marks", tags: ["arsenal"] },
    { name: "You Gotta Havertz", tags: ["arsenal", "chelsea"] },
    { name: "Arteta-tete", tags: ["arsenal"] },
    { name: "The Arteta's Apprentice", tags: ["arsenal"] },
    {
      name: "Havertz Your Way",
      tags: ["classic", "arsenal", "chelsea", "music"],
    },

    // Aston Villa
    { name: "Stranger Mings", tags: ["aston-villa", "TV & Film"] },
    { name: "Come Digne With Me", tags: ["aston-villa"] },
    { name: "Out on Bailey", tags: ["aston-villa"] },
    { name: "Put a Dendonck on it", tags: ["aston-villa"] },
    { name: "Tea for the Tielemans", tags: ["aston-villa"] },
    {
      name: "Bangers and Rashford",
      tags: ["classic", "aston-villa", "manchester-united"],
    },
    { name: "Aston Village People", tags: ["aston-villa", "music"] },
    { name: "Rubber Digne Rapids", tags: ["aston-villa"] },
    { name: "Matty Cash Hoes", tags: ["aston-villa", "music"] },
    { name: "MattyCashInTheAttic", tags: ["aston-villa", "music"] },
    { name: "McGinn and Tonic", tags: ["aston-villa"] },
    { name: "Comme Ci Konsa", tags: ["aston-villa"] },

    // Brentford
    { name: "Throwing Schade", tags: ["brentford"] },
    { name: "Mee, Myself and I", tags: ["brentford"] },
    { name: "Dasilva Lining", tags: ["brentford"] },
    { name: "Thomas The Frank Engine", tags: ["brentford", "TV & Film"] },
    { name: "Kinder Mbeumo", tags: ["brentford"] },
    { name: "Mbeumo No.5", tags: ["classic", "brentford", "music"] },
    { name: "Wissa Khalifa", tags: ["classic", "brentford", "TV & Film"] },

    // Bournemouth
    { name: "El Vina Did Flow", tags: ["bournemouth"] },
    { name: "Dango Unchained", tags: ["bournemouth", "TV & Film"] },
    { name: "Back of the Neto", tags: ["bournemouth"] },
    { name: "High Faivre", tags: ["bournemouth"] },
    { name: "Billing Me Softly", tags: ["bournemouth", "music"] },

    // Brighton
    { name: "Gilmour Girls", tags: ["brighton", "TV & Film"] },
    { name: "Dunkytown", tags: ["brighton"] },
    { name: "Moder on the Dancefloor", tags: ["brighton"] },
    { name: "Boys In Dahoud", tags: ["brighton", "TV & Film"] },
    { name: "Estupiña Colada", tags: ["brighton"] },
    { name: "Groß Misconduct", tags: ["classic", "brighton"] },
    { name: "Estupina Colada", tags: ["brighton"] },
    { name: "Kids See Groß", tags: ["classic", "brighton"] },

    // Chelsea
    { name: "I'm Sorry Nic Jackson", tags: ["chelsea", "music"] },
    { name: "Stuck in the Mudryk", tags: ["chelsea"] },
    { name: "Under My Cucurella", tags: ["chelsea", "music"] },
    { name: "Reece's Set Pieces", tags: ["chelsea"] },
    { name: "Palmer Violets", tags: ["chelsea"] },
    { name: "Chilwell Soon", tags: ["chelsea"] },
    { name: "Petr Cech Yourself", tags: ["classic", "chelsea"] },
    { name: "Mudryk To Life", tags: ["classic", "chelsea"] },
    { name: "Malo Gusto: Bad Fart", tags: ["chelsea"] },

    // Crystal Palace
    { name: "Hakuna Mateta", tags: ["crystal-palace", "music", "TV & Film"] },
    { name: "Ayew Kidding Me", tags: ["crystal-palace"] },
    { name: "Jairoglyphics", tags: ["crystal-palace"] },
    { name: "Schlupptown Funk", tags: ["crystal-palace", "music"] },
    { name: "Eze Come Eze Go", tags: ["crystal-palace"] },
    { name: "Bacuna Mateta", tags: ["crystal-palace", "TV & Film"] },
    { name: "Ayew Being Served", tags: ["crystal-palace"] },

    // Everton
    { name: "Raiders of the Lost Tark", tags: ["everton", "TV & Film"] },
    { name: "Taking the Mykolenko", tags: ["everton"] },
    { name: "Roll the Dyche", tags: ["everton"] },
    { name: "Tesco McNeil Deal", tags: ["everton"] },
    { name: "Torn DCL", tags: ["everton"] },
    {
      name: "Backstreet Moyes",
      tags: [
        "everton",
        "classic",
        "manchester-united",
        "west-ham-united",
        "music",
      ],
    },
    { name: "Gueye Pride", tags: ["everton"] },

    // Fulham
    { name: "Iwobi Wan-Kenobi", tags: ["fulham"] },
    { name: "That's So Craven", tags: ["fulham"] },
    { name: "I Like To Muniz Muniz", tags: ["fulham", "music"] },
    { name: "Willian The Conqueror", tags: ["fulham"] },
    { name: "Diop It Like It's Hot", tags: ["fulham", "music"] },
    { name: "Smith Rowe Your Boat", tags: ["fulham", "arsenal"] },

    // Ipswich Town
    { name: "Hungry like the Woolf", tags: ["ipswich-town"] },
    { name: "Morsy Code", tags: ["ipswich-town"] },
    { name: "Starsky and Hutchinson", tags: ["ipswich-town"] },
    { name: "Burgess and Fries", tags: ["ipswich-town"] },
    { name: "Leif Blower", tags: ["ipswich-town"] },
    { name: "Hawk Tuanzebe", tags: ["ipswich-town"] },

    // Leicester City
    { name: "Hey, Wout's Wrong With You", tags: ["leicester-city"] },
    { name: "Yes Ndidi", tags: ["leicester-city"] },
    { name: "That's Soumare", tags: ["leicester-city"] },
    { name: "Champagne Coopernova", tags: ["leicester-city"] },
    { name: "House of Vards", tags: ["leicester-city", "classic"] },
    { name: "Vardy Boys FC", tags: ["leicester-city", "classic"] },
    { name: "Egg On Your Faes", tags: ["classic", "leicester-city"] },

    // Liverpool
    { name: "Alisson Wonderland", tags: ["liverpool"] },
    { name: "The 40 Year Old Virgil", tags: ["liverpool", "TV & Film"] },
    { name: "Pain in Diaz", tags: ["liverpool"] },
    { name: "The Konate Kid", tags: ["liverpool"] },
    { name: "Slot Machine", tags: ["liverpool"] },
    { name: "Haven't Jota Clue", tags: ["liverpool"] },
    { name: "Salah-vation Army", tags: ["liverpool"] },
    { name: "Darwinning FC", tags: ["liverpool"] },
    { name: "Alisson Blunderland", tags: ["liverpool", "TV & Film"] },
    { name: "Arne Hole's A Goal", tags: ["liverpool"] },
    { name: "When Harry Met Salah", tags: ["classic", "liverpool"] },
    { name: "DropItLikeIt'sSlot", tags: ["liverpool", "music"] },
    { name: "The Salah Doink", tags: ["liverpool"] },
    { name: "ChickenTikkaMoSalah", tags: ["classic", "liverpool"] },
    { name: "Darwin Theory", tags: ["classic", "liverpool"] },
    { name: "Jota than the Son", tags: ["liverpool"] },
    { name: "Endo Story", tags: ["liverpool", "TV & Film"] },
    { name: "Szoboszlai 4 Now", tags: ["liverpool"] },

    // Manchester City
    { name: "Haalandaise Sauce", tags: ["manchester-city"] },
    { name: "Ake Breaky Heart", tags: ["manchester-city"] },
    { name: "Gvardiols of the Galaxy", tags: ["manchester-city", "TV & Film"] },
    { name: "Silva Surfer", tags: ["manchester-city"] },
    { name: "De Bruyne Ultimatum", tags: ["manchester-city", "TV & Film"] },
    { name: "Cameroon Diaz", tags: ["manchester-city"] },
    { name: "Luke Kyle Walker", tags: ["classic", "manchester-city"] },
    { name: "Judy Haaland", tags: ["manchester-city"] },
    { name: "Haaland Oates", tags: ["manchester-city"] },
    { name: "Haalandaise Sauce", tags: ["manchester-city"] },
    {
      name: "Diaz Nother Day",
      tags: ["manchester-city", "classic", "TV & Film"],
    },

    { name: "Ederson Ake & Palmer", tags: ["manchester-city"] },

    // Manchester United
    { name: "Bruno Dos Tres", tags: ["manchester-united"] },
    { name: "Onana, What's My Name?", tags: ["manchester-united"] },
    { name: "How Dalot Can You Go", tags: ["manchester-united"] },
    { name: "Shaw and Order", tags: ["manchester-united", "TV & Film"] },
    { name: "Ten Hag's Army", tags: ["manchester-united", "classic"] },
    { name: "Mount Rushmore", tags: ["manchester-united"] },
    { name: "BrokebackMount10", tags: ["manchester-united", "TV & Film"] },
    { name: "Zirkzee Top Boy", tags: ["manchester-united", "classic"] },
    {
      name: "Shaw Shank Redemption",
      tags: ["manchester-united", "classic", "TV & Film"],
    },
    { name: "Earth Wind & Maguire", tags: ["manchester-united", "music"] },
    { name: "The Shaw Thing", tags: ["manchester-united"] },
    { name: "Cheesy Garnachos", tags: ["classic", "manchester-united"] },
    { name: "Garnacho Chips", tags: ["classic", "manchester-united"] },
    { name: "Afternoon De Ligt", tags: ["manchester-united"] },
    { name: "It'sOffToZirkzeeGo", tags: ["manchester-united"] },

    // Newcastle United
    { name: "Botman Begins", tags: ["newcastle-united", "TV & Film"] },
    { name: "Abra Dubravka", tags: ["newcastle-united"] },
    { name: "Burn Baby Burn", tags: ["newcastle-united", "music"] },
    { name: "Krafth Dinner", tags: ["newcastle-united"] },
    { name: "Trippier on Acid", tags: ["newcastle-united"] },
    { name: "Born in a Barnes", tags: ["newcastle-united"] },
    { name: "Botman and Robin", tags: ["newcastle-united"] },
    { name: "AbraDubravka", tags: ["newcastle-united"] },
    { name: "A Night In Lascelles", tags: ["newcastle-united"] },
    { name: "Hall In One", tags: ["classic", "newcastle-united"] },
    { name: "Not Isakly Sure", tags: ["newcastle-united"] },

    // Nottingham Forest
    { name: "Duel of the Yates", tags: ["nottingham-forest"] },
    { name: "Boly and Clyde", tags: ["nottingham-forest"] },
    { name: "Matz Sels Sea Shells", tags: ["nottingham-forest"] },
    { name: "Finding Neco", tags: ["nottingham-forest", "TV & Film"] },
    { name: "MacAwoniyi Cheese", tags: ["nottingham-forest"] },
    {
      name: "What the Elanga?",
      tags: ["nottingham-forest", "manchester-united"],
    },
    {
      name: "Boly Pocket",
      tags: ["classic", "wolves", "nottingham-forest", "TV & Film"],
    },

    // Southampton
    { name: "Escape from Alcaraz", tags: ["southampton"] },
    { name: "Aribo Tangfastics", tags: ["southampton"] },
    { name: "Onuachu (Bless you)", tags: ["southampton"] },
    { name: "Heinz Bella-Kotchap", tags: ["southampton"] },
    { name: "Lallanas in Pyjamas", tags: ["southampton"] },

    // Spurs
    { name: "Losing My Reguilon", tags: ["spurs", "music"] },
    { name: "House of the Dragusin", tags: ["spurs"] },
    { name: "Van de Ven Diagram", tags: ["spurs"] },
    { name: "Empire of the Son", tags: ["spurs"] },
    { name: "Los Porro Hermanos", tags: ["spurs"] },
    { name: "Sonny and Schar", tags: ["spurs", "newcastle-united"] },
    { name: "Men with Van De Ven", tags: ["spurs"] },
    { name: "Ange Management", tags: ["spurs"] },
    { name: "Son of a Gun", tags: ["spurs"] },
    { name: "Son-sational", tags: ["spurs"] },
    { name: "Son's Out, Guns Out", tags: ["spurs"] },

    // West Ham United
    { name: "Soucek Yourself", tags: ["west-ham-united"] },
    { name: "WHU Tang Clan", tags: ["west-ham-united"] },
    { name: "Paqueta Crisps", tags: ["west-ham-united"] },
    { name: "Bad to the Bowen", tags: ["west-ham-united", "music"] },
    { name: "Areola Grande", tags: ["west-ham-united", "music"] },

    { name: "Bowen 747", tags: ["west-ham-united"] },
    { name: "Bowen Arrow", tags: ["west-ham-united"] },
    { name: "Exposed Areola", tags: ["west-ham-united"] },
    { name: "Bad to the Bowen", tags: ["west-ham-united", "music"] },

    // Wolves
    { name: "Purple Rayan", tags: ["wolves", "music"] },
    { name: "Pedro Lima Bean", tags: ["wolves"] },
    { name: "Mama, Just Kilman", tags: ["wolves", "music"] },
    { name: "Cunha Get Any Worse?", tags: ["wolves", "manchester-united"] },
    { name: "Podence Dence Revolution", tags: ["wolves"] },
    { name: "Ruthless Toothless Wolves", tags: ["wolves"] },
    { name: "Ait Nouri Geller", tags: ["wolves"] },

    // Classics

    { name: "Absolutely Fabregas", tags: ["arsenal", "classic", "TV & Film"] },
    { name: "Baines on Toast", tags: ["everton", "classic"] },
    {
      name: "Crouch Potato",
      tags: ["classic", "spurs", "southampton", "liverpool"],
    },
    { name: "Ruud Health", tags: ["classic", "chelsea"] },
    {
      name: "How I Met Your Mata",
      tags: ["manchester-united", "classic", "TV & Film"],
    },
    { name: "Two's Kompany", tags: ["classic", "manchester-city", "burnley"] },
    { name: "Men Behaving Chadli", tags: ["classic", "spurs"] },
    {
      name: "3 Men and a Bebe",
      tags: ["classic", "manchester-united", "TV & Film"],
    },
    { name: "50ShadesOfAndyGray", tags: ["classic", "TV & Film"] },
    { name: "ABCDE FC", tags: ["classic"] },

    { name: "Blink 1-Eto'o", tags: ["classic", "chelsea"] },

    { name: "Cesc and the City", tags: ["classic", "arsenal"] },
    { name: "Ctrl + Alt + De Laet", tags: ["classic"] },
    { name: "Delph & Safety", tags: ["classic"] },
    { name: "Dzeko & the Bunnymen", tags: ["classic", "music"] },
    { name: "Fiddler on the Huth", tags: ["classic", "TV & Film"] },
    { name: "Flying Without Ings", tags: ["classic", "music"] },
    { name: "Game Of Throw-Ins", tags: ["classic"] },
    { name: "Gangsters Allardyce", tags: ["classic", "music"] },
    {
      name: "Giroud Awakening",
      tags: ["classic", "arsenal", "chelsea", "music"],
    },
    { name: "HuttonDressedAsLahm", tags: ["classic"] },

    { name: "Klopps and Robbos", tags: ["classic", "liverpool"] },
    { name: "Krul and the Gang", tags: ["classic"] },
    { name: "Le Saux Solid Crew", tags: ["classic", "music"] },
    { name: "Löw Island", tags: ["classic"] },

    {
      name: "Michu at De Gea Ba",
      tags: ["classic", "manchester-united", "music"],
    },
    { name: "Neville Wears Prada", tags: ["classic", "TV & Film"] },
    { name: "Norfolk n' Good", tags: ["classic"] },
    { name: "Obi 1 Kenobi 0", tags: ["classic", "TV & Film"] },
    { name: "Pjanic! At The Disco", tags: ["classic", "music"] },
    {
      name: "Smack My Bilic Up",
      tags: ["classic", "west-ham-united", "music"],
    },
    { name: "Sound of the Lloris", tags: ["classic", "TV & Film", "music"] },
    { name: "TAA Very Much", tags: ["classic", "liverpool"] },
    {
      name: "The Martial Mata LP",
      tags: ["classic", "manchester-united", "music"],
    },
    { name: "Tinchy Sneijder", tags: ["classic", "music"] },
    { name: "Who Ate All Depays?", tags: ["classic", "manchester-united"] },

    { name: "Bellerin Than Out", tags: ["classic"] },
    { name: "Better Call Saúl", tags: ["classic", "chelsea"] },

    { name: "Elneny and the Jets", tags: ["classic", "arsenal"] },

    { name: "GuardianOfTheGulasci", tags: ["classic", "TV & Film"] },

    { name: "Hotel? Thiago", tags: ["classic", "chelsea"] },
    { name: "Howe Toon Is Now", tags: ["classic"] },
    { name: "Isco Inferno", tags: ["classic"] },

    { name: "Just 1 Cornet 0", tags: ["classic"] },
    { name: "Klich and Collect", tags: ["classic"] },
    { name: "Kodja and Maja", tags: ["classic"] },
    { name: "Krafth Beer", tags: ["classic"] },
    { name: "MacAwoniyi Cheese", tags: ["classic"] },

    { name: "ModerOnTheDancefloor", tags: ["classic"] },

    { name: "NotMikeDeanForever", tags: ["classic"] },

    { name: "Run The Kewells", tags: ["classic"] },
    { name: "Sancho Unchained", tags: ["classic"] },
    { name: "TeaForTheTielemans", tags: ["classic"] },

    { name: "Ake Breaky Heart", tags: ["classic"] },

    { name: "Ashley Old", tags: ["classic", "arsenal", "chelsea"] },

    { name: "Back of the Neto", tags: ["classic"] },

    { name: "Ballon D'awson", tags: ["classic"] },

    { name: "Ben Mee Shake Mee", tags: ["classic"] },
    { name: "Berge King", tags: ["classic"] },
    { name: "Bernard's Poch", tags: ["classic"] },
    {
      name: "Blazinchenko Squad",
      tags: ["classic", "arsenal", "manchester-city"],
    },

    { name: "Boys In Dahoud", tags: ["classic", , "TV & Film"] },
    { name: "Brennan Jerry's", tags: ["classic"] },

    { name: "Calafiori Sunshine", tags: ["classic"] },
    { name: "Carson Dioxide", tags: ["classic"] },
    { name: "Castagne Me Now", tags: ["classic"] },
    { name: "Castagne Supernova", tags: ["classic", "music"] },
    { name: "Champagne De Cordova", tags: ["classic"] },

    { name: "Clyne of Duty", tags: ["classic", "liverpool", "southampton"] },
    { name: "Cobra Kai Havertz", tags: ["classic"] },

    { name: "Curious Jorginho", tags: ["classic", "arsenal", "chelsea"] },

    { name: "Fee Fi Foden", tags: ["classic"] },
    { name: "FeelsLikeSummerville", tags: ["classic"] },
    { name: "Femme Fatawu", tags: ["classic"] },
    { name: "FullKrugMetalJacket", tags: ["classic"] },

    { name: "Gilmour Girls", tags: ["classic"] },
    { name: "Guantana Maupay", tags: ["classic"] },
    { name: "GvardiolsOfTheGalaxy", tags: ["classic", "TV & Film"] },

    { name: "Hellmans Mainoonaise", tags: ["classic"] },
    { name: "Heung Like A Horse", tags: ["classic"] },
    { name: "High Faivre", tags: ["classic"] },
    { name: "HouseOfTheDragusin", tags: ["classic"] },
    { name: "I Love Lamp(tey)", tags: ["classic"] },
    { name: "I'm Yelling Timber", tags: ["classic", "music"] },
    { name: "IncogNeto", tags: ["classic"] },
    { name: "IngsCanOnlyGetBetter", tags: ["classic", "music"] },
    { name: "Issa Ring Toss Game", tags: ["classic"] },

    { name: "Just like Evans", tags: ["classic"] },
    { name: "Kai Me A River", tags: ["classic", "music"] },
    { name: "Kamada Harris", tags: ["classic"] },
    { name: "Keita Mooy Hart", tags: ["classic", "music"] },

    { name: "Kilman Me Softly", tags: ["classic", "music"] },
    { name: "Kinder Mbeumo", tags: ["classic"] },
    { name: "KudusToYou", tags: ["classic"] },
    { name: "Leif Right Now", tags: ["classic"] },
    { name: "Lil Eze Vert", tags: ["classic"] },

    { name: "Lord and Savio", tags: ["classic"] },
    { name: "Los Porro Hermanos", tags: ["classic"] },
    { name: "Losing My Reguilon", tags: ["classic", "music"] },
    { name: "LoveTheWaySzoboszlai", tags: ["classic"] },

    { name: "McKenna Kick It?", tags: ["classic", "music"] },

    { name: "Mings of Power", tags: ["classic"] },
    { name: "Minteh Fresh", tags: ["classic"] },
    { name: "Mitomavirus", tags: ["classic"] },
    { name: "More Tea Vicario?", tags: ["classic", "TV & Film"] },

    { name: "Name's Not Andre M8", tags: ["classic"] },
    { name: "Netflix and Chilwell", tags: ["classic", "TV & Film"] },
    { name: "Nkunku Clock", tags: ["classic"] },

    { name: "Now I'm a Baleba", tags: ["classic"] },
    { name: "Øde Toilette", tags: ["classic"] },
    { name: "Odegaarden Partey", tags: ["classic"] },
    { name: "Ødeparfum", tags: ["classic"] },
    { name: "Okoli Dokily", tags: ["classic"] },

    { name: "Omari Me", tags: ["classic"] },
    { name: "OnanaMataPlea", tags: ["classic"] },

    { name: "Paqueta Crisps", tags: ["classic", "west-ham-united"] },
    { name: "PARTEYNEXTDOOR", tags: ["classic", "music"] },
    { name: "Pavard the Builder", tags: ["classic", "TV & Film"] },
    { name: "Pepe Pig", tags: ["classic", "TV & Film"] },
    { name: "Pitch Perfect", tags: ["classic", "music", "TV & Film"] },
    { name: "Pope Fiction", tags: ["classic", "TV & Film"] },
    { name: "Postecog-Low Block", tags: ["classic", "spurs"] },
    { name: "Praise the Lord", tags: ["classic"] },
    { name: "Prowse Control", tags: ["classic", "music"] },
    { name: "Push It To The Neto", tags: ["classic"] },
    { name: "Rage Against Fabianski", tags: ["classic", "music"] },
    { name: "Rashford's Recovery Room", tags: ["classic"] },
    { name: "Reek 'em Ralph", tags: ["classic"] },
    { name: "Rice Rice Baby", tags: ["classic"] },
    { name: "Rico Suave", tags: ["classic"] },
    { name: "Ritchie Richarlison", tags: ["classic"] },
    { name: "Rodri or Not", tags: ["classic"] },
    { name: "Rolly Gusto", tags: ["classic"] },
    { name: "Roque The Kasper", tags: ["classic"] },
    { name: "Run the Jules", tags: ["classic"] },

    { name: "Saliba Your Face", tags: ["classic"] },
    { name: "Samba de Doucoure", tags: ["classic"] },
    { name: "Sanch-Oh No", tags: ["classic"] },
    { name: "Sangaré-oke", tags: ["classic"] },
    { name: "Saša And The Sun", tags: ["classic"] },
    { name: "Sarr Trek", tags: ["classic", "TV & Film"] },
    { name: "Sat Nav Simms", tags: ["classic"] },
    { name: "Save Our Sancho", tags: ["classic"] },
    { name: "Scammaca Rhythm", tags: ["classic"] },
    { name: "Schär Wars", tags: ["classic", "TV & Film"] },
    { name: "Schick Moves", tags: ["classic"] },
    { name: "ScottCarson FC", tags: ["classic"] },
    { name: "Sesko Mode", tags: ["classic"] },
    { name: "Sessegnon's Eleven", tags: ["classic"] },

    { name: "Shawcrossed Lovers", tags: ["classic", "TV & Film"] },
    { name: "She Wore A Trippier", tags: ["classic"] },
    { name: "Silva Lining", tags: ["classic"] },
    { name: "Simakan the Beast", tags: ["classic"] },
    { name: "Simakan You Feel It", tags: ["classic"] },
    { name: "Sinisterra Squad", tags: ["classic"] },
    { name: "SlottingOneIn", tags: ["classic"] },

    { name: "Snoochie Doku", tags: ["classic"] },
    { name: "So I Skipp-ed", tags: ["classic"] },
    { name: "Soler Power", tags: ["classic"] },

    { name: "Southgate's Tears FC", tags: ["classic"] },
    { name: "Spence It Like Beckham", tags: ["classic", "TV & Film"] },
    { name: "Steele or No Steele", tags: ["classic"] },
    { name: "Sterling Silvers", tags: ["classic"] },
    { name: "Stones Unturned", tags: ["classic"] },
    { name: "Struijk and Awe", tags: ["classic"] },
    { name: "Sue Per Sarr", tags: ["classic"] },

    ,
    { name: "Take it to the McTominay", tags: ["classic"] },
    { name: "Targett Practice", tags: ["classic"] },
    { name: "Taylor Made FC", tags: ["classic"] },
    { name: "Teemu and the Gang", tags: ["classic"] },

    { name: "The Boys Are Barkley", tags: ["classic", "music"] },
    { name: "The Full Nelson", tags: ["classic"] },

    {
      name: "Toney Award Winners",
      tags: ["classic", "brentford", "TV & Film", "music"],
    },
    { name: "Toti Africa", tags: ["classic"] },

    { name: "Turn the Page FC", tags: ["classic"] },
    { name: "Udogie Style", tags: ["classic"] },
    { name: "Up the du-Couré", tags: ["classic"] },

    { name: "Vazquez and Furious", tags: ["classic", "TV & Film"] },
    { name: "Vini Vidi Vicario", tags: ["classic"] },
    { name: "Viva La Veltman", tags: ["classic"] },
    { name: "Wataru You Waiting For", tags: ["classic"] },
    { name: "Watts on Earth?", tags: ["classic"] },
    { name: "Weghorst Gump", tags: ["classic", "TV & Film"] },

    { name: "Who Let the Kökçüs Out?", tags: ["classic", "music"] },
    { name: "Wilson's World", tags: ["classic"] },

    { name: "Wright Said Fred", tags: ["classic", "manchester-united"] },

    { name: "You're the Øne", tags: ["classic"] },
    { name: "Zaniolo Express", tags: ["classic"] },
    { name: "Zanka You Very Much", tags: ["classic"] },
    { name: "Zemura's Finesse", tags: ["classic"] },

    // worldwide
    {
      name: "Murder on Zidane's Floor",
      tags: ["worldwide", "classic", "music"],
    },
    { name: "De Jong Trousers", tags: ["worldwide", "TV & Film"] },
    { name: "Muller Reus Corner", tags: ["worldwide", "classic"] },
    { name: "Baby Reijnders", tags: ["worldwide"] },
    { name: "CommethTheAouar", tags: ["worldwide"] },
    { name: "Daylight Ribery", tags: ["worldwide"] },
    { name: "DeJong&WindingRoad", tags: ["worldwide"] },
    { name: "DiMarco Polo", tags: ["worldwide"] },
    { name: "Dunk Your Busquets", tags: ["worldwide"] },
    { name: "Inglorious Bas Dost", tags: ["worldwide", "TV & Film"] },
    { name: "Itsy Bitsy Chiellini", tags: ["worldwide", "music"] },
    { name: "Kroos Control", tags: ["worldwide"] },
    { name: "Lemon and Laimer", tags: ["worldwide"] },
    { name: "Mbappe Feet", tags: ["worldwide"] },
    { name: "Orban Legend", tags: ["worldwide"] },
    { name: "PassionOfTheCruyff", tags: ["worldwide"] },
    { name: "Pedri Dish", tags: ["worldwide"] },
    { name: "Pique Blinders", tags: ["worldwide"] },
    { name: "PutJohansUp4DeCruyff", tags: ["worldwide"] },
    { name: "Savic Garden", tags: ["worldwide", "music"] },
    { name: "Schick's Creek", tags: ["worldwide"] },
    { name: "Taribo Westlife", tags: ["worldwide", "music"] },
    { name: "Under My Barella", tags: ["worldwide", "music"] },
    { name: "Where'sTheLahmSauce", tags: ["worldwide"] },
    { name: "AC/DC United", tags: ["worldwide", "classic", "music"] },
    { name: "Ajax Trees Down", tags: ["worldwide"] },
    { name: "Anderlecht my balls", tags: ["worldwide"] },
    { name: "Bayer Neverlosin'", tags: ["worldwide"] },
    { name: "Bayern Bru", tags: ["worldwide"] },
    { name: "Bayern Maiden", tags: ["worldwide"] },
    { name: "Bilbao Baggins", tags: ["worldwide", "TV & Film"] },
    { name: "Borussia Teeth", tags: ["worldwide"] },
    { name: "ChampagneSuperRovers", tags: ["worldwide", "music"] },
    { name: "Cry Me A River Plate", tags: ["worldwide", "music"] },
    { name: "Expected Toulouse", tags: ["worldwide"] },
    { name: "Fiorentina Turner", tags: ["worldwide", "music"] },
    { name: "good kid mAAn city", tags: ["worldwide"] },
    { name: "Imaginary Madrid", tags: ["worldwide"] },
    { name: "Inter Yermam", tags: ["worldwide"] },
    { name: "Pathetico Madrid", tags: ["worldwide"] },
    { name: "Pfizer Chiefs", tags: ["worldwide"] },
    { name: "Real SoSoBad", tags: ["worldwide"] },
    { name: "Sexandthe City", tags: ["worldwide", "TV & Film"] },
    { name: "Spartak Costco", tags: ["worldwide"] },
    { name: "Sub-standard Liege", tags: ["worldwide"] },
    { name: "The Molde Peaches", tags: ["worldwide"] },
    { name: "Vladimir Luton", tags: ["worldwide"] },
    { name: "Khedira Pin Drop", tags: ["worldwide", "classic"] },
    { name: "Surreal Madrid", tags: ["worldwide", "classic"] },
  ];

  app.innerHTML = `
  <div id="generatorContainer">
    <label for="teamFilter">Filter by category:</label>
    <select id="teamFilter"></select>
    <br><br>

    <div id="teamNameDisplay">Click the button to get a name</div>
        <button id="copyBtn" style="display:none;">📋 Copy</button>
    <br><br>

        <button id="generateBtn">Generate Team Name</button>
  </div>
`;

  // Style elements via JS
  const styles = {
    "#generatorContainer": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignSelf: "center",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "2rem",
      maxWidth: "600px",
    },
    "#generateBtn": {
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "1rem",
    },
    "#teamNameDisplay": {
      fontSize: "2rem",
      color: "#333",
    },
    "#teamFilter": {
      padding: "0.3rem",
      fontSize: "1rem",
      marginTop: "0.5rem",
    },
    "#copyBtn": {
      padding: "0.4rem 1rem",
      marginTop: "1rem",
      fontSize: "1rem",
      cursor: "pointer",
    },
  };
  for (const selector in styles) {
    const element = document.querySelector(selector);
    if (element) Object.assign(element.style, styles[selector]);
  }

  // Populate filter dropdown
  const allTags = new Set();
  teamNamesForGenerator.forEach((team) =>
    team.tags.forEach((tag) => allTags.add(tag))
  );

  const filterSelect = document.getElementById("teamFilter");
  const createOption = (value, label) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  };
  filterSelect.appendChild(createOption("all", "All"));
  [...allTags].sort().forEach((tag) => {
    const label = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, " ");
    filterSelect.appendChild(createOption(tag, label));
  });

  // Generate button logic
  const display = document.getElementById("teamNameDisplay");
  const copyBtn = document.getElementById("copyBtn");

  document.getElementById("generateBtn").addEventListener("click", () => {
    const selectedFilter = filterSelect.value;
    const filtered = teamNamesForGenerator.filter(
      (team) => selectedFilter === "all" || team.tags.includes(selectedFilter)
    );

    if (filtered.length === 0) {
      display.textContent = "No names match your filter.";
      copyBtn.style.display = "none";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selectedName = filtered[randomIndex].name;
    display.textContent = selectedName;
    copyBtn.style.display = "inline-block";
    copyBtn.textContent = "📋 Copy";
  });

  // Copy to clipboard logic
  copyBtn.addEventListener("click", () => {
    const textToCopy = display.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy";
      }, 1500);
    });
  });
}
async function getEventStatus() {
  try {
    const res = await fetch(BASE_URL + "event-status/");
    const data = await res.json();
    eventStatus = data;
    console.log(data);
    console.log(eventStatus.leagues);
  } catch (error) {
    console.error("Something went wrong... ", error);
  }
}
getEventStatus();

async function getBootstrap() {
  try {
    const res = await fetch(BASE_URL + "bootstrap-static/");
    const data = await res.json();
    bootstrap = data;
    console.log(bootstrap);
    // Set current and next game week
    bootstrap.events.forEach((event) => {
      if (event.is_current) currentGw = event.id;
      if (event.is_next) nextGw = event.id;
    });
    // Sort players by `transfers_in` in descending order
    bootstrap.elements.sort((a, b) => b.transfers_in - a.transfers_in);

    // Get the top 5 most transferred-in players
    top5TransferredIn = bootstrap.elements.slice(0, 10);

    //fetch current gw fixtures data
    // const liveRes = await fetch(BASE_URL + "fixtures/?event=" + currentGw);
    // let liveGameweekFixturesData = await liveRes.json();
    // console.log(liveGameweekFixturesData);
  } catch (error) {
    console.error("Something went wrong... ", error);
  }
}
getBootstrap();

async function getManagerData(teamID) {
  try {
    const res = await fetch(BASE_URL + "/entry/" + teamID + "/");
    const data = await res.json();
    managerData = data;
    console.log(managerData);

    loggedInTeamName = data.name;

    // Populate league options
    let options = "";
    data.leagues.classic.forEach((e) => {
      options += `<option name="${e.name}" value="${e.id}" id="${
        e.id
      }" style="border-radius: 5px;">${e.name + ": " + e.id}</option>`;

      // Check if "league-list" div exists
      const leagueListDiv = document.getElementById("league-list");
      if (leagueListDiv) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `${e.name + ": " + e.id}`;
        leagueListDiv.appendChild(newDiv);
      }
    });

    // Check if "leagues" element exists before setting innerHTML
    const leaguesElement = document.getElementById("leagues");
    if (leaguesElement) {
      leaguesElement.innerHTML = options;
    }
  } catch (error) {
    console.error("Something went wrong... ", error);
  }
}

if (theUser.info.team_id) {
  //console.log("Hey " + theUser.username.data.display_name);
  //console.log("User's team ID " + theUser.info.team_id);
  //console.log("User's league ID " + theUser.info.league_id);
  //console.log(theUser.username.data.membership_level.ID)

  getManagerData(theUser.info.team_id);
}
if (theUser.info.league_id[0] != "") {
  createLeague(theUser.info.league_id);
} else {
  alert("Remember to select a league in your profile");
}

if (theUser.username.data.ID == 1) {
  console.log("you are who you are");
  // Check if "league-list" div exists
  const leagueListDiv = document.getElementById("league-list");
  if (leagueListDiv) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `My saved Team Ids <br> SJ: 87148<br>FPLT: 202646<br><br>`;
    leagueListDiv.appendChild(newDiv);
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function changeLeague(id) {
  //navigator.clipboard.writeText(id);
  document.getElementById("league_id").value = id;
  setTimeout(() => {
    document
      .getElementsByClassName("pmpro_btn-submit-update-profile")[0]
      .click();
  }, "500");

  alert("League ID changed to: " + id);
  if (leagueLength > 49) {
    alert(
      "Just so you know, I can only work with the top 50 teams in this leaugue at the moment - i'll let you know when/if that changes"
    );
  }
}

async function createLeague(leagueID) {
  const startTime = Date.now(); // Start the timer
  try {
    // Create a new Promise to signal when this function is done
    createLeaguePromise = new Promise(async (resolve, reject) => {
      const response = await fetch(
        `${BASE_URL}leagues-classic/${leagueID}/standings/`
      );
      const leagueData = await response.json();
      leagueName = leagueData.league.name;
      league = leagueData.standings.results || [];

      if (leagueData.standings.has_next === true) {
        leagueLength = 50;
      }

      await addAllWeeksData();
      await addCurrentWeekData();
      await addAllTransfers();

      //console.log(league);
      const endTime = Date.now(); // End the timer
      console.log(
        `League created for all teams in ${
          (endTime - startTime) / 1000
        } seconds.`
      );

      resolve(); // Signal completion
    });
  } catch (error) {
    console.error("Error fetching league data: ", error);
    createLeaguePromise = Promise.reject(error); // Signal failure
  }
}

async function addAllWeeksData() {
  const startTime = Date.now(); // Start the timer
  console.log(league);
  const gwFetches = league.map(async (team) => {
    try {
      const response = await fetch(`${BASE_URL}entry/${team.entry}/history/`);
      const teamData = await response.json();
      // Add all gameweeks data to a new array
      team.everyGw = teamData.current.map((week) => ({
        percentile_rank: week.percentile_rank,
        bank: week.bank,
        gameweek: week.event,
        points: week.points,
        rank: week.rank,
        overall_rank: week.overall_rank,
        value: week.value,
        transfers: week.event_transfers,
        transfers_cost: week.event_transfers_cost,
        bench_points: week.points_on_bench,
      }));

      // Helper function to calculate a total for a specific field
      const calculateTotal = (field) =>
        teamData.current.reduce((sum, week) => sum + week[field], 0);

      // Calculate totals
      team.totalTransfers = calculateTotal("event_transfers");
      team.totalMinusPoints = calculateTotal("event_transfers_cost");
      team.totalPointsOnBench = calculateTotal("points_on_bench");

      // Helper function to find best and worst weeks by a specified field
      const findBestWorstWeek = (field) =>
        teamData.current.reduce(
          (result, week) => {
            if (week[field] > result.best[field]) result.best = week;
            if (week[field] < result.worst[field]) result.worst = week;
            return result;
          },
          { best: teamData.current[0], worst: teamData.current[0] }
        );

      // Set best and worst week by points and overall rank
      const { best: bestWeek, worst: worstWeek } = findBestWorstWeek("points");
      team.bestWeek = bestWeek;
      team.worstWeek = worstWeek;

      const { best: bestOverallRankWeek, worst: worstOverallRankWeek } =
        findBestWorstWeek("overall_rank");
      team.bestOverallRankWeek = bestOverallRankWeek;
      team.worstOverallRankWeek = worstOverallRankWeek;

      // Find the highest team value week
      team.highestValueWeek = teamData.current.reduce(
        (highest, week) => (week.value > highest.value ? week : highest),
        teamData.current[0]
      );

      // Add chips data (limited to 6 chips)
      //console.log(teamData)
      team.chips = teamData.chips.slice(0, 6).map((chip) => ({
        name: chip.name,
        time: chip.time,
        gw: chip.event,
      }));

      team.past = teamData.past;

      // Other team data
      team.seasons = teamData.past.length;
      team.seasons_managed = teamData.past[0]?.season_name || "NEW";
      team.previousRank =
        teamData.current[teamData.current.length - 2]?.overall_rank || "";
      // Add a small delay between requests (e.g., 500ms)
      await delay(200);
      console.log("delay here");
    } catch (error) {
      console.error(`Error fetching data for team ${team.entry}: `, error);
    }
  });

  await Promise.all(gwFetches);
  const endTime = Date.now(); // End the timer
  console.log(
    `All weeks data for all teams added in ${
      (endTime - startTime) / 1000
    } seconds.`
  );
}

async function addCurrentWeekData1() {
  const startTime = Date.now(); // Start the timer
  const allGwFetches = league.map(async (team) => {
    try {
      const allGwPromises = [];

      // Fetch picks data for each gameweek from 1 to currentGw
      for (let gw = 1; gw <= currentGw; gw++) {
        allGwPromises.push(
          fetch(`${BASE_URL}entry/${team.entry}/event/${gw}/picks/`)
            .then((response) => response.json())
            .then((data) => ({
              gameweek: gw,
              picks: data.picks || [],
              active_chip: data.active_chip || null,
            }))
        );
        await delay(500);
      }

      // Wait for all gameweek data to resolve
      const allGwData = await Promise.all(allGwPromises);

      // Add all gameweek picks data to the new array
      team.everyGwPicks = allGwData;

      // Add current week data
      const currentWeekData = allGwData.find(
        (gwData) => gwData.gameweek === currentGw
      );
      //console.log(currentWeekData)
      team.currentWeek = currentWeekData ? [currentWeekData] : [];

      // Create an array for weekly captain picks
      team.weeklyCaptainPicks = allGwData.map((gwData) => {
        const captainPick = gwData.picks.find((pick) => pick.is_captain);
        return {
          gameweek: gwData.gameweek,
          captain: captainPick || null,
          captainName: captainPick
            ? getPlayerWebName(captainPick.element)
            : null,
        };
      });
      // Add a small delay between requests (e.g., 500ms)
      await delay(100);
      console.log("delay here");
    } catch (error) {
      console.error(
        `Error fetching all gameweeks picks for team ${team.entry}: `,
        error
      );
    }
  });
  const endTime = Date.now(); // End the timer
  console.log(
    `All current weeks data added in ${(endTime - startTime) / 1000} seconds.`
  );
  await Promise.all(allGwFetches);
}
async function addCurrentWeekData() {
  const startTime = Date.now(); // Start the timer

  const allGwFetches = league.map(async (team) => {
    try {
      const allGwPromises = [];

      // Fetch picks data for each gameweek from 1 to currentGw
      for (let gw = 1; gw <= currentGw; gw++) {
        allGwPromises.push(
          fetch(`${BASE_URL}entry/${team.entry}/event/${gw}/picks/`)
            .then((response) => response.json())
            .then((data) => ({
              gameweek: gw,
              picks: data.picks || [],
              active_chip: data.active_chip || null,
            }))
        );
        await delay(500); // Add small delay between requests
      }

      // Wait for all gameweek data to resolve
      const allGwData = await Promise.all(allGwPromises);

      // Add all gameweek picks data to the new array
      team.everyGwPicks = allGwData;

      // Add current week data
      const currentWeekData = allGwData.find(
        (gwData) => gwData.gameweek === currentGw
      );
      team.currentWeek = currentWeekData ? [currentWeekData] : [];

      // Create an array for weekly captain picks
      team.weeklyCaptainPicks = allGwData.map((gwData) => {
        const captainPick = gwData.picks.find((pick) => pick.is_captain);
        return {
          gameweek: gwData.gameweek,
          captain: captainPick || null,
          captainName: captainPick
            ? getPlayerWebName(captainPick.element)
            : null,
        };
      });

      // Count played stats per gameweek
      team.playedCount = allGwData.map((gwData) => {
        const playedCount = gwData.picks.filter(
          (pick) =>
            pick.multiplier === 1 ||
            pick.multiplier === 2 ||
            pick.multiplier === 3
        ).length;

        const noPlayedCount = gwData.picks.filter(
          (pick) => pick.multiplier === 0
        ).length;

        return {
          gameweek: gwData.gameweek,
          playedCount,
          noPlayedCount,
        };
      });

      // Total across all weeks
      team.totalPlayedStats = team.playedCount.reduce(
        (totals, gwStats) => {
          totals.totalPlayed += gwStats.playedCount;
          totals.totalNotPlayed += gwStats.noPlayedCount;
          return totals;
        },
        { totalPlayed: 0, totalNotPlayed: 0 }
      );

      // Track frequency of each element across all gameweeks
      const elementFrequencyMap = {};
      allGwData.forEach((gwData) => {
        gwData.picks.forEach((pick) => {
          if (!elementFrequencyMap[pick.element]) {
            elementFrequencyMap[pick.element] = 0;
          }
          elementFrequencyMap[pick.element]++;
        });
      });

      // Convert to readable player names and sort by count descending
      const sortedFrequency = Object.entries(elementFrequencyMap)
        .map(([elementId, count]) => ({
          playerName: getPlayerWebName(Number(elementId)),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      team.pickElementFrequency = sortedFrequency;

      await delay(100); // Small delay before moving to next team
      console.log("delay here");
    } catch (error) {
      console.error(
        `Error fetching all gameweeks picks for team ${team.entry}: `,
        error
      );
    }
  });

  await Promise.all(allGwFetches);

  const endTime = Date.now(); // End the timer
  console.log(
    `All current weeks data added in ${(endTime - startTime) / 1000} seconds.`
  );
}

async function addAllTransfers() {
  const startTime = Date.now(); // Start the timer
  const allTransfersFetch = league.map(async (team) => {
    try {
      const transfersPromises = [];

      // Fetch transfer data for each team
      transfersPromises.push(
        fetch(`${BASE_URL}/entry/${team.entry}/transfers/`).then((response) =>
          response.json()
        )
      );

      // Wait for all transfer data to resolve
      const transfersData = await Promise.all(transfersPromises);

      // Add transfers data to the team's object
      team.transfers = transfersData;

      // Add a small delay between requests (e.g., 500ms)
      await delay(200);
      console.log("delay here");
    } catch (error) {
      console.error(`Error fetching transfers for team ${team.entry}: `, error);
    }
  });

  await Promise.all(allTransfersFetch);
  const endTime = Date.now(); // End the timer
  console.log(
    `All transfers added in ${(endTime - startTime) / 1000} seconds.`
  );
}

// SEASON TABLE
async function showStandings() {
  console.log(league);
  const app = document.getElementById("app");
  app.innerHTML = "";
  const loader = new LoadingBar(app);
  loader.start();
  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Season Stats`;
  tableHeader.style.textAlign = "center";
  leagueTable.appendChild(tableHeader);

  app.appendChild(leagueTable);
  try {
    if (createLeaguePromise) {
      await createLeaguePromise;
      var firstPlace = league[0].total;

      let table = document.createElement("table");
      table.setAttribute("id", "table");
      let thead = document.createElement("thead");
      table.appendChild(thead);
      leagueTable.appendChild(table);

      // Function to create sortable column headers
      const createSortableHeader = (key, text, thead) => {
        let th = document.createElement("th");
        th.setAttribute("data-key", key);
        th.innerText = text;
        th.style.cursor = "pointer";

        // Event listener to sort when clicked
        th.addEventListener("click", () => {
          const tableBody = document.querySelector("#table tbody");
          const rows = Array.from(tableBody.querySelectorAll("tr"));
          const ascending = th.getAttribute("data-ascending") === "true";

          rows.sort((rowA, rowB) => {
            const cellA = rowA.querySelector(`td[data-key='${key}']`).innerText;
            const cellB = rowB.querySelector(`td[data-key='${key}']`).innerText;

            if (!isNaN(cellA) && !isNaN(cellB)) {
              // Numeric sorting
              return ascending ? cellA - cellB : cellB - cellA;
            } else {
              // String sorting
              return ascending
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
            }
          });

          // Append sorted rows back
          rows.forEach((row) => tableBody.appendChild(row));

          // Toggle sorting direction
          th.setAttribute("data-ascending", !ascending);
        });

        thead.appendChild(th);
      };

      // Add headers
      createSortableHeader("rank", "Pos", thead);
      createSortableHeader("entry_name", "Team", thead);
      createSortableHeader("event_total", "GW" + currentGw, thead);
      createSortableHeader("total", "Total", thead);
      createSortableHeader("toTop", "To Top", thead);
      createSortableHeader("totalTransfers", "xFrs", thead);
      createSortableHeader("chips", "Chips", thead);
      createSortableHeader("totalMinusPoints", "-Points", thead);
      createSortableHeader("bestWeek", "Best GW", thead);
      createSortableHeader("worstWeek", "Worst GW", thead);
      createSortableHeader("CurrentRank", "Current Rank", thead);
      createSortableHeader("bestOverallRankWeek", "Best OR", thead);
      createSortableHeader("seasons", "Years Active", thead);
      createSortableHeader("lastYear", "Last Year", thead);
      createSortableHeader("HistoricAvg", "Historic Avg", thead);

      // Create table body
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);

      league.forEach((element) => {
        //console.log(element);
        let tr = document.createElement("tr");

        // Add sortable data-key attributes to cells
        const createCell = (key, value) => {
          let td = document.createElement("td");
          td.setAttribute("data-key", key);
          td.innerText = value;
          return td;
        };

        tr.appendChild(createCell("rank", element.rank));
        tr.appendChild(
          createCell(
            "entry_name",
            `${element.entry_name} (${element.player_name})`
          )
        );
        tr.appendChild(createCell("event_total", element.event_total));
        tr.appendChild(createCell("total", element.total));
        tr.appendChild(createCell("toTop", firstPlace - element.total));
        tr.appendChild(createCell("totalTransfers", element.totalTransfers));
        tr.appendChild(createCell("chips", element.chips.length));
        tr.appendChild(
          createCell("totalMinusPoints", element.totalMinusPoints)
        );
        tr.appendChild(
          createCell(
            "bestWeek",
            `${element.bestWeek.event} (${element.bestWeek.points})`
          )
        );
        tr.appendChild(
          createCell(
            "worstWeek",
            `${element.worstWeek.event} (${element.worstWeek.points})`
          )
        );
        tr.appendChild(
          createCell(
            "Current Rank",
            `${element.everyGw[
              element.everyGw.length - 1
            ].overall_rank.toLocaleString()}`
          )
        );
        tr.appendChild(
          createCell(
            "bestOverallRankWeek",
            `${element.worstOverallRankWeek.overall_rank.toLocaleString()}(GW${
              element.worstOverallRankWeek.event
            })`
          )
        );
        tr.appendChild(createCell("seasons", element.seasons));
        if (element.past.length > 0) {
          tr.appendChild(
            createCell(
              "lastYear",
              element.past[element.past.length - 1].total_points
            )
          );
        } else {
          tr.appendChild(createCell("lastYear", "N/A"));
        }
        const historicAvgArray = [];
        if (element.past.length > 0) {
          for (let i = 0; i < element.past.length; i++) {
            historicAvgArray.push(element.past[i].total_points);
          }
        }
        // create a variable for the sum and initialize it
        let sum = 0;
        // iterate over each item in the array
        for (let i = 0; i < historicAvgArray.length; i++) {
          sum += historicAvgArray[i];
        }
        if (historicAvgArray.length > 0) {
          tr.appendChild(
            createCell("HistoricAvg", Math.round(sum / historicAvgArray.length))
          );
        } else {
          tr.appendChild(createCell("HistoricAvg", "N/A"));
        }

        tbody.appendChild(tr);
      });

      // Stop and clean up the loading bar
      loader.stop();
      loader.remove();
      // add call to action half way through the table
      insertAdHalfway();
    } else {
      console.error("Not yet.");
    }
  } catch (error) {
    console.error("Error waiting for the: ", error);
  }
}

// CHIPS TABLE
async function showChips1() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = new LoadingBar(app);
  loader.start();

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Chip Usage`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  try {
    if (createLeaguePromise) {
      await createLeaguePromise;

      league.forEach((element, index) => {
        console.log(element);
        const team = document.createElement("div");
        team.id = "chip-card";

        // Team header
        const teamHeader = document.createElement("div");
        teamHeader.id = "chip-card-header";
        // Add team and player names
        const entry = document.createElement("div");
        entry.innerHTML = `
      <strong style="font-size:1rem">${element.entry_name}</strong>
      <div style="font-size:0.7rem"> - ${element.player_name}</div>
    `;
        teamHeader.appendChild(entry);
        team.appendChild(teamHeader);

        const chipOrder = [
          "wildcard",
          "bboost",
          "3xc",
          "wildcard",
          "freehit",
          "manager",
        ];

        const allChips = document.createElement("div");
        allChips.id = "all-chips";

        let wildcardCount = 0; // To track which wildcard we're processing

        chipOrder.forEach((chipType) => {
          let chipData;

          if (chipType === "wildcard") {
            // Get all wildcard chips
            const wildcardChips = element.chips.filter(
              (chip) => chip.name === "wildcard"
            );
            chipData = wildcardChips[wildcardCount] || null; // Assign the correct wildcard
            wildcardCount++; // Move to the next wildcard for the second occurrence
          } else {
            chipData = element.chips.find((chip) => chip.name === chipType);
          }

          const chip = document.createElement("div");
          const chipLogo = document.createElement("img");
          chipLogo.src = `https://fpltoolbox.com/wp-content/uploads/2025/03/${chipType}.webp`;
          chipLogo.style.maxWidth = "40px";

          const chipName = document.createElement("div");
          chipName.innerHTML = convertChipName(chipType); // Always show chip name

          const chipGw = document.createElement("div");
          chipGw.id = "chip-used-gameweek";
          chipGw.innerHTML = chipData ? `GW${chipData.gw}` : "Play"; // "Play" for unused chips

          chip.appendChild(chipLogo);
          chip.appendChild(chipName);
          chip.appendChild(chipGw);

          if (!chipData) {
            chip.classList.add("unused-chip");
          } else {
            chip.classList.add("used-chip");
          }

          allChips.appendChild(chip);
        });

        team.appendChild(allChips);

        app.appendChild(team);
      });

      loader.stop();
      loader.remove();
      insertAdHalfway();
    } else {
      console.error("Not yet.");
    }
  } catch (error) {
    console.error("Error waiting for the: ", error);
  }
}
// Include Chart.js in your HTML file if not already added
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

async function showChips() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = new LoadingBar(app);
  loader.start();

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Chip Usage`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  try {
    if (createLeaguePromise) {
      await createLeaguePromise;

      // CONTAINER FOR TEAM-BY-TEAM CHIP USAGE
      const teamContainer = document.createElement("div");
      teamContainer.style.display = "flex";
      teamContainer.style.flexWrap = "wrap";
      teamContainer.style.justifyContent = "center";
      teamContainer.style.gap = "20px";
      app.appendChild(teamContainer);

      // CHIP USAGE COUNT FOR PIE CHARTS
      const chipTypes = ["freehit", "manager", "bboost", "3xc"];
      const chipUsage = {
        freehit: { used: 0, unused: 0 },
        manager: { used: 0, unused: 0 },
        bboost: { used: 0, unused: 0 },
        "3xc": { used: 0, unused: 0 },
      };

      league.forEach((element) => {
        console.log(element);
        const team = document.createElement("div");
        team.id = "chip-card";

        // Team header
        const teamHeader = document.createElement("div");
        teamHeader.id = "chip-card-header";

        // Add team and player names
        const entry = document.createElement("div");
        entry.innerHTML = `
          <strong style="font-size:1rem">${element.entry_name}</strong>
          <div style="font-size:0.7rem"> - ${element.player_name}</div>
        `;
        teamHeader.appendChild(entry);
        team.appendChild(teamHeader);

        const chipOrder = [
          "wildcard",
          "bboost",
          "3xc",
          "wildcard",
          "freehit",
          "manager",
        ];
        const allChips = document.createElement("div");
        allChips.id = "all-chips";

        let wildcardCount = 0; // To track which wildcard we're processing

        chipOrder.forEach((chipType) => {
          let chipData;

          if (chipType === "wildcard") {
            // Get all wildcard chips
            const wildcardChips = element.chips.filter(
              (chip) => chip.name === "wildcard"
            );
            chipData = wildcardChips[wildcardCount] || null; // Assign the correct wildcard
            wildcardCount++; // Move to the next wildcard for the second occurrence
          } else {
            chipData = element.chips.find((chip) => chip.name === chipType);
          }

          const chip = document.createElement("div");
          const chipLogo = document.createElement("img");
          chipLogo.src = `https://fpltoolbox.com/wp-content/uploads/2025/03/${chipType}.webp`;
          chipLogo.style.maxWidth = "40px";

          const chipName = document.createElement("div");
          chipName.innerHTML = convertChipName(chipType); // Always show chip name

          const chipGw = document.createElement("div");
          chipGw.id = "chip-used-gameweek";
          chipGw.innerHTML = chipData ? `GW${chipData.gw}` : "Play"; // "Play" for unused chips

          chip.appendChild(chipLogo);
          chip.appendChild(chipName);
          chip.appendChild(chipGw);

          if (!chipData) {
            chip.classList.add("unused-chip");
          } else {
            chip.classList.add("used-chip");
          }

          allChips.appendChild(chip);
        });

        team.appendChild(allChips);
        teamContainer.appendChild(team);

        // Count chips for pie charts
        chipTypes.forEach((chip) => {
          const hasUsed = element.chips.some((c) => c.name === chip);
          chipUsage[chip][hasUsed ? "used" : "unused"]++;
        });
      });

      // ADD PIE CHARTS BELOW TEAM USAGE
      const chartHeader = document.createElement("h6");
      chartHeader.innerText = "Overall Chip Usage Statistics";
      chartHeader.style.textAlign = "center";
      chartHeader.style.marginTop = "20px";
      app.appendChild(chartHeader);

      const chartContainer = document.createElement("div");
      chartContainer.style.display = "grid";
      chartContainer.style.gridTemplateColumns =
        "repeat(auto-fit, minmax(200px, 1fr))";
      chartContainer.style.gap = "20px";
      chartContainer.style.justifyContent = "center";
      chartContainer.style.marginTop = "10px";
      app.appendChild(chartContainer);

      chipTypes.forEach((chip) => {
        const chartDiv = document.createElement("div");
        chartDiv.style.textAlign = "center";

        const canvas = document.createElement("canvas");
        canvas.id = `chart-${chip}`;
        chartDiv.appendChild(canvas);

        const chartTitle = document.createElement("p");
        chartTitle.innerText = convertChipName(chip);
        chartTitle.style.fontWeight = "bold";
        chartTitle.style.marginBottom = "5px";
        chartDiv.appendChild(chartTitle);

        chartContainer.appendChild(chartDiv);
      });

      // RENDER CHARTS
      chipTypes.forEach((chip) => {
        const ctx = document.getElementById(`chart-${chip}`).getContext("2d");
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Used", "Not Used"],
            datasets: [
              {
                data: [chipUsage[chip].used, chipUsage[chip].unused],
                backgroundColor: ["#36003B", "#05E8F8"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
            },
          },
        });
      });

      loader.stop();
      loader.remove();
      insertAdHalfway();
    } else {
      console.error("Not yet.");
    }
  } catch (error) {
    console.error("Error waiting for the: ", error);
  }
}

// GAMEWEEK TABLE

async function showGW() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const loader = new LoadingBar(app);
  loader.start();
  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Gameweek Activity`;
  tableHeader.style.textAlign = "center";
  leagueTable.appendChild(tableHeader);

  app.appendChild(leagueTable);

  try {
    if (createLeaguePromise) {
      await createLeaguePromise;
      console.log("Finally, it's finished.");
      let table = document.createElement("table");
      table.setAttribute("id", "table");
      let thead = document.createElement("thead");
      table.appendChild(thead);
      leagueTable.appendChild(table);
      //Columns
      let pos = document.createElement("th");
      pos.setAttribute("class", "first");

      pos.innerText = "Pos";
      thead.appendChild(pos);

      let tm = document.createElement("th");
      tm.innerText = "Team";
      thead.appendChild(tm);
      createColumnHeader("activeChip", "Chip", thead);
      createColumnHeader("captain", "Captain", thead);
      createColumnHeader("score", "Score", thead);
      createColumnHeader("total", "Total", thead);
      createColumnHeader("xfrs", "xfrs", thead);
      createColumnHeader("minus", "Minus P", thead);
      createColumnHeader("vice", "Vice", thead);
      createColumnHeader("bench", "Bench P", thead);
      //createColumnHeader("autoSubs", "Auto Subs", thead);

      // Create table body
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
      //console.log(league);
      league.forEach((element) => {
        //console.log(element);
        let tr = document.createElement("tr");
        tr.setAttribute("class", "table-row");
        if (element.entry == theUser.info.team_id) {
          tr.setAttribute("class", "current-user");
        }
        let rankMovement = document.createElement("i");
        if (element.rank == element.last_rank) {
          rankMovement.innerText = "●";
          rankMovement.setAttribute("class", "rank-equal");
        }
        if (element.rank < element.last_rank) {
          rankMovement.innerText = "▲";
          rankMovement.setAttribute("class", "rank-up");
        }

        if (element.rank > element.last_rank) {
          rankMovement.innerText = "▼";
          rankMovement.setAttribute("class", "rank-down");
        }

        let pos = document.createElement("td");
        pos.innerText = element.rank;
        pos.appendChild(rankMovement);
        tr.appendChild(pos);

        let team = document.createElement("td");
        let name = document.createElement("div");
        name.setAttribute("class", "team-name");
        name.innerText = element.entry_name;
        let manager = document.createElement("div");
        manager.setAttribute("class", "manager-name");
        manager.innerText = element.player_name.slice(0, 40);
        team.appendChild(name);
        team.appendChild(manager);
        tr.appendChild(team);

        if (element.currentWeek[0].active_chip) {
          let activeChip = document.createElement("td");

          activeChip.innerText = convertChipName(
            element.currentWeek[0].active_chip
          );
          activeChip.setAttribute(
            "class",
            convertChipName(element.currentWeek[0].active_chip)
          );

          tr.appendChild(activeChip);
        } else {
          let activeChip = document.createElement("td");

          activeChip.innerHTML = '<span class="material-icons"> </span>';

          tr.appendChild(activeChip);
        }

        let captain = document.createElement("td");
        element.currentWeek[0].picks.forEach((player) => {
          if (player.is_captain == true) {
            captain.innerText =
              getPlayerWebName(player.element) +
              " (" +
              getPlayerScore(player.element) * 2 +
              ")";
          }
          if (
            player.is_captain == true &&
            convertChipName(element.currentWeek[0].active_chip) == "TC"
          ) {
            captain.innerText =
              getPlayerWebName(player.element) +
              " (" +
              getPlayerScore(player.element) * 3 +
              ")";
          }
        });
        tr.appendChild(captain);

        let score = document.createElement("td");
        score.innerText = element.event_total;
        tr.appendChild(score);

        let total = document.createElement("td");
        total.innerText = element.total;
        tr.appendChild(total);

        let transfers = document.createElement("td");
        transfers.innerText =
          element.everyGw[element.everyGw.length - 1].transfers;
        tr.appendChild(transfers);

        let minus = document.createElement("td");
        minus.innerText =
          element.everyGw[element.everyGw.length - 1].transfers_cost;
        if (element.everyGw[element.everyGw.length - 1].transfers_cost > 0) {
          minus.style.color = "red";
          minus.style.fontSize = "20px";
        }

        tr.appendChild(minus);

        let viceCaptain = document.createElement("td");
        element.currentWeek[0].picks.forEach((player) => {
          if (player.is_vice_captain == true) {
            viceCaptain.innerText =
              getPlayerWebName(player.element) +
              " (" +
              getPlayerScore(player.element) * 1 +
              ")";
          }
        });

        tr.appendChild(viceCaptain);

        let bench = document.createElement("td");
        bench.innerText =
          element.everyGw[element.everyGw.length - 1].bench_points;
        tr.appendChild(bench);

        // let autoSubs = document.createElement("td");
        // autoSubs.innerText = element.currentWeek[0].automatic_subs.length;
        // tr.appendChild(autoSubs);

        document.getElementById("table").appendChild(tr);
        tbody.appendChild(tr);
        // add call to action half way through the table
      });
      insertAdHalfway();
      // Stop and clean up the loading bar
      loader.stop();
      loader.remove();
    } else {
      console.error("Not yet.");
    }
  } catch (error) {
    console.error("Error waiting for the: ", error);
  }
}

///////////////////////////Rival Differences Compare START////////////////

async function showRivalDiff() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const loader = new LoadingBar(app);
  loader.start();
  let table = document.createElement("table");
  table.setAttribute("id", "table");

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Tap Team To Compare`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  let thead = document.createElement("thead");
  app.appendChild(tableHeader);

  app.appendChild(table);
  await createLeaguePromise;
  fetch(
    BASE_URL +
      "/entry/" +
      theUser.info.team_id +
      "/event/" +
      currentGw +
      "/picks/"
  )
    .then((res) => res.json())
    .then((data) => {
      myTeam = data;
      //Create Table Columns
      let pos = document.createElement("th");
      pos.setAttribute("class", "first");
      pos.innerText = "Pos";
      thead.appendChild(pos);
      createColumnHeader("teamName", "Team", thead);
      createColumnHeader("captain", "Captain", thead);
      createColumnHeader("score", "GW" + currentGw, thead);
      // Create table body
      const tbody = document.createElement("tbody");
      tbody.id = "league-table";
      table.appendChild(tbody);

      //Populate Table
      league.forEach((element) => {
        //console.log(element)
        let tr = document.createElement("tr");
        tr.setAttribute("class", "table-row");
        if (element.entry == theUser.info.team_id) {
          tr.setAttribute("class", "current-user");
        }
        let rankMovement = document.createElement("i");
        if (element.rank == element.last_rank) {
          rankMovement.innerText = "●";
          rankMovement.setAttribute("class", "rank-equal");
        }
        if (element.rank < element.last_rank) {
          rankMovement.innerText = "▲";
          rankMovement.setAttribute("class", "rank-up");
        }

        if (element.rank > element.last_rank) {
          rankMovement.innerText = "▼";
          rankMovement.setAttribute("class", "rank-down");
        }

        let pos = document.createElement("td");

        pos.innerText = element.rank;
        pos.appendChild(rankMovement);
        tr.appendChild(pos);

        let team = document.createElement("td");
        let name = document.createElement("div");
        name.setAttribute("class", "team-name");
        name.innerText = element.entry_name;
        let manager = document.createElement("div");
        manager.setAttribute("class", "manager-name");
        manager.innerText = element.player_name.slice(0, 40);
        team.appendChild(name);
        team.appendChild(manager);
        tr.appendChild(team);
        console.log(element);
        let captain = document.createElement("td");
        element.currentWeek[0].picks.forEach((player) => {
          if (player.is_captain == true) {
            captain.innerText =
              getPlayerWebName(player.element) +
              " (" +
              getPlayerScore(player.element) * 2 +
              ")";
          }
          if (
            player.is_captain == true &&
            convertChipName(element.currentWeek[0].active_chip) == "TC"
          ) {
            captain.innerText =
              getPlayerWebName(player.element) +
              " (" +
              getPlayerScore(player.element) * 3 +
              ")";
          }
        });
        tr.appendChild(captain);

        let score = document.createElement("td");
        score.innerText = element.event_total;
        tr.appendChild(score);

        tr.addEventListener("click", function () {
          // specify the action to take when the div is clicked
          getUniquePlayers(myTeam, element);
        });

        //document.getElementById("table").appendChild(tr);
        tbody.appendChild(tr);
      });
    })
    .then(() => {
      insertAdHalfway();

      loader.remove();
    });
}

async function getUniquePlayers(team1, team2) {
  //console.log(team1);
  //console.log(team2);

  if (document.getElementById("pitches")) {
    document.getElementById("pitches").remove();
    document.getElementById("comparison-heading").remove();
    document.getElementById("comparison-text").remove();
    document.getElementById("share-button").remove();
  }

  const comparisonHeadingDiv = document.createElement("div");
  comparisonHeadingDiv.setAttribute("id", "comparison-heading");
  app.appendChild(comparisonHeadingDiv);

  const comparisonTextDiv = document.createElement("div");
  comparisonTextDiv.setAttribute("id", "comparison-text");
  app.appendChild(comparisonTextDiv);

  const pitches = document.createElement("div");
  pitches.setAttribute("id", "pitches");
  app.appendChild(pitches);

  const pitch1 = document.createElement("div");
  pitch1.setAttribute("id", "pitch1");
  pitches.appendChild(pitch1);

  const pitch2 = document.createElement("div");
  pitch2.setAttribute("id", "pitch2");
  pitches.appendChild(pitch2);

  const gwIdentifier = document.createElement("div");
  gwIdentifier.setAttribute("id", "gameweek-identifier");

  //Team A

  const myScore = document.createElement("div");
  myScore.innerHTML = team1.entry_history.points;
  myScore.setAttribute("id", "my-score");
  myScore.classList.add("comparison-score");

  myScore.appendChild(gwIdentifier);

  pitch1.appendChild(myScore);

  const keeper = document.createElement("div");
  keeper.setAttribute("id", "my-keeper");
  pitch1.appendChild(keeper);

  const defenders = document.createElement("div");
  defenders.setAttribute("id", "my-defenders");
  pitch1.appendChild(defenders);

  const midfielders = document.createElement("div");
  midfielders.setAttribute("id", "my-midfielders");
  pitch1.appendChild(midfielders);

  const strikers = document.createElement("div");
  strikers.setAttribute("id", "my-strikers");
  pitch1.appendChild(strikers);

  const bench = document.createElement("div");
  bench.setAttribute("id", "my-bench");
  pitch1.appendChild(bench);

  const team1name = document.createElement("div");
  team1name.setAttribute("id", "team1name");
  pitch1.appendChild(team1name);

  //Team B

  const myScore2 = document.createElement("div");
  myScore2.innerHTML = team2.event_total;
  myScore2.setAttribute("id", "my-score2");
  myScore2.classList.add("comparison-score");

  myScore2.appendChild(gwIdentifier);

  pitch2.appendChild(myScore2);

  const keeper2 = document.createElement("div");
  keeper2.setAttribute("id", "my-keeper2");
  pitch2.appendChild(keeper2);

  const defenders2 = document.createElement("div");
  defenders2.setAttribute("id", "my-defenders2");
  pitch2.appendChild(defenders2);

  const midfielders2 = document.createElement("div");
  midfielders2.setAttribute("id", "my-midfielders2");
  pitch2.appendChild(midfielders2);

  const strikers2 = document.createElement("div");
  strikers2.setAttribute("id", "my-strikers2");
  pitch2.appendChild(strikers2);

  const bench2 = document.createElement("div");
  bench2.setAttribute("id", "my-bench2");
  pitch2.appendChild(bench2);

  const team2name = document.createElement("div");
  team2name.setAttribute("id", "team2name");
  pitch2.appendChild(team2name);

  //////

  //console.log(team1)
  //console.log(team2)

  t1Array = [];
  t2Array = [];

  team1.picks.forEach((pick) => t1Array.push(pick.element));
  team2.currentWeek[0].picks.forEach((pick) => t2Array.push(pick.element));

  let difference1Text = [];
  const difference1 = t1Array.filter((element) => !t2Array.includes(element));
  difference1.forEach((pick) => difference1Text.push(getPlayerWebName(pick)));

  let difference2Text = [];
  const difference2 = t2Array.filter((element) => !t1Array.includes(element));
  difference2.forEach((pick) => difference2Text.push(getPlayerWebName(pick)));

  setTimeout(() => {
    difference1.forEach((id) => {
      const div = document.getElementById(id);
      if (div) {
        div.classList.add("different-players");
      }
    });
    difference2.forEach((id) => {
      const div = document.getElementById(id);
      if (div) {
        div.classList.add("different-players");
      }
    });
  }, "1000");

  const comparisonHeadingText = loggedInTeamName + " v " + team2.entry_name;
  const h6Div = document.createElement("h6");
  const h6Content = document.createTextNode(comparisonHeadingText);
  h6Div.appendChild(h6Content);
  const currenth6Div = document.getElementById("comparison-heading");
  currenth6Div.appendChild(h6Div);

  const comparisonText =
    "These are the players that are going to make a difference for you against " +
    team2.entry_name +
    ": " +
    difference1Text.join(", ");
  // create a new div element
  const comparisonDiv = document.createElement("p");
  // and give it some content
  const comparisonContent = document.createTextNode(comparisonText);
  // add the text node to the newly created div
  comparisonDiv.appendChild(comparisonContent);
  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("comparison-text");
  currentDiv.appendChild(comparisonDiv);

  const comparisonText2 =
    "The players that might hurt you in this battle are:  " +
    difference2Text.join(", ") +
    " Good luck!";
  // create a new div element
  const comparisonDiv2 = document.createElement("p");
  // and give it some content
  const comparisonContent2 = document.createTextNode(comparisonText2);
  // add the text node to the newly created div
  comparisonDiv2.appendChild(comparisonContent2);
  // add the newly created element and its content into the DOM

  currentDiv.appendChild(comparisonDiv2);

  const shareData = {
    title: "Team Comparison",
    text:
      "Hey, the players that I've got that you haven't are: " +
      " \n" +
      difference1Text.join(", ") +
      " \n\n" +
      "The players that you've got that I haven't are: " +
      difference2Text.join(", ") +
      "\n\n" +
      " You can compare your team too by clicking the link",
    url: "https://fpltoolbox.com/team-comparison",
  };

  const shareButton = document.createElement("button");
  shareButton.innerText = "Share";
  shareButton.setAttribute("id", "share-button");

  // Share must be triggered by "user activation"
  shareButton.addEventListener("click", async () => {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });
  document.getElementById("app").append(shareButton);

  //My Team
  let captainPick;
  let viceCaptainPick;
  for (var i = 0; i < team1.picks.length; i++) {
    if (team1.picks[i].is_vice_captain == true) {
      viceCaptainPick = team1.picks[i].element;
    }

    if (team1.picks[i].is_captain == true && team1.picks[i].position <= 11) {
      captainPick = team1.picks[i].element;

      const card = document.createElement("div");
      card.setAttribute("id", team1.picks[i].element);
      card.setAttribute("class", "player");
      const cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-img");
      const playerName = document.createElement("p");
      playerName.setAttribute("class", "my-captain-name");
      if (team1.picks[i].multiplier == 3) {
        playerName.setAttribute("class", "my-triple-captain-name");
      }
      const tP = document.createElement("p");
      tP.setAttribute("class", "my-player-xp");

      cardImg.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(team1.picks[i].element).slice(0, -3) +
        "png";
      playerName.innerHTML = getPlayerWebName(team1.picks[i].element).slice(
        0,
        10
      );
      tP.innerHTML =
        getPlayerScore(team1.picks[i].element) * team1.picks[i].multiplier;
      card.appendChild(cardImg);
      card.appendChild(playerName);
      card.appendChild(tP);
      if (getPlayerType(team1.picks[i].element) == 1) {
        document.getElementById("my-keeper").appendChild(card);
      }
      if (getPlayerType(team1.picks[i].element) == 2) {
        document.getElementById("my-defenders").appendChild(card);
      }
      if (getPlayerType(team1.picks[i].element) == 3) {
        document.getElementById("my-midfielders").appendChild(card);
      }
      if (getPlayerType(team1.picks[i].element) == 4) {
        document.getElementById("my-strikers").appendChild(card);
      }
    }
    if (team1.picks[i].is_captain == false && team1.picks[i].position <= 11) {
      const card = document.createElement("div");
      card.setAttribute("class", "player");
      card.setAttribute("id", team1.picks[i].element);
      const cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-img");
      const playerName = document.createElement("p");
      playerName.setAttribute("class", "my-player-name");

      const tP = document.createElement("p");
      tP.setAttribute("class", "my-player-xp");
      console.log(getPlayerPhoto(team1.picks[i].element).slice(0, -3));
      cardImg.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(team1.picks[i].element).slice(0, -3) +
        "png";
      playerName.innerHTML = getPlayerWebName(team1.picks[i].element).slice(
        0,
        10
      );
      tP.innerHTML = getPlayerScore(team1.picks[i].element);
      card.appendChild(cardImg);
      card.appendChild(playerName);
      card.appendChild(tP);
      if (getPlayerType(team1.picks[i].element) == 1) {
        document.getElementById("my-keeper").appendChild(card);
      }
      if (getPlayerType(team1.picks[i].element) == 2) {
        document.getElementById("my-defenders").appendChild(card);
      }
      if (getPlayerType(team1.picks[i].element) == 3) {
        document.getElementById("my-midfielders").appendChild(card);
      }
      if (getPlayerType(team1.picks[i].element) == 4) {
        document.getElementById("my-strikers").appendChild(card);
      }
    }

    //Benched Players
    if (team1.picks[i].position > 11 && team1.picks[i].position < 16) {
      const card = document.createElement("div");
      card.setAttribute("class", "player");
      card.setAttribute("id", team1.picks[i].element);
      const cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-img");
      const playerName = document.createElement("p");
      playerName.setAttribute("class", "my-player-name");
      const tP = document.createElement("p");
      tP.setAttribute("class", "my-player-xp");

      cardImg.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(team1.picks[i].element).slice(0, -3) +
        "png";
      playerName.innerHTML = getPlayerWebName(team1.picks[i].element).slice(
        0,
        10
      );
      tP.innerHTML = getPlayerScore(team1.picks[i].element);

      card.appendChild(cardImg);
      card.appendChild(playerName);
      card.appendChild(tP);
      document.getElementById("my-bench").appendChild(card);
    }
    //Manager
    if (team1.picks[i].position == 16) {
      console.log(team1.picks[i]);
      const card = createManagerCard(
        team1.picks[i].element,
        getPlayerScore(team1.picks[i].element),
        false,
        false,
        false
      );
      card.style.transform = "scale(1.2)";
      card.style.marginLeft = "20px";
      document.getElementById("my-strikers").append(card);
    }
  }

  document.getElementById("team1name").innerHTML = loggedInTeamName;

  //Their Team
  let captainPick2;
  let viceCaptainPick2;
  for (var i = 0; i < team2.currentWeek[0].picks.length; i++) {
    if (team2.currentWeek[0].picks[i].is_vice_captain == true) {
      viceCaptainPick2 = team2.currentWeek[0].picks[i].element;
    }

    if (
      team2.currentWeek[0].picks[i].is_captain == true &&
      team2.currentWeek[0].picks[i].position <= 11
    ) {
      captainPick2 = team2.currentWeek[0].picks[i].element;

      const card = document.createElement("div");
      card.setAttribute("id", team2.currentWeek[0].picks[i].element);
      card.setAttribute("class", "player");
      const cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-img");
      const playerName = document.createElement("p");
      playerName.setAttribute("class", "my-captain-name");
      if (team2.currentWeek[0].picks[i].multiplier == 3) {
        playerName.setAttribute("class", "my-triple-captain-name");
      }

      const tP = document.createElement("p");
      tP.setAttribute("class", "my-player-xp");

      cardImg.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(team2.currentWeek[0].picks[i].element).slice(0, -3) +
        "png";
      playerName.innerHTML = getPlayerWebName(
        team2.currentWeek[0].picks[i].element
      ).slice(0, 10);
      tP.innerHTML =
        getPlayerScore(team2.currentWeek[0].picks[i].element) *
        team2.currentWeek[0].picks[i].multiplier;
      card.appendChild(cardImg);
      card.appendChild(playerName);
      card.appendChild(tP);
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 1) {
        document.getElementById("my-keeper2").appendChild(card);
      }
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 2) {
        document.getElementById("my-defenders2").appendChild(card);
      }
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 3) {
        document.getElementById("my-midfielders2").appendChild(card);
      }
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 4) {
        document.getElementById("my-strikers2").appendChild(card);
      }
    }
    if (
      team2.currentWeek[0].picks[i].is_captain == false &&
      team2.currentWeek[0].picks[i].position <= 11
    ) {
      const card = document.createElement("div");
      card.setAttribute("class", "player");
      card.setAttribute("id", team2.currentWeek[0].picks[i].element);
      const cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-img");
      const playerName = document.createElement("p");
      playerName.setAttribute("class", "my-player-name");

      const tP = document.createElement("p");
      tP.setAttribute("class", "my-player-xp");

      cardImg.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(team2.currentWeek[0].picks[i].element).slice(0, -3) +
        "png";
      playerName.innerHTML = getPlayerWebName(
        team2.currentWeek[0].picks[i].element
      ).slice(0, 10);
      tP.innerHTML = getPlayerScore(team2.currentWeek[0].picks[i].element);
      card.appendChild(cardImg);
      card.appendChild(playerName);
      card.appendChild(tP);
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 1) {
        document.getElementById("my-keeper2").appendChild(card);
      }
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 2) {
        document.getElementById("my-defenders2").appendChild(card);
      }
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 3) {
        document.getElementById("my-midfielders2").appendChild(card);
      }
      if (getPlayerType(team2.currentWeek[0].picks[i].element) == 4) {
        document.getElementById("my-strikers2").appendChild(card);
      }
    }

    //Benched Players
    if (
      team2.currentWeek[0].picks[i].position > 11 &&
      team2.currentWeek[0].picks[i].position < 16
    ) {
      const card = document.createElement("div");
      card.setAttribute("class", "player");
      card.setAttribute("id", team2.currentWeek[0].picks[i].element);
      const cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-img");
      const playerName = document.createElement("p");
      playerName.setAttribute("class", "my-player-name");
      const tP = document.createElement("p");
      tP.setAttribute("class", "my-player-xp");

      cardImg.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(team2.currentWeek[0].picks[i].element).slice(0, -3) +
        "png";
      playerName.innerHTML = getPlayerWebName(
        team2.currentWeek[0].picks[i].element
      ).slice(0, 10);
      tP.innerHTML = getPlayerScore(team2.currentWeek[0].picks[i].element);

      card.appendChild(cardImg);
      card.appendChild(playerName);
      card.appendChild(tP);
      document.getElementById("my-bench2").appendChild(card);
    }
    //Manager
    if (team2.currentWeek[0].picks[i].position == 16) {
      const card = createManagerCard(
        team2.currentWeek[0].picks[i].element,
        getPlayerScore(team2.currentWeek[0].picks[i].element),
        false,
        false,
        false
      );
      card.style.transform = "scale(1.2)";
      card.style.marginRight = "20px";
      document.getElementById("my-strikers2").prepend(card);
    }
  }

  document.getElementById("team2name").innerHTML = team2.entry_name;
  addCaptainBadge();
  window.location.href = "#comparison-heading";
}
//////////////////////////Rival Differences Comapre END //////////////////

// CAPTAINS TABLE
async function showCaptains() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const loader = createLoader();
  app.appendChild(loader);

  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Gameweek ${currentGw} Captains`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  const leagueTable = document.createElement("table");
  leagueTable.setAttribute("id", "table");
  app.appendChild(leagueTable);
  const tbody = document.createElement("tbody");

  try {
    if (createLeaguePromise) {
      await createLeaguePromise;

      // Calculate captain percentages
      const captainCounts = {};
      league.forEach((element) => {
        const captain = element.currentWeek[0].picks.find(
          (player) => player.is_captain
        );
        if (captain) {
          const playerName = getPlayerWebName(captain.element);
          captainCounts[playerName] = (captainCounts[playerName] || 0) + 1;
        }
      });

      const totalPlayers = league.length;
      const captainPercentages = Object.entries(captainCounts).map(
        ([player, count]) => ({
          player,
          percentage: ((count / totalPlayers) * 100).toFixed(1),
        })
      );

      // Add summary to the top of the captain text
      const summaryText = captainPercentages
        .sort((a, b) => b.percentage - a.percentage)
        .map(({ player, percentage }) => `${player}: ${percentage}%`)
        .join("\n");

      const summaryHeader = document.createElement("p");
      summaryHeader.innerText = `Captain Picks Summary:\n${summaryText}`;
      summaryHeader.style.textAlign = "center";
      summaryHeader.style.marginBottom = "20px";
      tbody.insertBefore(summaryHeader, tbody[0]);

      // Rest of the code for generating rows
      let captainText = [
        `${leagueName} \n Gameweek ${currentGw} captain picks\n`,
        `Summary:\n${summaryText}\n\n`,
      ];

      league.forEach((element, index) => {
        const team = document.createElement("div");
        team.id = "team-card";
        team.classList.add("captain-card");

        // Team header
        const teamHeader = document.createElement("div");
        teamHeader.id = "team-header";

        // Add team and player names
        const entry = document.createElement("div");
        entry.innerHTML = `
          <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
          <div style="font-size:0.7rem">${element.player_name}</div>
        `;
        teamHeader.appendChild(entry);

        team.appendChild(teamHeader);

        let cardCaptain;
        let cardViceCaptain;

        element.currentWeek[0].picks.forEach((player) => {
          if (player.is_captain == true) {
            cardCaptain = createPlayerCard(
              player.element,
              getPlayerScore(player.element),
              true,
              false,
              false
            );
            captainText.push(
              `${element.entry_name}: ${getPlayerWebName(player.element)}\n`
            );
          }
        });

        let viceCaptain = document.createElement("img");
        viceCaptain.setAttribute("class", "vice-captain");

        element.currentWeek[0].picks.forEach((player) => {
          if (player.is_vice_captain == true) {
            cardViceCaptain = createPlayerCard(
              player.element,
              getPlayerScore(player.element),
              false,
              true,
              false
            );
          }
        });
        const captainsDiv = document.createElement("div");
        captainsDiv.id = "captains-container";
        captainsDiv.appendChild(cardCaptain);
        captainsDiv.appendChild(cardViceCaptain);

        team.appendChild(captainsDiv);

        app.appendChild(team);
      });
      captainText.push(`Check your mini league for free right here:\n`);
      leagueTable.appendChild(tbody);
      insertAdManually("#team-card");
      addCaptainBadge();
      const shareData = {
        title: `${leagueName} \n Gameweek captain picks`,
        text: captainText.join("") + " \n",
        url: "https://fpltoolbox.com/mini-league-captains",
      };

      const shareButton = document.createElement("button");
      shareButton.innerText = "Share Captains";
      shareButton.setAttribute("id", "share-button");

      shareButton.addEventListener("click", async () => {
        try {
          await navigator.share(shareData);
          console.log("mini-league shared successfully");
        } catch (err) {
          console.log(`Error: ${err}`);
        }
      });
      document.getElementById("app").append(shareButton);
      loader.remove();
    } else {
      console.error("Not yet.");
    }
  } catch (error) {
    console.error("Error waiting for the: ", error);
  }
}

// My Season Summary
async function fetchSeasonData(urls) {
  const seasonData = [];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      seasonData.push(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return seasonData;
}
async function showMySeasonSummary() {
  // Clear previous content
  const app = document.getElementById("app");
  app.innerHTML = "";
  const loader = createLoader();
  app.appendChild(loader);
  // Create data from gw1 to current gw
  const urls = [];
  for (let i = 1; i <= currentGw; i++) {
    urls.push(`${BASE_URL}/entry/${theUser.info.team_id}/event/${i}/picks/`);
  }

  try {
    // Fetch the season data
    const seasonData = await fetchSeasonData(urls);
    console.log(seasonData);
    // Find the weeks with the most and least points on bench
    const { maxPointsOnBench, minPointsOnBench } = seasonData.reduce(
      (result, current) => {
        const pointsOnBench = current.entry_history.points_on_bench;

        if (pointsOnBench > result.maxPointsOnBench.pointsOnBench) {
          result.maxPointsOnBench = {
            event: current.entry_history.event,
            pointsOnBench,
          };
        }

        if (pointsOnBench < result.minPointsOnBench.pointsOnBench) {
          result.minPointsOnBench = {
            event: current.entry_history.event,
            pointsOnBench,
          };
        }

        return result;
      },
      {
        maxPointsOnBench: { pointsOnBench: 0 },
        minPointsOnBench: { pointsOnBench: Infinity },
      }
    );

    // Find the weeks with the most and least points
    const { maxPoints, minPoints } = seasonData.reduce(
      (result, current) => {
        const points = current.entry_history.points;

        // Calculate max points
        if (points > result.maxPoints.points || result.maxPoints.points === 0) {
          result.maxPoints = { event: current.entry_history.event, points };
        }

        // Calculate min points
        if (
          points < result.minPoints.points ||
          result.minPoints.points === Infinity
        ) {
          result.minPoints = { event: current.entry_history.event, points };
        }

        return result;
      },
      {
        maxPoints: { points: -Infinity }, // Use -Infinity for valid comparisons
        minPoints: { points: Infinity }, // Use Infinity for valid comparisons
      }
    );

    // Find the weeks with the highest and lowest team value
    const { maxValue, minValue } = seasonData.reduce(
      (result, current) => {
        const value = current.entry_history.value;

        if (value > result.maxValue.value) {
          result.maxValue = { event: current.entry_history.event, value };
        }

        if (value < result.minValue.value) {
          result.minValue = { event: current.entry_history.event, value };
        }

        return result;
      },
      {
        maxValue: { value: 0 },
        minValue: { value: Infinity },
      }
    );

    const currentValue = seasonData[seasonData.length - 1].entry_history.value;

    // Find the week with the most automatic substitutions and calculate total automatic substitutions
    const automaticSubsData = seasonData.reduce(
      (acc, current) => {
        const automaticSubsCount = current.automatic_subs.length;
        acc.totalAutomaticSubs += automaticSubsCount;

        if (automaticSubsCount > acc.max.automaticSubsCount) {
          acc.max = { event: current.entry_history.event, automaticSubsCount };
        }
        return acc;
      },
      { max: { automaticSubsCount: 0 }, totalAutomaticSubs: 0 }
    );

    let activeChipCount = 0;
    let managerUsed = false; // Track if "manager" has been encountered

    seasonData.forEach((current) => {
      const activeChip = current.active_chip; // Get active_chip

      if (activeChip != null && activeChip != undefined) {
        if (activeChip === "manager") {
          if (!managerUsed) {
            activeChipCount++; // Count "manager" only once
            managerUsed = true; // Mark "manager" as counted
          }
        } else {
          activeChipCount++; // Count other chips normally
        }
      }
    });

    ////// Find most captained and vice captained code start////////////////////////
    // Object to keep track of captain and vice-captain appearances
    const captainCount = {};
    const viceCaptainCount = {};

    // Loop through the seasonData and count captains and vice-captains for each gameweek
    seasonData.forEach((gameweek) => {
      gameweek.picks.forEach((pick) => {
        if (pick.is_captain) {
          // Increment the count for the captain's element ID
          captainCount[pick.element] = (captainCount[pick.element] || 0) + 1;
        }
        if (pick.is_vice_captain) {
          // Increment the count for the vice-captain's element ID
          viceCaptainCount[pick.element] =
            (viceCaptainCount[pick.element] || 0) + 1;
        }
      });
    });

    const createPointsDistributionChart = (results) => {
      const chartContainer = document.createElement("div");
      chartContainer.id = "points-distribution-container";
      chartContainer.style.width = "100%";
      chartContainer.style.height = "300px"; // Adjust height for better visibility

      const canvas = document.createElement("canvas");
      canvas.id = "pointsDistributionChart";

      const chartSummary = document.createElement("p");
      chartSummary.innerText =
        "Analysing your points distribution on the pitch...";
      chartContainer.appendChild(chartSummary);

      chartContainer.appendChild(canvas);

      // Accumulate total points per element type
      const positionPoints = { 1: 0, 2: 0, 3: 0, 4: 0 };
      let totalPoints = 0;

      results.forEach(({ pick, data }) => {
        const { element_type } = pick;
        const points = data.total_points;
        positionPoints[element_type] += points;
        totalPoints += points;
      });

      console.log("Total Points Sum:", totalPoints);
      console.log("Position Type Points:", positionPoints);

      // Position labels
      const positionLabels = { 1: "GKP", 2: "DEF", 3: "MID", 4: "FWD" };
      console.log(colors);
      // Chart.js Data
      const chartData = {
        labels: Object.values(positionLabels),
        datasets: [
          {
            label: "Total Points",
            data: Object.keys(positionPoints).map(
              (type) => positionPoints[type]
            ),
            backgroundColor: [
              colors.cyanNeon,
              colors.greenNeon,
              colors.pinkHot,
              colors.yellowBright,
            ], // GK, DEF, MID, FWD colors
            hoverOffset: 10,
          },
        ],
      };

      // Create Chart
      setTimeout(() => {
        // Timeout to ensure canvas is in DOM
        const ctx = document
          .getElementById("pointsDistributionChart")
          .getContext("2d");
        new Chart(ctx, {
          type: "pie",
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        });
      }, 100);

      return chartContainer;
    };

    const createAveragePointsChart = (seasonData, bootstrap) => {
      console.log(seasonData);
      const chartContainer = document.createElement("div");
      chartContainer.id = "average-points-chart-container";
      chartContainer.style.width = "100%";
      chartContainer.style.height = "auto";

      // Chart heading
      const chartTitle = document.createElement("p");
      chartTitle.innerText = "Your FPL Points vs. Average Each Gameweek";
      chartContainer.appendChild(chartTitle);

      // Create a canvas for the line chart
      const lineCanvas = document.createElement("canvas");
      lineCanvas.id = "averagePointsChart";
      chartContainer.appendChild(lineCanvas);

      // Extract gameweek numbers and player scores
      const gameweekNumbers = seasonData.map((gw) => gw.entry_history.event);
      const playerScores = seasonData.map((gw) => gw.entry_history.points);
      console.log(gameweekNumbers);
      // Extract average scores from bootstrap.events
      const averageScores = bootstrap.events
        .filter((event) => gameweekNumbers.includes(event.id))
        .map((event) => event.average_entry_score);
      console.log(averageScores);
      setTimeout(() => {
        const lineCtx = document
          .getElementById("averagePointsChart")
          .getContext("2d");
        new Chart(lineCtx, {
          type: "line",
          data: {
            labels: gameweekNumbers,
            datasets: [
              {
                label: "Your Score",
                data: playerScores,
                borderColor: "blue",
                backgroundColor: colors.blueNeon,
                fill: true,
              },
              {
                label: "Average Score",
                data: averageScores,
                borderColor: "pink",
                backgroundColor: colors.pinkHot,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: "Gameweek" },
              },
              y: {
                title: { display: true, text: "Points" },
              },
            },
          },
        });
      }, 100);

      return chartContainer;
    };

    // Function to fetch data for each player in a gameweek
    const fetchGameweekData = async (
      seasonData,
      batchSize = 5,
      delay = 200
    ) => {
      const results = [];
      const allRequests = [];

      for (const gameweek of seasonData) {
        const gameweekEvent = gameweek.entry_history?.event; // Ensure it exists
        //console.log(`Processing Gameweek Event: ${gameweekEvent}`);
        //console.log(gameweek);
        for (const pick of gameweek.picks) {
          if (pick.position < 12) {
            const url = `${BASE_URL}/element-summary/${pick.element}/`;

            const fetchPromise = fetch(url)
              .then((response) => response.json())
              .then((data) => {
                //console.log(data);
                document.getElementById(
                  "points-distribution"
                ).innerText = `Loading a chart of where on the pitch your points come from. Analysing player: ${getPlayerWebName(
                  data.history[0].element
                )}`;
                document.getElementById(
                  "average-scores"
                ).innerText = `Loading a chart of your gameweek scores vs the average gameweek scores. Analysing player: ${getPlayerWebName(
                  data.history[0].element
                )}`;

                if (!data.history || !Array.isArray(data.history)) {
                  console.warn(`Unexpected data format from ${url}`, data);
                  return null;
                }

                // Debug: Log available history rounds
                //console.log(`Fetched history for ${pick.element}:`, data.history.map(h => h.round));

                // Find matching history entry
                const matchingHistory = data.history.find(
                  (entry) => entry.round === gameweekEvent
                );

                if (matchingHistory) {
                  //console.log(`Match found for ${pick.element}:`, matchingHistory);
                  return {
                    player: getPlayerWebName(pick.element),
                    pick,
                    data: matchingHistory,
                  };
                } else {
                  console.warn(
                    `No match found for ${pick.element} in GW ${gameweekEvent}`
                  );
                  return null; // Ignore if no match
                }
              })
              .catch((error) => {
                console.error(`Error fetching ${url}:`, error);
                return null;
              });

            allRequests.push(fetchPromise);

            if (allRequests.length >= batchSize) {
              const batchResults = await Promise.all(allRequests);
              results.push(...batchResults.filter(Boolean)); // Remove null values
              allRequests.length = 0; // Clear batch

              await new Promise((resolve) => setTimeout(resolve, delay)); // Delay
            }
          }
        }
      }

      if (allRequests.length > 0) {
        const batchResults = await Promise.all(allRequests);
        results.push(...batchResults.filter(Boolean));
      }
      // Example usage:
      const pointsDistribution = createPointsDistributionChart(results);
      document.getElementById("points-distribution").innerHTML = "";
      document
        .getElementById("points-distribution")
        .classList.remove("skeleton");
      document.getElementById("points-distribution").innerHTML =
        pointsDistribution.innerHTML; // Append to the body or any other container

      // Example usage:
      const createAveragePoints = createAveragePointsChart(
        seasonData,
        bootstrap
      );
      document.getElementById("average-scores").innerHTML = "";
      document.getElementById("average-scores").classList.remove("skeleton");
      document.getElementById("average-scores").innerHTML =
        createAveragePoints.innerHTML; // Append to the body or any other container
    };

    // Usage example:
    fetchGameweekData(seasonData, 5, 200).then((data) =>
      console.log("Final filtered data:", data)
    );

    // Find the players with the highest counts of captaincy and vice-captaincy
    let mostCaptainPlayerId = null;
    let maxCaptains = 0;
    let mostViceCaptainPlayerId = null;
    let maxViceCaptains = 0;

    for (const playerId of new Set([
      ...Object.keys(captainCount),
      ...Object.keys(viceCaptainCount),
    ])) {
      const captainCountValue = captainCount[playerId] || 0;
      const viceCaptainCountValue = viceCaptainCount[playerId] || 0;

      if (captainCountValue > maxCaptains) {
        maxCaptains = captainCountValue;
        mostCaptainPlayerId = playerId;
      }

      if (viceCaptainCountValue > maxViceCaptains) {
        maxViceCaptains = viceCaptainCountValue;
        mostViceCaptainPlayerId = playerId;
      }
    }
    //////// Captained and vice captained code end ///////////////////

    //////// most picked player code start ///////////////////
    // Object to keep track of player appearances
    const appearanceCount = {};

    // Loop through the seasonData and count appearances for each gameweek
    seasonData.forEach((gameweek) => {
      gameweek.picks.forEach((pick) => {
        // Increment the count for each player's element ID
        appearanceCount[pick.element] =
          (appearanceCount[pick.element] || 0) + 1;
      });
    });

    // Initialize variables to find the players with the most and least appearances
    let mostAppearancesPlayerId = null;
    let leastAppearancesPlayerId = null;
    let maxAppearances = 0;
    let minAppearances = Infinity;

    // Iterate through the appearance counts to find the min and max
    for (const [playerId, count] of Object.entries(appearanceCount)) {
      if (count > maxAppearances) {
        maxAppearances = count;
        mostAppearancesPlayerId = playerId;
      }
      if (count < minAppearances) {
        minAppearances = count;
        leastAppearancesPlayerId = playerId;
      }
    }

    //////// most picked player code end ///////////////////

    // Get the player names using the getPlayerWebName function
    const mostAppearancesName = await getPlayerWebName(mostAppearancesPlayerId);
    const leastAppearancesName = await getPlayerWebName(
      leastAppearancesPlayerId
    );

    // Get the player names using the getPlayerWebName function
    const captainName = await getPlayerWebName(mostCaptainPlayerId);
    const viceCaptainName = await getPlayerWebName(mostViceCaptainPlayerId);

    // // General Intro Text
    const introText = `Did you know there are ${bootstrap.total_players.toLocaleString()} FPL managers playing this season? But let's be real — they don't matter. This is all about YOU! Here’s a rundown of the highs (and lows) of your FPL season so far:<br><br>`;

    const averagePointsDiv = `<div id="average-scores" class="skeleton"></div>`;

    // Captain Highlights
    const captainText = `Your go-to captain has been <b style="font-size: 1.2em;">${captainName}</b>, trusted for ${maxCaptains} gameweeks — more than any other player! Meanwhile, your trusty vice-captain has been <b style="font-size: 1.2em;">${viceCaptainName}</b>.<br><br>`;

    // Player Appearances
    const mostPickedText = `You’ve shown some serious loyalty to <b style="font-size: 1.2em;">${mostAppearancesName}</b>, keeping him in your squad for ${maxAppearances} gameweeks. On the flip side, <b style="font-size: 1.2em;">${leastAppearancesName}</b> barely got a look-in, featuring just ${minAppearances} week(s). Loyalty cuts both ways, huh?<br><br>`;

    const pointsDistributionDiv = `<div id="points-distribution" class="skeleton"></div>`;

    // Points Highlights
    const minPointsText = `Oof, Gameweek ${
      minPoints.event
    } was one to forget. You scraped just <b style="font-size: 1.2em;">${
      minPoints.points
    }</b> points — a tough pill to swallow. On average, though, you’ve managed around <b style="font-size: 1.2em;">${Math.round(
      managerData.summary_overall_points / currentGw
    )}</b> points per week.<br>`;
    const maxPointsText = `Now, Gameweek ${maxPoints.event} — that’s the stuff of legends! You smashed it with <b style="font-size: 1.2em;">${maxPoints.points}</b> points. Whatever magic you worked that week, bottle it up!<br><br>`;

    // Bench Points
    const maxBenchPointsText = `Gameweek ${maxPointsOnBench.event} — ouch! You left a whopping <b style="font-size: 1.2em;">${maxPointsOnBench.pointsOnBench}</b> points on the bench. We’ve all been there.<br>`;
    const minBenchPointsText = `But hey, Gameweek ${minPointsOnBench.event} was a masterclass in squad management — only <b style="font-size: 1.2em;">${minPointsOnBench.pointsOnBench}</b> points left warming the bench.<br><br>`;

    // Automatic Substitutions
    const autoSubsText = `Remember Gameweek ${automaticSubsData.max.event}? That’s when the auto-subs came to your rescue, bringing in <b style="font-size: 1.2em;">${automaticSubsData.max.automaticSubsCount}</b> player(s) off the bench. Across all gameweeks, you’ve had <b style="font-size: 1.2em;">${automaticSubsData.totalAutomaticSubs}</b> automatic subs. Not bad!<br><br>`;

    // Team Value Insights
    const minValueText =
      minValue.value === 1000
        ? `Fun fact: your team value has never dipped below <b style="font-size: 1.2em;">£100m</b>. That’s some shrewd financial management!<br>`
        : `Gameweek ${
            minValue.event
          } was a tough one for your team’s finances, with your squad worth just <b style="font-size: 1.2em;">£${(
            minValue.value / 10
          ).toFixed(1)}</b> mil.<br>`;

    // Determine the max value text
    let maxValueText;
    if (maxValue.event === currentGw && maxValue.value === currentValue) {
      maxValueText = `Right now, your team value is at its peak of <b style="font-size: 1.2em;">£${(
        maxValue.value / 10
      ).toFixed(1)}</b> mil. Keep it up!<br><br>`;
    } else {
      maxValueText = `Back in Gameweek ${
        maxValue.event
      }, your squad peaked in value at <b style="font-size: 1.2em;">£${(
        maxValue.value / 10
      ).toFixed(1)}</b> mil. Big spender energy!<br><br>`;
    }

    // Add the current value text if it's not redundant
    const currentValueText =
      maxValue.event !== currentGw || maxValue.value !== currentValue
        ? `As of now, your team is worth <b style="font-size: 1.2em;">£${(
            currentValue / 10
          ).toFixed(1)}</b> mil. That's how you're rolling these days!<br><br>`
        : "";

    // Combine all text
    const teamValueText = `${minValueText}${maxValueText}${currentValueText}`;

    // Chip Usage
    const chipTextOptions = [
      `You’ve yet to use any chips this season. Cautious or just saving the fireworks for later? Don’t wait too long!<br><br>`,
      `You’ve played <b style="font-size: 1.2em;">1</b> chip so far. Keeping things steady — nice!<br><br>`,
      `Two chips down already! Bold moves — we like it!<br><br>`,
      `You’ve used <b style="font-size: 1.2em;">${activeChipCount}</b> chips already. Living life on the edge, huh? Careful — there’s still a lot of season left!<br><br>`,
    ];
    const chipText =
      chipTextOptions[Math.min(activeChipCount, chipTextOptions.length - 1)];

    let signupAd = "";
    if (
      theUser.username.data.membership_level.ID != 10 ||
      theUser.username.data.membership_level.ID != 12
    ) {
      signupAd = `<div id="sign-up-ad"><h4 style="color: white">Have you considered upgrading to FPL Toolbox Pro for only £14.99 per year?</h4>
        <a href="https://fpltoolbox.com/membership-account/membership-levels/">Find out more</a>
    </div>`;
    }

    // Final Combined Output
    const resultText = `
${introText}
${averagePointsDiv}
${captainText}
${mostPickedText}
${pointsDistributionDiv}
${minPointsText}
${maxPointsText}
${signupAd}
${maxBenchPointsText}
${minBenchPointsText}
${autoSubsText}
${teamValueText}
${chipText}
`;

    // Add a header above the table
    const summaryHeader = document.createElement("h3");
    summaryHeader.innerText = `${loggedInTeamName} \n The Season so far:`;
    summaryHeader.style.textAlign = "center";
    app.appendChild(summaryHeader);

    // Append the result to the div with ID "app"
    const resultParagraph = document.createElement("div");
    resultParagraph.innerHTML = resultText;

    const seasonResult = document.createElement("div");
    seasonResult.setAttribute("class", "season-summary");
    seasonResult.appendChild(resultParagraph);
    app.appendChild(seasonResult);

    // Add share button after table
    // const shareButton = document.createElement("button");
    // shareButton.innerText = "Share Summary";
    // shareButton.onclick = shareSummary;
    // app.appendChild(shareButton);

    // function shareSummary() {

    //   let shareMessage = `My FPL Seaason So Far \n ${resultText}\n`;

    //   // Add a URL to the bottom of the message
    //   const url = "https://fpltoolbox.com/season-summary"; // Replace with your desired URL
    //   shareMessage += `\nView your own summary right here:\n ${url}`;

    //   // Use navigator.share if available
    //   if (navigator.share) {
    //     navigator
    //       .share({
    //         title: "Share League",
    //         text: shareMessage,
    //       })
    //       .catch((error) => console.log("Error sharing", error));
    //   } else {
    //     alert("Sharing is not supported in this browser.");
    //   }
    // }

    loader.remove();
  } catch (error) {
    console.error("Error during season summary:", error);
  }
}

// Transfer Calculator - how many transfers each team has available.
async function transferCalculator() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = new LoadingBar(app);
  loader.start();

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);
  leagueTable.innerHTML = "";

  setTimeout(async () => {
    try {
      if (createLeaguePromise) {
        await createLeaguePromise;
      }

      console.log(league);

      league.forEach((team) => {
        team.availableTransfers = calculateAvailableTransfers(team);
      });

      // Sort the league by available transfers in descending order
      league.sort((a, b) => b.availableTransfers - a.availableTransfers);

      // Add a header above the table
      const tableHeader = document.createElement("h6");
      tableHeader.innerText = `${leagueName} \n Available Free Transfers Next Week`;
      tableHeader.style.textAlign = "center";
      leagueTable.appendChild(tableHeader);

      function renderTable(sortedLeague) {
        leagueTable.innerHTML = "";
        leagueTable.appendChild(tableHeader);

        let table = document.createElement("table");
        table.setAttribute("id", "table");
        let thead = document.createElement("thead");
        table.appendChild(thead);
        leagueTable.appendChild(table);

        let positionHeader = document.createElement("th");
        positionHeader.innerText = "Pos";
        positionHeader.style.width = "10px";
        thead.appendChild(positionHeader);

        createColumnHeader("team", "Team", thead);

        let transfersHeader = document.createElement("th");
        transfersHeader.innerText = "Available Transfers";
        transfersHeader.style.textAlign = "right";
        thead.appendChild(transfersHeader);

        sortedLeague.forEach((team, index) => {
          let tr = document.createElement("tr");
          tr.setAttribute("class", "table-row");

          let positionCell = document.createElement("td");
          positionCell.innerText = index + 1;
          tr.appendChild(positionCell);

          let teamCell = document.createElement("td");
          let name = document.createElement("div");
          name.setAttribute("class", "team-name");
          name.innerText = team.entry_name;
          let manager = document.createElement("div");
          manager.setAttribute("class", "manager-name");
          manager.innerText = team.player_name.slice(0, 40);
          teamCell.appendChild(name);
          teamCell.appendChild(manager);
          tr.appendChild(teamCell);

          let transfersCell = document.createElement("td");
          transfersCell.innerText = team.availableTransfers;
          transfersCell.style.textAlign = "right";
          tr.appendChild(transfersCell);

          document.getElementById("table").appendChild(tr);
        });

        const shareButton = document.createElement("button");
        shareButton.innerText = "Share League";
        shareButton.onclick = shareTopTen;
        leagueTable.appendChild(shareButton);
      }

      renderTable(league);

      loader.stop();
      loader.remove();

      function shareTopTen() {
        const topTen = league.slice(0, 10);
        let shareMessage = `${leagueName}\n Available Transfers:\n`;
        topTen.forEach((team, index) => {
          shareMessage += `${index + 1}. ${
            team.entry_name
          }\n (${team.player_name.slice(0, 10)}) - Available Transfers: ${
            team.availableTransfers
          }\n`;
        });

        if (navigator.share) {
          navigator
            .share({
              title: "Share League",
              text:
                shareMessage +
                `\n Check your own league here\n https://fpltoolbox.com/fpl-toolbox-pro/`,
            })
            .catch((error) => console.log("Error sharing", error));
        } else {
          alert("Sharing is not supported in this browser.");
        }
      }

      // Calculate available transfers for a team
      function calculateAvailableTransfers(team) {
        let freeTransfers = 1;
        let maxTransfers = 5;

        // Group transfers by gameweek
        let transfersByGW = {};
        team.transfers[0].forEach((transfer) => {
          if (!transfersByGW[transfer.event]) {
            transfersByGW[transfer.event] = [];
          }
          transfersByGW[transfer.event].push(transfer);
        });

        for (let gw = 2; gw <= currentGw; gw++) {
          // Always add 1 free transfer per GW, respecting the 5 transfer cap
          freeTransfers = Math.min(freeTransfers + 1, maxTransfers);

          const chipUsed = team.chips.find(
            (chip) =>
              (chip.name === "wildcard" || chip.name === "freehit") &&
              chip.gw === gw
          );

          if (chipUsed) {
            continue;
          }

          const transfersMade = transfersByGW[gw]
            ? transfersByGW[gw].length
            : 0;
          freeTransfers -= transfersMade;

          // Ensure at least 1 free transfer is always available
          freeTransfers = Math.max(freeTransfers, 1);
        }

        return freeTransfers;
      }
    } catch (error) {
      console.error("Error in transferCalculator:", error);
    }
  }, 1000);
}

/* SIDE LEAGUES START HERE */
async function sideLeaguesMenu() {
  const app = document.getElementById("app");
  app.innerHTML = ""; // Clear app

  // Create a container div
  const container = document.createElement("div");
  container.id = "side-leagues-menu";

  // Button names and corresponding functions
  const buttons = [
    { text: "Captaincy Points", action: showCaptainsLeague },
    { text: "Golden Boot", action: showGoldenBoot },
    { text: "Benched Points", action: showBenchLeague },
    { text: "Dirty League", action: showDirtyLeague },
    { text: "Green Arrow League", action: showGreenArrowLeague },
    { text: "Rich List", action: showRichList },
  ];

  // Create and append each button
  for (const { text, action } of buttons) {
    const button = document.createElement("button");
    button.innerText = text;
    button.style.padding = "10px";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";

    button.addEventListener("click", action);

    container.appendChild(button);
  }

  // Append the container to the app
  app.appendChild(container);
}
//Bench League
async function showBenchLeague() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  sideLeaguesMenu();
  const loader = new LoadingBar(app);
  loader.start();

  await createLeaguePromise;

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);
  leagueTable.innerHTML = "";
  // Sorting state
  let isAscending = false; // Default to descending order

  setTimeout(() => {
    // Sort the league by totalPointsOnBench in descending order by default
    league.sort((a, b) => b.totalPointsOnBench - a.totalPointsOnBench);

    // Add a header above the table
    const tableHeader = document.createElement("h6");
    tableHeader.innerText = `${leagueName} \n Benched Points League`;
    tableHeader.style.textAlign = "center";
    leagueTable.appendChild(tableHeader);

    function renderTable(sortedLeague) {
      leagueTable.innerHTML = ""; // Clear previous table content
      leagueTable.appendChild(tableHeader); // Re-append header after clearing content

      let table = document.createElement("table");
      table.setAttribute("id", "table");
      let thead = document.createElement("thead");
      table.appendChild(thead);
      leagueTable.appendChild(table);

      // Columns
      let positionHeader = document.createElement("th");
      positionHeader.innerText = "Pos";
      positionHeader.style.width = "10px";
      thead.appendChild(positionHeader);

      createColumnHeader("team", "Team", thead);

      // New column for Bench Points with sorting functionality
      let benchPointsHeader = document.createElement("th");
      benchPointsHeader.innerText = "Benched Points";
      benchPointsHeader.style.cursor = "pointer"; // Pointer cursor to indicate clickable header
      benchPointsHeader.style.textAlign = "right"; // Set text alignment to right

      // Add sort indicator to the Bench Points header
      const sortIndicator = document.createElement("span");
      sortIndicator.innerText = isAscending ? " ▲" : " ▼"; // Initial sort indicator (descending by default)
      benchPointsHeader.appendChild(sortIndicator);

      benchPointsHeader.onclick = () => {
        isAscending = !isAscending;

        // Toggle the sort indicator
        sortIndicator.innerText = isAscending ? " ▲" : " ▼";

        const sortedLeague = league.sort((a, b) => {
          return isAscending
            ? a.totalPointsOnBench - b.totalPointsOnBench
            : b.totalPointsOnBench - a.totalPointsOnBench;
        });
        renderTable(sortedLeague);
      };
      thead.appendChild(benchPointsHeader);

      sortedLeague.forEach((element, index) => {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "table-row");
        if (element.entry === theUser.info.team_id) {
          tr.setAttribute("class", "current-user");
        }

        // Position column
        let positionCell = document.createElement("td");
        positionCell.innerText = index + 1; // Display position based on sorted order
        tr.appendChild(positionCell);

        let team = document.createElement("td");
        let name = document.createElement("div");
        name.setAttribute("class", "team-name");
        name.innerText = element.entry_name;
        let manager = document.createElement("div");
        manager.setAttribute("class", "manager-name");
        manager.innerText = element.player_name.slice(0, 40);
        team.appendChild(name);
        team.appendChild(manager);
        tr.appendChild(team);

        // Cell for Bench Points
        let benchPoints = document.createElement("td");
        benchPoints.innerText = element.totalPointsOnBench;
        benchPoints.style.textAlign = "right"; // Set text alignment to right
        tr.appendChild(benchPoints);

        document.getElementById("table").appendChild(tr);
      });

      // Add share button after table
      const shareButton = document.createElement("button");
      shareButton.innerText = "Share League";
      shareButton.onclick = shareTopTen;
      leagueTable.appendChild(shareButton);
    }

    // Initial render with the sorted league data
    renderTable(league);

    // Stop and clean up the loading bar
    loader.stop();
    loader.remove();

    // Function to share top 10 results using navigator.share
    function shareTopTen() {
      // Get the top 10 entries
      const topTen = league;
      let shareMessage = `${leagueName}\n The Benched Points League:\n`;
      topTen.forEach((entry, index) => {
        shareMessage += `${index + 1}. ${
          entry.entry_name
        }\n (${entry.player_name.slice(0, 10)}) - Benched Points: ${
          entry.totalPointsOnBench
        }\n`;
      });

      // Use navigator.share if available
      if (navigator.share) {
        navigator
          .share({
            title: "Share League",
            text:
              shareMessage +
              `\n Check your own league here\n https://fpltoolbox.com/fpl-toolbox-pro/`,
          })
          .catch((error) => console.log("Error sharing", error));
      } else {
        alert("Sharing is not supported in this browser.");
      }
    }
  }, "1000");
}

// Richest Team
async function showRichList() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  sideLeaguesMenu();
  const loader = new LoadingBar(app);
  loader.start();

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);
  leagueTable.innerHTML = "";

  // Sorting state
  let isAscending = false; // Default to descending order

  setTimeout(() => {
    console.log(league);

    // Extract team value from the last object in everyGw array for each entry
    league.forEach((entry) => {
      entry.teamValue = entry.everyGw[entry.everyGw.length - 1].value;
      //entry.everyGw[entry.everyGw.length - 1].bank;
    });

    // Sort the league by teamValue in descending order by default
    league.sort((a, b) => b.teamValue - a.teamValue);

    // Add a header above the table
    const tableHeader = document.createElement("h6");
    tableHeader.innerText = `${leagueName} \n Rich List League`;
    tableHeader.style.textAlign = "center";
    leagueTable.appendChild(tableHeader);

    function renderTable(sortedLeague) {
      leagueTable.innerHTML = ""; // Clear previous table content
      leagueTable.appendChild(tableHeader); // Re-append header after clearing content

      let table = document.createElement("table");
      table.setAttribute("id", "table");
      let thead = document.createElement("thead");
      table.appendChild(thead);
      leagueTable.appendChild(table);

      // Columns
      let positionHeader = document.createElement("th");
      positionHeader.innerText = "Pos";
      positionHeader.style.width = "10px";
      thead.appendChild(positionHeader);

      createColumnHeader("team", "Team", thead);

      // New column for Team Value with sorting functionality
      let teamValueHeader = document.createElement("th");
      teamValueHeader.innerText = "Club Value (£m)";
      teamValueHeader.style.cursor = "pointer"; // Pointer cursor to indicate clickable header
      teamValueHeader.style.textAlign = "right"; // Set text alignment to right

      // Add sort indicator to the Team Value header
      const sortIndicator = document.createElement("span");
      sortIndicator.innerText = isAscending ? " ▲" : " ▼"; // Initial sort indicator (descending by default)
      teamValueHeader.appendChild(sortIndicator);

      teamValueHeader.onclick = () => {
        isAscending = !isAscending;

        // Toggle the sort indicator
        sortIndicator.innerText = isAscending ? " ▲" : " ▼";

        const sortedLeague = league.sort((a, b) => {
          return isAscending
            ? a.teamValue - b.teamValue
            : b.teamValue - a.teamValue;
        });
        renderTable(sortedLeague);
      };
      thead.appendChild(teamValueHeader);

      sortedLeague.forEach((element, index) => {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "table-row");
        // if (element.entry === theUser.info.team_id) {
        //   tr.setAttribute("class", "current-user");
        // }
        // Add class based on team value
        if (element.teamValue > 1000) {
          tr.classList.add("positive-funds");
        } else {
          tr.classList.add("negative-funds");
        }

        // Position column
        let positionCell = document.createElement("td");
        positionCell.innerText = index + 1; // Display position based on sorted order
        tr.appendChild(positionCell);

        let team = document.createElement("td");
        let name = document.createElement("div");
        name.setAttribute("class", "team-name");
        name.innerText = element.entry_name;
        let manager = document.createElement("div");
        manager.setAttribute("class", "manager-name");
        manager.innerText = element.player_name.slice(0, 40);
        team.appendChild(name);
        team.appendChild(manager);
        tr.appendChild(team);

        // Cell for Team Value
        let teamValueCell = document.createElement("td");
        teamValueCell.innerText = element.teamValue / 10;
        teamValueCell.style.textAlign = "right"; // Set text alignment to right
        tr.appendChild(teamValueCell);

        document.getElementById("table").appendChild(tr);
      });

      // Add share button after table
      const shareButton = document.createElement("button");
      shareButton.innerText = "Share League";
      shareButton.onclick = shareTopTen;
      leagueTable.appendChild(shareButton);
    }

    // Initial render with the sorted league data
    renderTable(league);

    // Stop and clean up the loading bar
    loader.stop();
    loader.remove();

    // Function to share top 10 results using navigator.share
    function shareTopTen() {
      // Get the top 10 entries
      const topTen = league;
      let shareMessage = `${leagueName}\n The Team Value League:\n`;
      topTen.forEach((entry, index) => {
        shareMessage += `${index + 1}. ${
          entry.entry_name
        }\n (${entry.player_name.slice(0, 10)}) - Team Value: £${
          entry.teamValue / 10
        }m\n`;
      });

      // Use navigator.share if available
      if (navigator.share) {
        navigator
          .share({
            title: "Share League",
            text:
              shareMessage +
              `\n Check your own league here\n https://fpltoolbox.com/fpl-toolbox-pro/`,
          })
          .catch((error) => console.log("Error sharing", error));
      } else {
        alert("Sharing is not supported in this browser.");
      }
    }
  }, "1000");
}

// Most Captaincy Points League
async function showCaptainsLeague() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  sideLeaguesMenu();
  const loader = new LoadingBar(app);
  loader.start();
  await createLeaguePromise;
  loader.stop();
  loader.remove();

  // Fetch league data
  await weeklyPicksForLeague();

  console.log(league);
  app.innerHTML = "";
  sideLeaguesMenu();
  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);
  leagueTable.innerHTML = "";

  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${leagueName} \n Captaincy Points Leaderboard`;
  tableDescription.style.textAlign = "center";
  leagueTable.appendChild(tableDescription);

  // Create table
  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  // Column headers
  const headers = ["#", "Team Name", "TOT"];
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.innerText = headerText;

    // Add sorting to "Total Captaincy Points" column
    if (headerText === "TOT") {
      th.innerHTML = `TOT <span id="sort-indicator">▼</span>`;
      th.style.cursor = "pointer"; // Make it look clickable
      th.style.textAlign = "right"; // Set text alignment to right
    }

    tableHeaderRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  // Add rows for each team
  league.forEach((team, index) => {
    const row = document.createElement("tr");

    // Row number cell
    const rowNumberCell = document.createElement("td");
    rowNumberCell.innerText = index + 1;
    row.appendChild(rowNumberCell);

    // Team name cell
    const teamNameCell = document.createElement("td");
    teamNameCell.innerHTML = `<strong>${team.entry_name}</strong><br>${team.player_name}`;
    row.appendChild(teamNameCell);

    // Total captaincy points cell
    const captaincyPointsCell = document.createElement("td");
    captaincyPointsCell.innerText = team.total_captaincy_points || 0;
    captaincyPointsCell.style.textAlign = "right"; // Set text alignment to right
    row.appendChild(captaincyPointsCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  // Sort the table by Total Captaincy Points in descending order initially
  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const pointsA = parseFloat(rowA.cells[2].innerText);
      const pointsB = parseFloat(rowB.cells[2].innerText);
      return ascending ? pointsA - pointsB : pointsB - pointsA;
    });

    // Append rows in sorted order
    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1; // Update row numbers after sorting
      tableBody.appendChild(row);
    });

    // Update the sorting indicator
    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  // Sort in descending order initially
  sortTable(false);

  // Add event listener for sorting when clicking the "Total Captaincy Points" header
  tableHeaderRow.children[2].addEventListener("click", () => {
    const isAscending = tableHeaderRow.children[2].dataset.sorted === "asc";
    tableHeaderRow.children[2].dataset.sorted = isAscending ? "desc" : "asc";
    sortTable(!isAscending);
  });

  // Add share button after table
  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.onclick = shareTopTen;
  leagueTable.appendChild(shareButton);

  // Function to share top 10 results using navigator.share
  function shareTopTen() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${leagueName}\n Captaincy Points Leaderboard:\n`;
    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0];
      const captaincyPoints = row.cells[2].innerText;
      shareMessage += `${
        index + 1
      }. ${teamName} - Captaincy Points: ${captaincyPoints}\n`;
    });

    // Add a URL to the bottom of the message
    const url = "https://fpltoolbox.com/fpl-toolbox-pro";
    shareMessage += `\nView your own league right here:\n ${url}`;

    // Use navigator.share if available
    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text: shareMessage,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}

// Captain Goals Scored League
async function showGoldenBoot() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = new LoadingBar(app);
  loader.start();
  await createLeaguePromise;
  loader.stop();
  loader.remove();
  // Fetch Goldenboot data
  await weeklyPicksForLeague();

  app.innerHTML = "";
  sideLeaguesMenu();
  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);
  leagueTable.innerHTML = "";

  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${leagueName} \n Golden Boot League Table`;
  tableDescription.style.textAlign = "center";
  leagueTable.appendChild(tableDescription);

  // Create table for league points
  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  // Create headers for Row Number, Team Name, and Total Captain Points
  const rowNumberHeader = document.createElement("th");
  rowNumberHeader.innerText = "#";
  tableHeaderRow.appendChild(rowNumberHeader);

  const teamHeader = document.createElement("th");
  teamHeader.innerText = "Team Name";
  tableHeaderRow.appendChild(teamHeader);

  const pointsHeader = document.createElement("th");
  pointsHeader.innerHTML = `Goals Scored <span id="sort-indicator">▼</span>`;
  pointsHeader.style.cursor = "pointer"; // Make it look clickable
  pointsHeader.style.textAlign = "right"; // Set text alignment to right
  tableHeaderRow.appendChild(pointsHeader);

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  // Add rows for each team
  league.forEach((team, index) => {
    const row = document.createElement("tr");

    // Row number cell
    const rowNumberCell = document.createElement("td");
    rowNumberCell.innerText = index + 1; // Row number starts from 1
    row.appendChild(rowNumberCell);

    // Team name cell
    const teamNameCell = document.createElement("td");
    teamNameCell.innerHTML = `<strong>${team.entry_name}</strong><br>${team.player_name}`;
    row.appendChild(teamNameCell);

    // Captain points cell
    const pointsCell = document.createElement("td");
    pointsCell.innerText = team.total_goals_scored;
    pointsCell.style.textAlign = "right"; // Set text alignment to right
    row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  // Sort the table by totalCaptainPoints in descending order initially
  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const pointsA = parseFloat(rowA.cells[2].innerText); // Column 2 for points
      const pointsB = parseFloat(rowB.cells[2].innerText);
      return ascending ? pointsA - pointsB : pointsB - pointsA;
    });

    // Append rows in sorted order
    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1; // Update row numbers after sorting
      tableBody.appendChild(row);
    });

    // Update the sorting indicator
    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  // Sort in descending order initially
  sortTable(false);

  // Add event listener for sorting when clicking the Total Captain Points header
  pointsHeader.addEventListener("click", () => {
    // Toggle between ascending and descending
    const isAscending = pointsHeader.dataset.sorted === "asc";
    pointsHeader.dataset.sorted = isAscending ? "desc" : "asc"; // Store the sorting state
    sortTable(!isAscending);
  });

  // Add share button after table
  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.onclick = shareTopTen;
  leagueTable.appendChild(shareButton);

  // Function to share top 10 results using navigator.share
  function shareTopTen() {
    // Get the top 10 rows from the table
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${leagueName}\n Golden Boot League:\n`;
    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0]; // Get the team name
      const points = row.cells[2].innerText; // Get the points
      shareMessage += `${index + 1}. ${teamName} - Goals scored: ${points}\n`;
    });

    // Add a URL to the bottom of the message
    const url = "https://fpltoolbox.com/fpl-toolbox-pro"; // Replace with your desired URL
    shareMessage += `\nView your own league right here:\n ${url}`;

    // Use navigator.share if available
    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text: shareMessage,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}

// Most Carded League
async function showDirtyLeague() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  sideLeaguesMenu();
  const loader = new LoadingBar(app);
  loader.start();
  await createLeaguePromise;
  loader.stop();
  loader.remove();
  // Fetch Dirty League data

  await weeklyPicksForLeague();

  console.log(league);
  app.innerHTML = "";
  sideLeaguesMenu();
  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);
  leagueTable.innerHTML = "";

  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${leagueName} \n The Dirty League Table`;
  tableDescription.style.textAlign = "center";
  leagueTable.appendChild(tableDescription);

  // Create table for league points
  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  // Column headers
  const headers = [
    "#",
    "Team Name",
    "Yellow Cards 🟨",
    "Red Cards 🟥",
    "Total Cards",
  ];
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.innerText = headerText;

    // Add sorting to "Total Cards" column
    if (headerText === "Total Cards") {
      th.innerHTML = `Total Cards <span id="sort-indicator">▼</span>`;
      th.style.cursor = "pointer"; // Make it look clickable
    }

    tableHeaderRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  // Add rows for each team
  league.forEach((team, index) => {
    const row = document.createElement("tr");

    // Row number cell
    const rowNumberCell = document.createElement("td");
    rowNumberCell.innerText = index + 1; // Row number starts from 1
    row.appendChild(rowNumberCell);

    // Team name cell
    const teamNameCell = document.createElement("td");
    teamNameCell.innerHTML = `<strong>${team.entry_name}</strong><br>${team.player_name}`;
    row.appendChild(teamNameCell);

    // Yellow cards cell
    const yellowCardsCell = document.createElement("td");
    yellowCardsCell.innerText = team.total_yellow_cards || 0;
    row.appendChild(yellowCardsCell);

    // Red cards cell
    const redCardsCell = document.createElement("td");
    redCardsCell.innerText = team.total_red_cards || 0;
    row.appendChild(redCardsCell);

    // Total cards cell
    const totalCardsCell = document.createElement("td");
    totalCardsCell.innerText = team.total_cards || 0;
    row.appendChild(totalCardsCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  // Sort the table by Total Cards in descending order initially
  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const cardsA = parseFloat(rowA.cells[4].innerText); // Column 4 for Total Cards
      const cardsB = parseFloat(rowB.cells[4].innerText);
      return ascending ? cardsA - cardsB : cardsB - cardsA;
    });

    // Append rows in sorted order
    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1; // Update row numbers after sorting
      tableBody.appendChild(row);
    });

    // Update the sorting indicator
    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  // Sort in descending order initially
  sortTable(false);

  // Add event listener for sorting when clicking the "Total Cards" header
  tableHeaderRow.children[4].addEventListener("click", () => {
    // Toggle between ascending and descending
    const isAscending = tableHeaderRow.children[4].dataset.sorted === "asc";
    tableHeaderRow.children[4].dataset.sorted = isAscending ? "desc" : "asc"; // Store the sorting state
    sortTable(!isAscending);
  });

  // Add share button after table
  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.onclick = shareTopTen;
  leagueTable.appendChild(shareButton);

  // Function to share top 10 results using navigator.share
  function shareTopTen() {
    // Get the top 10 rows from the table
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${leagueName}\n The Dirty League:\n`;
    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0]; // Get the team name
      const yellowCards = row.cells[2].innerText; // Yellow cards
      const redCards = row.cells[3].innerText; // Red cards
      const totalCards = row.cells[4].innerText; // Total cards

      shareMessage += `${
        index + 1
      }. ${teamName} - Y: ${yellowCards}, R: ${redCards}, Total: ${totalCards}\n`;
    });

    // Add a URL to the bottom of the message
    const url = "https://fpltoolbox.com/fpl-toolbox-pro"; // Replace with your desired URL
    shareMessage += `\nView your own league right here:\n ${url}`;

    // Use navigator.share if available
    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text: shareMessage,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}

// Green Arrows League
async function showGreenArrowLeague() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  sideLeaguesMenu();

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  app.appendChild(leagueTable);

  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${leagueName} \n The Green Arrow League Table`;
  tableDescription.style.textAlign = "center";
  leagueTable.appendChild(tableDescription);

  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  // Column Headers
  const headers = ["#", "Team Name", "Red Arrows", "Green Arrows"];
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.innerText = headerText;

    if (headerText === "Red Arrows" || headerText === "Green Arrows") {
      th.innerHTML = `${headerText} <span class="sort-indicator">▼</span>`;
      th.style.cursor = "pointer";
      th.setAttribute(
        "data-sort",
        headerText === "Green Arrows" ? "desc" : "none"
      ); // Default sort for Green Arrows
      th.addEventListener("click", () => toggleSort(headerText, th));
    }

    tableHeaderRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  leagueTable.appendChild(table);
  table.appendChild(tableBody);

  // Function to generate table rows
  const renderTable = (sortedLeague) => {
    tableBody.innerHTML = ""; // Clear previous rows
    sortedLeague.forEach((team, index) => {
      let greenArrows = 0;
      let redArrows = 0;

      for (let i = 1; i < team.everyGw.length; i++) {
        if (team.everyGw[i].overall_rank < team.everyGw[i - 1].overall_rank) {
          greenArrows++;
        } else if (
          team.everyGw[i].overall_rank > team.everyGw[i - 1].overall_rank
        ) {
          redArrows++;
        }
      }

      const row = document.createElement("tr");

      const rowNumberCell = document.createElement("td");
      rowNumberCell.innerText = index + 1;
      row.appendChild(rowNumberCell);

      const teamNameCell = document.createElement("td");
      teamNameCell.innerHTML = `<strong>${team.entry_name}</strong><br>${team.player_name}`;
      row.appendChild(teamNameCell);

      const redArrowsCell = document.createElement("td");
      redArrowsCell.innerText = redArrows;
      row.appendChild(redArrowsCell);

      const greenArrowsCell = document.createElement("td");
      greenArrowsCell.innerText = greenArrows;
      row.appendChild(greenArrowsCell);

      tableBody.appendChild(row);
    });
  };

  // Sorting function
  function toggleSort(column, headerElement) {
    const sortIndicators = document.querySelectorAll(".sort-indicator");
    const isAscending = headerElement.getAttribute("data-sort") === "asc";

    // Toggle sort order
    headerElement.setAttribute("data-sort", isAscending ? "desc" : "asc");
    headerElement.querySelector(".sort-indicator").innerText = isAscending
      ? "▼"
      : "▲";

    // Reset other sort indicators
    sortIndicators.forEach((indicator) => {
      if (indicator !== headerElement.querySelector(".sort-indicator")) {
        indicator.innerText = "▼";
      }
    });

    // Sort league based on the selected column
    const sortedLeague = [...league].sort((a, b) => {
      let greenA = 0,
        greenB = 0;
      let redA = 0,
        redB = 0;

      for (let i = 1; i < a.everyGw.length; i++) {
        if (a.everyGw[i].overall_rank < a.everyGw[i - 1].overall_rank) greenA++;
        if (a.everyGw[i].overall_rank > a.everyGw[i - 1].overall_rank) redA++;
      }
      for (let i = 1; i < b.everyGw.length; i++) {
        if (b.everyGw[i].overall_rank < b.everyGw[i - 1].overall_rank) greenB++;
        if (b.everyGw[i].overall_rank > b.everyGw[i - 1].overall_rank) redB++;
      }

      let valueA = column === "Green Arrows" ? greenA : redA;
      let valueB = column === "Green Arrows" ? greenB : redB;

      return isAscending ? valueA - valueB : valueB - valueA;
    });

    renderTable(sortedLeague);
  }

  // Initial table render (sorted by Green Arrows descending)
  const sortedByGreenArrows = [...league].sort((a, b) => {
    let greenA = 0,
      greenB = 0;
    for (let i = 1; i < a.everyGw.length; i++) {
      if (a.everyGw[i].overall_rank < a.everyGw[i - 1].overall_rank) greenA++;
    }
    for (let i = 1; i < b.everyGw.length; i++) {
      if (b.everyGw[i].overall_rank < b.everyGw[i - 1].overall_rank) greenB++;
    }
    return greenB - greenA; // Descending order
  });

  renderTable(sortedByGreenArrows);
}

/* SIDE LEAGUES END HERE */

function addSantaHatsToPlayers() {
  // Select all elements with the class 'player'
  const players = document.querySelectorAll(".player");
  const hats = []; // Array to store all the hat images for further manipulation

  players.forEach((player) => {
    // Create a new image element
    const img = document.createElement("img");
    img.src = "https://fpltoolbox.com/wp-content/uploads/2024/12/3726320.png";
    img.style.width = "20px";
    img.style.marginBottom = "-30px";
    img.style.marginLeft = "7px";
    img.style.marginTop = "-30px";
    img.style.zIndex = "20";
    img.style.transform = "rotate(10deg)"; // Rotate the image slightly
    img.style.scale = "0.3";

    // Append the image to the player element
    player.prepend(img);

    // Store the hat in the hats array
    hats.push(img);
  });

  // Function to modify half of the hats
  function modifyHalfOfHats() {
    // Shuffle the hats array
    const shuffledHats = hats.sort(() => Math.random() - 0.5);

    // Get half of the hats
    const halfIndex = Math.floor(shuffledHats.length / 2);
    const hatsToModify = shuffledHats.slice(0, halfIndex);

    // Modify the selected hats
    hatsToModify.forEach((hat) => {
      hat.style.marginLeft = "0";
      hat.style.marginRight = "3px";
      hat.style.transform = "rotate(-10deg)";
    });
  }

  // Call the function to modify half of the hats
  modifyHalfOfHats();
}
function addCaptainBadge() {
  //console.log("Adding Captain Badges");
  // Select all elements with the class 'player'
  const players = document.querySelectorAll(".player");

  players.forEach((player) => {
    if (player.querySelectorAll(".my-captain-name")[0]) {
      // Create a new image element
      const img = document.createElement("img");
      img.src = "https://fpltoolbox.com/wp-content/uploads/2024/12/Captain.png";
      img.setAttribute("class", "captain-badge");
      // Append the image to the player element
      player.prepend(img);
    }
    if (player.querySelectorAll(".my-vice-captain-name")[0]) {
      // Create a new image element
      const img = document.createElement("img");
      img.src =
        "https://fpltoolbox.com/wp-content/uploads/2024/12/Captain-1.png";
      img.setAttribute("class", "my-vice-captain-badge");
      // Append the image to the player element
      player.prepend(img);
    }
    if (player.querySelectorAll(".my-triple-captain-name")[0]) {
      // Create a new image element
      const img = document.createElement("img");
      img.src =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/svgexport-10.png";
      img.setAttribute("class", "my-triple-captain-badge");
      // Append the image to the player element
      player.prepend(img);
    }
  });
}

// START of MY TEAM
async function showMyTeam() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = createLoader();
  app.appendChild(loader);

  const myScore = createScoreCard();
  const pitch = createPitch();
  app.append(myScore, pitch);

  const data = await fetchGwTeamData();
  await renderTeam(data);
  await fetchAndRenderUpcomingFixtures(data);
  calculatePlayersPlayed(data);
  document.getElementById("expected-points").innerHTML = "";

  // CHANGE OPERATOR FOR TESTING PURPOSES - Check if user is pro, and append pro menu to My Team
  if (
    theUser.username.data.membership_level.ID == 10 ||
    theUser.username.data.membership_level.ID == 12
  ) {
    await fetchAndRenderAdditionalStats(data);
    await fetchAndRenderTransferStats(data);
    await fetchAndRenderXpStats(data);
    await fetchAndRenderFixturesForAllSeason(data);
    await fetchAndRenderFixturesForNonOwned(data);

    createProWidget();
  } else {
    createFreeWidget();
  }

  loader.remove();
}

function toggleUpComingFixtures() {
  const fixturesDivs = document.querySelectorAll(".homeawaygame");
  fixturesDivs.forEach((div) => {
    const isHidden =
      div.style.display === "none" || getComputedStyle(div).display === "none";
    div.style.display = isHidden ? "flex" : "none";
  });
}

async function createProWidget() {
  // Create the floating widget container
  const floatingWidget = document.createElement("div");
  floatingWidget.className = "floating-widget";

  // Create the main button
  const widgetButton = document.createElement("button");
  widgetButton.className = "widget-button";
  widgetButton.textContent = "☰";

  function toggleStats(showClass, hideClasses) {
    // Hide elements of specified classes
    hideClasses.forEach((hideClass) => {
      document.querySelectorAll(`.${hideClass}`).forEach((element) => {
        element.style.display = "none"; // Hide element
      });
    });

    // Toggle the display of elements for the showClass
    document.querySelectorAll(`.${showClass}`).forEach((element) => {
      element.style.display =
        element.style.display === "flex" ? "none" : "flex"; // Toggle element
    });
  }

  function toggleGameStats() {
    toggleStats("additional-stats", ["transfer-stats", "xp-stats"]);
  }

  function toggleTransferStats() {
    toggleStats("transfer-stats", ["additional-stats", "xp-stats"]);
  }

  function toggleXpStats() {
    toggleStats("xp-stats", ["additional-stats", "transfer-stats"]);
  }

  // Menu items
  const menuItems = [
    { text: "⚽ Game Info", onclick: toggleGameStats },
    { text: "↔️ Round Transfers", onclick: toggleTransferStats },
    { text: "🅿️ Expected Points", onclick: toggleXpStats },
    { text: "🔁 Auto-Subs", onclick: autoSubsNotification },
    { text: "🏟️ Fixtures", onclick: toggleUpComingFixtures },
  ];

  // Create the menu container
  const widgetMenu = document.createElement("div");
  widgetMenu.className = "widget-menu";

  // Add menu items to the menu container
  menuItems.forEach((item) => {
    // Create a div element for each menu item
    const menuItem = document.createElement("div");
    menuItem.textContent = item.text;
    menuItem.className = "menu-item";

    // Add the click event listener to trigger the function
    if (item.onclick) {
      menuItem.addEventListener("click", () => {
        item.onclick();
      });
    }

    widgetMenu.appendChild(menuItem);
  });

  // Append button and menu to the widget container
  floatingWidget.appendChild(widgetButton);
  floatingWidget.appendChild(widgetMenu);

  // Append the widget container to the body
  const app = document.getElementById("app");
  app.appendChild(floatingWidget);
  // Toggle menu display on button click
  widgetButton.addEventListener("click", () => {
    widgetMenu.style.display =
      widgetMenu.style.display === "flex" ? "none" : "flex";
  });
}
async function createFreeWidget() {
  // Create the floating widget container
  const floatingWidget = document.createElement("div");
  floatingWidget.className = "floating-widget";

  // Create the main button
  const widgetButton = document.createElement("button");
  widgetButton.className = "widget-button";
  widgetButton.textContent = "☰";

  // Menu items
  const menuItems = [
    { text: "🔒 Game Info", onclick: proFeaturePopUp },
    { text: "🔒 Round Transfers", onclick: proFeaturePopUp },
    { text: "🔒 Expected Points", onclick: proFeaturePopUp },
    { text: "🔒 Auto-Subs", onclick: proFeaturePopUp },
    { text: "🏟️ Fixtures", onclick: toggleUpComingFixtures },
  ];

  // Create the menu container
  const widgetMenu = document.createElement("div");
  widgetMenu.className = "widget-menu";

  // Add menu items to the menu container
  menuItems.forEach((item) => {
    // Create a div element for each menu item
    const menuItem = document.createElement("div");
    menuItem.textContent = item.text;
    menuItem.className = "menu-item";

    // Add the click event listener to trigger the function
    if (item.onclick) {
      menuItem.addEventListener("click", () => {
        item.onclick();
      });
    }

    widgetMenu.appendChild(menuItem);
  });

  // Append button and menu to the widget container
  floatingWidget.appendChild(widgetButton);
  floatingWidget.appendChild(widgetMenu);

  // Append the widget container to the body
  const app = document.getElementById("app");
  app.appendChild(floatingWidget);
  // Toggle menu display on button click
  widgetButton.addEventListener("click", () => {
    widgetMenu.style.display =
      widgetMenu.style.display === "flex" ? "none" : "flex";
  });
}

function proFeaturePopUp() {
  const message = `Hey, ${managerData.player_first_name}, this is a pro feature! You can unlock this and many more features, instantly for only £9.99 GBP a year! \n`;

  // Create modal elements
  const modal = document.createElement("div");

  modal.id = "shareModal";
  modal.style.zIndex = "10000";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  const modalContent = document.createElement("div");
  modalContent.id = "modalContent";
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";
  modalContent.style.width = "80%";
  modalContent.style.maxWidth = "500px";

  const modalMessage = document.createElement("div");
  modalMessage.id = "modalMessage";
  modalMessage.style.whiteSpace = "pre-wrap";
  modalMessage.style.wordWrap = "break-word";
  modalMessage.textContent = message;
  modalMessage.style.paddingBottom = "20px";

  const shareBtn = document.createElement("button");
  shareBtn.id = "shareBtn";
  shareBtn.style.marginRight = "10px";
  shareBtn.style.fontSize = "1rem";
  shareBtn.textContent = "Sign me up";

  const closeModal = document.createElement("button");
  closeModal.id = "closeModal";
  closeModal.style.marginRight = "10px";
  closeModal.style.fontSize = "0.7rem";
  closeModal.textContent = "Close";

  // Append elements to the modal
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(closeModal);
  modalContent.appendChild(shareBtn);

  modal.appendChild(modalContent);

  // Append the modal to the body
  document.body.appendChild(modal);

  // Close the modal
  closeModal.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // Share button functionality (works on mobile devices and some browsers)
  shareBtn.addEventListener("click", () => {
    window.open(
      "https://fpltoolbox.com/membership-account/membership-levels/",
      "_blank"
    );
  });
}

function autoSubsNotification() {
  // Get all field players not in the bench
  const initialFieldPlayers = Array.from(
    document.querySelectorAll(
      ".player.type1, .player.type2, .player.type3, .player.type4"
    )
  ).filter((player) => !player.closest("#my-bench"));

  // Get all bench players
  const benchPlayers = document.querySelectorAll("#my-bench .player");

  // A mutable copy of the field players to reflect swaps
  let currentFieldPlayers = [...initialFieldPlayers];

  // Count players by type
  const countPlayerTypes = (players) => ({
    goalkeepers: players.filter((player) => player.classList.contains("type1"))
      .length, // Assuming type1 is goalkeepers
    defenders: players.filter((player) => player.classList.contains("type2"))
      .length, // Assuming type2 is defenders
    midfielders: players.filter((player) => player.classList.contains("type3"))
      .length, // Assuming type3 is midfielders
    strikers: players.filter((player) => player.classList.contains("type4"))
      .length, // Assuming type4 is forwards
  });

  // Check if a formation is valid
  const isFormationValid = (counts) =>
    counts.goalkeepers === 1 &&
    counts.defenders >= 3 &&
    counts.midfielders >= 2 &&
    counts.strikers >= 1;

  // Log initial formation
  const initialCounts = countPlayerTypes(currentFieldPlayers);
  console.log(
    `Initial team formation: ${initialCounts.defenders}${initialCounts.midfielders}${initialCounts.strikers}`
  );

  // Variables to track the swaps and message details
  let changesLogged = false;
  let goalkeeperChecked = false;
  let swapDetails = [];

  currentFieldPlayers.forEach((fieldPlayer, fieldIndex) => {
    // If this is a goalkeeper and we've already processed one, skip further checks
    if (fieldPlayer.classList.contains("type1") && goalkeeperChecked) {
      return;
    }

    // Find the stat4Div inside the field player
    const fieldStat4Div = fieldPlayer.querySelector("#stat4 .breakdown-stats");

    // Check if stat4Div exists and its value is "❌"
    if (fieldStat4Div && fieldStat4Div.textContent.trim() === "❌") {
      // Loop through bench players to find an eligible swap
      for (let benchPlayer of benchPlayers) {
        // Goalkeeper-specific check
        if (
          fieldPlayer.classList.contains("type1") &&
          !benchPlayer.classList.contains("type1")
        ) {
          continue; // Skip if the field player is a goalkeeper and the bench player isn't
        }

        // Find the stat4Div inside the bench player
        const benchStat4Div = benchPlayer.querySelector(
          "#stat4 .breakdown-stats"
        );

        // Check if stat4Div exists and its value is "⏳" or "✅"
        if (
          benchStat4Div &&
          ["⏳", "✅"].includes(benchStat4Div.textContent.trim())
        ) {
          // Simulate the swap in the mutable copy
          const updatedFieldPlayers = [...currentFieldPlayers];
          updatedFieldPlayers[fieldIndex] = benchPlayer;

          // Count players after the swap
          const updatedCounts = countPlayerTypes(updatedFieldPlayers);

          // Check if the swap maintains a valid formation
          if (isFormationValid(updatedCounts)) {
            // Log the swap
            swapDetails.push(
              `${getPlayerWebName(
                fieldPlayer.id
              )} will be subbed off for ${getPlayerWebName(benchPlayer.id)}`
            );
            changesLogged = true;

            // Apply the swap to the current lineup
            currentFieldPlayers = updatedFieldPlayers;

            // Mark goalkeeper as checked if this player is a goalkeeper
            if (fieldPlayer.classList.contains("type1")) {
              goalkeeperChecked = true;
            }
            break; // Stop checking once the swap is logged
          }
        }
      }
    }
  });

  if (!changesLogged) {
    console.log("No eligible auto-subs were identified.");
  }

  // Log final formation based on the updated lineup
  const finalCounts = countPlayerTypes(currentFieldPlayers);
  console.log(
    `Final team formation: ${finalCounts.defenders}${finalCounts.midfielders}${finalCounts.strikers}`
  );

  // Prepare the alert message
  const alertMessage = `Current Formation: ${initialCounts.defenders}${
    initialCounts.midfielders
  }${initialCounts.strikers}
    \nLikely auto-subs: ${
      swapDetails.length > 0 ? swapDetails.join("\n") : "No eligible auto-subs"
    }
    \nFormation after auto-subs: ${finalCounts.defenders}${
    finalCounts.midfielders
  }${finalCounts.strikers}
    \nCheck your auto-subs and more here
  `;

  // Dynamically create and show the modal with the alertMessage
  createAndShowModal(alertMessage);
}

function createAndShowModal(message) {
  // Create modal elements
  const modal = document.createElement("div");

  modal.id = "shareModal";
  modal.style.zIndex = "10000";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  const modalContent = document.createElement("div");
  modalContent.id = "modalContent";
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";
  modalContent.style.width = "80%";
  modalContent.style.maxWidth = "500px";

  const modalMessage = document.createElement("div");
  modalMessage.id = "modalMessage";
  modalMessage.style.whiteSpace = "pre-wrap";
  modalMessage.style.wordWrap = "break-word";
  modalMessage.textContent = message;

  const shareBtn = document.createElement("button");
  shareBtn.id = "shareBtn";
  shareBtn.style.marginRight = "10px";
  shareBtn.style.fontSize = "1rem";
  shareBtn.textContent = "Share";

  const closeModal = document.createElement("button");
  closeModal.id = "closeModal";
  closeModal.style.marginRight = "10px";
  closeModal.style.fontSize = "1rem";
  closeModal.textContent = "Close";

  // Append elements to the modal
  modalContent.appendChild(modalMessage);

  modalContent.appendChild(shareBtn);
  modalContent.appendChild(closeModal);
  modal.appendChild(modalContent);

  // Append the modal to the body
  document.body.appendChild(modal);

  // Close the modal
  closeModal.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // Share button functionality (works on mobile devices and some browsers)
  shareBtn.addEventListener("click", () => {
    if (navigator.share) {
      navigator
        .share({
          title: "FPL Auto-Subs Notification",
          text: message,
          url: window.location.href,
        })
        .catch((err) => alert("Error sharing: " + err));
    } else {
      alert("Sharing is not supported on your device.");
    }
  });
}

// Helper to create loading spinner
function createLoader() {
  const loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  return loader;
}

// Helper to create score card
function createScoreCard() {
  const myScore = document.createElement("div");
  myScore.setAttribute("id", "my-score");
  const gwIdentifier = document.createElement("div");
  gwIdentifier.setAttribute("id", "gameweek-identifier");
  myScore.appendChild(gwIdentifier);
  return myScore;
}

// Helper to create pitch
function createPitch() {
  const pitch = document.createElement("div");
  pitch.setAttribute("id", "pitch");

  [
    "my-keeper",
    "my-defenders",
    "my-midfielders",
    "my-strikers",
    "my-bench",
  ].forEach((id) => {
    const section = document.createElement("div");
    section.setAttribute("id", id);
    pitch.appendChild(section);
  });

  return pitch;
}

// Fetch the team data for the gameweek
async function fetchGwTeamData() {
  const response = await fetch(
    `${BASE_URL}/entry/${theUser.info.team_id}/event/${currentGw}/picks/`
  );

  return response.json();
}

// Fetch the team data for the gameweek
async function fetchPreviousGwTeamData() {
  const response = await fetch(
    `${BASE_URL}/entry/${theUser.info.team_id}/event/${currentGw - 1}/picks/`
  );
  return response.json();
}

// Render the team based on fetched data

async function renderTeam(data) {
  const { picks } = data;
  const app = document.getElementById("app");

  let captainPick, viceCaptainPick;
  let tripleCaptain = false;

  for (const pick of picks) {
    if (pick.position > 15) continue; // Stop the loop if pick.position is greater than 15

    //console.log(pick);
    let pointsMultiplier = pick.multiplier || 1;
    const playerEP = getPlayerEP(pick.element) * pointsMultiplier;
    const playerScore = getPlayerScore(pick.element) * pointsMultiplier;

    if (pick.is_vice_captain) viceCaptainPick = pick.element;
    if (pick.is_captain) captainPick = pick.element;

    const card = createPlayerCard(
      pick.element,
      playerScore,
      pick.is_captain,
      pick.is_vice_captain,
      pointsMultiplier
    );

    const position =
      pick.position > 11
        ? "my-bench"
        : getPositionSection(getPlayerType(pick.element));

    document.getElementById(position).appendChild(card);
  }
  //Assistant Manager
  for (const pick of picks) {
    if (pick.position !== 16) continue; // Skip all picks that are not position 16

    //console.log(pick);
    let pointsMultiplier = pick.multiplier || 1;
    const playerEP = getPlayerEP(pick.element) * pointsMultiplier;
    const playerScore = getPlayerScore(pick.element) * pointsMultiplier;

    if (pick.is_vice_captain) viceCaptainPick = pick.element;
    if (pick.is_captain) captainPick = pick.element;

    const card = createManagerCard(
      pick.element,
      playerScore,
      pick.is_captain,
      pick.is_vice_captain
    );
    const position =
      pick.position > 11
        ? "my-bench"
        : getPositionSection(getPlayerType(pick.element));

    document.getElementById(position).prepend(card);
  }

  updateScoreCard(data);
  setTimeout(() => {
    console.log("loading");
  }, 3000);

  addCaptainBadge();
  //addSantaHatsToPlayers();
}

// Helper to create a player card
function createPlayerCard(
  elementId,
  score,
  isCaptain,
  isViceCaptain,
  isTriple
) {
  const card = document.createElement("div");
  card.classList.add("player");
  card.classList.add("type" + getPlayerType(elementId));
  card.id = elementId;
  const img = document.createElement("img");
  img.setAttribute("class", "player-img");
  img.src = `https://resources.premierleague.com/premierleague/photos/players/250x250/p${getPlayerPhoto(
    elementId
  ).slice(0, -3)}png`;

  //console.log(elementId, score, isCaptain, isViceCaptain, isTriple)

  const name = document.createElement("div");
  if (isCaptain) {
    name.className = "my-captain-name";
  } else if (isViceCaptain) {
    name.className = "my-vice-captain-name";
  } else {
    name.className = "my-player-name";
  }
  if (isTriple == 3) {
    name.className = "my-triple-captain-name";
  }
  name.textContent = getPlayerWebName(elementId).slice(0, 10);

  const scoreText = document.createElement("div");
  scoreText.className = "my-player-xp";
  scoreText.textContent = score;

  card.append(img, name, scoreText);

  return card;
}
function createManagerCard(elementId, score, isCaptain, isViceCaptain) {
  //console.log(getPlayerPhoto(elementId));
  const card = document.createElement("div");
  card.classList.add("player");
  card.classList.add("type" + getPlayerType(elementId));
  card.id = elementId;
  const img = document.createElement("img");
  img.setAttribute("class", "player-img");
  img.src = `https://fpltoolbox.com/wp-content/uploads/2025/02/icons8-manager-50.png`;

  const name = document.createElement("div");
  if (isCaptain) {
    name.className = "my-captain-name";
  } else if (isViceCaptain) {
    name.className = "my-vice-captain-name";
  } else {
    name.className = "my-player-name";
  }

  name.textContent = getPlayerWebName(elementId).slice(0, 10);

  const scoreText = document.createElement("div");
  scoreText.className = "my-player-xp";
  scoreText.textContent = score;

  card.append(img, name, scoreText);

  return card;
}

// Get the section ID for a player type
function getPositionSection(playerType) {
  return {
    1: "my-keeper",
    2: "my-defenders",
    3: "my-midfielders",
    4: "my-strikers",
  }[playerType];
}

// Update score card with total points
async function updateScoreCard(data) {
  //console.log(data);
  const myScore = document.getElementById("my-score");
  const {
    points,
    total_points: totalPoints,
    overall_rank: overallRank,
    rank: gwRank,
  } = data.entry_history;

  let liveScore = 0; // Use 'let' so the value can be updated
  let highestScore = 0; // Variable to track the highest raw score
  let highestScoringPlayer = null; // Variable to track the player with the highest raw score

  for (let i = 0; i < 11; i++) {
    const player = data.picks[i]; // Get the player data
    const playerRawScore = getPlayerScore(player.element); // Raw score without multiplier
    const playerScore = playerRawScore * player.multiplier; // Calculate the player's total score
    liveScore += playerScore; // Increment liveScore by the player's score

    // Check if this player's raw score is the highest so far
    if (playerRawScore > highestScore) {
      highestScore = playerRawScore; // Update the highest raw score
      highestScoringPlayer = player; // Store the player with the highest raw score
    }
  }

  // Output the total live score and the player with the highest raw score
  //console.log(`Total live score: ${liveScore}`);
  // if (highestScoringPlayer) {
  //   console.log(
  //     `Highest scoring player: ${getPlayerWebName(
  //       highestScoringPlayer.element
  //     )} with ${highestScore} raw points`
  //   );
  // }

  const playerOfTheWeek = createPlayerOfTheWeekCard(
    highestScoringPlayer.element
  );
  playerOfTheWeek.classList.add("player-of-the-week");
  console.log(playerOfTheWeek);

  function createPlayerOfTheWeekCard(elementId) {
    const card = document.createElement("div");
    card.classList.add("player");
    card.classList.add("type" + getPlayerType(elementId));
    const img = document.createElement("img");
    img.setAttribute("class", "player-img");
    img.src = `https://resources.premierleague.com/premierleague/photos/players/250x250/p${getPlayerPhoto(
      elementId
    ).slice(0, -3)}png`;

    const name = document.createElement("div");
    name.className = "my-player-name";
    name.textContent = getPlayerWebName(elementId).slice(0, 10);

    const scoreText = document.createElement("div");
    scoreText.className = "my-player-xp";
    scoreText.textContent = getPlayerScore(elementId);

    // Create a new image element
    const star = document.createElement("div");
    star.innerHTML = "⭐";
    star.style.textAlign = "left";
    star.style.width = "30px";
    star.style.marginBottom = "-5px";
    star.style.zIndex = "20";
    star.margin = "0";
    //star.style.transform = "rotate(10deg)"; // Rotate the image slightly

    card.append(star, img, name, scoreText);

    return card;
  }

  const formattedOverallRank = overallRank.toLocaleString();
  const formattedGwRank = gwRank ? gwRank.toLocaleString() : "";

  // Fetch previous gameweek data
  const previousData = await fetchPreviousGwTeamData();
  const previousRank = previousData.entry_history.overall_rank;
  console.log(previousRank);

  // Determine rank change and difference
  const isRankImproved = previousRank > overallRank;
  const rankArrow = isRankImproved
    ? `<img src="https://fpltoolbox.com/wp-content/uploads/2024/12/green-arrow.png" style="max-width:30px">`
    : `<img src="https://fpltoolbox.com/wp-content/uploads/2024/12/red-arrow.png" style="rotate:180deg; max-width:30px">`;

  const rankDifference = previousRank - overallRank;
  const rankDifferenceDisplay = `
    <div class="rank-difference" style="color:${
      isRankImproved ? "#05FA87" : "#FC2C80"
    };">
      ${isRankImproved ? "+" : ""}${rankDifference.toLocaleString()}
    </div>`;

  function calculatePercentileRank(userRank, totalTeams) {
    if (totalTeams <= 0 || userRank <= 0) {
      throw new Error("Total teams and user rank must be positive numbers.");
    }

    let percentileRank = (1 - userRank / totalTeams) * 100;
    let topPercentage = (100 - percentileRank).toFixed(2);
    return topPercentage;
  }

  // Update the scorecard
  myScore.innerHTML = `
  <div id="score-panel">
 
 
      <div id="first-panel">
      <div class="rank-percentile">Top: ${calculatePercentileRank(
        overallRank,
        bootstrap.total_players
      )}%</div>
      <div id="rank-container"><div id="rank-change">${rankArrow}</div><div id="rank-difference-text" style="font-size:1.2rem">${rankDifferenceDisplay}</div></div>
      <div style="font-size:0.7rem">OR: ${formattedOverallRank}</div>
          <div style="font-size:0.7rem">Total: ${totalPoints}pts</div>
           
        
       
      </div>

      <div id="middle-panel">
        <div id="team-name">${loggedInTeamName}</div>
        <div id="gameweek-identifier">GW ${currentGw}:</div>
        <div id="actual-points">${points}</div>
        <div id="players-played"></div>
        <div id="expected-points">...calculating</div>
      </div>

      <div id="third-panel">
        
        ${playerOfTheWeek.outerHTML}
      </div>
    </div>
    <div id="points-summary"></div>`;

  //<div id:"live-score">Live: ${liveScore}</div>
}

// Fetch and render upcoming fixtures for each player
async function fetchAndRenderUpcomingFixtures(data) {
  for (let i = 0; i < data.picks.length && i < 16; i++) {
    const pick = data.picks[i];
    const fixtures = await fetchPlayerFixtures(pick.element);
    const playerDiv = document.getElementById(pick.element);
    const upcomingFixturesDiv = createUpcomingFixtures(fixtures);
    playerDiv.appendChild(upcomingFixturesDiv);
  }
}

// Fetch player's fixtures from API
async function fetchPlayerFixtures(elementId) {
  const response = await fetch(`${BASE_URL}/element-summary/${elementId}/`);
  const data = await response.json();

  return data.fixtures.slice(0, 5);
}

// Create fixtures display for a player
function createUpcomingFixtures(fixtures) {
  const fixturesDiv = document.createElement("div");
  fixturesDiv.classList.add("up-coming-fixtures");

  fixtures.forEach((fixture) => {
    //console.log(fixture)
    const fixtureDiv = document.createElement("div");
    fixtureDiv.id = `diff${fixture.difficulty}`;
    fixtureDiv.setAttribute("class", "fixtureDiv");
    let homeAway;
    if (fixture.is_home == true) {
      homeAway =
        "<div class='homeawaygame'>" +
        getTeamShortName(fixture.team_a) +
        "</div><div class='homeaway'>H</div>";
    } else {
      homeAway =
        "<div class='homeawaygame'>" +
        getTeamShortName(fixture.team_h) +
        "</div><div class='homeaway'>A</div>";
    }
    fixtureDiv.innerHTML = homeAway;
    fixturesDiv.appendChild(fixtureDiv);
  });

  return fixturesDiv;
}

// Fetch and render fixtures for whole season
async function fetchAndRenderFixturesForAllSeason(data) {
  const app = document.getElementById("app");
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = "Fixtures for the rest of the season:";
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  const container = document.createElement("div");
  container.setAttribute("id", "season-container");
  app.appendChild(container);
  // Add a header above the table
  const gwHeaders = document.createElement("div");
  gwHeaders.setAttribute("id", "gw-headers");

  for (let i = 0; i < data.picks.length && i < 16; i++) {
    const pick = data.picks[i];
    const fixtures = await fetchPlayerFixturesForSeason(pick.element);
    const playerDiv = document.createElement("div");
    playerDiv.setAttribute("id", "season-fixtures");
    playerDiv.style.display = "flex";
    const player = document.createElement("img");
    player.setAttribute("class", "player-fixture-img");
    player.src =
      "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
      getPlayerPhoto(data.picks[i].element).slice(0, -3) +
      "png";

    playerDiv.appendChild(player);

    const upcomingFixturesDiv = createUpcomingFixturesForAllSeason(fixtures);
    playerDiv.appendChild(upcomingFixturesDiv);

    container.appendChild(playerDiv);
  }
}
// Fetch player's fixtures for the whole season from API
async function fetchPlayerFixturesForSeason(elementId) {
  const response = await fetch(`${BASE_URL}/element-summary/${elementId}/`);
  const data = await response.json();
  return data.fixtures;
}
// Create fixtures display for a player
function createUpcomingFixturesForAllSeason(fixtures) {
  const fixturesDiv = document.createElement("div");
  fixturesDiv.classList.add("up-coming-season-fixtures");
  fixtures.forEach((fixture) => {
    const fixtureDiv = document.createElement("div");

    let homeAway;
    if (fixture.is_home == true) {
      homeAway = "H";
    } else {
      homeAway = "A";
    }
    fixtureDiv.innerHTML =
      getTeamShortName(`${fixture.team_h}`) +
      "<br>" +
      getTeamShortName(`${fixture.team_a}`) +
      "<br>" +
      "(" +
      homeAway +
      ")";
    fixtureDiv.id = `diff${fixture.difficulty}`;
    fixturesDiv.appendChild(fixtureDiv);
  });

  return fixturesDiv;
}

// Fetch and render fixtures for whole season
async function fetchAndRenderFixturesForNonOwned(data) {
  const app = document.getElementById("app");
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = "Fixtures for Top Players that you don't own:";
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  const container = document.createElement("div");
  container.setAttribute("id", "season-container");
  app.appendChild(container);
  // Add a header above the table
  //console.log(data.picks);
  //console.log(top5TransferredIn);

  // Filter `data.picks` to find picks where `element` is not in `top5TransferredIn.id`
  let unmatchedPicks = top5TransferredIn.filter(
    (pick) => !data.picks.some((player) => player.element === pick.id)
  );

  //console.log(
  //  "Picks with elements not found in top5TransferredIn:",
  //  unmatchedPicks
  //);

  for (let i = 0; i < unmatchedPicks.length; i++) {
    const fixtures = await fetchPlayerFixturesForNonOwned(unmatchedPicks[i].id);

    const playerDiv = document.createElement("div");
    playerDiv.setAttribute("id", "season-fixtures-non-owned");
    playerDiv.style.display = "flex";
    const player = document.createElement("img");
    player.setAttribute("class", "player-fixture-img");
    player.src =
      "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
      getPlayerPhoto(unmatchedPicks[i].id).slice(0, -3) +
      "png";

    playerDiv.appendChild(player);

    const upcomingFixturesDiv = createUpcomingFixturesForNonOwned(fixtures);
    playerDiv.appendChild(upcomingFixturesDiv);

    container.appendChild(playerDiv);
  }
}
// Fetch player's fixtures for the whole season from API
async function fetchPlayerFixturesForNonOwned(elementId) {
  const response = await fetch(`${BASE_URL}/element-summary/${elementId}/`);
  const data = await response.json();
  return data.fixtures;
}
// Create fixtures display for a player
function createUpcomingFixturesForNonOwned(fixtures) {
  const fixturesDiv = document.createElement("div");
  fixturesDiv.classList.add("up-coming-season-fixtures");
  //console.log(fixtures);

  fixtures.forEach((fixture) => {
    const fixtureDiv = document.createElement("div");
    let homeAway;
    if (fixture.is_home == true) {
      homeAway = "H";
    } else {
      homeAway = "A";
    }
    fixtureDiv.innerHTML =
      getTeamShortName(`${fixture.team_h}`) +
      "<br>" +
      getTeamShortName(`${fixture.team_a}`) +
      "<br>" +
      "(" +
      homeAway +
      ")";
    fixtureDiv.id = `diff${fixture.difficulty}`;
    fixturesDiv.appendChild(fixtureDiv);
  });

  return fixturesDiv;
}

// Fetch player's current game stats from API
async function fetchPlayerCurrentStats(elementId) {
  const response = await fetch(`${BASE_URL}/element-summary/${elementId}/`);
  const data = await response.json();
  return data.history.slice(-1);
}
// Initialize counters for players played
async function calculatePlayersPlayed(data) {
  const fixturesPromises = []; // Array to store promises for fetchPlayerCurrentStats

  for (let i = 0; i < data.picks.length && i < 11; i++) {
    const pick = data.picks[i];
    // Add the fetchPlayerCurrentStats promise to the array
    fixturesPromises.push(fetchPlayerCurrentStats(pick.element));
  }

  // Wait for all fetchPlayerCurrentStats calls to complete
  const fixturesArray = await Promise.all(fixturesPromises);

  // Flatten the fixtures array if fetchPlayerCurrentStats returns arrays of fixtures
  const fixtures = fixturesArray.flat();

  // Initialize counters
  let played = 0;
  let leftToPlay = 0;

  fixtures.forEach((fixture) => {
    // Check if the game has kicked off
    const dateString = fixture.kickoff_time;
    const fixtureDate = new Date(dateString);
    const now = new Date();

    if (fixtureDate < now) {
      // Increment the 'played' counter
      played++;
    } else {
      // Increment the 'leftToPlay' counter
      leftToPlay++;
    }
  });

  // Update the DOM
  const playersPlayed = document.getElementById("players-played");
  playersPlayed.innerHTML = `${played}/11 played`;
}

// Create stats display for a player
function createAdditionalStats(fixtures) {
  const statsDiv = document.createElement("div");
  statsDiv.setAttribute("id", "additional-stats");
  statsDiv.classList.add("additional-stats");

  fixtures.forEach((fixture) => {
    const stat0Div = document.createElement("div");
    stat0Div.id = "stat0";
    const stat1Div = document.createElement("div");
    stat1Div.id = "stat1";
    const stat2Div = document.createElement("div");
    stat2Div.id = "stat2";
    const stat3Div = document.createElement("div");
    stat3Div.id = "stat3";
    const stat4Div = document.createElement("div");
    stat4Div.id = "stat4";
    const stat5Div = document.createElement("div");
    stat5Div.id = "stat5";
    const stat6Div = document.createElement("div");
    stat6Div.id = "stat6";
    const stat7Div = document.createElement("div");
    stat7Div.id = "stat7";

    // Check if fixture has kicked off
    const dateString = fixture.kickoff_time;
    const fixtureDate = new Date(dateString);
    const now = new Date();

    // Conditionally set innerHTML for each stat
    if (fixture.clean_sheets > 0 && getPlayerType(fixture.element) < 4) {
      stat0Div.innerHTML = "<div class='breakdown-stats'>🆑</div>";
    }
    stat1Div.innerHTML = "<div class='breakdown-stats'>⚽</div>".repeat(
      fixture.goals_scored
    );

    stat2Div.innerHTML = "<div class='breakdown-stats'>🅰️</div>".repeat(
      fixture.assists
    );

    if (fixture.bonus >= 1) {
      stat3Div.innerHTML = "<div class='breakdown-stats'>🅱️</div>";
    }
    // Extract components
    const dayName = fixtureDate.toDateString().split(" ")[0]; // "Tue"
    // Extract hours and minutes
    const hours = String(fixtureDate.getHours()).padStart(2, "0"); // Ensures 2 digits
    const minutes = String(fixtureDate.getMinutes()).padStart(2, "0"); // Ensures 2 digits

    // Combine into the desired format
    const formattedDate = `${dayName} ${hours}:${minutes}`;
    if (fixture.minutes == 0 && fixtureDate > now) {
      stat4Div.innerHTML = `<div class='breakdown-stats'>${formattedDate}</div>`;
    } else if (fixture.minutes > 0) {
      stat4Div.innerHTML = "<div class='breakdown-stats'>✅</div>";
    } else {
      stat4Div.innerHTML = "<div class='breakdown-stats'>❌</div>";
    }

    if (fixture.yellow_cards != 0) {
      stat5Div.innerHTML = "<div class='breakdown-stats'>🟨</div>";
    }
    if (fixture.red_cards != 0) {
      stat6Div.innerHTML = "🟥";
    }
    if (fixture.red_cards != 0) {
      stat7Div.innerHTML = "🟥";
    }

    // Append each div to the statsDiv only if it has content
    if (stat0Div.innerHTML) {
      statsDiv.appendChild(stat0Div);
    }
    if (stat1Div.innerHTML) {
      statsDiv.appendChild(stat1Div);
    }
    if (stat2Div.innerHTML) {
      statsDiv.appendChild(stat2Div);
    }
    if (stat3Div.innerHTML) {
      statsDiv.appendChild(stat3Div);
    }
    if (stat4Div.innerHTML) {
      statsDiv.appendChild(stat4Div);
    }
    if (stat5Div.innerHTML) {
      statsDiv.appendChild(stat5Div);
    }
    if (stat6Div.innerHTML) {
      statsDiv.appendChild(stat6Div);
    }
    if (stat7Div.innerHTML) {
      statsDiv.appendChild(stat7Div);
    }

    if (fixture.round == currentGw) {
      console.log("current gw");
    } else {
      statsDiv.innerHTML = "❌";
    }
  });

  return statsDiv;
}

// Fetch and render additional stats for each player
async function fetchAndRenderAdditionalStats(data) {
  for (let i = 0; i < data.picks.length && i < 16; i++) {
    const pick = data.picks[i];
    const fixtures = await fetchPlayerCurrentStats(pick.element);

    const playerDiv = document.getElementById(pick.element);
    const additionlStatsDiv = createAdditionalStats(fixtures);

    playerDiv.prepend(additionlStatsDiv);
  }
}

/////////////////////NEW stat
// Create stats display for a player
function createTransferStats(fixtures) {
  const statsDiv = document.createElement("div");
  statsDiv.setAttribute("id", "transfer-stats");
  statsDiv.classList.add("transfer-stats");
  fixtures.forEach((fixture) => {
    //console.log(fixture);
    const stat1Div = document.createElement("div");
    const stat2Div = document.createElement("div");
    const stat3Div = document.createElement("div");

    // Check if game has kicked off
    const dateString = fixture.kickoff_time;
    const fixtureDate = new Date(dateString);
    const now = new Date();

    // Conditionally set innerHTML for each stat

    stat1Div.innerHTML = "⬅️" + fixture.transfers_in;

    stat2Div.innerHTML = "➡️" + fixture.transfers_out;

    // Append each div to the statsDiv only if it has content
    if (stat1Div.innerHTML) {
      statsDiv.appendChild(stat1Div);
    }
    if (stat2Div.innerHTML) {
      statsDiv.appendChild(stat2Div);
    }
    if (stat3Div.innerHTML) {
      statsDiv.appendChild(stat3Div);
    }
  });

  return statsDiv;
}
// Fetch and render transfer stats for each player
async function fetchAndRenderTransferStats(data) {
  for (let i = 0; i < data.picks.length && i < 11; i++) {
    const pick = data.picks[i];
    const fixtures = await fetchPlayerCurrentStats(pick.element);

    const playerDiv = document.getElementById(pick.element);
    const transferStatsDiv = createTransferStats(fixtures);
    playerDiv.prepend(transferStatsDiv);
  }
}
const expectedPointsArray = [];
function updateXp() {
  //console.log(expectedPointsArray);
  if (expectedPointsArray.length == 11) {
    const xpSum = expectedPointsArray.reduce((sum, val) => sum + val, 0);
    document.getElementById("expected-points").innerHTML = "xp " + xpSum;
  }
}
// Create xp stats display for a player
function createXpStats(fixtures) {
  const statsDiv = document.createElement("div");
  statsDiv.setAttribute("id", "xp-stats");
  statsDiv.classList.add("xp-stats");

  //console.log(fixtures);

  const playerEP = getPlayerEP(fixtures[0].element);
  expectedPointsArray.push(parseInt(playerEP));

  const stat1Div = document.createElement("div");
  stat1Div.innerHTML = playerEP;

  // Append each div to the statsDiv only if it has content
  if (stat1Div.innerHTML) {
    statsDiv.appendChild(stat1Div);
  }

  updateXp();
  return statsDiv;
}
// Fetch and render xp stats for each player
async function fetchAndRenderXpStats(data) {
  for (let i = 0; i < data.picks.length && i < 11; i++) {
    const pick = data.picks[i];
    const fixtures = await fetchPlayerCurrentStats(pick.element);

    const playerDiv = document.getElementById(pick.element);
    const xpStatsDiv = createXpStats(fixtures);
    playerDiv.prepend(xpStatsDiv);
  }
}

//////////////////////////// END of MY TEAM 2.0

// Fetch player's fixtures from API
async function fetchPlayerCurrentFixture(elementId) {
  const response = await fetch(`${BASE_URL}/element-summary/${elementId}/`);
  const data = await response.json();

  return data;
}

const positiveWords = [
  "Crushing it!",
  "Transfer genius!",
  "Gameweek wizardry!",
  "Pure brilliance!",
  "That’s how it’s done!",
  "Strategic mastermind!",
  "Unstoppable!",
  "They're playing 3D chess!",
  "Top of the game!",
  "Transfer sorcery!",
  "Masterstroke!",
  "They're on fire!",
  "Savvy choices!",
  "Legendary moves!",
  "They've got the magic touch!",
  "Next-level thinking!",
  "Transfer king!",
  "Ruthless efficiency!",
  "They’ve cracked the code!",
  "The transfer whisperer!",
  "Total domination!",
  "They’re in beast mode!",
  "Victory secured!",
  "Master of the game!",
  "Unbeatable moves!",
  "They know what they’re doing!",
  "Winning mentality!",
  "Absolute pro-level!",
];
const negativeWords = [
  "Awkward.",
  "Ouch, that didn't work.",
  "That was a tough one.",
  "Not their best move.",
  "Could have gone better.",
  "Not the best decision.",
  "Better luck next time!",
  "Unlucky, Bro.",
  "That’s a bit of a miss.",
  "Oops, wrong call.",
  "A bit of a flop.",
  "That didn't pan out.",
  "Missed opportunity.",
  "That backfired.",
  "Not the outcome they hoped for.",
  "A real head-scratcher.",
  "Definitely not their finest hour.",
  "Disastrous choice.",
  "Could’ve been worse, but not much.",
  "Big gamble, big loss.",
  "Not quite the magic they were looking for.",
  "That was a misfire.",
  "Total failure.",
  "Regrettable decision.",
  "A real blunder.",
  "Not the best outcome.",
  "Could have been a lot better.",
  "Complete flop.",
  "What a disappointment.",
  "That didn’t go to plan.",
  "Tough luck, mate.",
  "That’s a real setback.",
];
function getRandomPhrase(phrases) {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
}
//TRANSFER FAILS CODE
async function showTransferFails() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = new LoadingBar(app);
  loader.start();

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Gameweek ${currentGw} Transfer Summaries`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  try {
    if (!createLeaguePromise) {
      console.error("Not yet.");
      return;
    }

    await createLeaguePromise;
    //console.log("Finally, it's finished.");
    let scoreCounter = 0;

    for (const element of league) {
      const gwTransfers = [];

      // Iterate through each transfer and call fetchPlayerFixtures
      for (const transfer of element.transfers[0].filter(
        (transfer) => transfer.event === currentGw
      )) {
        const p1Fixture = await fetchPlayerCurrentFixture(transfer.element_in);
        const p2Fixture = await fetchPlayerCurrentFixture(transfer.element_out);

        // Check if the fixture data exists and is finished
        if (
          p1Fixture.fixtures[0].event != currentGw &&
          p2Fixture.fixtures[0].event != currentGw
        ) {
          gwTransfers.push(transfer);
        }
      }
      // console.log(element.everyGw[element.everyGw.length - 1].transfers_cost);
      // console.log(
      //   gwTransfers.length +
      //     " " +
      //     element.everyGw[element.everyGw.length - 1].transfers
      // );
      //const transferCost = element.everyGw[element.everyGw.length - 1].transfers_cost
      //console.log(transferCost)
      let transferCost;
      if (element.everyGw[element.everyGw.length - 1].transfers_cost) {
        transferCost =
          element.everyGw[element.everyGw.length - 1].transfers_cost;
      } else {
        transferCost = 0;
      }

      if (
        gwTransfers.length ==
        element.everyGw[element.everyGw.length - 1].transfers
      ) {
        let totalScoreIn = gwTransfers.reduce(
          (sum, transfer) => sum + getPlayerScore(transfer.element_in),
          0
        );
        let totalScoreOut = gwTransfers.reduce(
          (sum, transfer) => sum + getPlayerScore(transfer.element_out),
          0
        );
        //Fails
        if (totalScoreIn - transferCost < totalScoreOut) {
          const team = document.createElement("div");
          team.setAttribute("id", "transfer-team");
          team.classList.add("transfer-fail");
          const teamHeader = document.createElement("div");
          teamHeader.setAttribute("id", "team-header");

          const entry = document.createElement("div");
          entry.innerHTML = `
          <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
          <div style="font-size:0.7rem">${element.player_name}</div>
        `;
          teamHeader.append(entry);

          const chip = document.createElement("div");
          chip.setAttribute("id", "transfer-team-chip");

          if (element.currentWeek[0].active_chip) {
            chip.innerHTML =
              "Chip Activated: " +
              convertChipName(element.currentWeek[0].active_chip);
            teamHeader.appendChild(chip);
          }

          team.appendChild(teamHeader);

          const transfersDiv = document.createElement("div");
          transfersDiv.setAttribute("id", "team-transfers");

          gwTransfers.forEach((xfr) => {
            console.log(xfr);
            const transferDiv = document.createElement("div");
            transferDiv.setAttribute("id", "player-transfer");
            const tIn = document.createElement("div");
            tIn.setAttribute("id", "player-in");

            const cardIn = createPlayerCard(
              xfr.element_in,
              getPlayerScore(xfr.element_in),
              false,
              false,
              false
            );
            tIn.appendChild(cardIn);

            const tInArrow = document.createElement("img");
            tInArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tInArrow.setAttribute("id", "transfer-direction-in");
            tIn.append(tInArrow);

            const tOut = document.createElement("div");
            tOut.setAttribute("id", "player-out");

            const tOutArrow = document.createElement("img");
            tOutArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tOutArrow.setAttribute("id", "transfer-direction-out");
            tOut.append(tOutArrow);

            const cardOut = createPlayerCard(
              xfr.element_out,
              getPlayerScore(xfr.element_out),
              false,
              false,
              false
            );
            tOut.appendChild(cardOut);

            transferDiv.appendChild(tOut);
            transferDiv.appendChild(tIn);

            transfersDiv.appendChild(transferDiv);
            team.appendChild(transfersDiv);
          });

          const transferSummary = document.createElement("div");
          transferSummary.setAttribute("id", "transfer-summary");
          const summeryText = document.createElement("div");
          summeryText.innerHTML =
            `${element.player_name} got ${totalScoreIn} points from the players that they transferred in this week (for a cost of ${transferCost}). The players that they transferred out got ${totalScoreOut}. ` +
            getRandomPhrase(negativeWords);

          const netPoints = document.createElement("div");
          netPoints.setAttribute("id", "net-points");

          netPoints.innerHTML =
            totalScoreOut - (totalScoreIn - transferCost) + "pts";

          if (Math.sign(totalScoreIn) == -1) {
            netPoints.innerHTML = totalScoreOut + "pts";
          }

          transferSummary.appendChild(summeryText);
          transferSummary.appendChild(netPoints);

          const shareData = {
            title: "Whooops",
            text: `${element.entry_name} - ` + summeryText.innerHTML,
            url: "https://fpltoolbox.com/transfer-fails/",
          };

          const shareButton = document.createElement("span");
          shareButton.innerText = "📨";
          shareButton.setAttribute("id", "share-points");

          // Share must be triggered by "user activation"
          shareButton.addEventListener("click", async () => {
            try {
              await navigator.share(shareData);
            } catch (err) {
              console.log(`Error: ${err}`);
            }
          });
          netPoints.append(shareButton);

          team.appendChild(transferSummary);
          app.appendChild(team);
        }
        //Successes
        if (totalScoreIn - transferCost > totalScoreOut) {
          const team = document.createElement("div");
          team.setAttribute("id", "transfer-team");
          team.classList.add("transfer-success");
          const teamHeader = document.createElement("div");
          teamHeader.setAttribute("id", "team-header");

          const entry = document.createElement("div");
          entry.innerHTML = `
          <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
          <div style="font-size:0.7rem">${element.player_name}</div>
        `;
          teamHeader.append(entry);

          const chip = document.createElement("div");
          chip.setAttribute("id", "transfer-team-chip");

          if (element.currentWeek[0].active_chip) {
            chip.innerHTML =
              "Chip Activated: " +
              convertChipName(element.currentWeek[0].active_chip);
            teamHeader.appendChild(chip);
          }

          team.appendChild(teamHeader);

          const transfersDiv = document.createElement("div");
          transfersDiv.setAttribute("id", "team-transfers");

          gwTransfers.forEach((xfr) => {
            console.log(xfr);
            const transferDiv = document.createElement("div");
            transferDiv.setAttribute("id", "player-transfer");
            const tIn = document.createElement("div");
            tIn.setAttribute("id", "player-in");

            const cardIn = createPlayerCard(
              xfr.element_in,
              getPlayerScore(xfr.element_in),
              false,
              false,
              false
            );
            tIn.appendChild(cardIn);

            const tInArrow = document.createElement("img");
            tInArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tInArrow.setAttribute("id", "transfer-direction-in");
            tIn.append(tInArrow);

            const tOut = document.createElement("div");
            tOut.setAttribute("id", "player-out");

            const tOutArrow = document.createElement("img");
            tOutArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tOutArrow.setAttribute("id", "transfer-direction-out");
            tOut.append(tOutArrow);

            const cardOut = createPlayerCard(
              xfr.element_out,
              getPlayerScore(xfr.element_out),
              false,
              false,
              false
            );
            tOut.appendChild(cardOut);

            transferDiv.appendChild(tOut);
            transferDiv.appendChild(tIn);

            transfersDiv.appendChild(transferDiv);
            team.appendChild(transfersDiv);
          });

          const transferSummary = document.createElement("div");
          transferSummary.setAttribute("id", "transfer-summary");
          const summeryText = document.createElement("div");
          summeryText.innerHTML =
            `${element.player_name} got ${totalScoreIn} points from the players that they transferred in this week (for a cost of ${transferCost}). The players that they transferred out got ${totalScoreOut}. ` +
            getRandomPhrase(positiveWords);

          const netPoints = document.createElement("div");
          netPoints.setAttribute("id", "net-points");

          netPoints.innerHTML =
            totalScoreIn - transferCost - totalScoreOut + "pts";

          if (Math.sign(totalScoreIn) == -1) {
            netPoints.innerHTML = totalScoreOut + "pts";
          }

          transferSummary.appendChild(summeryText);
          transferSummary.appendChild(netPoints);

          const shareData = {
            title: "Whooops",
            text: `${element.entry_name} - ` + summeryText.innerHTML,
            url: "https://fpltoolbox.com/transfer-fails/",
          };

          const shareButton = document.createElement("span");
          shareButton.innerText = "📨";
          shareButton.setAttribute("id", "share-points");

          // Share must be triggered by "user activation"
          shareButton.addEventListener("click", async () => {
            try {
              await navigator.share(shareData);
            } catch (err) {
              console.log(`Error: ${err}`);
            }
          });
          netPoints.append(shareButton);

          team.appendChild(transferSummary);
          app.appendChild(team);
        }
      }
    }
    console.log(scoreCounter);
    if (scoreCounter == 0) {
      const team = document.createElement("div");
      team.setAttribute("id", "transfer-team");
      const teamHeader = document.createElement("div");
      teamHeader.setAttribute("id", "team-header");
      teamHeader.innerHTML =
        "Complete - You'll only see something here if each player in a transfer has played their game. If you can't see anything here, check back when a few more games have been played this gameweek";
      teamHeader.style.color = "lightgrey";
      team.appendChild(teamHeader);
      app.appendChild(team);
    }

    insertAdManually("#transfer-team");

    // Stop and clean up the loading bar
    loader.stop();
    loader.remove();
  } catch (error) {
    console.error("Error processing transfers: ", error);
  }
}
//BENCH FAILS CODE
async function showGWBenchFails() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Initialize and start the loading bar
  const loader = new LoadingBar(app);
  loader.start();

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${leagueName} \n Gameweek Bench Fails`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  try {
    if (!createLeaguePromise) {
      console.error("League promise is not ready.");
      return;
    }

    // Wait for the league promise to resolve
    await createLeaguePromise;
    console.log("League data loaded successfully.");

    let hasQualifyingBenches = false; // Flag to track if any team meets the requirements

    league.forEach((element) => {
      const dorContainer = document.createElement("div");
      dorContainer.id = "dor";
      // Create the main team card container
      const team = document.createElement("div");
      team.id = "team-card";
      team.classList.add("bench-card", "bench");

      // Team header
      const teamHeader = document.createElement("div");
      teamHeader.id = "team-header";

      // Add team and player names
      const entry = document.createElement("div");
      entry.innerHTML = `
          <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
          <div style="font-size:0.7rem">${element.player_name}</div>
        `;
      teamHeader.appendChild(entry);

      team.appendChild(teamHeader);

      // Bench player cards
      const benchDiv = document.createElement("div");
      benchDiv.id = "bench-div";
      team.appendChild(benchDiv);

      let totalScore = 0;

      element.currentWeek[0]?.picks.forEach((pick) => {
        if (pick.position > 11 && pick.position < 16) {
          const playerScore = getPlayerScore(pick.element);
          totalScore += playerScore;

          const card = createPlayerCard(
            pick.element,
            playerScore,
            false,
            false,
            false
          );
          benchDiv.appendChild(card);
        }
      });
      // Add chip information if applicable
      let bbactive = "";
      if (element.currentWeek[0]?.active_chip === "bboost") {
        const chip = document.createElement("div");
        chip.id = "transfer-team-chip";
        chip.innerHTML = `<div style="font-size:0.7rem">Bench Boost Activated</div>`;
        teamHeader.appendChild(chip);
        bbactive = "Saved by the bench boost!";
        team.style.backgroundColor = "#05FA8790";
      }
      const benchScore = document.createElement("div");
      benchScore.id = "bench-score";
      benchScore.innerHTML = `${totalScore}<div>pts</div>`;
      teamHeader.appendChild(benchScore);

      const summary = document.createElement("div");
      summary.innerHTML = `${
        element.player_name
      } has left ${totalScore} points on their bench this week! ${getRandomPhrase(
        negativeWords
      )} ${bbactive}`;
      summary.style.display = "flex";
      summary.style.flexDirection = "row";
      summary.style.justifyContent = "space-between";
      summary.style.paddingTop = "15px";
      team.appendChild(summary);

      const watermark = document.createElement("div");
      watermark.id = "watermark";
      watermark.innerHTML = "www.fpltoolbox.com";
      team.appendChild(watermark);

      // Check if bench meets the score requirement
      if (totalScore / 4 >= 2.1) {
        hasQualifyingBenches = true; // At least one team meets the criteria
      } else {
        // Hide the team if it doesn't meet the criteria
        dorContainer.classList.add("hide");
      }

      // Share button
      const shareData = {
        title: "Whooops",
        text: summary.innerHTML,
        url: "https://fpltoolbox.com/gameweek-bench-fails/",
      };

      const shareButton = document.createElement("span");
      shareButton.id = "share-bench-points";
      shareButton.innerText = "📨";

      shareButton.addEventListener("click", async () => {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error(`Error sharing data: ${err}`);
        }
      });

      summary.appendChild(shareButton);
      dorContainer.appendChild(team);
      app.appendChild(dorContainer);
    });

    // If no teams meet the criteria, display a message
    if (!hasQualifyingBenches) {
      const noBenchesCard = document.createElement("div");
      noBenchesCard.id = "no-benches-card";
      noBenchesCard.classList.add("no-benches-message");
      noBenchesCard.innerHTML = `
        <div style="text-align:center; padding: 1rem; font-size:1.2rem;">
          Great work - looks like everyone in this league is doing alright this week! 🎉
        </div>
      `;
      app.appendChild(noBenchesCard);
    }

    // Insert ad halfway through rendering teams
    insertAdManually("#team-card");

    // Stop and clean up the loading bar
    loader.stop();
    loader.remove();
  } catch (error) {
    console.error("Error while rendering the bench fails: ", error);
  }
}

let weeklyPicksPromise = null;
let weeklyPicksCompleted = false; // New flag to track if function has completed

async function weeklyPicksForLeague() {
  console.log(weeklyPicksPromise, weeklyPicksCompleted);
  if (weeklyPicksCompleted) {
    console.log("League update has already completed. Skipping...");
    return weeklyPicksPromise; // Return the existing result
  }

  if (weeklyPicksPromise) {
    console.log("League update already in progress. Waiting for completion...");
    return weeklyPicksPromise; // Return the existing promise
  }

  console.time("Weekly Picks Fetch");

  weeklyPicksPromise = (async () => {
    try {
      console.log(weeklyPicksPromise, weeklyPicksCompleted);
      const app = document.getElementById("app");
      const loaderCard = document.createElement("div");
      const loaderContainer = document.createElement("div");
      loaderContainer.id = "loader-container";
      loaderCard.id = "loader-card";

      loaderCard.textContent = `Depending on the size of the league, this could take a while...`;
      loaderCard.className = "skeleton";
      loaderContainer.appendChild(loaderCard);
      app.append(loaderContainer);

      const cache = new Map();

      for (let i = 0; i < league.length; i++) {
        console.log(league);
        const team = league[i];
        console.log(team);
        if (!team.everyGwPicks || team.everyGwPicks.length === 0) {
          console.warn(`No weekly data available for team ${team.entry}`);
          continue;
        }

        // Initialize stats
        team.total_goals_scored = 0;
        team.total_red_cards = 0;
        team.total_yellow_cards = 0;
        team.total_cards = 0;
        team.total_minutes = 0;
        team.total_assists = 0;
        team.total_clean_sheets = 0;
        team.total_goals_conceded = 0;
        team.total_own_goals = 0;
        team.total_penalties_missed = 0;
        team.total_home_games = 0;
        team.total_away_games = 0;
        team.total_captaincy_points = 0;
        team.total_saves = 0;

        const apiRequests = new Map();

        for (const gameweek of team.everyGwPicks) {
          for (const pick of gameweek.picks) {
            if (pick.position >= 1 && pick.position <= 11) {
              const playerId = pick.element;
              if (cache.has(playerId)) continue;

              const apiUrl = `${BASE_URL}/element-summary/${playerId}/`;
              apiRequests.set(
                playerId,
                fetch(apiUrl).then((res) => res.json())
              );
            }
          }
        }

        const responses = await Promise.allSettled(apiRequests.values());

        let index = 0;
        for (const [playerId] of apiRequests) {
          const result = responses[index++];
          if (result.status === "fulfilled") {
            cache.set(playerId, result.value);
          } else {
            console.error(`Failed to fetch data for player ${playerId}`);
          }
        }

        for (const gameweek of team.everyGwPicks) {
          for (const pick of gameweek.picks) {
            if (pick.position >= 1 && pick.position <= 11) {
              const playerData = cache.get(pick.element);
              if (!playerData) continue;

              const matchingHistories = playerData.history.filter(
                (entry) => entry.round === gameweek.gameweek
              );

              if (matchingHistories.length === 0) continue;

              // Optional: log duplicates
              // if (matchingHistories.length > 1) {
              //   console.warn(
              //     `Multiple entries for ${getPlayerWebName(pick.element)} in GW${gameweek.gameweek}:`,
              //     matchingHistories
              //   );
              // }

              // Aggregate stats across all matching histories
              const combined = matchingHistories.reduce(
                (acc, curr) => {
                  acc.goals_scored += curr.goals_scored;
                  acc.red_cards += curr.red_cards;
                  acc.yellow_cards += curr.yellow_cards;
                  acc.minutes += curr.minutes;
                  acc.assists += curr.assists;
                  acc.clean_sheets += curr.clean_sheets;
                  acc.goals_conceded += curr.goals_conceded;
                  acc.own_goals += curr.own_goals;
                  acc.penalties_missed += curr.penalties_missed;
                  acc.total_points += curr.total_points;
                  acc.saves += curr.saves;

                  // Count home/away games
                  if (curr.was_home) {
                    acc.home_games += 1;
                  } else {
                    acc.away_games += 1;
                  }

                  return acc;
                },
                {
                  goals_scored: 0,
                  red_cards: 0,
                  yellow_cards: 0,
                  minutes: 0,
                  assists: 0,
                  clean_sheets: 0,
                  goals_conceded: 0,
                  own_goals: 0,
                  penalties_missed: 0,
                  total_points: 0,
                  saves: 0,
                  home_games: 0,
                  away_games: 0,
                }
              );

              team.total_goals_scored += combined.goals_scored;
              team.total_red_cards += combined.red_cards;
              team.total_yellow_cards += combined.yellow_cards;
              team.total_cards += combined.yellow_cards + combined.red_cards;
              team.total_minutes += combined.minutes;
              team.total_assists += combined.assists;
              team.total_clean_sheets += combined.clean_sheets;
              team.total_goals_conceded += combined.goals_conceded;
              team.total_own_goals += combined.own_goals;
              team.total_penalties_missed += combined.penalties_missed;
              team.total_saves += combined.saves;
              team.total_home_games += combined.home_games;
              team.total_away_games += combined.away_games;

              if (pick.is_captain) {
                //console.log("GW" + gameweek.gameweek, getPlayerWebName(pick.element), combined.total_points);
                team.total_captaincy_points +=
                  combined.total_points * pick.multiplier;
              }
            }
          }
        }

        //Weekly Scoresheets
        team.gwScoreSheet = [];
        team.gwBenchSheet = [];

        for (const gameweek of team.everyGwPicks) {
          const starters = [];
          const bench = [];

          const gameweekNumber = gameweek.gameweek;

          for (let i = 0; i < gameweek.picks.length; i++) {
            const pick = gameweek.picks[i];
            const playerData = cache.get(pick.element);

            let points = 0;
            if (playerData) {
              const history = playerData.history.find(
                (entry) => entry.round === gameweekNumber
              );
              points = history ? history.total_points * pick.multiplier : 0;
            }

            const pickObj = {
              playerId: pick.element,
              name: getPlayerWebName(pick.element),
              points,
            };

            if (i < 11) {
              starters.push(pickObj);
            } else {
              bench.push(pickObj);
            }
          }

          team.gwScoreSheet.push({
            gameweek: gameweekNumber,
            starters,
          });

          team.gwBenchSheet.push({
            gameweek: gameweekNumber,
            bench,
          });
        }

        loaderCard.textContent = `Team ${i + 1} of ${
          league.length
        } calculated. \n Working on ${team.entry_name}.`;
      }

      console.timeEnd("Weekly Picks Fetch");

      // Mark as completed so it never runs again
      weeklyPicksCompleted = true;
    } finally {
      weeklyPicksPromise = null; // Reset promise but not the completed flag
    }
  })();

  return weeklyPicksPromise;
}

/* HELPERS */
// Manually Insert Advert
function insertAdHalfway() {
  //console.log(theUser.username.data.membership_level.ID);
  if (
    theUser.username.data.membership_level.ID != 10 ||
    theUser.username.data.membership_level.ID != 12
  ) {
    setTimeout(() => {
      const tableBody = document.querySelector("#table tbody"); // Select the tbody
      const rows = tableBody.querySelectorAll("tr"); // Get all rows in the table
      const halfwayIndex = Math.floor(rows.length / 2); // Calculate halfway point

      // Create a new table row to hold the ad
      const adRow = document.createElement("tr");
      const adCell = document.createElement("td");

      // Configure the ad cell
      adCell.colSpan = 12; // Span across all columns
      adCell.innerHTML = `
    <div id="sign-up-ad">
    <h4 style="color: white">Want to remove ads and have faster loading times?</h4>
      <h4 style="color: white">Consider upgrading to FPL Toolbox Pro for only £14.99 per year!</h4>

        <a href="https://fpltoolbox.com/membership-account/membership-levels/">Find out more</a>
    </div>
  `;

      adRow.appendChild(adCell);

      // Insert the ad row at the halfway point
      tableBody.insertBefore(adRow, rows[halfwayIndex]);
    }, 3000); // Ensures it runs after the table is fully loaded
  }
}
function insertAdManually(divIDs) {
  // Check for membership level safely
  if (
    theUser.username.data.membership_level.ID != 10 ||
    theUser.username.data.membership_level.ID != 12
  ) {
    setTimeout(() => {
      // Get all rows in the table
      const rows = document.querySelectorAll(divIDs);
      if (rows.length === 0) {
        console.log("No rows found in the table.");
        return;
      }

      const halfwayIndex = Math.floor(rows.length / 2);

      // Create a new div for the ad
      const adDiv = document.createElement("div");
      adDiv.id = "sign-up-ad";
      adDiv.classList.add("ad-banner");
      adDiv.innerHTML = `
        <div id="sign-up-ad">
    <h4 style="color: white">Want to remove ads and have faster loading times?</h4>
      <h4 style="color: white">Consider upgrading to FPL Toolbox Pro for only £14.99 per year!</h4>

        <a href="https://fpltoolbox.com/membership-account/membership-levels/">Find out more</a>
    </div>`;

      // Insert the adDiv into the table at the halfway point
      rows[halfwayIndex]?.parentNode.insertBefore(adDiv, rows[halfwayIndex]);
    }, 3000); // Ensure the table is fully loaded
  }
}

function createColumnHeader(column, columnName, thead) {
  column = document.createElement("th");
  column.innerText = columnName;
  thead.appendChild(column);
}

// Convert FPL chip name to user-friendly chip names
function convertChipName(chip) {
  const chipMap = {
    wildcard: "WC",
    freehit: "FH",
    bboost: "BB",
    manager: "AM",
    "3xc": "TC",
    "": "",
  };
  return chipMap[chip] || chip;
}

// Make getFootballerObject return a Promise
function getFootballerObject(playerId) {
  return new Promise((resolve, reject) => {
    let footballer_team_id;
    for (var i = 0; i < bootstrap.elements.length; i++) {
      if (bootstrap.elements[i].id == playerId) {
        footballer.web_name = bootstrap.elements[i].web_name;
        footballer.first_name = bootstrap.elements[i].first_name;
        footballer.second_name = bootstrap.elements[i].second_name;
        footballer.event_points = bootstrap.elements[i].event_points;
        footballer.dreamteam = bootstrap.elements[i].in_dreamteam;
        footballer.points_per_game = bootstrap.elements[i].points_per_game;
        footballer_team_id = bootstrap.elements[i].team;
        footballer.transfers_in = bootstrap.elements[i].transfers_in;
        footballer.transfers_in_event =
          bootstrap.elements[i].transfers_in_event;
        footballer.transfers_out = bootstrap.elements[i].transfers_out;
        footballer.transfers_out_event =
          bootstrap.elements[i].transfers_out_event;
        footballer.price_change = bootstrap.elements[i].cost_change_event;
        footballer.news = bootstrap.elements[i].news;
        footballer.team_code = bootstrap.elements[i].team_code;
        footballer.element_type = bootstrap.elements[i].element_type;
        footballer.ep_this = bootstrap.elements[i].ep_this;
        footballer.ep_next = bootstrap.elements[i].ep_next;
        footballer.photo = bootstrap.elements[i].photo;
        footballer.total_points = bootstrap.elements[i].total_points;
        footballer.goals_scored = bootstrap.elements[i].goals_scored;
        footballer.assists = bootstrap.elements[i].assists;
        footballer.type = bootstrap.elements[i].element_type;
      }
    }
    for (var i = 0; i < bootstrap.teams.length; i++) {
      if (bootstrap.teams[i].id == footballer_team_id) {
        footballer.team = bootstrap.teams[i].name;
      }
    }
    resolve(footballer);
  });
}

// Make getPlayerWebName async
async function getPlayerWebName(playerId) {
  await getFootballerObject(playerId); // Wait for the footballer data to be populated
  return footballer.web_name;
}

function getTeamName(teamCode) {
  for (var i = 0; i < bootstrap.teams.length; i++) {
    if (bootstrap.teams[i].id == teamCode) {
      return bootstrap.teams[i].name;
    }
  }
}

function getTeamShortName(teamCode) {
  for (var i = 0; i < bootstrap.teams.length; i++) {
    if (bootstrap.teams[i].id == teamCode) {
      return bootstrap.teams[i].short_name;
    }
  }
}

function getPlayerWebName(playerId) {
  getFootballerObject(playerId);
  return footballer.web_name;
}
function getPlayerType(playerId) {
  getFootballerObject(playerId);
  return footballer.type;
}

function getPlayerScore(playerId) {
  getFootballerObject(playerId);
  return footballer.event_points;
}
function getPlayerAssists(playerId) {
  getFootballerObject(playerId);
  return footballer.assists;
}
function getPlayerGoals(playerId) {
  getFootballerObject(playerId);
  return footballer.goals_scored;
}

function getPlayerTeam(playerId) {
  getFootballerObject(playerId);
  return footballer.team;
}
function getPlayerTeamCode(playerId) {
  getFootballerObject(playerId);
  return footballer.team_code;
}
function getPlayerEP(playerId) {
  getFootballerObject(playerId);
  return footballer.ep_this;
}

function getPlayerTotalPoints(playerId) {
  getFootballerObject(playerId);
  return footballer.total_points;
}

function getPlayerType(playerId) {
  getFootballerObject(playerId);
  return footballer.element_type;
}

function getPlayerPhoto(playerId) {
  getFootballerObject(playerId);
  return footballer.photo;
}

// Loader
class LoadingBar {
  constructor(parentElement) {
    this.progress = 0;
    this.direction = 1; // 1 for increasing, -1 for decreasing

    // Create the container for the loading bar
    this.loadingBarContainer = document.createElement("div");
    this.loadingBarContainer.style.position = "absolute";
    this.loadingBarContainer.style.left = "50%";
    this.loadingBarContainer.style.top = "100px";
    this.loadingBarContainer.style.transform = "translate(-50%, -50%)"; // Center the container
    this.loadingBarContainer.style.width = "80%"; // Set the width to 80% of the screen
    this.loadingBarContainer.style.height = "20px";
    this.loadingBarContainer.style.backgroundColor = "#000";
    this.loadingBarContainer.style.borderRadius = "5px";
    this.loadingBarContainer.style.overflow = "hidden"; // Prevent content from overflowing
    this.loadingBarContainer.setAttribute("id", "loading-bar-container");
    // Create the loading bar itself
    this.loadingBar = document.createElement("div");
    this.loadingBar.style.width = "0%";
    this.loadingBar.style.height = "100%";
    this.loadingBar.style.backgroundColor = "#05FA87";
    this.loadingBar.style.borderRadius = "5px 0 0 5px"; // Round only the starting edge
    this.loadingBarContainer.appendChild(this.loadingBar);

    // Append the loading bar container to the parent element
    parentElement.appendChild(this.loadingBarContainer);

    // Initialize the interval ID
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      if (this.progress >= 100) {
        this.direction = -1; // Start decreasing
      } else if (this.progress <= 0) {
        this.direction = 1; // Start increasing
      }

      this.progress += 2 * this.direction; // Update progress based on direction
      this.loadingBar.style.width = `${this.progress}%`;
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.progress = 100;
    this.loadingBar.style.width = "100%"; // Ensure the bar is fully filled at the end
    console.log("Loading complete.");
  }

  remove() {
    if (this.loadingBarContainer && this.loadingBarContainer.parentElement) {
      this.loadingBarContainer.parentElement.removeChild(
        this.loadingBarContainer
      );
    }
  }
}

async function playerSearch() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  let backGround = document.createElement("div");
  backGround.setAttribute("id", "player-search-card-background");

  let playerSearchCard = document.createElement("div");
  playerSearchCard.setAttribute("id", "player-search-card-background");

  // Create and append search box
  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.placeholder = "Search players...";
  searchBox.id = "search-box";
  app.appendChild(searchBox);

  const loader = createLoader();
  app.appendChild(loader);

  // Store original player data
  const players = bootstrap.elements;

  // Function to render player cards based on search query
  const renderPlayers = async (query = "") => {
    // Clear existing player cards
    document
      .querySelectorAll(".player-search")
      .forEach((card) => card.remove());

    // Filter players based on the query
    const filteredPlayers = players.filter((player) => {
      const playerName = getPlayerWebName(player.id) || "";
      return playerName.toLowerCase().includes(query.toLowerCase());
    });

    // If there is no query, do not render players
    if (query === "") return;

    // Render filtered player cards
    for (const element of filteredPlayers) {
      const card = document.createElement("div");
      card.classList.add("player-search");
      card.id = element.id;

      const img = document.createElement("img");
      img.setAttribute("class", "player-search-img");
      img.src = `https://resources.premierleague.com/premierleague/photos/players/250x250/p${getPlayerPhoto(
        element.id
      ).slice(0, -3)}png`;
      img.style.minWidth = "100%";
      const name = document.createElement("p");
      name.className = "my-player-name";
      name.textContent = getPlayerWebName(element.id).slice(0, 10);

      const scoreText = document.createElement("p");
      scoreText.className = "my-player-xp";
      scoreText.textContent = getPlayerScore(element.id);

      card.append(img, name, scoreText);

      card.classList.add("player-search"); // Ensure we have the correct class for each player card
      playerSearchCard.appendChild(card);
      backGround.appendChild(playerSearchCard);
      app.appendChild(backGround);

      // Fetch the player fixtures
      const fixtures = await fetchPlayerFixtures(element.id);
      const upcomingFixturesDiv = createUpcomingFixtures(fixtures);

      const stats = await fetchPlayerCurrentStats(element.id);

      console.log(stats);

      // Attach the upcoming fixtures to the player card
      const playerDiv = document.getElementById(element.id);
      playerDiv.appendChild(upcomingFixturesDiv);

      const additionlStatsDiv = createAdditionalStats(stats);
      playerDiv.prepend(additionlStatsDiv);
      additionlStatsDiv.style.display = "flex";
    }

    loader.remove(); // Remove loader after rendering players
  };

  // Attach event listener to search box for dynamic filtering
  searchBox.addEventListener("input", (e) => {
    renderPlayers(e.target.value);
  });

  // Initial render: No players will be displayed initially
  renderPlayers(""); // Call with empty string to ensure no players are rendered initially
  loader.remove();
}

const influencersList = [
  {
    influencer: "FPL Harry",
    entry: 3544,
    img: "https://fpltoolbox.com/wp-content/uploads/2025/01/channels4_profile.jpg",
  },
  {
    influencer: "Let's Talk FPL",
    entry: 24,
    img: "https://fpltoolbox.com/wp-content/uploads/2025/01/LTFPL_Icon-1-480x480-1.webp",
  },
  {
    influencer: "FPL Raptor",
    entry: 746,
    img: "https://fpltoolbox.com/wp-content/uploads/2025/01/channels4_profile-1.jpg",
  },
  {
    influencer: "FPL Focal",
    entry: 1301,
    img: "https://fpltoolbox.com/wp-content/uploads/2025/01/ab67656300005f1f8105233ce9dc6cb312e54569.jpg",
  },
  {
    influencer: "Holly Shand",
    entry: 9,
    img: "https://fpltoolbox.com/wp-content/uploads/2025/01/0Fn-qMWH_400x400.jpg",
  },
];

function getinfluencerName(entry) {
  for (let i = 0; i < influencersList.length; i++) {
    if (entry === influencersList[i].entry)
      return influencersList[i].influencer;
  }
}
function getinfluencerImg(entry) {
  for (let i = 0; i < influencersList.length; i++) {
    if (entry === influencersList[i].entry) return influencersList[i].img;
  }
}
function extractTeamIds(arrayOfTeams) {
  return arrayOfTeams.map((team) => team.entry);
}

async function showCopycatFinder() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Add a loader
  const loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  app.appendChild(loader);

  // Add a header above the cards
  const header = document.createElement("h6");
  header.innerText = `Catch a copycat! \n Tap Team To Reveal the Truth`;
  header.style.textAlign = "center";
  app.appendChild(header);

  // Fetch data for influencers
  const arrayOfTeamIds = extractTeamIds(influencersList);
  const influencers = await createInfluencerLeague(arrayOfTeamIds);
  //console.log(league);
  //console.log(influencers);

  // Fetch data for the user's team
  fetch(
    BASE_URL +
      "/entry/" +
      theUser.info.team_id +
      "/event/" +
      currentGw +
      "/picks/"
  )
    .then((res) => res.json())
    .then((data) => {
      myTeam = data;

      // Remove the loader
      loader.remove();

      // Populate cards directly inside the `app`
      league.forEach((element) => {
        const team = document.createElement("div");
        team.id = "team-card";
        team.classList.add("team-card");

        // Team header
        const teamHeader = document.createElement("div");
        teamHeader.id = "team-header";

        // Add team and player names
        const entry = document.createElement("div");
        entry.innerHTML = `
            <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
            <div style="font-size:0.7rem">${element.player_name}</div>
          `;
        teamHeader.appendChild(entry);
        team.appendChild(teamHeader);

        // Add total points
        //   const total = document.createElement("div");
        //   total.classList.add("team-total");
        //   total.innerText = `Total: ${element.total}`;
        //   team.appendChild(total);

        // Add click event for selecting an influencer
        team.addEventListener("click", function () {
          selectInfluencer(element, influencers);
        });

        // Append the card directly to the `app`
        app.appendChild(team);
      });
    })
    .then(() => {
      const div = document.createElement("a");
      div.href = "https://fpltoolbox.com/help";
      div.innerHTML = "Want to know more on about how this works? Click here";
      div.style.padding = "20px";
      app.appendChild(div);
    });
}

async function selectInfluencer(team2, influencers) {
  console.log(team2);
  console.log(influencers);
  if (team2.everyGw[0].gameweek != 1) {
    alert(
      `${team2.player_name} missed a few games at the begining of the season, I don't quite have enough evidence to make comparisons here.`
    );
    console.log(team2);
  }
  const t2Picks = team2.everyGwPicks;

  // Extract elements and active_chip for team2's picks for each gameweek
  const t2Elements = t2Picks.map((gw) =>
    gw.picks.slice(0, 11).map((pick) => pick.element)
  );
  const t2ActiveChips = t2Picks.map((gw) => gw.active_chip);

  // Extract elements and active_chip for each influencer's picks for each gameweek
  const influencersPicks = influencers.map((influencer) => {
    return influencer.everyGwPicks.map((gw) => {
      return {
        elements: gw.picks.slice(0, 11).map((pick) => pick.element),
        active_chip: gw.active_chip,
      };
    });
  });

  // Function to calculate added and removed elements
  function trackElementChanges(prevElements, currentElements) {
    const added = currentElements.filter(
      (element) => !prevElements.includes(element)
    );
    const removed = prevElements.filter(
      (element) => !currentElements.includes(element)
    );
    return { added, removed };
  }

  // Function to calculate the percentage of matching elements and track active_chip
  function calculateMatchPercentage(
    t2Elements,
    t2ActiveChips,
    influencerElements,
    influencerActiveChips
  ) {
    let totalMatches = 0;
    let gameweeksWithMatches = [];
    let bothTeamsActiveChip = [];
    let elementChanges = []; // To track changes

    t2Elements.forEach((gwElements, index) => {
      const influencerGwElements = influencerElements[index];
      const matchCount = gwElements.filter((element) =>
        influencerGwElements.includes(element)
      ).length;
      const matchPercentage = (matchCount / gwElements.length) * 100;
      totalMatches += matchPercentage;

      // Track the gameweek with the highest match percentage
      const activeChip =
        t2ActiveChips[index] && t2ActiveChips[index] !== "null"
          ? ` (Active chip: ${t2ActiveChips[index]})`
          : "";
      gameweeksWithMatches.push({
        gameweek: index + 1,
        matchPercentage,
        activeChip,
      });

      // Check if both teams have an active_chip for the same gameweek
      if (
        t2ActiveChips[index] &&
        t2ActiveChips[index] !== "null" &&
        influencerActiveChips[index] &&
        influencerActiveChips[index] !== "null"
      ) {
        bothTeamsActiveChip.push(index + 1); // Store the gameweek number
      }

      // Track added and removed elements for each gameweek, only if the changes match
      if (index > 0) {
        const prevT2Elements = t2Elements[index - 1];
        const prevInfluencerElements = influencerElements[index - 1];

        const t2Changes = trackElementChanges(prevT2Elements, gwElements);
        const influencerChanges = trackElementChanges(
          prevInfluencerElements,
          influencerGwElements
        );

        // Only include gameweek if the changes are exactly the same
        if (
          JSON.stringify(t2Changes.added) ===
            JSON.stringify(influencerChanges.added) &&
          JSON.stringify(t2Changes.removed) ===
            JSON.stringify(influencerChanges.removed)
        ) {
          elementChanges.push({
            gameweek: index + 1,
            t2: t2Changes,
            influencer: influencerChanges,
          });
        }
      }
    });

    // Sort gameweeks by match percentage in descending order
    gameweeksWithMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Return the total match percentage, the most similar gameweeks, and gameweeks where both teams had active_chip
    return {
      averageMatchPercentage: totalMatches / t2Elements.length,
      mostSimilarGameweeks: gameweeksWithMatches.slice(0, 3), // Top 3 most similar gameweeks
      bothTeamsActiveChip, // Gameweeks where both teams had active_chip
      elementChanges, // Track element changes for each gameweek
    };
  }

  // Find the influencer with the highest match percentage
  let bestMatch = {
    influencer: null,
    matchPercentage: 0,
    mostSimilarGameweeks: [],
    bothTeamsActiveChip: [],
    elementChanges: [],
  };

  influencersPicks.forEach((influencerPicks, index) => {
    const {
      averageMatchPercentage,
      mostSimilarGameweeks,
      bothTeamsActiveChip,
      elementChanges,
    } = calculateMatchPercentage(
      t2Elements,
      t2ActiveChips,
      influencerPicks.map((pick) => pick.elements),
      influencerPicks.map((pick) => pick.active_chip)
    );
    if (averageMatchPercentage > bestMatch.matchPercentage) {
      bestMatch = {
        influencer: influencers[index],
        matchPercentage: averageMatchPercentage,
        mostSimilarGameweeks,
        bothTeamsActiveChip,
        elementChanges,
      };
    }
  });

  // Reusable function to track captain's element for a team's gameweeks
  const trackCaptains = (everyGwPicks) => {
    return everyGwPicks.map((gw) => {
      const captain = gw.picks.find((pick) => pick.is_captain);
      return {
        gameweek: gw.gameweek, // Include gameweek info if available
        captainElement: captain ? captain.element : null, // Record captain's element or null if no captain
      };
    });
  };

  // Use the reusable function for both bestMatch and team2
  const trackedBestMatchCaptains = trackCaptains(
    bestMatch.influencer.everyGwPicks
  );
  const trackedt2Captains = trackCaptains(team2.everyGwPicks);

  console.log(trackedBestMatchCaptains);
  console.log(trackedt2Captains);

  // Calculate how many times both picked the same captainElement
  const matchingCaptains = trackedBestMatchCaptains.reduce(
    (count, bm, index) => {
      const t2 = trackedt2Captains[index];
      return bm.captainElement === t2.captainElement ? count + 1 : count;
    },
    0
  );

  let matchingCaptainMessage;
  if (`${matchingCaptains}` == currentGw) {
    matchingCaptainMessage = `Both have had the same captain pick EVERY gameweek. Sounds a bit fishy to me!\n`;
  } else if (`${matchingCaptains}` != currentGw) {
    matchingCaptainMessage = `Make of this what you will, but both ${
      team2.player_name
    } and ${getinfluencerName(
      bestMatch.influencer.entry
    )} picked the same captain for ${matchingCaptains} out of ${currentGw} gameweeks. It might have just been a common strategy in those gameweeks!\n`;
  }

  // Create a div element to display the best match, most similar gameweeks, the active_chip comparison, and element changes
  const div = document.createElement("div");
  div.id = "copycat-popup-body";

  const similarGameweeks = bestMatch.mostSimilarGameweeks
    .map(
      (gw) =>
        `<li>Gameweek ${gw.gameweek}: ${gw.matchPercentage.toFixed(0)}%</li>`
    )
    .join("");

  const activeChipMessage =
    bestMatch.bothTeamsActiveChip.length > 0
      ? `Both teams had a chip activated in Gameweeks: ${bestMatch.bothTeamsActiveChip.join(
          ", "
        )}. Just saying 👀. Add that to your evidence.`
      : "They've never had a chip activated in the same week.";

  // Create the elementChanges message (only if there are changes)
  const elementChangesMessage = bestMatch.elementChanges
    .filter((change) => {
      // Check if there are actual changes (added or removed elements)
      return (
        change.t2.added.length > 0 ||
        change.t2.removed.length > 0 ||
        change.influencer.added.length > 0 ||
        change.influencer.removed.length > 0
      );
    })
    .map((change) => {
      const t2Added = change.t2.added.length
        ? `${team2.player_name} transferred in: ${change.t2.added
            .map(getPlayerWebName)
            .join(", ")}`
        : "";
      const t2Removed = change.t2.removed.length
        ? `${team2.player_name} transferred out: ${change.t2.removed
            .map(getPlayerWebName)
            .join(", ")}`
        : "";
      const influencerAdded = change.influencer.added.length
        ? `${getinfluencerName(
            bestMatch.influencer.entry
          )} transferred in: ${change.influencer.added
            .map(getPlayerWebName)
            .join(", ")}`
        : "";
      const influencerRemoved = change.influencer.removed.length
        ? `${getinfluencerName(
            bestMatch.influencer.entry
          )} transferred out: ${change.influencer.removed
            .map(getPlayerWebName)
            .join(", ")}`
        : "";

      return `
  <li>Gameweek ${change.gameweek}: 
${t2Added}
${influencerAdded} 
${t2Removed} 
${influencerRemoved}
</li>
  `;
    })
    .join("");

  // Only include the element changes section if there are any changes
  const elementChangesSection = elementChangesMessage
    ? `<br>Look what else I found:<ul>${elementChangesMessage}</ul>`
    : "";
  console.log(bestMatch.influencer);
  const influencerScore =
    bestMatch.influencer.everyGwPicks[
      bestMatch.influencer.everyGwPicks.length - 1
    ].total_points;
  console.log(influencerScore);
  let scoreMessage;
  if (team2.total > influencerScore) {
    scoreMessage = `<p>It's worth noting that ${team2.player_name} has ${
      team2.total - influencerScore
    } more points anyway, so be careful with those accusations! What if ${getinfluencerName(
      bestMatch.influencer.entry
    )} is copying ${team2.player_name}?</p>`;
  } else if (team2.total < influencerScore) {
    scoreMessage = `<p>By the way, ${team2.player_name} has ${
      influencerScore - team2.total
    } fewer points than ${getinfluencerName(
      bestMatch.influencer.entry
    )}. Take that into consideration.</p>`;
  } else {
    scoreMessage = `<p>WTF! They have the same amount of points! Coincidence?</p>`;
  }

  let matchMessage;

  if (bestMatch.matchPercentage >= 90) {
    matchMessage = `<strong><h2>Caught Red Handed</h2></strong><p>AWKWARD! - there's enough here to throw the book at ${team2.player_name}! Approach with caution, suspect could turn violent.</p>`;
  } else if (bestMatch.matchPercentage >= 80) {
    matchMessage = `<strong><h2>Hot Match!</h2></strong><p>${team2.player_name} seems heavily influenced by an outsider. Keep a close eye on this situation and monitor them for a few more weeks.</p>`;
  } else if (bestMatch.matchPercentage >= 70) {
    matchMessage = `<strong><h2>Warm Warning</h2></strong><p>Things are starting to heat up! Could ${team2.player_name} be borrowing ideas? Check the stats and decide for yourself.</p>`;
  } else if (bestMatch.matchPercentage >= 60) {
    matchMessage = `<strong><h2>Warm Match</h2></strong><p>No major drama here, but it’s worth keeping ${team2.player_name} on your radar. Have a look at the stats below for clarity.</p>`;
  } else if (bestMatch.matchPercentage >= 50) {
    matchMessage = `<strong><h2>Luke Warm</h2></strong><p>Nothing conclusive yet. ${team2.player_name} might just be playing it safe and sticking to common strategies.</p>`;
  } else if (bestMatch.matchPercentage >= 40) {
    matchMessage = `<strong><h2>Chilly Match</h2></strong><p>No need to worry too much. ${team2.player_name} seems to be taking an independent approach to their FPL team.</p>`;
  } else if (bestMatch.matchPercentage >= 30) {
    matchMessage = `<strong><h2>Cold Match</h2></strong><p>It’s unlikely that ${team2.player_name} is being influenced. They appear to be paving their own path in FPL.</p>`;
  } else if (bestMatch.matchPercentage >= 20) {
    matchMessage = `<strong><h2>Subtle Chill</h2></strong><p>${team2.player_name} is almost certainly playing their own game. Nothing to see here!</p>`;
  } else {
    matchMessage = `<strong><h2>Sub Zero</h2></strong><p>${team2.player_name} is an FPL maverick with a completely unique strategy. No signs of influence detected.</p>`;
  }

  let influencerContainer = `<h4 style="text-align:center">FPLToolbox Copycat Rating:</h4>  
<div class="best-match-percentage-bar-container">
  <div class="best-match-bar"></div>
  <div class="copycat-pointer" style="left: 0%">▼</div>
</div>
  <div class="influencer-container">
The best match I found was with ${getinfluencerName(
    bestMatch.influencer.entry
  )}, they had a copycat percentage of ${bestMatch.matchPercentage.toFixed(
    0
  )}%<br>
  <img id="influencer-profile-pic" src="${getinfluencerImg(
    bestMatch.influencer.entry
  )}">  
  </div>`;

  // Animate the pointer to the desired position
  setTimeout(() => {
    // Select the pointer element
    const pointer = document.querySelector(".copycat-pointer");
    pointer.style.left = `${bestMatch.matchPercentage}%`;
  }, 500); // Optional slight delay to ensure styles are applied smoothly

  div.innerHTML = `
${matchMessage}
${influencerContainer}
${scoreMessage}
<div class="similar-gameweeks">
<p>The gameweeks where their starting 11 were the most similar:</p>
<ul>${similarGameweeks}</ul>
</div>
${matchingCaptainMessage}

${activeChipMessage}
${elementChangesSection}
`;

  // Assuming `createAndShowInfluencerComparison` is defined elsewhere to display the comparison
  createAndShowInfluencerComparison(div);
}

async function createInfluencerLeague(arrayOfTeamIds) {
  const manuallyMadeLeague = [];

  for (const entry of arrayOfTeamIds) {
    const everyGwPicks = [];

    for (let gw = 1; gw <= currentGw; gw++) {
      try {
        const response = await fetch(
          `${BASE_URL}/entry/${entry}/event/${gw}/picks/`
        );
        const data = await response.json();
        everyGwPicks.push({
          active_chip: data.active_chip,
          gameweek: data.entry_history.event,
          total_points: data.entry_history.total_points,
          picks: data.picks,
        });
      } catch (error) {
        console.error(
          `Failed to fetch data for team ID ${entry}, gameweek ${gw}:`,
          error
        );
      }
    }

    manuallyMadeLeague.push({ entry, everyGwPicks });
  }

  return manuallyMadeLeague;
}
function createAndShowInfluencerComparison(content) {
  // Create modal elements
  const modal = document.createElement("div");
  modal.id = "share-influencer-comparison";

  const modalContent = document.createElement("div");
  modalContent.id = "influencer-comparison-modal";

  const modalMessage = document.createElement("div");
  modalMessage.id = "influencer-comparison-message";

  // Append the content (DOM element or string) to the modal message
  if (typeof content === "string") {
    modalMessage.textContent = content;
  } else if (content instanceof HTMLElement) {
    modalMessage.appendChild(content);
  } else {
    modalMessage.textContent = "Invalid content provided for the modal.";
  }

  const shareBtn = document.createElement("button");
  shareBtn.id = "shareBtn";
  shareBtn.style.marginRight = "10px";
  shareBtn.style.fontSize = "1rem";
  shareBtn.textContent = "Share";

  const closeModal = document.createElement("button");
  closeModal.id = "closeModal";
  closeModal.style.marginRight = "10px";
  closeModal.style.fontSize = "1rem";
  closeModal.textContent = "Close";

  // Append elements to the modal
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(shareBtn);
  modalContent.appendChild(closeModal);
  modal.appendChild(modalContent);

  // Append the modal to the body
  document.body.appendChild(modal);

  // Close the modal
  closeModal.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // Share button functionality
  shareBtn.addEventListener("click", () => {
    html2canvas(modalContent).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      if (navigator.share) {
        // Create a Blob from the image
        fetch(imgData)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "comparison.png", {
              type: "image/png",
            });
            navigator
              .share({
                title: "Catch an FPL Copycat",
                text: "Check out this influencer comparison!",
                files: [file], // Share the image as a file
              })
              .catch((err) => alert("Error sharing: " + err));
          });
      } else {
        // Fallback: Download the image if sharing isn't supported
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "comparison.png";
        link.click();
        alert(
          "Sharing is not supported on your device. Image downloaded instead."
        );
      }
    });
  });
}

async function findATeam() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Create input box and button
  const inputContainer = document.createElement("div");
  const inputLabel = document.createElement("label");
  inputLabel.textContent = "Enter Team ID: ";
  const inputBox = document.createElement("input");
  inputBox.type = "number";
  inputBox.placeholder = "123"; // Default placeholder for guidance
  const submitButton = document.createElement("button");
  submitButton.textContent = "Find Team";

  inputContainer.appendChild(inputLabel);
  inputContainer.appendChild(inputBox);
  inputContainer.appendChild(submitButton);
  app.appendChild(inputContainer);

  // Function to fetch and render the team data
  async function fetchAndRenderTeam(findATeamID) {
    app.innerHTML = ""; // Clear the UI for new content

    const loader = createLoader();
    app.appendChild(loader);

    const myScore = createScoreCard();
    const pitch = createPitch();
    app.append(myScore, pitch);

    // Fetch the team data for the gameweek
    async function fetchNewTeamData() {
      const response = await fetch(
        `${BASE_URL}/entry/${findATeamID}/event/${currentGw}/picks/`
      );
      return response.json();
    }

    const newTeam = await fetchNewTeamData();
    await renderTeam(newTeam);
    await fetchAndRenderUpcomingFixtures(newTeam);
    calculatePlayersPlayed(newTeam);
    document.getElementById("expected-points").innerHTML = "";
    document.getElementById("team-name").innerHTML = "";
    // Check if user is pro, and append pro menu to My Team
    if (
      theUser.username.data.membership_level.ID == 10 ||
      theUser.username.data.membership_level.ID == 12
    ) {
      await fetchAndRenderAdditionalStats(newTeam);
      await fetchAndRenderTransferStats(newTeam);
      await fetchAndRenderXpStats(newTeam);
      createProWidget();
    } else {
      createFreeWidget();
    }

    loader.remove();
  }

  // Add event listener to the button
  submitButton.addEventListener("click", () => {
    const findATeamID = inputBox.value.trim(); // Get user input
    if (findATeamID) {
      fetchAndRenderTeam(findATeamID);
    } else {
      alert("Please enter a valid Team ID.");
    }
  });
}

async function dreamTeamSearch() {
  try {
    const res = await fetch(BASE_URL + `dream-team/${currentGw}/`);
    const data = await res.json();
    console.log(data);
    const app = document.getElementById("app");
    app.innerHTML = ""; // Clear the app content

    let backGround = document.createElement("div");
    backGround.setAttribute("id", "player-search-card-background");

    let playerSearchCard = document.createElement("div");
    playerSearchCard.setAttribute("id", "player-search-card-background");

    for (const element of data.team) {
      console.log(element);
      const card = document.createElement("div");
      card.classList.add("player-search");
      card.id = element.element;

      const img = document.createElement("img");
      img.setAttribute("class", "player-search-img");
      img.src = `https://resources.premierleague.com/premierleague/photos/players/250x250/p${getPlayerPhoto(
        element.element
      ).slice(0, -3)}png`;
      img.style.minWidth = "100%";
      const name = document.createElement("p");
      name.className = "my-player-name";
      name.textContent = getPlayerWebName(element.element);

      const scoreText = document.createElement("p");
      scoreText.className = "my-player-xp";
      scoreText.textContent = element.points;

      card.append(img, name, scoreText);
      card.classList.add("player-search"); // Ensure we have the correct class for each player card
      playerSearchCard.appendChild(card);
      backGround.appendChild(playerSearchCard);
      app.appendChild(backGround);

      // Fetch the player fixtures
      const fixtures = await fetchPlayerFixtures(element.element);
      const upcomingFixturesDiv = createUpcomingFixtures(fixtures);

      const stats = await fetchPlayerCurrentStats(element.element);
      console.log(stats);

      // Attach the upcoming fixtures to the player card
      const playerDiv = document.getElementById(element.element);
      playerDiv.appendChild(upcomingFixturesDiv);

      const additionalStatsDiv = createAdditionalStats(stats);
      playerDiv.prepend(additionalStatsDiv);
      additionalStatsDiv.style.display = "flex";
    }
  } catch (error) {
    console.error("Something went wrong... ", error);
  }
}

async function findPopularTransfer() {
  const app = document.getElementById("app");
  app.innerHTML = ""; // Clear the app content

  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `Popular Transfers That Managers Are Making Right Now`;
  tableDescription.style.textAlign = "center";
  tableDescription.style.paddingLeft = "20px";
  tableDescription.style.paddingRight = "20px";

  app.appendChild(tableDescription);

  // Sort the elements based on transfers_in_event
  const sortedByTransfersIn = bootstrap.elements
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => b.transfers_in_event - a.transfers_in_event);

  // Sort the elements based on transfers_out_event
  const sortedByTransfersOut = bootstrap.elements
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => b.transfers_out_event - a.transfers_out_event);

  // Get the top 10 elements for transfers in and transfers out
  const topTransfersIn = sortedByTransfersIn.slice(0, 10);
  const topTransfersOut = sortedByTransfersOut.slice(0, 10);

  // Further sort the topTransfersIn by selected_by_percent
  const topTransfersInSortedBySelected = topTransfersIn
    .slice() // Create a copy to avoid mutating the original topTransfersIn array
    .sort((a, b) => b.selected_by_percent - a.selected_by_percent);

  // Further sort the topTransfersIn by selected_by_percent
  const topTransfersOutSortedBySelected = topTransfersOut
    .slice() // Create a copy to avoid mutating the original topTransfersIn array
    .sort((a, b) => b.selected_by_percent - a.selected_by_percent);

  // for (const transferIn of topTransfersInSortedBySelected) {
  //   const transferInType = await getPlayerType(transferIn.id);
  //   for (const transferOut of topTransfersOut) {
  //     const transferOutType = await getPlayerType(transferOut.id);
  //     if (transferInType === transferOutType) {
  //       console.log(`${transferIn.web_name} ${transferIn.selected_by_percent} in for ${transferOut.web_name} ${transferOut.selected_by_percent}`)
  //       const team = document.createElement("div");
  //       team.setAttribute("id", "transfer-team");
  //       const teamHeader = document.createElement("div");
  //       teamHeader.setAttribute("id", "team-header");

  //       const transfersDiv = document.createElement("div");
  //       transfersDiv.setAttribute("id", "team-transfers");

  //       const transferDiv = document.createElement("div");
  //           transferDiv.setAttribute("id", "player-transfer");
  //           const tIn = document.createElement("div");
  //           tIn.setAttribute("id", "player-in");
  //           const tOut = document.createElement("div");
  //           tOut.setAttribute("id", "player-out");

  //           const tInPlayer = document.createElement("img");
  //           tInPlayer.src =
  //             "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
  //             getPlayerPhoto(transferIn.id).slice(0, -3) +
  //             "png";
  //           tInPlayer.setAttribute("id", "transfer-img");
  //           tIn.append(tInPlayer);

  //           const tInName = document.createElement("div");
  //           tInName.innerHTML =
  //             `${transferIn.web_name} <br> £${transferIn.now_cost/10}m`
  //           tIn.append(tInName);

  //           const tInArrow = document.createElement("img");
  //           tInArrow.src =
  //             "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
  //           tInArrow.setAttribute("id", "transfer-direction-in");
  //           tIn.append(tInArrow);

  //           const tOutArrow = document.createElement("img");
  //           tOutArrow.src =
  //             "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
  //           tOutArrow.setAttribute("id", "transfer-direction-out");
  //           tOut.append(tOutArrow);

  //           const tOutName = document.createElement("div");
  //           tOutName.innerHTML =
  //             `${transferOut.web_name} <br> £${transferOut.now_cost/10}m`
  //           tOut.append(tOutName);

  //           const tOutPlayer = document.createElement("img");
  //           tOutPlayer.src =
  //             "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
  //             getPlayerPhoto(transferOut.id).slice(0, -3) +
  //             "png";
  //           tOutPlayer.setAttribute("id", "transfer-img");
  //           tOut.append(tOutPlayer);

  //           transferDiv.appendChild(tOut);
  //           transferDiv.appendChild(tIn);

  //           transfersDiv.appendChild(transferDiv);
  //           team.appendChild(transfersDiv);

  //           app.appendChild(team);

  //     }
  //   }
  // }
  for (const transferOut of topTransfersOutSortedBySelected) {
    const transferOutType = await getPlayerType(transferOut.id);
    for (const transferIn of topTransfersIn) {
      const transferInType = await getPlayerType(transferIn.id);
      if (
        transferOutType === transferInType &&
        transferIn.id != transferOut.id
      ) {
        // console.log(
        //   `${transferOut.web_name} ${transferOut.selected_by_percent} out for ${transferIn.web_name} ${transferIn.selected_by_percent}`
        // );
        const team = document.createElement("div");
        team.setAttribute("id", "transfer-team");
        const teamHeader = document.createElement("div");
        teamHeader.setAttribute("id", "team-header");

        const transfersDiv = document.createElement("div");
        transfersDiv.setAttribute("id", "team-transfers");

        const transferDiv = document.createElement("div");
        transferDiv.setAttribute("id", "player-transfer");
        const tOut = document.createElement("div");
        tOut.setAttribute("id", "player-out");
        const tIn = document.createElement("div");
        tIn.setAttribute("id", "player-in");

        const tOutPlayer = document.createElement("img");
        tOutPlayer.src =
          "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
          getPlayerPhoto(transferOut.id).slice(0, -3) +
          "png";
        tOutPlayer.setAttribute("id", "transfer-img");
        tOut.append(tOutPlayer);

        const tOutName = document.createElement("div");
        tOutName.innerHTML = `${transferOut.web_name} <br> £${
          transferOut.now_cost / 10
        }m`;
        tOut.append(tOutName);

        const tOutArrow = document.createElement("img");
        tOutArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tOutArrow.setAttribute("id", "transfer-direction-out");
        tOut.append(tOutArrow);

        const tInArrow = document.createElement("img");
        tInArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tInArrow.setAttribute("id", "transfer-direction-in");
        tIn.append(tInArrow);

        const tInName = document.createElement("div");
        tInName.innerHTML = `${transferIn.web_name} <br> £${
          transferIn.now_cost / 10
        }m`;
        tIn.append(tInName);

        const tInPlayer = document.createElement("img");
        tInPlayer.src =
          "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
          getPlayerPhoto(transferIn.id).slice(0, -3) +
          "png";
        tInPlayer.setAttribute("id", "transfer-img");
        tIn.append(tInPlayer);

        transferDiv.appendChild(tOut);
        transferDiv.appendChild(tIn);

        transfersDiv.appendChild(transferDiv);
        team.appendChild(transfersDiv);

        app.appendChild(team);
      }
    }
  }
  const finalCard = document.createElement("a");
  finalCard.setAttribute("id", "transfer-team");
  finalCard.href = "https://instagram.com/fpltoolbox";
  const finalCardHeader = document.createElement("div");
  finalCardHeader.setAttribute("id", "team-header");
  finalCardHeader.innerHTML =
    "What transfer will you make this week? Let me know on Instagram";
  finalCard.appendChild(finalCardHeader);
  app.append(finalCard);
  insertAdManually("#transfer-team");
}

async function overallStandingsSearch() {
  //const BASE_URL = "https://fantasy.premierleague.com/api/";
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Check for saved data in localStorage
  const savedData = localStorage.getItem("savedOverallSearchData");
  if (savedData) {
    console.log(JSON.parse(savedData));

    // Create a button to delete saved data
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Saved Data";
    deleteButton.id = "deleteSavedData";

    // Add a click event listener to delete saved data
    deleteButton.addEventListener("click", () => {
      localStorage.removeItem("savedOverallSearchData");
      alert("Saved data deleted successfully.");
      app.innerHTML = ""; // Clear the app content
      const noDataText = document.createElement("p");
      noDataText.textContent = "No previously saved data.";
      app.appendChild(noDataText);
    });

    // Append the delete button to the app
    app.appendChild(deleteButton);

    // Optionally, show some text or preview of the saved data
    const previewText = document.createElement("p");
    previewText.textContent = `Previously saved data for ${
      JSON.parse(savedData).length
    } teams from Rank ${JSON.parse(savedData)[0].rank} to Rank ${
      JSON.parse(savedData)[JSON.parse(savedData).length - 1].rank
    } already exists. You can delete it using the button above.`;
    app.appendChild(previewText);
  } else {
    // Append text saying no previously saved data
    const noDataText = document.createElement("p");
    noDataText.textContent = "No previously saved data.";
    app.appendChild(noDataText);
  }

  // Create input fields and button for user input
  const inputFields = document.createElement("div");
  inputFields.innerHTML = `
    <label for="leagueID">League ID: </label>
    <input type="number" id="leagueID" placeholder="Enter League ID" /><br/>

    <label for="maxPages">Max Pages: </label>
    <input type="number" id="maxPages" placeholder="Enter Max Pages" /><br/>

    <label for="startPage">Start Page: </label>
    <input type="number" id="startPage" placeholder="Enter Start Page" /><br/>

    <button id="fetchData">Fetch Data</button>
  `;

  app.appendChild(inputFields);
  const helpfulText = `
  Total Players:${bootstrap.total_players}\n
  Approx Total Pages: ${bootstrap.total_players / 50}
  `;
  app.append(helpfulText);

  // Create input fields and button for user input
  const playerSearchFields = document.createElement("div");
  playerSearchFields.innerHTML = `
    <label for="playerName">Player: </label>
    <input type="string" id="playerName" placeholder="Enter Player Name" /><br/>
    <button id="playerSearch">Search</button>
  `;

  app.appendChild(playerSearchFields);
  document.getElementById("playerSearch").addEventListener("click", () => {
    overallStandingsSearchUntil(document.getElementById("playerName").value);
  });

  // Add event listener to the button
  document.getElementById("fetchData").addEventListener("click", async () => {
    const leagueID = parseInt(document.getElementById("leagueID").value, 10);
    const maxPages = parseInt(document.getElementById("maxPages").value, 10);
    const startPage = parseInt(document.getElementById("startPage").value, 10);

    if (isNaN(leagueID) || isNaN(maxPages) || isNaN(startPage)) {
      app.append("Please provide valid numeric inputs.");
      return;
    }

    console.log("Starting search...");
    console.log(`Searching ${maxPages * 50} teams`);
    console.log(`Fetching ${maxPages} pages starting from page ${startPage}`);

    const results = [];
    const batchSize = 10; // Fetch pages concurrently
    const pages = Array.from({ length: maxPages }, (_, i) => startPage + i);

    const startTime = Date.now(); // Start the timer

    const displayElement = document.createElement("div");
    displayElement.id = "teamEntryDisplay1";
    app.append(displayElement);

    try {
      // Function to fetch a single page
      const fetchPage = async (page) => {
        // Update the content of the display element
        displayElement.textContent = `Currently fetching ${page} of ${maxPages}`;

        const response = await fetch(
          `${BASE_URL}leagues-classic/${leagueID}/standings?page_standings=${page}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch page ${page}: ${response.statusText}`
          );
        }
        const data = await response.json();

        return data.standings.results;
      };

      // Process pages in batches
      for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize); // Get a batch of pages
        const batchResults = await Promise.all(batch.map(fetchPage)); // Fetch concurrently

        // Flatten results from batch and add to overall results
        batchResults.forEach((standings) => results.push(...standings));
      }

      const endTime = Date.now(); // End the timer
      console.log(
        `Search completed (${maxPages} pages starting from ${startPage}) in ${
          (endTime - startTime) / 1000
        } seconds.`
      );
      console.log("Overall League Data:", results);

      app.append(
        `Search completed in ${(endTime - startTime) / 1000} seconds.`
      );
      app.append(`Fetched ${results.length} teams.`);

      // Automatically call the function
      console.log("Automatically fetching team picks...");

      // Remember when we started
      var startAddingPicksTime = new Date().getTime();
      await fetchTeamPicksAndAddToLeague(results, currentGw); // Call the function
      // Remember when we finished
      var endAddingPicksTime = new Date().getTime();
      // Now calculate and output the difference
      console.log(
        `Team picks added in ${
          (endAddingPicksTime - startAddingPicksTime) / 1000
        } seconds or ${
          (endAddingPicksTime - startAddingPicksTime) / 60000
        } minutes`
      );
    } catch (error) {
      const endTime = Date.now(); // End the timer in case of error
      console.error(
        `Error fetching league data after ${
          (endTime - startTime) / 1000
        } seconds:`,
        error
      );
      app.append(
        `Error fetching league data after ${
          (endTime - startTime) / 1000
        } seconds: ${error.message}<br/>`
      );
      throw error;
    }
  });
}

async function fetchTeamPicksAndAddToLeague1(leagueData, gw) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const updatedLeagueData = []; // To store league data with team picks
  const BATCH_SIZE = 5; // Adjust batch size based on API rate limits and performance considerations

  const startTime = Date.now(); // Start the timer

  try {
    // Check if the display element exists
    let displayElement = document.getElementById("teamEntryDisplay");
    if (!displayElement) {
      // Create the element if it doesn't exist
      displayElement = document.createElement("div");
      displayElement.id = "teamEntryDisplay";
      app.prepend(displayElement);
    }

    // Function to fetch the picks for a specific team
    const fetchTeamPicks = async (teamEntry) => {
      const response = await fetch(
        `${BASE_URL}entry/${teamEntry}/event/${gw}/picks/`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch picks for team ${teamEntry}: ${response.statusText}`
        );
      }
      return await response.json();
    };

    // Process league data in batches
    for (let i = 0; i < leagueData.length; i += BATCH_SIZE) {
      const batch = leagueData.slice(i, i + BATCH_SIZE);
      // Update the content of the display element
      displayElement.textContent = `Currently fetching team entry:${i} of ${leagueData.length}`;

      // Fetch all picks in the current batch concurrently
      const batchResults = await Promise.all(
        batch.map(async (player) => {
          const teamEntry = player.entry;

          // Fetch team picks data
          const picksData = await fetchTeamPicks(teamEntry);

          // Return player data with picks
          return {
            ...player,
            picks: picksData.picks,
          };
        })
      );

      // Add batch results to the updated league data
      updatedLeagueData.push(...batchResults);
    }

    const endTime = Date.now(); // End the timer
    displayElement.textContent = `Fetched picks for all teams in ${
      (endTime - startTime) / 1000
    } seconds.`;
    console.log(updatedLeagueData);

    // Save the updated data to localStorage
    localStorage.setItem(
      "savedOverallSearchData",
      JSON.stringify(updatedLeagueData)
    );

    // Retrieve the saved data from localStorage
    const savedOverallSearchData = JSON.parse(
      localStorage.getItem("savedOverallSearchData")
    );

    console.log("Data saved to localStorage:", savedOverallSearchData);

    const menuButtons = document.getElementById(
      "content-tools-container-submenu"
    );
    menuButtons.innerHTML = "";
    // Create a button to call findTripleCaptains
    const findTripleCaptainsButton = document.createElement("button");
    findTripleCaptainsButton.textContent = "Find Captains";
    findTripleCaptainsButton.id = "findTripleCaptains";
    menuButtons.append(findTripleCaptainsButton);

    // Add an event listener to the button
    findTripleCaptainsButton.addEventListener("click", () => {
      console.log("Finding Captains...");
      findTripleCaptains(updatedLeagueData); // Call the function with the data
    });

    // Create a button to call calculate bench scores
    const calculateBenchScoresButton = document.createElement("button");
    calculateBenchScoresButton.textContent = "Calculate Bench Scores";
    calculateBenchScoresButton.id = "calculateBenchScores";
    menuButtons.append(calculateBenchScoresButton);

    // Add an event listener to the button
    calculateBenchScoresButton.addEventListener("click", () => {
      console.log("Calculating Bench Scores...");
      calculateBenchScores(updatedLeagueData); // Call the function with the data
    });

    // Create a button to call calculate bench scores
    const calculateTransferFailsButton = document.createElement("button");
    calculateTransferFailsButton.textContent = "Calculate Transfer Fails";
    calculateTransferFailsButton.id = "calculateTransFails";
    menuButtons.append(calculateTransferFailsButton);

    // Add an event listener to the button
    calculateTransferFailsButton.addEventListener("click", () => {
      console.log("Calculating Bench Scores...");
      calculateTransferFails(updatedLeagueData); // Call the function with the data
    });
  } catch (error) {
    const endTime = Date.now(); // End the timer in case of error
    console.error(
      `Error fetching team picks after ${
        (endTime - startTime) / 1000
      } seconds:`,
      error
    );
    throw error; // Propagate the error
  }
}

async function fetchTeamPicksAndAddToLeague(leagueData, gw) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Check for saved data in localStorage
  const savedData = localStorage.getItem("savedOverallSearchData");
  if (savedData) {
    const useSavedData = confirm(
      "Saved data already exists. Would you like to use the saved data instead of fetching new data?"
    );

    if (useSavedData) {
      const savedOverallSearchData = JSON.parse(savedData);
      console.log(
        "Using saved data from localStorage:",
        savedOverallSearchData
      );

      // Optionally, you can call functions that use the saved data here
      findTripleCaptains(savedOverallSearchData);
      return; // Exit the function to avoid fetching new data
    }
  }

  const updatedLeagueData = []; // To store league data with team picks
  const BATCH_SIZE = 5; // Adjust batch size based on API rate limits and performance considerations

  const startTime = Date.now(); // Start the timer

  try {
    // Check if the display element exists
    let displayElement = document.getElementById("teamEntryDisplay");
    if (!displayElement) {
      // Create the element if it doesn't exist
      displayElement = document.createElement("div");
      displayElement.id = "teamEntryDisplay";
      app.prepend(displayElement);
    }

    // Function to fetch the picks for a specific team
    const fetchTeamPicks = async (teamEntry) => {
      const response = await fetch(
        `${BASE_URL}entry/${teamEntry}/event/${gw}/picks/`
      );
      console.log("fetching...");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch picks for team ${teamEntry}: ${response.statusText}`
        );
      }
      return await response.json();
    };

    // Process league data in batches
    for (let i = 0; i < leagueData.length; i += BATCH_SIZE) {
      const batch = leagueData.slice(i, i + BATCH_SIZE);
      // Update the content of the display element
      displayElement.textContent = `Currently fetching team entry:${i} of ${leagueData.length}`;

      // Fetch all picks in the current batch concurrently
      const batchResults = await Promise.all(
        batch.map(async (player) => {
          const teamEntry = player.entry;

          // Fetch team picks data
          const picksData = await fetchTeamPicks(teamEntry);

          // Return player data with picks
          return {
            ...player,
            picks: picksData.picks,
          };
        })
      );

      // Add batch results to the updated league data
      updatedLeagueData.push(...batchResults);
    }

    const endTime = Date.now(); // End the timer
    displayElement.textContent = `Fetched picks for all teams in ${
      (endTime - startTime) / 1000
    } seconds.`;
    console.log(updatedLeagueData);

    // Save the updated data to localStorage
    localStorage.setItem(
      "savedOverallSearchData",
      JSON.stringify(updatedLeagueData)
    );

    // Retrieve the saved data from localStorage
    const savedOverallSearchData = JSON.parse(
      localStorage.getItem("savedOverallSearchData")
    );

    console.log("Data saved to localStorage:", savedOverallSearchData);

    const menuButtons = document.getElementById(
      "content-tools-container-submenu"
    );
    menuButtons.innerHTML = "";
    // Create a button to call findTripleCaptains
    const findTripleCaptainsButton = document.createElement("button");
    findTripleCaptainsButton.textContent = "Find Captains";
    findTripleCaptainsButton.id = "findTripleCaptains";
    menuButtons.append(findTripleCaptainsButton);

    // Add an event listener to the button
    findTripleCaptainsButton.addEventListener("click", () => {
      console.log("Finding Captains...");
      findTripleCaptains(updatedLeagueData); // Call the function with the data
    });

    // Create a button to call calculate bench scores
    const calculateBenchScoresButton = document.createElement("button");
    calculateBenchScoresButton.textContent = "Calculate Bench Scores";
    calculateBenchScoresButton.id = "calculateBenchScores";
    menuButtons.append(calculateBenchScoresButton);

    // Add an event listener to the button
    calculateBenchScoresButton.addEventListener("click", () => {
      console.log("Calculating Bench Scores...");
      calculateBenchScores(updatedLeagueData); // Call the function with the data
    });

    // Create a button to call calculate transfer fails
    const calculateTransferFailsButton = document.createElement("button");
    calculateTransferFailsButton.textContent = "Calculate Transfer Fails";
    calculateTransferFailsButton.id = "calculateTransFails";
    menuButtons.append(calculateTransferFailsButton);

    // Add an event listener to the button
    calculateTransferFailsButton.addEventListener("click", () => {
      console.log("Calculating Bench Scores...");
      calculateTransferFails(updatedLeagueData); // Call the function with the data
    });
  } catch (error) {
    const endTime = Date.now(); // End the timer in case of error
    console.error(
      `Error fetching team picks after ${
        (endTime - startTime) / 1000
      } seconds:`,
      error
    );
    throw error; // Propagate the error
  }
}

function calculateBenchScores(updatedLeagueData) {
  // Array to store the scores for each entry in updatedLeagueData
  const benchScores = [];

  // Loop through each entry in updatedLeagueData
  updatedLeagueData.forEach((entry) => {
    let score = 0;
    console.log(".");
    // Check if the entry has picks
    if (entry.picks && Array.isArray(entry.picks)) {
      // Loop through each pick in the entry
      entry.picks.forEach((pick) => {
        if (pick.position > 11) {
          // Calculate points for the current pick using getPlayerPoints
          const points = getPlayerScore(pick.element);
          score += points;
        }
      });
    }

    // Store the calculated score for the current entry
    benchScores.push({
      team: entry.player_name || "Unknown ID", // Assuming each entry has an id field
      entry_name: entry.entry_name,
      score: score,
      entry: entry.entry,
      rank: entry.rank,
      picks: entry.picks,
    });
  });
  // Assuming leagueScores is the array containing the scores
  const sortedbenchScores = [...benchScores].sort((a, b) => b.score - a.score);

  // The above creates a new array sorted in descending order by score
  console.log("Highest Bench Scores:", sortedbenchScores);

  showHighestBenchFails(sortedbenchScores);
}
function findTripleCaptains(updatedLeagueData) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Create a select box for captainSelecter
  const selectBox = document.createElement("select");
  selectBox.id = "captainSelecter";
  selectBox.innerHTML = `
    <option value="2" selected>2x Captain</option>
    <option value="3">3x Captain</option>
  `;
  app.append(selectBox);

  // Add a button to trigger the filtering
  const filterButton = document.createElement("button");
  filterButton.textContent = "Filter Triple Captains";
  app.append(filterButton);

  // Add a container to display results
  const resultsContainer = document.createElement("div");
  resultsContainer.id = "resultsContainer";
  app.append(resultsContainer);

  // Add event listener to the filter button
  filterButton.addEventListener("click", () => {
    const captainSelecter = parseInt(selectBox.value, 10); // Get selected value
    resultsContainer.innerHTML = ""; // Clear previous results

    // Array to store the scores for each entry in updatedLeagueData
    const tripleCaptains = [];

    // Loop through each entry in updatedLeagueData
    updatedLeagueData.forEach((entry) => {
      // Check if the entry has picks
      if (entry.picks && Array.isArray(entry.picks)) {
        // Loop through each pick in the entry
        entry.picks.forEach((pick) => {
          if (pick.multiplier >= captainSelecter) {
            // Store the calculated score for the current entry
            tripleCaptains.push({
              team: entry.player_name || "Unknown ID", // Assuming each entry has an id field
              score: getPlayerScore(pick.element) * pick.multiplier,
              multiplier: pick.multiplier,
              captain: getPlayerWebName(pick.element),
              entry: entry.entry,
              rank: entry.rank,
            });
          }
        });
      }
    });

    // Create the table and header
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Add table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
  <tr>
    <th style="cursor: default;">Team</th>
    <th style="cursor: pointer;" data-column="captain">Captain</th>
    <th style="cursor: pointer;" data-column="score">Score</th>
  </tr>
`;
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");
    tripleCaptains.forEach((captain) => {
      const row = document.createElement("tr");
      row.style.cursor = "pointer";
      row.style.borderBottom = "1px solid #ccc";

      // Create a link to wrap the entire row
      const link = document.createElement("a");
      link.href = `https://fantasy.premierleague.com/entry/${captain.entry}/event/${currentGw}`;
      link.style.display = "contents"; // Allows the link to behave as part of the row

      // Add table cells
      const teamCell = document.createElement("td");
      teamCell.style.padding = "8px";
      teamCell.style.textAlign = "left";
      teamCell.textContent = captain.team;

      const captainCell = document.createElement("td");
      captainCell.style.padding = "8px";
      captainCell.style.textAlign = "left";
      captainCell.textContent = captain.captain;

      const scoreCell = document.createElement("td");
      scoreCell.style.padding = "8px";
      scoreCell.style.textAlign = "right";
      scoreCell.textContent = captain.score;

      // Append cells to the link
      link.appendChild(teamCell);
      link.appendChild(captainCell);
      link.appendChild(scoreCell);

      // Append the link to the row
      row.appendChild(link);

      // Append the row to the tbody
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Add the table to the container
    resultsContainer.appendChild(table);

    // Sortable column functionality
    const headers = thead.querySelectorAll("th[data-column]");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const column = header.dataset.column;
        const order = header.dataset.order === "asc" ? "desc" : "asc";
        header.dataset.order = order;

        // Remove all existing sort indicators
        headers.forEach((th) => {
          const baseText = th.textContent.replace(" ▲", "").replace(" ▼", ""); // Remove any existing indicators
          th.textContent = baseText; // Reset the header text
        });

        // Add the appropriate sort indicator to the clicked header
        header.textContent += order === "asc" ? " ▲" : " ▼";

        // Sort the rows
        const rows = Array.from(tbody.querySelectorAll("tr"));
        rows.sort((a, b) => {
          const aValue = a
            .querySelector(`td:nth-child(${header.cellIndex + 1})`)
            .textContent.trim();
          const bValue = b
            .querySelector(`td:nth-child(${header.cellIndex + 1})`)
            .textContent.trim();
          return column === "score"
            ? order === "asc"
              ? parseInt(aValue) - parseInt(bValue)
              : parseInt(bValue) - parseInt(aValue)
            : order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        });

        // Re-append sorted rows to the tbody
        rows.forEach((row) => tbody.appendChild(row));
      });
    });

    console.log(tripleCaptains);
  });
}
async function showHighestBenchFails(league) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Initialize and start the loading bar
  const loader = new LoadingBar(app);
  loader.start();

  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `Gameweek Bench Fails`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  try {
    league.slice(0, 10).forEach((element) => {
      //console.log(element)
      // Create the main team card container
      const team = document.createElement("div");
      team.id = "team-card";
      team.classList.add("bench-card", "bench");

      // Team header
      const teamHeader = document.createElement("div");
      teamHeader.id = "team-header";

      // Add team and player names
      const entry = document.createElement("div");
      entry.innerHTML = `
          <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
        `;
      teamHeader.appendChild(entry);

      team.appendChild(teamHeader);

      // Bench player cards
      const benchDiv = document.createElement("div");
      benchDiv.id = "bench-div";
      team.appendChild(benchDiv);

      let totalScore = 0;

      element.picks.forEach((pick) => {
        if (pick.position > 11 && pick.position < 16) {
          const playerScore = getPlayerScore(pick.element);
          totalScore += playerScore;

          const card = createPlayerCard(
            pick.element,
            playerScore,
            false,
            false,
            false
          );
          benchDiv.appendChild(card);
        }
      });
      const benchScore = document.createElement("div");
      benchScore.id = "bench-score";
      benchScore.innerHTML = `${totalScore}<div>pts</div>`;
      teamHeader.appendChild(benchScore);

      const summary = document.createElement("div");
      summary.innerHTML = `Team ${
        element.entry_name
      } has left ${totalScore} points on their bench this week! ${getRandomPhrase(
        negativeWords
      )}`;
      summary.style.display = "flex";
      summary.style.flexDirection = "row";
      summary.style.justifyContent = "space-between";
      summary.style.paddingTop = "15px";
      team.appendChild(summary);
      const watermark = document.createElement("div");
      watermark.innerHTML = "www.fpltoolbox.com";
      watermark.id = "watermark";
      team.appendChild(watermark);
      const dorPic = document.createElement("div");
      dorPic.id = "dor";
      team.prepend(dorPic);
      app.appendChild(team);
    });

    // Stop and clean up the loading bar
    loader.stop();
    loader.remove();
  } catch (error) {
    console.error("Error while rendering the bench fails: ", error);
  }
}
async function calculateTransferFails(updatedLeagueData) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const loader = new LoadingBar(app);
  loader.start();
  const startTime = Date.now(); // Start the timer
  const allTransfersOverallFetch = updatedLeagueData.map(async (team) => {
    try {
      const transfersPromises = [];

      // Fetch transfer data for each team
      transfersPromises.push(
        fetch(`${BASE_URL}/entry/${team.entry}/transfers/`).then((response) =>
          response.json()
        )
      );

      // Wait for all transfer data to resolve
      const transfersData = await Promise.all(transfersPromises);

      // Add transfers data to the team's object
      team.transfers = transfersData;
    } catch (error) {
      console.error(`Error fetching transfers for team ${team.entry}: `, error);
    }
  });

  await Promise.all(allTransfersOverallFetch);
  const endTime = Date.now(); // End the timer
  console.log(
    `All transfers added in ${(endTime - startTime) / 1000} seconds.`
  );
  // Add a header above the table
  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `Gameweek ${currentGw} Transfer Summaries`;
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);
  console.log(updatedLeagueData);

  const gwFetches = updatedLeagueData.map(async (team) => {
    try {
      const response = await fetch(`${BASE_URL}entry/${team.entry}/history/`);
      const teamData = await response.json();
      // Add all gameweeks data to a new array
      team.everyGw = teamData.current.map((week) => ({
        percentile_rank: week.percentile_rank,
        bank: week.bank,
        gameweek: week.event,
        points: week.points,
        rank: week.rank,
        overall_rank: week.overall_rank,
        value: week.value,
        transfers: week.event_transfers,
        transfers_cost: week.event_transfers_cost,
        bench_points: week.points_on_bench,
      }));

      // Helper function to calculate a total for a specific field
      const calculateTotal = (field) =>
        teamData.current.reduce((sum, week) => sum + week[field], 0);

      // Calculate totals
      team.totalTransfers = calculateTotal("event_transfers");
      team.totalMinusPoints = calculateTotal("event_transfers_cost");
      team.totalPointsOnBench = calculateTotal("points_on_bench");

      // Helper function to find best and worst weeks by a specified field
      const findBestWorstWeek = (field) =>
        teamData.current.reduce(
          (result, week) => {
            if (week[field] > result.best[field]) result.best = week;
            if (week[field] < result.worst[field]) result.worst = week;
            return result;
          },
          { best: teamData.current[0], worst: teamData.current[0] }
        );

      // Set best and worst week by points and overall rank
      const { best: bestWeek, worst: worstWeek } = findBestWorstWeek("points");
      team.bestWeek = bestWeek;
      team.worstWeek = worstWeek;

      const { best: bestOverallRankWeek, worst: worstOverallRankWeek } =
        findBestWorstWeek("overall_rank");
      team.bestOverallRankWeek = bestOverallRankWeek;
      team.worstOverallRankWeek = worstOverallRankWeek;

      // Find the highest team value week
      team.highestValueWeek = teamData.current.reduce(
        (highest, week) => (week.value > highest.value ? week : highest),
        teamData.current[0]
      );

      // Add chips data (limited to 6 chips)
      //console.log(teamData)
      team.chips = teamData.chips.slice(0, 6).map((chip) => ({
        name: chip.name,
        time: chip.time,
        gw: chip.event,
      }));

      team.past = teamData.past;

      // Other team data
      team.seasons = teamData.past.length;
      team.seasons_managed = teamData.past[0]?.season_name || "NEW";
      team.previousRank =
        teamData.current[teamData.current.length - 2]?.overall_rank || "";
    } catch (error) {
      console.error(`Error fetching data for team ${team.entry}: `, error);
    }
  });

  await Promise.all(gwFetches);

  console.log(
    `All weeks data for all teams added in ${
      (endTime - startTime) / 1000
    } seconds.`
  );

  try {
    let scoreCounter = 0;

    for (const element of updatedLeagueData) {
      const gwTransfers = [];

      // Iterate through each transfer and call fetchPlayerFixtures
      for (const transfer of element.transfers[0].filter(
        (transfer) => transfer.event === currentGw
      )) {
        const p1Fixture = await fetchPlayerCurrentFixture(transfer.element_in);
        const p2Fixture = await fetchPlayerCurrentFixture(transfer.element_out);

        // Check if the fixture data exists and is finished
        if (
          p1Fixture.fixtures[0].event != currentGw &&
          p2Fixture.fixtures[0].event != currentGw
        ) {
          gwTransfers.push(transfer);
        }
      }

      let transferCost;
      if (element.everyGw[element.everyGw.length - 1].transfers_cost) {
        transferCost =
          element.everyGw[element.everyGw.length - 1].transfers_cost;
      } else {
        transferCost = 0;
      }

      if (
        gwTransfers.length ==
        element.everyGw[element.everyGw.length - 1].transfers
      ) {
        let totalScoreIn = gwTransfers.reduce(
          (sum, transfer) => sum + getPlayerScore(transfer.element_in),
          0
        );
        let totalScoreOut = gwTransfers.reduce(
          (sum, transfer) => sum + getPlayerScore(transfer.element_out),
          0
        );
        //Fails
        if (totalScoreIn - transferCost < totalScoreOut) {
          const team = document.createElement("div");
          team.setAttribute("id", "transfer-team");
          team.classList.add("transfer-fail");
          const teamHeader = document.createElement("div");
          teamHeader.setAttribute("id", "team-header");

          const entry = document.createElement("div");
          entry.innerHTML = `
            <strong style="font-size:1.2rem">${element.entry_name}</strong><br>
          `;
          teamHeader.append(entry);

          const chip = document.createElement("div");
          chip.setAttribute("id", "transfer-team-chip");

          // if (element.currentWeek[0].active_chip) {
          //   chip.innerHTML =
          //     "Chip Activated: " +
          //     convertChipName(element.currentWeek[0].active_chip);
          //   teamHeader.appendChild(chip);
          // }

          team.appendChild(teamHeader);

          const transfersDiv = document.createElement("div");
          transfersDiv.setAttribute("id", "team-transfers");

          gwTransfers.forEach((xfr) => {
            const transferDiv = document.createElement("div");
            transferDiv.setAttribute("id", "player-transfer");
            const tIn = document.createElement("div");
            tIn.setAttribute("id", "player-in");

            const cardIn = createPlayerCardNew(
              xfr.element_in,
              getPlayerScore(xfr.element_in),
              false,
              false,
              false
            );
            tIn.appendChild(cardIn);

            const tInArrow = document.createElement("img");
            tInArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tInArrow.setAttribute("id", "transfer-direction-in");
            tIn.append(tInArrow);

            const tOut = document.createElement("div");
            tOut.setAttribute("id", "player-out");

            const tOutArrow = document.createElement("img");
            tOutArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tOutArrow.setAttribute("id", "transfer-direction-out");
            tOut.append(tOutArrow);

            const cardOut = createPlayerCardNew(
              xfr.element_out,
              getPlayerScore(xfr.element_out),
              false,
              false,
              false
            );
            tOut.appendChild(cardOut);

            transferDiv.appendChild(tOut);
            transferDiv.appendChild(tIn);

            transfersDiv.appendChild(transferDiv);
            team.appendChild(transfersDiv);
          });

          const transferSummary = document.createElement("div");
          transferSummary.setAttribute("id", "transfer-summary");
          const summeryText = document.createElement("div");
          summeryText.innerHTML =
            `${element.entry_name} got ${totalScoreIn} points from the players that they transferred in this week (for a cost of ${transferCost}). The players that they transferred out got ${totalScoreOut}. ` +
            getRandomPhrase(negativeWords);

          const netPoints = document.createElement("div");
          netPoints.setAttribute("id", "net-points");

          netPoints.innerHTML =
            totalScoreOut - (totalScoreIn - transferCost) + "pts";

          if (Math.sign(totalScoreIn) == -1) {
            netPoints.innerHTML = totalScoreOut + "pts";
          }

          transferSummary.appendChild(summeryText);
          transferSummary.appendChild(netPoints);

          const shareData = {
            title: "Whooops",
            text: `${element.entry_name} - ` + summeryText.innerHTML,
            url: "https://fpltoolbox.com/transfer-fails/",
          };

          const shareButton = document.createElement("span");
          shareButton.innerText = "📨";
          shareButton.setAttribute("id", "share-points");

          // Share must be triggered by "user activation"
          shareButton.addEventListener("click", async () => {
            try {
              await navigator.share(shareData);
            } catch (err) {
              console.log(`Error: ${err}`);
            }
          });
          netPoints.append(shareButton);

          team.appendChild(transferSummary);
          app.appendChild(team);
        }
        //Successes
        if (totalScoreIn - transferCost > totalScoreOut) {
          const team = document.createElement("div");
          team.setAttribute("id", "transfer-team");
          team.classList.add("transfer-success");
          const teamHeader = document.createElement("div");
          teamHeader.setAttribute("id", "team-header");

          const entry = document.createElement("div");
          entry.innerHTML = `
            <strong style="font-size:1.2rem">${element.entry_name}</strong><br>

          `;
          teamHeader.append(entry);

          const chip = document.createElement("div");
          chip.setAttribute("id", "transfer-team-chip");

          team.appendChild(teamHeader);

          const transfersDiv = document.createElement("div");
          transfersDiv.setAttribute("id", "team-transfers");

          gwTransfers.forEach((xfr) => {
            console.log(xfr);
            const transferDiv = document.createElement("div");
            transferDiv.setAttribute("id", "player-transfer");
            const tIn = document.createElement("div");
            tIn.setAttribute("id", "player-in");

            const cardIn = createPlayerCard(
              xfr.element_in,
              getPlayerScore(xfr.element_in),
              false,
              false,
              false
            );
            tIn.appendChild(cardIn);

            const tInArrow = document.createElement("img");
            tInArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tInArrow.setAttribute("id", "transfer-direction-in");
            tIn.append(tInArrow);

            const tOut = document.createElement("div");
            tOut.setAttribute("id", "player-out");

            const tOutArrow = document.createElement("img");
            tOutArrow.src =
              "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
            tOutArrow.setAttribute("id", "transfer-direction-out");
            tOut.append(tOutArrow);

            const cardOut = createPlayerCard(
              xfr.element_out,
              getPlayerScore(xfr.element_out),
              false,
              false,
              false
            );
            tOut.appendChild(cardOut);

            transferDiv.appendChild(tOut);
            transferDiv.appendChild(tIn);

            transfersDiv.appendChild(transferDiv);
            team.appendChild(transfersDiv);
          });

          const transferSummary = document.createElement("div");
          transferSummary.setAttribute("id", "transfer-summary");
          const summeryText = document.createElement("div");
          summeryText.innerHTML =
            `${element.entry_name} got ${totalScoreIn} points from the players that they transferred in this week (for a cost of ${transferCost}). The players that they transferred out got ${totalScoreOut}. ` +
            getRandomPhrase(positiveWords);

          const netPoints = document.createElement("div");
          netPoints.setAttribute("id", "net-points");

          netPoints.innerHTML =
            totalScoreIn - transferCost - totalScoreOut + "pts";

          if (Math.sign(totalScoreIn) == -1) {
            netPoints.innerHTML = totalScoreOut + "pts";
          }

          transferSummary.appendChild(summeryText);
          transferSummary.appendChild(netPoints);

          const shareData = {
            title: "Whooops",
            text: `${element.entry_name} - ` + summeryText.innerHTML,
            url: "https://fpltoolbox.com/transfer-fails/",
          };

          const shareButton = document.createElement("span");
          shareButton.innerText = "📨";
          shareButton.setAttribute("id", "share-points");

          // Share must be triggered by "user activation"
          shareButton.addEventListener("click", async () => {
            try {
              await navigator.share(shareData);
            } catch (err) {
              console.log(`Error: ${err}`);
            }
          });
          netPoints.append(shareButton);

          team.appendChild(transferSummary);
          app.appendChild(team);
        }
      }
    }
    console.log(scoreCounter);
    if (scoreCounter == 0) {
      const team = document.createElement("div");
      team.setAttribute("id", "transfer-team");
      const teamHeader = document.createElement("div");
      teamHeader.setAttribute("id", "team-header");
      teamHeader.innerHTML =
        "Complete - You'll only see something here if each player in a transfer has played their game. If you can't see anything here, check back when a few more games have been played this gameweek";
      teamHeader.style.color = "lightgrey";
      team.appendChild(teamHeader);
      app.appendChild(team);
    }

    insertAdManually("#transfer-team");

    // Stop and clean up the loading bar
    loader.stop();
    loader.remove();
  } catch (error) {
    console.error("Error processing transfers: ", error);
  }
}

async function overNightPriceChanges() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const tableHeader = document.createElement("h6");

  // Function to calculate the countdown timer
  function getCountdown() {
    const now = new Date();
    const targetTime = new Date();

    // Set target time to 03:00 UK time (considering UTC)
    targetTime.setUTCHours(3, 0, 0, 0); // 3:00 AM UTC
    if (now >= targetTime) {
      // If it's past 3:00 AM, set target to the next day
      targetTime.setUTCDate(targetTime.getUTCDate() + 1);
    }

    const diff = targetTime - now; // Difference in milliseconds

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Function to update the countdown timer dynamically
  function updateCountdown() {
    tableHeader.innerText = `FPL Player Price Changes \n Gameweek: ${currentGw}/${
      currentGw + 1
    } \n Time until next update: ${getCountdown()}`;
  }

  // Initialize the header and start the countdown
  updateCountdown();
  setInterval(updateCountdown, 1000); // Update every second
  tableHeader.style.textAlign = "center";
  app.appendChild(tableHeader);

  const playerPriceChangeContainer = document.createElement("div");
  playerPriceChangeContainer.id = "player-price-change-container";

  const playerPriceIncrease = document.createElement("div");
  playerPriceIncrease.id = "player-price-increase";

  const playerPriceDecrease = document.createElement("div");
  playerPriceDecrease.id = "player-price-decrease";

  const loader = new LoadingBar(app);
  loader.start();
  try {
    const res = await fetch("https://fpl-server-m9xa.onrender.com/api/data");
    const data = await res.json();
    console.log(data);
    // Get preChange and afterChange directly without unnecessary looping
    const preChange = data[data.length - 2]?.elements || [];
    const afterChange = data[data.length - 1]?.elements || [];

    console.log(preChange);
    console.log(afterChange);

    const priceChanges = trackPriceChanges(preChange, afterChange);
    console.log(priceChanges);

    priceChanges.forEach((player) => {
      console.log(player);
      const team = document.createElement("div");
      team.id = "team-card";
      team.classList.add("team-card");

      // Team header
      const teamHeader = document.createElement("div");
      teamHeader.id = "team-header";

      // Add team and player names
      const entry = document.createElement("div");
      entry.innerHTML = `
        <strong style="font-size:1.2rem">${player.name}</strong><br>
                <div style="font-size:0.7rem">£${player.prePrice / 10}m (${
        (player.postPrice - player.prePrice) / 10
      })</div>
        <div style="font-size:2rem">£${player.postPrice / 10}m</div>
      `;
      teamHeader.appendChild(entry);
      team.appendChild(teamHeader);
      const playerPhoto = document.createElement("img");
      playerPhoto.id = "price-change-player-img";
      playerPhoto.src =
        "https://resources.premierleague.com/premierleague/photos/players/250x250/p" +
        getPlayerPhoto(player.afterPlayer.id).slice(0, -3) +
        "png";
      teamHeader.appendChild(playerPhoto);
      if (player.prePrice < player.postPrice) {
        const change = document.createElement("img");
        change.src = `https://fpltoolbox.com/wp-content/uploads/2024/12/green-arrow.png`;
        change.style = "max-width:30px";
        teamHeader.append(change);
        playerPriceIncrease.append(team);
      } else {
        const change = document.createElement("img");
        change.src = `https://fpltoolbox.com/wp-content/uploads/2024/12/red-arrow.png`;
        change.style = "max-width:30px; rotate:180deg";

        teamHeader.append(change);
        playerPriceDecrease.append(team);
      }
    });

    if ((priceChanges.length = 0)) {
      const team = document.createElement("div");
      team.id = "team-card";
      team.classList.add("team-card");

      // Team header
      const teamHeader = document.createElement("div");
      teamHeader.id = "team-header";
      // Add team and player names
      const entry = document.createElement("div");
      entry.innerHTML = `
        <strong style="font-size:1.2rem">No price changes</strong><br>
        <div style="font-size:0.7rem">Come back tomorrow</div>
      `;
      teamHeader.appendChild(entry);
      team.appendChild(teamHeader);
      app.append(team);
    }

    playerPriceChangeContainer.appendChild(playerPriceIncrease);
    playerPriceChangeContainer.appendChild(playerPriceDecrease);
    app.appendChild(playerPriceChangeContainer);
    loader.stop();
    loader.remove();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

function trackPriceChanges(preChange, afterChange) {
  const priceChanges = [];

  // Use .map() to avoid unnecessary 'find' method in each loop iteration
  preChange.forEach((prePlayer) => {
    const afterPlayer = afterChange.find(
      (player) => player.id === prePlayer.id
    );

    if (afterPlayer && prePlayer.now_cost !== afterPlayer.now_cost) {
      priceChanges.push({
        prePlayer,
        afterPlayer,
        name: prePlayer.web_name,
        prePrice: prePlayer.now_cost,
        postPrice: afterPlayer.now_cost,
      });
    }
  });

  return priceChanges;
}

function renderStrategySelector() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `Chip Strategy Tool`;
  tableDescription.style.textAlign = "center";
  tableDescription.style.paddingLeft = "20px";
  tableDescription.style.paddingRight = "20px";

  app.appendChild(tableDescription);
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="strategy-container" style="padding:0px 20px 0px;" >    
      <p>Select the chips you still have available:</p>
      <div>
          <label class="tool">
              <input type="checkbox" value="Triple Captain" id="tool1"> Triple Captain
          </label>
          <label class="tool">
              <input type="checkbox" value="Wildcard" id="tool2"> Wildcard
          </label>
          <label class="tool">
              <input type="checkbox" value="Assistant Manager" id="tool3"> Assistant Manager
          </label>
          <label class="tool">
              <input type="checkbox" value="Free Hit" id="tool4"> Free Hit
          </label>
          <label class="tool">
              <input type="checkbox" value="Bench Boost" id="tool5"> Bench Boost
          </label>
      </div>
      <button onclick="filterStrategies()">Show Strategies</button>

      <div class="strategies" id="strategies">
          <p>Some Stragies might be duplicated depending on the chips you have left</p>
      </div>
</div>

  `;

  app.append(div);
}

const fixtures = {
  24: `Double Gameweek confirmed - LIV & EVE play twice.
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">NFO<br>BHA</div>
<div id="diff9">BOU<br>LIV</div>
<div id="diff9">EVE<br>LEI</div>
<div id="diff9">IPS<br>SOU</div>
<div id="diff9">NEW<br>FUL</div>
<div id="diff9">WOL<br>AVL</div>
<div id="diff9">BRE<br>TOT</div>
<div id="diff9">MUN<br>CRY</div>
<div id="diff9">ARS<br>MCI</div>
<div id="diff9">CHE<br>WHU</div>
<div id="diff8">EVE<br>LIV</div>
</div>
 `,
  25: `Double Gameweek confirmed.
  <div class="up-coming-season-fixtures-for-chips">
<div id="diff9">BHA<br>CHE</div>
<div id="diff9">LEI<br>ARS</div>
<div id="diff9">AVL<br>IPS</div>
<div id="diff9">FUL<br>NFO</div>
<div id="diff9">MCI<br>NEW</div>
<div id="diff9">SOU<br>BOU</div>
<div id="diff9">WHU<br>BRE</div>
<div id="diff9">CRY<br>EVE</div>
<div id="diff9">LIV<br>WOL</div>
<div id="diff9">TOT<br>MUN</div>
<div id="diff8">LIV<br>AVL</div>


</div>`,
  26: `
  <div class="up-coming-season-fixtures-for-chips">
<div id="diff9">LEI<br>BRE</div>
<div id="diff9">EVE<br>MUN</div>
<div id="diff9">ARS<br>WHU</div>
<div id="diff9">BOU<br>WOL</div>
<div id="diff9">FUL<br>CRY</div>
<div id="diff9">IPS<br>TOT</div>
<div id="diff9">SOU<br>BHA</div>
<div id="diff9">AVL<br>CHE</div>
<div id="diff9">NEW<br>NFO</div>
<div id="diff9">MCI<br>LIV</div>
</div>`,

  27: `
  <div class="up-coming-season-fixtures-for-chips">
<div id="diff9">BHA<br>BOU</div>
<div id="diff9">CRY<br>AVL</div>
<div id="diff9">WOL<br>FUL</div>
<div id="diff9">CHE<br>SOU</div>
<div id="diff9">BRE<br>EVE</div>
<div id="diff9">MUN<br>IPS</div>
<div id="diff9">NFO<br>ARS</div>
<div id="diff9">TOT<br>MCI</div>
<div id="diff9">LIV<br>NEW</div>
<div id="diff9">WHU<br>LEI</div>
</div>`,
  28: `
  <div class="up-coming-season-fixtures-for-chips">
<div id="diff9">BRE<br>AVL</div>
<div id="diff9">BHA<br>FUL</div>
<div id="diff9">CHE<br>LEI</div>
<div id="diff9">CRY<br>IPS</div>
<div id="diff9">LIV<br>SOU</div>
<div id="diff9">MUN<br>ARS</div>
<div id="diff9">NFO<br>MCI</div>
<div id="diff9">TOT<br>BOU</div>
<div id="diff9">WHU<br>NEW</div>
<div id="diff9">WOL<br>EVE</div>
</div>`,
  29: `Blank Gamweek - LIV, AVL, NEW, and CRY will blank.
  <div class="up-coming-season-fixtures-for-chips">
<div id="diff9">ARS<br>CHE</div>
<div id="diff7">AVL<br>LIV</div>
<div id="diff9">BOU<br>BRE</div>
<div id="diff9">EVE<br>WHU</div>
<div id="diff9">FUL<br>TOT</div>
<div id="diff9">IPS<br>NFO</div>
<div id="diff9">LEI<br>MUN</div>
<div id="diff9">MCI<br>BHA</div>
<div id="diff7">NEW<br>CRY</div>
<div id="diff9">SOU<br>WOL</div>
</div>`,
  30: `
  <div class="up-coming-season-fixtures-for-chips">
<div id="diff9">ARS<br>FUL</div>
<div id="diff9">BOU<br>IPS</div>
<div id="diff9">BHA<br>AVL</div>
<div id="diff9">NFO<br>MUN</div>
<div id="diff9">WOL<br>WHU</div>
<div id="diff9">CHE<br>TOT</div>
<div id="diff9">MCI<br>LEI</div>
<div id="diff9">NEW<br>BRE</div>
<div id="diff9">SOU<br>CRY</div>
<div id="diff9">LIV<br>EVE</div>
</div>`,
  31: `
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">AVL<br>NFO</div>
<div id="diff9">BRE<br>CHE</div>
<div id="diff9">CRY<br>BHA</div>
<div id="diff9">EVE<br>ARS</div>
<div id="diff9">FUL<br>LIV</div>
<div id="diff9">IPS<br>WOL</div>
<div id="diff9">LEI<br>NEW</div>
<div id="diff9">MUN<br>MCI</div>
<div id="diff9">TOT<br>SOU</div>
<div id="diff9">WHU<br>BOU</div>
</div>`,
  32: `
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">ARS<br>BRE</div>
<div id="diff9">BOU<br>FUL</div>
<div id="diff9">BHA<br>LEI</div>
<div id="diff9">CHE<br>IPS</div>
<div id="diff9">LIV<br>WHU</div>
<div id="diff9">MCI<br>CRY</div>
<div id="diff9">NEW<br>MUN</div>
<div id="diff9">NFO<br>EVE</div>
<div id="diff9">SOU<br>AVL</div>
<div id="diff9">WOL<br>TOT</div>
</div>`,
  33: `Double Gameweek confirmed. Teams that will blank in GW29 will likely double in GW33. This will update after GW25 and before the GW30 deadline.
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">AVL<br>NEW</div>
<div id="diff9">BRE<br>BHA</div>
<div id="diff9">CRY<br>BOU</div>
<div id="diff9">EVE<br>MCI</div>
<div id="diff9">FUL<br>CHE</div>
<div id="diff9">IPS<br>ARS</div>
<div id="diff9">LEI<br>LIV</div>
<div id="diff9">MUN<br>WOL</div>
<div id="diff9">TOT<br>NFO</div>
<div id="diff9">WHU<br>SOU</div>
</div>`,
  34: `Blank Gamweek - Teams that reach the FA Cup semi-finals will blank in GW34 - This will update after GW28.
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">ARS<br>CRY</div>
<div id="diff9">BOU<br>MUN</div>
<div id="diff9">BHA<br>WHU</div>
<div id="diff9">CHE<br>EVE</div>
<div id="diff9">LIV<br>TOT</div>
<div id="diff9">MCI<br>AVL</div>
<div id="diff9">NEW<br>IPS</div>
<div id="diff9">NFO<br>BRE</div>
<div id="diff9">SOU<br>FUL</div>
<div id="diff9">WOL<br>LEI</div>
</div>`,
  35: `
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">ARS<br>BOU</div>
<div id="diff9">AVL<br>FUL</div>
<div id="diff9">BRE<br>MUN</div>
<div id="diff9">BHA<br>NEW</div>
<div id="diff9">CHE<br>LIV</div>
<div id="diff9">CRY<br>NFO</div>
<div id="diff9">EVE<br>IPS</div>
<div id="diff9">LEI<br>SOU</div>
<div id="diff9">MCI<br>WOL</div>
<div id="diff9">WHU<br>TOT</div>
</div>`,
  36: `Double Gameweek confirmed. Teams that will blank in GW34 will likely have two fixtures here. This will update after GW30 and before GW34.
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">BOU<br>AVL</div>
<div id="diff9">FUL<br>EVE</div>
<div id="diff9">IPS<br>BRE</div>
<div id="diff9">LIV<br>ARS</div>
<div id="diff9">MUN<br>WHU</div>
<div id="diff9">NEW<br>CHE</div>
<div id="diff9">NFO<br>LEI</div>
<div id="diff9">SOU<br>MCI</div>
<div id="diff9">TOT<br>CRY</div>
<div id="diff9">WOL<br>BHA</div>
</div>`,
  37: `
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">ARS<br>NEW</div>
<div id="diff9">AVL<br>TOT</div>
<div id="diff9">BRE<br>FUL</div>
<div id="diff9">BHA<br>LIV</div>
<div id="diff9">CHE<br>MUN</div>
<div id="diff9">CRY<br>WOL</div>
<div id="diff9">EVE<br>SOU</div>
<div id="diff9">LEI<br>IPS</div>
<div id="diff9">MCI<br>BOU</div>
<div id="diff9">WHU<br>NFO</div>
</div>`,
  38: `
<div class="up-coming-season-fixtures-for-chips">
<div id="diff9">BOU<br>LEI</div>
<div id="diff9">FUL<br>MCI</div>
<div id="diff9">IPS<br>WHU</div>
<div id="diff9">LIV<br>CRY</div>
<div id="diff9">MUN<br>AVL</div>
<div id="diff9">NEW<br>EVE</div>
<div id="diff9">NFO<br>CHE</div>
<div id="diff9">SOU<br>ARS</div>
<div id="diff9">TOT<br>BHA</div>
<div id="diff9">WOL<br>BRE</div>
</div>`,
};

const strategies = [
  {
    name: "Strategy 1",
    tools: [
      { name: "Triple Captain", week: "25" },
      { name: "Wildcard", week: "Week 30" },
      { name: "Assistant Manager", week: "Week 31" },
      { name: "Free Hit", week: "Week 34" },
      { name: "Bench Boost", week: "Week 36" },
    ],
  },
  {
    name: "Strategy 2",
    tools: [
      { name: "Triple Captain", week: "25" },
      { name: "Free Hit", week: "Week 29" },
      { name: "Assistant Manager", week: "Week 31" },
      { name: "Wildcard", week: "Week 35" },
      { name: "Bench Boost", week: "Week 36" },
    ],
  },
  {
    name: "Strategy 3",
    tools: [
      { name: "Wildcard", week: "Week 30" },
      { name: "Triple Captain", week: "Week 33" },
      { name: "Free Hit", week: "Week 34" },
      { name: "Bench Boost", week: "Week 36" },
    ],
  },
  {
    name: "Strategy 4",
    tools: [
      { name: "Free Hit", week: "Week 29" },
      { name: "Triple Captain", week: "Week 33" },
      { name: "Wildcard", week: "Week 35" },
      { name: "Bench Boost", week: "Week 36" },
    ],
  },
  {
    name: "Strategy 5",
    tools: [
      { name: "Triple Captain", week: "25" },
      { name: "Wildcard", week: "Week 30" },
      { name: "Bench Boost", week: "Week 33" },
      { name: "Free Hit", week: "Week 34" },
      { name: "Assistant Manager", week: "Week 36" },
    ],
  },
  {
    name: "Strategy 6",
    tools: [
      { name: "Triple Captain", week: "25" },
      { name: "Free Hit", week: "Week 29" },
      { name: "Bench Boost", week: "Week 33" },
      { name: "Wildcard", week: "Week 35" },
      { name: "Assistant Manager", week: "Week 36" },
    ],
  },
];

function filterStrategies() {
  const selectedTools = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);

  const strategiesDiv = document.getElementById("strategies");
  strategiesDiv.innerHTML = "<h2>Possible strategies:</h2>";

  strategies.forEach((strategy) => {
    const availableTools = strategy.tools.filter((tool) =>
      selectedTools.includes(tool.name)
    );

    let toolsList = availableTools
      .map((tool) => {
        const weekMatch = tool.week.match(/\d+/g);
        const startWeek = weekMatch ? parseInt(weekMatch[0]) : null;

        let spanWeeks = 1; // Default span
        if (tool.name === "Assistant Manager") {
          spanWeeks = 3; // Assistant Manager spans 3 weeks
        } else if (
          tool.name === "Triple Captain" &&
          tool.week === "Week 24 or 25"
        ) {
          spanWeeks = 2; // Triple Captain spans 2 weeks
        }

        let fixtureInfo = "";
        if (startWeek) {
          for (let i = 0; i < spanWeeks; i++) {
            const weekFixtures =
              fixtures[startWeek + i] || "No notable fixtures.";
            fixtureInfo += `Week ${
              startWeek + i
            } Fixtures: ${weekFixtures}<br>`;
          }
        } else {
          fixtureInfo = "No notable fixtures.";
        }

        return `<li><div class="chip-title">${tool.name} - ${tool.week}</div><span class="fixtures">${fixtureInfo}</span></li>`;
      })
      .join("");

    strategiesDiv.innerHTML += `
          <div class="strategy">
              <div class="strategy-header">${strategy.name}</div>
              <div class="strategy-content collapsed">
                  <ul>${toolsList}</ul>
              </div>
          </div>`;
  });

  // Add event listeners to toggle collapsible sections
  document.querySelectorAll(".strategy-header").forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      content.classList.toggle("collapsed");
    });
  });
  insertAdManually(".strategy-header");
}

async function showMemes() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${leagueName} - Gameweek ${currentGw} Memes \n Tap a meme to share`;
  tableDescription.style.textAlign = "center";
  app.appendChild(tableDescription);

  const memeContainer = document.createElement("div");
  memeContainer.id = "meme-container";
  // Create and append the loading indicator
  const memeLoaderContainer = document.createElement("div");
  memeLoaderContainer.id = "meme-loader-container";

  // List of URLs where you want to ignore the condition
  const ignoredUrls = [
    "https://fpltoolbox.com/tools-for-fpl-content/", // Example full URL
    "http://127.0.0.1:5500/index.html",
  ];

  const currentUrl = window.location.href; // Get the full URL

  if (
    currentGw !== 34 && // Ignore this whole check if we're in Gameweek 34
    !ignoredUrls.includes(currentUrl) && // Check if the full URL is not in the ignore list
    eventStatus.status[eventStatus.status.length - 1].bonus_added === false
  ) {
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText = `Hold up - Let's wait for the gameweek to end before we start making accusations 👀`;
    memeLoader.className = "skeleton";
    memeLoaderContainer.appendChild(memeLoader);
    app.append(memeLoaderContainer);
    return;
  }

  const memeLoader = document.createElement("div");
  memeLoader.id = "meme-loader";
  memeLoader.innerText = "Memes loading..."; // Optional text
  memeLoader.innerText = `Loading some juicy memes for you... 👀`;
  memeLoader.className = "skeleton";

  for (let i = 0; i < 4; i++) {
    memeLoaderContainer.appendChild(memeLoader.cloneNode(true));
  }

  app.append(memeLoaderContainer);
  await createLeaguePromise;
  memeLoaderContainer.remove();

  function getRandomTeam(league) {
    return league[Math.floor(Math.random() * league.length)];
  }
  const pointingAtYouMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/ronaldo.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/vaya.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/3845a815f8746f8cb96c6effd98d37c9.jpg",
  ];
  const surprisedMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/omg-ohmygod.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/wow.png",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/1grvjo.jpg",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/yeah-excellent.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/lego-lego-batman.gif",
  ];

  const suicidalMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/Ben-Affleck-Smoking-meme-1.jpg",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/suicidal.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/oh-ffs-8abb884c90.jpg",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/crying-crying-meme.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/caught-out.webp",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/giphy.gif",
  ];

  const utterWokeMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/sean-dyche-football.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/r7vfc0oych5e1.jpeg",
  ];

  function findCaptaincyFailDrake() {
    for (const team of league) {
      let captain = null;
      let vice = null;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.is_captain) captain = player;
        if (player.is_vice_captain) vice = player;
      });

      if (captain && vice) {
        if (getPlayerScore(vice.element) > getPlayerScore(captain.element)) {
          const message = `Bro making gameweek ${currentGw} captaincy decisions`;

          const capCard = createPlayerCardNew(
            captain.element,
            getPlayerScore(captain.element),
            true,
            null,
            null
          );
          const viceCard = createPlayerCardNew(
            vice.element,
            getPlayerScore(vice.element),
            null,
            true,
            null
          );

          if (capCard instanceof HTMLElement) {
            capCard.style.marginLeft = "-70%";
            viceCard.style.marginLeft = "-70%";
            capCard.style.transform = "scale(1.2)";
            viceCard.style.transform = "scale(1.2)";
          } else {
            console.warn("message2 is not a DOM element:", capCard);
          }
          const footer = `Spoiler alert, It's ${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}`;
          // Image URL for meme
          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/30b1gx-1.jpg";

          const meme = createMeme4Corners(
            message,
            " ",
            viceCard,
            capCard,
            " ",
            footer,
            img
          );

          memeContainer.append(meme);

          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a captaincy fail.");
  }
  function findCaptaincyFailDoggo() {
    for (const team of league) {
      let captain = null;
      let vice = null;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.is_captain) captain = player;
        if (player.is_vice_captain) vice = player;
      });

      if (captain && vice) {
        if (getPlayerScore(vice.element) > getPlayerScore(captain.element)) {
          const message = `${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}'s vice captain vs actual captain`;

          const capCard = createPlayerCardNew(
            captain.element,
            getPlayerScore(captain.element),
            true,
            null,
            null
          );
          const viceCard = createPlayerCardNew(
            vice.element,
            getPlayerScore(vice.element),
            null,
            true,
            null
          );

          if (capCard instanceof HTMLElement) {
            // capCard.style.marginLeft = "-70%";
            // viceCard.style.marginLeft = "-70%";
            capCard.style.transform = "scale(1.2)";
            viceCard.style.transform = "scale(1.2)";
          } else {
            console.warn("message2 is not a DOM element:", capCard);
          }
          const footer = `www.fpltoolbox.com`;
          // Image URL for meme
          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/430zkq.webp";

          const meme = createMeme4Corners(
            message,
            null,
            capCard,
            null,
            viceCard,
            footer,
            img
          );

          memeContainer.append(meme);

          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a captaincy fail.");
  }

  function findKeeperFail() {
    for (const team of league) {
      let keeper = null;
      let benchedKeeper = null;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.element_type == 1 && player.position == 1) keeper = player;
        if (player.element_type == 1 && player.position == 12)
          benchedKeeper = player;
      });

      if (keeper && benchedKeeper) {
        if (
          getPlayerScore(benchedKeeper.element) > getPlayerScore(keeper.element)
        ) {
          const message = `${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}'s thought process when deciding which keeper to start in gameweek ${currentGw}`;

          const capCard = createPlayerCardNew(
            keeper.element,
            getPlayerScore(keeper.element),
            null,
            null,
            null
          );
          const viceCard = createPlayerCardNew(
            benchedKeeper.element,
            getPlayerScore(benchedKeeper.element),
            null,
            null,
            null
          );

          if (capCard instanceof HTMLElement) {
            capCard.style.marginLeft = "-70%";
            viceCard.style.marginLeft = "-70%";
            capCard.style.transform = "scale(1.2)";
            viceCard.style.transform = "scale(1.2)";
          } else {
            console.warn("message2 is not a DOM element:", capCard);
          }

          // Image URL for meme
          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/30b1gx-1.jpg";

          const meme = createMeme4Corners(
            message,
            " ",
            viceCard,
            capCard,
            " ",
            null,
            img
          );

          memeContainer.append(meme);

          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a keeper bench fail.");
  }

  function findHighestandLowest() {
    const lowestTeam = league.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, league[0]); // Start with the first team
    const highestTeam = league.reduce((highest, team) => {
      return team.event_total > highest.event_total ? team : highest;
    }, league[0]); // Start with the first team

    console.log(lowestTeam);
    console.log(highestTeam);
    const team1 = `${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )}`;
    const team2 = `${highestTeam.player_name.substring(
      0,
      highestTeam.player_name.indexOf(" ")
    )}`;
    const img =
      "https://fpltoolbox.com/wp-content/uploads/2025/02/Batman-Slapping-Robin.jpg";
    const meme = createMeme4Corners(
      null,
      `GW${currentGw} locked in!`,
      `Nah mate, \n not this week!`,
      `${team2}`,
      `${team1}`,
      null,
      img
    );
    memeContainer.append(meme);
  }

  function findWorstRun() {
    const worstRankRun = league.find((team) => {
      const totalGWs = team.everyGw.length;

      // Ensure at least 3 gameweeks exist
      if (totalGWs < 3) return false;

      // Extract last 3 gameweek ranks
      const lastThreeRanks = team.everyGw
        .slice(-3)
        .map((gw) => gw.overall_rank);

      // Check if rank is consistently getting worse
      return (
        lastThreeRanks[0] < lastThreeRanks[1] &&
        lastThreeRanks[1] < lastThreeRanks[2]
      );
    });

    console.log(worstRankRun);

    if (worstRankRun) {
      const message1 = `When ${worstRankRun.player_name.substring(
        0,
        worstRankRun.player_name.indexOf(" ")
      )} realises that ${
        worstRankRun.entry_name
      } has had red arrows for three weeks in a row`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/Monkey-Puppet-e1739162235444.jpg";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,

        img
      );
      memeContainer.append(meme);
    }
  }

  function findBestMiniLeagueRun() {
    if (league[0].rank == league[0].last_rank) {
      const message1 = `${league[0].player_name.substring(
        0,
        league[0].player_name.indexOf(" ")
      )} being handed the award from last week's mini-league number 1`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/download-1.png";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,

        img
      );
      memeContainer.append(meme);
    }
  }

  function findChillGuy() {
    if (league[0].rank == league[0].last_rank) {
      const message1 = `Just ${league[0].player_name.substring(
        0,
        league[0].player_name.indexOf(" ")
      )} being a chill guy at the top of the mini-league again`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/9au02y.jpg";
      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findStrikerFail() {
    for (const team of league) {
      let striker = null;
      let benchedStriker = null;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (
          player.element_type == 4 &&
          player.position > 1 &&
          player.position < 12
        )
          striker = player;
        if (player.element_type == 4 && player.position > 11)
          benchedStriker = player;
      });

      if (striker && benchedStriker) {
        if (
          getPlayerScore(benchedStriker.element) >
          getPlayerScore(striker.element)
        ) {
          const message1 = `Imagine starting ${getPlayerWebName(
            striker.element
          )} but leaving ${getPlayerWebName(
            benchedStriker.element
          )} on the bench this week`;

          const message2 = `${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}, \n to pick a striker!`;

          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/4lts08-e1739170546997.jpg";

          const benchCard = createPlayerCardNew(
            benchedStriker.element,
            getPlayerScore(benchedStriker.element),
            null,
            null,
            null
          );

          const footer = document.createElement("div");
          footer.style.display = "flex"; // Optional: Arrange elements in a row
          footer.style.alignItems = "center"; // Optional: Align content nicely
          footer.style.gap = "10px"; // Optional: Add space between them
          footer.style.color = "black";
          footer.style.backgroundColor = "white";
          footer.style.paddingLeft = "30px";
          footer.style.paddingright = "30px";
          footer.style.paddingTop = "10px";
          footer.style.paddingBottom = "10px";

          // Append benchCard (if it's an HTML element)
          if (benchCard instanceof HTMLElement) {
            footer.appendChild(benchCard);
          } else {
            console.warn("benchCard is not a valid HTMLElement", benchCard);
          }

          // Append message2 (if it's a string)
          if (typeof message2 === "string") {
            const messageText = document.createElement("span");
            messageText.textContent = message2;
            messageText.style.textAlign = "center";
            messageText.classList.add("whitespace-fix");
            footer.appendChild(messageText);
          } else {
            console.warn("message2 is not a string", message2);
          }

          const meme = createMeme4Corners(
            message1,
            null,
            null,
            null,
            null,
            footer,
            img
          );
          memeContainer.append(meme);
          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a striker bench fail.");
  }

  function findLowestScorer() {
    const lowestTeam = league.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, league[0]); // Start with the first team

    console.log(lowestTeam);

    const message1 = `I bet he's thinking about other women`;
    const message2 = `${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )}: How have I only got ${lowestTeam.event_total} FPL points this week`;

    const img = "https://fpltoolbox.com/wp-content/uploads/2025/02/1tl71a.jpg";

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      message2,
      img
    );
    memeContainer.append(meme);
  }

  function findLowestScorer1() {
    const lowestTeam = league.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, league[0]); // Start with the first team

    console.log(lowestTeam);

    const message1 = `POV: Realising that you've got to listen to another year of "We got ____ before GTA 6... "`;
    const message2 = `and ${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )} being shit at FPL`;

    const img =
      "https://fpltoolbox.com/wp-content/uploads/2025/05/disgusted.webp";

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      message2,
      img
    );
    memeContainer.append(meme);
  }

  function findLowestScorerAlternative() {
    const lowestTeam = league.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, league[0]); // Start with the first team

    console.log(lowestTeam);

    const message1 = `POV: ${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )} waiting for some FPL points this week`;

    const img = "https://fpltoolbox.com/wp-content/uploads/2025/02/1c1uej.jpg";

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      null,
      img
    );
    memeContainer.append(meme);
  }

  function findBelowAverage() {
    gwAverage = bootstrap.events[currentGw - 1].average_entry_score;

    const lowestAverage = league.filter((team) => team.event_total < gwAverage);

    console.log(lowestAverage);
    if (lowestAverage > 0) {
      const randomTeam = getRandomTeam(lowestAverage);

      const message1 = `POV: ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} waiting to get at least the gameweek average this week`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/1c1uej.jpg";

      const message2 = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} needs ${gwAverage - randomTeam.event_total} more points 😅 `;

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        message2,
        img
      );
      memeContainer.append(meme);
    }
  }

  function find100Plus() {
    const club100 = league.filter((team) => team.event_total > 99);

    const randomTeam = getRandomTeam(club100);

    if (randomTeam) {
      const message1 = `POV: Your bro ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} enters the 100 club this week`;

      const message2 = `(GW ${currentGw} score: ${randomTeam.event_total})`;

      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/aplausos-clapped.gif";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        message2,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findHighBench() {
    const teamsWithHighBenchPoints = []; // Array to store teams with bench points > 10

    for (const team of league) {
      let totalBenchPoints = 0;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (player.position > 11 && player.position < 16) {
          totalBenchPoints += getPlayerScore(player.element);
        }
      });

      //console.log("Player Bench Points: " + totalBenchPoints);

      // Only store teams with bench points greater than 10
      if (totalBenchPoints > 10) {
        teamsWithHighBenchPoints.push({ team, totalBenchPoints });
      }
    }

    //console.log(teamsWithHighBenchPoints); // Check the stored teams

    if (teamsWithHighBenchPoints.length > 0) {
      const randomTeam = getRandomTeam(teamsWithHighBenchPoints);

      const message1 = `POV: ${randomTeam.team.player_name.substring(
        0,
        randomTeam.team.player_name.indexOf(" ")
      )} after leaving ${
        randomTeam.totalBenchPoints
      } points on the bench this week`;
      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findLowBench() {
    const teamsWithHighBenchPoints = []; // Array to store teams with bench points > 10

    for (const team of league) {
      let totalBenchPoints = 0;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (player.position > 11 && player.position < 16) {
          totalBenchPoints += getPlayerScore(player.element);
        }
      });

      //console.log("Player Bench Points: " + totalBenchPoints);

      // Only store teams with bench points greater than 10
      if (totalBenchPoints == 4) {
        teamsWithHighBenchPoints.push({ team, totalBenchPoints });
      }
    }

    //console.log(teamsWithHighBenchPoints); // Check the stored teams

    if (teamsWithHighBenchPoints.length > 0) {
      const randomTeam = getRandomTeam(teamsWithHighBenchPoints);

      const message1 = `POV: ${randomTeam.team.player_name.substring(
        0,
        randomTeam.team.player_name.indexOf(" ")
      )}'s masterclass of a bench this gameweek`;
      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedhBench() {
    const teamsWithHighBenchPoints = []; // Array to store teams with bench points > 10

    for (const team of league) {
      let totalBenchPoints = 0;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (player.position > 11 && player.position < 16) {
          totalBenchPoints += getPlayerScore(player.element);
        }
      });

      //console.log("Player Bench Points: " + totalBenchPoints);

      // Only store teams with bench points greater than 10
      if (totalBenchPoints > 10) {
        teamsWithHighBenchPoints.push({ team, totalBenchPoints });
      }
    }

    //console.log(teamsWithHighBenchPoints); // Check the stored teams

    if (teamsWithHighBenchPoints.length > 0) {
      const randomTeam = getRandomTeam(teamsWithHighBenchPoints);

      const message1 = document.createElement("div");
      message1.innerText = `Seeing your players score `;
      message1.style.color = "black";

      const message2 = document.createElement("div");
      message2.innerText = `${randomTeam.team.player_name.substring(
        0,
        randomTeam.team.player_name.indexOf(" ")
      )} after leaving them on the bench in GW${currentGw}`;
      message2.style.color = "black";

      const img = "https://fpltoolbox.com/wp-content/uploads/2025/03/pep.jpg";

      const meme = createMeme4Corners(
        null,
        message1,
        null,
        null,
        message2,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  async function findRedCards() {
    const teamsWithRedCards = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of league) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        let playerStats;

        // Check if player's stats are already cached
        if (playerStatsCache.has(player.element)) {
          playerStats = playerStatsCache.get(player.element);
        } else {
          // Fetch and store in cache
          playerStats = await fetchPlayerCurrentStats(player.element);
          playerStatsCache.set(player.element, playerStats);
        }

        if (playerStats[0].red_cards > 0) {
          console.log(playerStats);
          teamsWithRedCards.push(team);
          team.redCardPlayer = player.element;
          break; // Stop checking this team's players and move to the next team
        }
      }
    }

    if (teamsWithRedCards.length > 0) {
      const randomTeam = getRandomTeam(teamsWithRedCards);
      console.log(randomTeam);

      const message1 = `When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} gets a player sent off:`;

      const img =
        utterWokeMemes[Math.floor(Math.random() * utterWokeMemes.length)];

      const message2 = createPlayerCardNew(
        randomTeam.redCardPlayer,
        getPlayerScore(randomTeam.redCardPlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.remove();
    }
  }

  async function findTwoYellows() {
    const teamsWithTwoYellows = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of league) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        let playerStats;

        // Check if player's stats are already cached
        if (playerStatsCache.has(player.element)) {
          playerStats = playerStatsCache.get(player.element);
        } else {
          // Fetch and store in cache
          playerStats = await fetchPlayerCurrentStats(player.element);
          playerStatsCache.set(player.element, playerStats);
        }

        //console.log(playerStats);
        if (playerStats[0].yellow_cards > 2) {
          //console.log(playerStats);
          teamsWithTwoYellows.push(team);
          team.twoYellowCardsPlayer = player.element;
          break; // Stop checking this team's players and move to the next team
        }
      }
    }

    if (teamsWithTwoYellows.length > 0) {
      const randomTeam = getRandomTeam(teamsWithTwoYellows);
      console.log(randomTeam);

      const message1 = `When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} sees a player get two yellow cards:`;

      const img =
        utterWokeMemes[Math.floor(Math.random() * utterWokeMemes.length)];

      const message2 = createPlayerCardNew(
        randomTeam.twoYellowCardsPlayer,
        getPlayerScore(randomTeam.twoYellowCardsPlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.remove();
    }
  }

  async function find59Minutes() {
    const teamsWith59Minutes = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of league) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        if (player.element_type === 2) {
          let playerStats;

          // Check if player's stats are already cached
          if (playerStatsCache.has(player.element)) {
            playerStats = playerStatsCache.get(player.element);
          } else {
            // Fetch and store in cache
            playerStats = await fetchPlayerCurrentStats(player.element);
            playerStatsCache.set(player.element, playerStats);
          }

          const { minutes, was_home, team_a_score, team_h_score } =
            playerStats[0];

          if (
            minutes > 44 &&
            minutes < 60 &&
            ((was_home && team_a_score === 0) ||
              (!was_home && team_h_score === 0))
          ) {
            console.log(playerStats);
            teamsWith59Minutes.push(team);
            team.fiftyNineMinutePlayer = player.element;
            break; // Stop checking this team's players and move to the next team
          }
        }
      }
    }

    // Example of updating the text later
    setTimeout(() => {
      memeLoader.innerText = "Finding the perfect meme...";
    }, 2000);

    if (teamsWith59Minutes.length > 0) {
      const randomTeam = getRandomTeam(teamsWith59Minutes);
      console.log(randomTeam);

      const message1 = `POV: When your defender comes off before 60 minutes and doesn't even lock in the cleansheet. Looking at you ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}`;

      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const message2 = createPlayerCardNew(
        randomTeam.fiftyNineMinutePlayer,
        getPlayerScore(randomTeam.fiftyNineMinutePlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.innerText = `naaah, thought I had something, but not today`;
      setTimeout(() => {
        memeLoader.remove();
        console.log("No 59-minute players");
      }, 2000);
    }
  }
  async function findMissedPen() {
    const teamsWith59Minutes = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of league) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        let playerStats;

        // Check if player's stats are already cached
        if (playerStatsCache.has(player.element)) {
          playerStats = playerStatsCache.get(player.element);
        } else {
          // Fetch and store in cache
          playerStats = await fetchPlayerCurrentStats(player.element);
          playerStatsCache.set(player.element, playerStats);
        }

        console.log(player);
        console.log(playerStats);
        if (playerStats[0].penalties_missed > 0) {
          teamsWith59Minutes.push(team);
          team.fiftyNineMinutePlayer = player.element;
          break; // Stop checking this team's players and move to the next team
        }
      }
    }

    // Example of updating the text later
    setTimeout(() => {
      memeLoader.innerText = "Finding the perfect meme...";
    }, 2000);

    if (teamsWith59Minutes.length > 0) {
      const randomTeam = getRandomTeam(teamsWith59Minutes);
      console.log(randomTeam);

      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}'s player misses a pen!`;

      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/04/dogshit.jpeg";

      const message2 = createPlayerCardNew(
        randomTeam.fiftyNineMinutePlayer,
        getPlayerScore(randomTeam.fiftyNineMinutePlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.innerText = `naaah, thought I had something, but not today`;
      setTimeout(() => {
        memeLoader.remove();
        console.log("No missed pens");
      }, 2000);
    }
  }
  function findHigestTransferMaker() {
    gwAverage = bootstrap.events[currentGw - 1].average_entry_score;

    const lowestAverage = league.filter((team) => team.event_total < gwAverage);

    console.log(lowestAverage);
    if (lowestAverage > 0) {
      const randomTeam = getRandomTeam(lowestAverage);

      const message1 = `POV: ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} after making the most transfers this week`;
      const video =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/homer-bush.gif";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        video
      );
      memeContainer.append(meme);
    }
  }

  function findFailedScorer() {
    // Select a random team from the league
    const randomTeam = getRandomTeam(league);

    // Generate message based on the random team
    const message1 = `Mood right now if your name is ${
      randomTeam.player_name.split(" ")[0]
    }`;

    // Select a random player from the team's picks
    const randomPlayer =
      randomTeam.currentWeek[0].picks[
        Math.floor(Math.random() * randomTeam.currentWeek[0].picks.length)
      ];

    // Get the player's score
    const playerScore = getPlayerScore(randomPlayer.element);

    let message2 = null;

    // If player score is exactly 2, create a player card
    if (playerScore < 0 || playerScore == 1) {
      console.log("Player score = 2");

      message2 = createPlayerCardNew(
        randomPlayer.element,
        playerScore,
        null,
        null,
        null
      );

      if (message2 instanceof HTMLElement) {
        message2.style.marginLeft = "75%";
        message2.style.marginTop = "50%";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }
    }

    // Image URL for meme
    const img =
      "https://fpltoolbox.com/wp-content/uploads/2025/02/download-2.png";

    // Create and append meme only if message2 exists
    if (message2) {
      const meme = createMeme4Corners(
        message1,
        message2,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedTransfer() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      // Example Usage
      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `POV: The grass is always greener if you're ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} making gameweek transfers`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/02/download-3.png",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        xfrOUT,
        null,
        xfrIN,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findFailedTransferSecond() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `POV: ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} after transferring out ${getPlayerWebName(
        biggestXfr.element_out
      )} for ${getPlayerWebName(biggestXfr.element_in)}`;
      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        xfrIN,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findFailedTransferThird() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `The group chat watching ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} transfer out ${getPlayerWebName(
        biggestXfr.element_out
      )} for ${getPlayerWebName(biggestXfr.element_in)}`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/henry-rio.gif";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        xfrIN,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findFailedTransferFourth() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      let randomTeam2 = getRandomTeam(league);

      while (randomTeam2.player_name === randomTeam.player_name) {
        randomTeam2 = getRandomTeam(league);
      }

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `${randomTeam2.player_name.substring(
        0,
        randomTeam2.player_name.indexOf(" ")
      )}
      seeing ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} transfer out ${getPlayerWebName(
        biggestXfr.element_out
      )} for ${getPlayerWebName(biggestXfr.element_in)}`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/04/1641347298.webp";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        xfrIN,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedTransferFifth() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      let randomTeam2 = getRandomTeam(league);

      while (randomTeam2.player_name === randomTeam.player_name) {
        randomTeam2 = getRandomTeam(league);
      }

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );
      console.log(
        getPlayerScore(biggestXfr.element_in),
        getPlayerScore(biggestXfr.element_out)
      );
      const message1 = document.createElement("p");

      message1.innerText = `"What happened to ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}?"`;

      const xfrOutMsg = document.createElement("p");
      xfrOutMsg.style.color = "black";
      xfrOutMsg.innerText = `"He transferred out ${getPlayerWebName(
        biggestXfr.element_out
      )}"`;

      const playerName = document.createElement("p");
      playerName.style.color = "black";
      playerName.innerText = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}:`;

      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/04/what-happened.webp";

      const meme = createMeme4Corners(
        message1,
        playerName,
        null,
        xfrOutMsg,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedTransferSixth() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      // Example Usage
      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);
      if (biggestXfr) {
        const xfrIN = createPlayerCardNew(
          biggestXfr.element_in,
          getPlayerScore(biggestXfr.element_in),
          null,
          null,
          null
        );

        const tInArrow = document.createElement("img");
        tInArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tInArrow.setAttribute("id", "transfer-direction-in");
        xfrIN.prepend(tInArrow);

        const xfrOUT = createPlayerCardNew(
          biggestXfr.element_out,
          getPlayerScore(biggestXfr.element_out),
          null,
          null,
          null
        );
        const tOutArrow = document.createElement("img");
        tOutArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tOutArrow.setAttribute("id", "transfer-direction-out");
        xfrOUT.prepend(tOutArrow);
        const message1 = `${randomTeam.player_name.substring(
          0,
          randomTeam.player_name.indexOf(" ")
        )} making transfer decisions like this:`;

        images = [
          "https://fpltoolbox.com/wp-content/uploads/2025/04/sweating.png",
        ];
        const img = images[Math.floor(Math.random() * images.length)];

        const meme = createMeme4Corners(
          message1,
          xfrOUT,
          xfrIN,
          null,
          null,
          null,
          img
        );
        memeContainer.append(meme);
      }
    }
  }

  function findSuccesfulTransfer() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    for (const team of league) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) < getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) < getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      // Example Usage
      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);
      if (biggestXfr) {
        const xfrIN = createPlayerCardNew(
          biggestXfr.element_in,
          getPlayerScore(biggestXfr.element_in),
          null,
          null,
          null
        );

        const tInArrow = document.createElement("img");
        tInArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tInArrow.setAttribute("id", "transfer-direction-in");
        xfrIN.prepend(tInArrow);

        const xfrOUT = createPlayerCardNew(
          biggestXfr.element_out,
          getPlayerScore(biggestXfr.element_out),
          null,
          null,
          null
        );
        const tOutArrow = document.createElement("img");
        tOutArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tOutArrow.setAttribute("id", "transfer-direction-out");
        xfrOUT.prepend(tOutArrow);
        const message1 = `${randomTeam.player_name.substring(
          0,
          randomTeam.player_name.indexOf(" ")
        )} making the right transfer decision this week`;

        images = [
          "https://fpltoolbox.com/wp-content/uploads/2025/04/note-dead.webp",
          "https://fpltoolbox.com/wp-content/uploads/2025/04/very-nice.png",

          ,
        ];
        const img = images[Math.floor(Math.random() * images.length)];

        const meme = createMeme4Corners(
          message1,
          xfrOUT,
          xfrIN,
          null,
          null,
          null,
          img
        );
        memeContainer.append(meme);
      }
    }
  }
  function findSolidDefence() {
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of league) {
      let allDefendersScoredFiveOrMore = true;

      team.currentWeek[0].picks.forEach((player) => {
        //console.log(player, getPlayerWebName(player.element))
        if (player.element_type === 2 && getPlayerScore(player.element) < 5) {
          allDefendersScoredFiveOrMore = false;
        }
      });

      if (allDefendersScoredFiveOrMore) {
        teamsWithAllDefendersScoring.push(team);
      }
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}'s defenders all pull their socks up`;
      const img =
        surprisedMemes[Math.floor(Math.random() * surprisedMemes.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (player.element_type === 2) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findSolidStrikeForce() {
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of league) {
      let allDefendersScoredFiveOrMore = true;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.element_type === 4 && getPlayerScore(player.element) < 5) {
          allDefendersScoredFiveOrMore = false;
        }
      });

      if (allDefendersScoredFiveOrMore) {
        teamsWithAllDefendersScoring.push(team);
      }
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}'s strikers all pull their socks up`;
      const img =
        surprisedMemes[Math.floor(Math.random() * surprisedMemes.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (player.element_type === 4) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findPlayersWithOnePoint() {
    console.log("Failed row");
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of league) {
      team.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          teamsWithAllDefendersScoring.push(team);
          return;
        }
      });
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} opens the FPL app`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/03/fine-this-is-fine.png",

        ,
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findPlayersWithOnePointSecond() {
    console.log("Failed row");
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of league) {
      team.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          teamsWithAllDefendersScoring.push(team);
          return;
        }
      });
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `"Bro, how's your gameweek going...?"`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/04/thumbs-up.png",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const randomName = document.createElement("div");
      randomName.innerText = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}:`;

      randomName.style.fontSize = "1.5rem";
      randomName.style.fontWeight = "bold";
      randomName.style.color = "black";
      randomName.style.backgroundColor = "white";
      randomName.style.padding = "0.5rem";

      const meme = createMeme4Corners(
        message1,
        randomName,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findPlayerSuccess() {
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of league) {
      //console.log(team);
      if (team) {
        team.currentWeek[0].picks.forEach((player) => {
          if (getPlayerScore(player.element) > 8) {
            teamsWithAllDefendersScoring.push(team);
            return;
          }
        });
      }
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} opens the FPL app`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/03/8d30zh.jpg",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/liplicking.png",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/iamjose.webp",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) > 8) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findCaptaincyResults() {
    console.log("finding captains");
    const successfulCaptains = [];
    const failedCaptains = [];

    for (const team of league) {
      let captain = null;

      // Find the captain
      team.currentWeek[0].picks.forEach((player) => {
        if (player.is_captain) captain = player;
      });

      if (captain) {
        const captainScore = getPlayerScore(captain.element);

        if (captainScore > 4) {
          successfulCaptains.push({ team, captain, score: captainScore });
        } else {
          failedCaptains.push({ team, captain, score: captainScore });
        }
      }
    }
    let result = [];
    // Check if there is at least one failed captain
    if (failedCaptains.length > 0) {
      // Pick a random failed captain
      const randomFailedCaptain =
        failedCaptains[Math.floor(Math.random() * failedCaptains.length)];
      result.push(randomFailedCaptain);
    }

    // Check how many successful captains exist
    if (successfulCaptains.length >= 2) {
      const count = successfulCaptains.length >= 3 ? 3 : 2;

      // Shuffle the array and pick the required number of successful captains
      const shuffledSuccessful = successfulCaptains.sort(
        () => 0.5 - Math.random()
      );
      result.push(...shuffledSuccessful.slice(0, count));
    }
    console.log(result);

    if (result.length > 2) {
      const message = `There's always one...`;

      const captainCards = document.createElement("div");
      captainCards.id = "dragon-meme-footer";

      function addCaptainToFooter(teamNumber) {
        const cap = document.createElement("div");
        const capCard = createPlayerCardNew(
          result[teamNumber].captain.element,
          result[teamNumber].score,
          true,
          null,
          null
        );
        const capCardText = document.createElement("div");
        capCardText.id = "dragon-meme-footer-text";
        capCardText.innerText = `${result[
          teamNumber
        ].team.player_name.substring(
          0,
          result[teamNumber].team.player_name.indexOf(" ")
        )}`;

        cap.appendChild(capCard);
        cap.appendChild(capCardText);

        captainCards.appendChild(cap);
      }

      addCaptainToFooter(1);
      addCaptainToFooter(2);

      let img = "https://fpltoolbox.com/wp-content/uploads/2025/02/9e2.jpg";

      if (result.length === 4) {
        addCaptainToFooter(3);
        img = "https://fpltoolbox.com/wp-content/uploads/2025/02/4p4zc2.jpg";
      }

      addCaptainToFooter(0);
      // if (capCard1 instanceof HTMLElement) {
      //   capCard1.style.marginLeft = "-70%";
      //   capCard1.style.transform = "scale(1.2)";
      // } else {
      //   console.warn("capCard is not a DOM element:", capCard1);
      // }

      const meme = createMeme4Corners(
        message,
        null,
        null,
        null,
        null,
        captainCards,
        img
      );

      memeContainer.append(meme);
    } else {
      console.log("Captain Dragons Meme unavailable");
    }

    console.log("Successful Captains:", successfulCaptains);
    console.log("Failed Captains:", failedCaptains);
  }

  function gwSpecificMeme() {
    const teamsWithKeyPlayers = []; // Array to store teams with both target players
    const playersToTarget = [668, 366, 424];

    for (const team of league) {
      if (team) {
        const pickedPlayerElements = team.currentWeek[0].picks.map(
          (player) => player.element
        );

        // Check if ALL playersToTarget are in pickedPlayerElements
        const hasAllTargetPlayers = playersToTarget.every((targetId) =>
          pickedPlayerElements.includes(targetId)
        );

        if (hasAllTargetPlayers) {
          teamsWithKeyPlayers.push(team);
        }
      }
    }

    console.log(teamsWithKeyPlayers); // Check the stored teams

    if (teamsWithKeyPlayers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithKeyPlayers);
      console.log(randomTeam);
      const message1 = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} owning these three this gameweek`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/03/8d30zh.jpg",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/liplicking.png",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/iamjose.webp",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/very-nice.png",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (playersToTarget.includes(player.element)) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }

  function runAllRandomly() {
    const functionsList = [
      findFailedScorer,
      findHigestTransferMaker,
      findHighBench,
      find100Plus,
      gwSpecificMeme,
      findMissedPen,
      findBelowAverage,
      findLowestScorer,
      findLowestScorer1,
      findStrikerFail,
      findFailedTransferSixth,
      findChillGuy,
      findLowBench,
      findBestMiniLeagueRun,
      findWorstRun,
      findHighestandLowest,
      findKeeperFail,
      findCaptaincyFailDrake,
      findCaptaincyFailDoggo,
      findFailedTransfer,
      findRedCards,
      find59Minutes,
      findSolidDefence,
      findPlayersWithOnePoint,
      findTwoYellows,
      findLowestScorerAlternative,
      findCaptaincyResults,
      findFailedTransferSecond,
      findPlayerSuccess,
      findSolidStrikeForce,
      findSuccesfulTransfer,
      findFailedTransferThird,
      findFailedTransferFourth,
      findFailedTransferFifth,
      findPlayersWithOnePointSecond,
      findFailedhBench,
    ];

    // Shuffle the list randomly
    const shuffled = functionsList.sort(() => Math.random() - 0.5);

    // Execute each function in the new random order
    shuffled.forEach((fn) => fn());
  }

  function endOfMemes() {
    const message1 = `Guess who's had enough FPL memes for one day:`;
    const img =
      pointingAtYouMemes[Math.floor(Math.random() * pointingAtYouMemes.length)];

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      "www.fpltoolbox.com",
      img
    );
    memeContainer.append(meme);
  }

  function subscribeToProMeme() {
    const message1 = `POV: You just subscribed to FPL Toolbox Pro and got instant access to even more personalised FPL memes`;
    const img =
      surprisedMemes[Math.floor(Math.random() * surprisedMemes.length)];

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      "www.fpltoolbox.com",
      img
    );
    memeContainer.append(meme);
  }

  if (
    theUser.username.data.membership_level.ID == 10 ||
    theUser.username.data.membership_level.ID == 12
  ) {
    // Call the function to execute all in random order
    runAllRandomly();
    endOfMemes();
    addCaptainBadge();
  } else if (
    theUser.username.data.membership_level.ID != 10 ||
    theUser.username.data.membership_level.ID != 12
  ) {
    runAllRandomly(); //Turn off after testing
    subscribeToProMeme();
    endOfMemes();
    addCaptainBadge();
  } else {
    app.append("You need to be a pro member to access this feature");
  }
  const refreshButton = document.createElement("button");
  refreshButton.innerHTML = "Refresh Memes";
  refreshButton.addEventListener("click", showMemes);
  memeContainer.prepend(refreshButton);
  app.appendChild(memeContainer);
  addCaptainBadge();
}

//personalised memes
function createPlayerCardNew(
  elementId,
  score,
  isCaptain,
  isViceCaptain,
  isTriple
) {
  //console.log(getPlayerType(elementId));
  const card = document.createElement("div");
  card.classList.add("player");
  card.classList.add("type" + getPlayerType(elementId));
  card.classList.add("player-new");
  card.id = elementId;
  const img = document.createElement("img");
  img.setAttribute("class", "player-img");

  img.src = `https://fpltoolbox.com/wp-content/uploads/2025/04/shirt_${getPlayerTeamCode(
    elementId
  )}.webp`;
  if (getPlayerType(elementId) == 1) {
    img.src = `https://fpltoolbox.com/wp-content/uploads/2025/04/shirt_${getPlayerTeamCode(
      elementId
    )}_1.webp`;
  }

  //console.log(elementId, score, isCaptain, isViceCaptain, isTriple)

  const name = document.createElement("div");
  if (isCaptain) {
    name.className = "my-captain-name";
  } else if (isViceCaptain) {
    name.className = "my-vice-captain-name";
  } else {
    name.className = "my-player-name";
  }
  if (isTriple == 3) {
    name.className = "my-triple-captain-name";
  }
  name.textContent = getPlayerWebName(elementId).slice(0, 10);

  const scoreText = document.createElement("div");
  scoreText.className = "my-player-xp";
  scoreText.textContent = score;

  card.append(img, name, scoreText);

  return card;
}

function shareMeme(meme) {
  html2canvas(meme).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    if (navigator.share) {
      // Create a Blob from the image
      fetch(imgData)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "comparison.png", {
            type: "image/png",
          });
          navigator
            .share({
              title: "Check out this FPL meme!",
              text: "Get personalised FPL memes with just one click at \n www.FPLToolbox.com",
              files: [file], // Share the image as a file
            })
            .catch((err) => alert("Error sharing: " + err));
        });
    } else {
      // Fallback: Download the image if sharing isn't supported
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "fpltoolbox-meme.png";
      link.click();
      alert(
        "Sharing is not supported on your device. Image downloaded instead."
      );
    }
  });
}

function createMeme4Corners(
  header,
  topLeft,
  topRight,
  bottomRight,
  bottomLeft,
  footer,
  imageSrc
) {
  // Main meme container
  const meme = document.createElement("div");
  meme.className = "custom-meme";
  meme.style.position = "relative";
  meme.style.width = "100%";
  meme.style.display = "flex";
  meme.style.flexDirection = "column";
  meme.style.alignItems = "center";

  // Utility function to handle text or elements
  function appendContent(container, content) {
    if (typeof content === "string") {
      container.textContent = content;
    } else if (content instanceof HTMLElement) {
      container.appendChild(content);
    }
  }

  // Header
  if (header) {
    const headerContainer = document.createElement("div");
    headerContainer.className = "meme-header";

    // Watermark Container
    const watermarkContainer = document.createElement("div");
    watermarkContainer.id = "watermark-container";

    const watermarkLogo = document.createElement("img");
    watermarkLogo.src =
      "https://fpltoolbox.com/wp-content/uploads/2024/01/Blog-Graphic-Mobile-1-e1733487933669.jpg";
    watermarkLogo.id = "watermark-logo";

    const watermarkText = document.createElement("p");
    watermarkText.textContent = "FPLToolbox";
    watermarkText.id = "watermark-text";

    watermarkContainer.appendChild(watermarkLogo);
    watermarkContainer.appendChild(watermarkText);

    // Create a header wrapper for text
    const headerContent = document.createElement("div");
    appendContent(headerContent, header); // This handles both text & elements

    // Append watermark & header text separately
    headerContainer.appendChild(watermarkContainer);
    headerContainer.appendChild(headerContent);

    // Add header to meme
    meme.appendChild(headerContainer);
  }

  // Image container
  const imgContainer = document.createElement("div");
  imgContainer.style.position = "relative";
  imgContainer.style.width = "100%";
  imgContainer.id = "meme-image-container";

  const img = document.createElement("img");
  img.src = imageSrc;
  img.style.width = "100%";
  img.style.display = "block";

  // Overlay Text Positions
  const overlayTextStyles = {
    position: "absolute",
    color: "white",
    maxWidth: "45%",
  };

  const overlayPositions = {
    topLeft: { top: "10%", left: "5%" },
    topRight: { top: "10%", right: "5%", textAlign: "right" },
    bottomRight: { bottom: "10%", right: "5%", textAlign: "right" },
    bottomLeft: { bottom: "10%", left: "5%" },
  };

  function createOverlay(position, content) {
    if (content) {
      const overlay = document.createElement("div");
      Object.assign(overlay.style, overlayTextStyles, position);
      appendContent(overlay, content);
      imgContainer.appendChild(overlay);
    }
  }

  createOverlay(overlayPositions.topLeft, topLeft);
  createOverlay(overlayPositions.topRight, topRight);
  createOverlay(overlayPositions.bottomRight, bottomRight);
  createOverlay(overlayPositions.bottomLeft, bottomLeft);

  imgContainer.appendChild(img);
  meme.appendChild(imgContainer);

  // Footer
  if (footer) {
    const footerContainer = document.createElement("div");
    footerContainer.className = "meme-footer";

    appendContent(footerContainer, footer);
    meme.appendChild(footerContainer);
  }
  // Share functionality
  meme.addEventListener("click", () => shareMeme(meme));
  return meme;
}
async function downloadMySeason() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const startTime = new Date();
  console.log(
    `[${startTime.toLocaleTimeString()}] Starting fetchinig gameweek seasons`
  );
  console.log(eventStatus);
  // List of URLs where you want to ignore the condition
  const ignoredUrls = [
    "https://fpltoolbox.com/tools-for-fpl-content/", // Example full URL
    "http://127.0.0.1:5500/index.html",
  ];

  const currentUrl = window.location.href; // Get the full URL

  if (currentGw != 38) {
    const app = document.getElementById("app");
    const loaderCard = document.createElement("div");
    const loaderContainer = document.createElement("div");
    loaderContainer.id = "loader-container";
    loaderCard.id = "loader-card";

    loaderCard.textContent = `Come back when the season is over to download all of your gameweeks with one click`;
    loaderCard.className = "skeleton";
    loaderContainer.appendChild(loaderCard);
    app.append(loaderContainer);

    return;
  }

  const loader = new LoadingBar(app);
  loader.start();

  // Create the main header (h3)
  const nameHeader = document.createElement("h3");
  nameHeader.innerText = managerData.name;
  nameHeader.style.textAlign = "center";
  nameHeader.style.fontWeight = "bold";
  nameHeader.style.marginBottom = "0px";

  // Create the "Your Season" div
  const seasonDiv = document.createElement("div");
  seasonDiv.innerText = "Your 24/25 Season";
  seasonDiv.style.backgroundColor = "black";
  seasonDiv.style.color = "white";
  seasonDiv.style.textAlign = "center";
  seasonDiv.style.transform = "rotate(-2deg)";
  seasonDiv.style.margin = "5px auto"; // centers it
  seasonDiv.style.padding = "6px 12px";
  seasonDiv.style.borderRadius = "8px";
  seasonDiv.style.display = "inline-block"; // makes the width fit content

  // Append both to your app container
  app.appendChild(nameHeader);
  app.appendChild(seasonDiv);

  const season = document.createElement("div");
  season.id = "season-view";

  const firstHalf = document.createElement("div");
  firstHalf.id = "first-half-view";
  const secondHalf = document.createElement("div");
  secondHalf.id = "second-half-view";

  let previousRank = undefined;
  try {
    console.log("manager", managerData);

    for (
      let gameweekIdentifier = 1;
      gameweekIdentifier <= currentGw;
      gameweekIdentifier++
    ) {
      //console.log(`Fetching data for GW ${gameweekIdentifier}...`);

      const response = await fetch(
        `${BASE_URL}/entry/${theUser.info.team_id}/event/${gameweekIdentifier}/picks/`
      );

      const data = await response.json();
      //console.log(data);

      // Create gameweek container
      const gameweek = document.createElement("div");
      gameweek.id = `gameweek-${gameweekIdentifier}`;

      const gameweekHeader = document.createElement("h6");
      gameweekHeader.innerText = `Gameweek ${gameweekIdentifier}`;
      gameweekHeader.style.textAlign = "center";
      gameweek.appendChild(gameweekHeader);

      const gameweekView = document.createElement("div");
      gameweekView.id = `gameweek-view`;
      season.appendChild(gameweekView);
      gwSummary = document.createElement("div");
      gwSummary.id = `gw-summary`;

      let rankArrowBadge = document.createElement("img");

      rankArrowBadge.style.width = "20px";
      rankArrowBadge.style.height = "20px";

      if (previousRank !== undefined) {
        const currentRank = data.entry_history.overall_rank;
        rankArrowBadge = document.createElement("img");
        rankArrowBadge.id = "download-season-rank";
        rankArrowBadge.style.width = "20px";
        rankArrowBadge.style.height = "20px";

        if (currentRank < previousRank) {
          rankArrowBadge.src =
            "https://fpltoolbox.com/wp-content/uploads/2024/12/green-arrow.png";
        } else if (currentRank > previousRank) {
          rankArrowBadge.src =
            "https://fpltoolbox.com/wp-content/uploads/2024/12/red-arrow.png";
          rankArrowBadge.style.transform = "rotate(180deg)";
        }
      }

      // Update rankArrow for the next iteration
      previousRank = data.entry_history.overall_rank;

      gwSummaryText = `GW: ${gameweekIdentifier}\n Points: ${data.entry_history.points}, Total Points , ${data.entry_history.total_points}`;
      gwSummary.append(rankArrowBadge);
      gwSummary.append(gwSummaryText);
      gameweekView.appendChild(gwSummary);

      if (data.active_chip) {
        gwSummary.append(`${convertChipName(data.active_chip)} activated`);
      }
      let linebreak = document.createElement("br");
      gwSummary.append(linebreak);
      gwSummary.append(
        `Overall Rank: ${data.entry_history.overall_rank.toLocaleString("en")}`
      );

      const playersContainer = document.createElement("div");
      playersContainer.id = "players-container";
      const benchContainer = document.createElement("div");
      benchContainer.id = "bench-container";
      for (const pick of data.picks) {
        if (pick.position > 16) continue; // Stop the loop if pick.position is greater than 15

        let pointsMultiplier = pick.multiplier || 1;
        const playerScore =
          (await getPlayerWeeklyScore(pick.element, gameweekIdentifier)) *
          pointsMultiplier;

        if (pick.is_vice_captain) viceCaptainPick = pick.element;
        if (pick.is_captain) captainPick = pick.element;

        const card = createPlayerCardNew(
          pick.element,
          playerScore,
          pick.is_captain,
          pick.is_vice_captain,
          pointsMultiplier
        );

        if (pick.position > 11) {
          benchContainer.appendChild(card);
        } else {
          playersContainer.appendChild(card);
        }

        gameweekView.appendChild(playersContainer);

        gameweekView.appendChild(benchContainer);
      }
      let toolboxCom = document.createElement("p");
      toolboxCom.innerText = "24/25 Season - fpltoolbox.com";
      toolboxCom.style.fontSize = "10px";
      toolboxCom.style.textAlign = "center";
      toolboxCom.style.color = "white";
      gameweekView.append(toolboxCom);

      if (gameweekIdentifier <= 19) {
        firstHalf.appendChild(gameweekView);
      } else {
        secondHalf.appendChild(gameweekView);
      }

      season.appendChild(firstHalf);
      season.appendChild(secondHalf);
    }

    app.appendChild(season);
    const endTime = new Date();
    console.log(
      `[${endTime.toLocaleTimeString()}] Finished fetching gameweek seasons`
    );

    addCaptainBadge();
    const shareBtn = document.createElement("button");
    shareBtn.id = "shareBtn";
    shareBtn.style.marginRight = "10px";
    shareBtn.style.fontSize = "1rem";
    shareBtn.textContent = "Download";
    app.appendChild(shareBtn);
    // Share button functionality
    shareBtn.addEventListener("click", () => {
      // Force desktop styles
      document.body.classList.add("force-desktop");

      html2canvas(season, { scale: 2 }).then((canvas) => {
        // Remove forced desktop styles
        document.body.classList.remove("force-desktop");

        const imgData = canvas.toDataURL("image/png");

        if (navigator.share) {
          fetch(imgData)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], "fpltoolbox-my-season.png", {
                type: "image/png",
              });
              navigator
                .share({
                  title: "Your Season",
                  text: "FPLTOOLBOX.com",
                  files: [file],
                })
                .catch((err) => alert("Error sharing: " + err));
            });
        } else {
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "season.png";
          link.click();
          alert(
            "Sharing is not supported on your device. Image downloaded instead."
          );
        }
      });
    });

    loader.stop();
    loader.remove();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Simple cache object
const weeklyPlayerDataCache = {};
async function getPlayerWeeklyScore(playerId, gameweek) {
  // Check if this player's data is already cached
  if (weeklyPlayerDataCache[playerId]) {
    const cachedData = weeklyPlayerDataCache[playerId];

    const matchingHistories = cachedData.history.filter(
      (entry) => entry.round === gameweek
    );

    if (matchingHistories.length > 0) {
      return matchingHistories.reduce(
        (sum, entry) => sum + (entry.total_points || 0),
        0
      );
    } else {
      console.warn(`No match found for player ${playerId} in GW ${gameweek}`);
      return null;
    }
  }

  const url = `${BASE_URL}/element-summary/${playerId}/`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.history || !Array.isArray(data.history)) {
      console.warn(`Unexpected data format from ${url}`, data);
      return null;
    }

    // Cache the full data for future use
    weeklyPlayerDataCache[playerId] = data;

    const matchingHistories = data.history.filter(
      (entry) => entry.round === gameweek
    );

    if (matchingHistories.length > 0) {
      return matchingHistories.reduce(
        (sum, entry) => sum + (entry.total_points || 0),
        0
      );
    } else {
      console.warn(`No match found for player ${playerId} in GW ${gameweek}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createSuperLeague(leagueID) {
  const startTime = Date.now();
  try {
    const maxPages = 2;
    let superLeagueStandings = [];
    let superleagueName = "";

    for (let i = 1; i <= maxPages; i++) {
      const response = await fetch(
        `${BASE_URL}leagues-classic/${leagueID}/standings?page_standings=${i}`,
        { cache: "no-store" } // <-- force fresh API call
      );

      const superleagueData = await response.json();

      console.error(
        "PAGE",
        i,
        `${BASE_URL}leagues-classic/${leagueID}/standings?page_standings=${i}`
      );
      console.log(superleagueData);

      if (i === 1) {
        superleagueName = superleagueData.league.name;
        console.log(`League Name: ${superleagueName}`);
      }

      const results = superleagueData.standings?.results ?? [];
      superLeagueStandings.push(...results);

      const hasNext = superleagueData.standings?.has_next;
      if (!hasNext) break;

      // Optional delay between requests
      if (i < maxPages) {
        await sleep(250);
      }
    }

    const endTime = Date.now();
    console.log(
      `League created with ${superLeagueStandings.length} teams in ${
        (endTime - startTime) / 1000
      } seconds.`
    );

    return {
      leagueName: superleagueName,
      standings: superLeagueStandings,
    };
  } catch (error) {
    console.error("Error fetching league data: ", error);
    throw error;
  }
}

async function waitForManagerData() {
  while (
    !managerData ||
    !managerData.leagues ||
    !managerData.leagues.classic ||
    managerData.leagues.classic.length === 0
  ) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
  }
}

async function loadSuperLeagueDropDown() {
  // Create the dropdown
  const dropdown = document.createElement("select");
  dropdown.id = "league-dropdown";
  dropdown.classList.add("custom-select");

  await waitForManagerData(); // Wait for manager data to load

  const dashboardMenu = document.getElementById("dashboard-menu");
  const tabs = document.getElementById("tabs");

  // Add default "Select a league..." option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a league...";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  dropdown.appendChild(defaultOption);

  // Add league options
  managerData.leagues.classic.forEach((league) => {
    const option = document.createElement("option");
    option.value = league.id;
    option.textContent = league.name;
    dropdown.appendChild(option);
  });

  // Append dropdown to the dashboard
  dashboardMenu.appendChild(dropdown);
  dashboardMenu.classList.remove("loader");
  tabs.classList.remove("loader");

  const myTeamStats = document.getElementById("my-team-stats");
  const myTeamStatsSidebar = document.getElementById("my-team-stats-sidebar");

  const gameweekStats = document.getElementById("gameweek-stats");
  const gameweekStatsSidebar = document.getElementById(
    "gameweek-stats-sidebar"
  );

  const seasonStats = document.getElementById("season-stats");
  const seasonStatsSidebar = document.getElementById("season-stats-sidebar");

  myTeamStats.innerHTML = "Load League First";
  gameweekStats.innerHTML = "Load League First";
  seasonStats.innerHTML = "Load League First";

  // Trigger on change
  dropdown.addEventListener("change", async () => {
    const selectedLeagueId = dropdown.value;
    const selectedLeagueName = dropdown.options[dropdown.selectedIndex].text;
    if (!selectedLeagueId) return; // prevent accidental trigger on placeholder
    const progressMessage = document.createElement("div");
    progressMessage.id = "progress-message";
    dashboardMenu.appendChild(progressMessage);

    progressMessage.innerText = `Loading selected League: ${selectedLeagueName}`;

    myTeamStats.innerHTML = "";

    myTeamStatsSidebar.innerHTML = "";

    gameweekStats.innerHTML = "";
    gameweekStatsSidebar.innerHTML = "";

    seasonStats.innerHTML = "";
    seasonStatsSidebar.innerHTML = "";

    // myTeamStats.classList.add("loader");
    // myTeamStatsSidebar.classList.add("loader")

    // gameweekStats.classList.add("loader");
    // gameweekStatsSidebar.classList.add("loader")

    // seasonStats.classList.add("loader");
    // seasonStatsSidebar.classList.add("loader");

    const superLeague = await createSuperLeague(selectedLeagueId);
    let standings = superLeague.standings;

    await addGameweeksToLeague(standings, progressMessage);
    await addDetailedGameweeksToLeague(standings, progressMessage);
    await addManagerDetailsToLeague(standings, progressMessage);
    await weeklyPicksForSuperLeague(standings, progressMessage);

    console.log(standings);
    await createLeagueDashboard(standings);

    // myTeamStats.classList.remove("loader");

    // myTeamStatsSidebar.remove("loader");

    // gameweekStats.classList.remove("loader");
    // gameweekStatsSidebar.remove("loader");

    // seasonStats.classList.remove("loader");
    // seasonStatsSidebar.classList.remove("loader");
    progressMessage.remove();
  });

  async function runTestLeague() {
    myTeamStats.innerHTML = "";
    myTeamStatsSidebar.innerHTML = "";

    gameweekStats.innerHTML = "";
    gameweekStatsSidebar.innerHTML = "";

    seasonStats.innerHTML = "";
    seasonStatsSidebar.innerHTML = "";

    myTeamStats.classList.add("loader");
    myTeamStatsSidebar.classList.add("loader");

    gameweekStats.classList.add("loader");
    gameweekStatsSidebar.classList.add("loader");

    seasonStats.classList.add("loader");
    seasonStatsSidebar.classList.add("loader");

    await createLeagueDashboard(testLeague);
    console.log(testLeague);

    myTeamStats.classList.remove("loader");
    myTeamStatsSidebar.remove("loader");

    gameweekStats.classList.remove("loader");
    gameweekStatsSidebar.remove("loader");

    seasonStats.classList.remove("loader");
    seasonStatsSidebar.classList.remove("loader");
  }
  //runTestLeague();
}

async function addManagerDetailsToLeague(standings, div) {
  const startTime = Date.now(); // Start the timer

  const gwFetches = standings.map(async (team) => {
    try {
      const res = await fetch(BASE_URL + "/entry/" + team.entry + "/");
      const data = await res.json();
      //console.log(data)
      team.managerDetails = data;

      await sleep(1000);
      console.log("delay here");
      div.innerText = `Adding Manager details for ${team.entry_name}`;
    } catch (error) {
      console.error(`Error fetching data for team ${team.entry}: `, error);
    }
  });

  await Promise.all(gwFetches);
  const endTime = Date.now(); // End the timer
  console.log(
    `Manager details added to league ${(endTime - startTime) / 1000} seconds.`
  );

  return standings;
}

async function addGameweeksToLeague(standings, div) {
  const startTime = Date.now(); // Start the timer

  const gwFetches = standings.map(async (team) => {
    try {
      const response = await fetch(`${BASE_URL}entry/${team.entry}/history/`);
      const teamData = await response.json();
      //console.log(teamData)
      // Add all gameweeks data to a new array
      team.everyGw = teamData.current.map((week) => ({
        percentile_rank: week.percentile_rank,
        bank: week.bank,
        gameweek: week.event,
        points: week.points,
        rank: week.rank,
        overall_rank: week.overall_rank,
        value: week.value,
        transfers: week.event_transfers,
        transfers_cost: week.event_transfers_cost,
        bench_points: week.points_on_bench,
      }));

      // Helper function to calculate a total for a specific field
      const calculateTotal = (field) =>
        teamData.current.reduce((sum, week) => sum + week[field], 0);

      // Calculate totals
      team.totalTransfers = calculateTotal("event_transfers");
      team.totalMinusPoints = calculateTotal("event_transfers_cost");
      team.totalPointsOnBench = calculateTotal("points_on_bench");

      // Helper function to find best and worst weeks by a specified field
      const findBestWorstWeek = (field) =>
        teamData.current.reduce(
          (result, week) => {
            if (week[field] > result.best[field]) result.best = week;
            if (week[field] < result.worst[field]) result.worst = week;
            return result;
          },
          { best: teamData.current[0], worst: teamData.current[0] }
        );

      // Set best and worst week by points and overall rank
      const { best: bestWeek, worst: worstWeek } = findBestWorstWeek("points");
      team.bestWeek = bestWeek;
      team.worstWeek = worstWeek;

      const { best: bestOverallRankWeek, worst: worstOverallRankWeek } =
        findBestWorstWeek("overall_rank");
      team.bestOverallRankWeek = bestOverallRankWeek;
      team.worstOverallRankWeek = worstOverallRankWeek;

      // Find the highest team value week
      team.highestValueWeek = teamData.current.reduce(
        (highest, week) => (week.value > highest.value ? week : highest),
        teamData.current[0]
      );

      // Add chips data (limited to 6 chips)
      //console.log(teamData)
      team.chips = teamData.chips.slice(0, 6).map((chip) => ({
        name: chip.name,
        time: chip.time,
        gw: chip.event,
      }));

      team.past = teamData.past;

      // Other team data
      team.seasons = teamData.past.length;
      team.seasons_managed = teamData.past[0]?.season_name || "NEW";
      team.previousRank =
        teamData.current[teamData.current.length - 2]?.overall_rank || "";
      // Add a small delay between requests (e.g., 500ms)
      await sleep(1000);
      div.innerText = `Adding general gameweek stats for ${team.entry_name}`;
      console.log("delay here");
    } catch (error) {
      console.error(`Error fetching data for team ${team.entry}: `, error);
    }
  });

  await Promise.all(gwFetches);
  const endTime = Date.now(); // End the timer
  console.log(
    `All weeks data for all teams added in ${
      (endTime - startTime) / 1000
    } seconds.`
  );

  return standings;
}
async function addDetailedGameweeksToLeague(standings, div) {
  const startTime = Date.now(); // Start the timer
  div.innerText = `Searching database for Gameweek stats`;
  const allGwFetches = standings.map(async (team) => {
    try {
      const allGwPromises = [];

      // Fetch picks data for each gameweek from 1 to currentGw
      for (let gw = 1; gw <= currentGw; gw++) {
        allGwPromises.push(
          fetch(`${BASE_URL}entry/${team.entry}/event/${gw}/picks/`)
            .then((response) => response.json())
            .then((data) => ({
              gameweek: gw,
              picks: data.picks || [],
              active_chip: data.active_chip || null,
            }))
        );
        await sleep(1000); // Add small delay between requests
        div.innerText = `Calculating detailed stats about FPL Gameweek ${gw} for your league`;
      }

      // Wait for all gameweek data to resolve
      const allGwData = await Promise.all(allGwPromises);

      // Add all gameweek picks data to the new array
      team.everyGwPicks = allGwData;

      // Add current week data
      const currentWeekData = allGwData.find(
        (gwData) => gwData.gameweek === currentGw
      );
      team.currentWeek = currentWeekData ? [currentWeekData] : [];

      // Create an array for weekly captain picks
      team.weeklyCaptainPicks = allGwData.map((gwData) => {
        const captainPick = gwData.picks.find((pick) => pick.is_captain);
        return {
          gameweek: gwData.gameweek,
          captain: captainPick || null,
          captainName: captainPick
            ? getPlayerWebName(captainPick.element)
            : null,
        };
      });

      // Count played stats per gameweek
      team.playedCount = allGwData.map((gwData) => {
        const playedCount = gwData.picks.filter(
          (pick) =>
            pick.multiplier === 1 ||
            pick.multiplier === 2 ||
            pick.multiplier === 3
        ).length;

        const noPlayedCount = gwData.picks.filter(
          (pick) => pick.multiplier === 0
        ).length;

        return {
          gameweek: gwData.gameweek,
          playedCount,
          noPlayedCount,
        };
      });

      // Total across all weeks
      team.totalPlayedStats = team.playedCount.reduce(
        (totals, gwStats) => {
          totals.totalPlayed += gwStats.playedCount;
          totals.totalNotPlayed += gwStats.noPlayedCount;
          return totals;
        },
        { totalPlayed: 0, totalNotPlayed: 0 }
      );

      // Track frequency of each element across all gameweeks
      const elementFrequencyMap = {};
      allGwData.forEach((gwData) => {
        gwData.picks.forEach((pick) => {
          if (!elementFrequencyMap[pick.element]) {
            elementFrequencyMap[pick.element] = 0;
          }
          elementFrequencyMap[pick.element]++;
        });
      });

      // Convert to readable player names and sort by count descending
      const sortedFrequency = Object.entries(elementFrequencyMap)
        .map(([elementId, count]) => ({
          playerName: getPlayerWebName(Number(elementId)),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      team.pickElementFrequency = sortedFrequency;

      await sleep(1000); // Small delay before moving to next team
      console.log("delay here");
      div.innerText = `Adding detailed gameweek stats for ${team.entry_name}`;
    } catch (error) {
      console.error(
        `Error fetching all gameweeks picks for team ${team.entry}: `,
        error
      );
    }
  });

  await Promise.all(allGwFetches);

  const endTime = Date.now(); // End the timer
  console.log(
    `All current weeks data added in ${(endTime - startTime) / 1000} seconds.`
  );
}

async function weeklyPicksForSuperLeague(standings, div) {
  console.time("Weekly Picks Fetch");

  const cache = new Map();

  for (let i = 0; i < standings.length; i++) {
    div.innerText = `Looking for red cards, yellow cards, own goals etc`;
    const team = standings[i];

    if (!team.everyGwPicks || team.everyGwPicks.length === 0) {
      console.warn(`No weekly data available for team ${team.entry}`);
      continue;
    }

    // Initialize stats
    team.total_goals_scored = 0;
    team.total_red_cards = 0;
    team.total_yellow_cards = 0;
    team.total_cards = 0;
    team.total_minutes = 0;
    team.total_assists = 0;
    team.total_clean_sheets = 0;
    team.total_goals_conceded = 0;
    team.total_own_goals = 0;
    team.total_penalties_missed = 0;
    team.total_home_games = 0;
    team.total_away_games = 0;
    team.total_captaincy_points = 0;
    team.allCaptains = [];
    team.total_saves = 0;

    const apiRequests = new Map();

    for (const gameweek of team.everyGwPicks) {
      div.innerHTML = `Fetching player stats for ${team.entry_name}.`;
      for (const pick of gameweek.picks) {
        if (pick.position >= 1 && pick.position <= 11) {
          const playerId = pick.element;
          if (cache.has(playerId)) continue;

          const apiUrl = `${BASE_URL}/element-summary/${playerId}/`;
          apiRequests.set(
            playerId,
            fetch(apiUrl).then((res) => res.json())
          );
        }
        div.innerHTML = `Gathering detailed gameweek starting 11 for ${team.entry_name}.`;
      }
    }

    const responses = await Promise.allSettled(apiRequests.values());

    let index = 0;
    for (const [playerId] of apiRequests) {
      const result = responses[index++];
      if (result.status === "fulfilled") {
        cache.set(playerId, result.value);
      } else {
        console.error(`Failed to fetch data for player ${playerId}`);
      }
    }

    for (const gameweek of team.everyGwPicks) {
      for (const pick of gameweek.picks) {
        if (pick.position >= 1 && pick.position <= 11) {
          const playerData = cache.get(pick.element);
          if (!playerData) continue;

          const matchingHistories = playerData.history.filter(
            (entry) => entry.round === gameweek.gameweek
          );

          if (matchingHistories.length === 0) continue;

          // Aggregate stats across all matching histories
          const combined = matchingHistories.reduce(
            (acc, curr) => {
              acc.goals_scored += curr.goals_scored;
              acc.red_cards += curr.red_cards;
              acc.yellow_cards += curr.yellow_cards;
              acc.minutes += curr.minutes;
              acc.assists += curr.assists;
              acc.clean_sheets += curr.clean_sheets;
              acc.goals_conceded += curr.goals_conceded;
              acc.own_goals += curr.own_goals;
              acc.penalties_missed += curr.penalties_missed;
              acc.total_points += curr.total_points;
              acc.saves += curr.saves;

              // Count home/away games
              if (curr.was_home) {
                acc.home_games += 1;
              } else {
                acc.away_games += 1;
              }

              return acc;
            },
            {
              goals_scored: 0,
              red_cards: 0,
              yellow_cards: 0,
              minutes: 0,
              assists: 0,
              clean_sheets: 0,
              goals_conceded: 0,
              own_goals: 0,
              penalties_missed: 0,
              total_points: 0,
              saves: 0,
              home_games: 0,
              away_games: 0,
            }
          );

          team.total_goals_scored += combined.goals_scored;
          team.total_red_cards += combined.red_cards;
          team.total_yellow_cards += combined.yellow_cards;
          team.total_cards += combined.yellow_cards + combined.red_cards;
          team.total_minutes += combined.minutes;
          team.total_assists += combined.assists;
          team.total_clean_sheets += combined.clean_sheets;
          team.total_goals_conceded += combined.goals_conceded;
          team.total_own_goals += combined.own_goals;
          team.total_penalties_missed += combined.penalties_missed;
          team.total_saves += combined.saves;
          team.total_home_games += combined.home_games;
          team.total_away_games += combined.away_games;

          if (pick.is_captain) {
            //console.log("GW" + gameweek.gameweek, getPlayerWebName(pick.element), combined.total_points);
            team.total_captaincy_points +=
              combined.total_points * pick.multiplier;
          }
        }
      }
    }

    //Weekly Scoresheets
    team.gwScoreSheet = [];
    team.gwBenchSheet = [];

    for (const gameweek of team.everyGwPicks) {
      const starters = [];
      const bench = [];

      const gameweekNumber = gameweek.gameweek;

      for (let i = 0; i < gameweek.picks.length; i++) {
        const pick = gameweek.picks[i];
        const playerData = cache.get(pick.element);

        let points = 0;
        if (playerData) {
          const history = playerData.history.find(
            (entry) => entry.round === gameweekNumber
          );
          points = history ? history.total_points * pick.multiplier : 0;
        }

        const pickObj = {
          playerId: pick.element,
          name: getPlayerWebName(pick.element),
          points,
        };

        if (i < 11) {
          starters.push(pickObj);
        } else {
          bench.push(pickObj);
        }
      }

      team.gwScoreSheet.push({
        gameweek: gameweekNumber,
        starters,
      });

      team.gwBenchSheet.push({
        gameweek: gameweekNumber,
        bench,
      });
      div.innerHTML = `Calculating bench scores for ${team.entry_name}.`;
    }

    div.innerHTML = `Add all gameweek picks for ${team.entry_name}.`;
  }

  console.timeEnd("Weekly Picks Fetch");
}

async function createLeagueDashboard(standings) {
  const myTeamStats = document.getElementById("my-team-stats");
  const myTeamStatsSidebar = document.getElementById("my-team-stats-sidebar");
  const gameweekStats = document.getElementById("gameweek-stats");
  const gameweekStatsSidebar = document.getElementById(
    "gameweek-stats-sidebar"
  );
  const seasonStats = document.getElementById("season-stats");
  const seasonStatsSidebar = document.getElementById("season-stats-sidebar");
  console.log(managerData);

  function findManagerTeam(standings, managerData) {
    return standings.find((team) => team.entry === managerData.id);
  }

  // Helper to create a chart container
  function createChartContainer(divID) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";
    container.classList.add("chart-js-container");
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    divID.appendChild(container);
    return canvas;
  }
  //My Team Tab
  const myTeam = findManagerTeam(standings, managerData);
  console.log("My Team", myTeam);
  const playerPointsMap = {};

  if (myTeam != undefined) {
    console.log("Checking GW sheets:", myTeam.gwScoreSheet.length);
    myTeam.gwScoreSheet.forEach((gw, gwIndex) => {
      //console.log(`GW${gwIndex + 1}: starters count =`, gw.starters.length);

      gw.starters.forEach((player) => {
        const id = player.playerId;
        const name = player.name;

        if (!playerPointsMap[id]) {
          playerPointsMap[id] = {
            playerId: id,
            name: name,
            totalPoints: 0,
            appearances: 0,
            seasonPoints: getPlayerTotalPoints(id),
          };
        }

        playerPointsMap[id].totalPoints += player.points;
        playerPointsMap[id].appearances += 1;

        //console.log(`→ ${name} (${id}) now has ${playerPointsMap[id].appearances} appearances`);
      });
    });
  }

  const playerPointsArray = Object.values(playerPointsMap);
  console.log(playerPointsArray);
  // Helper: get nested value from object
  function getValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  // Create Table for Team Player Stats
  function createPlayerStatsTable(players, containerDiv) {
    const tableContainer = document.createElement("div");
    tableContainer.id = "my-team-table-container";
    tableContainer.style.overflowX = "auto";
    tableContainer.style.width = "100%";
    const table = document.createElement("table");
    table.id = "my-team-table";

    // Define the columns and their respective data sources
    const headers = [
      { label: "Rank", key: "rank" },
      { label: "Player", key: "name" },
      { label: "Team Points", key: "totalPoints" },
      { label: "Apps", key: "appearances" },
      { label: "Total Points", key: "seasonPoints" },
    ];

    let sortDirection = {};
    headers.forEach((h) => (sortDirection[h.key || h.label] = "asc"));

    // Helper function to render header
    function renderHeader() {
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header.label;
        th.style.border = "1px solid #ccc";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f5f5f5";
        th.style.cursor = "pointer";

        th.addEventListener("click", () => {
          const sortKey = header.key || header.label;
          const dir = sortDirection[sortKey];

          players.sort((a, b) => {
            const valA = getValue(a, header.key);
            const valB = getValue(b, header.key);

            if (typeof valA === "number" && typeof valB === "number") {
              return dir === "asc" ? valA - valB : valB - valA;
            } else {
              return dir === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
            }
          });

          sortDirection[sortKey] = dir === "asc" ? "desc" : "asc";
          renderTableBody();
        });

        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      return thead;
    }

    // Helper function to render table body
    function renderTableBody() {
      const oldTbody = table.querySelector("tbody");
      if (oldTbody) oldTbody.remove();

      const tbody = document.createElement("tbody");

      players.forEach((player) => {
        const row = document.createElement("tr");

        headers.forEach((header) => {
          const td = document.createElement("td");
          let value;
          if (header.key === "rank") {
            value = players.indexOf(player) + 1;
          } else {
            value = getValue(player, header.key);
          }
          td.textContent = value ?? "-";
          td.style.border = "1px solid #ccc";
          td.style.padding = "8px";
          row.appendChild(td);
        });

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
    }

    table.appendChild(renderHeader());
    renderTableBody();

    containerDiv.innerHTML = ""; // Clear previous content
    tableContainer.appendChild(table);
    containerDiv.appendChild(tableContainer);
  }
  if (myTeam !== undefined) {
    createPlayerStatsTable(playerPointsArray, myTeamStats);
  } else {
    const teamMessage = document.createElement("p");
    teamMessage.textContent =
      "No data available for your team. Select a league in which you're in the top 100 to calculate data";
    myTeamStats.appendChild(teamMessage);
  }

  // Gameweek Tab
  function createGameweekLeagueTable(standings, containerDiv) {
    const table = document.createElement("table");
    table.id = "league-table";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const headers = [
      { label: "First Name", key: "managerDetails.player_first_name" },
      { label: "Last Name", key: "managerDetails.player_last_name" },
      { label: "Team Name", key: "entry_name" },

      { label: "GW Points", key: "event_total" },
      {
        label: "Active Chip",
        value: (team) =>
          convertChipName(team.currentWeek?.[0]?.active_chip) || "",
      },
      {
        label: "Captain ID",
        value: (team) => {
          const picks = team.currentWeek?.[0]?.picks || [];
          const captain = picks.find((p) => p.is_captain);
          return captain ? getPlayerWebName(captain.element) : "None";
        },
      },
      {
        label: "Bench Points",
        value: (team) =>
          team.everyGw[team.everyGw.length - 1].bench_points || "0",
      },
      {
        label: "Transfers",
        value: (team) => team.everyGw[team.everyGw.length - 1].transfers || "0",
      },
      {
        label: "Hits",
        value: (team) =>
          team.everyGw[team.everyGw.length - 1].transfers_cost || "0",
      },
      {
        label: "Percentile Rank",
        value: (team) =>
          team.everyGw[team.everyGw.length - 1].percentile_rank || "0",
      },

      { label: "Overall Rank", key: "managerDetails.summary_overall_rank" },
    ];

    let sortDirection = {};
    headers.forEach((h) => (sortDirection[h.key || h.label] = "asc"));

    // Helper: get nested value from object
    function getValue(obj, path) {
      return path.split(".").reduce((acc, key) => acc?.[key], obj);
    }

    function renderHeader() {
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header.label;
        th.style.border = "1px solid #ccc";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f5f5f5";
        th.style.cursor = "pointer";

        th.addEventListener("click", () => {
          const sortKey = header.key || header.label;
          const dir = sortDirection[sortKey];

          standings.sort((a, b) => {
            const valA = header.value
              ? header.value(a)
              : getValue(a, header.key);
            const valB = header.value
              ? header.value(b)
              : getValue(b, header.key);

            if (typeof valA === "number" && typeof valB === "number") {
              return dir === "asc" ? valA - valB : valB - valA;
            } else {
              return dir === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
            }
          });

          sortDirection[sortKey] = dir === "asc" ? "desc" : "asc";
          renderTableBody();
        });

        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      return thead;
    }

    function renderTableBody() {
      const oldTbody = table.querySelector("tbody");
      if (oldTbody) oldTbody.remove();

      const tbody = document.createElement("tbody");

      standings.forEach((team) => {
        const row = document.createElement("tr");

        headers.forEach((header) => {
          const td = document.createElement("td");
          const value = header.value
            ? header.value(team)
            : getValue(team, header.key);
          td.textContent = value ?? "";
          td.style.border = "1px solid #ccc";
          td.style.padding = "8px";
          row.appendChild(td);
        });

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
    }

    table.appendChild(renderHeader());
    renderTableBody();

    containerDiv.innerHTML = "";

    const scrollWrapper = document.createElement("div");
    scrollWrapper.style.overflowX = "auto";
    scrollWrapper.style.width = "100%";

    scrollWrapper.appendChild(table);
    containerDiv.appendChild(scrollWrapper);
  }
  createGameweekLeagueTable(standings, gameweekStats);

  function createTopPlayerOwnershipChart(standings, containerDiv) {
    const playerCounts = {};

    standings.forEach((team) => {
      const picks = team.currentWeek[0].picks.slice(0, 11); // Starting XI only
      picks.forEach((pick) => {
        const elementId = pick.element;
        if (playerCounts[elementId]) {
          playerCounts[elementId]++;
        } else {
          playerCounts[elementId] = 1;
        }
      });
    });

    const topPlayerEntries = Object.entries(playerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 11);

    const topPlayerLabels = topPlayerEntries.map(([elementId]) =>
      getPlayerWebName(elementId)
    );

    const data = topPlayerEntries.map(([_, count]) => count);
    const popularPlayersCanvas = createChartContainer(containerDiv);

    const totalTeams = standings.length;
    const percentageData = data.map((count) =>
      ((count / totalTeams) * 100).toFixed(1)
    );

    new Chart(popularPlayersCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: topPlayerLabels,
        datasets: [
          {
            axis: "y",
            label: "Mini League Player Ownership %",
            data: percentageData,
            backgroundColor: colors.dashboardBlue,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          title: {
            display: true,
            text: "Top 20 Most Picked Players (By % of Teams)",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}% of teams`,
            },
          },
          legend: { display: false },
        },
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 10,
              callback: (value) => value + "%",
            },
            title: {
              display: true,
              text: "% of Teams",
            },
          },
        },
      },
    });
  }
  createTopPlayerOwnershipChart(standings, gameweekStats); // draws inside the gameweekStats container

  //Remove when finished testing
  //Chip usage pie charts
  function createChipUsageChartsTest(standings, containerDiv) {
    console.log("working");
    const chipTypes = [
      "wildcard1",
      "wildcard2",
      "freehit",
      "manager",
      "bboost",
      "3xc",
    ];
    const chipUsage = Object.fromEntries(
      chipTypes.map((type) => [type, { used: 0, unused: 0 }])
    );

    // Step 1: Count chip usage
    standings.forEach((team) => {
      const usedChips = team.chips || [];
      const usedSet = new Set();

      usedChips.forEach((chip) => {
        if (chip.name === "wildcard") {
          const key = chip.gw <= 18 ? "wildcard1" : "wildcard2";
          chipUsage[key].used++;
          usedSet.add(key);
        } else {
          chipUsage[chip.name].used++;
          usedSet.add(chip.name);
        }
      });

      chipTypes.forEach((chip) => {
        if (!usedSet.has(chip)) {
          chipUsage[chip].unused++;
        }
      });
    });

    // Step 2: Create UI + charts
    const chipLabels = {
      wildcard1: "Wildcard 1",
      wildcard2: "Wildcard 2",
      freehit: "Free Hit",
      manager: "Assistant Manager",
      bboost: "Bench Boost",
      "3xc": "Triple Captain",
    };

    if (!containerDiv) return;

    const chipContainer = document.createElement("div");
    chipContainer.id = "sidebar-chip-container";
    chipContainer.style.display = "grid";
    chipContainer.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(250px, 1fr))";
    chipContainer.style.gap = "10px";
    containerDiv.appendChild(chipContainer);

    chipTypes.forEach((chipType) => {
      const chipCard = document.createElement("div");
      chipCard.style.display = "flex";
      chipCard.style.flexDirection = "column";
      chipCard.style.alignItems = "center";

      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      chipCard.appendChild(canvas);

      const info = document.createElement("div");
      info.innerHTML = `
        <strong>${chipLabels[chipType]}</strong><br>
        Used: ${chipUsage[chipType].used} &nbsp;|&nbsp; 
        Unused: ${chipUsage[chipType].unused}
      `;
      info.style.textAlign = "center";
      info.style.marginTop = "8px";
      chipCard.appendChild(info);

      chipContainer.appendChild(chipCard);

      new Chart(canvas.getContext("2d"), {
        type: "pie",
        data: {
          labels: ["Used", "Unused"],
          datasets: [
            {
              data: [chipUsage[chipType].used, chipUsage[chipType].unused],
              backgroundColor: ["#1A73E8", "#ccc"],
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            title: { display: false },
            legend: { display: false },
          },
        },
      });
    });
  }
  createChipUsageChartsTest(standings, gameweekStatsSidebar);

  //Season Tab
  function createSeasonLeagueTable(standings, containerDiv) {
    const table = document.createElement("table");
    table.id = "league-table";
    table.style.width = "100%";

    table.style.borderCollapse = "collapse";

    const headers = [
      { label: "Rank", key: "rank" },
      { label: "Team Name", key: "entry_name" },
      { label: "First Name", key: "managerDetails.player_first_name" },
      { label: "Last Name", key: "managerDetails.player_last_name" },

      {
        label: "Favourite Team",
        value: (team) =>
          getPlayerTeam(team.managerDetails.favourite_team) || "",
      },
      { label: "Total Points", key: "managerDetails.summary_overall_points" },
      {
        label: "Chips Used",
        value: (team) => team.chips?.length || 0,
      },
      {
        label: "Most Picked Player",
        value: (team) => team.pickElementFrequency[0].playerName,
      },
      {
        label: "Least Picked Player",
        value: (team) =>
          team.pickElementFrequency[team.pickElementFrequency.length - 1]
            .playerName,
      },
      { label: "Minus Points", key: "totalMinusPoints" },
      { label: "Bench Points", key: "totalPointsOnBench" },
      { label: "Transfers", key: "totalTransfers" },
      { label: "Region", key: "managerDetails.player_region_name" },
      { label: "Years Active", key: "managerDetails.years_active" },
      { label: "Overall Rank", key: "managerDetails.summary_overall_rank" },

      // New tracked fields
      { label: "Total Transfers", key: "totalTransfers" },
      { label: "Total Assists", key: "total_assists" },
      { label: "Total Home Games", key: "total_home_games" },
      { label: "Total Away Games", key: "total_away_games" },
      { label: "Total Captaincy Points", key: "total_captaincy_points" },
      { label: "Total Cards", key: "total_cards" },
      { label: "Total Clean Sheets", key: "total_clean_sheets" },
      { label: "Total Goals Conceded", key: "total_goals_conceded" },
      { label: "Total Goals Scored", key: "total_goals_scored" },
      { label: "Total Minutes", key: "total_minutes" },
      { label: "Total Own Goals", key: "total_own_goals" },
      { label: "Total Penalties Missed", key: "total_penalties_missed" },
      { label: "Total Red Cards", key: "total_red_cards" },
      { label: "Total Saves", key: "total_saves" },
      { label: "Total Yellow Cards", key: "total_yellow_cards" },
    ];

    let sortDirection = {};
    headers.forEach((h) => (sortDirection[h.key || h.label] = "asc"));

    // Helper: get nested value from object
    function getValue(obj, path) {
      return path.split(".").reduce((acc, key) => acc?.[key], obj);
    }

    function renderHeader() {
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header.label;
        th.style.border = "1px solid #ccc";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f5f5f5";
        th.style.cursor = "pointer";

        th.addEventListener("click", () => {
          const sortKey = header.key || header.label;
          const dir = sortDirection[sortKey];

          standings.sort((a, b) => {
            const valA = header.value
              ? header.value(a)
              : getValue(a, header.key);
            const valB = header.value
              ? header.value(b)
              : getValue(b, header.key);

            if (typeof valA === "number" && typeof valB === "number") {
              return dir === "asc" ? valA - valB : valB - valA;
            } else {
              return dir === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
            }
          });

          sortDirection[sortKey] = dir === "asc" ? "desc" : "asc";
          renderTableBody();
        });

        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      return thead;
    }

    function renderTableBody() {
      const oldTbody = table.querySelector("tbody");
      if (oldTbody) oldTbody.remove();

      const tbody = document.createElement("tbody");

      standings.forEach((team) => {
        const row = document.createElement("tr");

        headers.forEach((header) => {
          const td = document.createElement("td");
          const value = header.value
            ? header.value(team)
            : getValue(team, header.key);
          td.textContent = value ?? "";
          td.style.border = "1px solid #ccc";
          td.style.padding = "8px";
          row.appendChild(td);
        });

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
    }

    table.appendChild(renderHeader());
    renderTableBody();

    containerDiv.innerHTML = "";

    const scrollWrapper = document.createElement("div");
    scrollWrapper.style.overflowX = "auto";
    scrollWrapper.style.width = "100%";

    scrollWrapper.appendChild(table);
    containerDiv.appendChild(scrollWrapper);
  }
  createSeasonLeagueTable(standings, seasonStats);

  //Total Points Charts
  function createTotalPointsChart(standings, containerDiv) {
    const canvas = createChartContainer(containerDiv);

    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: standings.map((team) => team.entry_name),
        datasets: [
          {
            label: "Total Points",
            data: standings.map((team) => team.total),
            backgroundColor: "#1A73E8",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Total Points by Team",
          },
          legend: { display: false },
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: false,
            },
          },
        },
      },
    });
  }
  createTotalPointsChart(standings, seasonStats); // draws inside the seasonStats container

  //Chip usage pie charts
  function createChipUsageCharts(standings, containerDiv) {
    const chipTypes = [
      "wildcard1",
      "wildcard2",
      "freehit",
      "manager",
      "bboost",
      "3xc",
    ];
    const chipUsage = Object.fromEntries(
      chipTypes.map((type) => [type, { used: 0, unused: 0 }])
    );

    // Step 1: Count chip usage
    standings.forEach((team) => {
      const usedChips = team.chips || [];
      const usedSet = new Set();

      usedChips.forEach((chip) => {
        if (chip.name === "wildcard") {
          const key = chip.gw <= 18 ? "wildcard1" : "wildcard2";
          chipUsage[key].used++;
          usedSet.add(key);
        } else {
          chipUsage[chip.name].used++;
          usedSet.add(chip.name);
        }
      });

      chipTypes.forEach((chip) => {
        if (!usedSet.has(chip)) {
          chipUsage[chip].unused++;
        }
      });
    });

    // Step 2: Create UI + charts
    const chipLabels = {
      wildcard1: "Wildcard 1",
      wildcard2: "Wildcard 2",
      freehit: "Free Hit",
      manager: "Assistant Manager",
      bboost: "Bench Boost",
      "3xc": "Triple Captain",
    };

    if (!containerDiv) return;

    const chipContainer = document.createElement("div");
    chipContainer.id = "sidebar-chip-container";
    chipContainer.style.display = "grid";
    chipContainer.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(250px, 1fr))";
    chipContainer.style.gap = "10px";

    const title = document.createElement("h4");
    title.textContent = `League Chip Usage`;
    title.style.marginBottom = "0.5rem";
    chipContainer.appendChild(title);
    const blank = document.createElement("h4");
    blank.textContent = ` `;
    blank.style.marginBottom = "0.5rem";
    chipContainer.appendChild(blank);

    containerDiv.appendChild(chipContainer);

    chipTypes.forEach((chipType) => {
      const chipCard = document.createElement("div");
      chipCard.style.display = "flex";
      chipCard.style.flexDirection = "column";
      chipCard.style.alignItems = "center";

      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      chipCard.appendChild(canvas);

      const info = document.createElement("div");
      info.innerHTML = `
        <strong>${chipLabels[chipType]}</strong><br>
        Used: ${chipUsage[chipType].used} &nbsp;|&nbsp; 
        Unused: ${chipUsage[chipType].unused}
      `;
      info.style.textAlign = "center";
      info.style.marginTop = "8px";
      chipCard.appendChild(info);

      chipContainer.appendChild(chipCard);

      new Chart(canvas.getContext("2d"), {
        type: "pie",
        data: {
          labels: ["Used", "Unused"],
          datasets: [
            {
              data: [chipUsage[chipType].used, chipUsage[chipType].unused],
              backgroundColor: ["#1A73E8", "#ccc"],
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            title: { display: false },
            legend: { display: false },
          },
        },
      });
    });
  }
  createChipUsageCharts(standings, seasonStatsSidebar);

  function createMyTeamStatTable({
    players,
    containerDiv,
    titleText,
    statKeys,
    statLabels,
    sortOrder = "desc",
    limit = null,
  }) {
    // Helper function to get the stat value for sorting
    const getStatValue = (player, key) => player[key] || 0;

    // Sort players based on the chosen stat key
    let sorted = [...players];

    // Sort the rows when the column header is clicked
    const sortTable = (columnIndex, sortOrder) => {
      sorted.sort((a, b) => {
        const aValue = getStatValue(a, statKeys[columnIndex]);
        const bValue = getStatValue(b, statKeys[columnIndex]);

        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
      renderTable(); // Re-render the table after sorting
    };

    // Render the table
    const renderTable = () => {
      const wrapper = document.createElement("div");
      wrapper.style.marginTop = "1rem";

      const title = document.createElement("h4");
      title.textContent = titleText;
      title.style.marginBottom = "0.5rem";

      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      const thead = document.createElement("thead");
      const headerCells = statLabels
        .map((label, index) => {
          return `
          <th 
            style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; cursor: pointer;"
            onclick="sortTable(${index}, '${
            sortOrder === "desc" ? "asc" : "desc"
          }')">
            ${label}
          </th>
        `;
        })
        .join("");

      thead.innerHTML = `
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">#</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">Player</th>
        ${headerCells}
      </tr>
    `;

      const tbody = document.createElement("tbody");
      const medals = ["🥇", "🥈", "🥉"];

      // Limit the number of rows if needed
      const limited = limit ? sorted.slice(0, limit) : sorted;

      limited.forEach((player, index) => {
        const rankDisplay = medals[index] || index + 1;
        const statCells = statKeys
          .map(
            (key) =>
              `<td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${getStatValue(
                player,
                key
              )}</td>`
          )
          .join("");

        const row = document.createElement("tr");
        row.innerHTML = `
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${rankDisplay}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${player.name}</td>
        ${statCells}
      `;
        tbody.appendChild(row);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      wrapper.appendChild(title);
      wrapper.appendChild(table);
      containerDiv.appendChild(wrapper);
    };

    // Initial render of the table
    renderTable();
  }

  function createTopStatTable({
    standings,
    containerDiv,
    titleText,
    statKeys,
    statLabels,
    limit = 3,
    sortOrder = "desc",
    statExtractor,
    rowInfoExtractor = () => "",
  }) {
    const getStatValue = statExtractor
      ? statExtractor
      : (team) => statKeys.reduce((sum, key) => sum + (team[key] || 0), 0);

    const sorted = [...standings]
      .sort((a, b) =>
        sortOrder === "asc"
          ? getStatValue(a) - getStatValue(b)
          : getStatValue(b) - getStatValue(a)
      )
      .slice(0, limit);

    const wrapper = document.createElement("div");
    wrapper.style.marginTop = "1rem";

    const title = document.createElement("h4");
    title.textContent = titleText;
    title.style.marginBottom = "0.5rem";

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Table header
    const thead = document.createElement("thead");
    const headerCells = statLabels
      .map(
        (label) =>
          `<th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${label}</th>`
      )
      .join("");
    thead.innerHTML = `
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">#</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">Team</th>
        ${headerCells}
      </tr>
    `;

    const medals = ["🥇", "🥈", "🥉"];
    const tbody = document.createElement("tbody");
    sorted.forEach((team, index) => {
      const rankDisplay = medals[index] || index + 1;
      const rowInfo = rowInfoExtractor(team);

      const statCells = statExtractor
        ? `<td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${getStatValue(
            team
          )}</td>`
        : statKeys
            .map(
              (key) =>
                `<td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${team[key]}</td>`
            )
            .join("");

      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${rankDisplay}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${team.entry_name}${rowInfo}</td>
        ${statCells}
      `;
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    wrapper.appendChild(title);
    wrapper.appendChild(table);
    containerDiv.appendChild(wrapper);
  }

  // Most Captaincy Points
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Captaincy Points",
    statKeys: ["total_captaincy_points"],
    statLabels: ["Points"],
    limit: 10, // top 10
    sortOrder: "desc",
  });

  // Fewest Captaincy Points
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Fewest Captaincy Points",
    statKeys: ["total_captaincy_points"],
    statLabels: ["Points"],
    limit: 10,
    sortOrder: "asc", // you'll need to add this option below
  });

  // Most Benched Points
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Benched Points",
    statKeys: ["totalPointsOnBench"],
    statLabels: ["Points"],
    limit: 10, // top 10
    sortOrder: "desc",
  });

  // Fewest Benched Points
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Fewest Benched Points",
    statKeys: ["totalPointsOnBench"],
    statLabels: ["Points"],
    limit: 10,
    sortOrder: "asc", // you'll need to add this option below
  });

  // Most goals scored
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Goals Scored",
    statKeys: ["total_goals_scored"],
    statLabels: ["Goals"],
    limit: 10, // top 10
    sortOrder: "desc",
  });

  // Fewest goals scored
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Fewest Goals Scored",
    statKeys: ["total_goals_scored"],
    statLabels: ["Goals"],
    limit: 10,
    sortOrder: "asc", // you'll need to add this option below
  });

  // Most goals conceded
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Goals Conceded",
    statKeys: ["total_goals_conceded"],
    statLabels: ["Goals Conceded"],
    limit: 3, // top 10
    sortOrder: "desc",
  });

  // Fewest goals conceded
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Fewest Goals Conceded",
    statKeys: ["total_goals_conceded"],
    statLabels: ["Goals Conceded"],
    limit: 3,
    sortOrder: "asc", // you'll need to add this option below
  });

  // Most minutes played
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Minutes Played",
    statKeys: ["total_minutes"],
    statLabels: ["Minutes"],
    limit: 3,
    sortOrder: "desc",
  });

  // Most own goals
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Own Goals",
    statKeys: ["total_own_goals"],
    statLabels: ["Own Goals"],
    limit: 3,
    sortOrder: "desc",
  });

  // Most penalties missed
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Penalties Missed",
    statKeys: ["total_penalties_missed"],
    statLabels: ["Penalties Missed"],
    limit: 3,
    sortOrder: "desc",
  });
  // Most cards
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Cards",
    statKeys: ["total_yellow_cards", "total_red_cards"],
    statLabels: ["Yellow", "Red"],
    limit: 3,
    sortOrder: "desc",
  });
  // Most Saves
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Saves",
    statKeys: ["total_saves"],
    statLabels: ["Saves"],
    limit: 3,
    sortOrder: "desc",
  });
  // Most Cleansheets
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Cleansheets",
    statKeys: ["total_clean_sheets"],
    statLabels: ["CleanSheets"],
    limit: 3,
    sortOrder: "desc",
  });

  // Most Experienced
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Most Experienced",
    statKeys: ["seasons"],
    statLabels: ["Years"],
    limit: 3,
    sortOrder: "desc",
  });

  //Best Week
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Best Week",
    statLabels: ["Points"],
    limit: 3,
    sortOrder: "desc",
    statExtractor: (team) => team.bestWeek?.points ?? 0,
    rowInfoExtractor: (team) =>
      team.bestWeek?.event
        ? ` <span style="color: gray; font-size: 0.85em;">(GW${team.bestWeek.event})</span>`
        : "",
  });
  //Worst Week
  createTopStatTable({
    standings,
    containerDiv: seasonStatsSidebar,
    titleText: "Worst Week",
    statLabels: ["Points"],
    limit: 3,
    sortOrder: "asc",
    statExtractor: (team) => team.worstWeek?.points ?? 0,
    rowInfoExtractor: (team) =>
      team.worstWeek?.event
        ? ` <span style="color: gray; font-size: 0.85em;">(GW${team.worstWeek.event})</span>`
        : "",
  });

  //Rank progression charts
  function createRankProgressionChart(standings, containerDiv, getRandomColor) {
    const canvas = createChartContainer(containerDiv);
    //canvas.style.minHeight = "600px"
    // Generate labels from the first team's gameweek data
    const labels = standings[0]?.everyGw.map((gw) => `GW${gw.gameweek}`) || [];

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: standings.map((team) => ({
          label: team.entry_name,
          data: team.everyGw.map((gw) => gw.overall_rank),
          fill: false,
          borderColor: getRandomColor(),
          tension: 0.3,
          hidden: true, // Start hidden
        })),
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Overall Rank Progression",
          },
        },
        scales: {
          y: {
            reverse: true, // Higher rank = lower number
            beginAtZero: false,
          },
        },
      },
    });
  }
  createRankProgressionChart(standings, seasonStats, getRandomColor);

  //Chips used chart
  function createChipsUsedChart(standings, containerDiv) {
    const canvas = createChartContainer(containerDiv);
    const sortedStandings = [...standings].sort(
      (a, b) => a.chips.length - b.chips.length
    );

    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: sortedStandings.map((team) => team.entry_name),
        datasets: [
          {
            label: "Chips Used",
            data: sortedStandings.map((team) => team.chips.length),
            backgroundColor: colors.dashboardBlue,
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y", // <-- makes it horizontal
        plugins: {
          title: {
            display: true,
            text: "Number of Chips Used",
          },
          legend: { display: false },
        },
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            min: 0,
            ticks: {
              stepSize: 1,
              beginAtZero: true,
              min: 0,
            },
          },
          y: {
            ticks: {
              autoSkip: false, // Optional: show all team names even if many
            },
          },
        },
      },
    });
  }
  createChipsUsedChart(standings, seasonStats); // draws inside the seasonStats container

  //Benched Points Chart
  function createBenchPointsChart(standings, containerDiv, colors) {
    const canvas = createChartContainer(containerDiv);

    // Step 1: Sort by bench points
    const sortedStandings = [...standings].sort(
      (a, b) => b.totalPointsOnBench - a.totalPointsOnBench
    );

    // Step 2: Extract labels and data
    const benchLabels = sortedStandings.map((team) => team.entry_name);
    const benchPoints = sortedStandings.map((team) => team.totalPointsOnBench);
    const totalPoints = sortedStandings.map((team) => team.total / 5); // Adjusted if intentional

    // Step 3: Render bar chart
    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: benchLabels,
        datasets: [
          {
            label: "Bench Points",
            data: benchPoints,
            backgroundColor: colors.dashboardBlue,
          },
          {
            label: "Total Points / 5",
            data: totalPoints,
            backgroundColor: colors.greenNeon,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Bench Points vs Total Points by Manager",
          },
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            stacked: false,
            ticks: {
              stepSize: 50,
            },
          },
          y: {
            stacked: false,
          },
        },
      },
    });
  }
  createBenchPointsChart(standings, seasonStats, colors);

  //Country Chart
  function createPlayersByCountryChart(standings, containerDiv) {
    const canvas = createChartContainer(containerDiv);

    // Step 1: Count players per country
    const countryCounts = {};
    standings.forEach((team) => {
      const country = team.managerDetails?.player_region_name;
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });

    // Step 2: Sort descending
    const sortedData = Object.entries(countryCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const countryLabels = sortedData.map(([country]) => country);
    const playerCountryCounts = sortedData.map(([, count]) => count);

    // Step 3: Create chart
    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: countryLabels,
        datasets: [
          {
            label: "Players per Country",
            data: playerCountryCounts,
            backgroundColor: getRandomColor(),
          },
        ],
      },
      options: {
        indexAxis: "x",
        plugins: {
          title: {
            display: true,
            text: "Number of Players by Country",
          },
          legend: { display: false },
        },
        responsive: true,
        scales: {
          x: {
            stepSize: 1,
          },
        },
      },
    });
  }
  createPlayersByCountryChart(standings, seasonStats);

  //Years Active chart
  function createYearsActiveChart(standings, containerDiv) {
    const canvas = createChartContainer(containerDiv);

    // Sort by years_active descending (default to 0 if missing)
    const sortedStandings = [...standings].sort(
      (a, b) =>
        (b.managerDetails?.years_active || 0) -
        (a.managerDetails?.years_active || 0)
    );

    const teamLabels = sortedStandings.map((team) => team.entry_name);
    const yearsData = sortedStandings.map(
      (team) => team.managerDetails?.years_active || 0
    );

    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: teamLabels,
        datasets: [
          {
            label: "Years Active",
            data: yearsData,
            backgroundColor: "#1A73E8",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Years Active per Manager (Sorted)",
          },
          legend: { display: false },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 45,
            },
          },
        },
      },
    });
  }
  createYearsActiveChart(standings, seasonStats);

  function findManagersOfTheMonth(standings, container, phases, currentGw) {
    // Inject CSS into the page
    const style = document.createElement("style");
    style.textContent = `
        /* Title Styling */
        /* Grid Container */
        .grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);  /* 3 columns */
            gap: 5px;  /* Space between items */
            margin-top: 20px;
        }

        /* Grid Item Styling */
        .grid-item {
            padding: 20px;
            border: 1px solid #ddd;
            text-align: center;
            background-color: #f9f9f9;
            border-radius: 8px;
        }

        .grid-item strong {
            font-size: 1.2em;
            display: block;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style); // Add the CSS to the <head> section

    const holdingContainer = document.createElement("div");
    holdingContainer.style.marginBottom = "20px"; // Add some space below the grid
    // Create the title element
    const title = document.createElement("h4");
    title.textContent = "Manager of the Month";
    holdingContainer.appendChild(title); // Add title above the grid

    // Create a grid container
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    // Filter out the "Overall" phase (id: 1)
    const monthlyPhases = phases.filter((phase) => phase.id !== 1);

    monthlyPhases.forEach((phase) => {
      // Skip if current phase is in progress (May in this case)
      if (currentGw >= phase.start_event && currentGw <= phase.stop_event) {
        const inProgressMsg = document.createElement("div");
        inProgressMsg.classList.add("grid-item");
        inProgressMsg.textContent = "Winner coming soon";
        gridContainer.appendChild(inProgressMsg);
        return; // Skip the rest for May
      }

      let bestTeam = null;
      let highestPoints = -1;

      standings.forEach((team) => {
        const monthlyPoints = team.everyGw
          .filter(
            (gw) =>
              gw.gameweek >= phase.start_event &&
              gw.gameweek <= phase.stop_event
          )
          .reduce((total, gw) => total + (gw.points - gw.transfers_cost), 0);

        if (monthlyPoints > highestPoints) {
          highestPoints = monthlyPoints;
          bestTeam = team;
        }
      });

      // Add the result to the grid
      if (bestTeam) {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("grid-item");
        resultDiv.innerHTML = `<strong>${phase.name}</strong><br>${bestTeam.entry_name}<br>${highestPoints} points`;
        gridContainer.appendChild(resultDiv);
      }
    });

    // Append the grid container to the main container
    holdingContainer.appendChild(gridContainer);
    container.appendChild(holdingContainer);
  }
  findManagersOfTheMonth(standings, seasonStats, bootstrap.phases);
}

function getRandomColor() {
  const colorValues = Object.values(colors);
  const randomIndex = Math.floor(Math.random() * colorValues.length);
  return colorValues[randomIndex];
}

