﻿import 'bootstrap-select'

export default class Select implements IService {
    //https://developer.snapappointments.com/bootstrap-select/

    public enableEnhance(selector: JQuery) { selector.each((i, e) => this.enhance($(e))); }

    enhance(selectControl: JQuery) {
        selectControl.selectpicker();
    }

    public replaceSource(controlId: string, items) {

        let $control = $('#' + controlId);

        if ($control.is("select")) {
            $control.empty();
            for (let i = 0; i < items.length; i++) {
                $control.append($("<option value='" + items[i].Value + "'>" + items[i].Text + "</option>"));
            }

        } else {
            console.log("Unable to replace list items");
        }
    }
}
