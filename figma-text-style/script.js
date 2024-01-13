// Function to fetch text styles from Figma
async function fetchTextStyles() {
  const fileId = document.getElementById("fileIdInput").value;
  const apiKey = "figd_MzfEBr-fPnOGu7SLoK_p5f1zTmZr85aAWdOzpurD"; // Replace with your Figma API key
  const url = `https://www.figma.com/file/70IJs0AiJKkU8VGF9ao3Hj/CMX?type=design&node-id=23%3A5660&mode=design&t=zCXxQrDncG0lo1Wg-1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Figma-Token": apiKey,
      },
    });

    const data = await response.json();
    displayTextStyles(data); // Function to process and display text styles
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Function to display text styles
function displayTextStyles(data) {
  const stylesContainer = document.getElementById("textStylesContainer");
  stylesContainer.innerHTML = ""; // Clear previous styles

  // Assuming 'data' contains text styles in a specific format
  // You'll need to parse and extract text styles from 'data'
  // For example:
  data.styles.forEach((style) => {
    const styleDiv = document.createElement("div");
    styleDiv.style.fontFamily = style.fontFamily;
    styleDiv.style.fontSize = style.fontSize + "px";
    styleDiv.style.color = style.color;
    // Add more style properties as needed
    styleDiv.innerText = "Sample Text";
    stylesContainer.appendChild(styleDiv);
  });
}
