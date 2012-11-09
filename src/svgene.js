/* Copyright 2012 Kai Blin. Licensed under the Apache License v2.0, see LICENSE file */

var svgene = {
    version: "0.1.1",
    label_height: 10,
    unique_id: 0
};

svgene.geneArrowPoints = function (orf, height, offset, scale) {
  var top_ = svgene.label_height + offset;
  var bottom = svgene.label_height + height - offset;
  var middle = svgene.label_height + (height/2);
  if (orf.strand == 1) {
      var start = scale(orf.start);
      var box_end = Math.max(scale(orf.end) - (2*offset), start);
      var point_end = scale(orf.end);
      points  = "" + start + "," + top_;
      points += " " + box_end + "," + top_;
      points += " " + point_end + "," + middle;
      points += " " + box_end + "," + bottom;
      points += " " + start + "," + bottom;
      return points;
  }
  if (orf.strand == -1) {
      var point_start = scale(orf.start);
      var end = scale(orf.end);
      var box_start = Math.min(scale(orf.start) + (2*offset), end);
      points = "" + point_start + "," + middle;
      points += " " + box_start + "," + top_;
      points += " " + end + "," + top_;
      points += " " + end + "," + bottom;
      points += " " + box_start + "," + bottom;
      return points;
  }
};

svgene.drawCluster = function(id, cluster, height, width) {
  var container = d3.select("#" + id);
  var chart = container.append("svg")
    .attr("height", height + svgene.label_height)
    .attr("width", width);

  var idx = svgene.unique_id++;
  var offset = height/10;
  var x = d3.scale.linear()
    .domain([cluster.start, cluster.end])
    .range([0, width]);
  chart.append("line")
    .attr("x1", 0)
    .attr("y1", svgene.label_height + (height/2))
    .attr("x2", cluster.end - cluster.start)
    .attr("y2", svgene.label_height + (height/2))
    .attr("class", "svgene-line");
  chart.selectAll("polygon")
    .data(cluster.orfs)
  .enter().append("polygon")
    .attr("points", function(d) { return svgene.geneArrowPoints(d, height, offset, x); })
    .attr("class", function(d) { return "svgene-type-" + d.type + " svgene-orf"; })
    .attr("id", function(d) { return idx + "-cluster" + cluster.idx + "-" + d.locus_tag + "-orf"; })
  chart.selectAll("text")
    .data(cluster.orfs)
  .enter().append("text")
    .attr("x", function(d) { return x(d.start); })
    .attr("y", svgene.label_height + offset/2)
    .attr("class", "svgene-locustag")
    .attr("id", function(d) { return idx + "-cluster" + cluster.idx + "-" + d.locus_tag + "-label"; })
    .text(function(d) { return d.locus_tag; });

  container.selectAll("div")
    .data(cluster.orfs)
  .enter().append("div")
    .attr("class", "svgene-tooltip")
    .attr("id", function(d) { return idx + "-cluster" + cluster.idx + "-" + d.locus_tag + "-tooltip"; })
    .html(function(d) { return d.description});
};


function tooltip_handler(ev) {
    var id = $(this).attr("id").replace("-orf", "-tooltip");
    var tooltip = $("#"+id);

    $(".svgene-tooltip").hide();

    if (tooltip.css("display") == 'none') {
        var offset = $(this).offset();
        tooltip.css("left", offset.left + 10);
        tooltip.css("top", offset.top + $(this).parent().height()/2);
        tooltip.show();
        tooltip.click(function(){$(this).hide()});
        var timeout = setTimeout(function(){ tooltip.slideUp("fast") }, 5000);
        tooltip.data("timeout", timeout);
        tooltip.mouseover(function() {
            clearTimeout(tooltip.data("timeout"));
        }).mouseout(function() {
            timeout = setTimeout(function(){ tooltip.slideUp("fast") }, 5000);
            tooltip.data("timeout", timeout);
        });
    } else {
        tooltip.hide();
    }
}

$(document).ready(function() {
    $(".svgene-orf").mouseover(function(e) {
        var id = $(this).attr("id").replace("-orf", "-label");
        $("#"+id).show();
    }).mouseout(function(e) {
        var id = $(this).attr("id").replace("-orf", "-label");
        $("#"+id).hide();
    }).click(tooltip_handler);

});
