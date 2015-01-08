AF = function(element, options, formName) {
        // todo cambiar el nombre a la libreria por af
        //console.clear()
        // dbg('options', o2S(options))
        clonableRows = {}
        activateHooks = {}
        processSelectize = {}
        queries = {}
        options.helpers = options.helpers || {}
        options = parseEvalObjects(options)
        options = parseSubstNodes(options)
        parseRootQueries(options)
        c = {} //Creamos un objeto que va a contener la configuración general
        c.form = options.def.form || {}
        c.form.name = options.name
        c.fields = options.def.form.fields || {}
        c.element = $('#' + element)
        c.common = c.form.common || {}
        c.common.control = c.common.control || {}
        c.common.type = c.common.type || {}
        c.form.title = c.form.title || _.humanize('Form ' + c.form.collection)
        c.form.title = ft(c.form.title)
        c.form.id = c.form.id || _.slugify((c.form.title || 'form') + "_" + c.form.collection)
        c.HTML = {}
            //Creamos el $ form
        c.HTML.form = $("<form>", {
            class: _.trim((c.form.classes || "none").replace(/,/g, ' ')) + " autof " + "large-" + (c.form.columns || 12) + " small-12 columns ",
            id: c.form.id,
            name: _.slugify(c.form.title),
            collection: c.form.collection,
            style: c.form.style
        })
        c.HTML.maindiv = $('<div>', {
            class: "row mainFieldsDiv"
        })
        $('<div>', {
            id: "form_notices"
        }).appendTo(c.HTML.maindiv).text(c.form.change_notice || ft("Form changed"))
        c.HTML.title = $('<span>', {
                class: "form_title"
            }).text(c.form.title).prependTo(c.HTML.maindiv)
            //////MONTAMOS EL PUZLE
        c.HTML.maindiv.appendTo(c.HTML.form)
            //Recorremos los fields
        arrBlockNames = []
        currentBlockName = "startBlock"
        c.HTML.currentBlock = createBlock('startBlock', {}).appendTo(c.HTML.maindiv)
            //for (thekey in c.fields) {
        _.each(c.fields, function(index, thekey) {
            c.fields[thekey] = c.fields[thekey] || {}
            if (c.fields[thekey].activate) {
                activateHooks[thekey] = c.fields[thekey].activate
            }
            if (_.startsWith(thekey, '_') == true) {
                c.HTML.currentBlock = createBlock(thekey, c.fields[thekey]).appendTo(c.HTML.maindiv)
                currentBlockName = thekey
            } else {
                var nField = createField(thekey, c.fields[thekey])
                $(nField).appendTo(c.HTML.currentBlock || c.HTML.maindiv)
            }
        })
        c.HTML.button = createButtons()
        c.HTML.maindiv.appendTo(c.HTML.form)
        c.HTML.button.appendTo(c.HTML.form)
        c.HTML.form.appendTo(c.element)
        collapseBlocks()
        parseaCurrencyFields()
        parseaDecimalFields()
        prepareMultiBlocks()
        prepareShadowClonableRows()
        initSelectToSelectize()
        createButtonsActions()
        activateHooksTriggers()
        processEnumDependSelects()
        activateCustomValidation(c.HTML.form)
        alertFormChange(c.HTML.form)
        setInitialRadioValues()
            //delete c
            //delete options
    }
    // En esta funcion creamos o modificamos los aspectos comunes a todos los campos (titulo, determinamos el tipo, columnas)
