define('kws', function (require, exports, module) {
    // --------------------------------------------------------------------------------------

    /*  http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html
        一种多个ajax一步，统一回调的用法：
        $.when($.ajax("test1.html"), $.ajax("test2.html"))
    　　 .done(function(){ alert("哈哈，成功了！"); })
    　　 .fail(function(){ alert("出错啦！"); });
    */

    /* @tofishes __app 基础资源载入 __app系统公共js，建议都先于页面js之前引入*/
    var app = require('app')
    ,   $ = require('jquery')
    ,   sys = require('sys');

    window.__app = window.__app || new app();
    window.km = window.km || {}; // 主命名空间

    var $doms = __app.$doms
    ,   templates = __app.templates
    ,   ACTIVE = 'active';

    // 配置__app属性
    __app.config({
        'api_pre': '/kws/', // 接口地址前缀
        'accountUrl': __app.getURI('account/userAccShow/') && 'phony-data/weibo.json', // || '/phony-data/__app-account.json',
        'emotions': '/assets/data/emotions.json',
        'accountChange': $.Callbacks(),

        '$win': $(window),
        '$dom': $(document),

        'chineseNumber': ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],

        'ACTIVECLASS': ACTIVE
    });

    // 顶部账号头像
    __app.addURL(__app.accountUrl, function (data) {
        var accounts = data.rst && {
            "id": "1792088665", 
            "large": "http://tp2.sinaimg.cn/1792088665/180/40008779912/0", 
            "small": "http://tp2.sinaimg.cn/1792088665/50/40008779912/0", 
            "pic": "http://tp2.sinaimg.cn/1792088665/180/40008779912/0", 
            "sn": "德芙悦时刻", 
            "createdTime": 1264559983000, 
            "gender": "f", 
            "birthday": "", 
            "location": "北京", 
            "fans": '70万', 
            "follows": 99, 
            "statuses": 6190, 
            "verified": true, 
            "verified_reason": "", 
            "following": false, 
            "followme": false, 
            "description": "德芙心声", 
            "platform": "sina"
        };

        $doms.sysAccountList.html($.tmpl(templates.sysAccountItem, accounts));
        $doms.headerHook.html($doms.sysAccountSwitch.show());

        $doms.sysAccountList.on('click', '.avatar', function () {
            $(this).closest('li').addClass(ACTIVE).siblings().removeClass(ACTIVE);
        }).children().eq(0).find('.avatar').trigger('click');
    });
    __app.addURL(__app.emotions, function (data) {
        km.emotions = data;
    });

    module.exports = __app;
    return __app;
});