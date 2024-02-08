import React, { useState, useEffect, useCallback } from 'react';
import Searchbar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import styles from './App.module.css';
import { fetchImages as fetchImagesData } from './Api/Api';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const newImages = await fetchImagesData(query, page);

      if (page === 1) {
        setImages(newImages);
      } else {
        setImages(prevImages => [
          ...prevImages,
          ...newImages.map(image => ({
            ...image,
            alt: image.tags || 'No description available',
          })),
        ]);
      }

      setHasMoreImages(newImages.length === 12);
    } finally {
      setLoading(false);
    }
  }, [query, page, setImages, setHasMoreImages, setLoading]);

  const handleSearch = newQuery => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setLargeImageURL('');
    setShowModal(false);
    setHasMoreImages(true);
    fetchData();
    setLoading(true);
  };

  const handleInitialLoad = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    if (!hasMoreImages) {
      return;
    }

    setPage(prevPage => prevPage + 1);
    setLoading(true);
  }, [hasMoreImages]);

  const handleImageClick = url => {
    setLargeImageURL(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setLargeImageURL('');
    setShowModal(false);
  };

  useEffect(() => {
    const handleInitialLoadAsync = async () => {
      try {
        handleInitialLoad();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    handleInitialLoadAsync();
  }, [handleInitialLoad]);

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSearch} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {hasMoreImages && <Button onClick={handleLoadMore}>Load more</Button>}
      {showModal && (
        <Modal onClose={handleCloseModal} largeImageURL={largeImageURL} />
      )}
    </div>
  );
};

export default App;
