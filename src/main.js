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
// const galleryItem = document.querySelector('.gallery-item');
// const widthScrollElement = galleryItem.getBoundingClientRect();
loadMoreBtn.classList.add('hidden');
let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

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
    const images = await fetchImages(searchedValue);
    renderGallery(images, galleryContainer);

    if (images.length === 0) {
      loadMoreBtn.classList.add('hidden');
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      message:
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    preloader.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  loadMoreBtn.classList.add('hidden');
  currentPage += 1;
  preloader.style.display = 'flex';
  preloader.style.alignItems = 'flex-end';

  try {
    const images = await fetchImages(currentQuery, currentPage);
    renderGallery(images, galleryContainer);

    if (images.length === 0) {
      loadMoreBtn.classList.add('hidden');
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (err) {
    iziToast.error({
      message:
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    preloader.style.display = 'none';
  }
});
