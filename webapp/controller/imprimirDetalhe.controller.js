sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, JSONModel){
	"use strict";

    return BaseController.extend("dma.zfichatec.controller.imprimirDetalhe", {
        onInit: function(oEvt){
            // let oRouter = this.getOwnerComponent().getRouterFor(this);
            let oRouter = this.getRouter();
            oRouter.attachRouteMatched(this.handleRouteMatched, this);
/*
            let oIframe = this.getView().byId("idFrame01");
            oIframe.setContent(
                "<iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' " +
                "height='80%' width='100%' style='border: none;'></iframe>");
*/
        },


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf dma.zfichatec.view.Home
		 */
		onBeforeRendering: function() {
            // this.callPdfPrint();

/*
            let oModelServ = this.getView().getModel();
            debugger;
            // /sap/opu/odata/sap/ZCOCKPIT_FICHATEC_SRV/PrnFichaSet(%2720210322222306%27)/$value?$filter=Ekgrp%20eq%20%27F04%27%20and%20Mmsta%20eq%20%270%27%20and%20Total_UF%20eq%20%27%27%20and%20Total_Grupo%20eq%20%27%27%20and%20Cross%20eq%20%27%27
            // /sap/opu/odata/sap/ZCOCKPIT_FICHATEC_SRV/PrnFichaSet(%2720210322224038%27)/$value?$filter=Ekgrp%20eq%20%27F04%27%20and%20Ebeln%20eq%20%274600000194%27%20and%20Lifnr%20eq%20%2710008950%27%20and%20Mmsta%20eq%20%2700%27%20and%20Total_UF%20eq%20%27%27%20and%20Total_Grupo%20eq%20%27%27%20and%20Cross%20eq%20%27%27
            let sPath = "/PrnFichaSet(%2720210322224038%27)/$value?$filter=Ekgrp eq 'F04' and Ebeln eq '4600000194' and Lifnr eq '10008950' and Mmsta eq '00' and Total_UF eq '' and Total_Grupo eq '' and Cross eq ''";
            oModelServ.read(
                sPath,
                null,
                null,
                function(oDataRetrieved, oResponse){
                    debugger;
                },
                function(oError){
                    debugger;
                }

                // {
                //     urlParameters: {
                //         "$filter": "Ekgrp eq 'F04' and Ebeln eq '4600000194' and Lifnr eq '10008950' and Mmsta eq '00' and Total_UF eq '' and Total_Grupo eq '' and Cross eq ''"
                //     },
                //     success: function(oDataRetrieved){
                //         debugger;
                //     },
                //     error: function(oError){
                //         debugger;
                //     }
                // }
            );
*/
        },

        handleRouteMatched: function(oEvt){
            // console.log(oEvt.getParameter("name"));
            if(oEvt.getParameter("name") !== "routeImprimirDetalhe"){
                return;
            }
            this.callPdfPrint();
        },

        callPdfPrint: function(){
            let oIframe             = this.getView().byId("idFrame01");
            let oModelServ          = this.getView().getModel();
            let oModelScreenParams  = this.getView().getModel("modelScreenParams");
            let oDataScreenParams   = oModelScreenParams.getData();

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
                            
                            oIframe.setContent(
                                "<iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' " +
                                "height='93%' width='100%' style='border: none;' />");
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function(oError){
                            // debugger;
                            this.getView().setBusy(false);
                        }
                    }
                );
            }

        },

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