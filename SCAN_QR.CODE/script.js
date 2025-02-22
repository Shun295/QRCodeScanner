// DARK MODE TOGGLE
document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    this.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

async function checkURLSafety(url) {
    const apiKey = "AIzaSyA3IS0dTJBPiUIkpi41WHzgqX-ipPwijig"; // Replace with your API key
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const requestBody = {
        client: {
            clientId: "your-client-id",
            clientVersion: "1.0",
        },
        threatInfo: {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],

            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }],
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        return data.matches ? false : true; // Returns false if URL is unsafe
    } catch (error) {
        console.error("Error checking URL safety:", error);
        return true; // Assume safe if API request fails
    }
}

async function generateQRCode() {
    let input = document.getElementById("websiteInput").value.trim();
    
    const predefinedLinks = {
        "playstore": "https://play.google.com/store",
        "geeksforgeeks": "https://www.geeksforgeeks.org",
        "youtube": "https://www.youtube.com",
        "facebook": "https://www.facebook.com"
    };

    let url;
    if (predefinedLinks[input.toLowerCase()]) {
        url = predefinedLinks[input.toLowerCase()];
    } else if (!input.startsWith("http")) {
        url = "https://www." + input + ".com";
    } else {
        url = input;
    }

    // **Check if URL is safe before generating QR Code**
    let isSafe = await checkURLSafety(url);
    if (!isSafe) {
        alert("⚠️ Warning: This website may be unsafe! QR Code generation is blocked.");
        return;
    }

    let qr = new QRious({
        element: document.createElement("canvas"),
        value: url,
        size: 200
    });

    let qrCodeDiv = document.getElementById("qrcode");
    qrCodeDiv.innerHTML = "";
    qrCodeDiv.appendChild(qr.canvas);

    // **Create a download button**
    let downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download QR";
    downloadBtn.id = "downloadBtn";
    downloadBtn.onclick = function () {
        let link = document.createElement("a");
        link.href = qr.canvas.toDataURL("image/png");
        link.download = "QRCode.png";
        link.click();
    };

    qrCodeDiv.appendChild(downloadBtn);
}
