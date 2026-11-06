// Prevent crash if updateConversions is missing
function updateConversions() {
  updateConversionsWithValue(parseFloat(amountInput.value) || 0);
}
// Global error handler to show errors in the UI
window.onerror = function (message, source, lineno, colno, error) {
  let errMsg = `<b>Runtime Error:</b> ${message}<br>at ${source}:${lineno}:${colno}`;
  if (error && error.stack) {
    errMsg += `<br><pre>${error.stack}</pre>`;
  }
  let alertDiv = document.getElementById('alertContainer');
  if (!alertDiv) {
    alertDiv = document.createElement('div');
    alertDiv.id = 'alertContainer';
    document.body.prepend(alertDiv);
  }
  alertDiv.innerHTML = `<div style='background:#ffebee;color:#b71c1c;padding:1rem;border-radius:8px;margin:1rem 0;font-weight:bold;'>${errMsg}</div>`;
  return false;
};
// Update conversions for all target currencies with a specific value
function updateConversionsWithValue(value) {
  // Update all .currency-row elements for each currency
  const rows = document.querySelectorAll('.currency-row');
  let liveValue = value;
  // Always use the latest evaluated value from keypad
  try {
    liveValue = safeEval(amountInput.value);
  } catch {}
  rows.forEach(row => {
    const abbr = row.querySelector('.currency-abbr');
    const output = row.querySelector('.currency-output');
    // Only update rows that have both abbr and output (skip Add To Currency card)
    if (abbr && output && exchangeRates[abbr.textContent]) {
      output.textContent = `${(liveValue * exchangeRates[abbr.textContent]).toFixed(2)}`;
    }
  });
}
// Format converted value for a currency code
function formatConvertedValue(currency) {
  let amount = 0;
  try {
    amount = safeEval(amountInput.value);
  } catch {}
  const rate = exchangeRates[currency];
  if (!rate || isNaN(amount)) return `0.00`;
  return `${(amount * rate).toFixed(2)}`;
}
// Currency Converter App - Improved for readability, modularity, and maintainability
// API key should be stored securely in production
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


// DOM Elements
const baseCurrencySelect = document.getElementById("baseCurrency");
const amountInput = document.getElementById("amount");
const keypad = document.getElementById("keypad");
const preview = document.getElementById("preview");
const alertContainer = document.getElementById("alertContainer");
// Removed: targetCurrencySelectors element no longer exists
const convertedRow = document.getElementById("convertedCurrenciesRow");
const addTargetBtn = document.getElementById("addTargetCurrency");
const themeIcon = document.getElementById("themeIcon");
const userName = document.getElementById("userName");

// State
// Exchange rates are kept on the device so the app can open without calling the API.
const SAVED_RATES_KEY = "savedExchangeRates";

let targetCurrencies = JSON.parse(localStorage.getItem("targetCurrencies")) || [];
let baseCurrency = localStorage.getItem("baseCurrency") || "MYR";
let exchangeRates = {};
let ratesCache = loadSavedRates();
let debounceTimeout = null;

