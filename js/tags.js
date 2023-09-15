function Tags() {

  var containerVorbesitzerin;

  var fontsize = d3.scale.linear().range([11, 23])

  var filter = { vorbesitzerin: [], alteanonymemoderne: [], stiftungfamilieanderes: [], whrung: [] };
  var lock = false

  function addOrRemove(array, value) {
    array = array.slice();
    var index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
    return array;
  }

  function tags() { }

  tags.updateDom = function updateDom(key, filteredData) {

    var container = d3.select("." + key + " .items");
    var selection = container
      .selectAll(".item")
      .data(filteredData, function (d) { return d.key; });

    selection
      .enter()
      .append("div")
      .classed("item", true)
      .text(function (d) {
        return d.key;
      })
      .on("click", function (d) {
        lock = true;
        filter[key] = addOrRemove(filter[key], d.key);
        tags.filter();
        tags.update();
        lock = false;
      });

    selection.exit()
      .classed("active", false)
      .classed("hide", true)

    selection
      .classed("active", function (d) {
        return filter[key].indexOf(d.key) > -1;
      })
      .classed("hide", false)
  }

  tags.updateFilters = function updateFilters() {

    var filters = Object.entries(filter) //.filter(function (d) { return d[1].length; })

    // console.log("updateFilters", filters)

    for (var a = 0; a < filters.length; a++) {
      var filterCur = filters[a];
      var index = {}
      var otherFilter = filters.filter(function (d) { return d != filterCur; })
      // console.log(filter, "otherFilter", otherFilter)
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var hit = otherFilter.filter(function (otherFilter) {
          return otherFilter[1].length === 0 || otherFilter[1].indexOf(d[otherFilter[0]]) > -1;
        })

        if (hit.length == otherFilter.length) {
          index[d[filterCur[0]]] = ++index[d[filterCur[0]]] || 0;
        }
      }
      var filteredData = Object.keys(index)
        .map(function (d) { return { key: d, size: index[d] }; })
        .sort(function (a, b) { return b.size - a.size; })

      // console.log("done", filterCur[0], filteredData)

      tags.updateDom(filterCur[0], filteredData)

    }
  }

  tags.updateFilter = function updateFilter() {

    // tags.updateFilters();

    // var filteredData = data.filter(function (d) { return d.active; });
    // var alteanonymemoderneData = d3.nest()
    //   .key(function (d) { return d.alteanonymemoderne; })
    //   .entries(filteredData)

    var alteanonymemoderneIndex = {}
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var hasVorbesitzerin = filter.vorbesitzerin.length ? filter.vorbesitzerin.indexOf(d.vorbesitzerin) > -1 : true;
      if (hasVorbesitzerin) {
        alteanonymemoderneIndex[d.alteanonymemoderne] = ++alteanonymemoderneIndex[d.alteanonymemoderne] || 0;
      }
    }
    var alteanonymemoderneData = Object.keys(alteanonymemoderneIndex).map(function (d) { return { key: d, size: alteanonymemoderneIndex[d] }; })

    // filter.alteanonymemoderne = filter.alteanonymemoderne.filter(function (d) { return alteanonymemoderneIndex[d]; })

    var alteanonymemoderneContainer = d3.select(".alteanonymemoderne .items");
    var selection = alteanonymemoderneContainer
      .selectAll(".item")
      .data(alteanonymemoderneData, function (d) { return d.key; });

    selection
      .enter()
      .append("div")
      .classed("item", true)
      .text(function (d) {
        return d.key;
      })
      .on("click", function (d) {
        lock = true;
        filter.alteanonymemoderne = addOrRemove(filter.alteanonymemoderne, d.key);
        tags.filter();
        tags.update();
        lock = false;
      });

    selection.exit()
      .classed("active", false)
      .classed("hide", true)

    selection
      .classed("active", function (d) {
        return filter.alteanonymemoderne.indexOf(d.key) > -1;
      })
      .classed("hide", false)


    // var vorbesitzerinData = d3.nest()
    //   .key(function (d) { return d.vorbesitzerin; })
    //   .entries(data)
    //   .sort(function (a, b) {
    //     return b.values.length - a.values.length;
    //   })

    var vorbesitzerinIndex = {}
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var hasAlteanonymemoderne = filter.alteanonymemoderne.length ? filter.alteanonymemoderne.indexOf(d.alteanonymemoderne) > -1 : true;
      if (hasAlteanonymemoderne) {
        vorbesitzerinIndex[d.vorbesitzerin] = ++vorbesitzerinIndex[d.vorbesitzerin] || 0;
      }
    }
    var vorbesitzerinData = Object.entries(vorbesitzerinIndex)
      .map(function (d) { return { key: d[0], size: d[1] }; })
      .sort(function (a, b) {
        return b.size - a.size;
      })

    fontsize.domain(d3.extent(vorbesitzerinData, function (d) { return d.size; }))

    var containerVorbesitzerin = d3.select(".verkaufer .list");
    selection = containerVorbesitzerin
      .selectAll(".item")
      .data(vorbesitzerinData, function (d) { return d.key; })

    selection
      .enter()
      .append("div")
      .classed("item", true)
      .text(function (d) {
        return d.key// + " " + d.values.length + "";
      })
      .style("font-size", function (d) {
        return fontsize(d.size) + "px";
      })
      .on("click", function (d) {
        lock = true;
        filter.vorbesitzerin = addOrRemove(filter.vorbesitzerin, d.key);
        tags.filter();
        tags.update();
        lock = false;
      })
    // .on("mouseenter", function (d) {
    //   if (lock) return;
    //   filtercopy = Object.assign({}, filter);
    //   filtercopy.vorbesitzerin = addOrRemove(filter.vorbesitzerin, d.key)
    //   tags.filter(filtercopy);
    // })
    // .on("mouseleave", function (d) {
    //   if (lock) return;
    //   tags.filter();
    // })

    selection.exit()
      .classed("active", false)
      .classed("hide", true)


    selection
      .classed("active", function (d) {
        return filter.vorbesitzerin.indexOf(d.key) > -1;
      })
      .classed("hide", false)
    // .style("font-size", function (d) {
    //   return fontsize(d.size) + "px";
    // })

  }

  tags.init = function (_data, config) {
    // console.log("init tags", _data, config)
    data = _data;

    tags.updateFilters()


    // container.select("#kauferemi")
    //   .on("change", function () {
    //     var isChecked = d3.select(this).property("checked");
    //     // filter.emigrationverfolgung = isChecked ? "JA" : false;
    //     tags.filter();
    //   })
  }


  tags.update = function () {

    tags.updateFilters();
  }

  tags.filter = function (highlight) {
    console.log("update filter", filter, highlight)

    var filters = Object.entries(highlight || filter).filter(function (d) { return d[1].length; })
    // console.log(filters)
    data.forEach(function (d) {
      var active = filters.filter(function (f) {
        return f[1].indexOf(d[f[0]]) > -1;
      }).length == filters.length;

      if (highlight) {
        d.highlight = active;
      } else {
        d.active = d.highlight = active;
      }
    })
    canvas.highlight();
    if (!highlight) canvas.project();
  }


  return tags;
}