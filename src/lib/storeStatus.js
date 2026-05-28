const DAYS = [
    "Ahad",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
];

export function getStoreStatus(
    settingsOverride = null
) {

    try {

        const settings =
            settingsOverride || null;

        if (!settings) {

            return {

                isOpen: true,

                statusText: "BUKA",

                today: null,

            };

        }

        const todayIndex =
            new Date().getDay();

        const todayName =
            DAYS[todayIndex];

        let todaySchedule = null;

        // ====================================
        // SUPPORT ARRAY
        // ====================================

        if (
            Array.isArray(
                settings.operational_hours
            )
        ) {

            todaySchedule =
                settings.operational_hours.find(

                    (d) =>
                        d.day === todayName

                );

        }

        // ====================================
        // SUPPORT OBJECT
        // ====================================

        else if (
            typeof settings.operational_hours ===
            "object"
        ) {

            todaySchedule =
                settings.operational_hours[
                todayName.toLowerCase()
                ];

        }

        if (!todaySchedule) {

            return {

                isOpen: false,

                statusText: "TUTUP",

                today: null,

            };

        }

        // ====================================
        // LIBUR
        // ====================================

        const isEnabled =

            todaySchedule.is_open ??

            todaySchedule.enabled ??

            false;

        if (!isEnabled) {

            return {

                isOpen: false,

                statusText: "LIBUR",

                today: todaySchedule,

            };

        }

        // ====================================
        // CURRENT TIME
        // ====================================

        const now =
            new Date();

        const currentMinutes =

            now.getHours() * 60 +

            now.getMinutes();

        // ====================================
        // OPEN
        // ====================================

        const openValue =

            todaySchedule.open ||

            "00:00";

        const closeValue =

            todaySchedule.close ||

            "23:59";

        if (
            !openValue.includes(":") ||
            !closeValue.includes(":")
        ) {

            return {

                isOpen: false,

                statusText: "TUTUP",

                today: todaySchedule,

            };

        }

        const [openH, openM] =
            openValue
                .split(":")
                .map(Number);

        const [closeH, closeM] =
            closeValue
                .split(":")
                .map(Number);

        const openMinutes =
            openH * 60 + openM;

        const closeMinutes =
            closeH * 60 + closeM;

        // ====================================
        // STATUS
        // ====================================

        const isOpen =

            currentMinutes >=
            openMinutes &&

            currentMinutes <=
            closeMinutes;

        return {

            isOpen,

            statusText:

                isOpen
                    ? "BUKA"
                    : "TUTUP",

            today: todaySchedule,

        };

    } catch (err) {

        console.log(
            "STORE STATUS ERROR:",
            err
        );

        return {

            isOpen: true,

            statusText: "BUKA",

            today: null,

        };

    }

}