function loadSavedRates() {
  try {
    const raw = localStorage.getItem(SAVED_RATES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.warn("Could not read saved exchange rates:", err);
    return {};
  }
}

function persistRates() {
  try {
    localStorage.setItem(SAVED_RATES_KEY, JSON.stringify(ratesCache));
  } catch (err) {
    console.warn("Could not save exchange rates to the device:", err);
  }
}

// Show alert message
function showAlert(message, type = "danger") {
  alertContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  setTimeout(() => (alertContainer.innerHTML = ""), 3000);
}

// Simple loader helper used by fetchRates and other async actions
function showLoading(show, message) {
  let loader = document.getElementById('loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.right = '0';
    loader.style.bottom = '0';
    loader.style.display = 'none';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.background = 'rgba(255,255,255,0.6)';
    loader.style.zIndex = '9999';
    loader.innerHTML = `<div style="padding:1rem 1.5rem;border-radius:8px;background:#fff;box-shadow:0 6px 20px rgba(0,0,0,0.08);font-weight:700;color:#333;">Loading...</div>`;
    document.body.appendChild(loader);
  }
  const inner = loader.firstElementChild;
  if (message) inner.innerHTML = message;
  if (show) {
    loader.style.display = 'flex';
  } else {
    loader.style.display = 'none';
  }
}


// Keypad event listener (modularized)
keypad.addEventListener("click", handleKeypadClick);

function handleKeypadClick(e) {
  const key = e.target.getAttribute("data-key");
  const id = e.target.id;
  if (!key && id !== "clear" && id !== "equals" && id !== "ac" && id !== "backspace") return;

  if (key) {
    if (key === "()") {
      amountInput.value += "(";
      amountInput.value += ")";
    } else {
      amountInput.value += key;
    }
    try {
      // Try evaluating current expression
      const evaluated = safeEval(amountInput.value);
      if (!isNaN(evaluated)) {
        preview.textContent = `= ${evaluated}`;
        updateConversionsWithValue(evaluated);
      } else {
        preview.textContent = "";
        updateConversionsWithValue(0);
      }
    } catch {
      preview.textContent = "";
      updateConversionsWithValue(0);
    }
  }

  if (id === "ac") {
    amountInput.value = "";
    preview.textContent = "";
    updateConversionsWithValue(0);
  }

  if (id === "clear") {
    amountInput.value = "";
    preview.textContent = "";
    updateConversionsWithValue(0);
  }

  if (id === "backspace") {
    amountInput.value = amountInput.value.slice(0, -1);
    let value = 0;
    try {
      value = safeEval(amountInput.value);
    } catch {}
    preview.textContent = amountInput.value ? `= ${value}` : "";
    updateConversionsWithValue(!isNaN(value) ? value : 0);
  }

  if (id === "equals") {
    try {
      const result = safeEval(amountInput.value);
      amountInput.value = result;
      preview.textContent = "";
      updateConversionsWithValue(result);
    } catch {
      amountInput.value = "Error";
      preview.textContent = "";
      updateConversionsWithValue(0);
    }
  }
}

// Safe eval function to avoid security risks
function safeEval(expr) {
  // Only allow numbers and math operators
  if (/^[0-9+\-*/.() ]+$/.test(expr)) {
    // Prevent dangerous patterns
    if (expr.includes("__proto__") || expr.includes("constructor") || expr.includes("window") || expr.includes("document")) {
      throw new Error("Invalid input");
    }
    // eslint-disable-next-line no-eval
    return eval(expr);
  }
  throw new Error("Invalid input");
}



// Populate currency options in a select element
function populateCurrencyOptions(selectElement, selectedValue) {
  selectElement.innerHTML = "";
  const baseCurrency = localStorage.getItem("baseCurrency") || baseCurrencySelect.value;
  const targetCurrencies = JSON.parse(localStorage.getItem("targetCurrencies")) || ["GBP", "USD", "MYR"];
  const pinnedCurrencies = [...new Set([baseCurrency, ...targetCurrencies])];
  const sortedCurrencies = Object.entries(currencyNames).sort((a, b) => a[1].localeCompare(b[1]));
  pinnedCurrencies.forEach((code) => {
    const name = currencyNames[code];
    if (!name) return;
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${name} (${code})`;
    if (code === selectedValue) option.selected = true;
    selectElement.appendChild(option);
  });
  const separator = document.createElement("option");
  separator.disabled = true;
  separator.textContent = "──────────";
  selectElement.appendChild(separator);
  sortedCurrencies.forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${name} (${code})`;
    if (code === selectedValue) option.selected = true;
    selectElement.appendChild(option);
  });
}




// Save user preferences to localStorage
// Remove currency at index and update UI
function removeTargetCurrency(idx) {
  targetCurrencies.splice(idx, 1);
  saveToLocalStorage();
  updateTargetCurrencySelectors();
  updateConversionsWithValue(parseFloat(amountInput.value) || 0);
}
function saveToLocalStorage() {
  localStorage.setItem("targetCurrencies", JSON.stringify(targetCurrencies));
  localStorage.setItem("baseCurrency", baseCurrencySelect.value);
}

// Update target currency selectors UI
function updateTargetCurrencySelectors() {
  // Removed: targetCurrencySelectors is no longer used
  convertedRow.innerHTML = "";
  targetCurrencies.forEach((currency, idx) => {
    // Card: abbreviation, converted value, delete button
    const cardDiv = document.createElement('div');
    cardDiv.className = 'currency-row';

    // Output value (top)
    const outputSpan = document.createElement('span');
    outputSpan.className = 'currency-output';
    outputSpan.textContent = formatConvertedValue(currency);
    cardDiv.appendChild(outputSpan);

    // Abbreviation (bottom)
    const abbrSpan = document.createElement('span');
    abbrSpan.className = 'currency-abbr';
    abbrSpan.textContent = currency;
    cardDiv.appendChild(abbrSpan);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-currency-btn';
    delBtn.setAttribute('aria-label', `Remove ${currency}`);
    delBtn.onclick = () => removeTargetCurrency(idx);
    // SVG thin X icon
    delBtn.innerHTML = `<svg viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></svg>`;
    cardDiv.appendChild(delBtn);

    convertedRow.appendChild(cardDiv);
  });
  // Update currency outputs after DOM update
  let value = 0;
  try {
    value = safeEval(amountInput.value);
  } catch {}
  updateConversionsWithValue(!isNaN(value) ? value : 0);
  // Add To Currency button as a card with modal
  if (targetCurrencies.length < 5) {
    const addCard = document.createElement('div');
    addCard.className = 'currency-row';
    addCard.style.justifyContent = 'center';
    addCard.style.alignItems = 'center';
    addCard.style.background = 'linear-gradient(135deg, var(--accent-bg1, #f59e42) 0%, var(--accent-bg2, #fbbf24) 100%)';
    addCard.style.cursor = 'pointer';
    addCard.style.color = '#fff';
    addCard.style.fontWeight = '700';
    addCard.style.fontSize = '1rem';
    addCard.style.display = 'flex';
    addCard.style.position = 'relative';
    addCard.style.minHeight = '48px';
    addCard.style.border = 'none';
    addCard.style.boxShadow = '0 2px 8px rgba(251,191,36,0.10)';
    addCard.textContent = 'Add To Currency';

    const base = baseCurrencySelect.value;
    const available = Object.keys(currencyNames).filter(
      c => !targetCurrencies.includes(c) && c !== base
    );
    if (available.length > 0) {
      addCard.onclick = () => {
        // Create modal overlay
        let modal = document.createElement('div');
        modal.id = 'currencyModal';
        modal.className = 'currency-modal-overlay';

        // Modal content
        let modalContent = document.createElement('div');
        modalContent.className = 'currency-modal-content';

        // Title
        let title = document.createElement('h2');
        title.textContent = 'Select a currency to add';
        title.style.marginBottom = '1rem';
        title.style.fontSize = '1.25rem';
        modalContent.appendChild(title);

        // Search input
        let searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search currency...';
        searchInput.style.marginBottom = '1rem';
        searchInput.style.padding = '0.5rem 1rem';
        searchInput.style.borderRadius = '8px';
        searchInput.style.border = '1px solid #eee';
        searchInput.style.width = '100%';
        searchInput.style.fontSize = '1rem';
        modalContent.appendChild(searchInput);

        // Currency list
        let list = document.createElement('div');
        list.style.maxHeight = '240px';
        list.style.overflowY = 'auto';
        list.style.width = '100%';
        list.style.marginBottom = '1rem';

        function renderList(filter = '') {
          list.innerHTML = '';
          // Priority currencies (always show, but disable if not available)
          const priority = ['GBP', 'MYR', 'SGD', 'USD'];
          const base = baseCurrencySelect.value;
          priority.forEach(code => {
            const name = currencyNames[code];
            if (!name) return;
            const matchesFilter = name.toLowerCase().includes(filter.toLowerCase()) || code.toLowerCase().includes(filter.toLowerCase());
            if (!matchesFilter) return;
            const isAvailable = available.includes(code);
            const item = document.createElement('div');
            item.className = 'currency-list-item';
            item.textContent = `${name} (${code})`;
            item.style.padding = '0.5rem 0.75rem';
            item.style.cursor = isAvailable ? 'pointer' : 'not-allowed';
            item.style.borderRadius = '8px';
            item.style.marginBottom = '0.25rem';
            item.style.fontWeight = 'bold';
            item.style.opacity = isAvailable ? '1' : '0.5';
            if (isAvailable) {
              item.onmouseenter = () => item.style.background = '#f59e42';
              item.onmouseleave = () => item.style.background = '#f9f9f9';
              item.onclick = () => {
                Array.from(list.children).forEach(child => child.style.background = '#f9f9f9');
                item.style.background = '#fbbf24';
                list.setAttribute('data-selected', code);
              };
            }
            list.appendChild(item);
          });
          // Separator if any priority currencies shown and rest exist
          const rest = available.filter(code => !priority.includes(code))
            .filter(code => {
              const name = currencyNames[code].toLowerCase();
              return name.includes(filter.toLowerCase()) || code.toLowerCase().includes(filter.toLowerCase());
            });
          if (priority.some(code => available.includes(code)) && rest.length > 0) {
            const sep = document.createElement('div');
            sep.style.height = '1px';
            sep.style.background = '#eee';
            sep.style.margin = '0.5rem 0';
            list.appendChild(sep);
          }
          // Add rest of currencies
          rest.forEach(code => {
            const item = document.createElement('div');
            item.className = 'currency-list-item';
            item.textContent = `${currencyNames[code]} (${code})`;
            item.style.padding = '0.5rem 0.75rem';
            item.style.cursor = 'pointer';
            item.style.borderRadius = '8px';
            item.style.marginBottom = '0.25rem';
            item.onmouseenter = () => item.style.background = '#f59e42';
            item.onmouseleave = () => item.style.background = '';
            item.onclick = () => {
              Array.from(list.children).forEach(child => child.style.background = '');
              item.style.background = '#fbbf24';
              list.setAttribute('data-selected', code);
            };
            list.appendChild(item);
          });
        }
        renderList();
        searchInput.oninput = () => renderList(searchInput.value);
        modalContent.appendChild(list);

        // Modal buttons
        let btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.justifyContent = 'center';
        btnRow.style.gap = '1rem';

        let addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.style.background = '#f59e42';
        addBtn.style.color = '#fff';
        addBtn.style.border = 'none';
        addBtn.style.borderRadius = '8px';
        addBtn.style.padding = '0.5rem 1.5rem';
        addBtn.style.fontWeight = 'bold';
        addBtn.style.cursor = 'pointer';
        addBtn.onclick = () => {
          const selected = list.getAttribute('data-selected');
          if (selected && !targetCurrencies.includes(selected)) {
            targetCurrencies.push(selected);
            saveToLocalStorage();
            updateTargetCurrencySelectors();
            updateConversions();
            document.body.removeChild(modal);
          }
        };

        let cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.background = '#eee';
        cancelBtn.style.color = '#333';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '8px';
        cancelBtn.style.padding = '0.5rem 1.5rem';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.onclick = () => {
          document.body.removeChild(modal);
        };

        btnRow.appendChild(addBtn);
        btnRow.appendChild(cancelBtn);
        modalContent.appendChild(btnRow);

        // Close modal on click outside
        modal.onclick = (e) => {
          if (e.target === modal) document.body.removeChild(modal);
        };

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
      };
    } else {
      addCard.textContent = 'No more currencies to add.';
    }
    convertedRow.appendChild(addCard);
  }
}

// Exchange rates saved on the device, for a given base currency.
function getSavedRates(base) {
  const entry = ratesCache[base];
  return entry && entry.rates ? entry : null;
}

// Apply rates to the UI and show when they were saved.
function applyRates(rates, savedAt) {
  exchangeRates = rates;
  updateTargetCurrencySelectors();
  renderRatesStatus(savedAt);
}

// Store rates on the device and show them.
function storeRates(base, rates) {
  const savedAt = Date.now();
  ratesCache[base] = { rates, savedAt };
  persistRates();
  applyRates(rates, savedAt);
}

// Show when the rates currently on screen were last saved.
function renderRatesStatus(savedAt) {
  const statusEl = document.getElementById("ratesStatus");
  const dotEl = document.getElementById("ratesDot");
  if (!statusEl) return;
  if (!savedAt) {
    statusEl.textContent = "No exchange rates saved yet";
    if (dotEl) dotEl.className = "rates-dot rates-dot-none";
    return;
  }
  const ageHours = (Date.now() - savedAt) / 3600000;
  statusEl.textContent = `Rates saved ${formatSavedAt(new Date(savedAt))} · ${describeAge(savedAt)}`;
  if (dotEl) {
    dotEl.className = "rates-dot " + (ageHours <= 24 ? "rates-dot-fresh" : "rates-dot-stale");
  }
}

function formatSavedAt(date) {
  try {
    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch (err) {
    return date.toISOString().slice(0, 16).replace("T", " ");
  }
}

function describeAge(savedAt) {
  const minutes = Math.floor((Date.now() - savedAt) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Toggle the spinning state on the refresh button.
function setRefreshing(on) {
  const btn = document.getElementById("refreshRates");
  if (!btn) return;
  btn.disabled = on;
  btn.classList.toggle("is-refreshing", on);
}

// Fetch exchange rates. Rates already saved on the device are reused so the app
// does not call the API every time it opens - pass { force: true } to refresh.
async function fetchRates(options = {}) {
  const force = options.force === true;
  const selectedBase = baseCurrencySelect.value;
  const saved = getSavedRates(selectedBase);

  if (!force && saved) {
    applyRates(saved.rates, saved.savedAt);
    showLoading(false);
    return;
  }

  if (force) {
    setRefreshing(true);
  } else {
    showLoading(true);
  }

  let primaryError = null;
  let fallbackError = null;

  try {
    // Primary API (may require valid apiKey)
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${selectedBase}`
    );
    const data = await response.json();
    if (data && data.result === "success" && data.conversion_rates) {
      storeRates(selectedBase, data.conversion_rates);
      showLoading(false);
      setRefreshing(false);
      console.info('Rates loaded from primary API for', selectedBase);
      return;
    }
    throw new Error(data && data["error-type"] ? data["error-type"] : 'Primary API returned unexpected response');
  } catch (err) {
    primaryError = err;
    console.warn('Primary exchange API failed:', err && err.message ? err.message : err);
    // Try fallback free API (no API key required)
    try {
      const resp2 = await fetch(`https://api.exchangerate.host/latest?base=${selectedBase}`);
      const d2 = await resp2.json();
      if (d2 && d2.rates) {
        storeRates(selectedBase, d2.rates);
        showLoading(false);
        setRefreshing(false);
        console.info('Rates loaded from fallback exchangerate.host for', selectedBase);
        return;
      }
      throw new Error('Fallback API returned unexpected response');
    } catch (err2) {
      fallbackError = err2;
      console.error('Both primary and fallback exchange APIs failed:', err2 && err2.message ? err2.message : err2);
    }
  }

  showLoading(false);
  setRefreshing(false);

  if (saved) {
    // Keep using the rates already on the device rather than losing them.
    renderRatesStatus(saved.savedAt);
    showAlert('Could not reach the exchange rate service. Using the rates saved on this device.', 'warning');
    return;
  }

  // Nothing saved to fall back on - show persistent error overlay
  let loader = document.getElementById('loader');
  if (loader) {
    loader.innerHTML = `<span style='color:#b71c1c;'>Error loading exchange rates.<br>${primaryError && primaryError.message}<br>${fallbackError ? fallbackError.message : ''}</span>`;
    loader.style.display = 'flex';
  }
  showAlert('Unable to load exchange rates. Please check your connection.', 'danger');
}

// Apply selected theme (light/dark only) and update icon
function applyTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark");
  const sunSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
    themeIcon.innerHTML = moonSvg;
  } else {
    document.body.classList.add("theme-light");
    themeIcon.innerHTML = sunSvg;
  }
  localStorage.setItem("theme", theme);
}

// Initialize theme on load
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
}

