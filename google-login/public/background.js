const CLIENT_ID = encodeURIComponent(
  "290601369459-19et5v76677pj4jlg3ro9t40aul5h0qk.apps.googleusercontent.com"
);
const RESPONSE_TYPE = encodeURIComponent("id_token");
const REDIRECT_URI = encodeURIComponent(
  "https://meogjdillcioeplmngaeckmbbkpkkega.chromiumapp.org"
);
const SCOPE = encodeURIComponent("openid");
const STATE = encodeURIComponent("dxchgv");
const PROMPT = encodeURIComponent("consent");

let user_signed_in = false;

function is_user_signed_in() {
  return user_signed_in;
}

function create_auth_endpoint() {
  let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  let openId_endpoint_url ='https://accounts.google.com/o/oauth2/v2/auth'
  openId_endpoint_url+= `?client_id=${CLIENT_ID}`
  openId_endpoint_url+= `&response_type=${RESPONSE_TYPE}`
  openId_endpoint_url+= `&redirect_uri=${REDIRECT_URI}`
  openId_endpoint_url+= `&scope=${SCOPE}`
  openId_endpoint_url+= `&state=${STATE}`
  openId_endpoint_url+= `&nonce=${nonce}`
  openId_endpoint_url+= `&prompt=${PROMPT}`

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
          if (chrome.runtime.lastError) {
            // problem signing in
            console.log("error");
          } else {
            let id_token = redirect_url.substring(
              redirect_url.indexOf("id_token=") + 9
            );
            id_token = id_token.substring(0, id_token.indexOf("&"));
            const user_info = KJUR.jws.JWS.readSafeJSONString(
              b64utoutf8(id_token.split(".")[1])
            );

            if (
              (user_info.iss === "https://accounts.google.com" ||
                user_info.iss === "accounts.google.com") &&
              user_info.aud === CLIENT_ID
            ) {
              console.log("User successfully signed in.");
              user_signed_in = true;
              chrome.browserAction.setPopup(
                { popup: "./popup-signed-in.html" },
                () => {
                  sendResponse("success");
                }
              );
            } else {
              // invalid credentials
              console.log("Invalid credentials.");
            }
          }
        }
      );

      return true;
    }
  } else if (request.message === "logout") {
    user_signed_in = false;
    chrome.browserAction.setPopup({ popup: "./popup.html" }, () => {
      sendResponse("success");
    });

    return true;
  } else if (request.message === "isUserSignedIn") {
    sendResponse(is_user_signed_in());
  }
});
