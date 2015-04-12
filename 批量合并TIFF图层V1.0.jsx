res = "dialog{\
text:'批量合并TIFF图层V1.0',\
        group:Group{orientation: 'column',alignChildren:'left',\
				top:StaticText{text:'★ 默认为直接覆盖保存 - 请做好备份 (脚本仅处理TIFF)'},\
				timeline:Progressbar{bounds:[0,0,300,10] , minvalue:0,maxvalue:100}\
                  folderO:Group{ orientation: 'row', \
						b: Button {text:'待处理文件夹', properties:{name:'open'} ,helpTip:'选择您需要处理的贴图所在的文件夹'},\
						s: EditText  { text:'', preferredSize: [180, 20] },\
						},\
                },\
        buttons: Group { orientation: 'row', alignment: 'left',\
                s:StaticText {text:'[ABOUT]'},\
			   Btnok: Button { text:'确定', properties:{name:'ok'} }, \
                Btncancel: Button { text:'取消', properties:{name:'cancel'} } \
                }, \
}";
win = new Window (res);

//打开文件夹
var folderOpen=win.group.folderO
folderOpen.b.onClick = function() { 
		var defaultFolder = folderOpen.s.text;
		var testFolder = new Folder(defaultFolder);
		if (!testFolder.exists) {
			defaultFolder = "~";
		}
		var selFolder = Folder.selectDialog("选择待处理文件夹", defaultFolder);
		if ( selFolder != null ) {
	        folderOpen.s.text = selFolder.fsName;
			folderOpen.s.helpTip = selFolder.fsName.toString();
	    }
}
//合并图层
function flatten(docRef){
    if(docRef.layers.length == 1){
        docRef.close(SaveOptions.DONOTSAVECHANGES);}else{
            docRef.flatten();
            docRef.close(SaveOptions.SAVECHANGES);
            }
    }
//批量合并TIFF图层
function go(){
    //mydoc = app.activeDocument;
    //flatten(mydoc);
    var openFolder = Folder(win.group.folderO.s.text);				
	var fileList = openFolder.getFiles() //获取open文件夹下所有文件
    //alert(fileList.length)
	var len = fileList.length;
	for (i=0;i<fileList.length;i++){
		if (fileList[i] instanceof File && fileList[i].hidden == false){ //不处理隐藏文件
              var str = fileList[i].toString ();//将object转变成string
              if(str.substr (str.length-3).toLowerCase() == "tif"){
                    //alert(str.substr (str.length-3));
                    open(fileList[i]); 
                    var docRef = app.activeDocument; 
                    flatten (docRef);                 
                   }else{
                       len = len - 1;
                       }
            	var k=100/len;
                win.group.timeline.value =win.group.timeline.value+k;
              //alert(len);
         }
    }
    alert("共处理" + len + "张贴图！", "完成提示")
    }
//关于
win.buttons.s.onClick = function () {
alert("photoshop cs6 测试可用\r\n作 者：化猫之宿", "关于");
}

win.buttons.Btnok.onClick = function () {
    go();
}

win.center();
win.show();
