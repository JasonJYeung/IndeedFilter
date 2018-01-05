//window.localStorage.clear();
var searchResults = document.getElementsByClassName("sre");
var keyPrefix = "BlackListID ";
var buttonDurations = [Number.MAX_SAFE_INTEGER, 0.00000001, 30, 183, 365, 730];
// For each Person in the search results
console.log("Number of candidates: " + searchResults.length);
var resultsList = document.getElementById("results");
var currentTime = Math.round(new Date().getTime()/1000.0);
console.log(currentTime);
for (var i = 0; i < searchResults.length;) {
    // Check if the current person is blacklisted. If so, delete entry
    i = matchAndDelete(searchResults[i], i);
}
console.log("New length of Search Results after deleting matches: " + searchResults.length);
// Attach buttons to all remaining entries
for (var i = 0; i < searchResults.length; i++) {
    //The linkedIn URL of the person we are currently examining.
    var currentPerson = searchResults[i];
    // Create and attach a entry specific deletion button to the current candidate entry
    attachDeletionButtons(currentPerson, buttonDurations);
}

// Attach a button to the searchEntry to allow deletion of the entry
function attachDeletionButtons(searchEntry, buttonDurations) {
    var buttonCollection = document.createElement("buttonCollection");
    searchEntry.appendChild(buttonCollection);
    for (var i = 0; i < buttonDurations.length; i++) {
        var button = document.createElement("button");
        var duration = buttonDurations[i];
        button.expiration = expirationDate(duration);
        // TODO: Convert days to months/years more nicely
        if (duration == Number.MAX_SAFE_INTEGER) {
            button.innerHTML = "Permanently Hide Entry";
        } else {
            button.innerHTML = "Hide for " + buttonDurations[i] + " days";
        }
        buttonCollection.appendChild(button);
        button.addEventListener ("click", function(event) {
            saveAndRemoveEntry(event);
        });

    }
}

// Takes in the current time in Unix time and timeoutDuration in days
// Returns the unix time expiration date
function expirationDate(timeoutDuration) {
    if (timeoutDuration == Number.MAX_SAFE_INTEGER) {
        return Number.MAX_SAFE_INTEGER;
    } else {
        var msPerDay = 86400;
        console.log("Adding to current time: " + Math.round((msPerDay * timeoutDuration)));
        console.log("Current time:           " + currentTime);
        return currentTime + Math.round((msPerDay * timeoutDuration));
    }
}

// Take in a searchEntry of a candidate and check if we have already seen candidate.
// If so, delete the entry. Returns the index for the next person we should check.
function matchAndDelete(searchEntry, elemCounter) {
    var elemInnerHTML = searchEntry.innerHTML;
    var elementID = searchEntry.id;
    var storageItem = window.localStorage.getItem(keyPrefix + elementID);
    // We have the element in the blacklist
    if (storageItem) {
        // The element hasn't expired yet, we need to hide it
        console.log("Expiration time: " + storageItem);
        console.log("CurrentTime:     " + currentTime);
        if (storageItem > currentTime) {
            console.log("Got a match: " + elementID);
            searchEntry.remove();
            console.log("Deleting Entry");
            return elemCounter;
        } else {
            // The element's TTL has expired. Delete it from the storage and display it again
            window.localStorage.removeItem(keyPrefix + elementID);
            console.log("ID was previously hidden, TTL expired: " + elementID);
        }
    }
    console.log(elementID);
    return elemCounter + 1;
}

// Called from a mouse event to delete the clicked button's candidate and add to blacklist
function saveAndRemoveEntry(event) {
    console.log(event);
    var currElem = getPersonEntryFromEvent(event);
    var appLink = currElem.childNodes[0].childNodes[1].childNodes[0].childNodes[0].href;
    console.log("Full URL: " + appLink);
    var appID = extractID(appLink);
    console.log("ID: " + appID);
    // Save the ID of the element that we want to remove
    console.log("Adding candidate to blacklist: " + appID);
    var button = getButtonFromEvent(event);
    window.localStorage.setItem(keyPrefix + appID, button.expiration);
    console.log(window.localStorage);
    replaceButtonWithUndo(event, appLink);
    currElem.style.opacity = 0.5;
}

// Given a mouse button click event, return the button that was pressed.
function getButtonFromEvent(event) {
    return event.path[0];
}

// Given a mouse button click event, returns the search result it was attached to
function getPersonEntryFromEvent(event) {
    return event.path[2];
}

function replaceButtonWithUndo(event, URL) {
    var button = document.createElement("button");
    var buttonCollection = event.path[1];
    var buttonCollectionNodes = event.path[1].childNodes;
    while (buttonCollectionNodes.length != 0) {
        buttonCollectionNodes[0].remove();
    }
    button.innerHTML = "Undo Deletion";
    buttonCollection.appendChild(button);
    button.addEventListener ("click", function(event) {
        //window.open(URL);
        window.localStorage.removeItem(keyPrefix + extractID(URL));
        console.log("Undid deletion, should be null: " + window.localStorage.getItem(keyPrefix + extractID(URL)));
        event.path[1].remove();
        attachDeletionButtons(event.path[2], buttonDurations);
        event.path[2].style.opacity = "";
        //event.path[0].remove();
    });
}

// Extract the ID of the candidate from the given URL.
// Assumes that it is in the form of https://www.indeed.com/r/CANDIDATE_NAME/ID?sp=0
function extractID(URL) {
    return URL.slice(URL.lastIndexOf("/") + 1, -5);
}
