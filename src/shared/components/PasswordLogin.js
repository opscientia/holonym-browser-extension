import React from "react";

function PasswordLogin({ onLoginSuccess }) {
  async function handleLogin(event) {
    function login() {
      return new Promise((resolve) => {
        event.preventDefault();
        const password = event.target.password.value;
        event.target.password.value = "";
        console.log("confirmation popup is sending login message");
        const message = { message: "holoPopupLogin", password: password };
        const callback = (resp) => resolve(resp.success);
        chrome.runtime.sendMessage(message, callback);
      });
    }
    const loginSuccess = await login();
    if (loginSuccess) onLoginSuccess();
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <form id="login-form" onSubmit={handleLogin}>
          <div className="enter-password-label">
            <label>Enter Password</label>
          </div>
          <div>
            <input
              type="text"
              name="password"
              defaultValue="test"
              className="password-input"
            />
          </div>
          <button type="submit" className="submit-password">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default PasswordLogin;
