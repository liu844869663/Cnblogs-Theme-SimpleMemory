$(document).ready(function () {
    let b = $('body'),
        c = 'cnblogs_post_body',
        e = 'sideCatalog',
        // 导航容器里面的目录
        f = 'sideCatalog-catalog',
        g = 'sideCatalogBtn',
        // 导航容器
        i = '<div id="sideToolbar"style="display:none;">\<div class="sideCatalogBg"id="sideCatalog">\<div id="sideCatalog-sidebar">\<div class="sideCatalog-sidebar-top"></div>\<div class="sideCatalog-sidebar-bottom"></div>\</div>\<div id="sideCatalog-catalog">\<ul class="nav"style="width:230px;zoom:1">\</ul>\</div>\</div>\<a href="javascript:void(0);"id="sideCatalogBtn"class="sideCatalogBtnDisable"></a>\</div>',
        j = '',
        l = 0,
        m = 0,
        n = 0,
        o,
        q = true,
        r = false,
        // 文章内容容器 '#cnblogs_post_body'导航容器里面的目录
        s = $('#' + c),
       tools = new myTools;

    if (s.length === 0) return;
    b.append(i); o = s.find(':header');
    if (o.length === 0) return;

    // 开始获取页面顶级标题
    let topLev = (s.find('h1').length ? 1 : false)
        || (s.find('h2').length ? 2 : false)
        || (s.find('h3').length ? 3 : false)
        || (s.find('h4').length ? 4 : false)
        || (s.find('h5').length ? 5 : false)
        || (s.find('h6').length ? 6 : false);
    if (!topLev) return;

    // 设置最顶级的标题和第二级标题
    let topHT = 'h' + topLev, topTwHT = 'h' + (topLev + 1);

    o.each(function (ii) {
        let u = $(this),
            v = u[0];
        // 只展示最高的两级标题
        // if ($.inArray((v.tagName.toLowerCase()), [topHT, topTwHT]) === -1) return true;

        let lserialNum   = u.find('.dev__fe').length > 0 ? u.find('.dev__fe').text() : null, // 左边的序号
            rserialNum   = u.find('.dev__ux').length > 0 ? u.find('.dev__ux').text() : null, // 右边的序号
            // 标题内容
            titleContent = u.find('.dev__developer').length > 0 ? u.find('.dev__developer').text() : u.text(),
            titleId      = u.attr('tid'), // 标题的导航id
            hId          = u.attr('id'); // 标题的id属性

        // 没有导航id则随机生成一个
        if (!titleId) {
            titleId = 'tid-' + tools.randomString(6);
            u.attr('tid', titleId);
        }
        // 没有id则随机生成一个
        if (!hId) {
            hId = 'hid-' + tools.randomString(6);
            u.attr('id', hId);
        }

        // 标题大于30个字符则进行截取
        // if(titleContent.length > 30) titleContent = titleContent.substr(0,30) + "...";
        titleContent = tools.HTMLEncode(titleContent);
        // 如果开启了给标题添加序号则在导航上面也添加
        let itemText = lserialNum === null && rserialNum === null ? titleContent : lserialNum + '.' + rserialNum + '&nbsp;&nbsp;' + titleContent;

        let liClass = ' Offset ceg';
        if (v.localName === topHT){
            l++; m = 0;
        } else {
            m++;
        }

        let c = v.localName.substr(1,1) - topLev
        if (c > 0){
            liClass = 'h' + c + 'Offset' + liClass
        }
        liClass = liClass + (lserialNum === null ? l : lserialNum)

        if (c > 0){
            j += '<li h="'+ v.localName.substr(1,1) +'" g="'+ (lserialNum === null ? l : lserialNum)
                +'" ' + 'class="' + liClass +'"><a href="#'+hId+'" goto="' + titleId + '" onclick="return false;">' + itemText + '</a></li>';
        } else {
            j += '<li h="'+ v.localName.substr(1,1) +'" g="'+ (lserialNum === null ? l : lserialNum)
                +'" ' + 'class="' + liClass +'"><a href="#'+hId+'" goto="' + titleId + '" onclick="return false;">' + itemText + '</a><span class="sideCatalog-dot"></span></li>';
        }
    });

    // 将目录添加到导航容器里面
    $('#' + f + '>ul').html(j);
    b.data('spy', 'scroll');
    b.data('target', '.sideCatalogBg');

    b.scrollspy({
        target: '.sideCatalogBg'
    });
    let $sideCatelog = $('#' + e);

    // 目录点击按钮事件
    $('#' + f + '>ul>li').click(function () {
        // 获取点击的目录id
        let obj = $(this), title, titleH = $(':header[tid="'+obj.find('a').attr('goto')+'"]'),
        titleParent = titleH.parent('span.header__span');
        title = titleParent.length > 0 ? titleParent : titleH;

        // 滑动至该目录
        title.length && tools.actScroll(title.offset().top + 3, 500);
    });

    let nav_li = $('#sideCatalog-catalog').find('ul li');

    if (nav_li.length === 0) {
        $sideCatelog.css('visibility', 'hidden');
        $('#' + g).removeClass('sideCatalogBtnDisable');
    }

    // 对所有的目录滚动时添加一个函数
    nav_li.on('activate.bs.scrollspy', function () {
        // 目前看到的目录
        let gu = $(this).attr("g"), catalog = $('#sideCatalog-catalog');
        // 先全部隐藏
        catalog.find('.Offset').hide();
        // 看到的目录同一级别的全部展示
        catalog.find('.ceg' + gu).show();
    })
});