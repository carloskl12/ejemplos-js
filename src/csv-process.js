const readCsv = async (file, sep) =>{
    // const sep = ','; //Separador de elementos en una fila
    if(sep == '') {
        sep = ',';
        console.log("Separador de columnas por defecto:", sep)
    }
    const stringSep = '"'; //Separador de strings
    const text = await file.text();
    const data = [];
    const lines = text.split("\n");
    lines.forEach(element => {
        const row = [];
        let value="";
        let state = 0;
        for(let i = 0;i < element.length;i++){
            const c = element.charAt(i);
            if(c === stringSep ){
                if(state === 0){
                    state = 1;
                }else if(state === 1){
                    state = 0;
                }
            } else if(state === 0){
                if ( c != sep){
                    value+=c;
                }else{
                    row.push(value);
                    value = "";
                }
            } else if(state === 1){
                value+=c;
            }
        }
        row.push(value);
        data.push(row);
    });
    return data;
};


document.getElementById('process-csv').addEventListener('click', function(e) {
    let file = document.getElementById('csv-file').files[0];
    const sep = document.getElementById('sep-col').value;
    (async () => {
        const datos = await readCsv(file,sep);
        // console.log('datos:', datos);
        drawTable(datos);
        
    })();
});

const drawTable = (data) =>{
    let tbl = document.createElement("table");
    let tblHead = document.createElement("thead");
    let tblBody = document.createElement("tbody");
    //Agrega el encabezado
    let headRow = document.createElement('tr');
    data[0].forEach( value =>{
        let cell = document.createElement("th");
        cell.appendChild(document.createTextNode(value))
        headRow.appendChild(cell);
    }
    )
    tblHead.appendChild(headRow);

    for(let i = 1 ;i < data.length;i++){
        let row = document.createElement("tr");
        
        for(let j = 0; j< data[i].length;j++){
            let cell = document.createElement("td");
            cell.appendChild(document.createTextNode(data[i][j]))
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    tbl.setAttribute('class','normal');
    tbl.setAttribute('id','tb-result');
    const divTabla = document.getElementById('csv-output');
    divTabla.innerHTML = '';
    divTabla.appendChild(tbl);
};

const getDataFromTable = (tableId) => {
    const table = document.getElementById(tableId);
    const data = [];
    
    let numRows = 0;
    if(table && table.rows) numRows=table.rows.length;
    let numCols = 0;
    if(numRows>0) numCols = table.rows[0].cells.length;
    console.log('Filas:',numRows, '  Columnas:',numCols);
    for(let r = 0; r< numRows;r++){
        const row =[]
        for(let c=0;c< numCols;c++){
            row.push(table.rows[r].cells[c].textContent);
        }
        data.push(row);
    }
    return data;
};

const dataArrayToCsv = (data,sep) => {
    if(sep == '') {
        sep = ',';
        console.log("dataArrayToCsv -- separador de columnas por defecto:", sep)
    }
    let s =''
    data.forEach(row => {
        rs=''
        row.forEach(cell => {
            if(rs) rs+=sep;
            if (typeof cell === 'string' || cell instanceof String){
                if( cell.indexOf(sep)>-1) cell='"'+cell+'"';
            }
            rs+= cell;
        });
        if(s) s+='\n';
        s+=rs;
    });
    return s;
}

document.getElementById('process-csv').addEventListener('click', function(e) {
    let file = document.getElementById('csv-file').files[0];
    const sep = document.getElementById('sep-col').value;
    if('\t' == '') console.log("tabulador y espacio vacío son iguales");
    else console.log("tabulador y espacio vacío son diferentes");
    (async () => {
        const datos = await readCsv(file,sep);
        console.log('datos:', datos);
        drawTable(datos);
        
    })();
});



document.getElementById('export-bt').addEventListener('click', function(evt) {
    const data = getDataFromTable('tb-result');
    const sep = document.getElementById('sep-col-save').value;
    const csvstring = dataArrayToCsv(data,sep);
    const bb = new Blob([csvstring], { type: 'text/plain' });
	const a = document.createElement('a');
    a.download = 'download.csv';
    a.href = window.URL.createObjectURL(bb);
    a.textContent = 'Download ready';
    a.style='display:none';
    a.click();    
});


document.getElementById('csv-copy-bt').addEventListener('click', function(evt) {
    const data = getDataFromTable('tb-result');
    if(!data) return;
    const sep = document.getElementById('sep-col-save').value;

    console.log("separador",sep)
    const csvstring = dataArrayToCsv(data,sep);
    navigator.clipboard.writeText(csvstring);
});

