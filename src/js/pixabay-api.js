import axios from 'axios';
import iziToast from 'izitoast';

const perPage = 100;
let loadedImages = 0;

export const fetchImages = (query, page = 1) => {
  const BASE_URL = 'https://pixabay.com';
  const API_KEY = '42410938-e2284def214256f6c05887d1a';
  const URL = `${BASE_URL}/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  return axios
    .get(URL)
    .then(response => {
      const totalHits = response.data.totalHits;

      loadedImages += response.data.hits.length;
      if (loadedImages >= totalHits) {
        return iziToast.info({
          message: `We're sorry, but you've reached the end of search results.`,
          position: 'topRight',
        });
      }
      return response.data.hits;
    })
    .catch(err => {
      console.log(err);
    });
};
