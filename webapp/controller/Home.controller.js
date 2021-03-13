sap.ui.define([
    "dma/zfichatec/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/Label",
    "sap/m/Popover",
    "sap/m/Token",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, Filter, FilterOperator, Label, Popover, Token, DateFormat, Fragment, JSONModel, MessageToast) {
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
            let sValueState;

            if(!this.getView().byId("idInputCompradorCod1").getValue() &&
               !this.getView().byId("idInputFornecedorCod1").getValue() &&
               !this.getView().byId("idInputContrato1").getValue()){
                sValueState = sap.ui.core.ValueState.Error;
            }else{
                sValueState = sap.ui.core.ValueState.None;
            }
            this.getView().byId("idInputCompradorCod1").setValueState(sValueState);
            this.getView().byId("idInputFornecedorCod1").setValueState(sValueState);
            this.getView().byId("idInputContrato1").setValueState(sValueState);

            if(sValueState === sap.ui.core.ValueState.Error){
                this.getView().byId("idInputCompradorCod1").focus();
                sap.m.MessageToast.show("É necessário preencher pelo menos um dos campos.");
                return 1;
            }

            sap.m.MessageToast.show("Em desenvolvimento (Placeholder)");
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
        onChangeInputField: function(oEvt){
            let sId = oEvt.getParameter("id");
            
            if(sId.search("idInputCompradorCod1") >= 0){
                this.getScreenParams("screen1").idInputCompradorDescr1 = "";
            }else if(sId.search("idInputFornecedorCod1") >= 0){
                this.getScreenParams("screen1").idInputFornecedorDescr1 = "";
            }
            // TODO: Implement internal search to fill description field's

            this.refreshScreenModel();
        },

        onTokenChangeMultiInput: function(oEvt){
            let aRemovedTokens  = [],
                aValues         = [];
            let sId = oEvt.getSource().getId();

            if(typeof oEvt.getParameter("removedTokens") !== "undefined" && oEvt.getParameter("removedTokens").length > 0){
                aRemovedTokens = oEvt.getParameter("removedTokens");
                if(sId.search("idMultiInputCompradorCod1") >= 0){
                    aValues = this.getScreenParams("screen1").idMultiInputCompradorCod1;
                    for(var iIndexOut in aRemovedTokens){
                        for(var iIndexIn in aValues){
                            if(aValues[iIndexIn].Ekgrp === aRemovedTokens[iIndexOut].getProperty("key")){
                                aValues.splice(iIndexIn, 1);
                            }
                        }
                    }
                    // Fornecedor (Clear)
                    this.getScreenParams("screen1").idMultiInputFornecedorCod1 = [];
                    // Contrato (Clear)
                    this.getScreenParams("screen1").idMultiInputContrato1 = [];
                }else if(sId.search("idMultiInputContrato1") >= 0){
                    aValues = this.getScreenParams("screen1").idMultiInputContrato1;
                    for(var iIndexOut in aRemovedTokens){
                        for(var iIndexIn in aValues){
                            if(aValues[iIndexIn].Ebeln === aRemovedTokens[iIndexOut].getProperty("key")){
                                aValues.splice(iIndexIn, 1);
                            }
                        }
                    }
                }else if(sId.search("idMultiInputFornecedorCod1") >= 0){
                    aValues = this.getScreenParams("screen1").idMultiInputFornecedorCod1;
                    for(var iIndexOut in aRemovedTokens){
                        for(var iIndexIn in aValues){
                            if(aValues[iIndexIn].Lifnr === aRemovedTokens[iIndexOut].getProperty("key")){
                                aValues.splice(iIndexIn, 1);
                            }
                        }
                    }
                     // Contrato (Clear)
                    this.getScreenParams("screen1").idMultiInputContrato1 = [];
                }

                // Refresh screen model
                this.refreshScreenModel();
/*
                if(aValues.length > 0){
                    for(var iIndexOut in aRemovedTokens){
                        for(var iIndexIn in aValues){
                            if(aValues[iIndexIn].Ekgrp === aRemovedTokens[iIndexOut].getProperty("key")){
                                aValues.splice(iIndexIn, 1);
                            }
                        }
                    }
                }
*/
            }
        },

        /**
         * 
         * 
         */
        onCheckBoxSelect: function(oEvt){
            let sId = oEvt.getParameter("id");
            let bSelected = oEvt.getParameter("selected");
            
            if(sId.search("idCheckBoxSomenteMatXdock1") >= 0){
                this.getScreenParams("screen1").idCheckBoxSomenteMatXdock1 = bSelected;
            }else if(sId.search("idCheckBoxAtacado1") >= 0){
                this.getScreenParams("screen1").idCheckBoxAtacado1 = bSelected;
            }else if(sId.search("idCheckBoxVarejo1") >= 0){
                this.getScreenParams("screen1").idCheckBoxVarejo1 = bSelected;
            }else if(sId.search("idCheckBoxTotUf1") >= 0){
                this.getScreenParams("screen1").idCheckBoxTotUf1 = bSelected;
            }else if(sId.search("idCheckBoxTotGrp1") >= 0){
                this.getScreenParams("screen1").idCheckBoxTotGrp1 = bSelected;
            }

            this.refreshScreenModel();
        },

        /**
         * 
         * 
         */
        onRadioButtonSelect: function(oEvt){
            let sId = oEvt.getParameter("id");
            let bSelected = oEvt.getParameter("selected");

            // Return is the Radio Button isn't selected
            if(!bSelected){
                return 1;
            }
            
            if(sId.search("idRadioButtonVisRelatUf") >= 0){
                this.getScreenParams("screen1").GroupVisRelat = this.getRadioButtonVisRelatOptions().UF;
            }else if(sId.search("idRadioButtonVisRelatGrpPrecos") >= 0){
                this.getScreenParams("screen1").GroupVisRelat = this.getRadioButtonVisRelatOptions().GRP_PRECOS;
            }else if(sId.search("idRadioButtonVisRelatFonteSupr") >= 0){
                this.getScreenParams("screen1").GroupVisRelat = this.getRadioButtonVisRelatOptions().FONTE_SUPR;
            }else if(sId.search("idRadioButtonVisRelatLoja") >= 0){
                this.getScreenParams("screen1").GroupVisRelat = this.getRadioButtonVisRelatOptions().LOJA;
            }else if(sId.search("idRadioButtonVisRelatSortim") >= 0){
                this.getScreenParams("screen1").GroupVisRelat = this.getRadioButtonVisRelatOptions().SORTIM;
            }

            this.refreshScreenModel();
        },

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
                this._oDialog = sap.ui.xmlfragment(`dma.zfichatec.view.fragments.${sDialogViewName}`, this);
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
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oDialog = this._getDialog("ShContrato"),
                oFilter = {};
            let sValue;

/*
            // set previous filter - if "Comprador" is filled (Single)
            sValue = this.getScreenParam("screen1", "idInputCompradorCod1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }

            // set previous filter - if "Fornecedor" is filled (Single)
            sValue = this.getScreenParam("screen1", "idInputFornecedorCod1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }

            // Define filters
            oDialog.getBinding("items").filter(aFilters);
*/

            // set previous filter - if "Comprador" is filled (Multiple)
            aValues = this.getScreenParam("screen1", "idMultiInputCompradorCod1");
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].Ekgrp);
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // set previous filter - if "Fornecedor" is filled (Multiple)
            aValues = this.getScreenParam("screen1", "idMultiInputFornecedorCod1");
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aValues[iIndex].Lifnr);
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            oDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            
            // open value help dialog filtered by the input value
            oDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpFornecedor: function(){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oDialog     = this._getDialog("ShFornecedor"),
                oFilter     = {};
            let sValue;

/*
            // set previous filter - if "Comprador" is filled (Single)
            sValue = this.getScreenParam("screen1", "idInputCompradorCod1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, sValue);
                // open value help dialog filtered by the input value
                oDialog.getBinding("items").filter([oFilter]);
            }
*/
            // set previous filter - if "Comprador" is filled (Multiple)
            aValues = this.getScreenParam("screen1", "idMultiInputCompradorCod1");
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].Ekgrp);
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

			oDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator

            oDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpGrpPrecos: function(){
            let oDialog = this._getDialog("ShGrupoPrecos"),
                oFilter = {};
            let sValue;

            // set previous filter - if "UF" is filled
            sValue = this.getScreenParam("screen1", "idInputUf1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("UF", sap.ui.model.FilterOperator.EQ, sValue);
                // open value help dialog filtered by the input value
                oDialog.getBinding("items").filter([oFilter]);
            }

            oDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpHierarquia: function(){
            this._getDialog("ShHierarquia").open();
        },

        /**
         * 
         * 
         */
        onValueHelpLoja: function(){
            let oDialog = this._getDialog("ShLojas"),
                oFilter = {};
            let sValue;

            // set previous filter - if "UF" is filled
            sValue = this.getScreenParam("screen1", "idInputUf1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("UF", sap.ui.model.FilterOperator.EQ, sValue);
                // open value help dialog filtered by the input value
                oDialog.getBinding("items").filter([oFilter]);
            }

            oDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpUf: function(){
            this._getDialog("ShUf").open();
        },

        /**
         * 
         * 
         */
        onCompradorClose: function (oEvt) {
/*
            // Single Selection
            let oSelectedItem   = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Ekgrp
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputCompradorCod1 = sValue;
                // Nome
                sValue = oSelectedItem.getDescription().toUpperCase();
                this.getScreenParams("screen1").idInputCompradorDescr1 = sValue;

                // Fornecedor (Clear)
                this.getScreenParams("screen1").idInputFornecedorCod1 = "";
                this.getScreenParams("screen1").idInputFornecedorDescr1 = "";
                // Contrato (Clear)
                this.getScreenParams("screen1").idInputContrato1 = "";

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);

            // Release fragment
            this._oDialog = undefined;
*/
/*
            // Multi Selection
			let aSelectedItems = oEvt.getParameter("selectedItems"),
				oMultiInput = this.byId("idMultiInputCompradorCod1");

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
						text: oItem.getTitle()
					}));
				});
			}
*/
            // Multi Selection with Model
			let aSelectedItems = oEvt.getParameter("selectedItems");
            let oScreenMulti = [];

            if(aSelectedItems && aSelectedItems.length > 0){
                for(var oIndex in aSelectedItems){
                    oScreenMulti.push({
                        "Ekgrp" : aSelectedItems[oIndex].getTitle()
                    });
                }
                this.getScreenParams("screen1").idMultiInputCompradorCod1 = oScreenMulti;

                // Fornecedor (Clear)
                this.getScreenParams("screen1").idMultiInputFornecedorCod1 = [];
                // Contrato (Clear)
                this.getScreenParams("screen1").idMultiInputContrato1 = [];
			}
            
            // Refresh screen model
            this.refreshScreenModel();
            
            // Release fragment
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onContratoClose: function (oEvt) {
/*
            let oSelectedItem = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Ebeln
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputContrato1 = sValue;

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
*/
            // Multi Selection with Model
			let aSelectedItems = oEvt.getParameter("selectedItems");
            let oScreenMulti = [];

            if(aSelectedItems && aSelectedItems.length > 0){
                for(var oIndex in aSelectedItems){
                    oScreenMulti.push({
                        "Ebeln" : aSelectedItems[oIndex].getTitle()
                    });
                }
                this.getScreenParams("screen1").idMultiInputContrato1 = oScreenMulti;
			}

            // Refresh screen model
            this.refreshScreenModel();

            // Release fragment
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onFornecedorClose: function (oEvt) {
/*
            // Single Selection
            let oSelectedItem   = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Lifnr
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputFornecedorCod1 = sValue;
                // Mcod1
                sValue = oSelectedItem.getDescription().toUpperCase();
                this.getScreenParams("screen1").idInputFornecedorDescr1 = sValue;

                // Contrato (Clear)
                this.getScreenParams("screen1").idInputContrato1 = "";

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);

            // Release fragment
            this._oDialog = undefined;
*/
            // Multi Selection with Model
			let aSelectedItems = oEvt.getParameter("selectedItems");
            let oScreenMulti = [];

            if(aSelectedItems && aSelectedItems.length > 0){
                for(var oIndex in aSelectedItems){
                    oScreenMulti.push({
                        "Lifnr" : aSelectedItems[oIndex].getTitle()
                    });
                }
                this.getScreenParams("screen1").idMultiInputFornecedorCod1 = oScreenMulti;

                // Contrato (Clear)
                this.getScreenParams("screen1").idMultiInputContrato1 = [];
			}

            // Refresh screen model
            this.refreshScreenModel();

            // Release fragment
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onGrupoPrecosClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Clint
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputGrpPrecos1 = sValue;

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onHierarquiaClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Node6
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputSortim1 = sValue;

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onLojasClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Werks
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputLoja1 = sValue;

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onUfClose: function (oEvt) {
            let oSelectedItem = oEvt.getParameter("selectedItem");
            let sValue;

            if (oSelectedItem) {
                // Bland
                sValue = oSelectedItem.getTitle().toUpperCase();
                this.getScreenParams("screen1").idInputUf1 = sValue;

                // Grupo de Preços (Clear)
                this.getScreenParams("screen1").idInputGrpPrecos1 = "";
                // Lojas (Clear)
                this.getScreenParams("screen1").idInputLoja1 = "";

                // Refresh screen model
                this.refreshScreenModel();
            }
            oEvt.getSource().getBinding("items").filter([]);
            this._oDialog = undefined;
        },

        /**
         * 
         * 
         */
        onCompradorSearch: function(oEvt){
            let aFilters    = [];
			let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();
/*
            oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);
            oFilter = new Filter("Uname", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);
			oBinding.filter(new Filter(aFilters, false)); // Use OR (false parameter)
*/
			// let oFilter = new Filter("Ekgrp", FilterOperator.Contains, sValue);
            oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);
			// oBinding.filter([oFilter]);
			oBinding.filter(aFilters);
        },

        /**
         * 
         * 
         */
        onContratoSearch: function(oEvt){
            let aFilters = [];
            let oBinding = oEvt.getSource().getBinding("items"),
                oFilter = {};
            let sValue;

            // Main value used on Search Help
            sValue = oEvt.getParameter("value").toUpperCase();
			oFilter = new Filter("Ebeln", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);
            
            // set previous filter - if "Comprador" is filled
            sValue = this.getScreenParam("screen1", "idInputCompradorCod1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }
            
            // set previous filter - if "Fornecedor" is filled
            sValue = this.getScreenParam("screen1", "idInputFornecedorCod1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }

            // Define filters
            oBinding.filter(aFilters);
        },

        /**
         * 
         * 
         */
        onFornecedorSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;
/*
            // Main value used on Search Help
            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Lifnr", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);

            // set previous filter - if "Comprador" is filled
            sValue = this.getScreenParam("screen1", "idInputCompradorCod1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }
*/
            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Lifnr", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // set previous filter - if "Comprador" is filled
            aValues = this.getScreenParam("screen1", "idMultiInputCompradorCod1");
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].Ekgrp);
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onGrupoPrecosSearch: function (oEvt) {
            let aFilters = [];
            let oBinding = oEvt.getSource().getBinding("items"),
                oFilter = {};
            let sValue;
            
            // Main value used on Search Help
            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Bandeira", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);

            // set previous filter - if "UF" is filled
            sValue = this.getScreenParam("screen1", "idInputUf1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("UF", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }
            
			oBinding.filter(aFilters);
        },

        /**
         * 
         * 
         */
        onHierarquiaSearch: function (oEvt) {
            
        },

        /**
         * 
         * 
         */
        onLojasSearch: function (oEvt) {
            let aFilters = [];
            let oBinding = oEvt.getSource().getBinding("items"),
                oFilter = {};
            let sValue;
            
            // Main value used on Search Help
            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Werks", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);

            // set previous filter - if "UF" is filled
            sValue = this.getScreenParam("screen1", "idInputUf1");
            if (sValue) {
                oFilter = new sap.ui.model.Filter("UF", sap.ui.model.FilterOperator.EQ, sValue);
                aFilters.push(oFilter);
            }
            
			oBinding.filter(aFilters);
        },

        /**
         * 
         * 
         */
        onUfSearch: function (oEvt) {
            let sValue = oEvt.getParameter("value").toUpperCase();
			let oFilter = new Filter("Bland", FilterOperator.Contains, sValue);
			let oBinding = oEvt.getSource().getBinding("items");
			oBinding.filter([oFilter]);
        },
    });
});