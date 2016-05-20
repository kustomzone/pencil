function TemplateManagermentDialog() {
    Dialog.call(this);
    this.title = "Export Template Managerment";

    this.templateTypeSelector.renderer = function (items) {
        // if (!pageSize.value) return pageSize.displayName;
        return items.displayName;
    }
    var thiz = this;
    this.templates;
    this.templateTypeSelector.addEventListener("p:ItemSelected", function (event) {
        var templateType = thiz.templateTypeSelector.getSelectedItem();
        thiz.loadTemplates(templateType.value);
    }, false);
}

__extend(Dialog, TemplateManagermentDialog);

TemplateManagermentDialog.prototype.loadTemplates = function (type) {
    console.log(type);
    this.activedType = type;
    this.templates = ExportTemplateManager.getTemplatesForType(type);
    console.log("templates is:" + this.templates);
    var items = [];
    for(var i = 0; i < this.templates.length; i++) {
        var template = this.templates[i];
        var item = {
            templateName: template.name,
            description: template.description,
            author: template.author,
            template: template
        };
        console.log(item);
        items.push(item);
    }
    this.templateTable.setItems(items);

}

TemplateManagermentDialog.prototype.initializePreferenceTable = function () {
    console.log("begin create table");
    this.templateTable.column(new DataTable.PlainTextColumn("Template", function (data) {
        return data.templateName;
    }).width("1*"));
    this.templateTable.column(new DataTable.PlainTextColumn("Information", function (data) {
        return data.description;
    }).width("8em"));
    this.templateTable.column(new DataTable.PlainTextColumn("Author", function (data) {
        return data.author;
    }).width("8em"));
    var actions = [{
             id: "remove", type: "delete", title: "Remove", icon: "delete",
             isApplicable: function(tag) {
                 return true;
             },
             handler: function (item) {
                console.log(item.template);
                Dialog.confirm(
                    "Are you sure you really want to delete this template ?", null,
                    "Delete", function () {
                        ExportTemplateManager.uninstallTemplate(item.template);
                        thiz.loadTemplates(thiz.templateTypeSelector.getSelectedItem().value);
                    },
                    "Cancel"
                )
             }
     }];
    this.templateTable.column(new DataTable.ActionColumn(actions).width("6em"));
    this.templateTable.selector(false);
    var thiz = this;
    window.setTimeout(function () {
        thiz.templateTable.setup();
        thiz.templateTable.setDefaultSelectionHandler({
            run: function (data) {

            }
        });
        thiz.loadTemplates("HTML");
    }, 200);
}

TemplateManagermentDialog.prototype.setup = function () {
    var templateType = ExportTemplateManager.SUPPORTED_TYPES;
    var templateTypeName = ExportTemplateManager.SUPPORTED_TYPES_NAMES;
    console.log(templateTypeName);
    var templateItems = [];
    for (var i = 0; i <  templateType.length; i++) {
        console.log(templateType[i]);
        var name = templateTypeName[templateType[i]];
        templateItems.push({
            displayName: name,
            value: templateType[i]
        });
        console.log(templateItems);
    }
    this.templateTypeSelector.setItems(templateItems);

    //Setup table
    this.initializePreferenceTable();
}



TemplateManagermentDialog.prototype.getDialogActions = function () {
    var thiz = this
    return [
        {
            type: "extra", title: "Install new template...",
            isCloseHandler: true,
            run: function () {
                var onDone = function () {
                    thiz.loadTemplates(thiz.templateTypeSelector.getSelectedItem().value);
                }
                ExportTemplateManager.installNewTemplate(thiz.templateTypeSelector.getSelectedItem().value, onDone);
                return false;
            }
        },
        {
            type: "cancel", title: "Close",
            isCloseHandler: true,
            run: function () { return true; }
        }
    ]
}
