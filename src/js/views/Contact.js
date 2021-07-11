export default class Contact {
  constructor() {}

  init = () => {
    return new Promise((resolve, reject) => {
      resolve("Contact controller loaded");
    });
  };
}
