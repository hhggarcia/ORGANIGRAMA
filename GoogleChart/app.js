google.charts.load('current', {packages:["orgchart"]});
google.charts.setOnLoadCallback(drawChart2);

function drawChart2() {
  var dataEjemplo = new google.visualization.DataTable();
  dataEjemplo.addColumn('string', 'Nombre');
  dataEjemplo.addColumn('string', 'Manager');
  dataEjemplo.addColumn('string', 'ID');
  dataEjemplo.addColumn('string', 'Imagen'); // Nueva columna para la URL de la imagen

  dataEjemplo.addRows([
    ['Juan', '', '1', 'images/hs1.png'],
    ['Pedro', 'Juan', '2', 'images/HS2.png'],
    ['Maria', 'Juan', '3', 'images/HS3.png'],
    ['Felipe', 'Pedro', '4', 'images/HS4.png'],
    ['Cristina', 'Pedro', '5', 'images/HS5.png'],
    ['Oscar', 'Maria', '6', 'images/HS6.png'],
    ['Gabriel', 'Maria', '7', 'images/HS7.png'],
    ['María Luisa', 'Felipe', '8', 'images/HS8.png'],
    ['Diana', 'Felipe', '9', 'images/HS9.png']
  ]);

  var options = {
    allowHtml: true,
    size: 'medium',
  };

  var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));

  // Establecer el contenido de cada nodo como una cadena de HTML que incluya la imagen correspondiente
  google.visualization.events.addListener(chart, 'ready', function () {
    var nodes = document.querySelectorAll('#chart_div .google-visualization-orgchart-node');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var imagen = dataEjemplo.getValue(i, 3);
      node.innerHTML = '<div><img src="' + imagen + '"></div><div>' + node.innerHTML + '</div>';
    }
  });

  chart.draw(dataEjemplo, options);
}

// function drawChart2() {


//   var dataEjemplo = new google.visualization.DataTable();
//   dataEjemplo.addColumn('string', 'Nombre');
//   dataEjemplo.addColumn('string', 'Manager');
//   dataEjemplo.addColumn('string', 'ID');

//   dataEjemplo.addRows([
//     ['Juan', '', '1'],
//     ['Pedro', 'Juan', '2'],
//     ['Maria', 'Juan', '3'],
//     ['Felipe', 'Pedro', '4'],
//     ['Cristina', 'Pedro', '5'],
//     ['Oscar', 'Maria', '6'],
//     ['Gabriel', 'Maria', '7'],
//     ['María Luisa', 'Felipe', '8'],
//     ['Diana', 'Felipe', '9']
//   ]);

//   var options = {
//     allowHtml: true,
//     size: 'medium',
//   };

//   var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));

//   chart.draw(dataEjemplo, options);
// }

// function drawChart() {
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'Name');
//   data.addColumn('string', 'Manager');
//   data.addColumn('string', 'ToolTip');

//   data.addRows([
//     ['Juan', '', '1'],
//     ['Pedro', 'Juan', '2'],
//     ['Maria', 'Juan', '3'],
//     ['Luis', 'Pedro', '4'],
//     ['Ana', 'Pedro', '5'],
//     ['Carlos', 'Pedro', '6'],
//     ['Sofia', 'Maria', '7'],
//     ['Pablo', 'Maria', '8'],
//     ['Lucia', 'Maria', '9'],
//     ['Jorge', 'Luis', '10'],
//     ['Laura', 'Luis', '11'],
//     ['Fernando', 'Luis', '12'],
//     ['Isabel', 'Ana', '13'],
//     ['Ricardo', 'Ana', '14'],
//     ['Carmen', 'Ana', '15']
//   ]);

//   var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
//   chart.draw(data, {allowHtml:true});


  // var data = new google.visualization.DataTable();
  // data.addColumn('string', 'Name');
  // data.addColumn('string', 'Manager');
  // data.addColumn('string', 'ToolTip');

  // For each orgchart box, provide the name, manager, and tooltip to show.
  // data.addRows([
  //   [{'v':'Mike', 'f':'Mike<div style="color:red; font-style:italic">President</div>'},
  //    '', 'The President'],
  //   [{'v':'Jim', 'f':'Jim<div style="color:red; font-style:italic">Vice President</div>'},
  //    'Mike', 'VP'],
  //   ['Alice', 'Mike', ''],
  //   ['Bob', 'Jim', 'Bob Sponge'],
  //   ['Carol', 'Bob', '']
  // ]);

  // Create the chart.
  // var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
  // Draw the chart, setting the allowHtml option to true for the tooltips.
  // chart.draw(data, {'allowHtml':true});

  // Paso 1: Crea un array de JSONs con la información de las personas
  // var data = [
  //   {id: 1, name: 'Juan', parent: null},
  //   {id: 2, name: 'Pedro', parent: 1},
  //   {id: 3, name: 'Maria', parent: 1},
  //   {id: 4, name: 'Luis', parent: 2},
  //   {id: 5, name: 'Ana', parent: 2},
  //   {id: 6, name: 'Carlos', parent: 3},
  //   {id: 7, name: 'Sofia', parent: 3},
  //   {id: 8, name: 'Pablo', parent: 4},
  //   {id: 9, name: 'Lucia', parent: 4},
  //   {id: 10, name: 'Jorge', parent: 5},
  //   {id: 11, name: 'Laura', parent: 5},
  //   {id: 12, name: 'Fernando', parent: 6},
  //   {id: 13, name: 'Isabel', parent: 6},
  //   {id: 14, name: 'Ricardo', parent: 7},
  //   {id: 15, name: 'Carmen', parent: 7},
  // ];

  // // Paso 2: Crea una tabla de datos de Google Chart a partir del array de JSONs
  // var dataTable = google.visualization.arrayToDataTable([
  //   ['ID', 'Nombre', 'Padre'],
  //   [null, 'Empresa', null],
  //   ...data.map(({id, name, parent}) => [id, name, parent]),
  // ]);

// }

// google.charts.load('current', {'packages':['treemap']});
// google.charts.setOnLoadCallback(drawChart);

// function drawChart() {
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'ID');
//   data.addColumn('string', 'Parent');
//   data.addColumn('number', 'Size');
//   data.addRows([
//     ['1', '', 10],
//     ['2', '1', 10],
//     ['3', '1', 10],
//     ['4', '2', 10],
//     ['5', '2', 10],
//     ['6', '3', 10],
//     ['7', '3', 10]
//   ]);

//   var tree = new google.visualization.TreeMap(document.getElementById('chart_div'));
//   tree.draw(data, {
//     minColor: '#f00',
//     midColor: '#ddd',
//     maxColor: '#0d0',
//     headerHeight: 15,
//     fontColor: 'black',
//     showScale: true,
//     maxDepth: 0
//   });
// }