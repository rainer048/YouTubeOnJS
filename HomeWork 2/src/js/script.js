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

const data = [
    ['img/thumb_3.webp', 'img/thumb_4.webp', 'img/thumb_5.webp'],
    ['#3 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов',
        '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки Урок 2',
        '#1 Верстка реального заказа landing Page | Марафон вёрстки | Артём Исламов'],
    ['3,6 тыс. просмотров', '4,2 тыс. просмотров', '28 тыс. просмотров'],
    ['X9SmcY3lM-U', '7BvHoh0BrMw', 'mC8JW_aG2EM']
];

more.addEventListener('click', () => {
    const videosWrapper = document.querySelector('.videos__wrapper');
    more.remove();

    for (let i = 0; i < data[0].length; i++) {
        let card = document.createElement('a');
        card.setAttribute('data-url', data[3][i]);
        card.setAttribute('href', '#');
        card.classList.add('videos__item', 'videos__item-active');
        card.innerHTML = `
            <img src="${data[0][i]}" alt="thumb">
            <div class="videos__item-descr">
            ${data[1][i]}
            </div>
            <div class="videos__item-views">
            ${data[2][i]}
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
    }
    sliceTitle('.videos__item-descr', 80);
});

function sliceTitle(selector, count) {
    document.querySelectorAll(selector).forEach( item => {
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
    modal.style.display = 'none';
}

function bindModal(cards) {
    cards.forEach( item => {
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
        stopVideo();
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








