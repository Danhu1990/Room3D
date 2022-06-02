//Author:DAN
//Version:1.0.0
//PluginName:Room3D
"use strict";
(function(){
  //公用函数****************************************************************************************
  //合并参数------------------------
  function mergeOptions(defaultOptn_,customOptn_){
    //深拷贝一份默认配置
    let options_ = JSON.parse(JSON.stringify(defaultOptn_))
    //将传入的配置项与默认配置合并
    for(let opt_d in options_){
      for(let opt in customOptn_){
        if(opt_d == opt){
          options_[opt] = customOptn_[opt]
        }
      }
    }
    return options_
  }
  //字符串转html对象---------------------
  function toHtmlList(string_){
    let list = document.createElement("div"),
        doms = []
    list.innerHTML = string_
    for (let i=0; i<list.children.length; i++){
      doms.push(list.children[i])
    }
    return doms
  }
  //显示隐藏元素---------------------------
  function showElement(target_,boolean_){
    if(target_.length){
      for(let i =0; i<target_.length; i++){
        target_[i].style.visibility = boolean_? "visible":"hidden"
      }
    }else{
      target_.style.visibility = boolean_? "visible":"hidden"
    }
  }
  //Scene3D构造函数****************************************************************************************
  function Scene3D(wraper_,options_) {
    let this_ = this
    //默认配置-----------------------------
    const optionsDefault = {
      width:"1000px",//场景宽度，不允许百分比
      depth:"1000px",//场景进深，不允许百分比
      offsetVer:"-200px",//垂直位置，负数为向下偏移，正数向上偏移，不允许百分比
      rotateVer:"70deg",//初始垂直旋转角度，负值为反方向旋转
      rotateHor:"300deg",//初始水平旋转角度，负值为反方向旋转
      scaleRat:0.8,//初始缩放比例，不允许负值
      showGrid:true,//是否显示网格
      rooms:[]//房间对象
    }
    
    //合并参数
    this_.options = mergeOptions(optionsDefault,options_)
    let sOptions = this_.options

    //组装场景-----------------------------
    this_.scene = document.querySelector(wraper_)
    this_.sceneWraper = document.createElement("div")
    this_.sceneGround = document.createElement("div")
    this_.sceneGrid = document.createElement("div")

    let scene = this_.scene,
        sceneWraper = this_.sceneWraper,
        sceneGround = this_.sceneGround,
        sceneGrid = this_.sceneGrid

    //初始化场景样式
    scene.className = scene.className + "Room3D_Scene"
    sceneWraper.className = "Room3D_SceneWraper"
    sceneGround.className = "Room3D_SceneGround"
    sceneGrid.className = "Room3D_SceneGrid"

    
    if(sOptions.width.includes("%") || sOptions.depth.includes("%")){
      console.error("The value of Scene width and depth can not be percentage")
      console.error("场景的宽度值和进深不能使用百分比")
      return
    }
    sceneWraper.style.width = sOptions.width  
    sceneWraper.style.height = sOptions.depth
    sceneWraper.style.marginLeft = -parseFloat(sOptions.width)/2 +"px"
    sceneWraper.style.marginTop = -parseFloat(sOptions.depth)/2 +"px"   
    //初始化三维状态
    sceneWraper.style.transform = "scale("+sOptions.scaleRat+")"
    sceneGround.style.transform = "rotateX(" + sOptions.rotateVer + ") rotateY(0deg) rotateZ(" +  sOptions.rotateHor +")" 
    sceneGround.style.top = -parseFloat(sOptions.offsetVer)+"px"
    //组装
    sceneGround.appendChild(sceneGrid)
    sceneWraper.appendChild(sceneGround)
    scene.appendChild(sceneWraper)
    //绘制网格
    for(let i =0,l=30; i<=l; i++){
      let gridW = sceneGrid.offsetWidth,
          gridH = sceneGrid.offsetHeight,
          space_W = i*gridW/l,
          space_H = i*gridH/l,
          hr = '<hr class="sceneGrid SceneGrid_H" style="top:'+space_H+'px"/><hr class="sceneGrid SceneGrid_V" style="left:'+space_W+'px"/>'
      sceneGrid.innerHTML+=hr
    }
    
    this_.showGrid(sOptions.showGrid)

    //拖拽动作-----------------------------
    scene.ondragstart = function(){return false}//禁用默认拖拽行为
    let dragStatus = false,//初始拖拽状态
        moveStart,//拖拽开始点
        rotateZ//拖拽开始Z轴角度

    scene.addEventListener("mousedown",function(e){
      dragStatus = true//按下鼠标开启拖拽
      moveStart = e.clientX
      let transform_ = sceneGround.style.transform,//获取SceneGround的transform值
          reg = /rotateZ\((\-*\d+\.*\d*)deg\)/g
      rotateZ = Number(reg.exec(transform_)[1]);
      
      // let transform_marker = markers[0].style.transform,//获取标注的transform
      //     reg_marker = /rotateY\((\-*\d+\.*\d*)deg\)/g
      // rotateZ_marker = Number(reg_marker.exec(transform_marker)[1]);
      
    })
    document.addEventListener("mousemove",function(e){
      if(dragStatus){
        let moveX = moveStart - e.clientX
        sceneGround.style.transform = "rotateX(" + sOptions.rotateVer + ") rotateY(0deg) rotateZ(" + (rotateZ+moveX/10) +"deg)"//转动容器
        // for(let i=0; i<markers.length; i++){//转动标注，让标注始终朝向屏幕面
        //   markers[i].style.transform = "rotateX(270deg) rotateY("+(rotateZ_marker+moveX/10)+"deg) rotateZ(0deg)"
        // }
      }
    })
    document.addEventListener("mouseup",function(e){
      dragStatus = false//松开鼠标关闭拖拽
    })
    
    //创建房间-----------------------------

    //根据配置项创建房间
    this_.rooms = []
    for(let i =0; i<sOptions.rooms.length; i++){
      let room = new Room3D(sceneGround,sOptions.rooms[i],this_)
      this_.rooms.push(room)
    }
    return this;
  }
  //Scene3D原型设置----------------------------------
  Scene3D.prototype = {
    showGrid(boolean_){
      showElement(this.sceneGrid,boolean_)
    }
  }
  //定义房间构造函数****************************************************************************************
  function Room3D(scene_,roomOpt_,father_){
    let room_this_ = this
    //房间默认配置
    let roomDefaultOptn = {
      className:"",//房间名，将被用作房间容器的class类名
      width:"100%",//房间宽度
      depth:"100%",//房间进深
      height:"300px",//房间高度，不允许百分比
      left:"auto",//房间距场景左边缘距离
      top:"auto",//房间距场景后边缘距离
      right:"auto",//房间距场景右边缘距离
      bottom:"auto",//房间距场景前边缘距离
      showWall:true,//是否显示墙壁
      wallColor:"#ddd",//墙壁颜色
      wallOpacity:0.9,//墙壁透明度
      wallBackFace:"hidden",//墙背面是否透明
      showLine:true,//是否显示墙角线
      lineColor:"#666",//墙角线颜色
      lineOpacity:1,//墙角线透明度
      lineWidth:"1px",//墙角线粗细
      showFloor:true,//是否显示地板
      floorColor:"#444",//地板颜色
      floorOpacity:1,//地板透明度
      boxes:[]//盒子对象
    }
    //合并参数
    room_this_.options = mergeOptions(roomDefaultOptn,roomOpt_)
    let rOptions = room_this_.options

    //组建房间----------------
    //创建房间容器
    room_this_.roomWraper = document.createElement("div")
    let room = room_this_.roomWraper

    room.className = "Room3D_room "+ "Room3D_room_"+rOptions.className

    if(rOptions.width.includes("%")){//如果宽度传入的是百分比值则转成具体数值
      let father_width = parseFloat(father_.options.width),
          percent_ = parseFloat(rOptions.width)
      rOptions.width = percent_/100*father_width + "px"
    }
    if(rOptions.depth.includes("%")){//如果进深传入的是百分比值则转成具体数值
      let father_depth = parseFloat(father_.options.depth),
          percent_ = parseFloat(rOptions.depth)
      rOptions.depth = percent_/100*father_depth + "px"
    }

    room.style.width = rOptions.width
    room.style.height = rOptions.depth
    room.style.left = rOptions.left
    room.style.right = rOptions.right
    room.style.top = rOptions.top
    room.style.bottom = rOptions.bottom
    //创建地板-----------------
    room_this_.floor = document.createElement("div")
    room_this_.floor.className = "Room3D_floor"
    room_this_.floor.style.background = rOptions.floorColor
    room_this_.floor.style.opacity = rOptions.floorOpacity
    room.appendChild(room_this_.floor)

    //显示地板
    room_this_.showFloor(rOptions.showFloor)

    //创建墙壁----------------
    room_this_.walls = toHtmlList(
    `<div class="Room3D_wall Room3D_wall_left"><div><span></span></div></div>
    <div class="Room3D_wall Room3D_wall_right"><div><span></span></div></div>
    <div class="Room3D_wall Room3D_wall_fore"><div><span></span></div></div>
    <div class="Room3D_wall Room3D_wall_back"><div><span></span></div></div>`
    )
    //给墙加上高度
    if(rOptions.height.includes("%")){
      console.error("The value of Room height can not be percentage")
      console.error("场景的宽度值和进深不能使用百分比")
      return
    }
    for (let i=0; i<room_this_.walls.length; i++){
      if(room_this_.walls[i].className.includes("wall_left") || room_this_.walls[i].className.includes("wall_right") ){
        room_this_.walls[i].style.width = rOptions.depth
        room_this_.walls[i].firstElementChild.style.height = rOptions.height
      }else{
        room_this_.walls[i].firstElementChild.style.height = rOptions.height
      }
      //火狐浏览器下mask和backface同时设置在一个元素上会导致backface失效，所以增加span分别设置
      room_this_.walls[i].firstElementChild.firstElementChild.style.background = rOptions.wallColor
      room_this_.walls[i].firstElementChild.firstElementChild.style.opacity = rOptions.wallOpacity
      room.appendChild(room_this_.walls[i])
    }
    //显示墙壁
    room_this_.showWall(rOptions.showWall)
    //设置背面可见性
    room_this_.backface(rOptions.wallBackFace)

    //创建墙角线---------------
    room_this_.cornerlines = toHtmlList(
    `<span class="Box3D_line Box3D_line_left_hori"><span></span></span>
    <span class="Box3D_line Box3D_line_fore_hori"><span></span></span>
    <span class="Box3D_line Box3D_line_right_hori"><span></span></span>
    <span class="Box3D_line Box3D_line_back_hori"><span></span></span>
    <span class="Box3D_line Box3D_line_left_vert"><span></span></span>
    <span class="Box3D_line Box3D_line_fore_vert"><span></span></span>
    <span class="Box3D_line Box3D_line_right_vert"><span></span></span>
    <span class="Box3D_line Box3D_line_back_vert"><span></span></span>`)

    //固定墙角线位置
    for(let i=0; i<room_this_.cornerlines.length; i++){
      //线条位置
      if(room_this_.cornerlines[i].className.includes("_hori") ){
        room_this_.cornerlines[i].style.transform = "translateZ("+rOptions.height+")"
      }else{
        room_this_.cornerlines[i].style.width = rOptions.height
      }
      //线条粗细
      if(room_this_.cornerlines[i].className.includes("_left_hori") || room_this_.cornerlines[i].className.includes("_right_hori")){
        room_this_.cornerlines[i].style.width = rOptions.lineWidth
        room_this_.cornerlines[i].style.borderLeftWidth = rOptions.lineWidth
        room_this_.cornerlines[i].firstElementChild.style.left = "-"+rOptions.lineWidth
        room_this_.cornerlines[i].firstElementChild.style.borderLeftWidth = rOptions.lineWidth
      }
      if(room_this_.cornerlines[i].className.includes("_fore_hori") || room_this_.cornerlines[i].className.includes("_back_hori") || room_this_.cornerlines[i].className.includes("_vert")){
        room_this_.cornerlines[i].style.height = rOptions.lineWidth
        room_this_.cornerlines[i].style.borderTopWidth = rOptions.lineWidth
        room_this_.cornerlines[i].firstElementChild.style.top = "-"+rOptions.lineWidth
        room_this_.cornerlines[i].firstElementChild.style.borderTopWidth = rOptions.lineWidth
      }
      //线条颜色和透明度
      room_this_.cornerlines[i].style.borderColor = rOptions.lineColor
      room_this_.cornerlines[i].style.opacity = rOptions.lineOpacity
      room_this_.cornerlines[i].firstElementChild.style.borderColor = rOptions.lineColor

      room.appendChild(room_this_.cornerlines[i])
    }

    //显示墙角线
    room_this_.showLine(rOptions.showLine)

    //将组建好的房间放入场景
    scene_.appendChild(room)
    
    //根据配置项创建盒子----------
    room_this_.boxes = []
    for(let i =0; i<rOptions.boxes.length; i++){
      let box = new Box3D(room,rOptions.boxes[i],room_this_)
      room_this_.boxes.push(box)
    }
    return this
  }
  //Room原型设置---------------
  Room3D.prototype = {
    showFloor(boolean_){
      showElement(this.floor,boolean_)
    },
    showWall(boolean_){
      for (let i=0; i<this.walls.length; i++){
        showElement(this.walls[i].firstElementChild,boolean_)
      } 
    },
    showLine(boolean_){
      showElement(this.cornerlines,boolean_)
    },
    backface(value){
      for(let i=0; i<this.walls.length; i++){
        this.walls[i].firstElementChild.style.backfaceVisibility = value
      }
      return this
    },
    digHole(target_,width_,height_,left_,bottom_){
      console.log(target_,width_,height_,left_,bottom_);
    }
  }
  //创建盒子构造函数****************************************************************************************
  function Box3D(room_,boxOpt_,father_){
    let box_this_ = this
    //盒子默认配置
    let boxDefaultOptn = {
      className:"",//盒子名，将被用作盒子类名
      width:"100%",//盒子宽度
      depth:"100%",//盒子进深
      height:"100%",//盒子高度
      left:"auto",//盒子距离房间左边缘距离
      top:"auto",//盒子距离房间后边缘距离
      right:"auto",//盒子距离房间右边缘距离
      bottom:"auto",//盒子距离房间前边缘距离
      offsetVer:"0px",//垂直偏移
      rotateHor:"0deg",//水平旋转
      opacity:1,//盒子透明度
      color:"#999",//盒子颜色
      showLine:true,//显示线条
      lineColor:"#666",//线条颜色
      lineOpacity:1,//线条透明度
      lineWidth:"1px"//线条宽度
    }
    //合并参数
    box_this_.options = mergeOptions(boxDefaultOptn,boxOpt_)
    let bOptions = box_this_.options
    //组装盒子-------------
    box_this_.boxWraper = document.createElement("div")
    let box = box_this_.boxWraper

    box.className = "Room3D_box "+ "Room3D_box_"+bOptions.className
    box.style.width = bOptions.width
    box.style.height = bOptions.depth
    box.style.left = bOptions.left
    box.style.right = bOptions.right
    box.style.top = bOptions.top
    box.style.bottom = bOptions.bottom

    //创建盒子六面
    box_this_.cornerlines = []
    box_this_.sides = toHtmlList(
    `<div class="Room3D_box_side Room3D_box_bottom"><div><span></span></div></div>
    <div class="Room3D_box_side Room3D_box_left"><div><span></span></div></div>
    <div class="Room3D_box_side Room3D_box_right"><div><span></span></div></div>
    <div class="Room3D_box_side Room3D_box_fore"><div><span></span></div></div>
    <div class="Room3D_box_side Room3D_box_back"><div><span></span></div></div>
    <div class="Room3D_box_side Room3D_box_top"><div><span></span></div></div>`)

    if(bOptions.height.includes("%")){//如果传入的盒子高度为百分比则转成具体数值
      let father_height = parseFloat(father_.options.height),
          percent_ = parseFloat(bOptions.height)
      bOptions.height = percent_/100*father_height + "px"
    }
    for (let i=0; i<box_this_.sides.length; i++){
      if(box_this_.sides[i].className.includes("box_left") || box_this_.sides[i].className.includes("box_right") ){
        box_this_.sides[i].style.width = bOptions.height
      }else if(box_this_.sides[i].className.includes("box_fore") || box_this_.sides[i].className.includes("box_back")){
        box_this_.sides[i].style.height = bOptions.height
      }else if (box_this_.sides[i].className.includes("box_top")){
        box_this_.sides[i].style.transform = "translateZ("+bOptions.height+")"
      }
      box_this_.sides[i].style.background = bOptions.color//盒子颜色
      box_this_.sides[i].style.opacity = bOptions.opacity//盒子透明度
      //线条设置
      box_this_.sides[i].firstElementChild.firstElementChild.style.borderColor=bOptions.lineColor
      box_this_.sides[i].firstElementChild.firstElementChild.style.opacity=bOptions.lineOpacity
      box_this_.sides[i].firstElementChild.firstElementChild.style.borderWidth=bOptions.lineWidth
      //线条存入盒子对象
      box_this_.cornerlines.push(box_this_.sides[i].firstElementChild.firstElementChild)
      box.appendChild(box_this_.sides[i])
    }
    //设置显示线条
    box_this_.showLine(bOptions.showLine)

    //将组建好的盒子放入房间
    room_.appendChild(box)
    return this
  }
  //Box原型设置-----
  Box3D.prototype = {
    showLine(boolean_){
      showElement(this.cornerlines,boolean_)
    }
  }
  //模块导出****************************************************************************************
  window.Scene3D = Scene3D
})();