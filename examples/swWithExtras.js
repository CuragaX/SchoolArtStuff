/**
 * @type {string}
 */
const dirToAeroConfig = "/aero/";
/**
 * @description From the aero SDK
 * @type {string}
 */
const pathToPatchedAerohandler = "./aeroHandleSimple.js";

importScripts(`${dirToAeroConfig}config.aero.js`);
importScripts(aeroConfig.bundle["bare-mux"]);
importScripts(aeroConfig.bundle.handle);

importScripts(pathToPatchedAerohandler);

const aeroHandlerWithExtras = patchAeroHandler(handle);

addEventListener("install", skipWaiting);

addEventListener("fetch", ev => ev.respondWith(aeroHandlerWithExtras(ev)));
