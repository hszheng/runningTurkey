/**
 * 所有的配置信息
 *
 * @author  Vincent Zheng
 * @version 1.0
 * @since   2015-09-17
 * @review
 */

/**
 * Router配置项
 * 
 * layoutTemplate 默认使用布局
 * @type {String}
 *
 * notFoundTemplate 找不到route时显示的template
 * @type {String}
 *
 * @author Vincent Zheng
 */
Router.configure({
    layoutTemplate: 'basicLayout',
    notFoundTemplate: 'notFound'
});


/**
 * 所有页面的route
 * 
 * @type {Array}
 *
 * @author  Vincent Zheng
 */
window.SYS_ROUTES = [
    { route: 'home', path: '/', template: 'home', text: '首页' },
    { route: 'statistics', path: '/statistics', template: 'statistics', text: '统计' }
];

/**
 * 页面宽度
 * 
 * @type {Number}
 *
 * @author Vincent Zheng
 */
window.PAGE_WIDTH = 640;

/**
 * 页面高度
 * 
 * @type {Number}
 *
 * @author Vincent Zheng
 */
window.PAGE_HEIGHT = 1000;

/**
 * 当前网站的host
 * 
 * @type {String}
 *
 * @author Vincent Zheng
 */
window.HOST = '';

/**
 * 微信转发链接
 * 
 * @type {String}
 *
 * @author Vincent Zheng
 */
window.FORWARD_LINK = 'http://test.xuuue.cn:6006';
//window.FORWARD_LINK = 'http://wechat.xuuue.cn';
/**
 * 微信转发时LOGO地址
 * 
 * @type {String}
 *
 * @author Vincent Zheng
 */
window.WX_LOGO = 'http://test.xuuue.cn:6006/turkeyturkey.png';
//window.WX_LOGO = 'http://wechat.xuuue.cn/turkeyturkey.png';


/**
 * 微信的AppID
 * 
 * @type {String}
 *
 * @author Vincent Zheng
 */
window.APPID = 'wxf8fd2cce1f21da29';

/**
 * 微信授权重定向URI
 * 
 * @type {String}
 *
 * @author Vincent Zheng
 */
window.REDIRECTURI = encodeURIComponent('http://test.xuuue.cn:6006');
//window.REDIRECTURI = encodeURIComponent('http://wechat.xuuue.cn');