// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function (data) { //=> {

    // get the metadata field
    let metaData = data.metadata.find(item => item.id == sample);
console.log(metaData)

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metaData).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
  }

  // function to build both charts
  function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

      // Get the samples field
      let samples = data.samples;

      // Filter the samples for the object with the desired sample number
      var desiredSample = samples.filter(sampleData => sampleData.id == sample)

      // Get the otu_ids, otu_labels, and sample_values
      var otuIds = desiredSample[0].otu_ids;
      var otuLabels = desiredSample[0].otu_labels;
      var sampleValues = desiredSample[0].sample_values;

      // Build a Bubble Chart
      var trace1 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth'
        }
      };
      var data = [trace1];
      var layout = {
        title: 'Bubble Chart',
        showlegend: false,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
      };

      // Render the Bubble Chart
      Plotly.newPlot('bubble', data, layout);

      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      // Map the otu_ids to a list of strings for yticks in the Bar Chart
      var yticks = otuIds.map(id => `OTU ${id}`);

      // Build a Bar Chart
      var trace2 = {
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      };

      var data = [trace2];

      var layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID', tickvals: yticks.slice(0, 10).reverse() }
      };

      // Render the Bar Chart
      Plotly.newPlot('bar', data, layout);
    });
  }
  // Function to run on page load
  function init() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

      // Get the names field
      var names = data.names;

      // Use d3 to select the dropdown with id of `#selDataset`
      var dropdownMenu = d3.select("#selDataset");

      // Use the list of sample names to populate the select options
      // Hint: Inside a loop, you will need to use d3 to append a new
      // option for each sample name.
      names.forEach((name) => {
        dropdownMenu.append("option")
          .text(name)
          .attr("value", name);
      });

      // Get the first sample from the list
      var firstSample = names[0];
      console.log("First sample:", firstSample);

      // Build charts and metadata panel with the first sample
      optionChanged(firstSample); // Function to build charts
    });
  }
  // Function for event listener
  function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  };

  // Initialize the dashboard
  init();