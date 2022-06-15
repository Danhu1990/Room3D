# Room3D

## Introduction


Room3D is a javascript plugin which you can use it to create a 3D room or box by html&css so easily.  
It is light-weight and no need to rely on any other library. We design it just for help developers to quick create some simple 3D scene, or be used for some simple web 3D effects. If you need to create some huge complicated scene in your project, and hope it has a perfect render effect, you may not be content for it. We suggest to use some library which it based on WebGL like threeJs/babylonJs.
  
————  Author: DAN 

***
[English Document](readme.md) &nbsp;&nbsp; | &nbsp;&nbsp; 中文文档 &nbsp;&nbsp;|&nbsp;&nbsp; [DEMO on gitee](http://dan90s.gitee.io/room3d) &nbsp;&nbsp;|&nbsp;&nbsp; [DEMO on git](https://danhu1990.github.io/Room3D/) &nbsp;&nbsp;|&nbsp;&nbsp; [Github Repository](https://github.com/Danhu1990/Room3D) &nbsp;&nbsp;|&nbsp;&nbsp; [Npm Package](https://www.npmjs.com/package/room3d) 

---
![Room3D show](docs/img/show.jpg) 

![Room3D show2](docs/img/show2.png)  

## Get Started


1. After installed plugin you can get a constructor named `Scene3D` 
   + Import plugin with script tag `<script src="room3d.js"></script>` , or  
   + Install plugin by npm  `npm install room3d` , then
     - use `const Scene3D = require("room3d")` or
     - `import Scene3D from "room3d"` to get `Scene3D` constructor.
  
2. Import stylesheet `room3d.css`
   
3. Create HTML element `<div id="wraper"><div>` , you can use id or class as the css selector. You can also set css rules `width` and `height` for the element. If you don't, the plugin will set the rules `widt:100%; height:100%;` for it.
   
4. Now you can write javascript codes to create 3D scene and 3D elements by configurations.  
   
    ```javascript
    let myScene = new Scene3D("#wraper",{
      width:"400px",
      depth:"400px",
      rooms:[
        {
          height:"400px",
          boxes:[
            {
              width:"100px",
              depth:"100px",
              height:"100px",
              left:"150px",
              top:"160px",
              color:"green"
            }
          ]
        }
      ]
    })
    ```
## Relation Diagram

![Relation Diagram](docs/img/diagram.png) 

## API

### Scene Object

#### Options  

| Name | Type | Default | Description |
| :---- | :----: | :----: | ---- |
| **width** | string | "1000px" | The value must contain unit. Percentates are NOT supported|
| **depth** | string | "1000px" | The value must contain unit. Percentates are NOT supported |
| **offsetVer** | string | "-200px" | The initial vertical offset, negative means offset down, positive means offset up. Percentates are NOT supported |
| **rotateVer** | string | "70deg" | The initial vertical rotation of scene, it must be contain unit "deg", negative means reversed |
| **rotateHor** | string | "-40deg" | The initial horizontal rotation of scene, it must be contain unit "deg", negative means reversed |
| **scaleRat** | number | 0.8 | The initial scale of scene |
| **wheelScale** | boolean | true | Allow scale scene by mousewheel |
| **showGrid** | boolean | true | Show grid |
| **perspective** | number | 2000 | Recommend set the value between 800 to 8000, the bigger number the stronger sense of perspective |
| **dragRotate** | boolean | true | Allow rotate scene by mousedrag |
| **rotateFixed** | string | "aroundRestric" | It works only when the `dragRotate` set `true` . Optional value:<br/> "`around`" , "`aroundRestric`" (Around rotation with restrictions. you can just rotate between 0-90 degree on vertical direction. Specifically you can't rotate the scene upside down) "`horizontal`", "`vertical`" , "`verticalRestric`" (Vertical rotation with restrictions)|
| **rooms** | array | [ ] | Room configurations array, be used to create Room |

#### Methods  
  
Create a Scene object `let Scene = new Scene3D("#Scene1",{options...})` , it can use the methods below:

+ **`Scene.showGrid( boolean )`**
  - **Parameters**\
    boolean {boolean} | `Required` | True means visible, false means hidden

  - **Returns**\
    Return this current Scene object, which be use for chain calling.

  - **Details**\
    To show or hide the grid of scene.
      
+ **`Scene.resetScene()`**
  - **Parameters**\
    \-

  - **Returns**\
    Return this current Scene object, which be use for chain calling.
    
  - **Details**\
    Reset the scene rotation and scale to initial status.

+ **`Scene.buildRoom( options )`**
  - **Parameters**\
    options {object} | `Optional` | Options object, refer to Room configurate options

  - **Returns**\
    Return the new Room object
    
  - **Details**\
    Use the options that passed in to create room manually. If it's empty, will use the default options.


***

### Room Object

#### Options  

| Name | Type | Default | Description |
| :---- | :----: | :----: | ---- |
| **className** | string | "" | That will be use for Room dom element's class name after concatenated with `"Room3D_room_"` . |
| **width** | string | "100%" | The value must contain unit. Percentates are supported |
| **depth** | string | "100%" | The value must contain unit. Percentates are supported |
| **height** | string | "300px" | The value must contain unit. Percentates are NOT supported |
| **left** | string | "auto" | Distance from Room to the left edge of Scene, the value must contain unit. You can also set percentates or `"auto"` as the value. |
| **top** | string | "auto" | Distance from Room to the back edge of Scene, the value must contain unit. You can also set percentates or `"auto"` as the value. |
| **right** | string | "auto" | Distance from Room to the right edge of Scene, the value must contain unit. You can also set percentates or `"auto"` as the value. |
| **bottom** | string | "auto" | Distance from Room to the fore edge of Scene, the value must contain unit. You can also set percentates or `"auto"` as the value. |
| **showWall** | boolean | true | Show wall |
| **wallColor** | string | "#ddd" | Wall color |
| **wallOpacity** | number | 0.9 | Wall opacity |
| **wallBackFace** | string | "hidden" | Set style rule `backface-visibility` for wall element, the optional values are `"hidden"` and `"visible"` |
| **showLine** | boolean | true | Show corner line |
| **lineColor** | string | "#666" | Corner line color, you can set all the color types which supported by css |
| **lineOpacity** | number | 1 | Corner line opacity |
| **lineWidth** | string | "1px" | Corner line width |
| **showFloor** | boolean | true | Show floor |
| **floorColor** | string | "#444" | Floor color, you can set all the color types which supported by css |
| **floorOpacity** | number | 1 | Floor opacity |
| **boxes** | array | [ ] | Box objects configurations array |

The options `top` `right` `bottom` `left` are use for locate Room's horizontal position relative to the Scene, you just need to set only one of `left` and `right` . And the same as `top` and `bottom` .\
For the definitions of width, depth and height, you can see the diagram at the top of this document.

#### Methods

Create and get a Room object by `let Room = Scene.buildRoom()` . If you want to get a existing Room, you can get it by `let Room = Scene.rooms[index]` . It can use the methods below:

+ **`Room.showFloor( boolean )`**
+ **`Room.showWall( boolean )`**
+ **`Room.showLine( boolean )`** 
  - **Parameters**\
    boolean {boolean} | `Required` | True means visible, false means hidden
  
  - **Returns**\
    Return this Room object that be use for chain calling

  - **Details**\
    Be use for show or hide Floor, Walls and Corner Lines.

+ **`Room.backface( value )`** 
  - **Parameters**\
    value {string} | `Required` | The optional values are `"hidden"` and `"visible"` .
  
  - **Returns**\
    Return this Room object that be use for chain calling.

  - **Details**\
    Be use for set the value of css rule `backface-visibility` of Wall elements. Specifically, If set `"hidden"`, the side which facing the screen of wall will become transparent. So that the elements in the Room can be seen, and it does not block the mouse events on this elements in the Room.

+ **`Room.buildDoor( wall , doorOptions )`**
  - **Parameters**\
    wall {string} | `Required` | The optional values are: `"left"` , `"right"` , `"fore"` and `"back"`<br/>
    doorOptions {object} | `Optional` | Door object configurations, refer to the configurations below.

  - **Returns**\
    Return the new Door object
    
  - **Details**\
    Use the options that passed in to create a Door manually
    ##### Door Options
    | Name | Type | Default | Description |
    | :---- | :----: | :----: | ---- |
    | **className** | string | "" | That will be use for Door dom element's class name after concatenated with `"Room3D_door_"`  |
    | **width** | string | "60px" | The value must contain unit, Percentages are supported |
    | **height** | string | "120px" | The value must contain unit, Percentages are supported |
    | **left** | string | "50%" | Distance from Door to the left edge of Wall, the value must contain unit. Percentages are supported. |
    | **right** | string | \- | Distance from Door to the right edge of Wall, the value must contain unit. Percentages are supported. Notice that if you want to position the Door with `right` option, you must set `"auto"` for the `left` option|
    | **show** | boolean | true | Show Doors, If set to `false` , you will only see a rectangular hole in the wall. |
    | **type** | string | "single left" | Type of Door. Optional values are: `"single left"` single Door with left shaft, `"single right"` single Door with right shaft, `"double"` double Doors. |
    | **openSide** | string | "outside" | Direction of Door opening. Optional values are: `"outside"` and `"inside"`  |
    | **color** | string | "#634A42" | Color of Door. |
    | **doorFrameWidth** | string | "3px" | The width of Door frame, the value must contain unit, Percentages are NOT supported. |
    | **doorFrameColor** | string | "#3B2A24" | Color of Door frame |
    ##### Door Methods 
    Use `let Door = Room.buildDoor( wall , doorArray )[index]` or `let Door = Room.walls[wall].doors[index]` to get Door object, it can use the methods below:
    + **`Door.openDoor()`** Open the door
    + **`Door.closeDoor()`** Close the door

+ **`Room.buildBox( options )`**
  - **Parameters**\
    options {object} | `Optional` | Options object, refer to Box configurate options

  - **Returns**\
    Return the new Box object
    
  - **Details**\
    Use the options that passed in to create Box manually. If it's empty, will use the default options.

+ **`Room.destroy()`**
  - **Parameters**\
    \-

  - **Returns**\
    \-
    
  - **Details**\
    Destroy Room object

***

### Box Object

#### Options  

| Name | Type | Default | Description |
| :---- | :----: | :----: | ---- |
| **className** | string | "" | That will be use for Box dom element's class name after concatenated with `"Box3D_box_"` . |
| **name** | string | "" | Box name that will be displayed in Marker content |
| **width** | string | "100%" | The value must contain unit. Percentates are supported |
| **depth** | string | "100%" | The value must contain unit. Percentates are supported |
| **height** | string | "100%" | The value must contain unit. Percentates are supported |
| **left** | string | "auto" | Distance from Box to the left edge of Room, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value |
| **top** | string | "auto" | Distance from Box to the back edge of Room, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value |
| **right** | string | "auto" | Distance from Box to the right edge of Room, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value |
| **bottom** | string | "auto" | Distance from Box to the fore edge of Room, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value |
| **offsetZ** | string | "0px" | Vertical offset, the value must contain unit. negative means offset down, positive means offset up. Percentates are NOT supported |
| **rotateX** | string | "0deg" | The angle of rotation around X axis, must contain unit "deg" |
| **rotateY** | string | "0deg" | The angle of rotation around Y axis, must contain unit "deg" |
| **rotateZ** | string | "0deg" | The angle of rotation around Z axis, must contain unit "deg" |
| **opacity** | number | 1 | Box opacity |
| **color** | string | "#999" | Box color, you can set all the color types which supported by css |
| **showLine** | boolean | true | Show Box border |
| **lineColor** | string | "#666" | Box border color, you can set all the color types which supported by css |
| **lineOpacity** | number | 1 | Box border opacity |
| **lineWidth** | string | "1px" | Box border width |
| **marker** | object | { } | Marker configurations |

  The options `top` `right` `bottom` `left` are use for locate Box's horizontal position relative to the corresponding Room, you just need to set only one of `left` and `right` . And the same as `top` and `bottom` .

#### Methods 

Create a Marker object by `let Box = Room.buildBox()` then get it. If you want to get a existing Marker, you can get it by `let Box = Room.boxes[index]` . It can use the methods below:

+ **`Box.showLine( boolean )`** 
+ **`Box.showMarker( boolean )`** 
  - **Parameters**\
    boolean {boolean} | `Required` | Pass in true to show, and false to hide
  
  - **Returns**\
    Return this Box object, which be use for chain calling

  - **Details**\
    Be use for show or hide the border line and Marker.

+ **`Box.buildMarker( options )`**
  - **Parameters**\
    options {object} | `Optional` | Marker configurations

  - **Returns**\
    Return the new Marker
    
  - **Details**\
    There is a correspooding Marker object is create automatically at each Box object created. So the method `updateMarker()` actually destroys the original Marker first, and then creates a new Marker with the new configurations. If you just want to update content of Marker, you can use the method `updateMarker()` of Marker object.

+ **`Box.destroy()`**
  - **Parameters**\
    \-

  - **Returns**\
    \-
    
  - **Details**\
    Destroy Box object

***

### Marker Object

#### Options  

| Name | Type | Default | Description |
| :---- | :----: | :----: | ---- |
| **width** | string | "auto" | The value must contain unit. Percentates are NOT supported. |
| **height** | string | "auto" | The value must contain unit. Percentates are NOT supported. |
| **left** | string | expression | Distance from Marker center to the left edge of scene, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value |
| **top** | string | expression | Distance from Marker center to the back edge of scene, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value|
| **right** | string | "auto" |Distance from Marker center to the right edge of scene, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value|
| **bottom** | string | "auto" | Distance from Marker center to the fore edge of scene, the value must contain unit. You can also set percentates, negatives or `"auto"` as the value|
| **offsetZ** | string | expression | Suspension height of Marker, The value must contain unit. Percentage and `"auto"` are NOT supported. |
| **show** | boolean | true | Show Marker |
| **lineColor** | string | "#666" | Marker connection line color |
| **lineWidth** | string | "1px" | Marker connection line color width |
| **fontSize** | string | "14px" | Marker content font size |
| **fontColor** | string | "#ffffff" | Marker content font color |
| **backgroundColor** | string | "rgba(36, 212, 174, 0.9)" | Background color of Marker, since not provide opacity option with Marker object configuration, If you need translucent effect, you can set the color with alpha channel |
| **content** | string | "\<h4\>\{\{params.title\}\}\<\/h4>" | Marker content template, which can use the form {{params.propertyName}} as a placeholder to receive arguments passed in by property "params". You can edit richer templates using HTML strings. |
| **params** | object |\{title:box.options.name \|\| "Marker"\}| Save the parameters that need to be passed, It be use for parse Marker content template. There is a property named "title" by default, which takes name option of the box which bound this Marker as value |

Since in DOM structure the Marker elements are created directly in scene element, so their `top` `right` `bottom` `left` are positioned relative to the scene element. You just set only one between `left` and `right` . And the same as `top` and `bottom`. And since the default value of `left` and `top` is an expression that makes the Marker be created right above the box. So if you want to use `right` and `bottom` for positioning, you must set the corresponding `left` and `top` values to `auto` . 

#### Methods 

Create and get a Marker object by `let Marker = Box.buildMarker()` . If you want to get a existing Marker, you can get it by `let Marker = Box.marker` . It can use the methods below:

+ **`Marker.updateMarker( params )`** 
  - **Parameters**\
    params {object} | `Required` | The params object must contain properties that match the Marker content template and the values that need to be updated.
  
  - **Returns**\
    Return this Marker object

  - **Details**\
    Be use for update Marker content template.

+ **`Marker.destroy()`**
  - **Parameters**\
    \-

  - **Returns**\
    \-
    
  - **Details**\
    Destroy Marker object

***

## Notice


1. All the options of length and distance must set the same unit, "px" is recommended. Otherwise there will be some bugs due to the unit conversion. 
   
2. If two immediately adjacent rooms that need to create doors on adjacent walls, you need to use `buildDoor()` method for the corresponding wall objects of both rooms on the symmetrical positions while set one of the doors invisable, then you can achieve it.
   
3. You can also add css rule `background-image` for various elements in the scene, simulate mapping effect to achieve richer scene
   
   
## NPM Package Versions & Updates

+ `1.0.0` Release date: 2022/6/8
  - `1.0.1` & `1.0.2` Release date：2022/6/8
    + Modify readme.md
  - `1.1.0` Release date: 2022/6/15
    + Marker object add property `scene` , its value points to the current Scene objec.
    + Box object add method `.destroy()` 
    + Room object add method `.destroy()` 

## Others


![Calculation diagram](docs/img/other.png)