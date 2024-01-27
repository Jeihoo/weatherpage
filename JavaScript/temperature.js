// Adding hamburger to navigation
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  
  let chart;
  // Function for fetching and showing the correct data with the correct timespan
  function fetchAndDisplayData(timespan) {
    switch (timespan) {
      case '20':
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/`;
        break;
      case '24':
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/24`;
        break;
      case '48':
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/48`;
        break;
      case '72':
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/72`;
        break;
      case '1week':
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/1week`;
        break;
      case '1month':
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/1month`;
        break;
      default:
        url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/24`;
    }
  
    // Fetching last timespan hours of temperature data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const table = document.getElementById('temperature-table');
        table.innerHTML = ''; // Clear the previous table content
  
        // Create table header
        const headerRow = table.insertRow();
        const dateHeader = headerRow.insertCell();
        const timeHeader = headerRow.insertCell();
        const tempHeader = headerRow.insertCell();
        dateHeader.textContent = 'Date';
        timeHeader.textContent = 'Time';
        tempHeader.textContent = 'Temperature (°C)';
  
        // Create table rows
        data.forEach(rowData => {
          const row = table.insertRow();
          const dateCell = row.insertCell();
          const timeCell = row.insertCell();
          const tempCell = row.insertCell();
          const date = new Date(rowData.date_time);
          dateCell.textContent = date.toLocaleDateString();
          timeCell.textContent = date.toLocaleTimeString('fi-FI', {hour12: false, hour: 'numeric', minute: 'numeric'});
          tempCell.textContent = Math.round(rowData.temperature);
        });
  
        // Update the chart
        const chartData = {
          labels: data.map(item => new Date(item.date_time).toLocaleTimeString()),
          datasets: [{
            label: 'Temperature (°C)',
            data: data.map(item => Math.round(item.temperature)),
            backgroundColor: 'rgba(75, 192, 92, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }]
        };
  
        if (chart) {
          chart.destroy();
        }
  
        chart = new Chart('temperature-chart', {
          type: 'line',
          data: chartData,
        });
        
        // Update the statistics
        const allTemperatures = data.map(item => Math.round(parseFloat(item.temperature)));
        const validTemperatures = allTemperatures.filter(value => !isNaN(value));
  
        const statsTable = document.createElement('table');
        const container = document.getElementById('statistics-container');
        container.innerHTML = ''; // Clear the previous statistics content
        container.appendChild(statsTable);
  
        const headerRowStats = statsTable.insertRow();
        headerRowStats.insertCell().textContent = 'Mean';
        headerRowStats.insertCell().textContent = 'Median';
        headerRowStats.insertCell().textContent = 'Mode';
        headerRowStats.insertCell().textContent = 'Range';
        headerRowStats.insertCell().textContent = 'Standard Deviation';
  
        const statsRow = statsTable.insertRow();
        statsRow.insertCell().textContent = mean(validTemperatures).toFixed(2);
        statsRow.insertCell().textContent = median(validTemperatures).toFixed(2);
        statsRow.insertCell().textContent = mode(validTemperatures).join(', ');
        statsRow.insertCell().textContent = range(validTemperatures).toFixed(2);
        statsRow.insertCell().textContent = standardDeviation(validTemperatures).toFixed(2);
        
      })
      
      .catch(error => console.error('Error:', error));
  }
  
  // Call the function initially with a 24-hour timespan
  fetchAndDisplayData(24);
  
  document.getElementById('timespan-select').addEventListener('change', (event) => {
    fetchAndDisplayData(event.target.value);
  });