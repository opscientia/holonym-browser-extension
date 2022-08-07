/**
 * API for storing Holo credentials
 */

const holoStorePopup = new HoloStorePopup();

function displayPopup(creds) {
  return new Promise((resolve) => {
    holoStorePopup.setCreds(creds);
    holoStorePopup.open();
    holoStorePopup.closeBtn.addEventListener("click", () => holoStorePopup.close(), { once: true });
    resolve();
  });
}

class HoloStore {
  setCredentials(credentials) {
    // TODO: lots of validation checks.
    // TODO: popup that asks, "Are you sure you want to store this?"
    chrome.storage.sync.set({ holoCredentials: credentials }, () => {
      console.log(`HoloStore: Set credentials`);
    });
  }

  getCredentials() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(["holoCredentials"], (creds) => {
        console.log("HoloStore: holoCredentials...");
        console.log(creds);

        // TODO: Delete the following line. Move it to setCredentials
        displayPopup({ encryptedCreds: creds?.holoCredentials });

        resolve(creds?.holoCredentials);
      });
    });
  }
}
/**
 * @param {string} credentials An encrypted string.
 */
function injectCredentials(credentials) {
  if (!credentials) {
    return;
  }
  const credsEl = document.getElementById("injected-holonym-creds");
  if (credsEl) {
    credsEl.textContent = credentials;
  } else {
    const credsEl = document.createElement("div");
    credsEl.textContent = credentials;
    credsEl.style.visibility = "hidden";
    credsEl.style.bottom = "-10px";
    credsEl.id = "injected-holonym-creds";
    document.body.appendChild(credsEl);
  }
}

/**
 * Store creds scheme:
 * - Require unencrypted creds object and encrypted creds object
 * - Perform checks on unencrypted creds.
 *    - Check that server signature is valid
 *    - Check that all keys are present
 */
