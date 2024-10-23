function formatCrypto (state) {
  if (!state.id) {
    return state.text;
  }
  var baseUrl = "/cryptosquares/assets/images/cryptocurrency";
  var $state = $(
    '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="crypto-img" /> ' + state.text + '</span>'
  );
  return $state;
}


$(document).ready(function() {
    $('.cryptocurrency').select2({
        templateResult: formatCrypto,
	    templateSelection: formatCrypto
    });
});

const width = 1200;
const height = 600;
const padding = 50;

d3.csv("currencies.csv").then(data => {

	data.forEach(d => {
		d.Rates = +d.Rates;
	});

	const sortedData = data.sort((a, b) => b.Rates - a.Rates).slice(0, 100);

	const colorScale = d3.scaleOrdinal()
		.domain(sortedData.map(d => d.Currency))
		.range(d3.schemeCategory10);

	const pack = d3.pack()
		.size([width - padding * 2, height - padding * 2])  // Adjust to keep inside bounds
		.padding(50);

	const hierarchy = d3.hierarchy({children: sortedData})
		.sum(d => d.Rates);

	const root = pack(hierarchy);

	const svg = d3.select("#chart")
		.attr("width", width)
		.attr("height", height);

	// Create bubbles group elements, initially placed at random positions inside the canvas
	const bubbles = svg.selectAll(".bubble")
		.data(root.descendants().slice(1))  // Remove the root node
		.enter()
		.append("g")
		.attr("class", "bubble")
		.attr("transform", d => `translate(${Math.random() * (width - padding * 2) + padding}, ${Math.random() * (height - padding * 2) + padding})`);  // Start from random positions within bounds

	
	// Increase the size of squares by multiplying d.r by a factor (e.g., 1.5 for 50% larger)
	const sizeFactor = 2.0;  // Change this factor to control the size increase
	
	// Append circles and animate them from random positions to final positions
	bubbles.append("circle")
		.attr("r", d => d.r * 2 * sizeFactor)  // Set the correct radius right away
		.attr("fill", d => colorScale(d.data.Currency));

	// Animate the movement of circles to their final positions
	bubbles.transition()
		.duration(2000)  // Animate the movement over 2 seconds
		.attr("transform", d => `translate(${d.x + padding}, ${d.y + padding})`);

	// Append text labels for currency and rates
	bubbles.append("text")
		.attr("dy", "-0.4em")
		.style("text-anchor", "middle")
		.append("tspan")
		.attr("class", "currency")
		.text(d => d.data.Currency)
		.append("tspan")
		.attr("class", "rates")
		.attr("x", 0)
		.attr("dy", "1.2em")
		.text(d => d.data.Rates.toLocaleString());

	// Apply color to the text
	d3.selectAll("text").style("fill", "black");

});