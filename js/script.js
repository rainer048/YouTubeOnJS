
const switcher = document.querySelector('#cbx'),
    more = document.querySelector('.more'),
    modal = document.querySelector('.modal'),
    videos = document.querySelectorAll('.videos__item');
let player;



function bindSlideToggle(trigger, boxBody, content, openClass) {
    let button = {
        'element': document.querySelector(trigger),
        'active': false
    };

    const box = document.querySelector(boxBody),
        boxContent = document.querySelector(content);

    button.element.addEventListener('click', () => {
        if (button.active === false) {
            box.style.height = boxContent.clientHeight + 'px';
            box.classList.add(openClass);
        } else {
            box.style.height = 0 + 'px';
            box.classList.remove(openClass);
        }
        button.active = !button.active;
    });
}

bindSlideToggle('.hamburger', '[data-slide="nav"]', '.header__menu', 'slide-active');


function switchMode() {
    if (night === false) {
        document.body.classList.add('night');
        setElementsColor('#FFF');
        document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
    } else {
        document.body.classList.remove('night');
        setElementsColor('#000');
        document.querySelector('.logo > img').src = 'logo/youtube.svg';
    }
    night = !night;
}

function setElementsColor(color) {
    document.querySelectorAll('.hamburger > line').forEach(item => {
        item.style.stroke = color;
    });
    document.querySelectorAll('.videos__item-descr').forEach(item => {
        item.style.color = color;
    });
    document.querySelectorAll('.videos__item-views').forEach(item => {
        item.style.color = color;
    });
    document.querySelector('.header__item-descr').style.color = color;
}

let night = false;
switcher.addEventListener('change', () => {
    switchMode();
});

more.addEventListener('click', () => {
    more.remove();
    gapi.load('client', load);
});

function load() {
    gapi.client.init({
        'apiKey': 'AIzaSyBkqkyzEUho8CZpj8WDVwDqKqEuxQY8fGU',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(() => {
        return gapi.client.youtube.playlistItems.list({
            'part': 'snippet,contentDetails',
            'maxResults': '6',
            'playlistId': 'PLnP4EuRGIgUGVyBXg7OFuN15NSIGnXLCV'
        });
    }).then((response) => {
        console.log(response.result);

        const videosWrapper = document.querySelector('.videos__wrapper');

        response.result.items.forEach(item => {
            let card = document.createElement('a');
            card.setAttribute('data-url', item.contentDetails.videoId);
            card.setAttribute('href', '#');
            card.classList.add('videos__item', 'videos__item-active');
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                ${item.snippet.description}
                </div>
                <div class="videos__item-views">
                21000
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 5);
            bindNewModal(card);
            if (night === true) {
                setElementsColor('#FFF');
            }
        });
        sliceTitle('.videos__item-descr', 80);
    }).catch(e => {
        console.log(e);
    });
}

function search(query) {
    gapi.client.init({
        'apiKey': 'AIzaSyBkqkyzEUho8CZpj8WDVwDqKqEuxQY8fGU',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(() => {
        return gapi.client.youtube.search.list(
            {
                'part': 'snippet',
                'q': `${query}`,
                'maxResults': '6'
            }
        );
    }).then((response) => {
        console.log(response.result);

        const videosWrapper = document.querySelector('.videos__wrapper');

        response.result.items.forEach(item => {
            let card = document.createElement('a');
            card.setAttribute('data-url', item.id.videoId);
            card.setAttribute('href', '#');
            card.classList.add('videos__item', 'videos__item-active');
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                ${item.snippet.description}
                </div>
                <div class="videos__item-views">
                21000
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 5);
            bindNewModal(card);
            if (night === true) {
                setElementsColor('#FFF');
            }
        });
        sliceTitle('.videos__item-descr', 80);
    });
    document.querySelectorAll('.videos__item').forEach(item => {
        item.remove();
    });
    more.remove();
}

document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    gapi.load('client', () => {
        search(document.querySelector('.search > input').value)
    });
    document.querySelector('.search > input').value = '';
});

function sliceTitle(selector, count) {
    document.querySelectorAll(selector).forEach(item => {
        item.textContent.trim();
        if (item.textContent.length > count) {
            item.textContent = item.textContent.slice(0, count + 1) + '...';
        }
    });
}

sliceTitle('.videos__item-descr', 80);

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    stopVideo();
    modal.style.display = 'none';
}

function bindModal(cards) {
    cards.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            loadVideo(item.getAttribute('data-url'));
            openModal();
        });
    });
}

function bindNewModal(card) {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        loadVideo(card.getAttribute('data-url'));
        openModal();
    });
}

bindModal(videos);

modal.addEventListener('click', (e) => {
    if (!e.target.classList.contains('modal__body')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
});

function createPlayer() {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    setTimeout(() => {
        player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: 'bHQqvYy5KYo'
        });
    }, 500);

}

createPlayer();

function loadVideo(id) {
    player.loadVideoById({'videoId': id});
}

function stopVideo() {
    player.stopVideo();
}









