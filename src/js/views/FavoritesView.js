import Favorite from "../Favorite";

export default class FavoritesView {
  constructor() {
    this.favorite = new Favorite();
  }

  init = () => {
    return new Promise((resolve, reject) => {
      console.log("fav", this.favorite.puppies);
    });
  };
}
