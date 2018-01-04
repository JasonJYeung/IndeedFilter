var searchResults = document.getElementsByClassName("sre");
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
    // Create and attach a button to the current candidate entry
    attachButton(currentPerson);
}

// Attach a button to the searchEntry to allow deletion of the entry
function attachButton(searchEntry) {
    var button = document.createElement("button");
    button.innerHTML = "Don't see this entry again";
    searchEntry.appendChild(button);
    button.addEventListener ("click", function(event) {
        saveAndRemove(event);
    });

}

// Take in a searchEntry of a candidate and check if we have already seen candidate.
// If so, delete the entry. Returns the index for the next person we should check.
function matchAndDelete(searchEntry, elemCounter) {
    var elemInnerHTML = searchEntry.innerHTML;
    //var elementID = searchEntry.id;
    var elementID = "gibberish";
    if (elemInnerHTML.includes(elementID)) {
        searchEntry.remove();
        console.log("Deleting Entry");
        return elemCounter;
    } else {
        console.log("No matches found");
        return elemCounter + 1;
    }
}

// Called from a mouse event to delete the clicked button's candidate and add to blacklist
function saveAndRemove(event) {
    console.log(event);
    var currElem = event.path[1];
    // Save the ID of the element that we want to remove
    window.localStorage.setItem(currElem.id, 'true');
    currElem.remove();
}
