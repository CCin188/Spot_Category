d3.csv(
  "https://raw.githubusercontent.com/CCin188/Spot_Category/refs/heads/CCin188-patch-1/travel_destinations.csv"
).then((res) => {
  drawBarchart(res);
});

function mapCategory(cat) {
  cat = cat.toLowerCase();

  // Food
  if (cat.includes("food") || cat.includes("seafood") || cat.includes("beer"))
    return "food";

  // Culture
  if (
    cat.includes("history") ||
    cat.includes("modern culture") ||
    cat.includes("temples") ||
    cat.includes("culture") ||
    cat.includes("shrines") ||
    cat.includes("traditional arts") ||
    cat.includes("pop culture")
  )
    return "culture";

  // Nightlife
  if (
    cat.includes("nightlife") ||
    cat.includes("geisha district") ||
    cat.includes("clubs")
  )
    return "nightlife";

  // Shopping
  if (
    cat.includes("shopping") ||
    cat.includes("market") ||
    cat.includes("mall")
  )
    return "shopping";

  // Nature
  if (
    cat.includes("nature") ||
    cat.includes("gardens") ||
    cat.includes("castle")
  )
    return "nature";

  return "other";
}

function drawBarchart(res) {
  const japanData = res.filter((d) => d.Country === "Japan");

  let allCategories = [];

  japanData.forEach((d) => {
    if (d.Category) {
      const cats = d.Category.split(",").map((c) => c.trim());
      cats.forEach((c) => {
        allCategories.push(mapCategory(c));
      });
    }
  });

  // group-by counting
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
    title: { text: "日本旅遊景點分類" },
    xaxis: { tickangle: 0 },
    yaxis: {
      title: "Count",
      tickmode: "array",
      tickvals: Array.from({ length: 16 }, (_, i) => i),
      range: [0, 15],
    },
    margin: { t: 50, b: 150 },
    bargap: 0.1,
  };

  Plotly.newPlot("myGraph", data, layout);
}
