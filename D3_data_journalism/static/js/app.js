//Create function to make plot responsive
function makeresponsive(){
//Create and append svg wrapper
    var svgarea=d3.select('#scatter').select('svg');
    if (!svgarea.empty()){
        svgarea.remove()};
    var svgheight=window.innerHeight;
    var svgwidth=window.innerWidth;
    var margin={
        top:50,
        bottom:100,
        left:100,
        right:100};
    var chartheight=(svgheight-margin.top-margin.bottom);
    var chartwidth=(svgwidth-margin.left-margin.right);
    var svg=d3.select('#scatter').append('svg')
        .attr('height',svgheight)
        .attr('width',svgwidth);
    var chartgroup=svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);
//Create initial items to plot
    var chosenxaxis='poverty';
    var chosenyaxis='obesity';
//Create functions to rescale and update axis based on items chosen to be plotted
    function xscale(stats,chosenxaxis){
        var xlinearscale=d3.scaleLinear()
            .domain([d3.min(stats,stat=>stat[chosenxaxis])*.8,d3.max(stats,stat=>stat[chosenxaxis])*1.2])
            .range([0,chartwidth]);
        return xlinearscale;}
    function yscale(stats,chosenyaxis){
        var ylinearscale=d3.scaleLinear()
            .domain([d3.min(stats,stat=>stat[chosenyaxis])*.8,d3.max(stats,stat=>stat[chosenyaxis])*1.2])
            .range([chartheight,0]);
        return ylinearscale;}
    function renderxaxes(newxscale,xaxis){
        var bottomaxis=d3.axisBottom(newxscale);
        xaxis.transition()
            .duration(1000)
            .call(bottomaxis);
        return xaxis;}
    function renderyaxes(newyscale,yaxis){
        var leftaxis=d3.axisLeft(newyscale);
        yaxis.transition()
            .duration(1000)
            .call(leftaxis);
        return yaxis;}
//Create functions to update data points and text based on items chosen to be plotted
    function rendercircles(circlesgroup,newxscale,chosenxaxis,newyscale,chosenyaxis){
        circlesgroup.transition()
            .duration(1000)
            .attr("cx",d=>newxscale(d[chosenxaxis]))
            .attr("cy",d=>newyscale(d[chosenyaxis]));
        return circlesgroup;}
    function renderstates(statesgroup,newxscale,chosenxaxis,newyscale,chosenyaxis){
        statesgroup.transition()
            .duration(1000)
            .attr('dx',stat=>newxscale(stat[chosenxaxis]))
            .attr('dy',stat=>newyscale(stat[chosenyaxis])+5)
        return statesgroup;}
//Create function to update tooltips based on items chosen to be plotted
    function updatetooltip(chosenxaxis,chosenyaxis,circlesgroup){
        if (chosenxaxis==='poverty'){
            var xlabel='Poverty: ';}
        if (chosenxaxis==='age'){
            var xlabel='Age: ';}
        if (chosenxaxis==='income'){
            var xlabel='Income: ';}
        if (chosenyaxis==='obesity'){
            var ylabel='Obese: ';}
        if (chosenyaxis==='smokes'){
            var ylabel='Smokes: ';}
        if (chosenyaxis==='healthcare'){
            var ylabel='Healthcare: ';}
        var tooltip=d3.tip()
            .attr('class', 'd3-tip')
            .offset([80,-60])
            .html(function(stat){
        return(`${stat.state}<br>${xlabel}${stat[chosenxaxis]}<br>${ylabel}${stat[chosenyaxis]}%`);});
        circlesgroup.call(tooltip);
        circlesgroup.on('mouseover',function(stats){
            tooltip.show(stats);})
            .on('mouseout',function(stats){
                tooltip.hide(stats);});
        return circlesgroup;}
