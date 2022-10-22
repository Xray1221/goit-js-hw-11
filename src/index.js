import axios from "axios";
import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import createImageCardsMarkup from "./createImageCardsMarkup";

const refs = {
    galleryContainer: document.querySelector('.gallery'),
    searchForm: document.querySelector('#search-form'),
    loadMore: document.querySelector('.load-more')
};

let page = 1;
hideLoadMore();
var lightbox = new SimpleLightbox('.gallery a');

const getImages = async (searchString, page) => {
    const images = (await axios('https://pixabay.com/api/', {params: {
        key: '30779155-f5a839bf4d4e28d8eacf13ca8', 
        q: searchString,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page
    }})).data;

    return await images;
}

refs.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    refs.galleryContainer.innerHTML = '';
    page = 1;
    const serachValue = event.target.querySelector('input[name="searchQuery"]').value;
    loadImage(serachValue, page);
});

refs.loadMore.addEventListener('click', (event) => {
    event.preventDefault();
    const serachValue = refs.searchForm.querySelector('input[name="searchQuery"]').value;
    page++;
    loadImage(serachValue, page);
})

function loadImage(serachValue, page) {
    hideLoadMore();
    getImages(serachValue, page).then((images) => {
        if(images.length === 0) {
            Notify.info('Sorry, there are no images matching your search query. Please try again.');
        }else if(page * images.hits.length > images.totalHits) {
            Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
        }

        if(page === 1) {
            Notify.success(`Hooray! We found ${images.totalHits} images.`)
        }

        const imagesMarkup = createImageCardsMarkup(images.hits);
        refs.galleryContainer.insertAdjacentHTML('beforeend', imagesMarkup);
        showLoadMore();
        lightbox.refresh();
    });
}

function hideLoadMore() {
    refs.loadMore.style.display = 'none';
}

function showLoadMore() {
    refs.loadMore.style.display = 'block';
}