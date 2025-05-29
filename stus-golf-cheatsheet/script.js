const clubs = [
    { name: "6i", type: "iron", carry: 145, rollout: 159 },
    { name: "7i", type: "iron", carry: 139, rollout: 148 },
    { name: "8i", type: "iron", carry: 127, rollout: 138 },
    { name: "9i", type: "iron", carry: 117, rollout: 126 },
    { name: "PW", type: "wedge", carry: 108, rollout: 116, },
    { name: "GW", type: "wedge", carry: 88, rollout: 98, },
    { name: "SW", type: "wedge", carry: 78, rollout: 86, },
    { name: "PW", type: "mp-wedge", carry: 75, rollout: 84, },
    { name: "PW", type: "sp-wedge", carry: 67, rollout: 79, },
    { name: "GW", type: "mp-wedge", carry: 64, rollout: 75, },
    { name: "GW", type: "sp-wedge", carry: 61, rollout: 74, },
    { name: "SW", type: "mp-wedge", carry: 62, rollout: 72, },
    { name: "SW", type: "sp-wedge", carry: 58, rollout: 67, },
    { name: "LW", type: "mp-wedge", carry: 52, rollout: 61, },
    { name: "LW", type: "sp-wedge", carry: 48, rollout: 57, },
    
];
const ironButtons = document.getElementById("ironButtons");
const wedgeButtons = document.getElementById("wedgeButtons");
const mediumPartialButtons = document.getElementById("mediumPartialButtons");
const smallPartialButtons = document.getElementById("smallPartialButtons");

let useYards = true;

// Reset class 'active' only on relevant group
function clearActiveButtons() {
    document.querySelectorAll(".buttons button").forEach(b => b.classList.remove("active"));
}// Reset class 'active' only on relevant group
function clearActiveButtons() {
    document.querySelectorAll(".buttons button").forEach(b => b.classList.remove("active"));
}

const carryEl = document.getElementById("carryValue");
const rolloutEl = document.getElementById("rolloutValue");
const toggle = document.getElementById("unitToggle");
const buttonContainer = document.getElementById("clubButtons");

function metresToYards(m) {
    return Math.round(m * 1.09361);
}

function displayDistance(club) {
    const carry = useYards ? metresToYards(club.carry) : club.carry;
    const rollout = useYards ? metresToYards(club.rollout) : club.rollout;

    carryEl.innerHTML = carry + (useYards ? " <span>yd</span>" : " <span>m</span>");
    rolloutEl.innerHTML = rollout + (useYards ? " <span>yd</span>" : " <span>m</span>");
}

clubs.forEach(club => {
    const btn = document.createElement("button");
    btn.textContent = club.name;
    btn.addEventListener("click", () => {
        clearActiveButtons();
        btn.classList.add("active");
        displayDistance(club);
    });

    if (club.type === "iron") {
        ironButtons.appendChild(btn);
    } else if (club.type === "wedge") {
        wedgeButtons.appendChild(btn);
    } else if (club.type === "mp-wedge") {
        mediumPartialButtons.appendChild(btn);
    } else if (club.type === "sp-wedge") {
        smallPartialButtons.appendChild(btn);
    }
});

toggle.addEventListener("change", () => {
    useYards = toggle.checked;
    const selected = document.querySelector(".buttons button.active");
    if (selected) {
        const clubName = selected.textContent;
        const club = clubs.find(c => c.name === clubName);
        displayDistance(club);
    }
});


// Toggle logic for collapsible groups
document.querySelectorAll(".collapsible-group").forEach(group => {
    const button = group.querySelector(".toggle-btn");
    const content = group.querySelector(".buttons-group");

    button.addEventListener("click", () => {
        const isHidden = content.style.display === "none";
        content.style.display = isHidden ? "block" : "none";
        button.textContent = `${isHidden ? "Hide" : "Show"} ${content.querySelector("h3").textContent}`;
    });
});
