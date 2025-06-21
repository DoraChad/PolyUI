//Colors

const blue1 = "#112052";
const blue2 = "#212b58";
const blue3 = "#28346a";
const blue4 = "#334b77";

//Main UI Creation/Editing

let elementSpecificDiv;

const projectUI = document.getElementById("project-ui");

let allDOM = [projectUI];
let allDOMNames = ["ui"]

const siteUI = document.getElementById("site-ui");

const topBarButton = document.getElementById("site-top-bar-button");
const topBar = document.getElementById("site-top-bar");

topBarButton.onclick = () => {
    console.log("clicked");
    if (topBar.classList.contains("site-top-bar-close")) {
        topBar.classList.remove("site-top-bar-close");
        topBarButton.classList.remove("site-top-bar-close");
    } else {
        topBar.classList.add("site-top-bar-close");
        topBarButton.classList.add("site-top-bar-close");
    };
};

document.getElementById("site-element-create-button").onclick = () => {elementCreationPopup()};

function colorBarPicker(parent, title, colors=[]) {
    const setting = document.createElement("div")
    setting.style.width = "100%";
    setting.style.height = "75px";
    setting.style.display = "flex";
    setting.style.flexDirection = "row";
    setting.style.color = "white";
    setting.style.alignItems = "center";

    parent.appendChild(setting);

    const titleText = document.createElement("p");
    titleText.textContent = title;
    titleText.style.fontSize = "25px";
    titleText.style.marginLeft = "80px";
    titleText.style.className = "overflow-ellipsis";

    setting.appendChild(titleText);
    
    const colorBarDiv = document.createElement("div");
    colorBarDiv.className = "color-bar-div";

    colors.forEach(value => {
        const option = document.createElement("div");
        option.style.background = value;
        option.style.height = "50px";
        option.style.width = "50px";
        option.style.border = "black solid 2px";
        colorBarDiv.appendChild(option);
    });

    setting.appendChild(colorBarDiv);
};

function elementCreationSwitch(value) {
    elementSpecificDiv.innerHTML = "";
    if (value === "div") {
        createTextbox(elementSpecificDiv, "Height:", "100%");
        createTextbox(elementSpecificDiv, "Width:", "100%");
        colorBarPicker(elementSpecificDiv, "Background Color:", [blue1, blue2, blue3, blue4]);
    }
    
};

function elementCreationPopup() {
    const popupBackground = document.createElement("div")
    popupBackground.className = "site-element-creation";

    siteUI.appendChild(popupBackground);

    const topTitle = document.createElement("div");
    topTitle.className = "site-element-creation-top";
    topTitle.innerHTML = "Create Element";

    popupBackground.appendChild(topTitle);

    elementSpecificDiv = document.createElement("div");

    createTextbox(popupBackground, "Class Name:");

    createDropdown(popupBackground, "Parent:", allDOMNames);

    createDropdown(popupBackground, "Element Type:", ["---", "div", "p"], elementCreationSwitch);

    popupBackground.appendChild(elementSpecificDiv);
};


function createDropdown(parent, title, options=[], onChange=null) {
    const setting = document.createElement("div")
    setting.style.width = "100%";
    setting.style.height = "75px";
    setting.style.display = "flex";
    setting.style.flexDirection = "row";
    setting.style.color = "white";
    setting.style.alignItems = "center";

    parent.appendChild(setting);

    const titleText = document.createElement("p");
    titleText.textContent = title;
    titleText.style.fontSize = "25px";
    titleText.style.marginLeft = "80px";
    titleText.style.className = "overflow-ellipsis";

    setting.appendChild(titleText);

    const dropdown = document.createElement("select");
    dropdown.className = "site-dropdown";

    dropdown.onchange = function () {
        if (!onChange) return;
        if (dropdown.value !== "---") onChange(dropdown.value, parent);;
    };

    options.forEach(value => {
        const option = document.createElement("option");
        option.value = value.toLowerCase().replace(/\s+/g, "-"); // e.g., "Option 1" -> "option-1"
        option.textContent = value;
        dropdown.appendChild(option);
    });

    setting.appendChild(dropdown);
};

function createTextbox(parent, title, placeholder="") {
    const setting = document.createElement("div")
    setting.style.width = "100%";
    setting.style.height = "75px";
    setting.style.display = "flex";
    setting.style.flexDirection = "row";
    setting.style.color = "white";
    setting.style.alignItems = "center";

    parent.appendChild(setting);

    const titleText = document.createElement("p");
    titleText.textContent = title;
    titleText.style.fontSize = "25px";
    titleText.style.marginLeft = "80px";
    titleText.style.className = "overflow-ellipsis";

    setting.appendChild(titleText);

    const dropdown = document.createElement("input");
    dropdown.className = "site-input";
    dropdown.placeholder = placeholder;

    setting.appendChild(dropdown);
}

function addElementToProject(element, parent) {
    allDOM.push(element);
    let counter = 1;
    if (!element.className) {
        while (true) {
            if (!allDomNames.includes(`${element.tagName}${counter}`)) {
                element.className = `${element.tagName}${counter}`;
                break;
            }
            counter += 1;
        }
    }
    allDomNames.push(element.className);
    parent.appendChild(element);
}
