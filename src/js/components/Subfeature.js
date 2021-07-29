export const renderSubfeature = (puppy) => {
  return `
    <div class="col-md-6 col-lg-4 mb-5">
        <a class="portfolio-item mx-auto" data-puppy-modal="${puppy.id}">
            <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                <div class="portfolio-item-caption-content text-center text-white">
                  <i class="fas fa-plus fa-3x"></i>
                  <div class="w-100">${puppy.name}</div>
                </div>
            </div>
            <img class="portfolio-image" src="${puppy.primary_photo_cropped.medium}" alt="${puppy.name}" />
        </a>
    </div>
  `;
};
