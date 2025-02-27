import 'bootstrap-select'
import { ModalHelper } from "olive/components/modal"
import Config from "olive/config"

export class MultiSelectFactory implements IService {
    constructor(private modalHelper: ModalHelper) { }

    public enable(selector: JQuery) { selector.each((i, e) => new MultiSelect($(e), this.modalHelper).show()); }
}

export default class MultiSelect implements IService {
    //https://developer.snapappointments.com/bootstrap-select/


    constructor(protected selectControl: JQuery, private modalHelper: ModalHelper) {
        if ($.fn.selectpicker)
            $.fn.selectpicker.Constructor.BootstrapVersion = "4";
    }

    public show() {

        var maxOptions = this.selectControl.attr("maxOptions") || false;
        var actionsBox = this.selectControl.attr("actionsBox") || true;
        var container = this.selectControl.attr("container") || false;
        var countSelectedText = this.selectControl.attr("countSelectedText") || "count"
        var deselectAllText = this.selectControl.attr("deselectAllText") || "Deselect All";
        var dropdownAlignRight = this.selectControl.attr("dropdownAlignRight") || false;
        var dropupAuto = this.selectControl.attr("dropupAuto") || true;
        var header = this.selectControl.attr("header") || false;
        var hideDisabled = this.selectControl.attr("hideDisabled") || false;
        var iconBase = this.selectControl.attr("iconBase") || "glyphicon";
        var liveSearch = this.selectControl.attr("liveSearch") || true;
        var liveSearchNormalize = this.selectControl.attr("liveSearchNormalize") || false;
        var liveSearchPlaceholder = this.selectControl.attr("liveSearchPlaceholder") || null;
        var liveSearchStyle = this.selectControl.attr("liveSearchStyle") || "contains";
        var maxOptionsText = this.selectControl.attr("maxOptionsText") || "Cannot select more items";
        var mobile = this.selectControl.attr("mobile") || false;
        var multipleSeparator = this.selectControl.attr("multipleSeparator") || ", ";
        var noneSelectedText = this.selectControl.attr("noneSelectedText") || "Nothing selected";
        var noneResultsText = this.selectControl.attr("noneResultsText") || "No results matched";
        var selectAllText = this.selectControl.attr("selectAllText") || "Select All";
        var selectedTextFormat = this.selectControl.attr("selectedTextFormat") || "count > 1";
        var selectOnTab = this.selectControl.attr("selectOnTab") || false;
        var showContent = this.selectControl.attr("showContent") || true;
        var showIcon = this.selectControl.attr("showIcon") || true;
        var showSubtext = this.selectControl.attr("showSubtext") || false;
        var showTick = this.selectControl.attr("showTick") || true;
        var size = this.selectControl.attr("size") || "auto";
        var styleBase = this.selectControl.attr("styleBase") || "btn";
        var tickIcon = this.selectControl.attr("tickIcon") || "glyphicon-ok";
        var title = this.selectControl.attr("title") || null;
        var virtualScroll = this.selectControl.attr("virtualScroll") || false;
        var width = this.selectControl.attr("width") || false;
        var windowPadding = this.selectControl.attr("windowPadding") || 0;
        var sanitize = this.selectControl.attr("sanitize") || true;

        const options = {
            maxOptions: maxOptions,
            actionsBox: actionsBox,
            container: container,
            countSelectedText: countSelectedText,
            deselectAllText: deselectAllText,
            dropdownAlignRight: dropdownAlignRight,
            dropupAuto: dropupAuto,
            header: header,
            hideDisabled: hideDisabled,
            iconBase: iconBase,
            liveSearch: liveSearch,
            liveSearchNormalize: liveSearchNormalize,
            liveSearchPlaceholder: liveSearchPlaceholder,
            liveSearchStyle: liveSearchStyle,
            maxOptionsText: maxOptionsText,
            mobile: mobile,
            multipleSeparator: multipleSeparator,
            noneSelectedText: noneSelectedText,
            noneResultsText: noneResultsText,
            selectAllText: selectAllText,
            selectedTextFormat: selectedTextFormat,
            selectOnTab: selectOnTab,
            showContent: showContent,
            showIcon: showIcon,
            showSubtext: showSubtext,
            showTick: showTick,
            size: size,
            styleBase: styleBase,
            tickIcon: tickIcon,
            title: title,
            virtualScroll: virtualScroll,
            width: width,
            windowPadding: windowPadding,
            sanitize: sanitize
        };
        this.selectControl.selectpicker(options);

        this.MoveActionButtons();
    }

    private MoveActionButtons() {
        //var actionbuttons = $(".bs-actionsbox");
        //if (actionbuttons != undefined && actionbuttons != null)
        //    actionbuttons.parent().prepend($(".bs-actionsbox"));
    }


}
