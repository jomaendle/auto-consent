const SEARCH_KEYWORDS = [
    'accept',
    'akzeptieren',
    'zustimmen',
    'alles zustimmen',
    'accept all',
    'alle akzeptieren',
    'AKZEPTIEREN UND WEITER',
    'accept all cookies',
    'Annehmen',
]

window.onload = function() {
    console.log("Hello World New!");

    setTimeout(() => {
        searchForCookieConsentElements();
    }, 1000)
}

function searchForCookieConsentElements() {
   SEARCH_KEYWORDS.forEach(keyword => {
         const elements = getElementsByText(keyword).filter(element => ['button', 'a', 'form'].includes(element.tagName.toLowerCase()));
         console.log(`Found ${elements.length} elements with keyword ${keyword}`);
         console.log(elements);
         elements.forEach(element => {
              element.click();
         })
   });
}

function getElementsByText(text) {
    const elements = document.getElementsByTagName('*');
    const matches = [];
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
            matches.push(elements[i]);
        }
    }
    return matches;
}