console.log("Assignment 4-B");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

var lineGenerator = d3.svg.line()
    .x(function(d){ return scaleX(d.year)})
    .y(function(d){ return scaleY(d.value)})
    .interpolate('basis');

var areaGenerator = d3.svg.area()
    .x(function(d){ return scaleX(d.year)})
    .y0(height)
    .y1(function(d){ return scaleY(d.value)})
    .interpolate('basis');

//Start importing data
queue()
    .defer(d3.csv,'data/fao_combined_world_1963_2013.csv', parse)
    .defer(d3.csv,'data/metadata.csv', parseMetadata)
    .await(dataLoaded);

function parse(d){
    return {
        Name: d.ItemName,
        value:+d.Value,
        year:+d.Year

    };

}

function parseMetadata(d){
}


function dataLoaded(error, rows, metadata){

    var nestedData = d3.nest()
        .key(function(d)
        {
            return d.Name;
        })
        .entries(rows);
    console.log(nestedData);

    plot.selectAll('.data-line')
        .data(nestedData)
        .enter()
        .append('path')
        .attr('class','data-line')
        .attr('d',function(d){
            return lineGenerator(d.values);
        });
    plot.selectAll('.data-area')
        .data(nestedData)
        .enter()
        .append('path')
        .attr('class','data-area')
        .attr('d',function(d){
            return areaGenerator(d.values);
        });

    plot.selectAll('.tea-data-point')
        .data(nestedData[0].values)
        .enter()
        .append('circle')
        .attr('class','tea-data-point')
        .attr('cx',function(t){return scaleX(t.year);})
        .attr('cy',function(t){return scaleY(t.value);})
        .attr('r',5)
        .style('fill','rgba(255,255,255,0)')

        .on('mouseenter', function(d){

            var tooltip = d3.select('.custom-tooltip');

            tooltip.transition().style('opacity',1);

            tooltip.select('#type').html(d.Name);
            tooltip.select('#year').html(d.year);
            tooltip.select('#value').html(d.value);

        })

        .on('mouseleave',function(d)
        {
            d3.select('.custom-tooltip').transition()
                .style('opacity',0);
        })
        .on('mousemove',function(d){

            var xy = d3.mouse(document.getElementById('plot'));

            var left = xy[0], top = xy[1];


            d3.select('.custom-tooltip')
                .style('left', left + 50 + 'px')
                .style('top', top +50 + 'px');

        });


    plot.selectAll(".coffee-data-point")
        .data(nestedData[1].values)
        .enter()
        .append('circle')
        .attr('class',"coffee-data-point")
        .attr('cx',function(t){return scaleX(t.year);})
        .attr('cy',function(t){return scaleY(t.value);})
        .attr('r',5)
        .style('fill','rgba(255,255,255,0)')

        .on('mouseenter', function(d){

            var tooltip = d3.select('.custom-tooltip');

            tooltip.transition().style('opacity',1);

            tooltip.select('#type').html(d.Name);
            tooltip.select('#year').html(d.year);
            tooltip.select('#value').html(d.value);

        })
        .on('mouseleave',function(d){
            d3.select('.custom-tooltip').transition()
                .style('opacity',0);
        })
        .on('mousemove',function(d){

            var xy = d3.mouse(document.getElementById('plot'));

            var left = xy[0], top = xy[1];


            d3.select('.custom-tooltip')
                .style('left', left + 50 + 'px')
                .style('top', top +50 + 'px')

        });

}

