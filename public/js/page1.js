/**
 * Created by zzg on 2017/4/26.
 */

var  page1 = {
    "pageId":"",
    "data":null,
    "maxshowpageitem":5,//最多显示的页码个数
    "pagelistcount":10,//每一页显示的内容条数
      "init":function(listCount,currentPage,options1){
      	this.data=options1.data,
      	this.pageId=options1.id,
    this.maxshowpageitem=options1.maxshowpageitem,//最多显示的页码个数
    this.pagelistcount=options1.pagelistcount//每一页显示的内容条数
    page1.initPage(listCount,currentPage);
  },
  /**
     * 初始化数据处理
     * @param listCount 列表总量
     * @param currentPage 当前页
     */
  "initPage":function(listCount,currentPage){
        var maxshowpageitem = page1.maxshowpageitem;
        if(maxshowpageitem!=null&&maxshowpageitem>0&&maxshowpageitem!=""){
            page1.maxshowpageitem = maxshowpageitem;
        }
        var pagelistcount = page1.pagelistcount;
        if(pagelistcount!=null&&pagelistcount>0&&pagelistcount!=""){
            page1.pagelistcount = pagelistcount;
        }   
        page1.pagelistcount=pagelistcount;
        if(listCount<0){
            listCount = 0;
        }
        if(currentPage<=0){
            currentPage=1;
        }
     
        page1.setPageListCount(listCount,currentPage);
   },
    /**
     * 初始化分页界面
     * @param listCount 列表总量
     */
    "initWithUl":function(listCount,currentPage){
        var pageCount = 1;
        if(listCount>=0){
            var pageCount = listCount%page1.pagelistcount>0?parseInt(listCount/page1.pagelistcount)+1:parseInt(listCount/page1.pagelistcount);
        }
        var appendStr = page1.getPageListModel(pageCount,currentPage);
        $("#"+page1.pageId).html(appendStr);
    },
    /**
     * 设置列表总量和当前页码
     * @param listCount 列表总量
     * @param currentPage 当前页码
     */
    "setPageListCount":function(listCount,currentPage){
        listCount = parseInt(listCount);
        currentPage = parseInt(currentPage);
        page1.initWithUl(listCount,currentPage);
        page1.initPageEvent(listCount);
        page1.viewPage(currentPage,listCount,page1.pagelistcount,page1.data)
//      fun(currentPage);
    },
    //页面显示功能
     "viewPage":function (currentPage,listCount,pagelistcount,data){
            var NUM=listCount%pagelistcount==0?listCount/pagelistcount:parseInt(listCount/pagelistcount)+1;
            if(currentPage==NUM){
                var result=data.slice((currentPage-1)* pagelistcount,data.length);
            }
            else{
                var result=data.slice((currentPage-1)*pagelistcount,(currentPage-1)*pagelistcount+pagelistcount);
            }
            options1.callBack(result);
    },
    "initPageEvent":function(listCount){
        $("#"+page1.pageId +">li[class='pageItem']").on("click",function(){
            page1.setPageListCount(listCount,$(this).attr("page1-data"),page1.fun);
        });
    },
    "getPageListModel":function(pageCount,currentPage){
        var prePage = currentPage-1;
        var nextPage = currentPage+1;
        var prePageClass ="pageItem";
        var nextPageClass = "pageItem";
        if(prePage<=0){
            prePageClass="pageItemDisable";
        }
        if(nextPage>pageCount){
            nextPageClass="pageItemDisable";
        }
        var appendStr ="";
       // appendStr+="<li class='"+prePageClass+"' page-data='1' page-rel='firstpage'>首页</li>";
        appendStr+="<li class='"+prePageClass+"' page1-data='"+prePage+"' page1-rel='prepage'>&lt;</li>";
        var miniPageNumber = 1;
        if(currentPage-parseInt(page1.maxshowpageitem/2)>0&&currentPage+parseInt(page1.maxshowpageitem/2)<=pageCount){
            miniPageNumber = currentPage-parseInt(page1.maxshowpageitem/2);
        }else if(currentPage-parseInt(page1.maxshowpageitem/2)>0&&currentPage+parseInt(page1.maxshowpageitem/2)>pageCount){
            miniPageNumber = pageCount-page1.maxshowpageitem+1;
            if(miniPageNumber<=0){
                miniPageNumber=1;
            }
        }
        var showPageNum = parseInt(page1.maxshowpageitem);
        if(pageCount<showPageNum){
            showPageNum = pageCount;
        }
        for(var i=0;i<showPageNum;i++){
            var pageNumber = miniPageNumber++;
            var itemPageClass = "pageItem";
            if(pageNumber==currentPage){
                itemPageClass = "pageItemActive";
            }

            appendStr+="<li class='"+itemPageClass+"' page1-data='"+pageNumber+"' page1-rel='itempage'>"+pageNumber+"</li>";
        }
        appendStr+="<li class='"+nextPageClass+"' page1-data='"+nextPage+"' page1-rel='nextpage'>&gt;</li>";
     
       return appendStr;

    }
}
