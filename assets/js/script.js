// function formatCrypto (state) {
//   if (!state.id) {
//     return state.text;
//   }
//   var baseUrl = "/cryptosquares/assets/images/cryptocurrency";
//   var $state = $(
//     '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="crypto-img" /> ' + state.text + '</span>'
//   );
//   return $state;
// }

// $(document).ready(function() {
//     $('.cryptocurrency').select2({
//         templateResult: formatCrypto,
// 	    templateSelection: formatCrypto
//     });
// });
const svg = d3.select("svg");
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const squareSize = 70; // Base size for the squares
        const padding = 10; // Increase this value for more padding between squares
        const logoSize = 16; // Size of the logos
        const cols = Math.floor(width / squareSize); 
        const borderColors = ["#ff0000", "#60e550","#gradient-border"];
        //const colorScale = d3.scaleOrdinal(d3.schemeCategory10); 
        // Create squares with random positions
        d3.csv("currencies.csv").then(data => {
        const squares = [];

        
        data.forEach(d => {
            let attempts = 0;
            let x, y, overlaps;
            const value = +d.Rates;
            
            do {
                x = Math.random() * (width - squareSize);
                y = Math.random() * (height - squareSize);
                
                overlaps = squares.some(square => 
                    x < square.x + squareSize && 
                    x + squareSize > square.x && 
                    y < square.y + squareSize && 
                    y + squareSize > square.y
                );

                attempts++;
            } while (overlaps && attempts < 100); // Limit attempts
            //const x = (index % cols) * squareSize; // Column-wise placement
              //  const y = Math.floor(index / cols) * squareSize; // Row-wise placement


            if (attempts < 100) {
                squares.push({ x, y, name: d.Currency, value, image: d.image });
            }
        });
        // Create squares
            svg.selectAll(".square")
            .data(squares)
            .enter()
            .append("rect")
            .attr("class", "square")
            .attr("x", d => d.x) // Random x position
            .attr("y", d => d.y) // Random y position
            .attr("width", squareSize) // Set square width
            .attr("height", squareSize) // Set square height
            //.attr("fill", d => d.color);
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
            //.attr("stroke", "url(#gradient-border)") // Border color
            .attr("stroke", (d, i) => borderColors[i % borderColors.length]) // Different border color
                .attr("stroke-width", 3) // Border width
                //.attr("stroke-opacity", 1.0);     
            //.attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
            .transition()
		.duration(1500) 
        .ease(d3.easeCubicOut)
        .attr("opacity", 1)
        .attr("fill-opacity", 0.7);
            
            // Add text inside squares
            svg.selectAll(".square-text-name")
                .data(squares)
                .enter()
                .append("text")
                .attr("class", "square-text-name")
                .attr("x", d => d.x + squareSize / 2) // Center text horizontally
                .attr("y", d => d.y + squareSize  / 2) // Position for name
                .text(d => d.name) 
                .transition()
                .ease(d3.easeCubicOut)
		.duration(2000) 
        .attr("opacity", 1)
        .attr("fill-opacity", 0.7);
            svg.selectAll(".square-value")
                .data(squares)
                .enter()
                .append("text")
                .attr("class", "square-text")
                .attr("x", d => d.x + squareSize / 2) // Center text horizontally
                .attr("y", d => d.y + (3 * squareSize) / 4) // Position for value
                .text(d => d.value) 
                .transition()
                .ease(d3.easeCubicOut)
		.duration(2000) 
        .attr("opacity", 1)
        .attr("fill-opacity", 0.7);
            svg.selectAll(".square-image")
                .data(squares)
                .enter()
                .append("image")
                .attr("class", "square-image")
                .attr("xlink:href", d => d.image) // Set the image source
                .attr("x", d => d.x + (squareSize - logoSize) / 2) // Center the image horizontally
                .attr("y", d => d.y + (squareSize - logoSize) / 8) // Center the image vertically
                .attr("width", logoSize) // Set smaller image width
                .attr("height", logoSize)
                .transition()
                .ease(d3.easeCubicOut)
		.duration(4000) 
        .attr("opacity", 1)
        .attr("fill-opacity", 0.7);

    });