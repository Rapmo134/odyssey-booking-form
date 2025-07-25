// Helper logic for surf school recommendations

export function getPairs(arr: any[]) {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

export function getPackageByTitle(title: string, recommendedPackages: any[]) {
  return recommendedPackages.find(pkg => pkg.title.toLowerCase() === title.toLowerCase());
}

export function getPersonRecommendations(formData: any, recommendedPackages: any[]) {
  const recs: any[] = [];
  // Adult logic
  const adults = formData.adults.filter((a: any) => a.name && a.level);
  const children = formData.children.filter((c: any) => c.name && c.level);

  // Adult Beginner logic
  const beginnerAdults = adults.filter((a: any) => a.level.toLowerCase() === "beginner");
  // 1. Setiap orang dapat Private Lesson & Group Lesson
  beginnerAdults.forEach((a: any) => {
    recs.push({
      people: [a.name],
      type: "adult",
      level: "Beginner",
      pkg: getPackageByTitle("Private Lesson", recommendedPackages)
    });
    recs.push({
      people: [a.name],
      type: "adult",
      level: "Beginner",
      pkg: getPackageByTitle("Group Lesson (2-4 People)", recommendedPackages)
    });
  });
  // 2. Jika jumlah > 1, setiap pasangan dapat Semi Private Lesson
  if (beginnerAdults.length > 1) {
    const pairs = getPairs(beginnerAdults);
    pairs.forEach(pair => {
      recs.push({
        people: [pair[0].name, pair[1].name],
        type: "adult",
        level: "Beginner",
        pkg: getPackageByTitle("Semi Private Lesson", recommendedPackages)
      });
    });
  }
  // Intermediate adults
  adults.filter((a: any) => a.level.toLowerCase() === "intermediate").forEach((a: any) => {
    recs.push({
      people: [a.name],
      type: "adult",
      level: "Intermediate",
      pkg: getPackageByTitle("Intermediate Lesson", recommendedPackages)
    });
  });
  // Children logic
  children.forEach((c: any) => {
    if (c.level.toLowerCase() === "beginner") {
      recs.push({
        people: [c.name],
        type: "children",
        level: "Beginner",
        pkg: getPackageByTitle("Kids Private Lesson", recommendedPackages)
      });
    } else if (c.level.toLowerCase() === "intermediate") {
      recs.push({
        people: [c.name],
        type: "children",
        level: "Intermediate",
        pkg: getPackageByTitle("Surfing Tour", recommendedPackages)
      });
      recs.push({
        people: [c.name],
        type: "children",
        level: "Intermediate",
        pkg: getPackageByTitle("Intermediate Lesson", recommendedPackages)
      });
    }
  });
  return recs.filter(r => r.pkg);
} 