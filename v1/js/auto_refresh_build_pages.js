/**
 * Author: Jakub Andrýsek
 * Email: email@kubaandrysek.cz
 * Website: https://kubaandrysek.cz
 * License: MIT
 * GitHub: https://github.com/JakubAndrysek/mkdocs-auto-refresh-build-pages
 * PyPI: https://pypi.org/project/mkdocs-auto-refresh-build-pages/
 */


// Function to fetch the last-modified header
async function fetchLastModified() {
  const response =
      await fetch(window.location.href, {method: 'HEAD', cache: 'no-store'});
  return response.headers.get('last-modified');
}

// Function to check for updates
async function checkForUpdate() {
  try {
    const latestModified = await fetchLastModified();
    if (!latestModified) {
      console.error('Failed to fetch the last-modified header.');
      return;
    }

    const storedModified = localStorage.getItem('lastModified');
    const popupShown = localStorage.getItem('popupShown');

    // Force show popup for debugging if enabled
    if (false) {
      showUpdatePopup(latestModified);
      return;
    }

    if (storedModified &&
        new Date(storedModified).getTime() !==
            new Date(latestModified).getTime() &&
        !popupShown) {
      showUpdatePopup(latestModified);
    } else {
      localStorage.setItem('lastModified', latestModified);
    }
  } catch (error) {
    console.error('Failed to check for updates:', error);
  }
}

// Function to show the update popup
function showUpdatePopup(latestModified) {
  // Update local storage immediately after showing the popup
  localStorage.setItem('popupShown', 'true');
  localStorage.setItem('lastModified', latestModified);

  const popup = document.createElement('div');
  popup.id = 'update-popup';
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.backgroundColor = 'rgba(0,0,0,0.95)';
  popup.style.fontSize = '18px';
  popup.style.color = 'white';
  popup.style.padding = '20px 30px';
  popup.style.borderRadius = '10px';
  popup.style.zIndex = '10000';
  popup.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
  popup.style.border = '2px solid #007acc';
  popup.style.minWidth = '300px';
  popup.style.textAlign = 'center';
  popup.textContent = 'Návod byl aktualizován, chcete načíst novou verzi?';

  const yesButton = document.createElement('button');
  yesButton.textContent = 'Ano';
  yesButton.style.marginLeft = '10px';
  yesButton.style.marginTop = '15px';
  yesButton.style.padding = '8px 16px';
  yesButton.style.backgroundColor = '#007acc';
  yesButton.style.color = 'white';
  yesButton.style.border = 'none';
  yesButton.style.borderRadius = '5px';
  yesButton.style.cursor = 'pointer';
  yesButton.style.fontSize = '14px';
  yesButton.style.fontWeight = 'bold';
  yesButton.onclick = () => {
    window.location.reload();
  };

  const noButton = document.createElement('button');
  noButton.textContent = 'Ne';
  noButton.style.marginLeft = '10px';
  noButton.style.marginTop = '15px';
  noButton.style.padding = '8px 16px';
  noButton.style.backgroundColor = '#666';
  noButton.style.color = 'white';
  noButton.style.border = 'none';
  noButton.style.borderRadius = '5px';
  noButton.style.cursor = 'pointer';
  noButton.style.fontSize = '14px';
  noButton.style.fontWeight = 'bold';
  noButton.onclick = () => {
    document.body.removeChild(popup);
  };

  popup.appendChild(yesButton);
  popup.appendChild(noButton);
  document.body.appendChild(popup);
}

// Function to update local storage on page load
async function updateLocalStorageOnLoad() {
  try {
    const latestModified = await fetchLastModified();
    if (latestModified) {
      localStorage.setItem('lastModified', latestModified);
      localStorage.removeItem(
          'popupShown');  // Reset the popup shown flag on page load
    }
  } catch (error) {
    console.error('Failed to update local storage on load:', error);
  }
}

// Check for updates every minute
setInterval(checkForUpdate, 60 * 1000);

// Initial check for update when the page loads
checkForUpdate();

// Update local storage with last modified date on page load
updateLocalStorageOnLoad();