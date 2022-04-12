/* worker_wrapper.js */
try {
    importScripts("js/lib/jquery.min.js",
      "js/lib/oAuth.js",
      "js/lib/sha1.js",
      "js/lib/twitter.js",
      "js/background.js");
} catch (e) {
    console.log(e);
}