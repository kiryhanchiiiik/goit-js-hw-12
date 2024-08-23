import SimpleLightbox from 'simplelightbox';

let simpleLightbox;

export function renderGallery(images, container) {
  const markup = images
    .map(image => {
      return `
      <li class="gallery-item">
        <a href="${image.largeImageURL}" class="gallery-link">
          <img src="${image.webformatURL}" alt="${image.tags}" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${image.likes}</p>
          <p class="info-item"><b>Views</b> ${image.views}</p>
          <p class="info-item"><b>Comments</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
        </div>
      </li>
      `;
    })
    .join('');

  container.insertAdjacentHTML('beforeend', markup);

  if (!simpleLightbox) {
    simpleLightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionsDelay: 200,
    });
  } else {
    simpleLightbox.refresh();
  }
}
