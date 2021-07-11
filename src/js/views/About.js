export default class About {
  constructor() {}

  init = () => {
    return new Promise((resolve, reject) => {
      resolve("About controller loaded");
    });
  };
}