//Get data from csv file and parse data
    d3.csv('static/data/data.csv').then(function(stats){
        stats.forEach(function(stat){
            stat.poverty=+stat.poverty;
            stat.age=+stat.age;
            stat.income=+stat.income;
            stat.healthcare=+stat.healthcare;
            stat.obesity=+stat.obesity;
            stat.smokes=+stat.smokes;});
//Scale, create and append axes
        var xlinearscale=xscale(stats,chosenxaxis);
        var ylinearscale=yscale(stats,chosenyaxis);
        var bottomaxis=d3.axisBottom(xlinearscale);
        var leftaxis=d3.axisLeft(ylinearscale);
        var xaxis=chartgroup.append('g')
            .classed('x-axis',true)
            .attr('transform',`translate(0,${chartheight})`)
            .call(bottomaxis);
        var yaxis=chartgroup.append('g')
            .classed('y-axis',true)
            .call(leftaxis);
//Append data to circles for initial plot
        var circlesgroup=chartgroup.selectAll('circle')
            .data(stats)
            .enter()
            .append('circle')
            .attr('cx',stat=>xlinearscale(stat[chosenxaxis]))
            .attr('cy',stat=>ylinearscale(stat[chosenyaxis]))
            .attr('r','14')
            .attr('class','statecircle');
//Append text to circles for initial plot
        var statesgroup=chartgroup.selectAll('#statetext')
            .data(stats)
            .enter()
            .append('text')
            .attr('dx',stat=>xlinearscale(stat[chosenxaxis]))
            .attr('dy',stat=>ylinearscale(stat[chosenyaxis])+5)
            .text(stat=>(stat.abbr))
            .attr('class','statetext');
//Create labels for additional x axis items for plotting
        var xlabelgroup=chartgroup.append('g')
            .attr('transform',`translate(${chartwidth/2},${chartheight+20})`);
        var povertylabel=xlabelgroup.append('text')
            .attr('x',0)
            .attr('y',20)
            .attr('value','poverty')
            .classed('active',true)
            .text('In Poverty (%)');
        var agelabel=xlabelgroup.append('text')
            .attr('x',0)
            .attr('y',40)
            .attr('value','age')
            .classed('inactive',true)
            .text('Age (Median)');
        var incomelabel=xlabelgroup.append('text')
            .attr('x',0)
            .attr('y',60)
            .attr('value','income')
            .classed('inactive',true)
            .text('Household Income (Median)');
//Create labels for additional y axis items for plotting
        var ylabelgroup=chartgroup.append('g')
            .attr('transform','rotate(-90)');
        var obeselabel=ylabelgroup.append('text')
            .attr('y',0-margin.left)
            .attr('x',0-(chartheight/2))
            .attr("dy", "1em")
            .attr('value','obesity')
            .classed('active',true)
            .text('Obese (%)');
        var smokeslabel=ylabelgroup.append('text')
            .attr('y',20-margin.left)
            .attr('x',0-(chartheight/2))
            .attr("dy", "1em")
            .attr('value','smokes')
            .classed('inactive',true)
            .text('Smokes (%)');
        var healthcarelabel=ylabelgroup.append('text')
            .attr('y',40-margin.left)
            .attr('x',0-(chartheight/2))
            .attr("dy", "1em")
            .attr('value','healthcare')
            .classed('inactive',true)
            .text('Lacks Healthcare (%)');
//Create tooltips for inital plot
        var circlesgroup=updatetooltip(chosenxaxis,chosenyaxis,circlesgroup);
//Create event listener for x axis item selected to be plotted
        xlabelgroup.selectAll('text')
            .on('click',function(){
                var xvalue=d3.select(this).attr('value');
                if (xvalue!==chosenxaxis){
                    chosenxaxis=xvalue;
                    xlinearscale=xscale(stats,chosenxaxis);
                    xaxis=renderxaxes(xlinearscale,xaxis);
//Update plot based on item selected to be plotted
                circlesgroup=rendercircles(circlesgroup,xlinearscale,chosenxaxis,ylinearscale,chosenyaxis);
                statesgroup=renderstates(statesgroup,xlinearscale,chosenxaxis,ylinearscale,chosenyaxis);
                circlesgroup=updatetooltip(chosenxaxis,chosenyaxis,circlesgroup);
//Update x axis labels based on item selected to be plotted
                    if (chosenxaxis==='poverty'){
                        povertylabel
                            .classed('active',true)
                            .classed('inactive',false);
                        agelabel
                            .classed('active',false)
                            .classed('inactive',true);
                        incomelabel
                            .classed('active',false)
                            .classed('inactive',true);}
                    if (chosenxaxis==='age'){
                        agelabel
                            .classed('active',true)
                            .classed('inactive',false);
                        incomelabel
                            .classed('active',false)
                            .classed('inactive',true);
                        povertylabel
                            .classed('active',false)
                            .classed('inactive',true);}
                    if (chosenxaxis==='income'){
                        incomelabel
                            .classed('active',true)
                            .classed('inactive',false);
                        povertylabel
                            .classed('active',false)
                            .classed('inactive',true);
                        agelabel
                            .classed('active',false)
                            .classed('inactive',true);}}});
//Create event listener for y axis item selected to be plotted
        ylabelgroup.selectAll('text')
            .on('click',function(){
                var yvalue=d3.select(this).attr('value');
                if (yvalue!==chosenyaxis){
                    chosenyaxis=yvalue;
                    ylinearscale=yscale(stats,chosenyaxis);
                    yaxis=renderyaxes(ylinearscale,yaxis);
//Update plot based on item selected to be plotted
                circlesgroup=rendercircles(circlesgroup,xlinearscale,chosenxaxis,ylinearscale,chosenyaxis);
                statesgroup=renderstates(statesgroup,xlinearscale,chosenxaxis,ylinearscale,chosenyaxis);
                circlesgroup=updatetooltip(chosenxaxis,chosenyaxis,circlesgroup);
//Update y axis labels based on item selected to be plotted
                    if (chosenyaxis==='obesity'){
                        obeselabel
                            .classed('active',true)
                            .classed('inactive',false);
                        smokeslabel
                            .classed('active',false)
                            .classed('inactive',true);
                        healthcarelabel
                            .classed('active',false)
                            .classed('inactive',true);}
                    if (chosenyaxis==='smokes'){
                        smokeslabel
                            .classed('active',true)
                            .classed('inactive',false);
                        healthcarelabel
                            .classed('active',false)
                            .classed('inactive',true);
                        obeselabel
                            .classed('active',false)
                            .classed('inactive',true);}
                    if (chosenyaxis==='healthcare'){
                        healthcarelabel
                            .classed('active',true)
                            .classed('inactive',false);
                        obeselabel
                            .classed('active',false)
                            .classed('inactive',true);
                        smokeslabel
                            .classed('active',false)
                            .classed('inactive',true);}}});
    });
}
//Call responsive function and change plot size when window size changes
makeresponsive();
d3.select(window).on('resize',makeresponsive);