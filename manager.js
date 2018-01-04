var searchResults = document.getElementsByClassName("sre");
var keyPrefix = "BlackListID ";
// For each Person in the search results
console.log("Number of candidates: " + searchResults.length);
var resultsList = document.getElementById("results");
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
    attachDeletionButton(currentPerson);
}

// Attach a button to the searchEntry to allow deletion of the entry
function attachDeletionButton(searchEntry) {
    var button = document.createElement("button");
    button.innerHTML = "Don't see this entry again";
    searchEntry.appendChild(button);
    button.addEventListener ("click", function(event) {
        saveAndRemoveEntry(event);
    });

}

// Take in a searchEntry of a candidate and check if we have already seen candidate.
// If so, delete the entry. Returns the index for the next person we should check.
function matchAndDelete(searchEntry, elemCounter) {
    var elemInnerHTML = searchEntry.innerHTML;
    var elementID = searchEntry.id;
    console.log(searchEntry.id);
    // We have the element in the blacklist
    if (window.localStorage.getItem(keyPrefix + elementID) == "true") {
        console.log("Got a match: " + elementID);
        searchEntry.remove();
        console.log("Deleting Entry");
        return elemCounter;
    } else {
        console.log("No match found for " + elementID);
        return elemCounter + 1;
    }
}

// Called from a mouse event to delete the clicked button's candidate and add to blacklist
function saveAndRemoveEntry(event) {
    console.log(event);
    var currElem = event.path[1];
    var appLink = currElem.childNodes[0].childNodes[1].childNodes[0].childNodes[0].href;
    console.log("Full URL: " + appLink);
    var appID = extractID(appLink);
    console.log("ID: " + appID);
    // Save the ID of the element that we want to remove
    console.log("Adding candidate to blacklist: " + appID);
    window.localStorage.setItem(keyPrefix + appID, 'true');
    // window.localStorage.clear();
    console.log(window.localStorage);
    replaceButtonWithUndo(event, appLink);
    currElem.style.opacity = 0.5;
    //currElem.remove();
}

function replaceButtonWithUndo(event, URL) {
    var button = document.createElement("button");
    var personEntry = event.path[1];
    event.path[0].remove();
    button.innerHTML = "Undo Deletion";
    personEntry.appendChild(button);
    button.addEventListener ("click", function(event) {
        //window.open(URL);
        window.localStorage.removeItem(keyPrefix + extractID(URL));
        console.log("Undid deletion, should be null: " + window.localStorage.getItem(keyPrefix + extractID(URL)));
        attachDeletionButton(event.path[1]);
        event.path[1].style.opacity = "";
        event.path[0].remove();
    });
}

// Extract the ID of the candidate from the given URL.
// Assumes that it is in the form of https://www.indeed.com/r/CANDIDATE_NAME/ID?sp=0
function extractID(URL) {
    return URL.slice(URL.lastIndexOf("/") + 1, -5);
}
