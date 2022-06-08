//Author:DAN
//Version:1.0.0
//PluginName:Room3D
"use strict";
(function(gloal){
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
  //将width,depth,height,left,top转成数值--------------------------
  function turnPxWDTL(f_w,f_d,f_h,w,d,h,lf,tp,rt,bt,ofZ,optn){
    if(w && w.includes("%")){//转换宽度
      let percent_ = parseFloat(w)
      w = percent_/100*f_w + "px"
    }
    if(d && d.includes("%")){//转换进深
      let percent_ = parseFloat(d)
      d = percent_/100*f_d + "px"
    }
    if(h && h.includes("%")){//转换高度
      let percent_ = parseFloat(h)
      h = percent_/100*f_h + "px"
    }
    //转换左边距值
    if(lf && lf !== "auto"){
      lf = lf.includes("%")? parseFloat(lf)/100*f_w+"px": lf
    }else{
      if(rt && rt !== "auto"){
        lf = rt.includes("%")?
        (f_w-parseFloat(rt)/100*f_w-parseFloat(w)) + "px":
        (f_w-parseFloat(rt)-parseFloat(w)) + "px"
      }else{
        lf = "0px"
      }
    }
    //转换上边距值
    if(tp && tp !== "auto"){
      tp = tp.includes("%")? 
      parseFloat(tp)/100*f_d+"px":
      tp
    }else{
      if(bt && bt !== "auto"){
        tp = bt.includes("%")?
        (f_d-parseFloat(bt)/100*f_d-parseFloat(d)) + "px":
        (f_d-parseFloat(bt)-parseFloat(d)) + "px"
      }else{
        tp = "0px"
      }
    }
    //转换垂直距离值
    if(ofZ){
      if(ofZ !== "auto"){
        ofZ = ofZ.includes("%")?
        parseFloat(ofZ)/100*f_h+"px":
        ofZ
      }else{
        ofZ = "0px"
      }
    }
    optn.width = w
    optn.depth = d
    optn.left = lf
    optn.top = tp
    if(ofZ){
      optn.offsetZ = ofZ
    }
    if(h){
      optn.height = h
    }
    return {w,d,h,lf,tp,ofZ}
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
  //计算marker旋转角度使其永远朝向屏幕-----------
  function faceMe(Rv,Rh,target_){
    let t = Math.PI/180,V0,V8,V9
    let rotateX_ , rotateY_ , rotateZ_ , mirrorY_

    V0 = Math.cos(parseFloat(Rh)*t)
    if(Math.cos(parseFloat(Rv)*t)>0){
      V8 = Math.sin(parseFloat(Rv)*t)*Math.sin(parseFloat(Rh)*t)
      V9 = Math.sin(parseFloat(Rv)*t)*Math.cos(parseFloat(Rh)*t)
      mirrorY_ = 1
    }else{
      V8 = -Math.sin(parseFloat(Rv)*t)*Math.sin(parseFloat(Rh)*t)
      V9 = -Math.sin(parseFloat(Rv)*t)*Math.cos(parseFloat(Rh)*t)
      mirrorY_ = -1
    }

    rotateX_ = Math.asin(-parseFloat(V9)/Math.cos(Math.asin(parseFloat(V8))))/t
    rotateY_ = Math.asin(parseFloat(V8))/t
    rotateZ_ = Math.sin(parseFloat(Rh)*t)>0?-Math.acos(parseFloat(V0)/Math.cos(Math.asin(parseFloat(V8))))/t : Math.acos(parseFloat(V0)/Math.cos(Math.asin(parseFloat(V8))))/t;

    target_.style.transform = "rotateX("+rotateX_+"deg) rotateY("+rotateY_+"deg) rotateZ("+rotateZ_+"deg)  translateY("+50*(-mirrorY_)+"%) scaleY("+mirrorY_+")" 

  }
  //marker标注根据传入的参数解析模板----------------
  function replaceParams(box,str,params){
    if(params.title==undefined){params.title = box.options.name || "Marker"}
    let reg = /{{params\.([a-zA-Z]+[0-9]*\_*[a-zA-Z]*[0-9]*)}}/g,
        str_new = str.replace(reg,function(r_,key){
          return params[key]
        })
    return str_new
  }
  //更新markerline旋转状态
  function markerLineRotate(line_,markerOption_,boxOption_,roomOption_){
    //计算连线长度
    let line_V = parseFloat(markerOption_.offsetZ)-parseFloat(boxOption_.height)-parseFloat(boxOption_.offsetZ),//??如果后续更新,room增加垂直偏移配置项，则该值需要代入重新计算
        line_L = parseFloat(markerOption_.left) - parseFloat(roomOption_.left) - parseFloat(boxOption_.left) - parseFloat(boxOption_.width)/2,
        line_T = parseFloat(markerOption_.top) - parseFloat(roomOption_.top) - parseFloat(boxOption_.top) - parseFloat(boxOption_.depth)/2,
        line_H = Math.sqrt(Math.pow(line_L,2) + Math.pow(line_T,2)),
        line_width = Math.sqrt(Math.pow(line_V,2) + Math.pow(line_H,2)) + "px"
    line_.style.width = line_width
    //计算连线角度
    let rotate_Z,rotate_Y

    rotate_Z = line_L==0?90:line_L>0?Math.atan(line_T/line_L)*180/Math.PI-180:Math.atan(line_T/line_L)*180/Math.PI
    rotate_Y = line_V>=0?90- Math.atan(line_H/line_V)*180/Math.PI:360-90-Math.atan(line_H/line_V)*180/Math.PI

    line_.style.transform = "rotateZ("+rotate_Z+"deg) rotateY("+rotate_Y+"deg) "
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
      rotateHor:"-40deg",//初始水平旋转角度，负值为反方向旋转
      scaleRat:0.8,//初始缩放比例，不允许负值
      wheelScale:true,//允许滚轮缩放
      showGrid:true,//是否显示网格
      perspective:2000,//透视系数
      dragRotate:true,//允许拖拽旋转场景
      rotateFixed:"aroundRestric",//旋转限制，"around" || "aroundRestric" || "horizontal" || "vertical" || "verticalRestric"
      //autoRotate:false,//??自动旋转，仅支持水平自动旋转
      rooms:[]//房间对象
    }
    
    //合并参数
    this_.options = mergeOptions(optionsDefault,options_)
    let sOptions = this_.options

    //检查参数
    if(sOptions.width.includes("%") || sOptions.depth.includes("%")){
      console.error("The value of Scene width and depth can not be percentage")
      console.error("场景的宽度值和进深不能使用百分比")
      return
    }
    
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
    scene.classList.add("Scene3D")
    sceneWraper.classList.add("Scene3D_Wraper")
    sceneGround.classList.add("Scene3D_Ground")
    sceneGrid.classList.add("Scene3D_Grid")

    sceneWraper.style.width = sOptions.width  
    sceneWraper.style.height = sOptions.depth
    sceneWraper.style.marginLeft = -parseFloat(sOptions.width)/2 +"px"
    sceneWraper.style.marginTop = -parseFloat(sOptions.depth)/2 +"px"  
    sceneWraper.style["-moz-perspective"] = sOptions.perspective+"px"
    sceneWraper.style["-webkit-perspective"] = sOptions.perspective+"px"
    sceneWraper.style.perspective = sOptions.perspective+"px"
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

    //鼠标动作-----------------------------
    scene.ondragstart = function(){return false}//禁用默认拖拽行为

    let dragStatus = false,//初始拖拽状态
        regH = /rotateZ\((\-*\d+\.*\d*)deg\)/g,
        regV = /rotateX\((\-*\d+\.*\d*)deg\)/g,
        moveStartH,//拖拽开始点
        moveStartV,
        rotateH,//拖拽开始角度
        rotateV,
        rotateH_marker,
        rotateV_marker
    
    scene.addEventListener("mousedown",function(e){//??不支持移动端
      if(sOptions.dragRotate){//是否允许拖拽旋转
        dragStatus = true//按下鼠标开启拖拽
        moveStartH = e.clientX
        moveStartV = e.clientY
        let transform_ = sceneGround.style.transform//获取SceneGround的transform值
        transform_.replace(regH,function(_,value){
          rotateH = Number(value)
        });
        transform_.replace(regV,function(_,value){
          rotateV = Number(value)
        });    
      }
    })
    document.addEventListener("mousemove",function(e){
      if(dragStatus && sOptions.dragRotate){//是否允许拖拽旋转
        //转动容器
        let moveH,moveV,rotateX_new,rotateY_new
        
        //旋转限制
        switch(sOptions.rotateFixed){
          case "around":{
            moveH = moveStartH - e.clientX
            moveV = moveStartV - e.clientY
            rotateX_new = +(rotateV+moveV/10).toFixed(2)
            rotateY_new = +(rotateH+moveH/10).toFixed(2)
          };break;
          case "aroundRestric":{
            moveH = moveStartH - e.clientX
            moveV = moveStartV - e.clientY
            rotateX_new = +(rotateV+moveV/10).toFixed(2)
            rotateY_new = +(rotateH+moveH/10).toFixed(2)
            if(rotateX_new<0){
              rotateX_new = 0
            }
            if(rotateX_new>90){
              rotateX_new = 90
            }
          };break;
          case "horizontal":{
            moveH = moveStartH - e.clientX
            rotateX_new = rotateV
            rotateY_new = +(rotateH+moveH/10).toFixed(2)
          };break;
          case "vertical":{
            moveV = moveStartV - e.clientY
            rotateX_new = +(rotateV+moveV/10).toFixed(2)
            rotateY_new = rotateH
          };break;
          case "verticalRestric":{
            moveV = moveStartV - e.clientY
            rotateX_new = +(rotateV+moveV/10).toFixed(2)
            rotateY_new = rotateH
            if(rotateX_new<0){
              rotateX_new = 0
            }
            if(rotateX_new>90){
              rotateX_new = 90
            }
          };break;
        }
        
        sceneGround.style.transform = "rotateX(" + rotateX_new + "deg) rotateY(0deg) rotateZ(" + rotateY_new +"deg)"

        //所有marker转动
        rotateH_marker = rotateY_new
        rotateV_marker = rotateX_new
        
        for(let i=0; i<this_.markers.length; i++){//转动标注，让标注始终朝向屏幕面
          faceMe(
            rotateV_marker,
            rotateH_marker,
            this_.markers[i].wraper.firstElementChild
          )
        }
 
      }
    })
    document.addEventListener("mouseup",function(e){
      if(sOptions.dragRotate){
        dragStatus = false//松开鼠标关闭拖拽
      }
    })
    //滚轮缩放
    let scale_wheel = sOptions.scaleRat
    scene.addEventListener("wheel",function(e){
      if(sOptions.wheelScale){//是否允许滚轮缩放
        if(e.wheelDelta>0){
          scale_wheel = scale_wheel<3.2?1.1*scale_wheel:scale_wheel
        }
        if(e.wheelDelta<0){
          scale_wheel = scale_wheel>0.2?0.9*scale_wheel:scale_wheel
        }
        sceneWraper.style.transform = "scale("+scale_wheel+")"
      }
    })
    //标注
    this.markers = []
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
    //显示网格
    showGrid(boolean_){
      showElement(this.sceneGrid,boolean_)
      return this
    },
    //创建房间
    buildRoom(options){
      let room = new Room3D(this.sceneGround,options,this)
      return room
    },
    //重置场景旋转状态
    resetScene(){
      this.sceneWraper.style.transform = "scale("+this.options.scaleRat+")"
      this.sceneGround.style.transform = "rotateX(" + this.options.rotateVer + ") rotateY(0deg) rotateZ(" +  this.options.rotateHor +")" 
      for(let i=0; i<this.markers.length; i++){//转动标注，让标注始终朝向屏幕面
        faceMe(
          this.options.rotateVer,
          this.options.rotateHor,
          this.markers[i].wraper.firstElementChild
        )
      }
      return this
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
    //检查并转换参数
    let f_w = parseFloat(father_.options.width),
        f_d = parseFloat(father_.options.depth)
    if(rOptions.height.includes("%")){
      console.error("The value of Room height can not be percentage")
      console.error("房间的高度值不能使用百分比")
      return
    }
    turnPxWDTL(//将width,depth,left,top从%转成数值
      f_w,
      f_d,
      undefined,
      rOptions.width,
      rOptions.depth,
      undefined,
      rOptions.left,
      rOptions.top,
      rOptions.right,
      rOptions.bottom,
      undefined,
      rOptions
    )

    //组建房间----------------
    //创建房间容器
    room_this_.roomWraper = document.createElement("div")
    let room = room_this_.roomWraper

    room.classList.add("Room3D_room","Room3D_room_"+rOptions.className)
    room.style.width = rOptions.width
    room.style.height = rOptions.depth
    room.style.left = rOptions.left
    room.style.top = rOptions.top
    //创建地板-----------------
    room_this_.floor = document.createElement("div")
    room_this_.floor.classList.add("Room3D_floor")
    room_this_.floor.style.background = rOptions.floorColor
    room_this_.floor.style.opacity = rOptions.floorOpacity
    room.appendChild(room_this_.floor)

    //显示地板
    room_this_.showFloor(rOptions.showFloor)

    //创建墙壁----------------
    room_this_.walls = {
      back:{},
      right:{},
      fore:{},
      left:{}
    }
    for(let wall_ in room_this_.walls){
      let Ws = room_this_.walls
      //创建墙壁dom容器
      let wall_wrap = document.createElement("div")
      wall_wrap.classList.add("Room3D_wall","Room3D_wall_"+wall_)
      wall_wrap.innerHTML = "<div class=\"Room3D_wall_main\"><span></span></div>"
      //将容器添加到wall对象
      Ws[wall_].dom = wall_wrap
      //设置墙壁属性
      Ws[wall_].height = rOptions.height
      switch (wall_){
        case "back" : 
        case "fore" : {
          Ws[wall_].width = Ws[wall_].dom.style.width = rOptions.width
        };break;
        case "left" : 
        case "right" : {
          Ws[wall_].width = Ws[wall_].dom.style.width = rOptions.depth
        };break;
      }
      Ws[wall_].dom.firstElementChild.style.height = rOptions.height
      //火狐浏览器下mask和backface同时设置在一个元素上会导致backface失效，所以增加span分别设置
      Ws[wall_].dom.firstElementChild.firstElementChild.style.background = rOptions.wallColor
      Ws[wall_].dom.firstElementChild.firstElementChild.style.opacity = rOptions.wallOpacity
      room.appendChild(Ws[wall_].dom)
      //添加门对象
      Ws[wall_].doors = []
    }

    //显示墙壁
    room_this_.showWall(rOptions.showWall)
    //设置背面可见性
    room_this_.backface(rOptions.wallBackFace)

    //创建墙角线---------------
    room_this_.cornerlines = toHtmlList(
    `<span class="Room3D_line Room3D_line_left_hori"><span></span></span>
    <span class="Room3D_line Room3D_line_fore_hori"><span></span></span>
    <span class="Room3D_line Room3D_line_right_hori"><span></span></span>
    <span class="Room3D_line Room3D_line_back_hori"><span></span></span>
    <span class="Room3D_line Room3D_line_left_vert"><span></span></span>
    <span class="Room3D_line Room3D_line_fore_vert"><span></span></span>
    <span class="Room3D_line Room3D_line_right_vert"><span></span></span>
    <span class="Room3D_line Room3D_line_back_vert"><span></span></span>`)

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
    //将父对象存入
    room_this_.father = father_
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
    showFloor(boolean_){//显示地板
      showElement(this.floor,boolean_)
      return this
    },
    showWall(boolean_){//显示墙壁
      for (let w in this.walls) {
        showElement(this.walls[w].dom.firstElementChild,boolean_)
      } 
      return this
    },
    showLine(boolean_){//显示线条
      showElement(this.cornerlines,boolean_)
      return this
    },
    backface(value){//设置墙壁背面可见性
      for (let w in this.walls) {
        this.walls[w].dom.firstElementChild.style.backfaceVisibility = value
      } 
      return this
    },
    buildBox(options){//创建盒子
      let box = new Box3D(this.roomWraper,options,this)
      return box
    },
    buildDoor(wall,doorOptions){//创建门和门洞
      //创建门对象
      let doorObj = new Object()

      let Wall = this.walls[wall]
      let doorDefaultOptions={
        className:"",
        width:"60px",
        height:"120px",
        left:"50%",
        right:"auto",
        show:true,
        type:"single left",
        openSide:"outside",
        color:"#634A42",
        doorFrameWidth:"3px",
        doorFrameColor:"#3B2A24"
      }
      //合并参数
      doorObj.options = mergeOptions(doorDefaultOptions,doorOptions)
      let dOptions = doorObj.options
      //检查并转换参数
      let w_ = parseFloat(Wall.width),
          h_ = parseFloat(Wall.height)
      turnPxWDTL(//将width,depth,height,left,top从%转成数值
        w_,
        undefined,
        h_,
        dOptions.width,
        undefined,
        dOptions.height,
        dOptions.left,
        undefined,
        dOptions.right,
        undefined,
        undefined,
        dOptions
      )
      
      //创建canvas挖墙洞
      let canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d")
      canvas.width = w_
      canvas.height = h_
      ctx.fillStyle="#ffffff";
      ctx.fillRect(0,0,w_,h_);
      //检查是否已有墙洞
      if(Wall.doors){
        for(let i = 0; i<Wall.doors.length; i++){
          let door_lf = parseFloat(Wall.doors[i].options.left),
              door_tp = parseFloat(Wall.doors[i].options.top),
              door_w = parseFloat(Wall.doors[i].options.width),
              door_h = parseFloat(Wall.doors[i].options.height)
          ctx.clearRect(door_lf,door_tp,door_w,door_h);//为已有的门挖个洞
        }
      }
      //统一转成left和top
      dOptions.left = dOptions.left !== undefined ? dOptions.left : (w_- parseFloat(dOptions.width)-parseFloat(dOptions.right))+"px"
      dOptions.top = h_-parseFloat(dOptions.height)+"px"
      //给墙挖个门洞
      ctx.clearRect(
        parseFloat(dOptions.left),
        parseFloat(dOptions.top),
        parseFloat(dOptions.width),
        parseFloat(dOptions.height)
        );
      
      //创建门板 
      let doorWrap = document.createElement("div")
      doorWrap.classList.add("Room3D_door","Room3D_door_" + dOptions.className,"Room3D_door_" + dOptions.openSide)
      doorWrap.style.width = dOptions.width
      doorWrap.style.height = dOptions.height
      doorWrap.style.left = dOptions.left
      doorWrap.style.border = "solid " + dOptions.doorFrameWidth + " " + dOptions.doorFrameColor
      
      if(dOptions.type.includes("single")){
        doorWrap.innerHTML = "<div class=\"Room3D_door_single\"></div>"
        doorWrap.firstElementChild.style.background = dOptions.color
        doorWrap.firstElementChild.style.transformOrigin = dOptions.type.includes("left") ? "left center 0" : "right center 0"
        if(dOptions.type.includes("left")){
          doorWrap.firstElementChild.classList.add("Room3D_door_left")
        }else{
          doorWrap.firstElementChild.classList.add("Room3D_door_right")
        }
      }else if(dOptions.type.includes("double")){
        doorWrap.innerHTML = "<div class=\"Room3D_door_double Room3D_door_double_lf\"></div><div class=\"Room3D_door_double Room3D_door_double_rt\"></div>"
        for(let i =0; i<doorWrap.children.length; i++){
          doorWrap.children[i].style.background = dOptions.color
        }
      }
      //显示隐藏门
      showElement(doorWrap,dOptions.show)
      //添加绑定关系和方法
      doorObj.wraper = doorWrap
      doorObj.openDoor = function(){
        this.wraper.classList.add("Room3D_door_open")
      }
      doorObj.closeDoor = function(){
        this.wraper.classList.remove("Room3D_door_open")
      }
      Wall.doors.push(doorObj)
      Wall.dom.appendChild(doorWrap)
      
      let img = canvas.toDataURL("image/png", 0.1); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
      Wall.dom.firstElementChild.firstElementChild.style.webkitMaskImage="url("+img+")"
      return doorObj
    }
  }
  
  //创建盒子构造函数****************************************************************************************
  function Box3D(room_,boxOpt_,father_){
    let box_this_ = this
    //盒子默认配置
    let boxDefaultOptn = {
      className:"",//盒子名，将被用作盒子类名
      name:"",//盒子名称，将显示在marker上
      width:"100%",//盒子宽度
      depth:"100%",//盒子进深
      height:"100%",//盒子高度
      left:"auto",//盒子距离房间左边缘距离
      top:"auto",//盒子距离房间后边缘距离
      right:"auto",//盒子距离房间右边缘距离
      bottom:"auto",//盒子距离房间前边缘距离
      offsetZ:"auto",//垂直偏移 
      rotateX:"0deg",//X轴旋转 
      rotateY:"0deg",//Y轴旋转 
      rotateZ:"0deg",//Z轴旋转 
      opacity:1,//盒子透明度
      color:"#999",//盒子颜色
      showLine:true,//显示线条
      lineColor:"#666",//线条颜色
      lineOpacity:1,//线条透明度
      lineWidth:"1px",//线条宽度
      marker:{}//标注
    }
    //合并参数
    box_this_.options = mergeOptions(boxDefaultOptn,boxOpt_)
    let bOptions = box_this_.options
    //检查并转换参数
    let f_w = parseFloat(father_.options.width),
        f_d = parseFloat(father_.options.depth),
        f_h = parseFloat(father_.options.height)
    turnPxWDTL(//将width,depth,height,left,top从%转成数值
      f_w,
      f_d,
      f_h,
      bOptions.width,
      bOptions.depth,
      bOptions.height,
      bOptions.left,
      bOptions.top,
      bOptions.right,
      bOptions.bottom,
      bOptions.offsetZ,
      bOptions
    )

    //组装盒子-------------
    box_this_.boxWraper = document.createElement("div")
    let box = box_this_.boxWraper

    box.classList.add("Box3D_box","Box3D_box_"+bOptions.className)
    box.style.width = bOptions.width
    box.style.height = bOptions.depth
    box.style.left = bOptions.left
    box.style.top = bOptions.top
    box.style.transform = "translateZ("+bOptions.offsetZ+") rotateX("+bOptions.rotateX+") rotateY("+bOptions.rotateY+") rotateZ("+bOptions.rotateZ+")"

    //创建盒子六面
    box_this_.cornerlines = []
    box_this_.sides = toHtmlList(
    `<div class="Box3D_side Box3D_bottom"><div><span></span></div></div>
    <div class="Box3D_side Box3D_left"><div><span></span></div></div>
    <div class="Box3D_side Box3D_right"><div><span></span></div></div>
    <div class="Box3D_side Box3D_fore"><div><span></span></div></div>
    <div class="Box3D_side Box3D_back"><div><span></span></div></div>
    <div class="Box3D_side Box3D_top"><div><span></span></div></div>`)

    for (let i=0; i<box_this_.sides.length; i++){
      if(box_this_.sides[i].className.includes("Box3D_left") || box_this_.sides[i].className.includes("Box3D_right") ){
        box_this_.sides[i].style.width = bOptions.height
      }else if(box_this_.sides[i].className.includes("Box3D_fore") || box_this_.sides[i].className.includes("Box3D_back")){
        box_this_.sides[i].style.height = bOptions.height
      }else if (box_this_.sides[i].className.includes("Box3D_top")){
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
    //将父对象存入
    box_this_.father = father_
    //创建标注
    box_this_.marker = new Marker3D(this.father.father,this,bOptions.marker)
    return this
  }
  //Box原型设置-----
  Box3D.prototype = {
    showLine(boolean_){
      showElement(this.cornerlines,boolean_)
      return this
    },
    showMarker(boolean_){
      showElement(this.marker.wraper,boolean_)
      return this
    },
    //创建标注
    buildMarker(options){
      //销毁原标注
      this.marker.destroy()
      //创建新标注
      let marker = new Marker3D(this.father.father,this,options)
      return marker
    }
    //??destroy方法
  }
  //创建标注构造函数****************************************************************************************
  function Marker3D (scene,box,options){
    //将标注和各对象串联
    scene.markers.push(this)
    box.marker = this
    this.box = box

    let marker_this = this
    let defaultOptions = {
      left:parseFloat(box.options.left)+parseFloat(box.father.options.left)+parseFloat(box.options.width)/2 + "px",
      right:"auto", // 以right或bottom定位，必须将top和left设为"auto"
      top:parseFloat(box.options.top)+parseFloat(box.father.options.top)+parseFloat(box.options.depth)/2 + "px",
      bottom:"auto",
      width:"auto",
      height:"auto",
      content:"<h4>{{params.title}}</h4>",
      lineColor:"#666",
      lineWidth:"1px",
      fontSize:"14px",
      fontColor:"#ffffff",
      backgroundColor:"rgba(36, 212, 174, 0.9)",
      show:true,
      offsetZ:parseFloat(box.father.options.height)*1.2+"px",
      params:{
        title:box.options.name || "Marker"//默认传入tittle作为参数
      }
    }
    
    //合并参数
    marker_this.options = mergeOptions(defaultOptions,options)
    let mOptions = marker_this.options

    //检查并转换参数
    let f_w = parseFloat(scene.options.width),
        f_d = parseFloat(scene.options.depth),
        f_h = parseFloat(box.father.options.height)
    turnPxWDTL(//left,top,offsetZ从%转成数值
      f_w,
      f_d,
      f_h,
      mOptions.width,
      undefined,
      mOptions.height,
      mOptions.left,
      mOptions.top,
      mOptions.right,
      mOptions.bottom,
      mOptions.offsetZ,
      mOptions
    )
    
    //创建marker容器
    let marker = document.createElement("div")
    marker_this.wraper = marker//将容器存入对象
    marker.classList.add("Marker3D_marker","Marker3D_marker_"+box.options.className)
    marker.style.left = mOptions.left
    marker.style.top = mOptions.top
    marker.style.transform = "translateX(-50%)  translateY(-50%) translateZ("+mOptions.offsetZ+")"

    //创建内容
    let content = document.createElement("div")
    marker_this.content = content//将content容器存入对象
    content.classList.add("Marker3D_content")
    content.style.width = mOptions.width
    content.style.height = mOptions.height
    content.style.fontSize = mOptions.fontSize
    content.style.color = mOptions.fontColor
    content.style.backgroundColor = mOptions.backgroundColor
    //解析内容模板
    content.innerHTML = replaceParams(marker_this.box, mOptions.content,mOptions.params)

    //计算marker旋转角度使其永远朝向屏幕
    faceMe(
      scene.options.rotateVer,
      scene.options.rotateHor,
      content
    )
    //创建连线
    let line = document.createElement("div")//
    line.classList.add("Marker3D_line")
    line.innerHTML="<span></span>"

    //设置连线旋转状态
    markerLineRotate(line,mOptions,box.options,box.father.options)

    //设置连线样式
    line.style.background="linear-gradient(to right, "+mOptions.lineColor+", transparent)"
    line.style.height = mOptions.lineWidth
    line.firstElementChild.style.background="linear-gradient(to right, "+mOptions.lineColor+", transparent)"

    marker.appendChild(content)
    marker.appendChild(line)
    scene.sceneGround.appendChild(marker)

    //是否显示标注
    marker.style.display= mOptions.show? "block":"none"

    return this
  }
  //Marker原型设置----
  Marker3D.prototype = {
    destroy(){//销毁标注
      let index = this.box.father.father.markers.indexOf(this)
      this.box.father.father.markers.splice(index)//从scene对象中删除引用
      this.box.marker = null//将box对象中的引用删除
      this.box.father.father.sceneGround.removeChild(this.wraper)//从场景中删除dom
      this.box = null //删除当前对象中对box的引用
      this.options = null//删除配置项
    },
    //更新标注数据
    updateMarker(params){
      this.content.innerHTML = replaceParams(this.box,this.options.content,params)
      return this
    }
  }
  //模块导出****************************************************************************************
  gloal.Scene3D = Scene3D

})(this);
if (typeof(module) !== 'undefined')
{
    module.exports = this.Scene3D;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return this.Scene3D;
    });
}