// Event listeners
themeIcon.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("theme-dark") ? "dark" : "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

// Refresh button - forces a new fetch even when rates are already saved.
const refreshRatesBtn = document.getElementById("refreshRates");
if (refreshRatesBtn) {
  refreshRatesBtn.addEventListener("click", () => {
    fetchRates({ force: true });
  });
}

// Modal for base currency selection
baseCurrencySelect.onclick = function(e) {
  e.preventDefault();
  // Create modal overlay
  let modal = document.createElement('div');
  modal.id = 'baseCurrencyModal';
  modal.className = 'currency-modal-overlay';

  // Modal content
  let modalContent = document.createElement('div');
  modalContent.className = 'currency-modal-content';

  // Title
  let title = document.createElement('h2');
  title.textContent = 'Select base currency';
  title.style.marginBottom = '1rem';
  title.style.fontSize = '1.25rem';
  modalContent.appendChild(title);

  // Search input
  let searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search currency...';
  searchInput.style.marginBottom = '1rem';
  searchInput.style.padding = '0.5rem 1rem';
  searchInput.style.borderRadius = '8px';
  searchInput.style.border = '1px solid #eee';
  searchInput.style.width = '100%';
  searchInput.style.fontSize = '1rem';
  modalContent.appendChild(searchInput);

  // Currency list
  let list = document.createElement('div');
  list.style.maxHeight = '240px';
  list.style.overflowY = 'auto';
  list.style.width = '100%';
  list.style.marginBottom = '1rem';

  function renderList(filter = '') {
    list.innerHTML = '';
    // Priority currencies
    const priority = ['GBP', 'MYR', 'SGD', 'USD'];
    const allCodes = Object.keys(currencyNames);
    const filteredPriority = priority.filter(code => allCodes.includes(code))
      .filter(code => {
        const name = currencyNames[code].toLowerCase();
        return name.includes(filter.toLowerCase()) || code.toLowerCase().includes(filter.toLowerCase());
      });
    const rest = allCodes.filter(code => !priority.includes(code))
      .filter(code => {
        const name = currencyNames[code].toLowerCase();
        return name.includes(filter.toLowerCase()) || code.toLowerCase().includes(filter.toLowerCase());
      });
    // Add priority currencies first
    filteredPriority.forEach(code => {
      const item = document.createElement('div');
      item.className = 'currency-list-item';
      item.textContent = `${currencyNames[code]} (${code})`;
      item.style.padding = '0.5rem 0.75rem';
      item.style.cursor = 'pointer';
      item.style.borderRadius = '8px';
      item.style.marginBottom = '0.25rem';
      item.style.fontWeight = 'bold';
      item.onmouseenter = () => item.style.background = '#f59e42';
      item.onmouseleave = () => item.style.background = '';
      item.onclick = () => {
        Array.from(list.children).forEach(child => child.style.background = '');
        item.style.background = '#fbbf24';
        list.setAttribute('data-selected', code);
      };
      list.appendChild(item);
    });
    // Separator if any priority currencies shown and rest exist
    if (filteredPriority.length > 0 && rest.length > 0) {
      const sep = document.createElement('div');
      sep.style.height = '1px';
      sep.style.background = '#eee';
      sep.style.margin = '0.5rem 0';
      list.appendChild(sep);
    }
    // Add rest of currencies
    rest.forEach(code => {
      const item = document.createElement('div');
      item.className = 'currency-list-item';
      item.textContent = `${currencyNames[code]} (${code})`;
      item.style.padding = '0.5rem 0.75rem';
      item.style.cursor = 'pointer';
      item.style.borderRadius = '8px';
      item.style.marginBottom = '0.25rem';
      item.onmouseenter = () => item.style.background = '#f59e42';
      item.onmouseleave = () => item.style.background = '';
      item.onclick = () => {
        Array.from(list.children).forEach(child => child.style.background = '');
        item.style.background = '#fbbf24';
        list.setAttribute('data-selected', code);
      };
      list.appendChild(item);
    });
  }
  renderList();
  searchInput.oninput = () => renderList(searchInput.value);
  modalContent.appendChild(list);

  // Modal buttons
  let btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'center';
  btnRow.style.gap = '1rem';

  let selectBtn = document.createElement('button');
  selectBtn.textContent = 'Select';
  selectBtn.style.background = '#f59e42';
  selectBtn.style.color = '#fff';
  selectBtn.style.border = 'none';
  selectBtn.style.borderRadius = '8px';
  selectBtn.style.padding = '0.5rem 1.5rem';
  selectBtn.style.fontWeight = 'bold';
  selectBtn.style.cursor = 'pointer';
  selectBtn.onclick = () => {
    const selected = list.getAttribute('data-selected');
    if (selected && baseCurrencySelect.value !== selected) {
      baseCurrencySelect.value = selected;
      saveToLocalStorage();
      fetchRates();
      document.body.removeChild(modal);
    }
  };

  let cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.background = '#eee';
  cancelBtn.style.color = '#333';
  cancelBtn.style.border = 'none';
  cancelBtn.style.borderRadius = '8px';
  cancelBtn.style.padding = '0.5rem 1.5rem';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.onclick = () => {
    document.body.removeChild(modal);
  };

  btnRow.appendChild(selectBtn);
  btnRow.appendChild(cancelBtn);
  modalContent.appendChild(btnRow);

  // Close modal on click outside
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal);
  };

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};
// Debounced input handler for performance
amountInput.oninput = function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    let value = 0;
    try {
      value = safeEval(amountInput.value);
    } catch {}
    updateConversionsWithValue(!isNaN(value) ? value : 0);
  }, 300);
};
if (addTargetBtn) {
  addTargetBtn.onclick = () => {
    if (targetCurrencies.length < 5) {
      // Exclude base currency and already selected currencies
      const base = baseCurrencySelect.value;
      const available = Object.keys(currencyNames).filter(
        c => !targetCurrencies.includes(c) && c !== base
      );
      if (available.length > 0) {
        targetCurrencies.push(available[0]);
        saveToLocalStorage();
        updateTargetCurrencySelectors();
        updateConversions();
      } else {
        showAlert("No more currencies to add.", "warning");
      }
      addTargetBtn.disabled = targetCurrencies.length >= 5;
    }
  };
}

