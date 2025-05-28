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
  popup.style.bottom = '10px';
  popup.style.left = '10px';
  popup.style.backgroundColor = 'rgba(0,0,0,0.9)';
  popup.style.fontSize = '16px';
  popup.style.color = 'white';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000';
  popup.textContent = 'Návod byl aktualizován, chcete načíst novou verzi?';

  const yesButton = document.createElement('button');
  yesButton.textContent = 'Ano';
  yesButton.style.marginLeft = '10px';
  yesButton.style.color = 'white';
  yesButton.onclick = () => {
    window.location.reload();
  };

  const noButton = document.createElement('button');
  noButton.textContent = 'Ne';
  noButton.style.marginLeft = '10px';
  noButton.style.color = 'white';
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