await chrome.storage.managed.clear();

chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        void chrome.tabs.create({
            url: "onboarding.html"
        });
    }
});

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (tab) {
        await chrome.tabs.sendMessage(tab.id, {currentTab: tab});
    }
});