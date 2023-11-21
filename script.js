const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const width = 800;
const height = 400;
const padding = 40;

const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

const xScale = d3.scaleTime()
    .range([padding, width - padding]);

const yScale = d3.scaleLinear()
    .range([height - padding, padding]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

const g = svg.append("g");

d3.json(url).then(data => {
    const dataset = data.data;

    const years = dataset.map(item => new Date(item[0]));
    const gdp = dataset.map(item => item[1]);

    xScale.domain([d3.min(years), d3.max(years)]);
    yScale.domain([0, d3.max(gdp)]);

    g.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);

    g.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

    g.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", d => xScale(new Date(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("width", width / dataset.length)
        .attr("height", d => height - padding - yScale(d[1]))
        .on("mouseover", function(d) {
    tooltip.style("display", "block");
    tooltip.html(`${d.target.getAttribute("data-date")}<br>$${d.target.getAttribute("data-gdp")} Billion`);
    tooltip.attr("data-date", d.target.getAttribute("data-date")); // Set the data-date attribute
})

        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
});
