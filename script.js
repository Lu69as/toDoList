if (localStorage.getItem("items") == null || localStorage.getItem("items") == "")
    localStorage.setItem("items", "Do this§You Should do this, Its probably very important§19. 11. 2024|Or do this§Its also important, I think...")

function activeItem(newItem, text1, text2) {
    newItem.addEventListener("click", () => {
        document.querySelector(".item .title").innerHTML = text1;
        document.querySelector(".item .desc").innerHTML = text2;

        document.querySelectorAll("nav tr").forEach((e) => e.classList.remove("activeItem"));
        newItem.classList.add("activeItem");
    })
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

                activeItem(newItem, itemChildren[0], itemChildren[1]);

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

            activeItem(newItem, itemChildren[0], itemChildren[1]);

            newTable.lastElementChild.appendChild(newItem);
            document.querySelector("nav").appendChild(newTable);
        }
    }
    else {
        let newItem = document.createElement("tr");
        newItem.innerHTML = `<td>${itemChildren[0]}</td><td>${itemChildren[1]}</td>`;

        activeItem(newItem, itemChildren[0], itemChildren[1]);

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

document.querySelectorAll("nav table tr:not(:has(th))")[0].click();

setInterval(() => { if (document.querySelector(".switch input").checked) saveList(); }, 1000);