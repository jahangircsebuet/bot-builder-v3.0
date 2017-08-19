function drawCanvas(width, height) {
    console.log("height - $('.header').height(): "+ parseInt(height - $('.header').height()));
    // set the svg id to 'charts', set height, width and append a svg:g element
    svg = d3.select("body").append("svg").attr("id", "charts")
        .attr("width", width) // + margin.left + margin.right
        .attr("height", height) // + margin.top + margin.bottom
        .append("g")
        .attr("class", "first-g");
        //.attr("transform", "translate(" + margin.left + "," + margin.right + ")");
        // TODO
        //.call(zoom);

    // append another svg:g element as a container
    var container = svg.append("g").attr("class", "container");

    // draw the vertical lines on the svg:g as a canvas
    container.append("g")
        .attr("class", "x axis")
        .selectAll("line")
        .data(d3.range(0, width, 10))
        .enter().append("line").attr('class', 'canvas_line line_x')
        .attr("x1", function(d) { return d; })
        .attr("y1", 0)
        .attr("x2", function(d) { return d; })
        .attr("y2", height);

    // draw the horizontal lines on the svg:g as a canvas
    container.append("g")
        .attr("class", "y axis")
        .selectAll("line")
        .data(d3.range(0, height, 10))
        .enter().append("line").attr('class', 'canvas_line line_y')
        .attr("x1", 0)
        .attr("y1", function(d) { return d; })
        .attr("x2", width)
        .attr("y2", function(d) { return d; });
}

function update_canvas() {
    // draw the horizontal lines on the svg:g as a canvas
    var prev_y = d3.selectAll('.line_y').size()*10;
    d3.select('#charts').transition().duration(2000).attr('height', prev_y + 100);

    var prev_x = d3.selectAll('.line_x').size();
    line_x1 = d3.selectAll('.line_x')[0][0].x1.baseVal.value;
    line_x2 = d3.selectAll('.line_x')[0][d3.selectAll('.line_x').size()-1].x2.baseVal.value;
    line_y1 = d3.selectAll('.line_x')[0][0].y1.baseVal.value;
    line_y2 = d3.selectAll('.line_x')[0][d3.selectAll('.line_x').size()-1].y2.baseVal.value;

    for(var i=line_x1;i<=line_x2;i= i+10) {
        //console.log(i);
        d3.select('g.x').append('line')
            .attr('x1', i)
            .attr('y1', line_y2)
            .attr('x2', i)
            .attr('y2', prev_y + 100)
            .attr('class', "canvas_line");
    }
    for(var i=0;i<10;i++) {
        d3.select('g.y').append('line')
            .attr('x1', 0)
            .attr('y1', prev_y)
            .attr('x2', w)
            .attr('y2', prev_y)
            .attr('class', "canvas_line line_y");

        prev_y = parseInt(prev_y + 10);
    }
}