// App initialization
window.onload = () => {
  // Hide the base currency dropdown, use only modal
  baseCurrencySelect.style.display = 'none';
  // Create a visible button to show modal
  let baseCurrencyBtn = document.createElement('button');
  baseCurrencyBtn.id = 'baseCurrencyBtn';
  baseCurrencyBtn.textContent = `From: ${currencyNames[baseCurrencySelect.value] || baseCurrencySelect.value}`;
  baseCurrencySelect.parentNode.insertBefore(baseCurrencyBtn, baseCurrencySelect);
  baseCurrencyBtn.onclick = baseCurrencySelect.onclick;

  // Update button text when base currency changes
  const updateBaseBtnText = () => {
    baseCurrencyBtn.textContent = `From: ${currencyNames[baseCurrencySelect.value] || baseCurrencySelect.value}`;
  };
  // Patch modal selectBtn to update button text
  const origFetchRates = fetchRates;
  fetchRates = function() {
    updateBaseBtnText();
    return origFetchRates.apply(this, arguments);
  };

  populateCurrencyOptions(baseCurrencySelect, baseCurrency);
  updateTargetCurrencySelectors();
  initTheme();
  fetchRates();
  checkAndAskForUserName();
  // Notify app open (for analytics)
  // Removed failing POST request to ntfy.sunny.bz
};

