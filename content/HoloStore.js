/**
 * API for storing Holo credentials
 */

const holoStorePopup = new HoloStorePopup();

/**
 * Ask user to confirm that they want to store their credentials.
 * @returns True if user chooses to store creds, false if not.
 */
function displayPopup(creds) {
  return new Promise((resolve) => {
    holoStorePopup.setCreds(creds);
    holoStorePopup.open();

    const closeFunc = () => {
      holoStorePopup.close();
      resolve(false);
    };
    const confirmFunc = () => {
      holoStorePopup.close();
      resolve(true);
    };
    holoStorePopup.closeBtn.addEventListener("click", closeFunc, { once: true });
    holoStorePopup.confirmBtn.addEventListener("click", confirmFunc, { once: true });
  });
}

class HoloStore {
  setCredentials(credentials) {
    return new Promise((resolve) => {
      // TODO: lots of validation checks.
      if (!credentials.unencryptedCreds || !credentials.encryptedCreds) {
        console.log("HoloStore: credentials object missing required keys");
        resolve(false);
      }
      console.log("HoloStore: credentials object has required keys. displaying popup");
      const encryptedCreds = credentials.encryptedCreds;

      displayPopup(credentials).then((storeCreds) => {
        if (storeCreds) {
          chrome.storage.sync.set({ holoCredentials: encryptedCreds }, () => {
            console.log(`HoloStore: Storing credentials`);
            resolve(true);
          });
        } else {
          console.log(`HoloStore: Not storing credentials`);
          holoStorePopup.setCreds(undefined);
          resolve(false);
        }
      });
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
