import { createRouter, createWebHashHistory, Router } from "vue-router";
import VueRouteConfig from "./Config";

export const router = function (config: typeof VueRouteConfig): Router {
    config.title && (document.title = config.title);

    return createRouter({
        history: createWebHashHistory(),
        routes: config.routes,
    });
};
