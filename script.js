if (localStorage.getItem("items") == null || localStorage.getItem("items") == "")
    localStorage.setItem("items", "Do this§You Should do this, Its probably very important§19. 11. 2024|Or do this§Its also important, I think...")

function activeItem(newItem) {
    newItem.addEventListener("click", () => {
        document.querySelectorAll("nav tr").forEach((e) => e.classList.remove("activeItem"));
        newItem.classList.add("activeItem");

        document.querySelector(".item .title").innerHTML = document.querySelector(".activeItem").firstElementChild.innerHTML;
        document.querySelector(".item .desc").innerHTML = document.querySelector(".activeItem").lastElementChild.innerHTML;
    });
    document.querySelectorAll(".desc input").forEach((e) => { e.addEventListener("click", saveList) });
};

function saveList() {
    try {
        document.querySelector(".activeItem").firstElementChild.innerHTML = document.querySelector(".item .title").innerHTML;
        document.querySelector(".activeItem").lastElementChild.innerHTML = document.querySelector(".item .desc").innerHTML;
    }
    catch (err) { location.reload(); }

    let items = "";
    document.querySelectorAll("nav table > tr, nav tbody > tr").forEach((tr) => {
        tr.querySelectorAll("td").forEach((td) => {
            items += td.innerHTML;
            
            if (td.innerHTML != td.parentElement.lastElementChild.innerHTML || tr.parentElement.parentElement.firstElementChild.nodeName == "THEAD")
                items += "§";
        })

        if (tr.parentElement.parentElement.firstElementChild.nodeName == "THEAD")
            items += tr.parentElement.parentElement.firstElementChild.innerText.trimEnd(" ");


        if (tr.innerHTML != document.querySelectorAll("nav table > tr, nav tbody > tr")[
                document.querySelectorAll("nav table > tr, nav tbody > tr").length - 1 ].innerHTML)
            items += "|";
    });

    localStorage.setItem("items", items);
}

localStorage.getItem("items").split("|").forEach((item) => {
    let itemChildren = item.split("§");

    if (itemChildren[2] != undefined) {
        let madeChild = false;
        document.querySelectorAll(".calendar-date").forEach((date) => {
            if (date.querySelector("th").innerHTML == itemChildren[2]) {
                let newItem = document.createElement("tr");
                newItem.innerHTML = `<td>${itemChildren[0]}</td><td>${itemChildren[1]}</td>`;
                activeItem(newItem);

                date.lastElementChild.appendChild(newItem);
                madeChild = true;
            }
        })
        if (!madeChild) {
            let newTable =  document.createElement("table");
            newTable.classList.add("calendar-date");
            newTable.innerHTML = `<thead><th>${itemChildren[2]}</th></thead><tbody></tbody>`;
                
            let newItem = document.createElement("tr");
            newItem.innerHTML = `<td>${itemChildren[0]}</td><td>${itemChildren[1]}</td>`;
            activeItem(newItem);

            newTable.lastElementChild.appendChild(newItem);
            document.querySelector("nav").appendChild(newTable);
        }
    }
    else {
        let newItem = document.createElement("tr");
        newItem.innerHTML = `<td>${itemChildren[0]}</td><td>${itemChildren[1]}</td>`;
        activeItem(newItem);

        document.querySelector(".general-items").appendChild(newItem);
    }
})

function addItem() {
    let value = document.querySelector(".createItem input").value;
    if (value.length < 1) return;

    let newItem = document.createElement("tr");
    newItem.innerHTML = `<td>${value}</td><td>Temorary text, edit with the pen tool on the left</td>`;

    activeItem(newItem, value, "Temorary text, edit with the pen tool on the left");

    document.querySelector(".general-items").appendChild(newItem);
}

document.querySelector(".createItem button").addEventListener("click", addItem);
document.querySelector(".createItem input").addEventListener("change", addItem);

{
    document.querySelector(".openMenu").addEventListener("click", () => document.querySelector("nav").classList.toggle("closed") );
    
    document.querySelector(".deleteItem").addEventListener("click", () => {
        let m = "Are you sure you want to delete this note?"
        if (confirm(m)) {
            document.querySelector(".activeItem").remove();
            document.querySelectorAll("nav table tr:not(:has(th))")[0].click();
            saveList();
        }
    })
    
    document.querySelector(".editItem").addEventListener("click", () => {
        if (document.querySelector(".title").getAttribute("contenteditable") == "false" || document.querySelector(".title").getAttribute("contenteditable") == null) {
            document.querySelector(".title").setAttribute("contenteditable", "true");
            document.querySelector(".desc").setAttribute("contenteditable", "true");
            document.querySelector(".item").classList.add("edit");
        }
        else {
            document.querySelector(".title").setAttribute("contenteditable", "false");
            document.querySelector(".desc").setAttribute("contenteditable", "false");
            document.querySelector(".item").classList.remove("edit");
    
            saveList();
        };
    });
}


document.querySelectorAll("nav table tr:not(:has(th))")[0].click();

setInterval(() => { if (document.querySelector(".switch input").checked) saveList(); }, 1000);

document.querySelectorAll(".editButtons button").forEach((e) => {
    e.addEventListener("click", () => {
        let newList;
        if (e.classList[0] == "list") {
            newList = document.createElement("ul");
            newList.innerHTML = `<li></li>`;
        }
        else if (e.classList[0] == "numlist") {
            newList = document.createElement("ol");
            newList.innerHTML = `<li></li>`;
        }
        else if (e.classList[0] == "checklist") {
            let c = document.querySelectorAll(".item .desc .input").length;
            newList = document.createElement("div");
            newList.innerHTML = `<input type="checkbox" id="box-${c}"><label for="box-${c}"> This is not checked</label>`;
            newList.firstElementChild.setAttribute("onClick", `this.hasAttribute("checked") 
                ? this.removeAttribute("checked") : this.setAttribute("checked", true);`);
            }
            
        if (document.querySelector(".desc").lastElementChild.nodeName == "BR" || 
            (document.querySelector(".desc").lastElementChild.firstElementChild.nodeName == "BR" && 
                document.querySelector(".desc").lastElementChild.lastElementChild.nodeName == "BR")) {
                    document.querySelector(".desc").lastElementChild.remove()
        };

        document.querySelector(".item .desc").appendChild(newList);
    })
})

document.querySelector(".item .desc").addEventListener("keypress", (k) => {
    if (k.key == "Enter" && window.getSelection().anchorOffset > 0) {
        let newList;
        if (window.getSelection().focusNode.parentElement.nodeName == "LABEL") {
            // let listPos = window.getSelection().focusNode.parentElement.parentElement.previousElementSibling;

            // let newInput = listPos.firstElementChild.cloneNode(true);
            // let newLabel = listPos.lastElementChild.cloneNode(true);
            // newInput.removeAttribute("checked");
            // newLabel.innerHTML = window.getSelection().focusNode.parentElement.innerHTML.slice(window.getSelection().anchorOffset, 9999999);

            // listPos.appendChild(document.createElement("br"));
            // listPos.appendChild(newInput);
            // listPos.appendChild(newLabel);

            // setTimeout(() => {
            //     // window.getSelection().focusNode.parentElement.parentElement.remove();
            // }, 100);
        }
        else if (window.getSelection().focusNode.parentElement.nodeName == "UL" || window.getSelection().focusNode.parentElement.nodeName == "OL") {
            newList = document.createElement("li");
            newList.innerHTML = window.getSelection().focusNode.parentElement.innerHTML.slice(window.getSelection().anchorOffset, 9999999);
            window.getSelection().focusNode.parentElement.appendChild(newList);
        }
    }
})