// Settings drawer (slide-out menu)
const settingsBtn = document.getElementById("settingsBtn");
const settingsDrawer = document.getElementById("settingsDrawer");
const closeDrawerBtn = document.getElementById("closeDrawer");
const drawerTitleValue = document.getElementById("drawerTitleValue");

function openSettingsDrawer() {
  if (!settingsDrawer) return;
  settingsDrawer.hidden = false;
  settingsBtn?.setAttribute("aria-expanded", "true");
  if (drawerTitleValue) {
    drawerTitleValue.textContent = document.getElementById("headerTitle")?.textContent || "";
  }
}
function closeSettingsDrawer() {
  if (!settingsDrawer) return;
  settingsDrawer.hidden = true;
  settingsBtn?.setAttribute("aria-expanded", "false");
}
settingsBtn?.addEventListener("click", openSettingsDrawer);
closeDrawerBtn?.addEventListener("click", closeSettingsDrawer);
settingsDrawer?.addEventListener("click", (e) => {
  if (e.target === settingsDrawer) closeSettingsDrawer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && settingsDrawer && !settingsDrawer.hidden) closeSettingsDrawer();
});

// Register service worker for PWA (not applicable inside the Cordova app)
if ("serviceWorker" in navigator && !window.cordova) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service Worker Registered"));
}

