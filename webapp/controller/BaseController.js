/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/Token"
], function (Controller, History, Token) {
	"use strict";

	return Controller.extend("dma.zfichatec.controller.BaseController", {
        /**
         * (DESCONTINUADO)
         * Inicializa os dados para o modelo "modelScreenParams" (utilizado para os filtros de seleção)
         * @public
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
                    "idInputStatusMateril1"         : "",
                    "idInputDepartamento1"          : "",
                    "idInputNoHierarquia1"          : "",
                    "idCheckBoxAtacado1"            : true,
                    "idCheckBoxVarejo1"             : true,
                    "idInputUf1"                    : "",
                    "idInputGrpPrecos1"             : "",
                    "idInputLoja1"                  : "",
                    "idInputSortimento1"            : "",
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
                    "idMultiInputStatusMaterial1"   : [],
                    "idMultiInputDepartamento1"     : [],
                    "idMultiInputNoHierarquia1"     : [],
                    "idCheckBoxAtacado1"            : true,
                    "idCheckBoxVarejo1"             : true,
                    "idMultiInputUf1"               : [],
                    "idMultiInputGrpPrecos1"        : [],
                    "idMultiInputLojas1"            : [],
                    "idMultiInputSortimento1"       : [],
                    "idCheckBoxTotUf1"              : false,
                    "idCheckBoxTotGrp1"             : false
                }
            };

            oModelScreenParams.setData(oJson);
        },


        /**
         * (DESCONTINUADO)
         * Obtém uma propriedade específica do modelo "modelScreenParams" (utilizado para os filtros de seleção)
         * @public
         * @returns {string} Valor de uma propriedade específica do modelo "modelScreenParams"
         */
        getScreenParam: function(sScreenName, sProperty){
            return this.getModel("modelScreenParams").getData()[sScreenName][sProperty];
        },


        /**
         * (DESCONTINUADO)
         * Obtém todas as propriedades do modelo "modelScreenParams" (utilizado para os filtros de seleção)
         * @public
         * @returns {JSON} Objeto JSON com todas as prorpiedades do modelo "modelScreenParams"
         */
        getScreenParams: function(sScreenName){
            return this.getModel("modelScreenParams").getData()[sScreenName];
        },

        
        /**
         * (DESCONTINUADO)
         * Efetua refresh no modelo "modelScreenParams" (utilizado para os filtros de seleção)
         * @public
         */
        refreshScreenModel: function(){
            this.getModel("modelScreenParams").refresh(true);
        },


        /**
         * (DESCONTINUADO)
         * Retorna os códigos definidos para cada RadioButton
         * @public
         * @returns {JSON} Objeto JSON com os códigos para cada RadioButton
         */
        getRadioButtonVisRelatOptions: function(){
            return {
                "LOJA"          : "0",
                "GRP_PRECOS"    : "1",
                "FONTE_SUPR"    : "2",
                "UF"            : "3",
                "SORTIM"        : "4"
            }
        },


        /**
         * Retorna os possíveis tipos para utilizar no Token
         * @public
         * @returns {JSON} Objeto JSON com os possíveis tipos para Tokens
         */
        getFromType: function(){
            return {
                "TITLE"         : "0",
                "DESCRIPTION"   : "1"
            }
        },


        /**
         * Acionado quando o SelectDialog é fechado, efetuando a lógica de atualizar os dados no MultiInput
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         * @param {string} sId - ID do MultiInput
         * @param {string} sTextGetFrom - Define qual propriedade vai ser utilizada na propriedade "text" do
         * Token (valor padrão = this.getFromType().DESCRIPTION)
         */
        onValueHelpClose: function(oEvt, sId, sTextGetFrom = this.getFromType().DESCRIPTION){
/*
            let aSelectedItems = oEvt.getParameter("selectedItems");
            let enumFromType = this.getFromType();
            let oMultiInput = this.byId(sId);
            let sTextGetFromValue;

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    switch(sTextGetFrom){
                        case enumFromType.TITLE:
                            sTextGetFromValue = oItem.getTitle();
                            break;
                        case enumFromType.DESCRIPTION:
                            sTextGetFromValue = oItem.getDescription();
                            break;
                        default:
                            break;
                    }

                    oMultiInput.addToken(
                        new Token(
                            {
                                key: oItem.getTitle(),
                                text: sTextGetFromValue
                            }
                        )
                    );
                });
            }
*/
            let aSelectedContexts   = oEvt.getParameter("selectedContexts");
            let enumFromType        = this.getFromType();
            let oModel              = this.getView().getModel(),
                oMultiInput         = this.byId(sId),
                oSelectedItem       = oEvt.getParameter("selectedItem");
            let sTextGetFromValue;

            oMultiInput.removeAllTokens();

            if(aSelectedContexts && aSelectedContexts.length > 0){
                aSelectedContexts.forEach(function(oItem){
                    switch(sTextGetFrom){
                        case enumFromType.TITLE:
                            sTextGetFromValue = oModel.getProperty(oItem.getPath())[oSelectedItem.getBinding("title").getPath()];
                            break;
                        case enumFromType.DESCRIPTION:
                            sTextGetFromValue = oModel.getProperty(oItem.getPath())[oSelectedItem.getBinding("description").getPath()];
                            break;
                        default:
                            break;
                    }
                    
                    oMultiInput.addToken(
                        new Token(
                            {
                                key: oModel.getProperty(oItem.getPath())[oSelectedItem.getBinding("title").getPath()],
                                text: sTextGetFromValue
                            }
                        )
                    );
                });
            }
        },


        /**
         * Obtém os dados do MultiInput e atualiza quais dados da lista no SelectDialog estão selecionados
         * @public
         * @param {string} sId - ID do MultiInput
         * @param {sap.ui.core.Control} oDialog - Objeto de dialog
         */
        onValueHelpRememberSelections: function(sId, oDialog){
            let aInput = this.getView().byId(sId).getTokens();
            let aValues = oDialog._oList.getItems();
            
            for(let iIndexInput in aInput){
                for(let iIndexValues in aValues){
                    if(aInput[iIndexInput].getKey() === aValues[iIndexValues].getTitle()){
                        aValues[iIndexValues].setSelected(true);
                    }
                }
            }
        },


        /**
         * Transforma os dados do MultiInput para um string separado por Pipes "|"
         * @public
         * @param {string} sId - ID do MultiInput
         * @returns {string} Valores separados por Pipes "|"
         */
        transformMultiInputIntoPsv: function(sId){
            let aTokens = this.getView().byId(sId).getTokens();
            let sResult = "";

            for(let iIndexTokens in aTokens){
                sResult += aTokens[iIndexTokens].getKey() + '|';
            }

            if(sResult.slice((sResult.length-1),sResult.length) === "|"){
                sResult = sResult.slice(0,(sResult.length-1));
            }

            return sResult;
        },


        /**
         * Retorna uma data formatada
         * @public
         * @param {Date} oValue - Data que deve ser formatada
         * @returns {string} Data formatada
         */
        getDateFormatted: function(oValue){
            const sDay = oValue.getDate();
            const sMonth = oValue.getMonth() + 1;
            const sYear = oValue.getFullYear();
            const sHours = oValue.getHours();
            const sMinutes = oValue.getMinutes();
            const sSeconds = oValue.getSeconds();
            const sMilliseconds = oValue.getMilliseconds();

            return (
                sYear +
                String(sMonth).padStart(2, '0') +
                String(sDay).padStart(2, '0') +
                String(sHours).padStart(2, '0') +
                String(sMinutes).padStart(2, '0') +
                String(sSeconds).padStart(2, '0')
            )
        },


        /**
         * Constrói um objeto de filtro
         * @public
         * @param {array} aFilters - Array com os objetos de filtro (sap.ui.model.Filter)
         * @param {string} sFilterFieldName - Nome do campo no serviço
         * @param {sap.ui.model.FilterOperator} sOperator - Operador lógico
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        buildSingleFilter: function(aFilters, sFilterFieldName, sOperator, oEvt){
            let oFilter = {};
            let sValue;

            // if(JSON.stringify(oEvt) !== "{}" && JSON.stringify(oEvt) !== "[]"){
            if(Object.keys(oEvt).length > 0 || oEvt.constructor !== Object){
                sValue = oEvt.getParameter("value").toUpperCase();
                if(sValue){
                    oFilter = new sap.ui.model.Filter(sFilterFieldName, sOperator, sValue);
                    aFilters.push(oFilter); // Single filter (not array), don't need operator AND or OR
                }
            }
        },


        /**
         * Constrói um array com os objetos de filtro
         * @public
         * @param {array} aFilters - Array com os objetos de filtro (sap.ui.model.Filter)
         * @param {string} sFieldName - ID do MultiInput
         * @param {string} sFilterFieldName - Nome do campo no serviço
         * @param {sap.ui.model.FilterOperator} sOperator - Operador lógico
         * @param {boolean} bAnd - Valor true para considerar o operador AND e false para o operador OR no filtro
         */
        buildArrayFilter: function(aFilters, sFieldName, sFilterFieldName, sOperator, bAnd){
            let aOrFilters  = [],
                aValues     = [];
            let oFilter     = {};

            aValues = this.byId(sFieldName).getTokens();
            if (aValues.length) {
                for(var iIndex in aValues){
                    oFilter = new sap.ui.model.Filter(sFilterFieldName, sOperator, aValues[iIndex].getProperty("key"));
                    aOrFilters.push(oFilter);
                }
                aFilters.push(new sap.ui.model.Filter(aOrFilters, bAnd)); // Multiple filter (array) / bAnd = true (AND operator) / bAnd = false (OR operator)
                aOrFilters = [];
            }
        },


        /**
         * Constrói um array com os objetos de filtro (em massa)
         * @public
         * @param {array} aFilters - Array com os objetos de filtro (sap.ui.model.Filter)
         * @param {array} oFilterConf - Array de objetos JSON com os dados utilizados para criar o filtro:
         * Estrutura do objeto JSON:
         * >> fieldName = ID do MultiInput
         * >> filterFieldName = Nome do campo no serviço
         * >> operator = Operador lógico (sap.ui.model.FilterOperator)
         * >> and = Valor true para considerar o operador AND e false para o operador OR no filtro (boolean)
         */
        buildArrayFilterMass: function(aFilters, oFilterConf){
            let aOrFilters  = [],
                aValues     = [];
            let bValue      = false;
            let oFilter     = {};

            if(Object.keys(oFilterConf).length > 0 || oFilterConf.constructor !== Object){
                for(let iIndexFilterConf in oFilterConf){
                    switch(oFilterConf[iIndexFilterConf].fieldType){
                        case "Input":
                            
                            break;
                        
                        case "MultiInput":
                            aValues = this.byId(oFilterConf[iIndexFilterConf].fieldName).getTokens();

                            if (aValues.length) {
                                for(var iIndexValues in aValues){
                                    oFilter = new sap.ui.model.Filter(oFilterConf[iIndexFilterConf].filterFieldName, oFilterConf[iIndexFilterConf].operator, aValues[iIndexValues].getProperty("key"));
                                    aOrFilters.push(oFilter);
                                }
                                aFilters.push(new sap.ui.model.Filter(aOrFilters, ((typeof oFilterConf[iIndexFilterConf].and !== "undefined") ? oFilterConf[iIndexFilterConf].and : true))); // Multiple filter (array) / .and = true (AND operator) / .and = false (OR operator)
                                aOrFilters = [];
                            }
                            break;
                        
                        case "CheckBox":
                        case "RadioButton":
                            bValue = this.byId(oFilterConf[iIndexFilterConf].fieldName).getSelected();
                            
                            aFilters.push(
                                new sap.ui.model.Filter(oFilterConf[iIndexFilterConf].filterFieldName, oFilterConf[iIndexFilterConf].operator, bValue)
                            ); // Multiple filter (array) / .and = true (AND operator) / .and = false (OR operator)
                            break;
                        
                        default:
                            break;
                    }
                }
            }
        },


        /**
		 * Verifica se o e-mail é válido
		 * @public
         * @param {string} sEmail - Endereço de e-mail
		 * @returns {boolean} Retorna true caso seja um e-mail válido
		 */
        _validEmail: function(sEmail){
			// The following Regex is NOT a completely correct one and only used for demonstration purposes.
			// RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
            let rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
            
            return sEmail.match(rexMail);
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


		/**
		 * Get specific text from resource bundle (I18N)
		 * @public
		 * @returns {string} Text from I18N
		 */
        getText: function(sText){
			return this.getResourceBundle().getText(sText);
		},


		/**
		 * Get specific text from resource bundle (I18N) with parameters
		 * @public
		 * @returns {string} Text from I18N with parameters
		 */
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