d3.csv(
  "https://raw.githubusercontent.com/CCin188/Spot_Category/refs/heads/CCin188-patch-1/travel_destinations.csv"
).then((res) => {
  drawBarchart(res);
});
function mapCategory(cat) {
  cat = cat.toLowerCase();
  //Culture
  if (
    cat.includes("culture") ||
    cat.includes("history") ||
    cat.includes("pandas") ||
    cat.includes("temples") ||
    cat.includes("modern architecture") ||
    cat.includes("city wall")
  )
    return "culture";
  //Food
  if (
    cat.includes("food") ||
    cat.includes("tea houses") ||
    cat.includes("dim sum")
  )
    return "food";
  //Shopping
  if (cat.includes("shopping")) return "shopping";
  //Nightlife
  if (cat.includes("nightlife")) return "nightlife";
  //Nature
  if (
    cat.includes("landmarks") ||
    cat.includes("palaces") ||
    cat.includes("hiking")
  )
    return "nature";
  return "other";
}

function drawBarchart(res) {
  const chinaData = res.filter((d) => d.Country === "China");

  let allCategories = [];

  chinaData.forEach((d) => {
    if (d.Category) {
      const cats = d.Category.split(",").map((c) => c.trim());
      cats.forEach((c) => {
        allCategories.push(mapCategory(c));
      });
    }
  });

  const categoryCountMap = d3.rollup(
    allCategories,
    (v) => v.length,
    (c) => c
  );

  let categories = Array.from(categoryCountMap.keys());
  let counts = Array.from(categoryCountMap.values());

  const customOrder = [
    "food",
    "culture",
    "shopping",
    "nightlife",
    "nature",
    "other",
  ];

  const sorted = customOrder
    .filter((cat) => categories.includes(cat))
    .map((cat) => ({
      category: cat,
      count: categoryCountMap.get(cat) ?? 0,
    }));

  categories = sorted.map((d) => d.category);
  counts = sorted.map((d) => d.count);

  const trace1 = {
    x: categories,
    y: counts,
    type: "bar",
    marker: { color: "rgba(152, 147, 237, 1)" },
  };

  const data = [trace1];

  const layout = {
    title: { text: "中國旅遊景點分類" },
    xaxis: { tickangle: 0 },
    yaxis: {
      title: "Count",
      tickmode: "array",
      tickvals: [0, 1, 2, 3, 4, 5],
      range: [0, 5],
    },
    margin: { t: 50, b: 150 },
    bargap: 0.1,
  };

  Plotly.newPlot("myGraph", data, layout);
}
