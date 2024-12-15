import * as d3 from 'd3';

// Function to load and parse CSV data
export const loadDataFromURL = async (url, setDataLoaded) => {
  let data = await d3.csv(url, d => {
    return {
      date: d3.timeParse("%d/%m/%Y")(d.Date),
      revenue: +d.Revenue.replace('$', '').replace('.', ''),
      ebitda: +d.Ebitda.replace('$', '').replace('.', ''),
      profit: +d.Profit.replace('$', '').replace('.', ''),
      costs: +d.Costs.replace('$', '').replace('.', '')
    };
  });

  // Sort data by date
  data.sort((a, b) => a.date - b.date);

  // Extract data for charts
  const date = data.map(d => d.date);
  const revenues = data.map(d => d.revenue / 1000);
  const profits = data.map(d => d.profit / 1000);
  const costs = data.map(d => d.costs / 1000);

  // Set data loaded to true
  setDataLoaded(true);

  return { date, revenues, profits, costs };
};