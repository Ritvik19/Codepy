document.getElementById("code").innerHTML = "Get your code here"
document.getElementById("code-btn").disabled = true;
var clipboard = new ClipboardJS('.copy-button');

function snackbarDisplay() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}

function loadPrograms() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var dataObj = JSON.parse(this.responseText);
            program_name = dataObj['Program']
            platform = dataObj['Category']
            extension = dataObj['Language']
            var i = 0;
            HTMLcontent = ''
            while (typeof program_name[i] !== "undefined") {
                HTMLcontent += '<li class="w3-padding-8 program" onclick="loadCode(\'' + platform[i] + '\', \'' + program_name[i] + '\', \'' + extension[i] + '\')"><span class="w3-large">' + program_name[i] + '</span><br><span>' + platform[i] + '</span></li>'
                i++;
            }
            document.getElementById("postlist").innerHTML += HTMLcontent;
            document.getElementsByClassName("badge")[0].innerHTML = i;
        }
    };
    xhttp.open("GET", "data/ProgramList.json", true);
    xhttp.send();
}

function listFilter(inputEl, listEl, element) {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(inputEl);
    filter = input.value.toUpperCase();
    ul = document.getElementById(listEl);
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName(element)[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function loadCode(p, q, e) {
    document.getElementById('post-title').innerHTML = q + "." + e + " - " + p;
    var xhttp = new XMLHttpRequest();
    var filepath = '../data/' + p + '/' + q + '.' + e
    console.log(filepath)
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            code = this.responseText;
            code = code.replace(/</g, "&lt;")
            code = code.replace(/>/g, "&gt;")
            document.getElementById('share').href = "/?p=" + encodeURIComponent(p) + "&q=" + encodeURIComponent(q) + "&e=" + encodeURIComponent(e);
            document.getElementById("code").innerHTML = code;
            document.getElementById("code-btn").disabled = false;
            document.getElementById("code-btn").setAttribute('onclick', "loadDoc('" + p + "', '" + q + "', '" + e + "')");
        } else {
            document.getElementById("code").innerHTML = 'Get your code here';
            document.getElementById("code-btn").disabled = true;
        }
    };
    xhttp.open("GET", filepath, true);
    xhttp.send();
}

function loadDoc(p, q, e) {
    console.log(p + q + e)
    window.open('../data/' + p + '/' + q + '.' + e)
}


function loadCounts() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var dataObj = JSON.parse(this.responseText);
            dataObj = Object.entries(dataObj)
            HTMLcontent = ''
            for (i = 0; i < dataObj.length; i++) {
                HTMLcontent += '<span class="w3-tag w3-padding-small">' + dataObj[i][0] + '<span class="badge">' + dataObj[i][1] + '</span></span>'
            }
            document.getElementsByClassName("tags")[0].innerHTML = HTMLcontent;
        }
    };
    xhttp.open("GET", "data/ProgramCounts.json", true);
    xhttp.send();
}

loadCounts();
loadPrograms();

var params = new URLSearchParams(location.search);
var p = params.get('p')
var q = params.get('q')
var e = params.get('e')
if (p != null && q != null && e != null) {
    loadCode(p, q, e);
}