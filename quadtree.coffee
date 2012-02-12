ctx = null

class Dot
    constructor: (@x, @y) ->
    draw: ->
        ctx.beginPath()
        ctx.arc(@x, @y, 3, 0, Math.PI*2, true)
        ctx.closePath()
        ctx.fill()
    
class Quadtree
    constructor: (args...) ->
        @node = new Node(args...)
        
    add: (shape) ->
        @node.add(shape)
        
    getShapes: (args...) ->
        nodes = []
        @node.getNodes(args, nodes)
        ctx.strokeStyle = "red"
        ctx.strokeRect(args...)
        
        console.log nodes
        
        for node in nodes
            ctx.fillStyle = "green"
            ctx.fillRect(node.x,node.y,node.w,node.h)
            
        shapes = []
        
        for node in nodes
            shapes = shapes.concat(node.shapes)
            
        ctx.fillStyle = "blue"
        for shape in shapes
            shape.draw()
        
        shapes
        

class Node
    constructor: (@x, @y, @w, @h) ->
        ctx.strokeRect(arguments...)
        @shapes = []
        @children = null
        
    add: (shape) ->
        if @shapes
            @shapes.push(shape)
            
            if @shapes.length > 2
                @children = [
                    new Node(@x, @y, @w / 2, @h / 2)
                    new Node(@x + @w / 2, @y, @w / 2, @h / 2)
                    new Node(@x, @y + @h / 2, @w / 2, @h / 2)
                    new Node(@x + @w / 2, @y + @h / 2, @w / 2, @h / 2)
                ]
                
                for shape in @shapes
                    for node in @children
                        if node.contains(shape)
                            node.add(shape)
                
                @shapes = null
        else
            for node in @children
                if node.contains(shape)
                    node.add(shape)
                    
    contains: (shape) ->
        @x < shape.x < @x + @w and @y < shape.y < @y + @h
        
    overlaps: (region) ->
        @x < region[0] + region[2] and @x + @w > region[0] and @y < region[1] + region[3] and @y + @h > region[1]
        
    getNodes: (region, nodes) ->
        for child in @children
            if child.overlaps(region)
                console.log "ye", child
                if child.shapes
                    nodes.push(child)
                else
                    child.getNodes(region, nodes)
        
    

$ ->
    canvas = $("canvas")
    ctx = canvas[0].getContext('2d')
    
    canvas
    .attr("width", $(window).width())
    .attr("height", $(window).height())
    
    circles = for i in [0..1000]
        x = Math.random() * 512
        y = Math.random() * 512
        new Dot(x, y)
        
    quad = new Quadtree(0, 0, 512, 512)
    
    for circle in circles
        circle.draw()
        quad.add(circle)
        
    quad.getShapes(150, 150, 50, 50)
    
    console.log quad
