/* this is how code splitting is achieved when routes are handled on the server.
You add a block for each route (tho you can use any condition, like
existence of a DOM element), and it will dynamically load the corresponding
module.  the webpackPrefetch magic comments handle adding
the "prefetch" resource hints to the DOM, so it should lazily cache the entire
app on the first load

Note I use multiple "if" rather than switch or else if, because it allows for multiple views
to be loaded on a single page.

*/

const routes = async () => {
  const pathname = window.location.pathname;
  if (pathname === "/") {
    const mod = await import(/* webpackPrefetch: true */ "./views/Home");
    return await new mod.default().init();
  }
  if (pathname === "/about") {
    const mod = await import(/* webpackPrefetch: true */ "./views/About");
    return await new mod.default().init();
  }
  if (pathname === "/contact") {
    const mod = await import(/* webpackPrefetch: true */ "./views/Contact");
    return await new mod.default().init();
  }
  if (pathname === "/puppies") {
    const mod = await import(/* webpackPrefetch: true */ "./views/Puppies");
    return await new mod.default().init();
  }
  if (pathname.startsWith("/puppy/")) {
    const mod = await import(/* webpackPrefetch: true */ "./views/Puppy");
    return await new mod.default().init();
  }
  if (pathname === "/favorites") {
    const mod = await import(/* webpackPrefetch: true */ "./views/FavoritesView");
    return await new mod.default().init();
  }
};
export default routes;
