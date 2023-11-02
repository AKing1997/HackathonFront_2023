const apiUrl = 'https://rickandmortyapi.com/api/character';
const searchUrl = 'https://rickandmortyapi.com/api/character/?name=';

const container = document.getElementById('character');
const buttonsContainer = document.getElementById('buttons');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const searchButton = document.getElementById('btnSearch');
const searchInput = document.getElementById('search');
const currentPageText = document.getElementById('currentPage');
const goTopButton = document.getElementById('goTopButton');
const emptyParaf = document.getElementById('empty');

let currentPage = 1;
let prevPageUrl = null;
let nextPageUrl = null;
let searchText = null;

function prevButtonClickHandler() {
    if (prevPageUrl) {
        loadCharacters(prevPageUrl);
    }
}

function nextButtonClickHandler() {
    if (nextPageUrl) {
        loadCharacters(nextPageUrl);
    }
}

prevButton.addEventListener('click', prevButtonClickHandler);
nextButton.addEventListener('click', nextButtonClickHandler);

function loadCharacters(url) {
    buttonsContainer.style.display = 'none';
    emptyParaf.style.display = 'none';
    container.innerHTML = '';
    fetch(url)
        .then(response => {
            if (!response.ok) {
                buttonsContainer.style.display = 'none';
                emptyParaf.style.display = 'block';
                emptyParaf.textContent = `No hay resultados para "${searchText}"`;
                return Promise.reject('Response not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const characters = data.results;
            const info = data.info;
            if (characters.length === 0) {
                emptyParaf.style.display = 'block';
                emptyParaf.textContent = `No hay resultados para "${searchText}"`;
            } else {
                characters.forEach(character => {
                    const characterMainDiv = document.createElement('div');
                    characterMainDiv.classList.add('flip-card');
                    const characterDiv = document.createElement('div');
                    characterDiv.classList.add('flip-card-inner');
                    // Front Card View
                    const frontCard = document.createElement('div');
                    frontCard.classList.add('flip-card-front');
                    frontCard.style.backgroundImage = `url('${character.image}')`;
                    // Character name
                    frontCard.appendChild(createH2(character.name));
                    // Back Card View
                    const backCard = document.createElement('div');
                    backCard.classList.add('flip-card-back');
                    // Character name
                    backCard.appendChild(createH2(character.name));
                    // Character status
                    backCard.appendChild(createParafWithSpan('Estado: ', character.status));
                    // Character species
                    backCard.appendChild(createParafWithSpan('Especies: ', character.species));
                    // Character gender
                    backCard.appendChild(createParafWithSpan('Género: ', character.gender));
                    // Character origin name
                    backCard.appendChild(createParafWithSpan('Origen: ', character.origin.name));
                    // Character episodios
                    backCard.appendChild(createParafWithSpan('Episodio(s): ', character.episode.length));
                    characterDiv.appendChild(frontCard);
                    characterDiv.appendChild(backCard);
                    characterMainDiv.appendChild(characterDiv);
                    container.appendChild(characterMainDiv);
                });
            }
            if (info.pages <= 1) buttonsContainer.style.display = 'none';
            else buttonsContainer.style.display = 'flex';
            currentPage = getCurrentPage(url);
            currentPageText.textContent = `Página ${currentPage} de ${info.pages}`;
            updatePaginationButtons(info);
        })
        .catch(error => {
            console.error('Error al obtener datos de la API:', error);
        });
 }

function getCurrentPage(url) {
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
}

var typingTimer;
var doneTypingInterval = 500; 
searchInput.addEventListener('input', function (e) {
   clearTimeout(typingTimer);
   typingTimer = setTimeout(function () {
       var url = apiUrl;
       if (searchInput.value !== '') {
           searchText = searchInput.value;
           url = searchUrl + searchText;
       }
       loadCharacters(url);
   }, doneTypingInterval);
});

function updatePaginationButtons(info) {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === info.pages;

    prevPageUrl = info.prev;
    nextPageUrl = info.next;
}


window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
        goTopButton.style.display = 'block';
    } else {
        goTopButton.style.display = 'none';
    }
});

goTopButton.addEventListener('click', () => {
    let currentPosition = document.documentElement.scrollTop || document.body.scrollTop;

    const targetPosition = 0;
    const distance = targetPosition - currentPosition;
    const duration = 500;
    const perFrame = distance / (duration / 60);

    function scrollToTop() {
        if (currentPosition <= 0) {
            return;
        }
        currentPosition += perFrame;
        window.scrollTo(0, currentPosition);
        requestAnimationFrame(scrollToTop);
    }

    scrollToTop();
});

function createParafWithSpan(textoSpan, texto) {
    const paraf = document.createElement('p');
    const span = document.createElement('span');
    span.textContent = textoSpan;
    paraf.appendChild(span);
    paraf.appendChild(document.createTextNode(texto));
    return paraf;
}

function createH2(texto) {
    const h2 = document.createElement('h2');
    h2.textContent = texto;
    return h2;
}

loadCharacters(apiUrl);