document.addEventListener("DOMContentLoaded", function () {
  generateAndDisplayDefaultColors();
  setUpColorPickers();
  setUpCopyButton();
});

document.getElementById("generate").addEventListener("click", function () {
  if (validateInputs()) {
    generateAndDisplayColors();
  }
});

function validateInputs() {
  // Validate color100 and color1000
  const colorInputs = ["color100", "color1000"];
  let isValid = true;

  colorInputs.forEach((id) => {
    const colorValue = document.getElementById(id).value.trim();
    if (!/^#?([a-fA-F0-9]{6})$/.test(colorValue)) {
      alert(
        `Invalid color format for ${id}. Please enter a valid 6-digit hex code.`
      );
      isValid = false;
    }
  });

  // Check if color600 is provided and valid; skip if empty
  const color600Value = document.getElementById("color600").value.trim();
  if (color600Value && !/^#?([a-fA-F0-9]{6})$/.test(color600Value)) {
    alert(
      "Invalid color format for color600. Please enter a valid 6-digit hex code or leave it blank."
    );
    isValid = false;
  }

  // Validate easeFactor
  const easeFactor = parseFloat(document.getElementById("easeFactor").value);
  if (easeFactor < 1 || easeFactor > 5) {
    alert("Ease Factor must be between 1 and 5.");
    isValid = false;
  }

  return isValid;
}

function generateAndDisplayDefaultColors() {
  generateAndDisplayColors();
}

function setUpColorPickers() {
  // Set up color pickers
  setUpColorPicker("color100", "color100Picker");
  setUpColorPicker("color600", "color600Picker");
  setUpColorPicker("color1000", "color1000Picker");

  // Set up text selection on focus
  ["color100", "color600", "color1000"].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("click", function () {
      this.select();
    });
  });
}

function setUpColorPicker(textInputId, colorPickerId) {
  const textInput = document.getElementById(textInputId);
  const colorPicker = document.getElementById(colorPickerId);

  // Sync color picker with text input
  textInput.addEventListener("input", function () {
    const color = addHashIfNeeded(this.value);
    if (/^#([0-9a-f]{6})$/i.test(color)) {
      colorPicker.value = color;
    }
  });

  // Sync text input with color picker
  colorPicker.addEventListener("input", function () {
    textInput.value = this.value.substring(1); // Remove '#' from color picker value
  });

  // Initialize color picker
  const initialColor = addHashIfNeeded(textInput.value);
  if (/^#([0-9a-f]{6})$/i.test(initialColor)) {
    colorPicker.value = initialColor;
  }
}

function generateAndDisplayColors() {
  const color100 = addHashIfNeeded(document.getElementById("color100").value);
  const color600 = addHashIfNeeded(document.getElementById("color600").value);
  const color1000 = addHashIfNeeded(document.getElementById("color1000").value);
  const easeFactor = parseFloat(document.getElementById("easeFactor").value);

  const colorArray = generateColorArray(
    color100,
    color600,
    color1000,
    easeFactor
  );
  displayColors(colorArray);
}

function addHashIfNeeded(color) {
  return color.startsWith("#") ? color : "#" + color;
}

function interpolateColor(color1, color2, factor) {
  let result = "#";
  for (let i = 0; i < 6; i += 2) {
    let hex1 = parseInt(color1.substr(i + 1, 2), 16);
    let hex2 = parseInt(color2.substr(i + 1, 2), 16);
    let hex = Math.round((1 - factor) * hex1 + factor * hex2)
      .toString(16)
      .padStart(2, "0");
    result += hex;
  }
  return result;
}

function easeInCurve(t, easeFactor) {
  return Math.pow(t, easeFactor);
}

function generateColorArray(c100, c600, c1000, easeFactor) {
  let colors = [c100];
  for (let i = 2; i <= 10; i++) {
    let color;
    if (c600 && c600 !== "#") {
      if (i < 6) {
        let factor = easeInCurve((i - 1) / 5.0, easeFactor);
        color = interpolateColor(c100, c600, factor);
      } else if (i === 6) {
        color = c600;
      } else if (i < 10) {
        color = interpolateColor(c600, c1000, (i - 6) / 4.0);
      } else {
        color = c1000;
      }
    } else {
      if (i < 10) {
        color = interpolateColor(c100, c1000, (i - 1) / 9.0);
      } else {
        color = c1000;
      }
    }
    colors.push(color);
  }
  return colors;
}

function displayColors(colors) {
  const resultDiv = document.getElementById("result");
  const svgResultDiv = document.getElementById("svgResult");
  resultDiv.innerHTML = "";
  svgResultDiv.innerHTML = "";

  let svgContent =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="' +
    colors.length * 20 +
    '">';

  colors.forEach((color, index) => {
    // Display colors as divs
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("level-item"); // Add the class here
    colorDiv.style.backgroundColor = color;
    //colorDiv.style.padding = "10px";
    colorDiv.innerHTML = `<strong>${100 + index * 100}</strong><br>${color}`;
    resultDiv.appendChild(colorDiv);

    // Add colors to SVG
    svgContent += `<rect x="0" y="${
      index * 20
    }" width="200" height="20" fill="${color}"/>`;
    svgContent += `<text x="5" y="${
      index * 20 + 15
    }" fill="black" font-size="12">${100 + index * 100}: ${color}</text>`;
  });

  svgContent += "</svg>";
  svgResultDiv.innerHTML = svgContent;

  // Copy button event listener
  document.getElementById("copyButton").addEventListener("click", function () {
    copyToClipboard(svgResultDiv.innerHTML);
  });
}

function copyToClipboard(svg) {
  const textarea = document.createElement("textarea");
  textarea.value = svg;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  //alert("SVG copied to clipboard!");
}
