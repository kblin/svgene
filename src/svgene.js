/* Copyright 2012 Kai Blin. Licensed under the Apache License v2.0, see LICENSE file */

var svgene = { };

svgene.geneArrowPoints = function (orf, height, offset, scale) {
  var top_ = 0 + offset;
  var bottom = height - offset;
  if (orf.strand == 1) {
      var start = scale(orf.start);
      var box_end = Math.max(scale(orf.end) - (2*offset), start);
      var point_end = scale(orf.end);
      points  = "" + start + "," + top_;
      points += " " + box_end + "," + top_;
      points += " " + point_end + "," + (height/2);
      points += " " + box_end + "," + bottom;
      points += " " + start + "," + bottom;
      return points;
  }
  if (orf.strand == -1) {
      var point_start = scale(orf.start);
      var end = scale(orf.end);
      var box_start = Math.min(scale(orf.start) + (2*offset), end);
      points = "" + point_start + "," + (height/2);
      points += " " + box_start + "," + top_;
      points += " " + end + "," + top_;
      points += " " + end + "," + bottom;
      points += " " + box_start + "," + bottom;
      return points;
  }
};

svgene.drawCluster = function(id, cluster, height, width) {
  var chart = d3.select("#"+id).append("svg")
    .attr("height", height)
    .attr("width", width);

  var offset = height/10;
  var x = d3.scale.linear()
    .domain([cluster.start, cluster.end])
    .range([0, width]);
  chart.append("line")
    .attr("x1", 0)
    .attr("y1", height/2)
    .attr("x2", cluster.end - cluster.start)
    .attr("y2", height/2)
    .attr("class", "geneline");
  chart.selectAll("polygon")
    .data(cluster.orfs)
  .enter().append("polygon")
    .attr("points", function(d) { return svgene.geneArrowPoints(d, height, offset, x); })
    .attr("class", function(d) { return "genetype-" + d.type; })
    .attr("id", function(d) { return cluster.idx + "-" + d.locus_tag; });
};
