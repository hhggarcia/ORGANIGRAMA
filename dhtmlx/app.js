

function GetTable(orgChartData){
    const diagram = new dhx.Diagram("diagram", {
        type: "org",
        defaultShapeType: "img-card" // the "img-card" type is used for shapes with images
    });
    diagram.data.parse(orgChartData);
}