sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, MessageBox, JSONModel){
	"use strict";

    return BaseController.extend("dma.zfichatec.controller.imprimirDetalhe", {
        /**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf dma.zfichatec.view.imprimirDetalhe
		 */
        onInit: function(oEvt){
            // let oRouter = this.getOwnerComponent().getRouterFor(this);
            let oRouter = this.getRouter();
            oRouter.attachRouteMatched(this.handleRouteMatched, this);
            
            this.sGuid = "";
        },


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf dma.zfichatec.view.imprimirDetalhe
		 */
		onBeforeRendering: function() {

        },


        /**
         * Handler que é acionado sempre que essa view é acessada pelo Router
         * Chama o método que aciona o serviço de geração do PDF
         * @public
         */
        handleRouteMatched: function(oEvt){
            // console.log(oEvt.getParameter("name"));
            if(oEvt.getParameter("name") !== "routeImprimirDetalhe"){
                return;
            }
            this.callPdfPrint();
        },


        /**
         * Chama o serviço de geração do PDF (PrnFichaSet) que na primeira chamada gera o PDF e armazena no SAP o valor binário,
         * sendo retornado um ID que já é repassado como URL para o objeto IFrame, que chama o mesmo serviço, mas dessa vez
         * passando o ID como chave e com o parâmetro "/$value" que aciona o método GETSTREAM da classe do serviço
         * @public
         */
        callPdfPrint: function(){
            let oIframe             = this.getView().byId("idFrame01");
            let oModelServ          = this.getView().getModel();
            let oModelScreenParams  = this.getView().getModel("modelScreenParams");
            let oDataScreenParams   = oModelScreenParams.getData();
            let sObjectPath         = "",
                sUrl                = "";

            this.getView().setBusy(true);

            oIframe.setContent(
                "<iframe src='' height='93%' width='100%' style='border: none;' />");

            if(Object.keys(oDataScreenParams).length !== 0 && oDataScreenParams.constructor === Object){
                oModelServ.read(
                    "/PrnFichaSet",
                    {
                        urlParameters: {
                            "$filter": oDataScreenParams.prnFichaSetFilterDecoded
                        },
                        success: function(oDataRetrieved){
                            if(oDataRetrieved.results.length > 0){
                                if(oDataRetrieved.results[0].Guid === "00000000000000000000000000000000"){
                                    MessageBox.information(
                                        this.getResourceBundle().getText("info_pdf_no_values"),
                                        {
                                            title: this.getResourceBundle().getText("info_text"),
                                            styleClass: this.getOwnerComponent().getContentDensityClass(),
                                            actions: [MessageBox.Action.CLOSE],
                                            onClose: function () {
                                                this.onNavBack();
                                            }.bind(this)
                                        }
                                    );
                                    return;
                                }

                                this.sGuid = oDataRetrieved.results[0].Guid;

                                sObjectPath = oModelServ.createKey("/PrnFichaSet", {
                                    Guid: this.sGuid
                                });
                                
                                sUrl = oModelServ.sServiceUrl + sObjectPath + "/$value";

                                sUrl = sUrl.replaceAll("'", "%27");
                                sUrl = sUrl.replaceAll("|", "%7C");

                                oIframe.setContent(
                                    "<iframe src='" + sUrl + "' " +
                                    "height='93%' width='100%' style='border: none;' />");
                            }else{
                                MessageBox.error(
                                    this.getResourceBundle().getText("error_pdf_service_empty"),
                                    {
                                        //details: this.getResourceBundle().getText("error_pdf_service_empty"),
                                        title: this.getResourceBundle().getText("error_text"),
                                        styleClass: this.getOwnerComponent().getContentDensityClass(),
                                        actions: [MessageBox.Action.CLOSE],
                                        onClose: function () {
                                            this.onNavBack();
                                        }.bind(this)
                                    }
                                );
                            }
/*
                            // Exemplo IFrame
                            oIframe.setContent(
                                "<iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' " +
                                "height='93%' width='100%' style='border: none;' />");
*/
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function(oError){
                            MessageBox.error(
                                this.getResourceBundle().getText("error_pdf_service", [ oError.message, oError.responseText ]),
                                {
                                    // details: this.getResourceBundle().getText("error_pdf_service", [ oError.message, oError.responseText ]),
                                    title: this.getResourceBundle().getText("error_text"),
                                    styleClass: this.getOwnerComponent().getContentDensityClass(),
                                    actions: [MessageBox.Action.CLOSE],
                                    onClose: function () {
                                        this.onNavBack();
                                    }.bind(this)
                                }
                            );
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                );
            }

        },


        /**
         * Efetua validação do e-mail digitado e caso seja válido, aciona o serviço de envio do PDF
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onEnviarEmailDetalhe: function(oEvt){
            if(!this._validEmail(this.getView().byId("idInputEmail1").getValue())){
                this.getView().byId("idInputEmail1").setValueState(sap.ui.core.ValueState.Error);
                this.getView().byId("idInputEmail1").focus();
                MessageToast.show(this.getResourceBundle().getText("email_invalido_lbl"));
                return;
            }
            this.getView().byId("idInputEmail1").setValueState(sap.ui.core.ValueState.None);
            // MessageToast.show(this.getResourceBundle().getText("em_desenv_msg"));

            if(this.sGuid){
                let oModelServ = this.getView().getModel();
                let sFilter = "",
                    sObjectPath = oModelServ.createKey("/EmailFichaTecSet", {
                    Guid: this.sGuid
                });

                sFilter += "Email eq '" + this.getView().byId("idInputEmail1").getValue() + "'";

                oModelServ.read(
                    sObjectPath,
                    {
                        urlParameters: {
                            "$filter": sFilter
                        },
                        success: function(oDataRetrieved){
// debugger;
                            if(oDataRetrieved.results[0].Sent === "OK"){
                                MessageBox.success(
                                    this.getResourceBundle().getText("success_sent_email"),
                                    {
                                        title: this.getResourceBundle().getText("success_text"),
                                        styleClass: this.getOwnerComponent().getContentDensityClass(),
                                        onClose: null
                                    }
                                );
                            }else{
                                MessageBox.error(
                                    this.getResourceBundle().getText("error_sent_email"),
                                    {
                                        title: this.getResourceBundle().getText("error_text"),
                                        styleClass: this.getOwnerComponent().getContentDensityClass(),
                                        actions: [MessageBox.Action.CLOSE],
                                        onClose: function (oEvt) {
                                            this.getView().byId("idInputEmail1").setValue("");
                                        }.bind(this)
                                    }
                                );
                            }
                        }.bind(this),
                        error: function(oError){
// debugger;
                            MessageBox.error(
                                this.getResourceBundle().getText("error_sent_email"),
                                {
                                    title: this.getResourceBundle().getText("error_text"),
                                    styleClass: this.getOwnerComponent().getContentDensityClass(),
                                    actions: [MessageBox.Action.CLOSE],
                                    onClose: function (oEvt) {
                                        this.getView().byId("idInputEmail1").setValue("");
                                    }.bind(this)
                                }
                            );
                        }.bind(this)
                    }
                );
            }else{

            }
        }
    });
});