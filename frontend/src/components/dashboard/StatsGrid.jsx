import { useEffect, useState } from "react";
import { lostFoundService } from "../../services/lostFoundService";
import { placementService } from "../../services/placementService";
import { confessionService } from "../../services/confessionService";
import { attendanceService } from "../../services/attendanceService";

function StatsGrid() {

  const [stats, setStats] = useState({
    lostFound: 0,
    confessions: 0,
    experiences: 0,
    attendance: "0%"
  });

  useEffect(() => {

    const loadStats = async () => {

      try {

        const [
          lostItems,
          confessions,
          placements,
          attendance
        ] = await Promise.all([
          lostFoundService.getItems(),
          confessionService.getConfessions(),
          placementService.getExperiences(),
          attendanceService.getSubjects()
        ]);

        const overallAttendance =
            attendance.length === 0
                ? 0
                : Math.round(
                    attendance.reduce((sum, s) => {
                      if (s.totalLectures === 0) return sum;
                      return (
                          sum +
                          (s.attendedLectures / s.totalLectures) * 100
                      );
                    }, 0) / attendance.length
                );

        setStats({
          lostFound: lostItems.length,
          confessions: confessions.length,
          experiences: placements.length,
          attendance: `${overallAttendance}%`
        });

      } catch (error) {
        console.error(error);
      }

    };

    loadStats();

  }, []);

  const data = [
    {
      title: "Lost & Found",
      value: stats.lostFound
    },
    {
      title: "Confessions",
      value: stats.confessions
    },
    {
      title: "Experiences",
      value: stats.experiences
    },
    {
      title: "Attendance",
      value: stats.attendance
    }
  ];

  return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item) => (
            <div
                key={item.title}
                className="glass-card p-6"
            >
              <p className="text-[var(--muted)] text-sm">
                {item.title}
              </p>

              <h3 className="text-4xl font-bold mt-2">
                {item.value}
              </h3>
            </div>
        ))}
      </section>
  );
}

export default StatsGrid;