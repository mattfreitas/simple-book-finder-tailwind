/**
 * Easy Book Finder
 * 
 * Simple application where you search for books using
 * Google API.
 */

/**
 * Section results
 */ 
let resultSection = document.querySelector('#results');

/**
 * HTML holding all of results.
 */
let resultsHolder = document.querySelector('#results-data');

/**
 * Store how much results are being shown.
 */
let currentResultsShown = document.querySelector('#results-shown-only');

/**
 * Store how much results exists with the given query.
 */
let maxResultsShown = document.querySelector('#results-shown-total');

/**
 * Search loading
 */
let searchLoading = document.querySelector('#loading-search');

/**
 * Search input handler.
 */
let searchInput = document.querySelector('#search-query');
searchInput.addEventListener('keydown', searchInputEnter);

/**
 * Search button handler.
 */
let searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', performSearch);

/**
 * Store the search results.
 */
let searchResults;

/**
 * Listen to ENTER KEY press and call search.
 * @return {Void}
 */
function searchInputEnter(e) {
    let key = e.which || e.keyCode;

    if(key == 13) {
        search(searchInput.value)
    }

    return;
}

/**
 * Search for a book using Google API.
 * 
 * @param {string} query - Search books using this query
 * @returns {Void} 
 */
function search(query) {
    searchLoading.classList.remove('opacity-0');
    
    let url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=15`;
    
    let results = fetch(url).then(function(response) {
        return response.json()
    }).then(function(response) {
        searchResults = response;

        updateSearchResults(response.items);

        updateResultsInformation({
            current: 15,
            max: response.totalItems
        })

        searchLoading.classList.add('opacity-0');
        resultSection.classList.remove('hidden');
    });
}

/**
 * Updates the search results with the given data of Google API.
 * @param {Array} data - Array containing all books information.
 */
function updateSearchResults(data) {
    resultsHolder.innerHTML = ''; // Clean the HTML

    data.forEach(function(item) {
        let price;
        let volume = item.volumeInfo;
        let sale = item.saleInfo;
        let images = volume.imageLinks || { thumbnail: 'https://via.placeholder.com/128x182' };
        let publisher = volume.publisher;
        let publishedDate = volume.publishedDate || 'Desconhecido';
        let authors = volume.authors || ['Desconhecido'];
        let buyLink = sale.buyLink || 'loja-nao-encontrada';
        let templateViewMore = '', templatePricing = '';

        if(typeof sale.listPrice != 'undefined') {
            price = sale.saleability == 'FREE' ? 'Grátis':`R$ ${ sale.listPrice.amount }`;
        } else {
            price = sale.saleability == 'FREE' ? 'Grátis':'Desconhecido';
        }

        // If item has a price we shall show it
        if(price != 'Desconhecido') {
            templateViewMore = `
            <a href="${ buyLink }" class="flex flex-row hover:text-gray-600 text-black" target="_blank">
                Ver detalhes
                <svg class="ml-2" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
            `;

            templatePricing = `
                <span class="float-left mt-1  mr-2 bg-green-100 text-green-700 uppercase text-xs px-3 py-1 rounded font-semibold inline-block">${ price }</span>
            `;
        } else {
            templateViewMore = `
            <span target="_blank">
                Loja não encontrada
            </span>
            `;
        }

        // Each item will be used this template
        resultsHolder.innerHTML += `
            <div class="result-item">
                <div class="thumbnail-holder">
                    <img class="rounded" src="${ images.thumbnail }">
                </div>
                <div class="flex flex-col pl-8">
                    <div class="text-lg mb-4">
                        ${ templatePricing }
                        <span class="float-left mt-1">${ volume.title }</span>
                    </div>
                    <ul class="text-gray-800 text-sm mb-4">
                        <li class="mb-2">Autor: <span class="text-gray-500">${ authors }</span></li>
                        <li class="mb-2">Distribuidora: <span class="text-gray-500">${ publisher || 'Desconhecida' }</span></li>
                        <li class="mb-2">Publicação: <span class="text-gray-500">${ publishedDate }</span></li>
                    </ul>
                    ${ templateViewMore }
                </div>
            </div>
        `;
    });
}

/**
 * Updates the search results information like how many results are being retrieved.
 * 
 * @param {Object} params - How much shown results will be shown. Params: current|max
 * @return {Void}
 */
function updateResultsInformation(params) {
    currentResultsShown.innerHTML = params.current;
    maxResultsShown.innerHTML = params.max;
    return;
}

/**
 * Get user inputed data and search for a given query.
 */
function performSearch() {
    return search(searchInput.value);
}
