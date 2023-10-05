function Tags() {

  var fontsize = d3.scale.linear().range([8, 17])

  var filter = { vorbesitzerin: [], alteanonymemoderne: [], stiftungfamilieanderes: [], raubkunst: [], emi: [], falsch: [] };
  var lock = false;
  var data;

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

    if (key === "vorbesitzerin") {
      console.log("updateDom", key, filteredData)
      fontsize.domain(d3.extent(filteredData, function (d) { return d.size; }))
    }

    if(key === "raubkunst") {
      filteredData = filteredData.filter(function(d) { return d.key != "Raubkunst" })
      var sorted = ["CH", "FR", "USA"]
      filteredData.sort(function(a, b) { 
        return sorted.indexOf(a.key) - sorted.indexOf(b.key)
      })
    }

    if(key === "stiftungfamilieanderes") {
      //Stiftung, Privatbesitz, anderes
      var sorted = ["Stiftung", "Privatbesitz", "anderes"]
      filteredData.sort(function(a, b) { 
        return sorted.indexOf(a.key) - sorted.indexOf(b.key)
      })
    }

    if(key === "alteanonymemoderne") {
      //Moderne, Alter Meister, Mittelalter, Fälschung
      var sorted = ["Moderne", "Alte Meister", "Mittelalter"]
      filteredData.sort(function(a, b) { 
        return sorted.indexOf(a.key) - sorted.indexOf(b.key)
      })
      console.log(filteredData)
    }

    var container = d3.select("." + key);
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
      })
      .filter(function (d) {
        return key === "vorbesitzerin"
      })
      .style("font-size", function (d) {
        return fontsize(d.size) + "px";
      })

    selection.exit()
      // .remove()
      .classed("active", false)
      .classed("hide", true)
      .filter(function (d) {
        return key === "vorbesitzerin"
      })
      .remove()
      .style("font-size", function (d) {
        return "11px";
      })


    selection
      .classed("active", function (d) {
        return filter[key].indexOf(d.key) > -1;
      })
      .classed("hide", false)
      .filter(function (d) {
        return key === "vorbesitzerin"
      })
      .style("font-size", function (d) {
        return fontsize(d.size) + "px";
      })
      .sort(function (a, b) {
        return b.size - a.size;
      })
  }

  tags.resize = function resize() {

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
          index[d[filterCur[0]]] = ++index[d[filterCur[0]]] || 1;
        }
      }
      var filteredData = Object.keys(index)
        .map(function (d) { return { key: d, size: index[d] }; })
        .sort(function (a, b) { return b.size - a.size; })
        .filter(function (d) { return d.key != "" && d.key != "undefined"; });

      // console.log("done", filterCur[0], filteredData)

      tags.updateDom(filterCur[0], filteredData)

    }
  }


  tags.init = function (_data, config) {
    // console.log("init tags", _data, config)
    data = _data;

    tags.updateFilters()
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