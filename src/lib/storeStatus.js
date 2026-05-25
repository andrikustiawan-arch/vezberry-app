const DAYS = [
    "Ahad",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
];

export function getStoreStatus(settingsOverride = null) {

    try {

        const settings = settingsOverride || null;

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

        const todaySchedule =
            settings.operational_hours?.find(
                (d) =>
                    d.day === todayName
            );

        if (!todaySchedule) {

            return {
                isOpen: false,
                statusText: "TUTUP",
                today: null,
            };

        }

        if (!todaySchedule.is_open) {

            return {
                isOpen: false,
                statusText: "LIBUR",
                today: todaySchedule,
            };

        }

        const now =
            new Date();

        const currentMinutes =
            now.getHours() * 60 +
            now.getMinutes();

        const [openH, openM] =
            todaySchedule.open
                .split(":")
                .map(Number);

        const [closeH, closeM] =
            todaySchedule.close
                .split(":")
                .map(Number);

        const openMinutes =
            openH * 60 + openM;

        const closeMinutes =
            closeH * 60 + closeM;

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

            today:
                todaySchedule,

        };

    } catch (err) {

        console.log(err);

        return {

            isOpen: true,

            statusText: "BUKA",

            today: null,

        };

    }

}