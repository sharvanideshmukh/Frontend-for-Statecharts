jsPlumb.ready(function() {
	var numberOfShapes = 0;
	var htmlBase = 'flowchart-demo';
	var instance = jsPlumb.getInstance({
		DragOptions : { cursor: 'pointer', zIndex:2000 },
		ConnectionOverlays : [
			[ "Arrow", { location:1 } ],
			 ["Custom", {
                create:function(component) {
                    return $("<input id = 'my' size=10>");
                },
                location:0.5,
                id:"customOverlay"
            }]
		],
		Container:"flowchart-demo"
	});
	
	var connectorPaintStyle = {
		lineWidth:4,
		strokeStyle:"#61B7CF",
		joinstyle:"round",
		outlineColor:"white",
		outlineWidth:2
	},
	connectorHoverStyle = {
		lineWidth:4,
		strokeStyle:"#216477",
		outlineWidth:2,
		outlineColor:"white"
	},
	endpointHoverStyle = {
		fillStyle:"#216477",
		strokeStyle:"#216477"
	},
	sourceEndpoint = {
		endpoint:"Dot",
		paintStyle:{ 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:4,
			lineWidth:3 
		},				
		isSource:true,
		connector:[ "Flowchart", { cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
        dragOptions:{},
    
	},		
	targetEndpoint = {
		endpoint:"Dot",					
		paintStyle:{ fillStyle:"#7AB02C",radius:4 },
		hoverPaintStyle:endpointHoverStyle,
		maxConnections:-1,
		dropOptions:{ hoverClass:"hover", activeClass:"active" },
		isTarget:true,	
	},			
	init = function(connection) {	
			connection.bind("editCompleted", function(o) {
			if (typeof console != "undefined")
				console.log("connection edited. path is now ", o.path);
		});		
			//	connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
	};

	instance.registerConnectionTypes({
	  "connectorType":{ paintStyle: connectorPaintStyle,
	  	connector:[ "Flowchart", { cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle},
	  "connectorHover":{ paintStyle: connectorHoverStyle},
	});

	var _addTask = function() {
		numberOfShapes++;

		$('<div contenteditable = "true" class="window task node resizable" data-nodetype="task" id="flowchartWindow'+ numberOfShapes +'"></div>').appendTo('#'+htmlBase);

		_addEndpoints("Window"+numberOfShapes, ["BottomCenter","LeftMiddle","RightMiddle"], ["TopCenter"]);

		instance.draggable($('#flowchartWindow'+ numberOfShapes));
		
		id = 'flowchartWindow'+ numberOfShapes;
		return id
	};
	var _addQuestion = function() {
		numberOfShapes++;

		$('<div contenteditable = "true" class="shape question node" data-nodetype="question" id="flowchartWindow'+ numberOfShapes +'"></div>').appendTo('#'+htmlBase);

		_addEndpoints("Window"+numberOfShapes, ["LeftMiddle", "BottomCenter"], ["TopCenter"]);

		instance.draggable($('#flowchartWindow'+ numberOfShapes));
		id = 'flowchartWindow'+ numberOfShapes;
		return id
	};
	var _addEndpoints = function(toId, sourceAnchors, targetAnchors) {
			
		for (var i = 0; i < sourceAnchors.length; i++) {
			var sourceUUID = toId + sourceAnchors[i];
			instance.addEndpoint("flowchart" + toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID});
		}
		for (var j = 0; j < targetAnchors.length; j++) {
			var targetUUID = toId + targetAnchors[j];
			instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID });
		}
	};
	_addEndpoints("Startpoint", ["BottomCenter"], []);
	_addEndpoints("Endpoint", [], ["TopCenter"]);
	instance.draggable($("#flowchartStartpoint"));
	instance.draggable($("#flowchartEndpoint"));	
	
	

	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {

		// listen for new connections; initialise them the same way we initialise the connections at startup.
		instance.bind("connection", function(connInfo, originalEvent) { 
			init(connInfo.connection);
		});			
					
		// make all the window divs draggable						
		instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });		
		
		
		instance.bind("dblclick", function(conn, originalEvent) {
			if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
				jsPlumb.detach(conn); 


		});	
		
	});

	$(".button_add_task").click(function () {
		_addTask();
	});

	$(".button_add_question").click(function () {
		_addQuestion();
	});	

	jsPlumb.fire("jsPlumbDemoLoaded", instance);

	
	$(function(){
		$.contextMenu({
		selector: '.shape,.window', 
		callback: function(key, options) {
		    var m = "clicked: " + key;
		    window.console && console.log(m) || alert(m); 
		},
		items: {
		    "delete": {name: "Delete", icon: "delete", callback: function(key, options) {
				    if (confirm("Delete Shape " + key + "?")) {
				    	var id = $(this).attr('id');
				    	
						instance.detachAllConnections(id);
						instance.removeAllEndpoints(id);
						$(this).remove();
					}
				}},
		}
		});
	});
});


