const APP_ID = encodeURIComponent(
"xxxx");
const RESPONSE_TYPE = encodeURIComponent("token");
const REDIRECT_URI = encodeURIComponent(
"https://obcapionccamihlpichmndkilpjbdgkc.chromiumapp.org");
const SCOPE = encodeURIComponent("openid");
const STATE = encodeURIComponent("dxchgv");
const PROMPT = encodeURIComponent("consent");

let user_signed_in = false;

function is_user_signed_in() {
  return user_signed_in;
}

function create_auth_endpoint() {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  );

  let openId_endpoint_url = `https://www.facebook.com/dialog/oauth
?app_id=${APP_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${STATE}
&scope=${SCOPE}
&prompt=${PROMPT}
&nonce=${nonce}`;

console.log(openId_endpoint_url);
  return openId_endpoint_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "login") {
    if (user_signed_in) {
      console.log("User is already signed in.");
    } else {
      chrome.identity.launchWebAuthFlow(
        {
          url: create_auth_endpoint(),
          interactive: true,
        },
        function (redirect_url) {
          console.log(redirect_url);
          console.log("Login successful");
          sendResponse("success");

          chrome.action.setPopup({ popup: "./popup-signed-in.html" }, () => {
            sendResponse("success");
            user_signed_in = true;
          });
        }
      );
    }
  } else if (request.message === "logout") {
    user_signed_in = false;
    chrome.action.setPopup({ popup: "./popup.html" }, () => {
      sendResponse("success");
    });

    return true;
  } else if (request.message === "isUserSignedIn") {
    sendResponse(is_user_signed_in());
  }
});
