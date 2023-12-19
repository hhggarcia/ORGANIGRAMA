// EXTRAER INFORMACION DE LA LISTA 
// DE LOS USUARIOS DEL BNC PARA EL ORGANIGRAMA
async function GetInfoPeople(){
    return new Promise( function (resolve, reject){
        $.ajax({
            url : _spPageContextInfo.siteAbsoluteUrl + "/_api/lists/getbytitle('Organigrama')/Items",
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function(data) {
                var items = data.d.results;    
                resolve(items);         
            },
            error: function(error) {
                reject(error);
            }
        });    
    });
}

// FUNCION PARA CREAR LA DATA PARA EL ARBOL DE LA
// [{key: Id, parent: Supervisor, name: Title, title: Cargo, source: Foto.Url}, {}, {}... ]
function OrderData(){
    var arrOrg = [];
}


function init() {
    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
    // For details, see https://gojs.net/latest/intro/buildingObjects.html
    const $ = go.GraphObject.make; // for conciseness in defining templates
    const divCreado = document.getElementById("myDiagramDiv");
    myDiagram = new go.Diagram(
      divCreado, // must be the ID or reference to div
      {
        allowCopy: false,
        allowDelete: false,
        //initialAutoScale: go.Diagram.Uniform,
        maxSelectionCount: 1, // users can select only one part at a time
        validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
        "clickCreatingTool.archetypeNodeData": {
          // allow double-click in background to create a new node
          name: "(new person)",
          title: "",
          comments: "",
        },
        "clickCreatingTool.insertPart": function (loc) {
          // method override must be function, not =>
          const node = go.ClickCreatingTool.prototype.insertPart.call(
            this,
            loc
          );
          if (node !== null) {
            this.diagram.select(node);
            this.diagram.commandHandler.scrollToPart(node);
            this.diagram.commandHandler.editTextBlock(
              node.findObject("NAMETB")
            );
          }
          return node;
        },
        layout: $(go.TreeLayout, {
          treeStyle: go.TreeLayout.StyleLastParents,
          arrangement: go.TreeLayout.ArrangementHorizontal,
          // properties for most of the tree:
          angle: 90,
          layerSpacing: 35,
          // properties for the "last parents":
          alternateAngle: 90,
          alternateLayerSpacing: 35,
          alternateAlignment: go.TreeLayout.AlignmentBus,
          alternateNodeSpacing: 20,
        }),
        "undoManager.isEnabled": true, // enable undo & redo
      }
    );

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", (e) => {
      const button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      const idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.slice(0, idx);
      }
    });

    const levelColors = ["#FD5000", "#001C4D", "#008B0D", "#7F7F7F", "#008299", "#D24726", "#008A00", "#094AB2"];

    // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
    myDiagram.layout.commitNodes = function () {
      // method override must be function, not =>
      go.TreeLayout.prototype.commitNodes.call(this); // do the standard behavior
      // then go through all of the vertexes and set their corresponding node's Shape.fill
      // to a brush dependent on the TreeVertex.level value
      myDiagram.layout.network.vertexes.each((v) => {
        if (v.node) {
          const level = v.level % levelColors.length;
          const color = levelColors[level];
          const shape = v.node.findObject("SHAPE");
          if (shape)
            shape.stroke = $(go.Brush, "Linear", {
              0: color,
              1: go.Brush.lightenBy(color, 0.05),
              start: go.Spot.Left,
              end: go.Spot.Right,
            });
        }
      });
    };

    // this is used to determine feedback during drags
    function mayWorkFor(node1, node2) {
      if (!(node1 instanceof go.Node)) return false; // must be a Node
      if (node1 === node2) return false; // cannot work for yourself
      if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
      return true;
    }

    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle() {
      return { font: "9pt  Segoe UI,sans-serif", stroke: "black" };
    }

    // This converter is used by the Picture.
    function findHeadShot(pic) {
      if (!pic) return "http://demowebsharepoi:13773/Pic%20Organigrama/FOTOSORGANIGRAMA/perfil%20vacio.jpg?csf=1&e=c7qGuu"; // There are only 16 images on the server
      return pic;
    }

    // define the Node template
    myDiagram.nodeTemplate = $(
      go.Node,
      "Spot",
      {
        selectionObjectName: "BODY",
        mouseEnter: (e, node) =>
          (node.findObject("BUTTON").opacity = node.findObject(
            "BUTTONX"
          ).opacity =
            1),
        mouseLeave: (e, node) =>
          (node.findObject("BUTTON").opacity = node.findObject(
            "BUTTONX"
          ).opacity =
            0),
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          const shape = node.findObject("SHAPE");
          if (shape) {
            shape._prevFill = shape.fill; // remember the original brush
            shape.fill = "darkred";
          }
        },
        mouseDragLeave: (e, node, next) => {
          const shape = node.findObject("SHAPE");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill; // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first(); // assume just one Node in selection
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            const link = selnode.findTreeParentLink();
            if (link !== null) {
              // reconnect any existing link
              link.fromNode = node;
            } else {
              // else create a new link
              diagram.toolManager.linkingTool.insertLink(
                node,
                node.port,
                selnode,
                selnode.port
              );
            }
          }
        },
      },
      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      new go.Binding("layerName", "isSelected", (sel) =>
        sel ? "Foreground" : ""
      ).ofObject(),
      $(
        go.Panel,
        "Auto",
        { name: "BODY" },
        // define the node's outer shape
        $(go.Shape, "Rectangle", {
          name: "SHAPE",
          fill: "#FFFFFF",
          stroke: "black",
          strokeWidth: 3.5,
          portId: "",
        }),
        $(
          go.Panel,
          "Horizontal",
          $(
            go.Picture,
            {
              name: "Picture",
              desiredSize: new go.Size(70, 70),
              margin: 1.5,
              source: "http://demowebsharepoi:13773/Pic%20Organigrama/FOTOSORGANIGRAMA/perfil%20vacio.jpg?csf=1&e=c7qGuu", // the default image
            },
            new go.Binding("source", "source", findHeadShot)
          ),
          // define the panel where the text will appear
          $(
            go.Panel,
            "Table",
            {
              minSize: new go.Size(130, NaN),
              maxSize: new go.Size(150, NaN),
              margin: new go.Margin(6, 10, 0, 6),
              defaultAlignment: go.Spot.Left,
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
            $(
              go.TextBlock,
              textStyle(), // the name
              {
                name: "NAMETB",
                row: 0,
                column: 0,
                columnSpan: 5,
                font: "12pt Segoe UI,sans-serif",
                editable: true,
                isMultiline: false,
                minSize: new go.Size(50, 16),
              },
              new go.Binding("text", "name").makeTwoWay()
            ),
            $(go.TextBlock, "Title: ", textStyle(), {
              row: 1,
              column: 0,
            }),
            $(
              go.TextBlock,
              textStyle(),
              {
                row: 1,
                column: 1,
                columnSpan: 4,
                editable: true,
                isMultiline: false,
                minSize: new go.Size(50, 14),
                margin: new go.Margin(0, 0, 0, 3),
              },
              new go.Binding("text", "title").makeTwoWay()
            ),
            $(
              go.TextBlock,
              textStyle(),
              { row: 2, column: 0 },
              new go.Binding("text", "key", (v) => "ID: " + v)
            ),
            $(
              go.TextBlock,
              textStyle(), // the comments
              {
                row: 3,
                column: 0,
                columnSpan: 5,
                font: "italic 9pt sans-serif",
                wrap: go.TextBlock.WrapFit,
                editable: true, // by default newlines are allowed
                minSize: new go.Size(100, 14),
              },
              new go.Binding("text", "comments").makeTwoWay()
            )
          ) // end Table Panel
        ) // end Horizontal Panel
      ), // end Auto Panel
      $(
        "Button",
        $(go.Shape, "PlusLine", { width: 10, height: 10 }),
        {
          name: "BUTTON",
          alignment: go.Spot.Right,
          opacity: 0, // initially not visible
          click: (e, button) => addEmployee(button.part),
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", (s) =>
          s ? 1 : 0
        ).ofObject()
      ),
      new go.Binding("isTreeExpanded").makeTwoWay(),
      $(
        "TreeExpanderButton",
        {
          name: "BUTTONX",
          alignment: go.Spot.Bottom,
          opacity: 0, // initially not visible
          _treeExpandedFigure: "TriangleUp",
          _treeCollapsedFigure: "TriangleDown",
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", (s) =>
          s ? 1 : 0
        ).ofObject()
      )
    ); // end Node, a Spot Panel

    // function addEmployee(node) {
    //   if (!node) return;
    //   const thisemp = node.data;
    //   myDiagram.startTransaction("add employee");
    //   const newemp = {
    //     name: "(new person)",
    //     title: "(title)",
    //     comments: "",
    //     parent: thisemp.key,
    //   };
    //   myDiagram.model.addNodeData(newemp);
    //   const newnode = myDiagram.findNodeForData(newemp);
    //   if (newnode) newnode.location = node.location;
    //   myDiagram.commitTransaction("add employee");
    //   myDiagram.commandHandler.scrollToPart(newnode);
    // }

    // the context menu allows users to make a position vacant,
    // remove a role and reassign the subtree, or remove a department
    myDiagram.nodeTemplate.contextMenu = $(
      "ContextMenu",
      $("ContextMenuButton", $(go.TextBlock, "Add Employee"), {
        click: (e, button) => addEmployee(button.part.adornedPart),
      }),
      $("ContextMenuButton", $(go.TextBlock, "Vacate Position"), {
        click: (e, button) => {
          const node = button.part.adornedPart;
          if (node !== null) {
            const thisemp = node.data;
            myDiagram.startTransaction("vacate");
            // update the key, name, picture, and comments, but leave the title
            myDiagram.model.setDataProperty(thisemp, "name", "(Vacant)");
            myDiagram.model.setDataProperty(thisemp, "pic", "");
            myDiagram.model.setDataProperty(thisemp, "comments", "");
            myDiagram.commitTransaction("vacate");
          }
        },
      }),
      $("ContextMenuButton", $(go.TextBlock, "Remove Role"), {
        click: (e, button) => {
          // reparent the subtree to this node's boss, then remove the node
          const node = button.part.adornedPart;
          if (node !== null) {
            myDiagram.startTransaction("reparent remove");
            const chl = node.findTreeChildrenNodes();
            // iterate through the children and set their parent key to our selected node's parent key
            while (chl.next()) {
              const emp = chl.value;
              myDiagram.model.setParentKeyForNodeData(
                emp.data,
                node.findTreeParentNode().data.key
              );
            }
            // and now remove the selected node itself
            myDiagram.model.removeNodeData(node.data);
            myDiagram.commitTransaction("reparent remove");
          }
        },
      }),
      $("ContextMenuButton", $(go.TextBlock, "Remove Department"), {
        click: (e, button) => {
          // remove the whole subtree, including the node itself
          const node = button.part.adornedPart;
          if (node !== null) {
            myDiagram.startTransaction("remove dept");
            myDiagram.removeParts(node.findTreeParts());
            myDiagram.commitTransaction("remove dept");
          }
        },
      })
    );

    // define the Link template
    myDiagram.linkTemplate = $(
      go.Link,
      go.Link.Orthogonal,
      { layerName: "Background", corner: 5 },
      $(go.Shape, { strokeWidth: 1.5, stroke: "#000000" })
    ); // the link shape

    // read in the JSON-format data from the "mySavedModel" element
    load();

    // support editing the properties of the selected person in HTML
    if (window.Inspector)
      myInspector = new Inspector("myInspector", myDiagram, {
        properties: {
          key: { readOnly: true },
          comments: {},
        },
      });

    // Setup zoom to fit button
    document
      .getElementById("zoomToFit")
      .addEventListener("click", () =>
        myDiagram.commandHandler.zoomToFit()
      );

    document
      .getElementById("centerRoot")
      .addEventListener("click", () => {
        myDiagram.scale = 1;
        myDiagram.commandHandler.scrollToPart(
          myDiagram.findNodeForKey(1)
        );
      });
} // end init

  // Show the diagram's model in JSON format
