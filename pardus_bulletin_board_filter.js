// ==UserScript==
// @name         Pardus Bulletin Board Filter
// @version      1.0
// @description  Filters bulletin board missions by keywords and mission types (faction, neutral, explosives, VIP...)
// @include     http*://*.pardus.at/bulletin_board.php*
// @include     http*://*.pardus.at/main.php*
// @grant        none
// ==/UserScript==

if (document.URL.indexOf("pardus.at/bulletin_board.php") > -1) {
  const missionsDiv = document.getElementById("div_missions");

  if (!missionsDiv) return;

  const filtersDiv = document.createElement("div");
  filtersDiv.style.marginBottom = "10px";

  const includedKeywordsDiv = document.createElement("div");
  includedKeywordsDiv.style.marginBottom = "10px";

  const labelIncludedKeywords = document.createElement("label");
  labelIncludedKeywords.innerText = "Included keywords: ";
  includedKeywordsDiv.appendChild(labelIncludedKeywords);

  const inputIncludedKeywords = document.createElement("input");
  inputIncludedKeywords.type = "text";
  inputIncludedKeywords.placeholder =
    "Enter included words separated by commas";
  inputIncludedKeywords.style.width = "50%";
  inputIncludedKeywords.id = "keywordInput";
  inputIncludedKeywords.onChange = "filterTables";

  includedKeywordsDiv.appendChild(inputIncludedKeywords);
  filtersDiv.appendChild(includedKeywordsDiv);

  const excludedKeywordsDiv = document.createElement("div");
  excludedKeywordsDiv.style.marginBottom = "10px";

  const labelExcludedKeywords = document.createElement("label");
  labelExcludedKeywords.innerText = "Excluded keywords: ";
  excludedKeywordsDiv.appendChild(labelExcludedKeywords);

  const inputExcludedKeywords = document.createElement("input");
  inputExcludedKeywords.type = "text";
  inputExcludedKeywords.placeholder =
    "Enter excluded words separated by commas";
  inputExcludedKeywords.style.width = "50%";
  inputExcludedKeywords.id = "keywordInput";
  inputExcludedKeywords.onChange = "filterTables";

  excludedKeywordsDiv.appendChild(inputExcludedKeywords);
  filtersDiv.appendChild(excludedKeywordsDiv);

  missionsDiv.parentNode.insertBefore(filtersDiv, missionsDiv);

  const factionDiv = document.createElement("div");
  factionDiv.style.marginBottom = "10px";

  const factionCheckbox = document.createElement("input");
  factionCheckbox.type = "checkbox";
  factionCheckbox.id = "factionCheckbox";
  factionDiv.appendChild(factionCheckbox);
  factionDiv.appendChild(document.createTextNode(" Faction"));

  const neutralCheckbox = document.createElement("input");
  neutralCheckbox.type = "checkbox";
  neutralCheckbox.id = "neutralCheckbox";
  neutralCheckbox.style.marginLeft = "10px";
  factionDiv.appendChild(neutralCheckbox);
  factionDiv.appendChild(document.createTextNode(" Neutral"));

  filtersDiv.appendChild(factionDiv);

  const filterDiv = document.createElement("div");
  filterDiv.style.marginBottom = "10px";

  const explosivesCheckbox = document.createElement("input");
  explosivesCheckbox.type = "checkbox";
  explosivesCheckbox.id = "explosivesCheckbox";
  filterDiv.appendChild(explosivesCheckbox);
  filterDiv.appendChild(document.createTextNode(" Explosives"));

  const packagesCheckbox = document.createElement("input");
  packagesCheckbox.type = "checkbox";
  packagesCheckbox.id = "packagesCheckbox";
  packagesCheckbox.style.marginLeft = "10px";
  filterDiv.appendChild(packagesCheckbox);
  filterDiv.appendChild(document.createTextNode(" Packages"));

  const vipActionTripCheckbox = document.createElement("input");
  vipActionTripCheckbox.type = "checkbox";
  vipActionTripCheckbox.id = "vipCheckbox";
  vipActionTripCheckbox.style.marginLeft = "10px";
  filterDiv.appendChild(vipActionTripCheckbox);
  filterDiv.appendChild(document.createTextNode(" VIP Action Trip"));

  const vipTransportCheckbox = document.createElement("input");
  vipTransportCheckbox.type = "checkbox";
  vipTransportCheckbox.id = "vipCheckbox";
  vipTransportCheckbox.style.marginLeft = "10px";
  filterDiv.appendChild(vipTransportCheckbox);
  filterDiv.appendChild(document.createTextNode(" VIP Transport"));

  const assassinationsCheckbox = document.createElement("input");
  assassinationsCheckbox.type = "checkbox";
  assassinationsCheckbox.id = "assassinationsCheckbox";
  assassinationsCheckbox.style.marginLeft = "10px";
  filterDiv.appendChild(assassinationsCheckbox);
  filterDiv.appendChild(document.createTextNode(" Assassinations"));

  filtersDiv.appendChild(filterDiv);

  factionCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterFactionMissions") === "true";
  neutralCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterNeutralMissions") === "true";
  explosivesCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterExplosiveMissions") === "true";
  packagesCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterPackageMissions") === "true";
  vipActionTripCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterVIPActionTripMissions") === "true";
  vipTransportCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterVIPTransportMissions") === "true";
  assassinationsCheckbox.checked =
    localStorage.getItem("bulletinBoardFilterAssassinationMissions") === "true";

  const originalTables = missionsDiv.querySelectorAll("table.messagestyle");

  filterTables();

  function filterTables() {
    const activeElement = document.activeElement;

    const keywordsIncluded = inputIncludedKeywords.value
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);

    const keywordsExcluded = inputExcludedKeywords.value
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);

    missionsDiv.innerHTML = "";

    const tables = Array.from(originalTables);

    for (let i = tables.length - 1; i >= 0; i--) {
      let deleteTable = true;

      for (let k = keywordsIncluded.length - 1; k >= 0; k--) {
        if (missionContainsKeyword(tables[i], keywordsIncluded[k])) {
          deleteTable = false;
          break;
        }
      }

      if (deleteTable && keywordsIncluded.length) {
        tables.splice(i, 1);
        continue;
      }

      deleteTable = false;

      for (let k = 0; k < keywordsExcluded.length; k++) {
        console.log(keywordsExcluded[k]);
        if (missionContainsKeyword(tables[i], keywordsExcluded[k])) {
          deleteTable = true;
          break;
        }
      }

      if (deleteTable && keywordsExcluded.length) {
        tables.splice(i, 1);
        continue;
      }

      if (!factionCheckbox.checked && isFactionMission(tables[i])) {
        tables.splice(i, 1);
        continue;
      }

      if (!neutralCheckbox.checked && isNeutralMission(tables[i])) {
        tables.splice(i, 1);
        continue;
      }

      if (!explosivesCheckbox.checked && isExplosivesMission(tables[i])) {
        tables.splice(i, 1);
        continue;
      }

      if (!packagesCheckbox.checked && isPackageMission(tables[i])) {
        tables.splice(i, 1);
        continue;
      }

      if (!vipActionTripCheckbox.checked && isVIPActionTrip(tables[i])) {
        tables.splice(i, 1);
        continue;
      }

      if (!vipTransportCheckbox.checked && isVIPTransport(tables[i])) {
        tables.splice(i, 1);
        continue;
      }

      if (
        !assassinationsCheckbox.checked &&
        isAssassinationMission(tables[i])
      ) {
        tables.splice(i, 1);
        continue;
      }
    }
    tables.forEach((table) => {
      missionsDiv.appendChild(table.cloneNode(true));
    });

    if (activeElement) {
      activeElement.focus();
    }
  }

  const savedIncludedKeywords = localStorage.getItem(
    "bulletinBoardFilterIncludedKeywords"
  );
  if (savedIncludedKeywords) {
    inputIncludedKeywords.value = savedIncludedKeywords;
    filterTables(savedIncludedKeywords);
  }

  inputIncludedKeywords.addEventListener("input", function () {
    const keywords = inputIncludedKeywords.value;
    localStorage.setItem("bulletinBoardFilterIncludedKeywords", keywords);
    filterTables();
  });

  const savedExcludedKeywords = localStorage.getItem(
    "bulletinBoardFilterKeywordsExcluded"
  );
  if (savedExcludedKeywords) {
    inputExcludedKeywords.value = savedExcludedKeywords;
    filterTables();
  }

  inputExcludedKeywords.addEventListener("input", function () {
    const keywords = inputExcludedKeywords.value;
    localStorage.setItem("bulletinBoardFilterKeywordsExcluded", keywords);
    filterTables();
  });

  factionCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterFactionMissions",
      factionCheckbox.checked
    );
    filterTables();
  });

  neutralCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterNeutralMissions",
      neutralCheckbox.checked
    );
    filterTables();
  });

  explosivesCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterExplosiveMissions",
      explosivesCheckbox.checked
    );
    filterTables();
  });

  packagesCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterPackageMissions",
      packagesCheckbox.checked
    );
    filterTables();
  });

  vipActionTripCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterVIPActionTripMissions",
      vipActionTripCheckbox.checked
    );
    filterTables();
  });

  vipTransportCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterVIPTransportMissions",
      vipTransportCheckbox.checked
    );
    filterTables();
  });

  assassinationsCheckbox.addEventListener("change", function () {
    localStorage.setItem(
      "bulletinBoardFilterAssassinationMissions",
      assassinationsCheckbox.checked
    );
    filterTables();
  });
}

