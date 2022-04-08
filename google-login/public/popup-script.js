let sign=document.querySelector('#sign-in');
sign.addEventListener('click', ()=> {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response === 'success') window.close();
    });
});

let button=document.querySelector('button');
button.addEventListener('click', ()=> {
    chrome.runtime.sendMessage({ message: 'isUserSignedIn' }, function (response) {
        alert(response);
    });
});