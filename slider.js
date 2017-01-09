    function Slider(options){
        if(!Slider.isValid(options))return;
        this.options = options;
        this.html().init();//链式操作
    }
    Slider.isValid=function(json){//检测参数是否合法
        return json && typeof json ==='object'?true:false;
    }
    Slider.getStyle=function(obj,sName){//获取样式值
        return (obj.currentStyle||getComputedStyle(obj,false))[sName];
    }
    Slider.prototype.html=function(){//初始化生成dom节点
        this.parent = document.querySelector(this.options.parent);

        this.sBox = document.createElement('div');//创建slider容器
        this.sBox.className = 'sliderBox';
        this.parent.appendChild(this.sBox);

        this.bigPic = document.createElement('div');//大图容器
        this.smallPic = document.createElement('div');//缩略图容器
        this.leftBtn = document.createElement('span');//左按钮
        this.rightBtn = document.createElement('span');//右按钮
        this.bigPic.className = 'bigPic';

        this.smallPic.className = 'smallPic';
        this.leftBtn.className = 'leftBtn';
        this.rightBtn.className = 'rightBtn';
        this.leftBtn.innerHTML = '<';
        this.rightBtn.innerHTML = '>';    
        this.sBox.appendChild(this.bigPic);
        this.sBox.appendChild(this.smallPic);
        var smallPicWidth = parseInt(Slider.getStyle(this.smallPic,'width'))/this.options.data.length;
        var data = this.options.data;
        var _this = this;
        function create(obj,data){

            var aDiv= document.createElement('div');
            var img = document.createElement('img');
            var title = document.createElement('div');
            aDiv.className='imgBox';
            img.src = 'img/'+data.img;
            title.innerHTML=data.title;
            aDiv.appendChild(title);
            aDiv.appendChild(img);
            obj.appendChild(aDiv);
            if(obj.className=='smallPic'){

                obj.appendChild(_this.leftBtn);
                obj.appendChild(_this.rightBtn);
                aDiv.className='imgBox';
                aDiv.style.width = smallPicWidth+'px';
            }

        }
        for(var i=0;i<data.length;i++){
            create(this.bigPic,data[i]);
            create(this.smallPic,data[i]);
        }
        return this;
    }
    Slider.prototype.init=function(){//slider组件核心代码
        this.bigPic.innerHTML+=this.bigPic.innerHTML;
        this.bigPic.style.width = this.bigPic.children.length*this.bigPic.children[0].offsetWidth+'px';
        var W = this.bigPic.offsetWidth/2;
        var iNow = 0;
        var aBtn = this.smallPic.getElementsByClassName('imgBox');
        var _this =this;
        _this.timer=null;
        function autoPlay(){
            if(_this.options.auto){
                clearInterval(_this.timer);
                _this.timer =setInterval(function(){
                    iNow++;
                    tab();
                    
                },2000);
            }
        }
        autoPlay();
        for(var i=0;i<aBtn.length;i++){
            (function(index){
                aBtn[i].onclick=function(){
                    clearInterval(_this.timer);
                    if((iNow%aBtn.length==4||iNow%aBtn.length==-1)&&index%aBtn.length==0){
                        iNow++;
                    }
                    
                    if(iNow%aBtn.length==0&&index%aBtn.length==4){
                        iNow--;
                    }
                    
                    iNow = Math.floor(iNow/aBtn.length)*aBtn.length+index;
                    tab();
                    setTimeout(function(){
                        autoPlay();
                    },2000);
                };

            })(i);
        }
        
        
        function tab(){

            for(var i=0;i<aBtn.length;i++){
                aBtn[i].className='imgBox';
            }
            //为了让按钮正常显示的计算
            if(iNow>0){
                aBtn[iNow%aBtn.length].className='imgBox on';
            }else{
                aBtn[(iNow%aBtn.length+aBtn.length)%aBtn.length].className='imgBox on';
            }
            move(_this.bigPic,-iNow*_this.bigPic.children[0].offsetWidth);
        }
    this.leftBtn.onclick=function(){
        clearInterval(_this.timer);
        
        iNow--;
        tab();
        setTimeout(function(){
            autoPlay();
        },2000);
    };
    this.rightBtn.onclick=function(){
        clearInterval(_this.timer);
        iNow++;
        tab();
        setTimeout(function(){
            autoPlay();
        },2000);
    };
	//封装一下 运动框架
    var left = 0;
    function move(obj,iTarget){
        var start = left;
        var dis = iTarget-start;
        var count = Math.floor(700/30);
        var n = 0;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            n++;
            var a = 1-n/count;
            left = start+dis*(1-Math.pow(a,3));
            if(left<0){
                obj.style.left = left%W+'px';
            }else{
                obj.style.left = (left%W-W)%W+'px';
            }
            if(n==count){
                clearInterval(obj.timer);
            }
        },30);
    }
    };