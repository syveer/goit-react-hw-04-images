import axios from 'axios';

const apiKey = '40912398-8d299132deed18abf6d973d7b';
const baseUrl = `https://pixabay.com/api/?key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`;

const fetchImages = async (query, page) => {
  try {
    const response = await axios.get(`${baseUrl}&q=${query}&page=${page}`);
    const newImages = response.data.hits.map(image => ({
      id: image.id,
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      alt: String(image.tags),
    }));
    return newImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export { fetchImages };
