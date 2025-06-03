const apiKey = "d14eeee6a4f935aab34c335e";
const currencyNames = {
  AED: "United Arab Emirates Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswana Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CAD: "Canadian Dollar",
  CDF: "Congolese Franc",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colón",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  FOK: "Faroese Króna",
  GBP: "British Pound Sterling",
  GEL: "Georgian Lari",
  GGP: "Guernsey Pound",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HRK: "Croatian Kuna",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel",
  IMP: "Isle of Man Pound",
  INR: "Indian Rupee",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Króna",
  JEP: "Jersey Pound",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  KGS: "Kyrgyzstani Som",
  KHR: "Cambodian Riel",
  KID: "Kiribati Dollar",
  KMF: "Comorian Franc",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Lao Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Burmese Kyat",
  MNT: "Mongolian Tögrög",
  MOP: "Macanese Pataca",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Córdoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Złoty",
  PYG: "Paraguayan Guaraní",
  QAR: "Qatari Riyal",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helena Pound",
  SLE: "Sierra Leonean Leone",
  SLL: "Sierra Leonean Leone (old)",
  SOS: "Somali Shilling",
  SRD: "Surinamese Dollar",
  SSP: "South Sudanese Pound",
  STN: "São Tomé and Príncipe Dobra",
  SYP: "Syrian Pound",
  SZL: "Eswatini Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  TND: "Tunisian Dinar",
  TOP: "Tongan Paʻanga",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TVD: "Tuvaluan Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  USD: "United States Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistani Soʻm",
  VES: "Venezuelan Bolívar",
  VND: "Vietnamese Đồng",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XAF: "Central African CFA Franc",
  XCD: "East Caribbean Dollar",
  XOF: "West African CFA Franc",
  XPF: "CFP Franc",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWL: "Zimbabwean Dollar",
};

const baseCurrencySelect = document.getElementById("baseCurrency");
const amountInput = document.getElementById("amount");
const alertContainer = document.getElementById("alertContainer");
const targetSelectors = document.getElementById("targetCurrencySelectors");
const convertedRow = document.getElementById("convertedCurrenciesRow");
const addTargetBtn = document.getElementById("addTargetCurrency");
const themeSelector = document.getElementById("themeSelector");

let targetCurrencies =
  JSON.parse(localStorage.getItem("targetCurrencies")) || [];
let baseCurrency = localStorage.getItem("baseCurrency") || "MYR";
let exchangeRates = {};

function showAlert(message, type = "danger") {
  alertContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  setTimeout(() => (alertContainer.innerHTML = ""), 3000);
}

function populateCurrencyOptions(selectElement, selectedValue) {
  selectElement.innerHTML = "";
  Object.entries(currencyNames).forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${name} (${code})`;
    if (code === selectedValue) option.selected = true;
    selectElement.appendChild(option);
  });
}

function saveToLocalStorage() {
  localStorage.setItem("targetCurrencies", JSON.stringify(targetCurrencies));
  localStorage.setItem("baseCurrency", baseCurrencySelect.value);
}

function updateTargetCurrencySelectors() {
  targetSelectors.innerHTML = "";
  targetCurrencies.forEach((code, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "input-group mb-2";

    const select = document.createElement("select");
    select.className = "form-select";
    populateCurrencyOptions(select, code);
    select.onchange = () => {
      targetCurrencies[idx] = select.value;
      saveToLocalStorage();
      updateConversions();
    };

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-danger";
    btn.textContent = "X";
    btn.onclick = () => {
      targetCurrencies.splice(idx, 1);
      saveToLocalStorage();
      updateTargetCurrencySelectors();
      updateConversions();
    };

    wrapper.appendChild(select);
    wrapper.appendChild(btn);
    targetSelectors.appendChild(wrapper);
  });
  addTargetBtn.disabled = targetCurrencies.length >= 5;
}

function updateConversions() {
  const amount = parseFloat(amountInput.value);
  convertedRow.innerHTML = "";
  if (isNaN(amount)) return;

  targetCurrencies.forEach((code) => {
    const rate = exchangeRates[code];
    if (!rate) return;
    const col = document.createElement("div");
    //col.className = "col-md-4 mb-2";
    col.className = "mb-2";

    //   col.innerHTML = `
    //   <div class="card">
    //     <div class="card-body">
    //       <h5 class="card-title">${currencyNames[code]}</h5>
    //       <p class="card-text">${(amount * rate).toFixed(2)} ${code}</p>
    //     </div>
    //   </div>
    // `;

    col.innerHTML = `

              <div class="d-flex flex-column">
                 <p class="p-2">${(amount * rate).toFixed(2)} ${code}</p>
                </div>
             

        `;
    convertedRow.appendChild(col);
  });
}

async function fetchRates() {
  const selectedBase = baseCurrencySelect.value;
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${selectedBase}`
    );
    const data = await response.json();
    if (data.result !== "success") throw new Error(data["error-type"]);
    exchangeRates = data.conversion_rates;
    updateConversions();
  } catch (err) {
    showAlert(`Error fetching exchange rates: ${err.message}`);
  }
}

function applyTheme(theme) {
  const themeSelector = document.getElementById("themeSelector");

  // Dynamically extract all theme class names from the dropdown
  const themeClasses = Array.from(themeSelector.options).map(
    (option) => `theme-${option.value}`
  );

  // Remove all existing theme classes
  document.body.classList.remove(...themeClasses);

  // Add the new selected theme class
  document.body.classList.add(`theme-${theme}`);

  // Store selected theme in localStorage
  localStorage.setItem("theme", theme);

  // Update dropdown value (optional safeguard)
  themeSelector.value = theme;
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
}

themeSelector.addEventListener("change", () => {
  applyTheme(themeSelector.value);
});
baseCurrencySelect.onchange = () => {
  saveToLocalStorage();
  fetchRates();
};
amountInput.oninput = updateConversions;

addTargetBtn.onclick = () => {
  if (targetCurrencies.length < 5) {
    targetCurrencies.push("GBP");
    saveToLocalStorage();
    updateTargetCurrencySelectors();
    updateConversions();
  }
};

window.onload = () => {
  populateCurrencyOptions(baseCurrencySelect, baseCurrency);
  updateTargetCurrencySelectors();
  initTheme();
  fetchRates();
  fetch("https://ntfy.sunny.bz/currency-converter-app", {
    method: "POST",
    body: "Converter App Just opened",
  });
};
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("Service Worker Registered"));
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show your custom "Add to Home Screen" button here
  const btn = document.getElementById("install-btn");
  btn.style.display = "block";

  btn.addEventListener("click", () => {
    btn.style.display = "none";
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log("User choice", choiceResult.outcome);
      deferredPrompt = null;
    });
  });
});
