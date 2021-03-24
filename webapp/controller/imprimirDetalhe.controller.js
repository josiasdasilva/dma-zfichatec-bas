sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, JSONModel){
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
        },


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf dma.zfichatec.view.imprimirDetalhe
		 */
		onBeforeRendering: function() {

        },


        /**
         * 
         * @public
         * 
         */
        handleRouteMatched: function(oEvt){
            // console.log(oEvt.getParameter("name"));
            if(oEvt.getParameter("name") !== "routeImprimirDetalhe"){
                return;
            }
            this.callPdfPrint();
        },


        /**
         * 
         * @public
         * 
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
                            // debugger;
                            if(oDataRetrieved.results.length > 0){
                                sObjectPath = oModelServ.createKey("/PrnFichaSet", {
                                    Guid: oDataRetrieved.results[0].Guid
                                });
                                
                                sUrl = oModelServ.sServiceUrl + sObjectPath + "/$value";

                                sUrl = sUrl.replaceAll("'", "%27");
                                sUrl = sUrl.replaceAll("|", "%7C");

                                oIframe.setContent(
                                    "<iframe src='" + sUrl + "' " +
                                    "height='93%' width='100%' style='border: none;' />");
                            }else{

                            }
/*
                            oIframe.setContent(
                                "<iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' " +
                                "height='93%' width='100%' style='border: none;' />");
*/
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function(oError){
                            // debugger;
                            MessageBox.error(
                                this._oResourceBundle.getText("errorText"),
                                {
                                    id: "serviceErrorMessageBox1",
                                    details: "Erro ao acessar o serviço de geração do PDF:\n" + oError.message + "\n" + oError.responseText,
                                    styleClass: this._oComponent.getContentDensityClass(),
                                    actions: [MessageBox.Action.CLOSE],
/*
                                    onClose: function () {
                                        this._bMessageOpen = false;
                                    }.bind(this)
*/
                                }
                            );
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                );
            }

        },


        /**
         * 
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
            MessageToast.show(this.getResourceBundle().getText("em_desenv_msg"));
        }
    });
});