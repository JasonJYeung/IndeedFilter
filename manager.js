//var searchResults = document.getElementsByClassName("results-list ember-view");
//console.log(searchResults);
//var resultChildren = searchResults.childElementCount;
//var peopleElements = document.getElementsByClassName("search-result search-result__occluded-item ember-view");
var peopleElements = document.getElementsByClassName("search-result__info pt3 pb4 ph0");
console.log(peopleElements);
// For each Person in the search results
console.log(peopleElements.length);
for (var i = 0; i < peopleElements.length; i++) {
    // The linkedIn URL of the person we are currently examining.
    var innerHTML = peopleElements[i].innerHTML;
    if (innerHTML.includes("/in/ACoAAAawfEQBEVKI-z6lOabBKcACH7iMWAgq6MU/")) {
        console.log("This should be Robert C Chang");
        console.log(innerHTML.includes("Robert"));
    } else {
        console.log("Not Robert C Chang");
    }
    
}
