// ============================================================
// Pegar este código en: tu Google Sheet → Extensions → Apps Script
// (borrar lo que venga por defecto y pegar esto en su lugar)
// ============================================================

// Cambiá esto por cualquier texto largo e inventado — es la "contraseña" que
// va a usar el sitio para poder escribir en la planilla. Tiene que coincidir
// EXACTO con la variable APPS_SCRIPT_SECRET que vas a cargar en Netlify.
var SECRET = 'PONER-ACA-UN-TEXTO-LARGO-E-INVENTADO-123';

function doGet(e) { return manejar(e); }
function doPost(e) { return manejar(e); }

function manejar(e) {
  try {
    var params = e.parameter;
    if (params.secret !== SECRET) {
      return responder({ error: 'no autorizado' });
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var accion = params.action;

    if (accion === 'get') {
      var hoja = ss.getSheetByName(params.tab);
      if (!hoja) return responder({ error: 'no existe la pestaña ' + params.tab });
      return responder({ values: hoja.getDataRange().getValues() });
    }

    if (accion === 'append') {
      var body = JSON.parse(e.postData.contents);
      var hoja2 = ss.getSheetByName(body.tab);
      if (!hoja2) return responder({ error: 'no existe la pestaña ' + body.tab });
      hoja2.appendRow(body.row);
      return responder({ ok: true });
    }

    if (accion === 'setRows') {
      var body2 = JSON.parse(e.postData.contents);
      var hoja3 = ss.getSheetByName(body2.tab);
      if (!hoja3) return responder({ error: 'no existe la pestaña ' + body2.tab });
      hoja3.getRange(body2.startRow, 1, body2.rows.length, body2.rows[0].length).setValues(body2.rows);
      return responder({ ok: true });
    }

    return responder({ error: 'acción desconocida: ' + accion });
  } catch (err) {
    return responder({ error: String(err) });
  }
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