// Handle PWA install banner. The banner is shown on every page load until the
// app is installed. Dismissing it only hides it for the current session.
const installBanner = document.getElementById("installBanner");
const installBannerInstall = document.getElementById("installBannerInstall");
const installBannerClose = document.getElementById("installBannerClose");
let deferredInstallPrompt = null;
let installBannerHideTimer = null;

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.navigator.standalone === true
  );
}

function showInstallBanner() {
  if (!installBanner || isRunningStandalone()) return;
  clearTimeout(installBannerHideTimer);
  installBanner.hidden = false;
  requestAnimationFrame(() => installBanner.classList.add("install-banner--visible"));
}

function hideInstallBanner() {
  if (!installBanner) return;
  installBanner.classList.remove("install-banner--visible");
  clearTimeout(installBannerHideTimer);
  installBannerHideTimer = setTimeout(() => {
    installBanner.hidden = true;
  }, 300);
}

installBannerInstall?.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  const prompt = deferredInstallPrompt;
  deferredInstallPrompt = null;
  hideInstallBanner();
  prompt.prompt();
  try {
    const choiceResult = await prompt.userChoice;
    console.log("User choice", choiceResult.outcome);
  } catch (err) {
    console.warn("Install prompt failed:", err);
  }
});

installBannerClose?.addEventListener("click", hideInstallBanner);

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallBanner();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  hideInstallBanner();
});

// Ask for user name if not set
function checkAndAskForUserName() {
  if (localStorage.getItem("userName")) {
    const name = localStorage.getItem("userName");
    // userName element removed; only update headerTitle
    const headerTitle = document.getElementById("headerTitle");
    if (headerTitle) {
      headerTitle.textContent = `${name}'s Currency Converter`;
    }
    return;
  }
  const overlay = document.createElement("div");
  overlay.id = "nameOverlay";
  overlay.innerHTML = `
    <h2>Welcome! What's your name?</h2>
    <input type="text" id="userNameInput" placeholder="Enter your name" />
    <button id="saveUserNameBtn">Continue</button>
  `;
  document.body.appendChild(overlay);
  document.getElementById("saveUserNameBtn").onclick = function () {
    const nameInput = document.getElementById("userNameInput").value.trim();
    if (nameInput) {
      localStorage.setItem("userName", nameInput);
      // userName element removed; only update headerTitle
      const headerTitle = document.getElementById("headerTitle");
      if (headerTitle) {
        headerTitle.textContent = `${nameInput}'s Currency Converter`;
      }
      overlay.remove();
    } else {
      alert("Please enter your name.");
    }
  };
}