function missionContainsKeyword(table, keyword) {
  return table.textContent.toLowerCase().includes(keyword);
}

function isAssassinationMission(table) {
  return table.textContent.toLowerCase().includes("assassination");
}

function isVIPActionTrip(table) {
  return table.innerHTML.toLowerCase().includes("vip action trip");
}

function isVIPTransport(table) {
  return table.innerHTML.toLowerCase().includes("transport vip");
}

function isVIPMission(table) {
  return (
    table.innerHTML.toLowerCase().includes("transport vip") ||
    table.innerHTML.toLowerCase().includes("vip action trip")
  );
}

function isPackageMission(table) {
  return table.textContent.toLowerCase().includes("transport packages");
}

function isFactionMission(table) {
  var images = table.getElementsByTagName("img");
  const factionValues = ["The Federation", "The Empire", "The Union"];
  var includes = false;
  for (let i = 0; i < images.length; i++) {
    if (factionValues.some((v) => images[i].alt.includes(v))) {
      includes = true;
      break;
    }
  }

  return includes;
}

function isNeutralMission(table) {
  return table.innerHTML.toLowerCase().includes("packages.png");
}

function isExplosivesMission(table) {
  return table.textContent.toLowerCase().includes("transport explosives");
}

// unused, but a suggestion for NPC filter (checboxes) in a dropdown menu
function getSelectedValues(scrollableMenu) {
  const selectedValues = [];
  const checkboxes = scrollableMenu.querySelectorAll(
    'input[type="checkbox"].npc-checkbox:checked'
  );
  checkboxes.forEach((checkbox) => {
    selectedValues.push(checkbox.value);
  });
  return selectedValues;
}

// unused, but a suggestion for NPC filter (checboxes), putting NPC images next to labels in a dropdown menu
function getImagesPath() {
  var tbl = document.querySelector("table.messagestyle");
  var img_path = tbl
    .getAttribute("style")
    .substring(
      tbl.getAttribute("style").indexOf("background:url(") +
        "background:url(".length,
      tbl.getAttribute("style").indexOf("bgdark.gif)")
    );
  console.log(img_path);
  return img_path;
}

// unused, but a suggestion for NPC filter (checboxes), dropdown menu from a dictionary of 'cluster': list[sectors]
function formatNpcName(npcName) {
  const words = npcName.split("_");

  const formattedName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedName;
}