function save() {
    document.getElementById("mySavedModel").value =
      myDiagram.model.toJson();
    myDiagram.isModified = false;
}
async function load() {
    var data = [];
    const users = await GetInfoPeople();

    users.forEach(user => {
        if (user !== null) {
            if (user.Title !== "Junta Directiva") {
                data.push({ key: user.Id, parent: user.Supervisor_x002e_Id, name: user.Title, title: user.Cargo, source: user.Foto.Url });
            } else{
                data.push({ key: user.Id, name: user.Title, title: user.Cargo, source: user.Foto.Url });
            }
        }
    });

    // the same model as before
    myDiagram.model = new go.TreeModel(data);

}

window.addEventListener("DOMContentLoaded", init);

// [
//     { key: "1",              name: "Don Meow", title: "Hola", source: "2.png" },
//     { key: "2", parent: "1", name: "Demeter", title: "Hola", source: "3.png" },
//     { key: "3", parent: "1", name: "Copricat", title: "Hola", source: "4.png" },
//     { key: "4", parent: "3", name: "Jellylorum", title: "Hola", source: "5.png" },
//     { key: "5", parent: "3", name: "Alonzo",  title: "Hola", source: "6.png" },
//     { key: "6", parent: "2", name: "Munkustrap", title: "Hola", source: "7.png" }
//   ]