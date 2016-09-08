//封装ajax函数
function switchData(json) {
    var query = '';
    for (var attr in json) {
        query += attr + '=' + json[attr] + '&';
    }
    return ''.slice.call(MQ.trim(query), 0, -1);
}

export function ajax(url, options) {

    let defaultSetting = {
            url: '/',
            type: 'get',
            data: {},
            dataType: 'json',
            async: true,
            success: function (data) {},
            error: function (error) {},
            complete: function (data) {}
        },
        xhr,
        isGet,
        data;

    if (typeof url === 'object') {
        options = url;
        url = undefined;
    }

    options = options || {};

    for (var attr in defaultSetting) {
        if (!options[attr]) {
            options[attr] = defaultSetting[attr];
        }
    }

    //创建ajax
    xhr = window.ActiveXObject ? new ActiveXObject("Msxml2.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

    isGet = MQ.trim(options.type).toLowerCase() === 'get';

    options.url = isGet ? options.url + '?' + switchData(options.data) : options.url;
    console.log(options.url);
    xhr.open(options.type, options.url, options.async);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = MQ.trim(options.dataType).toLowerCase() === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
                options.success(data);
            } else {
                options.success({
                    error: xhr.responseText,
                    errorStatus: xhr.status
                });
            }
        } else {
            options.complete(xhr.responseText || {
                error: 'ajax请求出错'
            });
        }
    }

    isGet || xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    isGet ? xhr.send() : xhr.send(switchData(options.data));
}

MQ.extend({
    ajax
})