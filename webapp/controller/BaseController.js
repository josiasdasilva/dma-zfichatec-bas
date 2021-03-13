/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("dma.zfichatec.controller.BaseController", {
        /**
         * 
         * 
         */
        initScreenParams: function(){
            let oModelScreenParams = this.getModel("modelScreenParams");
/*
            // Old model used on Input Selection
            let oJson = {
                "screen1": {
                    "idInputCompradorCod1"          : "",
                    "idInputCompradorDescr1"        : "",
                    "idInputFornecedorCod1"         : "",
                    "idInputFornecedorDescr1"       : "",
                    "idInputContrato1"              : "",
                    "GroupVisRelat"                 : "1",
                    "idCheckBoxSomenteMatXdock1"    : false,
                    "idInputFonteSuprimento1"       : "",
                    "idInputStatusMat1"             : "",
                    "idInputDepart1"                : "",
                    "idInputNoHierarquia1"          : "",
                    "idCheckBoxAtacado1"            : true,
                    "idCheckBoxVarejo1"             : true,
                    "idInputUf1"                    : "",
                    "idInputGrpPrecos1"             : "",
                    "idInputLoja1"                  : "",
                    "idInputSortim1"                : "",
                    "idCheckBoxTotUf1"              : false,
                    "idCheckBoxTotGrp1"             : false
                }
            };
*/
            // New model used on MultiInput Selection
            let oJson = {
                "screen1": {
                    "idMultiInputCompradorCod1"     : [],
                    "idMultiInputFornecedorCod1"    : [],
                    "idMultiInputContrato1"         : [],
                    "GroupVisRelat"                 : "1",
                    "idCheckBoxSomenteMatXdock1"    : false,
                    "idMultiInputFonteSuprimento1"  : [],
                    "idMultiInputStatusMat1"        : [],
                    "idMultiInputDepart1"           : [],
                    "idMultiInputNoHierarquia1"     : [],
                    "idCheckBoxAtacado1"            : true,
                    "idCheckBoxVarejo1"             : true,
                    "idMultiInputUf1"               : [],
                    "idMultiInputGrpPrecos1"        : [],
                    "idMultiInputLoja1"             : [],
                    "idMultiInputSortim1"           : [],
                    "idCheckBoxTotUf1"              : false,
                    "idCheckBoxTotGrp1"             : false
                }
            };

            oModelScreenParams.setData(oJson);
        },

        /**
         * 
         * 
         */
        getScreenParam: function(sScreenName, sProperty){
            return this.getModel("modelScreenParams").getData()[sScreenName][sProperty];
        },

        /**
         * 
         * 
         */
        getScreenParams: function(sScreenName){
            return this.getModel("modelScreenParams").getData()[sScreenName];
        },

        /**
         * 
         * 
         */
        refreshScreenModel: function(){
            this.getModel("modelScreenParams").refresh(true);
        },

        /**
         * 
         * 
         */
        getRadioButtonVisRelatOptions: function(){
            return {
                "UF"            : "1",
                "GRP_PRECOS"    : "2",
                "FONTE_SUPR"    : "3",
                "LOJA"          : "4",
                "SORTIM"        : "5"
            }
        },

		onValueHelpGenericCancelPress: function (oEvt) {
			oEvt.oSource.close();
		},
		onValueHelpGenericAfterClose: function (oEvt) {
			oEvt.oSource.destroy();
        },

        _createFilterForSelectionSet: function (aSelectionSet) {
			let aFilters = [];
			for (let itemFilter of aSelectionSet) {

				if (itemFilter.getValue && itemFilter.getValue().length > 0) {
					aFilters.push(new sap.ui.model.Filter({
						path: itemFilter.mProperties.name,
						operator: sap.ui.model.FilterOperator.Contains,
						value1: itemFilter.getValue().toUpperCase()
					}));
				}

			}
			return aFilters;
		},        

        /**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

        /**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

        /**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

        getText: function(sText){
			return this.getResourceBundle().getText(sText);
		},

        getTextWithParams: function(sText, aParams){
			return this.getResourceBundle().getText(sText,aParams);
		},

        /**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});

});