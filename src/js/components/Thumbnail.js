export const puppyImage = (puppy, size = "medium") => {
  let src = CFG.defaultImage;
  try {
    src = puppy.primary_photo_cropped[size];
  } catch (e) {}
  return src;
};

export const renderThumbnail = (puppy) => {
  return `
    <div class="col-12 col-md-6 col-lg-4 col-xl-3 text-center pb-5">
      <div class="card-box h-100 position-relative">
        <button
          class="favorite-container"
          title="Remove from favorites :("
        >
          <div
            class="favorite pt-1 text-danger"
            data-favorite="${puppy.id}"
          >
            <i class="fas fa-heart"></i>
          </div>
        </button>
        <div class="card-thumb-container">
          <div class="card-thumbnail">
            <a href="/puppy/${puppy.id}">
              <img
                src="${puppyImage(puppy)}"
                class="custom-img-fluid"
                alt="${puppy.name}"
              >
              </a>
          </div>
        </div>
        <div class="card-foot">
          <div class="card-title">
            <h2>
              <a href="/puppy/${puppy.id}">
              ${puppy.name} -
              ${puppy.contact.address.city},
              ${puppy.contact.address.state}
              </a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  `;
};
