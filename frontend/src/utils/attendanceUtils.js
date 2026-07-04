export function calculateStats(subjectLogs) {
  const total = subjectLogs.length;

  const present = subjectLogs.filter(
      (l) => l.status === "PRESENT" || l.status === "LATE"
  ).length;

  const late = subjectLogs.filter(
      (l) => l.status === "LATE"
  ).length;

  const absent = subjectLogs.filter(
      (l) => l.status === "ABSENT"
  ).length;

  const percentage =
      total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    total,
    present,
    late,
    absent,
    percentage,
  };
}

export function calculateOverallStats(subjects, logs) {

  if (subjects.length === 0) {
    return {
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
      percentage: 0,
    };
  }

  let totalClasses = 0;
  let totalPresent = 0;
  let totalLate = 0;
  let totalAbsent = 0;

  subjects.forEach((subject) => {

    const subjectLogs = logs.filter(
        (log) => log.subject?.id === subject.id
    );

    const stats = calculateStats(subjectLogs);

    totalClasses += stats.total;
    totalPresent += stats.present;
    totalLate += stats.late;
    totalAbsent += stats.absent;

  });

  const percentage =
      totalClasses > 0
          ? Math.round((totalPresent / totalClasses) * 100)
          : 0;

  return {
    total: totalClasses,
    present: totalPresent,
    late: totalLate,
    absent: totalAbsent,
    percentage,
  };
}

export function calculateAttendanceStatus(
    percentage,
    targetPercentage = 75
) {

  if (percentage >= targetPercentage + 5) {
    return "safe";
  }

  if (percentage >= targetPercentage) {
    return "warning";
  }

  return "danger";
}

export function getAttendanceAdvice(
    present,
    total,
    targetPercentage = 75
) {

  if (total === 0) {
    return {
      status: "safe",
      text: "No classes logged yet.",
      value: 0,
      type: "none",
    };
  }

  const percentage = Math.round((present / total) * 100);

  const targetFraction = targetPercentage / 100;

  if (percentage >= targetPercentage) {

    const maxMissed = Math.floor(
        present / targetFraction - total
    );

    if (maxMissed <= 0) {
      return {
        status: "warning",
        text: "On the margin. You cannot miss the next class.",
        value: 0,
        type: "miss",
      };
    }

    return {
      status: "safe",
      text: `You can miss the next ${maxMissed} class${maxMissed > 1 ? "es" : ""} safely.`,
      value: maxMissed,
      type: "miss",
    };

  } else {

    const needed = Math.ceil(
        (targetFraction * total - present) /
        (1 - targetFraction)
    );

    return {
      status: "danger",
      text: `You need to attend the next ${needed} class${needed > 1 ? "es" : ""} to reach ${targetPercentage}%.`,
      value: needed,
      type: "attend",
    };
  }
}

export function formatDate(dateStr) {

  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}