createField = function createField(myname, fieldSource) {
        fieldSource = fieldSource || {}
        fieldSource.numid = makeId(4)
            //fieldSource.value = fieldSource.value || null
        fieldSource.title = ft(fieldSource.title || _.humanize(myname))
        fieldSource.blockName = currentBlockName
        fieldSource.required = fieldSource.required === false ? false : true //Campos requeridos por defectom, a no ser que se haya indicado false
            //fieldSource.columns = fieldSource.columns || 12
        fieldSource.id = myname
        fieldSource.name = myname
        fieldSource.controlType = {}
            // importamos las configuracion de commmon.bock_content[blocName]
        c.common.block_content = c.common.block_content || {}
        var fc = _.extend({}, c.common.block_content[fieldSource.blockName] || {})
        _.extend(fc, fieldSource)
        _.extend(fieldSource, fc)
            //
            // importamos las configuracion de commmon.type[currency,text,color,tag,etc,etc,etc]
        var fu = _.extend({}, c.common.type[fieldSource.type] || {})
        _.extend(fu, fieldSource)
        _.extend(fieldSource, fu)
            //
            // importamos las configuracion de commmon.control[input|select|textarea]
        var fu = _.extend({}, c.common.control[fieldSource.controlType] || {})
        _.extend(fu, fieldSource)
        _.extend(fieldSource, fu)
            //
            // importamos las configuracion de commmon.all
        var fc = _.extend({}, c.common.all || {})
        _.extend(fc, fieldSource)
        _.extend(fieldSource, fc)
            //
        fieldSource.item_columns = fieldSource.item_columns || 1
        fieldSource.controlType = _.has(fieldSource, 'enum') ? 'select' : false
            //Determinamos el tipo de control que vamos a crear
        if (_.has(fieldSource, 'type')) {
            if (fieldSource.type == 'textarea') {
                fieldSource.controlType = 'textarea'
            }
            var inputTypes = ['button', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week', 'decimal', 'currency', 'tags']
                //Lista de campos que son evaluados como input
            if (inputTypes.indexOf(fieldSource.type) >= 0) {
                fieldSource.controlType = 'input'
            }
        } else if (!_.has(fieldSource, 'enum')) {
            fieldSource.controlType = 'input'
        }
        //
        fieldSource.type = fieldSource.type || 'text'
        fieldSource.class = "large-" + fieldSource.columns + " small-12 columns " + (fieldSource.class || '') //Para que encaje con foundation
        var row = $('<div>', {
            class: fieldSource.class,
            id: 'div-' + fieldSource.id
                // ,        title: fieldSource.help
        })
        var label = $('<label>', {
            class: "field",
            type: fieldSource.type,
            id: "label-" + fieldSource.id
        }).text(fieldSource.title).appendTo(row)
        if (fieldSource.help) {
            row.addClass("hint--top").attr('data-hint', ft(fieldSource.help))
        }
        switch (fieldSource.controlType) {
            case 'input':
                fieldSource.control = createInput(myname, fieldSource)
                break;
            case 'select':
                fieldSource.control = createSelect(myname, fieldSource)
                break;
            case 'textarea':
                fieldSource.control = createTextarea(myname, fieldSource)
            default:
        }
        var theRenderedControl = $(fieldSource.control).appendTo(row)
            //Activamos (o no) el atributo required
        if (!fieldSource.required == false) {
            theRenderedControl.attr('required', true)
        }
        //Anadimos los atributos html indicados en la configuracion
        $.each(fieldSource.html || {}, function(item, value) {
            fieldSource.control.attr(item, value)
        })
        fieldSource.control.attr('id', fieldSource.id)
        if (fieldSource.save_as) {
            fieldSource.control.attr('save_as', fieldSource.save_as)
        }
        //Establecemos los valores de los controles, si han sido definidos 
        setFieldValue(theRenderedControl, fieldSource.value)
        fieldSource.control.attr('id', fieldSource.id)
            // Parseamos los campos con selectize, datetimepicker, si no hemos dicho "noprocess"
        if (!_.has(fieldSource, "noprocess")) {
            if (fieldSource.type == 'tags' || (fieldSource.controlType == 'select' && fieldSource.type != 'radio')) {
                selectizeProcess(theRenderedControl, fieldSource)
            }
            fieldSource.controlType == 'textarea' ? theRenderedControl.autosize() : false
            if (["date", "datetime", "time"].indexOf(fieldSource.type) >= 0) {
                datetimeFieldProcess(theRenderedControl, fieldSource)
            }
        } else {
            theRenderedControl.attr('noprocess', true)
        }
        // row.attr('blockname', currentBlockName)
        return row
    }
    //Procesamnos los campos que requieren select2 (tags o select)
selectizeProcess = function selectizeProcess(renderedField, fieldSource) {
    if (fieldSource.type == 'tags') {
        var defaultTagsConfig = {
            plugins: ['remove_button'],
            delimiter: ',',
            copyClassesToDropdown: false,
            searchField: "text",
            persist: false,
            create: function(input) {
                return {
                    value: input,
                    text: input
                }
            }
        }
        var effectiveTagConfig = _.extend(defaultTagsConfig, fieldSource.selectize || {})
        processSelectize[renderedField.attr('name')] = $(renderedField).selectize(effectiveTagConfig)
        processSelectize[renderedField.attr('name')].hasEnumDepend = renderedField.attr('enum_depend')
    }
    if (fieldSource.controlType == 'select') {
        var defaultSelectConfig = {
            plugins: ['remove_button'],
            copyClassesToDropdown: false
        }
        var effectiveSelectConfig = _.extend(defaultSelectConfig, fieldSource.selectize || {})
        processSelectize[renderedField.attr('name')] = renderedField.prop('effectiveSelectConfig', effectiveSelectConfig)
        processSelectize[renderedField.attr('name')].hasEnumDepend = renderedField.attr('enum_depend')
        renderedField.attr('process', true)
            //renderedField.selectize(effectiveSelectConfig)
    }
}
datetimeFieldProcess = function datetimeFieldProcess(renderedField, fieldSource) {
    //Soporte de datetimepicker en lenguajes cooficiales de España
    $.fn.datetimepicker.defaults.i18n.gl = {
        'months': ['Xaneiro', 'Febreiro', 'Marzo', 'Abril', 'Maio', 'Xuño', 'Xullo', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Decembro'],
        'dayOfWeek': ['Dom', 'Lun', 'Mar', 'Mer', 'Jov', 'Ven', 'Sab']
    }
    $.fn.datetimepicker.defaults.i18n.ca = {
        'months': ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
        'dayOfWeek': ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds']
    }
    $.fn.datetimepicker.defaults.i18n.eu = {
        'months': ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'],
        'dayOfWeek': ['I', 'A', 'A', 'A', 'O', 'O', 'L']
    }
    var dateTypeDefaults = {
            //        lazyInit: true,
            lang: ft("en").split('-')[0] || 'en',
            dayOfWeekStart: 1,
            format: 'd/m/Y',
            timepicker: false,
            weeks: true,
            mask: true,
            formatDate: 'd/m/Y'
        }
        // Valor por defecto para los input[type=datetime]
    var dateTimeTypeDefaults = {
            //        lazyInit: true,
            lang: ft("en").split('-')[0] || 'en',
            dayOfWeekStart: 1,
            format: 'd/m/Y H:i',
            weeks: true,
            mask: true,
            formatDate: 'd/m/Y',
            formatTime: 'H:i'
        }
        // Valor por defecto para los input[type=time]
    var timeTypeDefaults = {
        //        lazyInit: true,
        lang: ft("en").split('-')[0] || 'en',
        dayOfWeekStart: 1,
        format: 'H:i',
        mask: true,
        datepicker: false,
        formatTime: 'H:i',
        step: 30
    }
    var currentConfig = {}
        //Cargamos en la variable currentConfig el conjunto de parametros por defecto definidos arriba
    if (fieldSource.type == 'date') {
        currentConfig = dateTypeDefaults
    } else if (fieldSource.type == 'datetime') {
        currentConfig = dateTimeTypeDefaults
    } else if (fieldSource.type == 'time') {
        currentConfig = timeTypeDefaults
    }
    if (fieldSource.datetimepicker) {
        _.extend(currentConfig, fieldSource.datetimepicker)
    }
    $(renderedField).datetimepicker(currentConfig)
}
createInput = function createInput(name, fieldSource) {
    var theInput = $('<input>', {
            type: fieldSource.type,
            placeholder: fieldSource.placeholder,
            name: fieldSource.name,
            class: fieldSource.class,
            style: fieldSource.style,
        }) //.val(fieldSource.value)
    return theInput
}
createSelect = function createSelect(name, fieldSource) {
    //Si es un tipo booleano, directamente creamos el objeto
    //todo @urgente La lista de valores sí, no debe mostrarse en el idioma del sistema y si no, por defecto en ingles
    if (fieldSource.enum == 'boolean') {
        fieldSource.save_as = 'boolean'
        fieldSource.enum = [{
            value: 'true',
            label: ft('Yes')
        }, {
            value: 'false',
            label: ft('Not')
        }]
    }
    //Si es string, convertimos en un array
    if ($.type(fieldSource.enum) == "string") {
        //Si comienza por queries, es que es una consulta ejecutada previamente a mongo, de la clave root.queries previamente 
        if (_.startsWith(fieldSource.enum, 'queries.')) {
            fieldSource.enum = queries[fieldSource.enum.replace('queries.', '')]
        } else {
            fieldSource.enum = fieldSource.enum.split(',').map(Function.prototype.call, String.prototype.trim) //Convertimos la cadena en array
        }
    }
    //Convertimos en un array de Objetos
    if ($.type(fieldSource.enum) == 'array' && $.type(fieldSource.enum[0]) == 'string') {
        fieldSource.enum = arrEnum2ObjArrEnum(fieldSource.enum)
    }
    if (fieldSource.type == 'radio') {
        return createRadioControl(name, fieldSource)
    }
    var theSelect = $('<select>', {
        name: fieldSource.name,
        enum_depend: fieldSource.enum_depend || null
    })
    if (fieldSource.multiple) {
        theSelect.attr('multiple', true)
    }
    if (fieldSource.size) {
        if (fieldSource.size == 'auto') {
            theSelect.attr('size', fieldSource.enum.length)
        } else if ($.type(fieldSource.size) == 'number') {
            theSelect.attr('size', fieldSource.size)
        }
    }
    fieldSource.arrOptionGroups = []
    var groupLabel = 'init'
    var selectedItems = []
    _.each(fieldSource.enum, function(row, index) {
        var v = (fieldSource.enum_i18n || null) == 'all' ? t(row.value) : row.value
        var l = (['label', 'all'].indexOf(fieldSource.enum_i18n || null) >= 0 ? t(_.humanize(row.label)) : _.humanize(row.label)) || v
            //Parseamos los optgroups
        if (row.optgroup != "init") {
            groupLabel = row.optgroup //|| 'init'
            fieldSource.arrOptionGroups.push(groupLabel)
        }
        var theOption = $('<option>', {
            value: v,
            group: groupLabel
        })
        if (row.selected) {
            theOption.attr('selected', "")
            selectedItems.push(v)
        }
        theOption.text(l)
        theOption.appendTo(theSelect)
    })
    fieldSource.arrOptionGroups = _.unique(fieldSource.arrOptionGroups)
    fieldSource.arrOptionGroups.forEach(function(key) {
        $("option[group='" + key + "']", theSelect).wrapAll('<optgroup label="' + key + '" slug="' + _.slugify(key) + '">')
    })
    fieldSource.value = fieldSource.value || selectedItems
    return theSelect
}
createRadioControl = function createRadioControl(name, fieldSource) {
    var theFieldset = $('<ul >', {
            type: "radio",
            class: "button-group even-" + fieldSource.item_columns,
            required: fieldSource.required,
            id: fieldSource.id
        })
        //var theLegend = $('<legend>').text(fieldSource.title).appendTo(theFieldset)
    _.each(fieldSource.enum, function(theradioItem) {
            //traducimos si hay enum_i18n
            var rv = (fieldSource.enum_i18n || null) == 'all' ? t(theradioItem.value) : theradioItem.value
            var rl = (['label', 'all'].indexOf(fieldSource.enum_i18n || null) >= 0 ? t(_.humanize(theradioItem.label)) : _.humanize(theradioItem.label)) || rv
            var theValue = rv
            var theValueId = "RadioValue" + makeId(4)
            var theLi = $('<li>', {
                class: "button small secondary radiovalueblock"
            })
            var theLabel = $('<label>', {
                // class: "",
            })
            var theOption = $('<input>', {
                type: "radio",
                name: name,
                required: fieldSource.required,
                id: theValueId,
                value: rv
            }).appendTo(theLabel)
            if (theradioItem.selected) {
                theOption.prop('checked', 'checked')
                theLi.addClass('checked')
            }
            var theLabelText = $('<span>', {
                class: "radiolabeltext"
            }).text(rl).appendTo(theLabel)
            theLabel.appendTo(theLi)
            theLi.appendTo(theFieldset)
        })
        //inicializamos la accion
    initRadioControl(theFieldset)
    return theFieldset
}
initRadioControl = function initRadioControl(element) {
    $('input', element).on('change', function() {
        $('*', element).removeClass('checked')
        $(this).closest('li.button').addClass('checked')
    })
}
createTextarea = function createTextarea(name, fieldSource) {
    var theTextarea = $('<textarea>', {
            placeholder: fieldSource.placeholder,
            name: fieldSource.name,
        }) //.val(fieldSource.value)
    return theTextarea
}
createBlock = function createBlock(name, blockSource) {
    blockSource = blockSource || {}
    if (name != "startBlock") {
        _.extend(blockSource, c.common.blocks || {})
    }
    var columns = blockSource.columns || 12
    var visibility = blockSource.visibility == 'close' ? 'display:none;' : 'display:block;'
    var panelBlock = $('<div>', {
        class: "block large-" + columns + " small-12 columns " + blockSource.class || ''.replace(/,/g, " "),
        id: name,
        style: visibility + blockSource.style,
        columns: columns,
        limit: blockSource.limit
    })
    var blockname = $('<span>', {
        class: "blockname"
    }).text(ft(_.titleize(_.humanize(name)).trim())).appendTo(panelBlock)
    $('<i>', {
        class: "fa fa-chevron-down"
    }).appendTo(blockname)
    return panelBlock
}
collapseBlocks = function collapseBlocks() {
    $('.autof .blockname').on('click', function() {
        if ($(this).parent().hasClass('collapse')) {
            $(this).parent().css('height', 'auto')
        } else {
            $(this).parent().css('height', $(this).innerHeight() + 2)
        }
        $(this).parent().toggleClass('collapse')
    })
}
createButtons = function createButtons() {
    var buttonsGroup = $('<ul>', {
        class: "button-group"
    })
    var btDelete = $('<li>', {
        class: "tiny button alert disabled",
        id: "delete-button",
        tittle: t("Delete")
    }).appendTo(buttonsGroup).html('<i class="fa fa-remove fa-2x"></i>')
    var btAdd = $('<li>', {
        class: "tiny button disabled",
        id: "add-button",
        title: ft("The form values aren't yet validated")
    }).appendTo(buttonsGroup).html('<i class="fa fa-plus fa-2x"></i>')
    var btSave = $('<li>', {
        class: "tiny button disabled",
        id: "save-button",
        title: ft("Save this record")
    }).appendTo(buttonsGroup).html('<i class="fa fa-save fa-2x"></i>')
    return buttonsGroup
}
createButtonsActions = function createButtonsActions() {
    $('#add-button').on('click', function() {
        sendFormToMongo($(this).closest('form.autof'))
    })
}
prepareMultiBlocks = function prepareMultiBlocks() {
    $('.autof .block[limit]').each(function() {
        var block = $(this)
        $('div', this).wrapAll('<div class="fieldsRow large-11 small-11 columns">')
        var utilityRow = $('<div>', {
            class: "utilityRow large-1 small-1 columns addsubrow"
        }).html('<label class="action">&nbsp; </label>').appendTo(this)
        var addButton = $('<span>', {
            class: 'tiny secondary'
        }).html('<i class="fa fa-plus fa-2x"></i>').appendTo(utilityRow)
        var mainRow = $('.fieldsRow,.utilityRow', this).wrapAll('<div class="subrow large-12 small-12 columns">')
        renumeraMultiBlockIndex()
        var newRow = $('.addsubrow', this).on('click', function() {
            //Por aqui seguimos...
            if ($('.subrow', block).length < block.attr('limit') || block.attr('limit') == 0) {
                var name = $(this).closest('.block').attr("id")
                var theNewClon = clonableRows[name].clone().appendTo(block).addClass('isClon')
                $('div.addsubrow', theNewClon).removeClass('addsubrow').addClass('removesubrow').html('<label>&nbsp</label><span class="tiny alert"><i class="fa fa-remove fa-2x"></i></span>').on('click', function() {
                    $(this).parent().remove()
                    renumeraMultiBlockIndex()
                })
                renumeraMultiBlockIndex()
                $(this).removeClass("disabled alert")
                initClonedRadioControls()
                initSelectToSelectize()
                $(this).addClass("disabled alert")
                activateCustomValidation($('.isClon:last', block))
            }
        })
    })
}
renumeraMultiBlockIndex = function renumeraMultiBlockIndex() {
    $('.autof .block[limit]').each(function() {
        $('.subrow', this).each(function(index) {
            var id = index
            $('[name]', this).each(function() {
                var theName = $(this).attr('name').split('-')[0]
                $(this).attr('name', theName + '-' + id).addClass('subObject')
            })
        })
    })
}
parseaCurrencyFields = function parseaCurrencyFields() {
    $('.autof [type=currency]').attr('format', 'currency').attr('type', 'text').each(function() {
        var theCurrencyField = $(this).on('blur', function() {
            $(this).val(numeral($(this).val()).format('0.0[,]00'))
        })
    })
}
parseaDecimalFields = function parseaDecimalFields() {
    $('.autof [type=decimal]').attr('format', 'decimal').attr('type', 'text').each(function() {
        $(this).on('blur', function() {
            $(this).val(numeral($(this).val()).format('0.0[,]00'))
        })
    })
}
initClonedRadioControls = function initClonedRadioControls() {
    $('div.isClon:not(.init) ul[type=radio]').each(function() {
        initRadioControl(this)
        $(this).closest('div.isClon').addClass('init')
    })
}
prepareShadowClonableRows = function prepareShadowClonableRows() {
    $('.subrow').each(function() {
        var name = $(this).closest('.block').attr('id')
        clonableRows[name] = $(this).clone()
    })
}
initSelectToSelectize = function initSelectToSelectize() {
    $('select[process]:not(.selectized)').each(function() {
        $(this).selectize($(this).prop('effectiveSelectConfig'))
    })
}
$enable = function $enable(obj) {
    $(obj).removeClass('disabled')
    $('*', obj).removeClass('disabled')
    $(obj).removeAttr('disabled')
    $('*', obj).removeAttr('disabled')
    $('.selectized', obj).each(function() {
        var name = [$(this).attr('name')]
        var $select = processSelectize[name][0].selectize
        $select.enable()
    })
}
$disable = function $disable(obj) {
    $(obj).addClass('disabled')
    $('*', obj).addClass('disabled')
    $(obj).attr('disabled', 'disabled')
    $('*', obj).attr('disabled', 'disabled')
    $('.selectized', obj).each(function() {
        var name = [$(this).attr('name')]
        var $select = processSelectize[name][0].selectize
        $select.disable()
    })
}
$hide = function $hide(obj) {
    $(obj).hide()
    $('*', obj).hide()
}
$show = function $show(obj) {
        $(obj).show(300)
        $('*:not(.selectized)', obj).show(300)
    }
    //Establecemos el valor de un control
setFieldValue = function setFieldValue(name, value) {
        if (typeof name == 'string') {
            var field = $('.autof [name=' + name + ']')
            theName = name
        } else {
            var field = name
            theName = name.attr('name')
        }
        switch (field.attr('type')) {
            case 'radio':
                $('.autof [name=' + theName + '][value=' + value + ']').prop('checked', 'checked')
                break;
            default:
                field.val(value)
                break;
        }
    }
    //extraemos el valor de un control
fieldValue = function fieldValue(name) {
        if (typeof name == 'string') {
            var field = $('.autof [name=' + name + ']')
            theName = name
        } else {
            var field = name
            theName = name.attr('name')
        }
        switch (field.attr('type')) {
            case 'radio':
                return $('.autof [name=' + theName + ']:checked').val()
                break;
            default:
                return field.val() == "" ? null : field.val()
                break;
        }
    }
    // Esta función procesa las definiciones "activate" de los campos o bloques de grupo, que determinan su visibilidad o activación.
activateHooksTriggers = function activateHooksTriggers() {
        _.keys(activateHooks).forEach(function(item) {
            var obj = activateHooks[item]
            obj.initial = obj.initial || {}
            var dest = _.startsWith(item, '_') ? $('.autof .block#' + item) : $('.autof div#div-' + item)
            switch (obj.mode) {
                case 'hide_if':
                    obj.initial != 'hidden' ? $show(dest) : $hide(dest)
                    break;
                case 'show_if':
                    obj.initial != 'visible' ? $hide(dest) : $show(dest)
                    break;
                case 'disable_if':
                    obj.initial != 'disabled' ? $enable(dest) : $disable(dest)
                    break;
                case 'enable_if':
                    obj.initial != 'enabled' ? $disable(dest) : $enable(dest)
                default:
                    //Statements executed when none of the values match the value of the expression
                    break;
            }
            var evalRes = eval(obj.eval_condition)
                //Evaluamos la expresion, si existe, de modo inicial
            if (obj.expression) {
                var nExpr = eval(obj.expression)
                switch (obj.mode) {
                    case 'hide_if':
                        nExpr ? $hide(dest) : $show(dest)
                        break;
                    case 'show_if':
                        nExpr ? $show(dest) : $hide(dest)
                        break;
                    case 'disable_if':
                        nExpr ? $disable(dest) : $enable(dest)
                        break;
                    case 'enable_if':
                        nExpr ? $enable(dest) : $disable(dest)
                    default:
                        break;
                }
            }
            //implementamos las acciones para cada campo, (trigger), si existen
            if (obj.triggers) {
                _.keys(obj.triggers).forEach(function(trigger) {
                    var arrIn = obj.triggers[trigger].in || []
                    var arrNotIn = obj.triggers[trigger].not_in || []
                    var vIn = '-' + arrIn.join('-').toLowerCase() + '-'
                    var vNotIn = '-' + arrNotIn.join('-').toLowerCase() + '-'
                    $trigger = $('.autof [name=' + trigger + ']')
                    $trigger.on('change', function() {
                        var nValue = '-' + fieldValue(trigger).toLowerCase() + '-'
                        var nRes1 = !obj.triggers[trigger].in ? true : vIn.indexOf(nValue) >= 0
                        var nRes2 = !obj.triggers[trigger].not_in ? true : vNotIn.indexOf(nValue) == -1
                        if (!obj.expression) {
                            var nResEval = true
                        } else {
                            nResEval = eval(obj.expression)
                        }
                        if (nRes1 && nRes2 && nResEval) {
                            var nRes = true
                        } else {
                            var nRes = false
                        }
                        switch (obj.mode) {
                            case 'hide_if':
                                nRes ? $hide(dest) : $show(dest)
                                break;
                            case 'show_if':
                                nRes ? $show(dest) : $hide(dest)
                                break;
                            case 'disable_if':
                                nRes ? $disable(dest) : $enable(dest)
                                break;
                            case 'enable_if':
                                nRes ? $enable(dest) : $disable(dest)
                            default:
                                break;
                        }
                    })
                })
            }
        })
    }
    /*Procesamos los campos enum depend*/
processEnumDependSelects = function processEnumDependSelects() {
        //Primero los clasicos, los que son "noprocess"
        $('.autof [enum_depend][noprocess]').each(function() {
                var nameTrigger = $(this).attr('enum_depend')
                var $trigger = $('.autof #' + $(this).attr('enum_depend'))
                var $destSel = this
                $trigger.on('change', function() {
                    curValue = fieldValue(nameTrigger) || []
                    curValue = typeof curValue == 'string' ? Array(curValue) : curValue
                    $('optgroup', $destSel).hide()
                    curValue.forEach(function(item) {
                        $('optgroup[slug=' + _.slugify(item) + ']', $destSel).show()
                    })
                })
                $trigger.change()
            })
            //Luego, los que han sido procesados por selectize. Los cogemos desde el objeto en memoria "processSelectize"
        _.each(processSelectize, function(theObject, key) {
            if (theObject.hasEnumDepend) {
                $select = theObject[0].selectize
                theObject.options = {}
                _.extend(theObject.options, $select.options)
                $select.clearOptions()
                var $destSel = $('.autof #' + key)
                var nameTrigger = $destSel.attr('enum_depend')
                var $trigger = $('.autof #' + nameTrigger)
                $trigger.on('change', function() {
                    $select.clearOptions()
                    curValue = fieldValue(nameTrigger) || []
                    curValue = typeof curValue == 'string' ? Array(curValue) : curValue
                    curValue = curValue.map(_.slugify)
                    _.each(theObject.options, function(theOption, theOptionKey) {
                        if (curValue.indexOf(_.slugify(theOption.optgroup)) >= 0) {
                            $select.addOption(theOption)
                        }
                        $select.refreshOptions()
                    })
                })
                $select.clearOptions()
                    //$trigger.change()
            }
        })
    }
    // Añade la clase "changed" al formulario cuando se cambia algún valor
alertFormChange = function alertFormChange($form) {
    $('input,textarea,select', $form).on('change', function() {
            $form.addClass('changed')
        })
        //RELEASE Descomentar para pasar a produccion, para trabajar es un rollo
        // window.onbeforeunload = function(e) {
        //     return 'El formulario se ha modificado, pero no se han guardado los cambios. \\n¿Quiere abandonar esta página?, ';
        // };
}
activateCustomValidation = function activateCustomValidation($jqueryObject) {
    $('input,textarea,select', $jqueryObject).on('blur change', function() {
        var control = $(this)
            // control.addClass('focused')
        control.closest('div[id]').attr('isvalid', control[0].validity.valid).addClass('focused')
        checkFormValidity($jqueryObject.closest('form.autof'))
    })
}
checkFormValidity = function checkFormValidity($form) {
        if ($form[0].checkValidity()) {
            $("#add-button", $form).removeClass('disabled').attr("title", "Formulario validado. Pulse para guardar los datos.")
        } else {
            $("#add-button", $form).addClass('disabled').attr("title", "Formulario no validado")
        }
    }
    //convierte un array simple en un array de objetos listo para ser procesado en los campos select
arrEnum2ObjArrEnum = function arrEnum2ObjArrEnum(arr) {
    var theObject = []
    var curBlock = 'init'
    arr.forEach(function(item) {
        if (_.endsWith(item, '-')) {
            curBlock = _.humanize(item.replace(/-/g, ''))
        } else {
            var nObj = {}
            var it = item.replace(/\*/g, '')
            nObj.value = it
            nObj.label = it
            nObj.optgroup = curBlock
            if (_.endsWith(item, '*')) {
                nObj.selected = true
            }
            theObject.push(nObj)
        }
    })
    return theObject
}
parseRootQueries = function parseRootQueries(obj) {
        _.each((obj.def.queries), function(theSource, key) {
            queries[key] = queryToEnum(theSource)
        })
    }
    //Establecemos los valores iniciales de los radio, puesto que no podemos hacerlo en runtime
setInitialRadioValues = function setInitialRadioValues() {
        _.each(c.fields, function(value, key) {
            if (!_.startsWith(key, '_') && value.type == 'radio') {
                setFieldValue(key, value.value)
            }
        })
    }
    //todo Asignar acciones a los botones en función del modo y en función de la validación
    //todo Habilitar para que al hacer click en los titulos y :after(iconos) simule el hecho de entrar en el campo, por ejemplo para desplegar el calendario
    //todo crear un tipo de campo booleano, que maneje los valores sí-no y almacene siempre true/false
    //fixme Los ssegundos campos tipo date, no depliegan el calendario
    //todo hacer funcion que devuelva el pattern apropiado para DNI, DOI o pasaporte.Quizas seria una buena idea hacer una colección de patterns ubicados en el mismo sitio. La colección tambien podría incluir mascaras de entrada.
    //Habilitar la posibilidad de poner una configuracion especifica por bloques, según el nombre del bloque.
    //fixme No funciona poner value en common
renderForm = function renderForm(objectSource, divDestName) {
        nx = objectSource
        autof = new AF(divDestName, {
                def: sanitizeObjectNameKeys(objectSource.content || objectSource),
                name: objectSource.name
            })
            //TODO Importante @security Poner una condicion que permita que solo los ususrios administradores puedan manejar la configuración
        if (1 == 1) {
            var theAdminLink = $('<a>', {
                    class: 'admin admin-form',
                    target: '_blank',
                    href: '/backend/af/' + objectSource.name,
                    title: t('Setup this form')
                }).html('<i class="fa fa-wrench"></i>').prependTo($('#' + divDestName).parent())
                // c.HTML.title.wrap('<a target = _blank class="admin" href="/backend/af/' + c.form.name + '" title="You are admin. Setup form">')
        }
    }
    /*
    Convierte en Array los datos de un fromulario
    */
formToJson = function formToJson(objForm) {
        //  console.clear()
        var fields = $('[name][id]:not(.subObject)', objForm)
            //console.log(fields)
        var numberTypes = ['number', 'currency', 'range']
        var dateTypes = ['date', 'datetime', 'time']
        var f = objForm
        var res = {}
        fields.each(function(index, value) {
            if (_.indexOf(numberTypes, $('#' + this.name, f).attr('type')) >= 0) {
                this.save_as = $('#' + this.name, f).attr('save_as') || 'number'
            } else if (_.indexOf(dateTypes, $('#' + this.name, f).attr('type')) >= 0) {
                this.save_as = 'date'
            } else {
                this.save_as = $('#' + this.name, f).attr('save_as') || 'string'
            }
            var theValue = fieldValue($(this))
                //procesamos los number
            if (this.save_as == 'number') {
                if (_.isArray(theValue)) {
                    theValue.forEach(function(elem, key) {
                        theValue[key] = elem * 1
                    })
                } else {
                    theValue = theValue * 1
                }
            }
            //procesemos los date
            //Los campos date los procesamos como date
            if (this.save_as == 'date') {
                if ($(value).attr("type") == 'date' || $(value).attr("type") == 'datetime') {
                    theValue = toDate(theValue)
                } else if ($(value).attr("type") == 'time') {
                    theValue = toDate('00-00-0000' + ' ' + theValue)
                }
                theValue = isNaN(theValue) ? null : theValue
            } else if (this.save_as == 'boolean') {
                theValue = eval(theValue)
            }
            //Precesamos los campos typo tags, para convertirlos en un array
            if ($(this).attr('type') == 'tags') {
                theValue = fieldValue($(this)).split(',')
            }
            res[this.name] = (theValue == '' ? null : theValue) || null
        })
        $('div.block[limit]', objForm).each(function() {
            _.extend(res, getBlocValues($(this)))
        })
        return res
    }
    /*
    Procesa los valores de un bloque de varios campos convirtiendolo en un array
    */
getBlocValues = function getBlocValues($object, intLimit) {
        //todo Procesar la salida de getBlockValues, para que si limit=1, solo devuelva un objeto y no un array
        var theBlock = $object
        var index = 0
        var theBlockName = theBlock.attr('id')
        var resBV = {}
        var arrRow = []
        var curIndex = '0'
        var nObj = {}
        $('.subObject[name]', theBlock).each(function() {
                var theControl = $(this)
                var theControlName = theControl.attr('name')
                var vName = _.strLeftBack(theControlName, '-')
                var vIndex = _.strRightBack(theControlName, '-')
                var vValue = fieldValue(theControl)
                if ($object.attr('limit') == 1) {
                    nObj[vName] = vValue
                } else {
                    nObj[vIndex] = nObj[vIndex] || {}
                    nObj[vIndex][vName] = vValue
                }
            })
            //Si limit=1 solo devolvemos un objeto
        if ($object.attr('limit') == 1) {
            resBV[theBlockName] = nObj
        } else {
            _.each(nObj, function(val) {
                arrRow.push(val)
            })
            resBV[theBlockName] = arrRow
        }
        return resBV
    }
    //TODO esta operacion hay que hacerla desde un metodo de meteor, añadiendo autofecha, usuario, etc.....
sendFormToMongo = function sendFormToMongo($form) {
        //var dest = $form.attr('collection')
        var insertObj = formToJson($form)
        Meteor.call('saveAfRecord', c.form.name, insertObj, function(err, res) {
                if (err) {
                    console.error(err)
                }
                if (res) {
                    dbg('res', res)
                    if (res.status == 'saved') {
                        document.getElementById($form.attr('id')).reset();
                    }
                }
            })
            //var insert = cCols[dest].insert(insertObj)
            //return insert
    }
    // //Devuelve un array de objetos con las claves value y label, listo para ser usado en un campo tipo enum de formulario.
    // //Como parametro requiere un objeto con las siguientes claves:
    // //query.collection: la coleccion a utilizar 
    // //query.filter: un selector al estilo mongo 
    // //query.format: Modificadores de salida de campos al stilo meteor mongo, incluyendo campos que se muestran, orden, limit. Ejemplo: 
    // //query.value: String. Lo que se guardara como valu en el <select>. Los nombres de campo a utilizar se encierran entre corchetes. Despues se quitan los corchetes  y se  le pasa la funcion eval
    // //query.label: String. Lo que se mostrara como label en el <select>. Los nombres de campo a utilizar se encierran entre corchetes. Despues se quitan los corchetes  y se  le pasa la funcion eval
    // Ejemplo de configuracion:
    // var query = {}
    // query.filter = {
    //     primer_apellido: {
    //         $exists: true
    //     }
    // }
    // query.format = {
    //     fields: {
    //         _id: 0,
    //         nombre: 1,
    //         primer_apellido: 1,
    //         sexo: 1
    //     },
    //     sort: {
    //         primer_apellido: 1
    //     },
    //     limit: 10
    // }
    // query.value = '[primer_apellido]'
    // query.label = '[nombre] + \' \' + [primer_apellido]'
queryToEnum = function queryToEnum(query) {
        //sustituimos lo encerrado entre corchetes con el contenido del campo de su nombre
        var expresion = /\[[a-zA-Z0-9._-]+\]/g
            //Importante manetener query.value en la primera posicion, porque la vamos a usar despues por posicion
        var t = _.unique(((query.value || '') + (query.label || '') + (query.optgroup || '')).match(expresion) || [])
        var subst = []
        t.forEach(function(k) {
                subst.push(k.replace(/\[|\]/g, ''))
            })
            //vamos a definir fields, para que no haya que expresarlo innecesariamente
        var obJFields = {}
        query.filter = query.filter || {}
        subst.forEach(function(nItem) {
                obJFields[nItem.split('.')[0]] = 1
                    //TAmbien vamos a poner un filtro $exists: true a todos los campos que usamos para que solo nos devuelva filas con valores y evitar errores
                query.filter[nItem] = query.filter[nItem] || {}
                query.filter[nItem]["$exists"] = true
            })
            //_.extend(query.filter, autoFilter)
        query.format = query.format || {}
        query.format.fields = obJFields
        if (!query.format.sort) {
            query.format.sort = {}
            query.format.sort[subst[0]] = 1
        }
        var qRes = cCols[query.collection].find(query.filter || {}, query.format || {}).fetch()
        var arrRes = []
        var arrCompare = []
        qRes.forEach(function(theRowKey) {
            var itemArrCompare = ''
            var nObj = {}
            var strLabel = query.label || query.value
            var strValue = query.value
            var strOptgroup = query.optgroup || null
            subst.forEach(function(v) {
                var depthValue = eval('theRowKey.' + v)
                itemArrCompare = itemArrCompare + depthValue
                strLabel = strLabel.replace('[' + v + ']', '\'' + depthValue + '\'').replace(/\['/g, '').replace(/'\]/g, '')
                strValue = strValue.replace('[' + v + ']', '\'' + depthValue + '\'').replace(/\['/g, '').replace(/'\]/g, '')
                if (strOptgroup) {
                    strOptgroup = strOptgroup.replace('[' + v + ']', '\'' + (depthValue || '') + '\'').replace(/\['/g, '').replace(/'\]/g, '')
                }
            })
            if (arrCompare.indexOf(itemArrCompare) == -1) {
                arrCompare.push(itemArrCompare)
                nObj.label = eval(strLabel)
                nObj.value = eval(strValue)
                strOptgroup ? nObj.optgroup = eval(strOptgroup) : null
                arrRes.push(nObj)
            }
        })
        return _.unique(arrRes)
    }
    //todo @urgente Quitar los inconos de los bloques [limit=1]
    //todo añadir una opcion el la definicion del form que indique donde queremos ir o que queremos hacer despues de insertar, o eliminar, o modificar estableciendo ademas valores por defecto.
    //Traduce una cadena en el formulario si esta habilitada la traduccion a nivel de formulario
ft = function ft(cadena) {
    if (c.form.i18n != false) {
        return t(cadena) || cadena
    } else {
        return cadena
    }
}
