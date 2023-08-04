System.register([], function (_export) {
  return {
    execute: function () {
      _export({
        _widgetLabel: "Diagrama de Gantt",
        dataSourceTitle: "Fuente",
        selectDataSource: "Feature layer",
        selectNameField: "Campo de nombre",
        selectStartDateField: "Campo de fecha de inicio",
        selectEndDateField: "Campo de fecha de finalización",
        selectMap: "Seleccionar mapa",
        styling: "Estilo",
        setBackgroundColor: "Establecer color de fondo",
        setFontColor: "Establecer color de etiqueta",
      })
    }
  }
});
