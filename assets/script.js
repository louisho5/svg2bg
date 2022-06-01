var fileUpload = document.querySelector("#fileUpload");
var URL_Input = document.querySelector("#urlInput > input");
var textarea = document.querySelector("#result > textarea");
var preview = document.querySelector("#preview");
var btnCopy = document.querySelector("button.btn-copy");
var btnBgOnly = document.querySelector('#result .btn-bg input[name="bgOnly"]');

// Declare file input event listeners
fileUpload.addEventListener("change", handleUpload);

function handleUpload (event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.onload = (e) => { 
		var temp = e.target.result;
		temp = encodeXml(temp);
		var resultVal = '';
		resultVal += 'content: "";\n';
		resultVal += 'padding: 30px;\n';
		resultVal += 'background-size: contain;\n';
		resultVal += 'background-repeat: no-repeat;\n';
		resultVal += 'background-position: center center;\n';
		resultVal += 'background-image: url("data:image/svg+xml,' + temp + '");';
		textarea.value = resultVal;
		if ( btnBgOnly.checked ) {
			textarea.value = 'background-image: url("data:image/svg+xml,' + temp + '");';
		}
		preview.innerHTML = e.target.result;
		
	};
	reader.readAsText(file);
	btnCopy.innerHTML = "Copy";
}

// Declare URL input event listeners
URL_Input.addEventListener("input", handleURL);

function handleURL() {
	var request = new XMLHttpRequest();
	request.open('GET', URL_Input.value, true);
	request.responseType = 'blob';
	request.onload = function() {
		var reader = new FileReader();
		reader.readAsText(request.response);	
		reader.onload =  function(e){
			var temp = e.target.result;
			temp_result = encodeXml(temp);
			var resultVal = '';
			resultVal += 'content: "";\n';
			resultVal += 'display: inline-block;\n';
			resultVal += 'width: 100px;\n';
			resultVal += 'height: 100px;\n';
			resultVal += 'background-size: contain;\n';
			resultVal += 'background-repeat: no-repeat;\n';
			resultVal += 'background-position: center center;\n';
			resultVal += 'background-image: url("data:image/svg+xml,' + temp_result + '");';;
			textarea.value = resultVal;
			if ( btnBgOnly.checked ) {
				textarea.value = 'background-image: url("data:image/svg+xml,' + temp_result + '");';
			}
			preview.innerHTML = temp;
		};
	};
	request.send();
	btnCopy.innerHTML = "Copy";
	URL_Input.value = URL_Input.value + "?";  // perform onchange
}

// Detect checkbox
var bgCheckboxTemp = localStorage.getItem('svg2bg_btnBgOnly');
if ( bgCheckboxTemp == "checked" ) {
  btnBgOnly.checked = true;
}

function bgOptionCheckbox() {
  if ( btnBgOnly.checked ) {
      localStorage.setItem('svg2bg_btnBgOnly', 'checked');
  } else {
      localStorage.setItem('svg2bg_btnBgOnly', 'unchecked');
  }
}

// Focus blur
function focusOut(){
	setTimeout( function() {
		URL_Input.blur();
	}, 10);
}

/* Drag and drop file */
const dropArea = document.querySelector("#dropArea");

const preventDefaults = e => {
	e.preventDefault();
	e.stopPropagation();
};
const active = e => {
	dropArea.classList.add("active");
};
const deactive = e => {
	dropArea.classList.remove("active");
};

const handleDrop = e => {
	const files = e.dataTransfer.files;
	const dT = new DataTransfer();
	dT.items.add(e.dataTransfer.files[0]);
	fileUpload.files = dT.files;
	
	var tempEvent = new Event('change');
	fileUpload.dispatchEvent(tempEvent);
};

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
	dropArea.addEventListener(eventName, preventDefaults, false);
});
["dragenter", "dragover"].forEach(eventName => {
	dropArea.addEventListener(eventName, active, false);
});
["dragleave", "drop"].forEach(eventName => {
	dropArea.addEventListener(eventName, deactive, false);
});

dropArea.addEventListener("drop", handleDrop, false);


/* XML escape */
function encodeXml(file) {
    return file.replace(/[<>&'"#{}\r\n\t]/g, function (c) {
        switch (c) {
            case '<': return '%3C';
            case '>': return '%3E';
            case '&': return '%26';
            case '\'': return '%5C';
            case '"': return '%22';
            case '#': return '%23';
            case '{': return '%7B';
            case '}': return '%7D';
            case '\r': return '%0A';
            case '\n': return '%0A';
            case '\t': return '%09';
        }
    });
}

/* Click to copy */ 
btnCopy.onclick = function(){
    textarea.select();
    document.execCommand('copy');
    btnCopy.innerHTML = "Copied";
}
