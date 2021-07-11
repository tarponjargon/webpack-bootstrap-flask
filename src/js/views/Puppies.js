export default class Puppies {
  constructor() {}

  init = () => {
    return new Promise((resolve, reject) => {
      resolve("Puppies controller loaded");
    });
  };
}
