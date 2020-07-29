const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
var error_counter = 0;

//Show loading
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

//Hide loading
function hideLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote From API
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

    try {
        //If we error out 10 times, apologize to the user and explain that something isn't working
        if (error_counter >= 10) {
            quoteText.innerText = 'Sorry, something isn\'t working as expected :(';
            authorText.innerText = 'Josh';
            error_counter = 0;
        }

        else {
            const response = await fetch(proxyUrl + apiUrl);
            const data = await response.json();

            //If author is blank, replace with unknown
            if(data.quoteAuthor === '') {
                authorText.innerText = 'Unknown';
            } else {
                authorText.innerText = data.quoteAuthor;
            }
            
            //Reduce font size for long quotes
            if (data.quoteText.length > 50) {
                quoteText.classList.add('long-quote');
            } else {
                quoteText.classList.remove('long-quote');
            }
            quoteText.innerText = data.quoteText;

            //Reset our error counter to 0 every time our program works
            error_counter = 0;
        }
        //Stop loader and show the quote
        hideLoadingSpinner();
    } catch(error) {
        //Every error, we add to our error counter
        error_counter = error_counter + 1;
        getQuote();
        console.log('whoops, no quote', error);
    }
}

//Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

//Event Listeners
twitterBtn.addEventListener('click', tweetQuote);
newQuoteBtn.addEventListener('click', getQuote);

//On Load
getQuote();