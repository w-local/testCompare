
/**
 * 用于处理事件中的 属性数据。属性查询 属性处理 属性渲染配置
 */
function newEventsProperty() {
    this.NAME_SPACE = ".EVENTSPROPERTY"
    this.$events = $("#events_modal")
    this.operationOptions = [{
        name: "值不变",
        value: "origin"
    },
    {
        name: "起始值",
        value: "start"
    },
    {
        name: "终止值",
        value: "end"
    },
    {
        name: "数据格式转换",
        value: "dataSwitch"
    }]
    this.NumberType = [{
        name: "自然数",
        value: "dayTime"
    },
    {
        name: "数字",
        value: "number"
    },
    {
        name: "字母",
        value: "letter"
    }]
    this.dataSwitchConfigure = [{
        name: "时间格式转换",
        value: "timeSwitch"
    }, {
        name: "其它格式",
        value: "otherSwitch"
    }
    ]
    this.computerDirection = [{
        name: "起始列-->终止列",
        value: "startCloToEndCol"
    }, {
        name: "终止列-->起始列",
        value: "EndColToStartCol"
    }, {
        name: "起始行-->终止行",
        value: "startRowToEndRow"
    }, {
        name: "终止行-->起始行",
        value: "endRowToStartRow"
    }]
    this.renderType = [{
        name: "数字累加",
        value: "numberAdd"
    }, {
        name: "文字累加",
        value: "charactersAdd"
    }, {
        name: '字母累加',
        value: 'letterAdd'
    }, {
        name: '替换',
        value: 'stringReplace'
    }]


    /**
     * 
     * @param {*} defaultOption //默认下来列表选线
     * @param {*} options //选项
     * @param {*} selectedValue //选中值
     * @param {*} isPrompt //是否带选中值
     * @param {*} SelectClass //下来列表的class
     * @param {*} isAppend //是否添加到
     * @param {*} appendTo //添加到
     */
    this._renderSelect = function (defaultOption, options, selectedValue, isPrompt, selectClass, attr, isAppend, appendTo) {
        if (!Array.isArray(options)) {
            options = []
        }
        isPrompt = !!isPrompt;
        isAppend = !!isAppend;
        var data = Array.prototype.slice.call(options, 0);
        if (DataType.isObject(defaultOption)) {
            data.unshift(defaultOption)
        }
        var html = `<select class="${selectClass}">`;
        data.forEach(item => {
            var value = item.value,
                prompt = "",
                selected = "";
            if (isPrompt && value) {
                prompt = `(${value})`
            }
            if (value == selectedValue) {
                selected = "selected"
            }
            html += `<option value="${value}" data-text="${item.name}" ${selected}>${item.name}${prompt}</option>`
        });
        html += `</select>`
        var $select = $(html);
        $select.attr(attr);
        isAppend && appendTo($select.get(0).outerHTML);
        return $select.get(0).outerHTML
    }
    this._renderFieldsCheckBox = function (fields, selectFields) {
        var that = this,
            data = [],
            str = "";
        if (!selectFields) {
            selectFields = []
        }
        selectFields.forEach(item => {
            data.push(item.value)
        })
        fields.forEach(function (item) {
            str += `<label title="${item.value}" class="checkbox-inline">
                        <input type="checkbox" name="${item.name}" ${data.includes(item.value) ? "checked" : ""} value="${item.value}">${item.name}(${item.value})
                    </label>`
        });
        return str;
    }
    this._renderQueryCondition = function (dbName, tableName, conditions) {
        var that = this,
            str = "";
        str = `<table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">字段</th>
                            <th class="text-center">操作符</th>
                            <th class="text-center">数据类型</th>
                            <th class="text-center">数据</th>
                            <th><span class="add" data-add="renderCopySendCondition">＋</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that._renderConditionTr(dbName, tableName, conditions)}
                    </tbody>
               </table>`
        return str;
    }
    //渲染查询的
    this._renderConditionTr = function (dbName, table, conditions) {
        var that = this,
            str = "";
        if (!Array.isArray(conditions)) return str;
        conditions.forEach(item => {
            str += `<tr class="tr copySendCondition">
                        <td>
                           ${that._renderConditionFields(dbName, table, item.field)}
                        </td>
                        <td>
                            ${that._renderQueryOpearation(item.operator)}       
                        </td>
                        <td>
                           ${that._renderQueryType(item.type)}
                        </td>
                        <td>
                           <input type="text" data-category="copySend_conditions" data-wrap="true" data-save="condition_value" class="form-control" value='${item.value || ""}'>
                        </td>
                        <td>
                            <span class="del">×</span>
                        </td>
                    </tr>`
        })
        return str;
    }

    //渲染属性查询的Tr
    this._renderPropertyDataTr = function (propertyDatas, trIndex) {
        var that = this,
            str = "";

        if (!Array.isArray(propertyDatas)) {
            return str
        }
        propertyDatas.forEach((propertyData, index) => {
            var propertyData = propertyData ? propertyData : {},
                cname = propertyData ? propertyData.cname : "",
                variable = propertyData ? propertyData.variable : "",
                dbName = propertyData.query ? propertyData.query.dbName : "",
                tableName = propertyData.query ? propertyData.query.table : "",
                conditions = propertyData.query ? propertyData.query.conditions : [],
                fields = propertyData.query ? propertyData.query.fields : [];
            trIndex = trIndex ? trIndex : index
            str += `<tr class="tr propertyDataTr" index="${trIndex}">
                <td><input type="text" data-save="cname" data-variable="${variable ? variable : ''}" class="form-control" value="${cname ? cname : ''}"></td>
                <td>${that._renderDbNameSelect(dbName)}</td>
                <td>${that._renderTableNameSelect(dbName, tableName)}</td>
                <td>${that._renderQueryCondition(dbName, tableName, conditions)}</td>
                <td class="queryFields checkboxField">${that._renderQueryFields(dbName, tableName, fields)}</td>
                <td><span class="del">×</span></td>
                </tr>`
        })
        return str;
    }
    //渲染属性查询的Tr
    this._renderPropertyQueryTr = function (propertyQuerys) {
        var that = this,
            str = "";
        if (!Array.isArray(propertyQuerys)) {
            return str
        }

        propertyQuerys.forEach(propertyQuery => {
            var variable = propertyQuery ? propertyQuery.oldVariable : "",
                cname = propertyQuery ? propertyQuery.cname : "",
                selectFields = propertyQuery ? propertyQuery.fields : [];
            str += `<tr class="propertyQueryTr">
                    <td><input type="text" class="form-control" data-save="cname" value="${cname ? cname : ""}"  /></td>
                    <td>${that._renderCustomVariable(variable)}</td>
                    <td class="propertyQueryFields">${that._renderPropertyQueryFields(variable, selectFields)}</td>
                    <td class="text-center"><span class="del">×</span></td>
                </tr>`
        })
        return str;
    }
    //渲染变量文件
    this._renderCustomVariable = function (selectedValue, isLine) {
        var that = this,
            defaultOption = {
                name: "请选择变量文件",
                value: ""
            },
            options = [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "variable",
                "data-change": "variable"
            }
        if (isLine == "isline") {
            defaultOption.name = "请选择表头变量"
            attr = {
                "data-save": "XVariable",
                "data-change": "XVariable"
            };
        }
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item) {
            var option = {
                name: item.cname ? item.cname : item.key,
                value: item.key
            }
            options.push(option)
        })
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._renderXVariable = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择自定义变量",
                value: ""
            },
            options = [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "XVariable",
                "data-change": "XVariable"
            };
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.extendHead && GLOBAL_PROPERTY.BODY.extendHead.forEach(function (item) {
            var option = {
                name: item.cname ? item.cname : item.key,
                value: item.key
            }
            options.push(option)
        })
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染数据库下拉列表
    this._renderDbNameSelect = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择数据库",
                value: ""
            },
            options = new BuildTableJson().getOptions(AllDbName, "dbName", {}),
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "dbName",
                "data-change": "dbName"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染表下拉列表
    this._renderTableNameSelect = function (dbName, selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择数据表",
                value: ""
            },
            options = new BuildTableJson().getOptions(AllDbName, "table", {
                dbName: dbName
            }),
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "table",
                "data-change": "table"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)

    }
    //渲染字段下拉列表
    this._renderConditionFields = function (dbName, tableName, selectField) {
        var that = this,
            defaultOption = {
                name: "请选择列",
                value: ""
            },
            options = new BuildTableJson().getOptions(AllDbName, "field", {
                dbName: dbName,
                table: tableName
            }),
            selectedValue = selectField,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "field",
                "data-change": "field"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染查询操作符
    this._renderQueryOpearation = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择操作符",
                value: ""
            },
            options = ConditionsHelper.getOperators(1),
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "condition_operator",
                "data-change": "condition_operator"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)

    }
    //渲染查询的数据类型
    this._renderQueryType = function (selectedValue) {
        var that = this,
            defaultOption = "",
            options = ConditionsHelper.copySendConfig,
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "condition_type",
                "data-change": "condition_type"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染查询字段的选择字段
    this._renderQueryFields = function (dbName, tableName, selectFields) {
        var that = this,
            fields = new BuildTableJson().getOptions(AllDbName, "field", {
                dbName: dbName,
                table: tableName
            });
        return that._renderFieldsCheckBox(fields, selectFields)
    }
    //获取查询属性
    this._getQueryCondition = function ($conditions) {
        var conditions = [];
        $conditions.each(function () {
            var condition = {};
            condition.field = $(this).find('[data-save="field"]').val();
            condition.operator = $(this).find('[data-save="condition_operator"]').val();
            condition.type = $(this).find('[data-save="condition_type"]').val();
            condition.value = $(this).find('[data-save="condition_value"]').val();
            conditions.push(condition)
        })
        return conditions
    }
    //获取字段
    this._getFields = function ($target) {
        var result = [];
        $target.find("input:checked").each(function () {
            var obj = {
                name: $(this).attr('name'),
                value: $(this).val()
            }
            result.push(obj)
        })
        return result;
    }
    //渲染属性查询的字段
    this._renderPropertyQueryFields = function (variable, selectFields) {
        var that = this,
            fields = [],
            propertyData = "";
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
            if (item.key == variable) {
                fields = item.fields
            }
        })
        // if (!DataType.isObject(propertyData)) {
        //     return "";
        //     // return alert(`请先配置自定义变量${variable}的属性数据`)
        // }
        // var dbName = propertyData.dbName,
        //     tableName = propertyData.table,
        //     propertyDataFields = propertyData.fields,
        //     tableFields = new BuildTableJson().getOptions(AllDbName, "field", {
        //         dbName: dbName,
        //         table: tableName
        //     }),
        //     fields = [];
        // tableFields.forEach(function (item) {
        //     if (propertyDataFields.includes(item.value)) {
        //         fields.push(item)
        //     }
        // })

        return that._renderFieldsCheckBox(fields, selectFields)

    }
    //渲染数据处理的表
    this._renderPropertyHandleTr = function (propertyHandle) {
        var that = this,
            str = `<table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-center">字段</th>
                                <th class="text-center">操作类型</th>
                                <th class="text-center">数值类型</th>
                                <th class="text-center">数据格式转换配置</th>
                                <th class="text-center">数据配置</th>
                            </tr>
                        </thead>
                    <tbody>`;
        propertyHandle.forEach(item => {
            str += `<tr class="propertyHandleConfig">
                        <td><input type="text" class="form-control" data-save="field" disabled="disabled" value="${item.field}"></td>
                        <td>${that._renderPropertyHandleOperation(item.operation)}</td>
                        <td>
                            ${that._renderPropertyHandleType(item.type)}
                        </td>
                        <td>
                            ${that._renderPropertyHandleSwitch(item.switch, item.operation)}
                        </td>
                        <td class="propertyHandleOtherConfig">
                            ${that._renderPropertyConfig(item.otherConfig, item.switch)}
                        </td>
                    </tr>`
        })
        str += "</tbody></table>";
        return str;
    }
    //渲染属性处理的操作类型
    this._renderPropertyHandleOperation = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择操作类型",
                value: ""
            },
            options = that.operationOptions,
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "operation",
                "data-change": "operation"
            };

        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染属性处理的值类型
    this._renderPropertyHandleType = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择值类型",
                value: ""
            },
            options = that.NumberType,
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "type",
                "data-change": "type",
                "data-propertyHandleChange": "propertyHandle"
            };

        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //item.config 
    this._renderPropertyConfig = function (config, type) {
        var str = "";
        if (type == "timeSwitch") {
            str = `
                <span>开始</span><input type="text" class="form-control" data-change="allDayStart" value="${config.allDayStart}" data-save="allDayStart"/>
                <span>半天开始</span><input type="text" class="form-control" disabled="disabled" data-change="halfDayStart" value="${config.halfDayStart}" data-save="halfDayStart"/>
                <span>当天结束</span><input type="text" class="form-control" data-change="allDayEnd" data-save="allDayEnd" value="${config.allDayEnd}"/>
                <span>半天当日结束</span><input type="text" class="form-control" disabled="disabled" data-change="halfDayEnd" data-save="halfDayEnd" value="${config.halfDayEnd}"/>
                <span>次日结束</span><input type="text" class="form-control" data-change="nextAllDayEnd" data-save="nextAllDayEnd" value="${config.nextAllDayEnd}"/>
                <span>半天次日结束</span><input type="text" class="form-control" disabled="disabled" data-change="nextHalfDayEnd" data-save="nextHalfDayEnd" value="${config.nextHalfDayEnd}"/>
                `
        }

        return str;
    }
    //渲染属性处理的数据格式转换配置
    this._renderPropertyHandleSwitch = function (selectedValue, type) {
        var that = this,
            defaultOption = {
                name: "请选择操作类型",
                value: ""
            },
            options = that.dataSwitchConfigure,
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "switch",
                "data-change": "switch",

            };
        if (type != "dataSwitch") {
            attr.disabled = "disabled"
        }

        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._renderPropertyRenderTr = function (propertyRenders) {
        var that = this,
            str = "";
        if (!Array.isArray(propertyRenders)) {
            // console.log($(".propertyRenderTbody"))
            // console.log(JSON.stringify(propertyRenders))
            // $(".propertyRenderTbody").attr("propertyRendersData", JSON.stringify(propertyRenders));//暂时作为tbody的属性
            return str;
        }
        propertyRenders.forEach(propertyRender => {
            str += `<tr class="propertyRenderTr">
                                <td class="text-center"><span class="del">×</span></td>
                                <td>${that._renderCustomVariable(propertyRender.variable || "")}</td>
                                <td>${that._renderCustomVariable(propertyRender.XVariable || '', "isline")}</td>
                                <td class="xlineTD">${that._renderPropertyRenderFields(propertyRender.XVariable, propertyRender.Xline, true, "extrLine")}</td>
                                <td>${that._renderPropertyRenderFields(propertyRender.variable, propertyRender.Xaxis, true)}</td>
                                <td>${that._renderPropertyRenderYaxis(propertyRender.variable, propertyRender.Yaxis)}</td>
                                <td>${that._renderPropertyRenderType(propertyRender.renderType)}</td>
                                <td class="positoonTD">${that._renderPropertyRenderFields(propertyRender.XVariable, propertyRender.renderPositoon, true, "renderPositoon")}</td>
                                <td>
                                    <div style = "position:relative">
                                        <input type="text" class="form-control render-color" save-type="style" data-save="color" value="${ propertyRender.renderColor || ""}">
                                        <div class="property-icon-wrap" style="top:2px">
                                            <input type="color" data-belong="render-color" class="property-color-input">
                                        <i class="icon icon-color"></i>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" class="form-control" data-save="colWidth" value="${propertyRender.ColWisth || ''}">
                                </td>
                            </tr>`
            // str += `<tr class="propertyRenderTr">
            //                 <td class="text-center"><span class="del">×</span></td>
            //                 <td>${that._renderCustomVariable(propertyRender.variable || "")}</td>
            //                 <td>${that._renderCustomVariable(propertyRender.XVariable || '', "isline")}</td>
            //                 <td class="xlineTD">${that._renderPropertyRenderFields(propertyRender.XVariable, propertyRender.Xline, true, "extrLine")}</td>
            //                 <td>${that._renderPropertyRenderFields(propertyRender.variable, propertyRender.Xaxis, true)}</td>
            //                 <td>${that._renderPropertyRenderYaxis(propertyRender.variable, propertyRender.Yaxis)}</td>
            //                 <td>${that._renderPropertyRenderType(propertyRender.renderType)}</td>
            //                 <td><input type="text" class="form-control" data-save="renderPositoon" value="${propertyRender.renderPositoon || ''}"></td>
            //                 <td>
            //                     <div style = "position:relative">
            //                         <input type="text" class="form-control render-color" save-type="style" data-save="color" value="${ propertyRender.renderColor || ""}">
            //                         <div class="property-icon-wrap" style="top:2px">
            //                             <input type="color" data-belong="render-color" class="property-color-input">
            //                         <i class="icon icon-color"></i>
            //                     </div>
            //                 </td>
            //                 <td>
            //                     <input type="text" class="form-control" data-save="colWidth" value="${propertyRender.ColWisth || ''}">
            //                 </td>
            //             </tr>`
        })
        return str;
    }
    this.renderExtendColTr = function (extendCol = { tableHead: [], extendHead: [] }) {
        if (extendCol == null) {
            extendCol = { tableHead: [], extendHead: [] }
        }
        var that = this;
        str = `<tr class="extendColTr">
                    <td><input type="text" class="form-control" data-save="cname" value="${extendCol.cname || ''}" /></td>
                    <td>${that._renderCustomVariable(extendCol.oldVariable || "")}</td>
                    <td>
                        ${this._renderHead(extendCol.tableHead)}
                    </td>
                    <td>
                        <input type="text" class="form-control" data-category="startInpt" data-save="startText" value="${extendCol.startText || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control" data-category="endInpt" data-save="endText" value="${extendCol.endText || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control"  data-save="startSubstr" value="${extendCol.startSubstr || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control"  data-save="endSubstr" value="${extendCol.endSubstr || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control" data-save="fieldSplit" value="${extendCol.fieldSplit || ''}"/>
                    </td>
                    <td>
                        <input type="text" class="form-control" data-save="splitMark" value="${extendCol.splitMark || ''}"/>
                    </td>
                    <td>
                        ${this._renderExtendHead(extendCol.extendHead)}
                    </td>
                </tr>`
        return str;
    }
    this._renderExtendHead = function (extendhedes) {
        var that = this,
            str = `<table class="table table-bordered extendHeads" style="margin-bottom:0px">
            <thead>
                <tr>
                    <th class="text-center">表头列</th>
                    <th class="text-center">中文名</th>
                    <th class="text-center">表头英文名</th>
                </tr>
            </thead>
            <tbody>
                ${that.renderExtendHeadTr(extendhedes)}
            </tbody>
        </table>`;
        return str;
    }
    this.renderExtendHeadTr = function (extendhedes) {
        var that = this,
            str = ""
        arr = [1, 2, 3, 4, 5, 6];
        arr.forEach(function (item, index) {
            str += `<tr>
                    <td><input type="text" class="form-control" data-save="sortLine" disabled value="${index + 1}"></td>
                    <td><input type="text" class="form-control" data-save="name" value="${extendhedes[index] ? (extendhedes[index].name || '') : ''}"></td>
                    <td><input type="text" class="form-control" data-save="value" value="${extendhedes[index] ? (extendhedes[index].value || '') : ""}"></td>
                </tr>`
        })
        return str;
    }
    this._renderHead = function (heads) {
        var that = this,
            str = `<table class="table table-bordered tableHead" style="margin-bottom:0px" >
                <thead>
                    <tr>
                        <th class="text-center">表头列</th>
                        <th class="text-center">中文名</th>
                        <th class="text-center">表头英文名</th>
                    </tr>
                </thead>
                <tbody>
                    ${that.renderHeadTr(heads)}
                </tbody>
            </table>`
        return str;
    }
    this.renderHeadTr = function (heads) {
        var that = this,
            str = "";
        heads && heads.forEach((item, index) => {
            str += `<tr>
                    <td><input type="text" class="form-control" data-save="sortLine" value="${item.sortLine ? item.sortLine : index + 1}"/></td>
                    <td><input type="text" class="form-control" data-save="name" value="${item.name}"/></td>
                    <td><input type="text" class="form-control" data-save="value" disabled value="${item.value}"/></td>
                </tr>`
        })
        return str;
    }

    this._renderPropertyHandleBodYTr = function (propertyhandels) {
        var that = this,
            str = "";
        propertyhandels.forEach(propertyHandle => {
            var variable = propertyHandle ? propertyHandle.oldVariable : "",
                cname = propertyHandle ? propertyHandle.cname : "",
                handles = propertyHandle ? propertyHandle.handles : [],
                Xaxis = propertyHandle ? propertyHandle.Xaxis : "",
                Yaxis = propertyHandle ? propertyHandle.Yaxis : [];
            str += `<tr class="propertyHandleVariable">
                        <td class="text-center" >
                            <span class="del">×</span>
                        </td>
                        <td>
                            <input type="text" class="form-control" value="${cname ? cname : ""}" data-save="cname"/>
                        </td>
                        <td >
                            ${that._renderCustomVariable(variable)}
                        </td>
                        <td >
                            ${that._renderPropertyRenderFields(variable, Xaxis, true)} 
                        </td>
                        <td>
                            ${that._renderPropertyHandleYaxis(variable, Yaxis)}
                        </td>
                        <td>
                            ${that._renderPropertyHandleTr(handles)}
                        </td>
                    </tr>`

        })
        return str;
    }
    //渲染属性渲染中的字段选择问题
    this._renderPropertyRenderFields = function (variable, selectedValue, isXAxis, extrLine) {
        var that = this,
            att = isXAxis ? "XAxis" : "Yaxis",
            defaultOption = {
                name: "请选择",
                value: ""
            },
            options = variable ? that._getpropertyRenderXYoption(variable) : [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": att,
                "data-change": att
            };
        if (extrLine == "extrLine") {
            attr = {
                "data-save": 'Xline',
                "data-change": 'Xline'
            }
        } else if (extrLine == "renderPositoon") {
            attr = {
                "data-save": 'renderPositoon'
            }
            options = variable ? that._getpropertyRenderPositoon(variable) : [];
        }
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._renderPropertyRenderXLine = function (XVariable, selectedValue) {
        var that = this,
            attr = {
                "data-save": "Xline",
                "data-change": "Xline"
            },
            defaultOption = {
                name: "请选择",
                value: ""
            },
            options = XVariable ? that._getXLineoptions(XVariable) : [],
            isPrompt = true,
            selectClass = "from-control chosen";
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._getXLineoptions = function (XVariable) {
        var options = [], data = [];
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.extendHead && GLOBAL_PROPERTY.BODY.extendHead.forEach(item => {
            if (item.key == XVariable) {
                data = item.fields;
            }
        })
        data.forEach(function (item) {
            var option = {
                name: item.cname ? item.cname : item.name,
                value: item.name
            }
            options.push(option)
        })
        return options;
    }
    this._renderPropertyHandleFields = function (variable, selectedValue, attr) {
        var that = this,

            defaultOption = {
                name: "请选择",
                value: ""
            },
            options = that._getpropertyRenderXYoption(variable),
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen";
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._getpropertyRenderXYoption = function (variable) {
        var options = [],
            selects = [],
            fields = [],
            data = {};
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
            if (variable == item.key) {
                options = item.fields;
            }
        })
        // var dbName = data.dbName,
        //     table = data.table;
        // selects = data.fields;
        // fields = new BuildTableJson().getOptions(AllDbName, "field", {
        //     dbName: dbName,
        //     table: table
        // });
        // fields.forEach(item => {
        //     if (selects.includes(item.value)) {
        //         options.push(item)
        //     }
        // })
        return options;
    }
    //显示位置
    this._getpropertyRenderPositoon = function (variable) {
        var selectsOptions = [];
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
            if (variable == item.key && item.splitMark) {
                for (let i = 1; i <= Number(item.splitMark); i++) {
                    selectsOptions.push({ 'name': i, 'value': i })
                }
            }
        })
        return selectsOptions;
    }
    //属性渲染的渲染类型
    this._renderPropertyRenderType = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择渲染类型",
                value: ""
            },
            options = [{
                name: '累加',
                value: '0'
            }, {
                name: '替换',
                value: '1'
            }],
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "renderType",
                "data-change": "renderType"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //属性渲染的位置
    this._renderPropertyRenderPostiion = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择渲染类型",
                value: ""
            },
            options = [{
                name: '',
                value: '0'
            }, {
                name: '替换',
                value: '1'
            }],
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "renderType",
                "data-change": "renderType"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //变量文件对应Y轴
    this._renderPropertyRenderYaxis = function (variable, Yaxis) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">字段</th>
                            <th class="text-center">表头</th>
                            <th class="text-center">分割</th>
                            <th class="text-center"><span class="add" data-add="propertyRenderYaxis">+</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.propertyRenderYaxis(variable, Yaxis)}
                    </tbody>
                    </table>`
        return str;
    }
    this._renderPropertyHandleYaxis = function (variable, Yaxis) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">字段</th>
                            <th class="text-center">分割</th>
                            <th class="text-center">是键位</th>
                            <th class="text-center">值</th>
                            <th class="text-center"><span class="add" data-add="propertyHandleYaxis">+</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.propertyHandleYaxis(variable, Yaxis)}
                    </tbody>
                    </table>`
        return str;
    }
    this.propertyHandleYaxis = function (variable, Yaxis) {
        var that = this,
            str = "";
        Yaxis && Yaxis.forEach(item => {
            str += `<tr class="YaxisTr">
                        <td>${that._renderPropertyHandleFields(variable, item.field, { "data-save": 'field', "data-change": 'field' })}</td>
                        <td><input type="text" class="form-control" value="${item.split || ''}" data-save="split"></td>
                        <td><input type="checkbox" class="form-control" ${item.isKey ? "checked" : ""} data-save="isKey"></td>
                        <td>${that._renderPropertyHandleFields(variable, item.content, { "data-save": 'content', "data-change": 'content' })}</td>
                        <td><span class="del">×</span></td>
                </tr>`
        })
        return str;

    }
    this.propertyRenderYaxis = function (variable, Yaxis) {
        var that = this,
            str = "";

        Yaxis && Yaxis.forEach(item => {
            str += `<tr class="YaxisTr">
                        <td>${that._renderPropertyRenderFields(variable, item.name)}</td>
                        <td><input class="form-control" type="text" data-save="headName" value="${item.headName ? item.headName : ''}"/></td>
                        <td><input type="text" class="form-control" value="${item.split}" data-save="split"></td>
                        <td><span class="del">×</span></td>
                </tr>`
        })
        return str;
    }
    this._renderPropertyRenderContent = function (variable, content) {
        // var that = this,
        //     options = that._getpropertyRenderXYoption(variable);
        // return that._renderFieldsCheckBox(options, content);
    }
    this._getYaxis = function ($target) {
        var that = this,
            result = [];
        $target.each(function () {
            var config = {};
            config.name = $(this).find("[data-save='Yaxis']").val()
            config.headName = $(this).find("[data-save='headName']").val()
            config.split = $(this).find("[data-save='split']").val()
            result.push(config)
        })
        return result;

    }
    this._getPropertyHandleYaxis = function ($target) {
        var that = this,
            result = [];
        $target.each(function () {
            var config = {};
            config.field = $(this).find("[data-save='field']").val()
            config.split = $(this).find("[data-save='split']").val()
            config.isKey = $(this).find("[data-save='isKey']").is(":checked")
            config.content = $(this).find("[data-save='content']").val()
            result.push(config)
        })
        return result;
    }
    this.bindChosen = function () {
        $(".chosen").chosen({
            no_results_text: "没有找到想要的数据",
            search_contains: true,
            allow_single_deselect: true,
            width: "100%",
        })
    }
    this.updataVariable = function (targets) {
        var that = this;
        targets.each(function () {
            var value = $(this).val(),
                str = that._renderCustomVariable(value);
            $(this).parents("td").eq(0).empty().append(str)
        })
        that.bindChosen()

    }
    this.getTableHead = function ($tr) {
        var that = this,
            result = [];
        $tr.each(function () {
            var config = {
                sortLine: $(this).find("[data-save='sortLine']").val(),
                name: $(this).find("[data-save='name']").val(),
                value: $(this).find("[data-save='value']").val()
            };
            result.push(config)
        })
        return result;
    }
    this.getExtendHead = function ($tr) {
        var that = this,
            result = [];
        $tr.each(function () {
            var config = {
                sortLine: $(this).find("[data-save='sortLine']").val(),
                name: $(this).find("[data-save='name']").val(),
                value: $(this).find("[data-save='value']").val()
            };
            result.push(config)
        })

        return result;
    }
    this.getOtherConfig = function ($td) {
        var that = this,
            result = {};
        $td.find('input').each(function (index, item) {
            var key = $(item).attr('data-save'),
                value = $(item).val();
            result[key] = value;
        })
        return result;
    }
    this.computerPageRenderTr = function (computerPage = {}) {
        var str = "",
            that = this;
        if (computerPage == null) computerPage = {};
        str = `<tr class="computerPageTr">
                <td class="compageVariable">
                    ${that._renderCustomVariable(computerPage.variable || "")}
                </td>
                <td>
                    <input type="text" class="form-control" data-save="startRows" value="${computerPage.startRows || ''}">
                </td>
                <td>
                    <input type="text" class="form-control" data-save="endRows" value="${computerPage.endRows || ''}">
                </td>
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.startColumns, { "data-save": "startColumns", "data-change": "startColumns" })}
                </td>
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.endColumns, { "data-save": "endColumns", "data-change": "endColumns" })}
                </td>
                <td>
                    ${that._renderSelect({ name: "请选择计算方向", value: '' }, that.computerDirection, computerPage.direction, false, "from-control chosen", {
            "data-save": "direction",
            "data-change": "direction"
        })}
                </td>
                <td>
                    <div>
                        <input type="button" class="form-control operator" value="*">
                        <input type="button" class="form-control operator " value="+">
                        <input type="button" class="form-control operator" value="-">
                        <input type="button" class="form-control operator" value="×">
                        <input type="button" class="form-control operator" value="÷">
                        <input type="button" class="form-control operator" value="->">
                        <input type="button" class="form-control operator" value="(">
                        <input type="button" class="form-control operator" value=")">
                    </div>
                </td>
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.valuePosition, { "data-save": "valuePosition", "data-change": "valuePosition" })}
                </td>
                <td>
                    <input type="text" class="form-control expression" data-save="expression" value='${computerPage.expression || ""}'/>
                </td>
                <td>
                    <div>
                        <input type="button" class="form-control ruleoperator" value="*">
                        <input type="button" class="form-control ruleoperator " value="+">
                        <input type="button" class="form-control ruleoperator" value="-">
                        <input type="button" class="form-control ruleoperator" value="×">
                        <input type="button" class="form-control ruleoperator" value="÷">
                        <input type="button" class="form-control ruleoperator" value="->">
                        <input type="button" class="form-control ruleoperator" value="(">
                        <input type="button" class="form-control ruleoperator" value=")">
                    </div>
                </td>
                
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.ruleValuePosition, { "data-save": "ruleValuePosition", "data-change": "ruleValuePosition" })}
                </td>
                <td>
                    <input type="text" class="form-control ruleExpression" data-save='ruleExpression' value="${computerPage.ruleExpression || ''}"/>
                </td>
                <td>
                ${that._renderSelect({ name: "请选择渲染类型", value: '' }, that.renderType, computerPage.renderType, false, "from-control chosen", {
            "data-save": "renderType",
            "data-change": "renderType"
        })}
                </td>
                <td>
                    ${that._computerPageRenderColums(computerPage.variable, computerPage.renderposition, { "data-save": "renderposition", "data-change": "renderposition" })}
                </td>
                <td>
                    ${that.computerPageRenderFields(computerPage.variable, computerPage.renderposition, computerPage.renderFild, { "data-save": "renderFild", "data-change": "renderFild" })}
                </td>
            </tr>`;
        return str;
    }
    this.computerPageRenderFields = function (variable, renderposition, selectedValue, attr) {
        var that = this,
            defaultOption = { name: "请选择", value: "" },
            options = [],
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = attr;

        if (variable && renderposition) {
            var data = {};
            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (variable == item.key) {
                    console.log(variable, item.key)
                    data.dbName = item.dbName;
                    data.table = item.table;
                    data.id = renderposition
                }
            })
            console.log(data)
            var options = new BuildTableJson().getOptions(AllDbName, 'fieldSplit', data)
            console.log(options)
        }
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._computerPageRenderColums = function (variable, selectedValue, attr) {
        var that = this,
            defaultOption = { name: "请选择", vlaue: "" },
            options = variable ? that._getpropertyRenderXYoption(variable) : [],
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = attr;
        options.unshift({ name: "本字段本表", value: "thisFields" })
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._computerPageFields = function (variable, selectedValue, attr) {
        var that = this,
            defaultOption = {
                name: "请选择",
                value: ""
            },
            options = variable ? that._getpropertyRenderXYoption(variable) : [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = attr;
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
}
newEventsProperty.prototype = {
    //渲染属性数据
    renderPropertyQueryData: function (propertyData) {
        var that = this,
            str = `<div class="condition   propertyData" ${propertyData ? "" : 'style="display:none"'}>
                        <table class="table table-bordered">
                            <caption>属性数据</caption>
                            <thead>
                                <tr>
                                    <th class="text-center">变量中文名</th>
                                    <th class="text-center">选择数据库</th>
                                    <th class="text-center">选择数据表</th>
                                    <th class="text-center">查询条件</th>
                                    <th class="text-center" style="width:600px">选择字段</th>
                                    <th><span class="add" data-add="_renderPropertyDataTr">＋</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                
                               ${that._renderPropertyDataTr(propertyData)}
                            </tbody>
                        </table>
                   </div>`;
        return str;
    },
    //渲染属性查询
    renderPropertyQuery: function (propertyQuerys) {

        var that = this,
            str = `<div class="condition propertyQuery" ${propertyQuerys ? "" : 'style="display:none"'}>
                        <table class = "table table-bordered">
                            <caption>属性查询</caption>
                            <thead>
                                <tr>
                                    <th class="text-center">请选择自定义变量</th>
                                    <th class="text-center">变量中文名</th>
                                    <th class="text-center" style="width:500px">请选择字段</th>
                                    <th class="text-center"><span class="add" data-add="_renderPropertyQueryTr">+</span></th>
                                </tr>
                            </thead>
                            <tbody>
                               ${that._renderPropertyQueryTr(propertyQuerys)} 
                            </tbody> 
                        </table>
                    </div>`
        return str;
    },
    //渲染属性处理
    renderPropertyHandle: function (propertyHandle) {
        var that = this,

            str = `<div class="condition propertyHandle" ${propertyHandle ? "" : 'style="display:none"'}>
                    <table class="table table-bordered">
                        <caption>属性处理</caption>
                        <thead>
                            <tr>
                                <th class="text-center"><span class="add" data-add="_renderPropertyHandleBodYTr">+</span></th>
                                <th class="text-center">变量中文名</th>
                                <th class="text-center">自定义变量</th>
                                <th class="text-center">X轴</th>
                                <th class="text-center">Y轴</th>
                                <th class="text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody class="propertyHandleTbody">
                            ${that._renderPropertyHandleBodYTr(propertyHandle ? propertyHandle : [{ variable: "", handles: [], Xaxis: "", Yaxis: [] }])}
                        </tbody>
                    </table>
                </div>`
        return str;

    },
    renderExtendCol: function (extendCol) {

        var that = this,
            str = `<div class="condition   extendCol"  ${extendCol ? "" : 'style="display:none"'}>
                <table class="table table-bordered">
                    <caption>扩展表格列</caption>
                    <thead>
                        <tr>
                            <th class="text-center">变量中文名</th>
                            <th class="text-center">请选择自定义变量</th>
                            <th class="text-center">表头首列配置</th>
                            <th class="text-center">开始</th>
                            <th class="text-center">结束</th>
                            <th class="text-center">开始截取</th>
                            <th class="text-center">结束截取</th>
                            <th class="text-center">分段符</th>
                            <th class="text-center">字段分段</th>
                            <th class="text-center">表头尾列扩展</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.renderExtendColTr(extendCol)}
                    </tbody>
                </table>
            </div>`
        return str;

    },
    propertyRender: function (propertyRenders) {
        // if (!propertyRender) {
        //     propertyRender = {}
        // }
        var that = this,
            str = `<div class="condition propertyRender" ${propertyRenders ? "" : 'style="display:none"'}>
                <table class="table table-bordered">
                    <caption>属性渲染</caption>
                    <thead>
                        <tr>
                            <th class="text-center"><span class="add" data-add="_renderPropertyRenderTr">+</span></th>
                            <th class="text-center">变量文件</th>
                            <th class="text-center">表头变量</th>
                            <th class="text-center">表头变量<div style="font-size:10px">X轴所在列</div></th>
                            <th class="text-center">变量文件对应X轴</th>
                            <th class="text-center">变量文件对应Y轴</th>
                            <th class="text-center">渲染类型</th>
                            <th class="text-center">渲染位置</th>
                            <th class="text-center">渲染颜色</th>
                            <th class="text-center">列宽</th>
                        </tr>
                    </thead>
                    <tbody class="propertyRenderTbody" data-propertyRenders = '${Array.isArray(propertyRenders) ? "" : JSON.stringify(propertyRenders)}'>
                        ${that._renderPropertyRenderTr(propertyRenders)}
                    </tbody>
                </table>
            </div>`;
        return str;
    },
    //页面计算
    computerPageRender: function (computerPage) {
        var that = this,
            str = `<div class="condition computerPage" ${computerPage ? "" : 'style="display:none"'}>
                <table class="table table-bordered">
                    <caption>页面计算</caption>
                    <thead>
                        <tr>
                            <th class="text-center">自定义变量</th>
                            <th class="text-center">起始行</th>
                            <th class="text-center">终止行</th>
                            <th class="text-center">起始列</th>
                            <th class="text-center">终止列</th>
                            <th class="text-center">计算方向</th>
                            <th class="text-center">运算符</th>
                            <th class="text-center">值所在位置</th>
                            <th class="text-center">表达式</th>
                            <th class="text-center">规则运算符</th>
                            <th class="text-center">规则值所在位置</th>
                            <th class="text-center">规则表达式</th>
                            <th class="text-center">渲染类型</th>
                            <th class="text-center">渲染列</th>
                            <th class="text-center">渲染段</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.computerPageRenderTr(computerPage)}
                    </tbody>
                </table>
            </div>`;
        return str;
    },
    //获取属性数据
    getPropertyData: function ($tr, id, index) {
        var that = this,
            key = NumberHelper.idToName(index, 1),
            propertyData = [];
        $tr.each(function (Cindex) {
            var propertyDatatr = {}
            propertyDatatr.variable = id + "_A" + key + NumberHelper.idToName(Cindex, 1)
            propertyDatatr.cname = $(this).find('[data-save="cname"]').val()
            propertyDatatr.query = {}
            propertyDatatr.query.dbName = $(this).find('[data-save="dbName"]').val()
            propertyDatatr.query.table = $(this).find('[data-save="table"]').val()
            propertyDatatr.query.conditions = that._getQueryCondition($(this).find(".copySendCondition"))
            propertyDatatr.query.fields = that._getFields($(this).find(".checkboxField"));
            var data = {}
            data.key = propertyDatatr.variable
            data.cname = propertyDatatr.cname
            data.dbName = propertyDatatr.query.dbName
            data.table = propertyDatatr.query.table
            data.fields = propertyDatatr.query.fields
            if (!GLOBAL_PROPERTY.BODY) { //BODY存在吗
                GLOBAL_PROPERTY.BODY = {};
                GLOBAL_PROPERTY.BODY.customVariable = [];
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                if (!GLOBAL_PROPERTY.BODY.customVariable) { //customVariable
                    GLOBAL_PROPERTY.BODY.customVariable = [];
                    GLOBAL_PROPERTY.BODY.customVariable.push(data)
                } else {
                    var number = -1;
                    GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, cindex) { //原有的存在吗
                        if (item.key == propertyDatatr.variable) {
                            number = cindex
                        }
                    })
                    if (number == -1) {
                        GLOBAL_PROPERTY.BODY.customVariable.push(data)
                    } else {
                        GLOBAL_PROPERTY.BODY.customVariable[number] = data;
                    }
                }
            }
            $('.propertyDataTr').eq(Cindex).find('input[type="text"][data-save="cname"]').attr("data-variable", propertyDatatr.variable)
            propertyData.push(propertyDatatr);
        })


        that.updataVariable($("[data-change='variable']"))
        return propertyData;
    },
    //获取页面计算的数据
    getComputerPage: function ($tr) {
        var that = this,
            result = {

            };
        $tr.each(function () {
            result.variable = $(this).find('[data-save="variable"]').val(),
                result.startRows = $(this).find('[data-save="expression"]').val(),
                result.endRows = $(this).find('[data-save="endRows"]').val(),
                result.startColumns = $(this).find('[data-save="startColumns"]').val(),
                result.endColumns = $(this).find('[data-save="endColumns"]').val(),
                result.direction = $(this).find('[data-save="direction"]').val(),
                result.expression = $(this).find('[data-save="expression"]').val(),
                result.ruleExpression = $(this).find('[data-save="ruleExpression"]').val(),
                result.renderType = $(this).find('[data-save="renderType"]').val(),
                result.renderposition = $(this).find('[data-save="renderposition"]').val(),
                result.renderFild = $(this).find('[data-save="renderFild"]').val()
        })
        console.log(result)
        return result;
    },
    //获取属性查询
    getPropertyQuery: function ($tr, id, index) {
        var that = this,
            key = NumberHelper.idToName(index, 1),
            propertyQuerys = [];
        $tr.each(function (cindex) {
            var propertyQuery = {},
                cname = $(this).find('[data-save="cname"]').val(),
                oldVariable = $(this).find('[data-save="variable"]').val(),
                variable = id + "_B" + key + NumberHelper.idToName(cindex, 1);
            propertyQuery.variable = variable;
            propertyQuery.oldVariable = oldVariable
            propertyQuery.cname = cname;
            propertyQuery.fields = that._getFields($(this).find(".propertyQueryFields"));
            propertyQuerys.push(propertyQuery)
            var data = {};
            data.key = propertyQuery.variable;
            data.cname = propertyQuery.cname;
            data.fields = propertyQuery.fields;
            GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
                if (item.key == propertyQuery.oldVariable) {
                    data.dbName = item.dbName;
                    data.table = item.table
                }
            })
            var number = -1;
            GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
                if (item.key == data.key) {
                    number = dindex;
                }
            })
            if (number == -1) {
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                GLOBAL_PROPERTY.BODY.customVariable[number] = data;
            }
        })
        that.updataVariable($("[data-change='variable']"))
        return propertyQuerys;
    },
    //获取属性处理
    getPropertyHandle: function ($trs, id, key) {
        var that = this,
            key = NumberHelper.idToName(key, 1)
        results = [];
        $trs.find(".propertyHandleVariable").each((index, $tr) => {
            var result = {
                variable: "",
                oldVariable: "",
                cname: "",
                Xaxis: "",
                Yaxis: that._getPropertyHandleYaxis($($tr).find(".YaxisTr")),
                handles: []
            },
                $propertyHandleConfig = $($tr).find(".propertyHandleConfig");
            var variable = id + "_C" + key + NumberHelper.idToName(index, 1),
                oldVariable = $($tr).find("[data-save='variable']").val(),
                cname = $($tr).find("[data-save='cname']").val(),
                XAxis = $($tr).find("[data-save='XAxis']").val();
            result.Xaxis = XAxis;
            result.cname = cname;
            result.variable = variable;
            result.oldVariable = oldVariable;
            $propertyHandleConfig.each((cindex, tr) => {
                var config = {};
                config.field = $(tr).find("[data-save='field']").val();
                config.operation = $(tr).find("[data-save='operation']").val();
                config.type = $(tr).find("[data-save='type']").val();
                config.switch = $(tr).find("[data-save='switch']").val();
                config.otherConfig = that.getOtherConfig($(tr).find('.propertyHandleOtherConfig'))
                result.handles.push(config)
            })
            results.push(result)

            var data = {}
            data.key = variable;
            data.cname = cname;
            GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
                if (item.key == oldVariable) {
                    data.dbName = item.dbName;
                    data.table = item.table;
                    data.fields = item.fields
                }
            })
            var number = -1;
            GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
                if (item.key == data.key) {
                    number = dindex;
                }
            })
            if (number == -1) {
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                GLOBAL_PROPERTY.BODY.customVariable[number] = data;
            }

        })
        that.updataVariable($("[data-change='variable']"))
        return results;
    },
    getExtendCol: function ($trs, id, key) {
        var that = this,
            key = NumberHelper.idToName(key, 1),
            result = {};
        $trs.each(function (index, tr) {
            var variable = id + "_D" + key + NumberHelper.idToName(index, 1),
                cname = $(tr).find('[data-save="cname"]').val(),
                oldVariable = $(tr).find('[data-save="variable"]').val(),
                startText = $(tr).find('[data-save="startText"]').val(),
                endText = $(tr).find('[data-save="endText"]').val(),
                startSubstr = $(tr).find('[data-save="startSubstr"]').val(),
                endSubstr = $(tr).find('[data-save="endSubstr"]').val(),
                fieldSplit = $(tr).find('[data-save="fieldSplit"]').val(),
                splitMark = $(tr).find('[data-save="splitMark"]').val(),
                tableHead = that.getTableHead($(tr).find(".tableHead tbody tr")),
                extendHead = that.getExtendHead($(tr).find(".extendHeads tbody tr"));

            result.variable = variable;
            result.cname = cname;
            result.oldVariable = oldVariable;
            result.startText = startText;
            result.endText = endText;
            result.startSubstr = startSubstr;
            result.endSubstr = endSubstr;
            result.fieldSplit = fieldSplit;
            result.splitMark = splitMark;
            result.tableHead = tableHead;
            result.extendHead = extendHead;
        })
        if (!!!result.cname) return result;
        var fields = $.extend([], result.tableHead);
        result.extendHead.forEach(item => {
            if (item.name) {
                fields.push(item)
            }
        })
        var data = {
            key: result.variable,
            cname: result.cname,
            fields: fields,
            fieldSplit: result.fieldSplit,
            splitMark: result.splitMark
        };
        GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
            if (item.key == result.oldVariable) {
                data.dbName = item.dbName;
                data.table = item.table
            }
        })
        var number = -1;
        GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
            if (item.key == data.key) {
                number = dindex;
            }
        })
        if (number == -1) {
            GLOBAL_PROPERTY.BODY.customVariable.push(data)
        } else {
            GLOBAL_PROPERTY.BODY.customVariable[number] = data;
        }
        // if (!GLOBAL_PROPERTY.BODY.extendHead) {
        //     GLOBAL_PROPERTY.BODY.extendHead = [];
        //     GLOBAL_PROPERTY.BODY.extendHead.push(data);
        // } else {
        //     var number = -1;
        //     GLOBAL_PROPERTY.BODY.extendHead.forEach((item, dindex) => {
        //         if (item.key == data.key) {
        //             number = dindex;
        //         }
        //     })
        //     if (number == -1) {
        //         GLOBAL_PROPERTY.BODY.extendHead.push(data)
        //     } else {
        //         GLOBAL_PROPERTY.BODY.extendHead[number] = data;
        //     }
        // }
        return result;
    },
    //
    getPropertyRender: function ($trs) {
        var that = this,
            $tr = $trs.find(".propertyRenderTr"),
            data = [];
        if ($tr.length == 0) {
            data.push(JSON.parse($trs.attr(("data-propertyRenders"))));
            console.log(data, "data");
            return data;
        }
        $tr.each(function () {
            var result = {};
            result.variable = $(this).find('[data-save="variable"]').val();
            result.Xaxis = $(this).find('[data-save="XAxis"]').val();
            result.XVariable = $(this).find('[data-save="XVariable"]').val();
            result.Xline = $(this).find('[data-save="Xline"]').val();
            // result.content = that._getFields($(this).find(".propertyRenderContent"));
            result.Yaxis = that._getYaxis($(this).find(".YaxisTr"));
            result.renderType = $(this).find('[data-save="renderType"]').val();
            result.renderPositoon = $(this).find('[data-save="renderPositoon"]').val();
            result.renderColor = $(this).find('[data-save="color"]').val();
            result.ColWisth = $(this).find('[data-save="colWidth"]').val();
            data.push(result)
        })
        return data;
    },


    bindEvents: function () {
        var that = this;
        //属性数据数据库切换时
        that.$events.on("change" + that.NAME_SPACE, ".propertyData [data-change='dbName']", function () {
            var $fieldTd = $(this).parents("tr").eq(0).find(".queryFields");
            $fieldTd.empty();
        })
        //属性数据数据表切换时
        that.$events.on("change" + that.NAME_SPACE, ".propertyData [data-change='table']", function () {
            var tableName = $(this).val(),
                dbName = $($(this).parents("tr")[0]).find('[data-change="dbName"]').val(),
                $fieldTd = $(this).parents("tr").eq(0).find(".queryFields"),
                html = that._renderQueryFields(dbName, tableName, []);
            $fieldTd.empty().append(html)
        })
        //属性数据选择字段时
        that.$events.on("click" + that.NAME_SPACE, ".propertyData .checkboxField input", function () {
            var $target = $(this),
                id = $("#property_id").val(),
                index = $(this).parents('tr').eq(1).attr("index");
            that.getPropertyData(that.$events.find(".propertyDataTr"), id, index)
        })
        //数据查询切换自定义变量时
        that.$events.on("change" + that.NAME_SPACE, ".propertyQuery [data-change='variable']", function () {
            var value = $(this).val(),
                html = that._renderPropertyQueryFields(value, []),
                $propertyQueryFields = $(this).parents("tr").eq(0).find(".propertyQueryFields");

            // $propertyQueryFields = that.$events.find(".propertyQueryFields");
            $propertyQueryFields.empty().append(html)
        })
        //属性查询字段点击时候
        that.$events.on("click" + that.NAME_SPACE, ".propertyQueryFields input", function () {
            var id = $("#property_id").val(),
                index = $(this).parents('tr').eq(1).attr("index");
            that.getPropertyQuery(that.$events.find(".propertyQueryTr"), id, index)
        })
        //属性处理自定义变量切换的时候?还有问题
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='variable']", function () {
            var propertyHandleVariable = $(this).val(),
                cname = $(this).parents("tr").eq(0).find("[data-save='cname']").val(),
                data = [],
                html = "";
            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (item.key == propertyHandleVariable) {
                    data = item.fields
                }
                // JSON.parse(item.propertyData).forEach(citem => {
                //     if (citem.variable == propertyHandleVariable) {
                //         data = citem.query.fields
                //     }
                // })
                // item.propertyQuery && JSON.parse(item.propertyQuery).forEach(citem => {
                //     if (citem.variable == propertyHandleVariable) {
                //         data = citem.fields
                //     }
                // })
                // if (item.key == propertyHandleVariable) {
                //     if (GLOBAL_PROPERTY.BODY.customVariable[index].propertyData) {
                //         data = JSON.parse(GLOBAL_PROPERTY.BODY.customVariable[index].propertyData).query.fields
                //     }
                //     if (GLOBAL_PROPERTY.BODY.customVariable[index].propertyQuery) {
                //         data = JSON.parse(GLOBAL_PROPERTY.BODY.customVariable[index].propertyQuery).fields
                //     }
                //     // if (GLOBAL_PROPERTY.BODY.customVariable[index].propertyHandle) {
                //     //     check = true;
                //     //     data = JSON.parse(GLOBAL_PROPERTY.BODY.customVariable[index].propertyHandle).handles
                //     // }
                // }
            })
            // if (!check) {
            var handles = []
            data.forEach(item => {
                var config = {
                    field: item.value,
                    operation: "",
                    type: "",
                    switch: ""
                }
                handles.push(config)
            })
            var result = [{
                cname: cname,
                oldVariable: propertyHandleVariable,
                handles: handles,
                Xaxis: "",
                Yaxis: ''
            }];
            html = that._renderPropertyHandleBodYTr(result)

            $(this).parents("tr").eq(0).replaceWith($(html))
            that.bindChosen()
        })
        //属性处理操作类型切换时
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='operation']", function () {
            var operation = $(this).val(),
                $target = $(this).parents("tr").eq(0).find("[data-change='switch']");
            $config = $(this).parents("tr").eq(0).find(".propertyHandleConfig");
            if (operation != "dataSwitch") {
                $target.val("")
                $target.attr("disabled", "disabled")
            } else {
                $target.attr("disabled", false)
            }
            $config.empty()
            $('.chosen').trigger('chosen:updated');

        })
        //属性处理数据格式转换配置
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='switch']", function () {
            var changType = $(this).val(),
                $target = $(this).parents("tr").eq(0).find(".propertyHandleOtherConfig"),
                str = "";
            if (changType == "timeSwitch") {
                str = that._renderPropertyConfig({}, changType)
            }
            $target.empty().append(str)

        })
        //属性处理时间转换函数的  
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable .propertyHandleConfig .propertyHandleOtherConfig [data-change='allDayStart']", function () {
            var value = $(this).val(),
                $target = $(this).parents("td").eq(0).find("[data-change='halfDayStart']");
            $(this).val(value.toUpperCase())
            $target.val(value.toLowerCase())
        })
        that.$events.on('change' + that.NAME_SPACE, ".propertyHandleVariable .propertyHandleConfig .propertyHandleOtherConfig [data-change='allDayEnd']", function () {
            var value = $(this).val(),
                $target = $(this).parents("td").eq(0).find("[data-change='halfDayEnd']");
            $(this).val(value.toUpperCase())
            $target.val(value.toLowerCase())
        })
        that.$events.on('change' + that.NAME_SPACE, ".propertyHandleVariable .propertyHandleConfig .propertyHandleOtherConfig [data-change='nextAllDayEnd']", function () {
            var value = $(this).val(),
                $target = $(this).parents("td").eq(0).find("[data-change='nextHalfDayEnd']");
            $(this).val(value.toUpperCase())
            $target.val(value.toLowerCase())
        })

        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-propertyHandleChange='propertyHandle']", function () {
            var id = id = $("#property_id").val(),
                index = $(this).parents('tr').eq(1).attr("index");
            that.getPropertyHandle($(".propertyHandle .propertyHandleTbody"), id, index)
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyRenderTr [data-change='variable']", function () {
            var value = $(this).val(),
                data = [{
                    variable: value
                }],
                str = that._renderPropertyRenderTr(data),
                $tbody = $(this).parents('tr').eq(0);
            $tbody.replaceWith(str)
            that.bindChosen()
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyRenderTr [data-change='XVariable']", function () {
            var value = $(this).val(),
                // str = that._renderPropertyRenderXLine(value, ""),
                exTr = that._renderPropertyRenderFields(value, "", true, "extrLine"),
                $exTrTarget = $(this).parents("tr").eq(0).find(".xlineTD"),
                posTr = that._renderPropertyRenderFields(value, "", true, "renderPositoon"),
                $posTrTarget = $(this).parents("tr").eq(0).find(".positoonTD")
            $exTrTarget.empty().append(exTr);
            $posTrTarget.empty().append(posTr);
            that.bindChosen()

        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyRenderTr .YaxisTr [data-change='Yaxis']", function () {
            var value = $(this).val(),
                text = $(this).find('option:selected').attr('data-text'),
                $target = $(this).parents('tr').eq(0).find('[data-save="headName"]')
            if (value) {

                $target.val(text)
            } else {
                $target.val("")
            }

        })
        that.$events.on("change" + that.NAME_SPACE, ".extendColTr [data-save='variable']", function () {
            var value = $(this).val(),
                data = {};

            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (item.key == value) {
                    data = item.fields
                }
            })
            // if (!DataType.isObject(data)) {
            //     return "";
            //     // return alert(`请先配置自定义变量${variable}的属性数据`)
            // }
            // var dbName = data.dbName,
            //     tableName = data.table,
            //     Fields = data.fields,
            //     tableFields = new BuildTableJson().getOptions(AllDbName, "field", {
            //         dbName: dbName,
            //         table: tableName
            //     }),
            //     results = [];
            // tableFields.forEach(function (item) {
            //     if (Fields.includes(item.value)) {
            //         var option = {
            //             sortLine: '',
            //             cname: item.name,
            //             name: item.value
            //         }
            //         results.push(option)
            //     }
            // })
            var html = that.renderHeadTr(data),
                $target = $(this).parents("tr").eq(0).find(".tableHead tbody");
            $target.empty().append(html)


        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='variable']", function () {
            var value = $(this).val(),
                $startTarget = $('.computerPage [data-change="startColumns"]'),
                $endTarget = $('.computerPage [data-change="endColumns"]'),
                $valuePosition = $('.computerPage [data-change="valuePosition"]'),
                $ruleValuePosition = $('.computerPage [data-change="ruleValuePosition"]'),
                $renderposition = $('.computerPage [data-change="renderposition"]'),
                $renderFild = $('.computerPage [data-change="renderFild"]'),
                startColumns = that._computerPageFields(value, "", { 'data-save': "startColumns", 'data-change': "startColumns" }),
                endColumns = that._computerPageFields(value, "", { 'data-save': "endColumns", 'data-change': "endColumns" }),
                valuePosition = that._computerPageFields(value, "", { 'data-save': "valuePosition", 'data-change': "valuePosition" }),
                renderposition = that._computerPageRenderColums(value, "", { 'data-save': "renderposition", 'data-change': "renderposition" }),
                ruleValuePosition = that._computerPageFields(value, "", { 'data-save': "ruleValuePosition", 'data-change': "ruleValuePosition" }),
                renderFild = that.computerPageRenderFields(value, "", "", { "data-save": "renderFild", "data-change": "renderFild" });
            $startTarget.parents("td").eq(0).empty().append(startColumns);
            $endTarget.parents("td").eq(0).empty().append(endColumns);
            $valuePosition.parents('td').eq(0).empty().append(valuePosition);
            $renderposition.parents('td').eq(0).empty().append(renderposition);
            $ruleValuePosition.parents('td').eq(0).empty().append(ruleValuePosition);
            $renderFild.parents('td').eq(0).empty().append(renderFild)

            that.bindChosen()
        })
        that.$events.on("click" + that.NAME_SPACE, ".computerPage .operator", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".expression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)
            console.log(value)
        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='valuePosition']", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".expression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)

        })
        that.$events.on("click" + that.NAME_SPACE, ".computerPage .ruleoperator", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".ruleExpression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)
        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='ruleValuePosition']", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".ruleExpression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)

        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='renderposition']", function () {
            var value = $(this).val(),
                $field = $(".computerPage [data-change='renderFild']"),
                variable = $(".computerPage [data-change='variable']").val(),
                str = that.computerPageRenderFields(variable, value, "", { "data-save": "renderFild", "data-change": "renderFild" });
            $field.parents('td').eq(0).empty().append(str)
            that.bindChosen()
        })
    }

}