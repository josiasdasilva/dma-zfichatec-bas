sap.ui.define([
    "dma/zfichatec/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/Label",
	"sap/m/Popover",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, Filter, FilterOperator, Label, Popover, DateFormat, Fragment, JSONModel, MessageToast) {
	"use strict";
	//var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return BaseController.extend("dma.zfichatec.controller.Home", {
		// _planningCalendar: null,
		_aDialogTypes: null,
		sUname: '',
		sEkgrp: '',
        // _idAppntOverSeven: null,

        /**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf dma.zfichatec.view.Home
		 */
		onInit: function () {
			var sRootPath = jQuery.sap.getModulePath("dma.zfichatec");
			var sImagePath = sRootPath + "/img/background_cockpit.png";
            // this.byId("img_epa").setSrc(sImagePath); /* popula dados da Agenda */
        },
        
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf dma.zfichatec.view.Home
		 */
		onBeforeRendering: function() {
			this.initScreenParams();
		},

        /**
         * 
         * 
         */
        completedHandlerWizard01: function(oEvt){
            sap.m.MessageToast.show("Em desenvolvimento (Placeholder)");
        },

        /**
         * 
         * 
         */
        initScreenParams: function(){
            let oModelScreenParams = this.getView().getModel("modelScreenParams");
            
            let oJson = {
                "screen1": {
                    "idInputCompradorCod1"          : "",
                    "idInputCompradorDescr1"        : "",
                    "idInputFornecedorCod1"         : "",
                    "idInputFornecedorDescr1"       : "",
                    "idInputContrato1"              : "",
                    "GroupVisRelat"                 : "1",
                    "idCheckBoxSomenteMatXdock1"    : false,
                    "idInputFonteDe1"               : "",
                    "idInputStatusMat1"             : "",
                    "idInputDepart1"                : "",
                    "idInputNoDe1"                  : "",
                    "idCheckBoxAtacado1"            : true,
                    "idCheckBoxVarejo1"             : true,
                    "idInputUf1"                    : "",
                    "idInputGrpPrecos1"             : "",
                    "idInputLoja1"                  : "",
                    "idInputSortim1"                : ""
                }
            };

            oModelScreenParams.setData(oJson);
        },

/*
        onCancelDialog: function(sDialogId){
            this.byId(sDialogId).close();
        },

        onOpenDialog : function (sDialogId, sDialogViewName) {
            let oView = this.getView();

			// create dialog lazily
			if (!this.byId(sDialogId)) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: `dma.zfichatec.view.${sDialogViewName}`,
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId(sDialogId).open();
			}
        }
*/

        /**
         * 
         * 
         */
        onCancelDialog: function(oEvt){
            let sDialogViewName = oEvt.getSource().data("dialogViewName");
            this._getDialog(sDialogViewName).close();
        },

        /**
         * 
         * 
         */
        _getDialog: function (sDialogViewName) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(`dma.zfichatec.view.${sDialogViewName}`, this);
                this.getView().addDependent(this._oDialog);
            }
            return this._oDialog;
        },
        
        /**
         * 
         * 
         */
        onValueHelpComprador: function(){
            this._getDialog("ShComprador").open();
            // this.onOpenDialog("idFragmentShComprador", "ShComprador");
        },

        /**
         * 
         * 
         */
        onValueHelpContrato: function(){
            this._getDialog("ShContrato").open();
        },

        /**
         * 
         * 
         */
        onValueHelpFornecedor: function(){
            this._getDialog("ShFornecedor").open();
        },

        /**
         * 
         * 
         */
        onCompradorClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            if (oSelectedItem) {
                var sEkgrp = oSelectedItem.getTitle();
                let oModel = this.getView().getModel("modelScreenParams");
                oModel.getData().screen1.idInputCompradorCod1 = sEkgrp;
                oModel.refresh(true);
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onContratoClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            if (oSelectedItem) {
                var sEbeln = oSelectedItem.getTitle();
                let oModel = this.getView().getModel("modelScreenParams");
                oModel.getData().screen1.idInputContrato1 = sEbeln;
                oModel.refresh(true);
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onFornecedorClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            if (oSelectedItem) {
                var sLifnr = oSelectedItem.getTitle();
                let oModel = this.getView().getModel("modelScreenParams");
                oModel.getData().screen1.idInputFornecedorCod1 = sLifnr;
                oModel.refresh(true);
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onCompradorSearch: function(oEvt){
			let sValue = oEvt.getParameter("value");
			// let oFilter = new Filter("Ekgrp", FilterOperator.Contains, sValue);
			let oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
			let oBinding = oEvt.getSource().getBinding("items");
			oBinding.filter([oFilter]);
        },

        /**
         * 
         * 
         */
        onContratoSearch: function(oEvt){
/*
            let sValue = oEvt.getParameter("value");
			let oFilter = new Filter("", FilterOperator.Contains, sValue);
			let oBinding = oEvt.getSource().getBinding("items");
			oBinding.filter([oFilter]);
*/
        },

        /**
         * 
         * 
         */
        onFornecedorSearch: function(oEvt){
/*
            let sValue = oEvt.getParameter("value");
			let oFilter = new Filter("", FilterOperator.Contains, sValue);
			let oBinding = oEvt.getSource().getBinding("items");
			oBinding.filter([oFilter]);
*/
        },
    });
});