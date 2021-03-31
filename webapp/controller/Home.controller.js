sap.ui.define([
    "dma/zfichatec/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
	"sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, FilterOperator, Token, Fragment, MessageToast, MessageBox) {
	"use strict";

    return BaseController.extend("dma.zfichatec.controller.Home", {

        /**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf dma.zfichatec.view.Home
		 */
		onInit: function () {
			let sRootPath = jQuery.sap.getModulePath("dma.zfichatec");
			let sImagePath = sRootPath + "/img/background_cockpit.png";
            // this.byId("img_epa").setSrc(sImagePath); /* popula dados da Agenda */
        },
        

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf dma.zfichatec.view.Home
		 */
		onBeforeRendering: function() {
/*
            //----------------------------------------------------------------------//
            // DESCONTINUADO o carregamento do código do Comprador automaticamente  //
            //----------------------------------------------------------------------//
            // Cria o fragmento "Comprador" (ajuda de pesquisa)
            if (!this._ShCompradorDialog) {
                this._ShCompradorDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShComprador", this);
                this.getView().addDependent(this._ShCompradorDialog);
            }
            
            this.getView().getModel().read(
                "/UsuarioSet",
                {
                    success: function(oRetrievedResult) {
                        if(!oRetrievedResult.results[0].Ekgrp){
                            return;
                        }

                        this.byId("idMultiInputCompradorCod1").removeAllTokens();
                        this.byId("idMultiInputCompradorCod1").addToken(
                            new Token(
                                {
                                    key: oRetrievedResult.results[0].Ekgrp,
                                    text: oRetrievedResult.results[0].Ekgrp
                                }
                            )
                        );

                    }.bind(this),
                    error: function(oError) {
                        //
                    }.bind(this)
                }
            );
*/
            // Cria o fragmento "Status do Material" (ajuda de pesquisa)
            if (!this._ShStatusMaterialDialog) {
                this._ShStatusMaterialDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShStatusMaterial", this);
                this.getView().addDependent(this._ShStatusMaterialDialog);
            }
            // this.initScreenParams();
            this.byId("idMultiInputStatusMaterial1").removeAllTokens();
            this.byId("idMultiInputStatusMaterial1").addToken(new Token({key: "00", text: "Liberado"}));
        },


        /**
         * Efetua as lógicas de validação de campos e chamada da impressão do relatório
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        handleWizardCompleted: function(oEvt){
            let sValueState;

            // Validação dos MultiInput's obrigatórios
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

            // Validação do CheckBox "Bandeira"
            if(this.getBandeiraSelectedIndex() === -1){
                sValueState = sap.ui.core.ValueState.Error;
            }else{
                sValueState = sap.ui.core.ValueState.None;
            }
/*
            this.getView().byId("idCheckBoxAtacado1").setValueState(sValueState);
            this.getView().byId("idCheckBoxVarejo1").setValueState(sValueState);
*/
/*
            this.getView().byId("idTBAtacado1").setValueState(sValueState);
            this.getView().byId("idTBVarejo1").setValueState(sValueState);
*/

            if(sValueState === sap.ui.core.ValueState.Error){
                // this.getView().byId("idCheckBoxAtacado1").focus();
                this.getView().byId("idTBAtacado1").focus();
                MessageToast.show(this.getResourceBundle().getText("bandeira_obrig_txt"));
                return 1;
            }

            // this.getOwnerComponent().getRouter().navTo("routeImprimirDetalhe");
            this.onImprimirDetalheOpen();
        },


        /**
         * Lógica para efetuar a reinicialização de valores dos campos da tela (exibe mensagem de confirmação)
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
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
         * Lógica que efetivamente efetua a reinicialização de valores dos campos da tela e define o foco do cursor para o primeiro campo
         * @public
         * @param {string} sButton - Resultado do botão pressionado na tela anterior (MessageBox.Action.YES)
         */
        resetFilters: function(sButton){
            if(sButton === MessageBox.Action.YES){
                // Visão Relatório
                this.getView().byId("idRadioButtonVisRelatLoja").setSelected(true);
                // Somente Materiais CrossDocking
                this.getView().byId("idCheckBoxSomenteMatXdock1").setSelected(false);
/*
                // Atacado
                this.getView().byId("idCheckBoxAtacado1").setSelected(true);
                // Varejo
                this.getView().byId("idCheckBoxVarejo1").setSelected(true);
                // Totalizador por UF
                this.getView().byId("idCheckBoxTotUf1").setSelected(false);
                // Totalizador por Grupo
                this.getView().byId("idCheckBoxTotGrp1").setSelected(false);
*/
                // Atacado
                this.getView().byId("idTBAtacado1").setPressed(true);
                // Varejo
                this.getView().byId("idTBVarejo1").setPressed(true);
                // Totalizador por UF
                this.getView().byId("idTBTotUf1").setPressed(false);
                // Totalizador por Grupo
                this.getView().byId("idTBTotGrp1").setPressed(false);

                // Comprador (Clear)
                this.byId("idMultiInputCompradorCod1").removeAllTokens();
                // Contrato (Clear)
                this.byId("idMultiInputContrato1").removeAllTokens();
                // Departamento (Clear)
                this.byId("idMultiInputDepartamento1").removeAllTokens();
                // Fonte de Suprimento (Clear)
                this.byId("idMultiInputFonteSuprimento1").removeAllTokens();
                // Fornecedor (Clear)
                this.byId("idMultiInputFornecedorCod1").removeAllTokens();
                // Grupo de Preços (Clear)
                this.byId("idMultiInputGrpPrecos1").removeAllTokens();
                // Hierarquia (Clear)
                this.byId("idMultiInputNoHierarquia1").removeAllTokens();
                // Lojas (Clear)
                this.byId("idMultiInputLojas1").removeAllTokens();
                // Sortimentos (Clear)
                this.byId("idMultiInputSortimento1").removeAllTokens();
                // Status do Material (Clear)
                this.byId("idMultiInputStatusMaterial1").removeAllTokens();
                // UF (Clear)
                this.byId("idMultiInputUf1").removeAllTokens();

                // Muda o foco para o primeiro campo da tela
                this.getView().byId("idMultiInputCompradorCod1").focus();
            }
        },


        /**
         * (DESCONTINUADO)
         * Utilizado para fazer a limpeza dos campos de descrição
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onChangeInputField: function(oEvt){
            let sId = oEvt.getParameter("id");
            
            if(sId.search("idInputCompradorCod1") >= 0){
                this.getScreenParams("screen1").idInputCompradorDescr1 = "";
            }else if(sId.search("idInputFornecedorCod1") >= 0){
                this.getScreenParams("screen1").idInputFornecedorDescr1 = "";
            }

            this.refreshScreenModel();
        },


        /**
         * Lógica para tratar os campos no quesito de interdependência.
         * Por exemplo, quando o campo X é alterado, os campos Y e Z devem ser limpos.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
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
         * (DESCONTINUADO)
         * Utilizado para atualizar o objeto de controle de tela quando um CheckBox é selecionado
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
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
         * (DESCONTINUADO)
         * Utilizado para atualizar o objeto de controle de tela quando um RadioButton é selecionado
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onRadioButtonSelect: function(oEvt){
            let sId = oEvt.getParameter("id");
            let bSelected = oEvt.getParameter("selected");

            // Retorna se o RadioButton não foi selecionado
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
         * (DESCONTINUADO)
         * Utilizado para fechar o Dialog, centralizado em um só objeto (mais complicado de controlar a abertura e fechamento)
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onCancelDialog: function(oEvt){
            let sDialogViewName = oEvt.getSource().data("dialogViewName");
            this._getDialog(sDialogViewName).close();
        },


        /**
         * (DESCONTINUADO)
         * Utilizado para gerar o Dialog, mas centralizando em um só objeto (mais complicado de controlar a abertura e fechamento)
         * @public
         * @param {string} sDialogViewName - Nome do Fragmento
         */
        _getDialog: function (sDialogViewName) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(`dma.zfichatec.view.fragments.${sDialogViewName}`, this);
                this.getView().addDependent(this._oDialog);
            }
            return this._oDialog;
        },
        

        /**
         * Identifica qual Radio Button da "Visão de Relatório" foi selecionado
         * @public
         * @returns {number} Valor de 0 à 4 identificando qual Radio Button da "Visão de Relatório" foi selecionado
         */
        getVisRelatSelectedIndex: function(){
            switch(true){
                case this.getView().byId("idRadioButtonVisRelatLoja").getSelected():
                    return 0;
                    break;
                case this.getView().byId("idRadioButtonVisRelatGrpPrecos").getSelected():
                    return 1;
                    break;
                case this.getView().byId("idRadioButtonVisRelatFonteSupr").getSelected():
                    return 2;
                    break;
                case this.getView().byId("idRadioButtonVisRelatUf").getSelected():
                    return 3;
                    break;
                case this.getView().byId("idRadioButtonVisRelatSortim").getSelected():
                    return 4;
                    break;
                default:
                    break;
            }
        },


        /**
         * Identifica quais Toggle Buttons (descontinuado o CheckBox) de "Bandeira" foram selecionados
         * @public
         * @returns {number} valor de -1 à 2 identificando qual(is) CheckBox foi(ram) selecionado(s)
         */
        getBandeiraSelectedIndex: function(){
            if(this.getView().byId("idTBAtacado1").getPressed() && this.getView().byId("idTBVarejo1").getPressed()){
                return 0;
            }else if(this.getView().byId("idTBAtacado1").getPressed()){
                return 1;
            }else if(this.getView().byId("idTBVarejo1").getPressed()){
                return 2;
            }else{
                return -1;
            }
/*
            if(this.getView().byId("idCheckBoxAtacado1").getSelected() && this.getView().byId("idCheckBoxVarejo1").getSelected()){
                return 0;
            }else if(this.getView().byId("idCheckBoxAtacado1").getSelected()){
                return 1;
            }else if(this.getView().byId("idCheckBoxVarejo1").getSelected()){
                return 2;
            }else{
                return -1;
            }
*/
        },


        /**
         * Lógica para gerar um bloco de "filter" (OData) simples para a chamada do serviço
         * @public
         * @param {string} sFieldName - Nome do campo no serviço
         * @param {string} sFieldValue - valor que deve ser passado ao campo do serviço
         * @param {string} sOperator - Operador lógico (enum sap.ui.model.FilterOperator)
         * @param {boolean} bAnd - Se o valor booleando for "true", utilizará o operador lógico AND, senão o OR
         * @param {boolean} bNoValOblig - Se for enviado o booleano "true", vai gerar o retorno, mesmo que não tenha sido enviado nenhum valor para o parâmetro sFieldValue
         * @returns {string} Retorna a string no formato do filtro para utilizar no serviço (OData)
         */
        makeFilterPath: function(sFieldName, sFieldValue, sOperator, bAnd, bNoValOblig = false){
            if(sFieldValue || bNoValOblig){
                return sFieldName + " " + sOperator + " '" + sFieldValue + "' " + ((bAnd) ? "and" : "or") + " ";
            }else{
                return "";
            }
        },


        /**
         * Chama o serviço que envia o PDF gerado para o e-mail digitado na tela (Em desenvolvimento)
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onEnviarEmailDetalhe: function(oEvt){
            MessageToast.show(this.getResourceBundle().getText("em_desenv_msg"));
        },


        /**
         * Obtém os dados digitados na tela, formata eles para serem utilizados como filtro do serviço e chama o serviço
         * que gera o PDF em um fragmento (imprimirDetalhe)
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onImprimirDetalheOpen: function(oEvt){
/*
            // Cria o fragmento
            if (!this._imprimirDetalheDialog) {
                this._imprimirDetalheDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.imprimirDetalhe", this);
                this.getView().addDependent(this._imprimirDetalheDialog);
            }
*/
            let oModelScreenParams  = this.getView().getModel("modelScreenParams");
            let oJsonScreenParams = {};

            let sActualDate         = this.getDateFormatted(new Date());

            let sPsvComprador       = this.transformMultiInputIntoPsv("idMultiInputCompradorCod1");
            let sPsvContrato        = this.transformMultiInputIntoPsv("idMultiInputContrato1");
            let sPsvDepartamento    = this.transformMultiInputIntoPsv("idMultiInputDepartamento1");
            let sPsvFonteSuprimento = this.transformMultiInputIntoPsv("idMultiInputFonteSuprimento1");
            let sPsvFornecedor      = this.transformMultiInputIntoPsv("idMultiInputFornecedorCod1");
            let sPsvGrupoPrecos     = this.transformMultiInputIntoPsv("idMultiInputGrpPrecos1");
            let sPsvHierarquia      = this.transformMultiInputIntoPsv("idMultiInputNoHierarquia1");
            let sPsvLojas           = this.transformMultiInputIntoPsv("idMultiInputLojas1");
            let sPsvSortimento      = this.transformMultiInputIntoPsv("idMultiInputSortimento1");
            let sPsvStatusMaterial  = this.transformMultiInputIntoPsv("idMultiInputStatusMaterial1");
            let sPsvUf              = this.transformMultiInputIntoPsv("idMultiInputUf1");
            let iVisRelat           = this.getVisRelatSelectedIndex();
            let iBandeira           = this.getBandeiraSelectedIndex();
            // let bTotalUf            = this.getView().byId("idCheckBoxTotUf1").getSelected();
            // let bTotalGrupo         = this.getView().byId("idCheckBoxTotGrp1").getSelected();
            let bTotalUf            = this.getView().byId("idTBTotUf1").getPressed();
            let bTotalGrupo         = this.getView().byId("idTBTotGrp1").getPressed();
            let bXDocking           = this.getView().byId("idCheckBoxSomenteMatXdock1").getSelected();

            let oModel = this.getView().getModel();
            let sObjectPath = oModel.createKey("/PrnFichaSet", {
                DateTime: sActualDate
            });

            sObjectPath += "/$value?$filter=";

            sObjectPath += this.makeFilterPath("Ekgrp", sPsvComprador, "eq", true);
            sObjectPath += this.makeFilterPath("Ebeln", sPsvContrato, "eq", true);
            sObjectPath += this.makeFilterPath("Node3", sPsvDepartamento, "eq", true);
            sObjectPath += this.makeFilterPath("Sobsl", sPsvFonteSuprimento, "eq", true);
            sObjectPath += this.makeFilterPath("Lifnr", sPsvFornecedor, "eq", true);
            sObjectPath += this.makeFilterPath("Grupo", sPsvGrupoPrecos, "eq", true);
            sObjectPath += this.makeFilterPath("Node6", sPsvHierarquia, "eq", true);
            sObjectPath += this.makeFilterPath("Werks", sPsvLojas, "eq", true);
            // sObjectPath += this.makeFilterPath("Sortimento", sPsvSortimento, "eq", true);
            sObjectPath += this.makeFilterPath("Asort", sPsvSortimento, "eq", true);
            // sObjectPath += this.makeFilterPath("Mmsta", ((sPsvStatusMaterial) ? sPsvStatusMaterial : "0"), "eq", true);
            sObjectPath += this.makeFilterPath("Mmsta", sPsvStatusMaterial, "eq", true);
            sObjectPath += this.makeFilterPath("UF", sPsvUf, "eq", true);
            sObjectPath += this.makeFilterPath("Visao", iVisRelat, "eq", true);
            sObjectPath += this.makeFilterPath("Bandeira", iBandeira, "eq", true);
            sObjectPath += this.makeFilterPath("Total_UF", ((bTotalUf) ? "X" : ""), "eq", true, true);
            sObjectPath += this.makeFilterPath("Total_Grupo", ((bTotalGrupo) ? "X" : ""), "eq", true, true);
            sObjectPath += this.makeFilterPath("Cross", ((bXDocking) ? "X" : ""), "eq", true, true);

            if(sObjectPath.slice((sObjectPath.length-5), sObjectPath.length) === " and "){
                sObjectPath = sObjectPath.slice(0, (sObjectPath.length-5));
            }else if(sObjectPath.slice((sObjectPath.length-4), sObjectPath.length) === " or "){
                sObjectPath = sObjectPath.slice(0, (sObjectPath.length-4));
            }

            oJsonScreenParams.prnFichaSetFilterDecoded = sObjectPath.slice(sObjectPath.search("filter=")+7, sObjectPath.length);

            let sUrl = oModel.sServiceUrl + sObjectPath;
            oJsonScreenParams.prnFichaSetFullpathFilterDecoded = sUrl;

            sUrl = sUrl.replaceAll("'", "%27");
            sUrl = sUrl.replaceAll("|", "%7C");
            oJsonScreenParams.prnFichaSetFullpathFilterEncoded = sUrl;

            oModelScreenParams.setData(oJsonScreenParams);

/*
            let oIframe = this._imprimirDetalheDialog.getAggregation("content")[0];
            oIframe.setContent(
                "<iframe src='" + sUrl + "' " +
                "style='border: none;height:" + (window.innerHeight - 160) + "px;width:100%'></iframe>");
            this._imprimirDetalheDialog.open();
*/
            this.getOwnerComponent().getRouter().navTo("routeImprimirDetalhe");
        },


        /**
         * Fecha o fragmento (imprimirDetalhe)
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onImprimirDetalheClose: function(oEvt){
            this._imprimirDetalheDialog.close();
        },


//----------------------------------------------------------------------//
// Comprador                                                            //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputCompradorCod1", onde é acionado o
         * fragmento "ShComprador".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShCompradorDialog) {
                this._ShCompradorDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShComprador", this);
                this.getView().addDependent(this._ShCompradorDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputCompradorCod1", this._ShCompradorDialog);
            
            this.onValueHelpCompradorPreFilter(oEvt);

            this._ShCompradorDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputCompradorCod1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorPreFilter: function(oEvt){
            
        },


        /**
         * Aplica no campo "idMultiInputCompradorCod1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputCompradorCod1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputCompradorCod1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorCancel: function(oEvt){

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputCompradorCod1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputCompradorCod1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("Ekgrp", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
            oBinding.filter(aFilters);
        },


//----------------------------------------------------------------------//
// Contrato                                                             //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputContrato1", onde é acionado o
         * fragmento "ShContrato".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpContratoOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShContratoDialog) {
                this._ShContratoDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShContrato", this);
                this.getView().addDependent(this._ShContratoDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputContrato1", this._ShContratoDialog);

            this.onValueHelpContratoPreFilter(oEvt);

            this._ShContratoDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputContrato1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpContratoPreFilter: function(oEvt){
            let aFilters = [];

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            // Set previous filter - if "Fornecedor" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputFornecedorCod1", "Lifnr", FilterOperator.EQ, false);

            // Define filters
            this._ShContratoDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        
        /**
         * Aplica no campo "idMultiInputContrato1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpContratoClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputContrato1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputContrato1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpContratoCancel: function(oEvt){

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputContrato1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputContrato1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpContratoSearch: function(oEvt){
            let aFilters    = [],
                aAndFilters = [],
                aOrFilters  = [];
            let oBinding = oEvt.getSource().getBinding("items");

            this.buildSingleFilter(aOrFilters, "Ebeln", FilterOperator.Contains, oEvt);
            this.buildSingleFilter(aOrFilters, "Mcod1", FilterOperator.Contains, oEvt);
            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            // Set previous filter - if "Fornecedor" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputFornecedorCod1", "Lifnr", FilterOperator.EQ, false);
            if(aAndFilters.length > 0){
                aFilters.push(new Filter(aAndFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            }

            oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Departamento                                                         //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputDepartamento1", onde é acionado o
         * fragmento "ShDepartamento".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpDepartamentoOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShDepartamentoDialog) {
                this._ShDepartamentoDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShDepartamento", this);
                this.getView().addDependent(this._ShDepartamentoDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputDepartamento1", this._ShDepartamentoDialog);

            this.onValueHelpDepartamentoPreFilter(oEvt);

            this._ShDepartamentoDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputDepartamento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpDepartamentoPreFilter: function(oEvt){
            let aFilters = [];

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            // Set previous filter - if "Fornecedor" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputFornecedorCod1", "Lifnr", FilterOperator.EQ, false);
            // Set previous filter - if "Contrato" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputContrato1", "Ebeln", FilterOperator.EQ, false);

            // Define filters
            this._ShDepartamentoDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


        /**
         * Aplica no campo "idMultiInputDepartamento1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpDepartamentoClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputDepartamento1", this.getFromType().DESCRIPTION);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputDepartamento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpDepartamentoCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputDepartamento1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputDepartamento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpDepartamentoSearch: function(oEvt){
            let aFilters    = [],
                aAndFilters = [],
                aOrFilters  = [];
            let oBinding = oEvt.getSource().getBinding("items");

            this.buildSingleFilter(aOrFilters, "Node3", FilterOperator.Contains, oEvt);
            this.buildSingleFilter(aOrFilters, "Ltext", FilterOperator.Contains, oEvt);
            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            // Set previous filter - if "Fornecedor" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputFornecedorCod1", "Lifnr", FilterOperator.EQ, false);
            // Set previous filter - if "Contrato" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputContrato1", "Ebeln", FilterOperator.EQ, false);
            if(aAndFilters.length > 0){
                aFilters.push(new Filter(aAndFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Fonte de Suprimento                                                  //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputFonteSuprimento1", onde é acionado o
         * fragmento "ShFonteSuprimento".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFonteSuprimentoOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShFonteSuprimentoDialog) {
                this._ShFonteSuprimentoDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShFonteSuprimento", this);
                this.getView().addDependent(this._ShFonteSuprimentoDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputFonteSuprimento1", this._ShFonteSuprimentoDialog);

            this.onValueHelpFonteSuprimentoPreFilter(oEvt);

            this._ShFonteSuprimentoDialog.open();
        },

        
        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputFonteSuprimento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFonteSuprimentoPreFilter: function(oEvt){
            
        },


        /**
         * Aplica no campo "idMultiInputFonteSuprimento1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFonteSuprimentoClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputFonteSuprimento1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputFonteSuprimento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFonteSuprimentoCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputFonteSuprimento1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputFonteSuprimento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFonteSuprimentoSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("Sobsl", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            oFilter = new Filter("Ltext", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
			oBinding.filter(aFilters);
        },


//----------------------------------------------------------------------//
// Fornecedor                                                           //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputFornecedorCod1", onde é acionado o
         * fragmento "ShFornecedor".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShFornecedorDialog) {
                this._ShFornecedorDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShFornecedor", this);
                this.getView().addDependent(this._ShFornecedorDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputFornecedorCod1", this._ShFornecedorDialog);

            this.onValueHelpFornecedorPreFilter(oEvt);

            this._ShFornecedorDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputFornecedorCod1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorPreFilter: function(oEvt){
            let aFilters = [];

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);

            // Define filters
            this._ShFornecedorDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


        /**
         * Aplica no campo "idMultiInputFornecedorCod1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputFornecedorCod1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputFornecedorCod1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputFornecedorCod1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputFornecedorCod1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorSearch: function(oEvt){
            let aFilters    = [],
                aAndFilters = [],
                aOrFilters  = [];
            let oBinding = oEvt.getSource().getBinding("items");

            this.buildSingleFilter(aOrFilters, "Lifnr", FilterOperator.Contains, oEvt);
            this.buildSingleFilter(aOrFilters, "Mcod1", FilterOperator.Contains, oEvt);
            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            if(aAndFilters.length > 0){
                aFilters.push(new Filter(aAndFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Grupos de Preços                                                     //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputGrpPrecos1", onde é acionado o
         * fragmento "ShGrupoPrecos".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpGrpPrecosOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShGrpPrecosDialog) {
                this._ShGrpPrecosDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShGrupoPrecos", this);
                this.getView().addDependent(this._ShGrpPrecosDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputGrpPrecos1", this._ShGrpPrecosDialog);

            this.onValueHelpGrpPrecosPreFilter(oEvt);

            this._ShGrpPrecosDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputGrpPrecos1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpGrpPrecosPreFilter: function(oEvt){
            let aFilters = [];

            // Set previous filter - if "UF" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputUf1", "UF", FilterOperator.EQ, false);

            // Define filters
            this._ShGrpPrecosDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },

        
        /**
         * Aplica no campo "idMultiInputGrpPrecos1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpGrpPrecosClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputGrpPrecos1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputGrpPrecos1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpGrpPrecosCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputGrpPrecos1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputGrpPrecos1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpGrpPrecosSearch: function(oEvt){
            let aFilters    = [],
                aAndFilters = [],
                aOrFilters  = [];
            let oBinding = oEvt.getSource().getBinding("items");

            this.buildSingleFilter(aOrFilters, "Bandeira", FilterOperator.Contains, oEvt);
            this.buildSingleFilter(aOrFilters, "Descricao", FilterOperator.Contains, oEvt);
            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator

            // Set previous filter - if "UF" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputUf1", "UF", FilterOperator.EQ, false);
            if(aAndFilters.length > 0){
                aFilters.push(new Filter(aAndFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Hierarquia                                                           //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputNoHierarquia1", onde é acionado o
         * fragmento "ShHierarquia".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpHierarquiaOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShHierarquiaDialog) {
                this._ShHierarquiaDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShHierarquia", this);
                this.getView().addDependent(this._ShHierarquiaDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputNoHierarquia1", this._ShHierarquiaDialog);

            this.onValueHelpHierarquiaPreFilter(oEvt);

            this._ShHierarquiaDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputNoHierarquia1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpHierarquiaPreFilter: function(oEvt){
            let aFilters = [];

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            // Set previous filter - if "Fornecedor" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputFornecedorCod1", "Lifnr", FilterOperator.EQ, false);
            // Set previous filter - if "Contrato" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputContrato1", "Ebeln", FilterOperator.EQ, false);
            // Set previous filter - if "Departamento" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputDepartamento1", "Node3", FilterOperator.EQ, false);

            // Define filters
            this._ShHierarquiaDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


        /**
         * Aplica no campo "idMultiInputNoHierarquia1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpHierarquiaClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputNoHierarquia1", this.getFromType().DESCRIPTION);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputNoHierarquia1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpHierarquiaCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputNoHierarquia1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputNoHierarquia1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpHierarquiaSearch: function(oEvt){
            let aFilters    = [],
                aAndFilters = [],
                aOrFilters  = [];
            let oBinding = oEvt.getSource().getBinding("items");

            this.buildSingleFilter(aOrFilters, "Node3", FilterOperator.Contains, oEvt);
            this.buildSingleFilter(aOrFilters, "Ltext", FilterOperator.Contains, oEvt);
            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator

            // Set previous filter - if "Comprador" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputCompradorCod1", "Ekgrp", FilterOperator.EQ, false);
            // Set previous filter - if "Fornecedor" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputFornecedorCod1", "Lifnr", FilterOperator.EQ, false);
            // Set previous filter - if "Contrato" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputContrato1", "Ebeln", FilterOperator.EQ, false);
            // Set previous filter - if "Departamento" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputDepartamento1", "Node3", FilterOperator.EQ, false);
            if(aAndFilters.length > 0){
                aFilters.push(new Filter(aAndFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Lojas                                                                //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputLojas1", onde é acionado o
         * fragmento "ShLojas".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpLojasOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShLojasDialog) {
                this._ShLojasDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShLojas", this);
                this.getView().addDependent(this._ShLojasDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputLojas1", this._ShLojasDialog);

            this.onValueHelpLojasPreFilter(oEvt);

            this._ShLojasDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputLojas1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpLojasPreFilter: function(oEvt){
            let aFilters = [];

            // Set previous filter - if "UF" is filled (Multiple)
            this.buildArrayFilter(aFilters, "idMultiInputUf1", "UF", FilterOperator.EQ, false);

            // Define filters
            this._ShLojasDialog.getBinding("items").filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


        /**
         * Aplica no campo "idMultiInputLojas1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpLojasClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputLojas1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputLojas1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpLojasCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputLojas1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputLojas1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpLojasSearch: function(oEvt){
            let aFilters    = [],
                aAndFilters = [],
                aOrFilters  = [];
            let oBinding = oEvt.getSource().getBinding("items");

            this.buildSingleFilter(aOrFilters, "Werks", FilterOperator.Contains, oEvt);
            this.buildSingleFilter(aOrFilters, "Nome", FilterOperator.Contains, oEvt);
            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array), parameter "false" = OR operator

            // Set previous filter - if "UF" is filled (Multiple)
            this.buildArrayFilter(aAndFilters, "idMultiInputUf1", "UF", FilterOperator.EQ, false);
            if(aAndFilters.length > 0){
                aFilters.push(new Filter(aAndFilters, true)); // Multiple filter (array), parameter "true" = AND operator
            }

			oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array), parameter "true" = AND operator
        },


//----------------------------------------------------------------------//
// Sortimento                                                           //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputSortimento1", onde é acionado o
         * fragmento "ShSortimento".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpSortimentoOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShSortimentoDialog) {
                this._ShSortimentoDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShSortimento", this);
                this.getView().addDependent(this._ShSortimentoDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputSortimento1", this._ShSortimentoDialog);

            this.onValueHelpSortimentoPreFilter(oEvt);

            this._ShSortimentoDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputSortimento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpSortimentoPreFilter: function(oEvt){
            
        },


        /**
         * Aplica no campo "idMultiInputSortimento1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpSortimentoClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputSortimento1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputSortimento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpSortimentoCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputSortimento1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputSortimento1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpSortimentoSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [];
			let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("Asort", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            oFilter = new Filter("Name1", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
			oBinding.filter(aFilters);
        },
        

//----------------------------------------------------------------------//
// Status do Material                                                   //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputStatusMaterial1", onde é acionado o
         * fragmento "ShStatusMaterial".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpStatusMaterialOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShStatusMaterialDialog) {
                this._ShStatusMaterialDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShStatusMaterial", this);
                this.getView().addDependent(this._ShStatusMaterialDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputStatusMaterial1", this._ShStatusMaterialDialog);

            this.onValueHelpStatusMaterialPreFilter(oEvt);

            this._ShStatusMaterialDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputStatusMaterial1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpStatusMaterialPreFilter: function(oEvt){

        },


        /**
         * Aplica no campo "idMultiInputStatusMaterial1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpStatusMaterialClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputStatusMaterial1", this.getFromType().DESCRIPTION);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputStatusMaterial1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpStatusMaterialCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputStatusMaterial1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputStatusMaterial1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpStatusMaterialSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [];
			let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("MMSTA", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            oFilter = new Filter("MTSTB", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
			oBinding.filter(aFilters);
        },

        
//----------------------------------------------------------------------//
// UF                                                                   //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idMultiInputUf1", onde é acionado o
         * fragmento "ShUf".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpUfOpen: function(oEvt){
            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShUfDialog) {
                this._ShUfDialog = sap.ui.xmlfragment("dma.zfichatec.view.fragments.ShUf", this);
                this.getView().addDependent(this._ShUfDialog);
            }

            this.onValueHelpRememberSelections("idMultiInputUf1", this._ShUfDialog);

            this.onValueHelpUfPreFilter(oEvt);

            this._ShUfDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputUf1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpUfPreFilter: function(oEvt){
            
        },


        /**
         * Aplica no campo "idMultiInputUf1" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpUfClose: function (oEvt) {
            this.onValueHelpClose(oEvt, "idMultiInputUf1", this.getFromType().TITLE);
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputUf1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpUfCancel: function (oEvt) {

        },


        /**
         * Evento acionado ao clicar no botão de pesquisa do "SelectDialog" para o campo "idMultiInputUf1".
         * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputUf1".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpUfSearch: function(oEvt){
            let aFilters    = [],
                aOrFilters  = [];
			let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            oFilter = new Filter("Bland", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            oFilter = new Filter("Bezei", FilterOperator.Contains, sValue);
            aOrFilters.push(oFilter);

            aFilters.push(new Filter(aOrFilters, false)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
			oBinding.filter(aFilters);
        },


    });
});