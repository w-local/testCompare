function NewService() {
    this.addUrl = '/new/save'; //保存
    this.listUrl = '/new/page'; //获取
    this.removeUrl = '/new/delete/'; //删除
    this.publishUrl = "/new/submit/"; //提交
    this.queryHistoryUrl = "/new/customIdCount/"

}
NewService.prototype = {
    //添加表单或则模板
    add: function (type, data, callback) {
        if (!data) return;
        var that = this;
        $.cajax({
            url: that.addUrl + "/" + type,
            type: "POST",
            data: {
                post: JSON.stringify(data)
            },
            dataType: "json",
            success: function (result, status, xhr) {
                callback(result)
            }
        })
    },
    //获取表单或则模板
    list: function (data, callback) {
        var that = this;
        $.cajax({
            url: that.listUrl,
            type: "POST",
            dataType: "json",
            data: data,
            success: function (result, status, xhr) {
                callback(result);
            }
        })
    },
    //移除
    removePromise: function (id, type) {
        if (!id) return Promise.reject("无效的编号");
        var that = this;
        return new Promise(function (resolve, reject) {
            $.cajax({
                url: that.removeUrl + id + "/" + type,
                type: "GET",
                cache: false,
                dataType: "json",
                success: function (result, status, xhr) {
                    return resolve(result)
                },
                error: function (error, status, xhr) {
                    return reject(error)
                }
            })
        })
    },

    //查询历史发布
    queryHistory: function (id, type) {
        if (!id || !type) return Promise.reject("请先保存数据");
        var that = this;
        return new Promise(function (resolve, reject) {
            $.cajax({
                url: that.queryHistoryUrl + id + "/" + type,
                type: "GET",
                cache: false,
                dataType: "json",
                success: function (result) {
                    return resolve(result)
                },
                error: function (error) {
                    return reject(error)
                }
            })
        })
    },
    getProducts: function(callback) {
        return new Service().query('newProducts', null, null, null, null, callback)
    },
    // getTemplate: function(callback) {
    //     return new Service().query('newResources', null, null, null, null, callback)
    // },
    publish: function(id, callback) {
        return new Service().update('newProducts', [{ col: 'customId', value: id }], [{ col: 'status', value: 10 }], callback)
    }

}