import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
// Описаний у документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const preloader = document.querySelector('.preloader');
const loadMoreBtn = document.querySelector('.load-more-button');
const galleryItem = document.querySelector('.gallery-item');

loadMoreBtn.classList.add('hidden');

let currentQuery = '';
let currentPage = 1;
const perPage = 100;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  preloader.style.display = 'flex';
  const searchedValue = searchForm.elements.searchQuery.value.trim();

  if (!searchedValue) {
    iziToast.error({
      message: 'Please, fill the input',
      position: 'topRight',
    });
    preloader.style.display = 'none';
    return;
  }

  if (searchedValue !== currentQuery) {
    currentQuery = searchedValue;
    currentPage = 1;
    galleryContainer.innerHTML = '';
    loadMoreBtn.classList.add('hidden');
  }

  try {
    const data = await fetchImages(searchedValue, currentPage);
    renderGallery(data.hits, galleryContainer);

    if (data.hits.length === 0) {
      loadMoreBtn.classList.add('hidden');
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      searchForm.reset();
      return;
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
    iziToast.error({
      message:
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    preloader.style.display = 'none';
  }
});

function getCardHeight() {
  const card = galleryContainer.querySelector('.gallery-item');
  if (card) {
    const rect = card.getBoundingClientRect();
    return rect.height;
  } else {
    console.error('Element not found.');
    return 0;
  }
}

loadMoreBtn.addEventListener('click', async () => {
  try {
    loadMoreBtn.classList.add('hidden');
    preloader.style.display = 'flex';
    preloader.style.alignItems = 'flex-end';
    currentPage += 1;
    const data = await fetchImages(currentQuery, currentPage);
    renderGallery(data.hits, galleryContainer);
    preloader.style.display = 'none';
    loadMoreBtn.classList.remove('hidden');
    if (currentPage * perPage >= data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }

    setTimeout(() => {
      const cardHeight = getCardHeight();
      if (cardHeight > 0) {
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    }, 0);
  } catch (err) {
    console.log(err);
    preloader.style.display = 'none';
    loadMoreBtn.classList.remove('hidden');
  }
});
