export const renderModal = (puppy) => {
  return `
    <h2 class="portfolio-modal-title text-white text-uppercase mb-0" id="modal-title">${
      puppy.name
    }</h2>
    <div class="divider-custom text-white">
      <div class="divider-custom-line"></div>
      <div class="divider-custom-icon"><i class="fas fa-paw"></i></div>
      <div class="divider-custom-line"></div>
    </div>
    <img class="img-fluid rounded mb-5" src="${puppy.primary_photo_cropped.full}" alt="${
    puppy.name
  }" />
    <p class="mb-4 text-white">${puppy.description ? puppy.description : ""}</p>
    <a role="button" class="btn btn-primary btn-xl" href="/puppy/${puppy.id}">
      Read More <i class="fas fa-arrow-right fa-fw"></i>
    </a>
  `;
};
