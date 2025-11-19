document.addEventListener("DOMContentLoaded", () => {
  //  Get DOM Elements
  const galleryContainer = document.getElementById("gallery-container");
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const pageNumberSpan = document.getElementById("page-number");

  // State Variables
  let currentPage = 1;
  const limit = 12;

  //  API Function
  async function fetchImages(page) {
    galleryContainer.innerHTML =
      '<p class="loading-text">Loading images...</p>';
    const apiUrl = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const images = await response.json();

      galleryContainer.innerHTML = "";
      displayImages(images);

      nextButton.disabled = images.length < limit;
    } catch (error) {
      console.error("Error fetching images:", error);
      galleryContainer.innerHTML =
        '<p class="loading-text">Sorry, could not load images.</p>';
    }

    updatePaginationUI();
  }

  // Display Function
  function displayImages(images) {
    if (images.length === 0) {
      galleryContainer.innerHTML =
        '<p class="loading-text">No more images found.</p>';
      return;
    }

    images.forEach((image) => {
      const imgElement = document.createElement("img");
      imgElement.src = image.download_url;
      imgElement.alt = `Photo by ${image.author}`;
      galleryContainer.appendChild(imgElement);
    });
  }

  // Pagination UI Function
  function updatePaginationUI() {
    pageNumberSpan.textContent = currentPage;
    prevButton.disabled = currentPage === 1;
  }

  //  Pagination Event Listeners
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchImages(currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    currentPage++;
    fetchImages(currentPage);
  });

  // Initial Load 
  fetchImages(currentPage); // Fetch the first page of images
});
