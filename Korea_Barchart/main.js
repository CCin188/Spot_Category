d3.csv(
  "https://raw.githubusercontent.com/CCin188/Spot_Category/refs/heads/CCin188-patch-1/travel_destinations.csv"
).then((res) => {
  drawBarchart(res);
});

function drawBarchart(res) {
  const japanData = res.filter((d) => d.Country === "South Korea");

  let allCategories = [];

  japanData.forEach((d) => {
    if (d.Category) {
      const cats = d.Category.split(",").map((c) => c.trim().toLowerCase());
      allCategories.push(...cats);
    }
  });

  const categoryCountMap = d3.rollup(
    allCategories,
    (v) => v.length,
    (c) => c
  );

  const categories = Array.from(categoryCountMap.keys());
  const counts = Array.from(categoryCountMap.values());

  const trace1 = {
    x: categories,
    y: counts,
    type: "bar",
    marker: { color: "rgba(152, 147, 237, 1)" },
  };

  const data = [trace1];

  const layout = {
    title: { text: "韓國旅遊景點分類" },
    xaxis: { tickangle: -35 },
    yaxis: {
      title: "Count",
      tickmode: "array",
      tickvals: [0, 1, 2, 3, 4, 5],
      range: [0, 5],
    },
    margin: { t: 50, b: 150 },
    bargap: 0.08,
  };

  Plotly.newPlot("myGraph", data, layout);
}
