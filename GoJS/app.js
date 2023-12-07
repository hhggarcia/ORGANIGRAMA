// EXTRAER INFORMACION DE LA LISTA 
// DE LOS USUARIOS DEL BNC PARA EL ORGANIGRAMA
async function GetInfoPeople(){
    return new Promise( function (resolve, reject){
        $.ajax({
            url : _spPageContextInfo.siteAbsoluteUrl + "/_api/lists/getbytitle('Organigrama')/Items",
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function(data) {
                var items = data.d.results;    
                resolve(items);         
            },
            error: function(error) {
                reject(error);
            }
        });    
    });
}