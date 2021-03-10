sap.ui.define([
	"dma/zfichatec/controller/BaseController",
	"sap/m/Label",
	"sap/m/Popover",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, Label, Popover, DateFormat, Fragment, JSONModel, MessageToast) {
	"use strict";
	//var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return BaseController.extend("dma.zfichatec.controller.Home", {
		// _planningCalendar: null,
		_aDialogTypes: null,
		sUname: '',
		sEkgrp: '',
        // _idAppntOverSeven: null,

		onInit: function () {
			var sRootPath = jQuery.sap.getModulePath("dma.zfichatec");
			var sImagePath = sRootPath + "/img/background_cockpit.png";
			// this.byId("img_epa").setSrc(sImagePath); /* popula dados da Agenda */
        },
        
        completedHandlerWizard01: function(oEvt){
            sap.m.MessageToast.show("Em desenvolvimento (Placeholder)");
        }
	});
});