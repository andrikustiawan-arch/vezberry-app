import { useEffect } from "react";

import {
    useLocation,
} from "react-router-dom";

import {
    pagesConfig,
} from "@/pages.config";

export default function NavigationTracker() {

    const location =
        useLocation();

    const {
        Pages,
        mainPage,
    } = pagesConfig;

    const mainPageKey =
        mainPage ??
        Object.keys(Pages)[0];

    // =========================
    // TRACK PAGE
    // =========================

    useEffect(() => {

        try {

            const pathname =
                location.pathname;

            let pageName;

            // HOME
            if (
                pathname === "/" ||
                pathname === ""
            ) {

                pageName =
                    mainPageKey;

            } else {

                const pathSegment =

                    pathname
                        .replace(/^\//, "")
                        .split("/")[0];

                const pageKeys =
                    Object.keys(Pages);

                const matchedKey =
                    pageKeys.find(

                        (key) =>

                            key.toLowerCase() ===
                            pathSegment.toLowerCase()

                    );

                pageName =
                    matchedKey || "unknown";

            }

            // =========================
            // LOCAL ANALYTICS
            // =========================

            const history =

                JSON.parse(

                    localStorage.getItem(
                        "vezberry_navigation_logs"
                    ) || "[]"

                );

            history.unshift({

                page: pageName,

                path: pathname,

                timestamp:
                    new Date().toISOString(),

            });

            // limit 100 logs
            const limited =
                history.slice(0, 100);

            localStorage.setItem(

                "vezberry_navigation_logs",

                JSON.stringify(limited)

            );

            // console
            console.log(

                `[Navigation] ${pageName}`,

                pathname

            );

            // page title auto
            document.title =

                pageName === mainPageKey

                    ? "VEZBERRY"

                    : `VEZBERRY • ${pageName}`;

        } catch (err) {

            console.log(
                "Navigation tracking error:",
                err
            );

        }

    }, [

        location,

        Pages,

        mainPageKey,

    ]);

    return null;

}