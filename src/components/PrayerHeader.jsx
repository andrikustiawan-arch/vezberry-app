import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock3,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon
} from "lucide-react";

// ===============================
// ICON
// ===============================
const prayerIcons = {
  Subuh: Sunrise,
  Dzuhur: Sun,
  Ashar: CloudSun,
  Maghrib: Sunset,
  Isya: Moon,
};

// ===============================
// PARSE TIME
// ===============================
const parseTime = (timeStr) => {

  if (!timeStr) return null;

  const clean =
    timeStr.split(" ")[0];

  const [h, m] =
    clean.split(":").map(Number);

  const d = new Date();

  d.setHours(
    h,
    m,
    0,
    0
  );

  // Kurangi 1 menit
  d.setMinutes(
    d.getMinutes() - 1
  );

  return d;
};

// ===============================
// FORMAT
// ===============================
const formatTime = (d) => {
  if (!d) return "--:--";
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatClock = (d) =>
  d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

const formatCountdown = (ms) => {
  if (!ms || ms <= 0) return "-";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h} jam ${m} menit`;
};

// ===============================
// COMPONENT
// ===============================
export default function PrayerWidget() {

  const [times, setTimes] = useState(null);
  const [now, setNow] = useState(new Date());

  const fetchData = async () => {

    try {

      const res = await fetch(
        "https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=11&tune=2,2,2,2,2,2,2,2,2"
      );

      const data =
        await res.json();

      setTimes(
        data.data.timings
      );

    } catch (err) {

      console.error(
        "PRAYER FETCH ERROR",
        err
      );

    }

  };

  useEffect(() => {

    fetchData();

    const refresh =
      setInterval(
        fetchData,
        60 * 60 * 1000
      );

    return () =>
      clearInterval(refresh);

  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const getState = () => {
    if (!times) return null;

    const schedule = [
      { name: "Subuh", time: parseTime(times.Fajr) },
      { name: "Dzuhur", time: parseTime(times.Dhuhr) },
      { name: "Ashar", time: parseTime(times.Asr) },
      { name: "Maghrib", time: parseTime(times.Maghrib) },
      { name: "Isya", time: parseTime(times.Isha) },
    ].filter(item => item.time);

    for (let i = 0; i < schedule.length - 1; i++) {
      const start = schedule[i].time;
      const end = schedule[i + 1].time;

      if (now >= start && now < end) {
        return {
          schedule,
          index: i,
          start,
          end,
          current: schedule[i],
          next: schedule[i + 1]
        };
      }
    }

    const last = schedule[schedule.length - 1];
    const first = schedule[0];

    const nextDay = new Date();

    nextDay.setHours(
      first.time.getHours(),
      first.time.getMinutes(),
      0,
      0
    );

    if (nextDay <= now) {
      nextDay.setDate(
        nextDay.getDate() + 1
      );
    }

    return {
      schedule,
      index: schedule.length - 1,
      start: last.time,
      end: nextDay,
      current: last,
      next: first
    };
  };

  const prayer = getState();

  // =====================================
  // LOADING
  // =====================================

  if (!prayer) {

    return (

      <div className="px-4 md:px-6 lg:px-8 mt-0.5">

        <div className="
        max-w-7xl
        mx-auto
        p-3
        text-center
        text-sm
        bg-slate-200
        rounded-xl
      ">

          Loading waktu sholat...

        </div>

      </div>

    );

  }

  // =====================================
  // DEBUG
  // =====================================

  const hoursLeft =
    (
      prayer.end - now
    ) / 3600000;

  if (
    import.meta.env.DEV
  ) {

    console.log(
      "[PRAYER DEBUG]",
      {

        current:
          prayer.current.name,

        next:
          prayer.next.name,

        start:
          prayer.start,

        end:
          prayer.end,

        hoursLeft

      }
    );

  }

  // =====================================
  // PROGRESS
  // =====================================

  const duration =
    prayer.end - prayer.start;


  const progress =
    duration > 0
      ? Math.min(
        1,
        Math.max(
          0,
          (now - prayer.start) /
          duration
        )
      )
      : 0;

  let diff =
    prayer.end - now;

  if (diff < 0) {
    diff = 0;
  }

  const hours =
    diff / 3600000;

  if (
    hours > 12 ||
    hours < 0
  ) {

    console.warn(
      "[PRAYER WARNING]",
      {
        current:
          prayer.current.name,

        next:
          prayer.next.name,

        start:
          prayer.start,

        end:
          prayer.end,

        hours
      }
    );

  }

  if (hours > 12) {

    console.error(
      "[PRAYER INVALID COUNTDOWN]",
      {
        current:
          prayer.current.name,

        next:
          prayer.next.name,

        start:
          prayer.start,

        end:
          prayer.end,

        hours
      }
    );

  }

  const remaining =
    formatCountdown(diff);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-0.5">

      <motion.div
        className="
          max-w-7xl mx-auto
          rounded-2xl
          px-5 py-3
          text-white
          shadow-lg
          bg-[linear-gradient(270deg,#fb923c,#f472b6,#a855f7,#fb7185,#6366f1,#2dd4bf,#22d3ee,#3b82f6)]
          bg-[length:400%_400%]
        "
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock3 size={24} />
            <span className="text-lg font-bold">
              {prayer.current.name}
            </span>
          </div>

          <div className="text-lg font-mono">
            {formatClock(now)}
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="mt-0.5 text-center">
          <p className="text-blue-900 font-extrabold text-lg drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
            ± {remaining} menuju {prayer.next.name}
          </p>
        </div>

        {/* BAR */}
        <div className="mt-0.5 flex items-center">

          {prayer.schedule.map((item, i) => {
            const Icon = prayerIcons[item.name];
            const isActive = i === prayer.index;

            return (
              <React.Fragment key={item.name}>

                {/* ICON */}
                <div className="flex flex-col items-center w-24 text-center">

                  <Icon
                    size={isActive ? 32 : 26}
                    className={isActive ? "text-yellow-300" : ""}
                  />

                  <span className="text-[14px] mt-0.5 font-semibold">
                    {item.name}
                  </span>

                  <span className="text-xs font-bold">
                    {formatTime(item.time)}
                  </span>

                </div>

                {/* BAR */}
                {i < prayer.schedule.length - 1 && (
                  <div className="flex-1 h-6 mx-1 bg-white/30 rounded-full relative overflow-hidden">

                    {isActive && (
                      <>
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-blue-900"
                          animate={{
                            width: `${progress * 100}%`
                          }}
                          transition={{
                            ease: "linear",
                            duration: 0.5
                          }}
                        />

                        <motion.div
                          className="
                            absolute top-1/2 -translate-y-1/2
                            w-3 h-3 rounded-full bg-white
                          "
                          animate={{
                            left: `${progress * 100}%`
                          }}
                          transition={{
                            ease: "linear",
                            duration: 0.5
                          }}
                        />
                      </>
                    )}

                  </div>
                )}

              </React.Fragment>
            );
          })}

        </div>

      </motion.div>

    </div>
  );
}