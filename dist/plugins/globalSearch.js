define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionEnum = exports.AjaxState = exports.GlobalSearchFactory = void 0;
    var GlobalSearchFactory = /** @class */ (function () {
        function GlobalSearchFactory(waiting, modalHelper) {
            this.waiting = waiting;
            this.modalHelper = modalHelper;
        }
        GlobalSearchFactory.prototype.enable = function (selector) {
            var _this = this;
            selector.each(function (i, e) { return new GlobalSearch($(e), _this.waiting, _this.modalHelper).enable(); });
        };
        return GlobalSearchFactory;
    }());
    exports.GlobalSearchFactory = GlobalSearchFactory;
    var GlobalSearch = /** @class */ (function () {
        function GlobalSearch(input, waiting, modalHelper) {
            this.input = input;
            this.waiting = waiting;
            this.isMouseInsideSearchPanel = false;
            this.isTyping = false;
            this.searchedText = null;
            this.modalHelper = modalHelper;
        }
        GlobalSearch.prototype.boldSearch = function (str, searchText) {
            var ix = -1;
            var result = "";
            if (str !== null && str !== undefined) {
                str = str.replace(/<strong>/gi, "↨↨").replace(/<\/strong>/gi, "↑↑");
                var strlower = str.toLowerCase();
                if (searchText !== "" && searchText !== null && searchText !== undefined) {
                    var stxt = searchText.toLowerCase();
                    do {
                        var ixNext = strlower.indexOf(stxt, ix);
                        if (ixNext < 0) {
                            break;
                        }
                        if (ix < 0) {
                            result = str.substr(0, ixNext);
                        }
                        result += (ix >= 0 ? str.substr(ix, ixNext - ix) : "") +
                            "<strong>" +
                            str.substr(ixNext, stxt.length) + "</strong>";
                        ix = ixNext + stxt.length;
                    } while (true);
                }
                result += (ix < 0 ? str : str.substr(ix, str.length - ix));
                result = result.replace(/↨↨/gi, "<strong>").replace(/↑↑/gi, "</strong>");
            }
            return result;
        };
        GlobalSearch.prototype.boldSearchAll = function (str, searchText) {
            var result = str;
            if (searchText !== null && searchText !== undefined) {
                var splitedsearchtext = searchText.split(" ");
                for (var _i = 0, splitedsearchtext_1 = splitedsearchtext; _i < splitedsearchtext_1.length; _i++) {
                    var strST = splitedsearchtext_1[_i];
                    result = this.boldSearch(result, strST);
                }
            }
            return result;
        };
        GlobalSearch.prototype.enable = function () {
            var _this = this;
            if (this.input.is("[data-globalsearch-enabled=true]")) {
                return;
            }
            else {
                this.input.attr("data-globalsearch-enabled", "true");
            }
            this.input.wrap("<div class='global-search-panel'></div>");
            var urlsList = (this.input.attr("data-search-source") || "").split(";");
            this.urlList = urlsList;
            var timeout = null;
            this.input.keyup(function (e) {
                if (e.keyCode === 27) {
                    return;
                }
                _this.isTyping = true;
                clearTimeout(timeout);
                timeout = setTimeout((function () {
                    _this.isTyping = false;
                    if (_this.searchedText !== _this.input.val().trim()) {
                        _this.createSearchComponent(_this.urlList);
                    }
                }), 300);
            });
            this.input.on("blur", (function (e) {
                if (_this.isMouseInsideSearchPanel === false) {
                    _this.clearSearchComponent();
                }
            }));
            this.input.on("focus", (function (e) {
                var inputholder = _this.input.parent();
                var panel = inputholder.find(".global-search-result-panel");
                if (panel.children().length > 0)
                    panel.show();
            }));
        };
        GlobalSearch.prototype.clearSearchComponent = function () {
            var inputholder = this.input.parent();
            if (inputholder !== undefined) {
                var panel = inputholder.find(".global-search-result-panel");
                if (panel !== undefined) {
                    panel.fadeOut('fast');
                    // panel.empty();
                    // panel.remove();
                }
            }
        };
        GlobalSearch.prototype.getResultPanel = function () {
            var _this = this;
            var searchPanel = this.input.parent();
            var resultPanel = searchPanel.find(".global-search-result-panel");
            if (resultPanel === undefined || resultPanel === null || resultPanel.length === 0) {
                resultPanel = $("<div class='global-search-result-panel'>")
                    .mouseenter(function () { return _this.isMouseInsideSearchPanel = true; })
                    .mouseleave(function () { return _this.isMouseInsideSearchPanel = false; });
                searchPanel.append(resultPanel);
            }
            else {
                resultPanel.empty().show();
            }
            $(window).on("keydown", function (e) {
                if (e.keyCode === 27) {
                    resultPanel.hide(null, function () {
                        $(window).off("keydown");
                    });
                    $('input[name=searcher]').val('');
                }
            });
            return resultPanel;
        };
        GlobalSearch.prototype.createSearchComponent = function (urls) {
            var _this = this;
            this.searchedText = this.input.val().trim();
            var resultPanel = this.getResultPanel();
            resultPanel.empty();
            var searchHolder = $("<div class='search-container'>");
            this.waiting.show();
            var ajaxList = urls.map(function (p) {
                var icon = p.split("#")[1].trim();
                return {
                    url: p.split("#")[0].trim(),
                    icon: icon,
                    state: AjaxState.pending,
                };
            });
            var context = {
                ajaxList: ajaxList,
                resultCount: 0,
                resultPanel: resultPanel,
                searchHolder: searchHolder,
                beginSearchStarted: true,
                searchedText: this.searchedText,
            };
            var _loop_1 = function (ajaxObject) {
                ajaxObject.ajx = $
                    .ajax({
                    dataType: "json",
                    url: ajaxObject.url,
                    xhrFields: { withCredentials: true },
                    async: true,
                    data: { searcher: context.searchedText },
                    success: function (result) { return _this.onSuccess(ajaxObject, context, result); },
                    complete: function (jqXhr) { return _this.onComplete(context, jqXhr); },
                    error: function (jqXhr) { return _this.onError(ajaxObject, resultPanel, jqXhr); },
                });
            };
            for (var _i = 0, _a = context.ajaxList; _i < _a.length; _i++) {
                var ajaxObject = _a[_i];
                _loop_1(ajaxObject);
            }
        };
        GlobalSearch.prototype.onSuccess = function (sender, context, result) {
            var _this = this;
            if (this.isTyping === false) {
                sender.result = result;
                if (result !== null && result !== undefined && typeof (result) === typeof ([])) {
                    sender.state = AjaxState.success;
                    var resultfiltered = result.filter(function (p) { return _this.isValidResult(p, context); });
                    var searchItem = this.createSearchItems(sender, context, resultfiltered);
                    context.searchHolder.append(searchItem);
                    if (context.beginSearchStarted && resultfiltered.length > 0) {
                        context.beginSearchStarted = false;
                        context.resultPanel.append(context.searchHolder);
                    }
                }
                else {
                    sender.state = AjaxState.failed;
                    console.error("ajax success but failed to decode the response -> wellform expcted response is like this: [{Title:'',Description:'',IconUrl:'',Url:''}] ");
                }
            }
        };
        GlobalSearch.prototype.isValidResult = function (item, context) {
            var resfilter = false;
            if (context.searchedText) {
                var arfilter = context.searchedText.split(" ");
                for (var _i = 0, arfilter_1 = arfilter; _i < arfilter_1.length; _i++) {
                    var strfilter = arfilter_1[_i];
                    if (((item.Description !== null &&
                        item.Description !== undefined &&
                        item.Description.match(new RegExp(strfilter, "gi")) !== null) ||
                        item.Title.match(new RegExp(strfilter, "gi")) !== null)) {
                        resfilter = true;
                        break;
                    }
                }
            }
            else {
                resfilter = true;
            }
            return resfilter;
        };
        GlobalSearch.prototype.createSearchItems = function (sender, context, items) {
            var _a;
            var searchItem = $("<div class='search-item'>");
            var groupTitle = ((items === null || items === void 0 ? void 0 : items.length) > 0 && ((_a = items[0].GroupTitle) === null || _a === void 0 ? void 0 : _a.length) > 0) ? items[0].GroupTitle : sender.url.split(".")[0].replace("https://", "").replace("http://", "").toUpperCase();
            var searchTitleHolder = $("<div class='search-title'>");
            if ((items === null || items === void 0 ? void 0 : items.length) > 0 && items[0].Colour) {
                searchItem.css("color", items[0].Colour);
                searchTitleHolder.css("color", items[0].Colour);
            }
            var searhTitle = searchTitleHolder.append($("<i>").attr("class", sender.icon)).append(groupTitle);
            searchItem.append(searhTitle);
            var childrenItems = $("<ul>");
            for (var i = 0; i < items.length && i < 10; i++) {
                context.resultCount++;
                childrenItems.append(this.createItem(items[i], context));
            }
            $(childrenItems).find("[target='$modal'][href]").off("click").click(function () {
                $(".global-search-result-panel").fadeOut();
            });
            this.modalHelper.enableLink($(childrenItems).find("[target='$modal'][href]"));
            searchItem.append(childrenItems);
            if (items.length === 0) {
                searchItem.addClass("d-none");
            }
            return searchItem;
        };
        GlobalSearch.prototype.createItem = function (item, context) {
            var attr = "";
            if (item.Action == ActionEnum.Popup)
                attr = "target=\"$modal\"";
            else if (item.Action == ActionEnum.NewWindow)
                attr = "target=\"_blank\"";
            return $("<li>")
                .append((item.IconUrl === null || item.IconUrl === undefined) ?
                $("<div class='icon'>") : this.showIcon(item))
                .append($("<a href='" + item.Url + "' " + attr + ">")
                .html(this.boldSearchAll(item.Title, context.searchedText)))
                .append($(" <div class='desc'>").html(item.Description));
        };
        GlobalSearch.prototype.onComplete = function (context, jqXHR) {
            if (context.ajaxList.filter(function (p) { return p.state === 0; }).length === 0) {
                this.waiting.hide();
                if (context.resultCount === 0) {
                    var ulNothing = $("<ul>");
                    ulNothing.append("<li>").append("<span>").html("Nothing found");
                    context.resultPanel.append(ulNothing);
                }
            }
        };
        GlobalSearch.prototype.onError = function (sender, resultPanel, jqXHR) {
            sender.state = AjaxState.failed;
            var ulFail = $("<ul>");
            ulFail.append($("<li>").append($("<span>")
                .html("ajax failed Loading data from source [" + sender.url + "]")));
            resultPanel.append(ulFail);
            console.error(jqXHR);
        };
        GlobalSearch.prototype.showIcon = function (item) {
            if (item.IconUrl.indexOf("fa-") > 0) {
                return $("<div class='icon'>").append($("<i class='" + item.IconUrl + "'></i>"));
            }
            else {
                return $("<div class='icon'>").append($("<img src='" + item.IconUrl + "'>"));
            }
        };
        return GlobalSearch;
    }());
    exports.default = GlobalSearch;
    var AjaxState;
    (function (AjaxState) {
        AjaxState[AjaxState["pending"] = 0] = "pending";
        AjaxState[AjaxState["success"] = 1] = "success";
        AjaxState[AjaxState["failed"] = 2] = "failed";
    })(AjaxState = exports.AjaxState || (exports.AjaxState = {}));
    var ActionEnum;
    (function (ActionEnum) {
        ActionEnum[ActionEnum["Redirect"] = 0] = "Redirect";
        ActionEnum[ActionEnum["Popup"] = 1] = "Popup";
        ActionEnum[ActionEnum["NewWindow"] = 2] = "NewWindow";
    })(ActionEnum = exports.ActionEnum || (exports.ActionEnum = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsU2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsdWdpbnMvZ2xvYmFsU2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUdBO1FBQ0ksNkJBQW9CLE9BQWdCLEVBQVUsV0FBd0I7WUFBbEQsWUFBTyxHQUFQLE9BQU8sQ0FBUztZQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3RFLENBQUM7UUFFTSxvQ0FBTSxHQUFiLFVBQWMsUUFBZ0I7WUFBOUIsaUJBRUM7WUFERyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsT0FBTyxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBL0QsQ0FBK0QsQ0FBQyxDQUFDO1FBQzdGLENBQUM7UUFDTCwwQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBUFksa0RBQW1CO0lBU2hDO1FBZ0RJLHNCQUFvQixLQUFhLEVBQVUsT0FBZ0IsRUFBRSxXQUF3QjtZQUFqRSxVQUFLLEdBQUwsS0FBSyxDQUFRO1lBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztZQTlDbkQsNkJBQXdCLEdBQVksS0FBSyxDQUFDO1lBQzFDLGFBQVEsR0FBWSxLQUFLLENBQUM7WUFDMUIsaUJBQVksR0FBVyxJQUFJLENBQUM7WUE4Q2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBRW5DLENBQUM7UUE3Q1MsaUNBQVUsR0FBcEIsVUFBcUIsR0FBVyxFQUFFLFVBQWtCO1lBQ2hELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1osSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDO1lBQ3hCLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO2dCQUNuQyxHQUFHLEdBQUcsR0FBRyxDQUFD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