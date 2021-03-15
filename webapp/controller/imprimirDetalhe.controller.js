sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, JSONModel){
	"use strict";

    return BaseController.extend("dma.zfichatec.controller.imprimirDetalhe", {
        onInit: function(oEvt){
            var oIframe = this.getView().byId("idFrame01");
            oIframe.setContent(
                "<iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' " +
                "height='80%' width='100%' style='border: none;'></iframe>");
        },

        onEnviarEmailDetalhe: function(oEvt){
            MessageToast.show(this.getResourceBundle().getText("em_desenv_msg"));
        }
    });
});