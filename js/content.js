const GERMAN_KEYWORDS = [
    'accept',
    'akzeptieren',
    'zustimmen',
    'alles zustimmen',
    'alle akzeptieren',
    'AKZEPTIEREN UND WEITER',
    'Annehmen',
    'Einverstanden'
];

const ENGLISH_KEYWORDS = [
    'accept all',
    'accept all cookies',
    'accept and continue',
    'allow',
    'allow all cookies'
]

const SEARCH_KEYWORDS = [...GERMAN_KEYWORDS, ...ENGLISH_KEYWORDS];

let isInitialized = false;

chrome.runtime.onMessage.addListener(() => {
    if (isInitialized) {
        chrome.storage.sync.set({'currentHostname': location.hostname}, () => {
            console.info('💾 Host name saved.', location.hostname);
        });
    } else {
        console.info('Not yet initialized. Host name not saved.')
    }
})

window.onload = function() {
    chrome.storage.sync.get(['currentHostname'], (items) => {
        if (items['currentHostname'] === location.hostname) {
            console.info('✅ Same hostname, skip Cookie check.', location.hostname);
            isInitialized = true;

            return;
        }

        console.log('🔎 Searching for Cookie Banners...');
        searchForCookieConsentElements();
        isInitialized = true;
    });
}

function searchForCookieConsentElements() {
   SEARCH_KEYWORDS.forEach(keyword => {
       let hasElements;
       let hasClickedOnElements = false;

       const elements = getElementsByText(keyword).filter(element => ['button', 'a', 'form'].includes(element.tagName.toLowerCase()));
       hasElements = elements.length > 0;

       if (hasElements) {
           elements.forEach(element => {
               element.click();
               hasClickedOnElements = true;
               console.info('Element clicked: ', element);
           })
       }

       if (!hasElements || !hasClickedOnElements) {
           const iframeDocuments = getAllIframeDocuments();

           if (iframeDocuments.length > 0) {
               console.info('iFrame found!');

            const elements = iframeDocuments.map(iframeDocument => getElementsByText(keyword, iframeDocument).filter(element => ['button', 'a', 'form'].includes(element.tagName.toLowerCase())));

               if (elements.length > 0) {
                   elements.forEach(element => {
                       element.click();
                       hasClickedOnElements = true;
                       console.info('iFrame Element clicked: ', element);
                   })
               }
           }
       }

   });
}

function getElementsByText(text, iframeDocument) {
    const elements = (iframeDocument ?? document).getElementsByTagName('*');
    const matches = [];
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
            matches.push(elements[i]);
        }
    }

    return matches;
}

function getAllIframeDocuments() {
    const iframes = document.querySelectorAll('iframe');
    let result = []

    if (iframes.length > 0) {
        result = Array.from(iframes).map(i => i.contentDocument || i.contentWindow.document)
    }

    return result;
}