import axios from 'axios';

const perPage = 100;

export const fetchImages = async (query, page = 1) => {
  const BASE_URL = 'https://pixabay.com';
  const API_KEY = '42410938-e2284def214256f6c05887d1a';
  const URL = `${BASE_URL}/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(URL);
    console.log(response.data);

    return response.data;
  } catch (err) {
    console.error('Error fetching images:', err);
    throw err;
  }
};
