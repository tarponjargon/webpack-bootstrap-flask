/* this is how code splitting is achieved without a front-end router.
you add a block for each route (you can use any condition, like
existence of a DOM element), and it will load corresponding view
controller JS.  the webpackPrefetch magic comments handle adding
the "prefetch" resource hints to the DOM */

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
};
export default routes;
