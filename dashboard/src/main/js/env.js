/*
 * redefine theese variables at production environment, or use 
 * oc secret new
 *
 */
(function (window) {
  window.__env = window.__env || {};

  window.__env.EDC_USERNAME = '';
  window.__env.EDC_PASSWORD = '';
  window.__env.EDC_REST_ENDPOINT = 'https://api-sandbox.everyware-cloud.com/v2';
  window.__env.JDG_REST_ENDPOINT = 'http://localhost:8080/dgproxy/rest';
  window.__env.GOOGLE_MAPS_API_KEY: '';
  window.__env.DEMO_ASSET: 'demo-gw-vm'
}(this));
