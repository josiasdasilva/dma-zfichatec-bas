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
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, FilterOperator, Label, Popover, Token, DateFormat, Fragment, JSONModel, MessageToast, MessageBox) {
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
        handleWizardCompleted: function(oEvt){
            let sValueState;

            if(!this.getView().byId("idMultiInputCompradorCod1").getTokens().length &&
               !this.getView().byId("idMultiInputFornecedorCod1").getTokens().length &&
               !this.getView().byId("idMultiInputContrato1").getTokens().length){
                sValueState = sap.ui.core.ValueState.Error;
            }else{
                sValueState = sap.ui.core.ValueState.None;
            }
            this.getView().byId("idMultiInputCompradorCod1").setValueState(sValueState);
            this.getView().byId("idMultiInputFornecedorCod1").setValueState(sValueState);
            this.getView().byId("idMultiInputContrato1").setValueState(sValueState);

            if(sValueState === sap.ui.core.ValueState.Error){
                this.getView().byId("idMultiInputCompradorCod1").focus();
                MessageToast.show(this.getResourceBundle().getText("campos_obrig_txt"));
                return 1;
            }

            MessageToast.show(this.getResourceBundle().getText("em_desenv_msg"));
            // window.open(this.getModel().sServiceUrl + "/$metadata", "_blank");
            // sap.m.URLHelper.redirect(this.getModel().sServiceUrl + "/$metadata", true /*new window*/);
            // sap.m.URLHelper.redirect("/dmazfichatec/imprimirDetalhe", true /*new window*/);
            
            // this.getOwnerComponent().getRouter().navTo("routeImprimirDetalhe");
            this.onImprimirDetalheOpen();
        },

        /**
         * 
         * 
         */
        handleWizardResetFilters: function(oEvt){
			let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.show(
					this.getResourceBundle().getText("confirma_reset_filtros_txt"),
					{
						icon: MessageBox.Icon.WARNING,
						title: this.getResourceBundle().getText("confirma_reset_filtros_tit"),
						actions: [MessageBox.Action.YES, MessageBox.Action.NO], // , "Custom Button"],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
                        initialFocus:  MessageBox.Action.NO, //"Custom Button",
                        onClose: function(sButton){
                            this.resetFilters(sButton);
                        }.bind(this)
					}
			);
        },

        /**
         * 
         * 
         */
        resetFilters: function(sButton){
            if(sButton === MessageBox.Action.YES){
                // Reset model attached to screen fields
                this.initScreenParams();

                // Refresh screen model
                this.refreshScreenModel();

                // Comprador (Clear)
                this.byId("idMultiInputCompradorCod1").removeAllTokens();
                // Fornecedor (Clear)
                this.byId("idMultiInputFornecedorCod1").removeAllTokens();
                // Contrato (Clear)
                this.byId("idMultiInputContrato1").removeAllTokens();
                // Departamento (Clear)
                this.byId("idMultiInputDepartamento1").removeAllTokens();
                // Hierarquia (Clear)
                this.byId("idMultiInputNoHierarquia1").removeAllTokens();
                // UF (Clear)
                this.byId("idMultiInputUf1").removeAllTokens();
                // Grupo de Preços (Clear)
                this.byId("idMultiInputGrpPrecos1").removeAllTokens();
                // Lojas (Clear)
                this.byId("idMultiInputLojas1").removeAllTokens();

                this.getView().byId("idMultiInputCompradorCod1").focus();
            }
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
            let sId = oEvt.getSource().getId();

            // Comprador
            if(sId.search("idMultiInputCompradorCod1") >= 0){
                // Fornecedor (Clear)
                this.byId("idMultiInputFornecedorCod1").removeAllTokens();
                // Contrato (Clear)
                this.byId("idMultiInputContrato1").removeAllTokens();
                // Departamento (Clear)
                this.byId("idMultiInputDepartamento1").removeAllTokens();
                // Hierarquia (Clear)
                this.byId("idMultiInputNoHierarquia1").removeAllTokens();

            // Contrato
            }else if(sId.search("idMultiInputContrato1") >= 0){
                // Departamento (Clear)
                this.byId("idMultiInputDepartamento1").removeAllTokens();
                // Hierarquia (Clear)
                this.byId("idMultiInputNoHierarquia1").removeAllTokens();
            
            // Departamento
            }else if(sId.search("idMultiInputDepartamento1") >= 0){
                // Hierarquia (Clear)
                this.byId("idMultiInputNoHierarquia1").removeAllTokens();

            // Fornecedor
            }else if(sId.search("idMultiInputFornecedorCod1") >= 0){
                // Contrato (Clear)
                this.byId("idMultiInputContrato1").removeAllTokens();
                // Departamento (Clear)
                this.byId("idMultiInputDepartamento1").removeAllTokens();
                // Hierarquia (Clear)
                this.byId("idMultiInputNoHierarquia1").removeAllTokens();

            // Grupo de Preços
            }else if(sId.search("idMultiInputGrpPrecos1") >= 0){

            // Hierarquia
            }else if(sId.search("idMultiInputNoHierarquia1") >= 0){

            // Lojas
            }else if(sId.search("idMultiInputLojas1") >= 0){

            // UF
            }else if(sId.search("idMultiInputUf1") >= 0){
                // Grupo de Preços (Clear)
                this.byId("idMultiInputGrpPrecos1").removeAllTokens();
                // Lojas (Clear)
                this.byId("idMultiInputLojas1").removeAllTokens();

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
        onEnviarEmailDetalhe: function(oEvt){
            MessageToast.show(this.getResourceBundle().getText("em_desenv_msg"));
        },

        /**
         * 
         * 
         */
        onImprimirDetalheOpen: function(oEvt){
            // Create value help dialog
            if (!this._imprimirDetalheDialog) {
                this._imprimirDetalheDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.imprimirDetalhe", this);
                this.getView().addDependent(this._imprimirDetalheDialog);
            }

            let oIframe = this._imprimirDetalheDialog.getAggregation("content")[0];
            oIframe.setContent(
                "<iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' " +
                "height='100%' width='100%' style='border: none;'></iframe>");

            this._imprimirDetalheDialog.open();
        },

        /**
         * 
         * 
         */
        onImprimirDetalheClose: function(oEvt){
/*
            let oDialog = this._getDialog("imprimirDetalhe");
            // Release fragment
            // oDialog.close();
            oDialog = undefined;
*/
            this._imprimirDetalheDialog.close();
        },


//----------------------------------------------------------------------//
// Comprador                                                            //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpCompradorOpen: function(oEvt){
            // this._getDialog("ShComprador").open();

            // Create value help dialog
            if (!this._ShCompradorDialog) {
                this._ShCompradorDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShComprador", this);
                this.getView().addDependent(this._ShCompradorDialog);
            }

            this.onValueHelpCompradorPreFilter(oEvt);

            this._ShCompradorDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpCompradorPreFilter: function(oEvt){
            
        },

        /**
         * 
         * 
         */
        onValueHelpCompradorClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputCompradorCod1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        text: oItem.getDescription()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpCompradorSearch: function(oEvt){
            let aFilters    = [];
			let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);
			oBinding.filter(aFilters);
        },


//----------------------------------------------------------------------//
// Contrato                                                             //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpContratoOpen: function(oEvt){
            // Create value help dialog
            if (!this._ShContratoDialog) {
                this._ShContratoDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShContrato", this);
                this.getView().addDependent(this._ShContratoDialog);
            }

            this.onValueHelpContratoPreFilter(oEvt);

            this._ShContratoDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpContratoPreFilter: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            //let oDialog = this._getDialog("ShContrato"),
            let oFilter = {};

            // Set previous filter - if "Comprador" is filled (Multiple)
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Set previous filter - if "Fornecedor" is filled (Multiple)
            aValues = this.byId("idMultiInputFornecedorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            this._ShContratoDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onValueHelpContratoClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputContrato1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        //text: oItem.getDescription()
                        text: oItem.getTitle()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpContratoSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;

            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Ebeln", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

            // Set previous filter - if "Fornecedor" is filled
            aValues = this.byId("idMultiInputFornecedorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Departamento                                                             //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpDepartamentoOpen: function(oEvt){
            // Create value help dialog
            if (!this._ShDepartamentoDialog) {
                this._ShDepartamentoDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShDepartamento", this);
                this.getView().addDependent(this._ShDepartamentoDialog);
            }

            this.onValueHelpDepartamentoPreFilter(oEvt);

            this._ShDepartamentoDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpDepartamentoPreFilter: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            //let oDialog = this._getDialog("ShDepartamento"),
            let oFilter = {};

            // Set previous filter - if "Comprador" is filled (Multiple)
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Set previous filter - if "Fornecedor" is filled (Multiple)
            aValues = this.byId("idMultiInputFornecedorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Set previous filter - if "Contrato" is filled (Multiple)
            aValues = this.byId("idMultiInputContrato1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ebeln", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            this._ShDepartamentoDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onValueHelpDepartamentoClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputDepartamento1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        text: oItem.getDescription()
                        // text: oItem.getTitle()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpDepartamentoSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;

            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Node3", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

            // Set previous filter - if "Fornecedor" is filled
            aValues = this.byId("idMultiInputFornecedorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

            // Set previous filter - if "Contrato" is filled
            aValues = this.byId("idMultiInputContrato1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ebeln", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Fornecedor                                                             //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpFornecedorOpen: function(oEvt){
            // Create value help dialog
            if (!this._ShFornecedorDialog) {
                this._ShFornecedorDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShFornecedor", this);
                this.getView().addDependent(this._ShFornecedorDialog);
            }

            this.onValueHelpFornecedorPreFilter(oEvt);

            this._ShFornecedorDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpFornecedorPreFilter: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            //let oDialog = this._getDialog("ShFornecedor"),
            let oFilter = {};

            // Set previous filter - if "Comprador" is filled (Multiple)
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            this._ShFornecedorDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onValueHelpFornecedorClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputFornecedorCod1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        // text: oItem.getDescription()
                        text: oItem.getTitle()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpFornecedorSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;

            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Lifnr", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Grupos de Precos                                                     //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpGrpPrecosOpen: function(oEvt){
            // Create value help dialog
            if (!this._ShGrpPrecosDialog) {
                this._ShGrpPrecosDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShGrupoPrecos", this);
                this.getView().addDependent(this._ShGrpPrecosDialog);
            }

            this.onValueHelpGrpPrecosPreFilter(oEvt);

            this._ShGrpPrecosDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpGrpPrecosPreFilter: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            //let oDialog = this._getDialog("ShGrpPrecos"),
            let oFilter = {};

            // Set previous filter - if "UF" is filled (Multiple)
            aValues = this.byId("idMultiInputUf1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("UF", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            this._ShGrpPrecosDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onValueHelpGrpPrecosClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputGrpPrecos1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        // text: oItem.getDescription()
                        text: oItem.getTitle()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpGrpPrecosSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;

            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Bandeira", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputUf1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("UF", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Hierarquia                                                             //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpHierarquiaOpen: function(oEvt){
            // Create value help dialog
            if (!this._ShHierarquiaDialog) {
                this._ShHierarquiaDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShHierarquia", this);
                this.getView().addDependent(this._ShHierarquiaDialog);
            }

            this.onValueHelpHierarquiaPreFilter(oEvt);

            this._ShHierarquiaDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpHierarquiaPreFilter: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            //let oDialog = this._getDialog("ShHierarquia"),
            let oFilter = {};

            // Set previous filter - if "Comprador" is filled (Multiple)
            aValues = this.byId("idMultiInputDepartamento1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Node3", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            this._ShHierarquiaDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onValueHelpHierarquiaClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputNoHierarquia1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        // text: oItem.getDescription()
                        text: oItem.getTitle()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpHierarquiaSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;

            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Node6", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputCompradorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ekgrp", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

            // Set previous filter - if "Fornecedor" is filled
            aValues = this.byId("idMultiInputFornecedorCod1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputContrato1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Ebeln", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

            // Set previous filter - if "Departamento" is filled
            aValues = this.byId("idMultiInputDepartamento1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("Node3", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Lojas                                                                //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpLojasOpen: function(oEvt){
            // Create value help dialog
            if (!this._ShLojasDialog) {
                this._ShLojasDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShLojas", this);
                this.getView().addDependent(this._ShLojasDialog);
            }

            this.onValueHelpLojasPreFilter(oEvt);

            this._ShLojasDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpLojasPreFilter: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            //let oDialog = this._getDialog("ShLojas"),
            let oFilter = {};

            // Set previous filter - if "UF" is filled (Multiple)
            aValues = this.byId("idMultiInputUf1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("UF", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
                aOrFilters = [];
            }

            // Define filters
            this._ShLojasDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        /**
         * 
         * 
         */
        onValueHelpLojasClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputLojas1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        text: oItem.getDescription()
                        // text: oItem.getTitle()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpLojasSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [],
                aValues     = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue;

            sValue = oEvt.getParameter("value").toUpperCase();
            oFilter = new Filter("Werks", FilterOperator.Contains, sValue);
            aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR

            // Set previous filter - if "Comprador" is filled
            aValues = this.byId("idMultiInputUf1").getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new Filter("UF", sap.ui.model.FilterOperator.EQ, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Uf                                                                   //
//----------------------------------------------------------------------//
        /**
         * 
         * 
         */
        onValueHelpUfOpen: function(oEvt){
            // this._getDialog("ShUf").open();

            // Create value help dialog
            if (!this._ShUfDialog) {
                this._ShUfDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShUf", this);
                this.getView().addDependent(this._ShUfDialog);
            }

            this.onValueHelpUfPreFilter(oEvt);

            this._ShUfDialog.open();
        },

        /**
         * 
         * 
         */
        onValueHelpUfPreFilter: function(oEvt){
            
        },

        /**
         * 
         * 
         */
        onValueHelpUfClose: function (oEvt) {
            let aSelectedItems = oEvt.getParameter("selectedItems"),
                oMultiInput = this.byId("idMultiInputUf1");

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        key: oItem.getTitle(),
                        text: oItem.getDescription()
                    }));
                });
            }
        },

        /**
         * 
         * 
         */
        onValueHelpUfSearch: function(oEvt){
            let aFilters    = [];
			let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("Bland", FilterOperator.Contains, sValue);
            aFilters.push(oFilter);
			oBinding.filter(aFilters);
        },


    });
});