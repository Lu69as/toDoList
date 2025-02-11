let obj = [ { title: "New Note", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nemo quia, ipsum officiis sint obcaecati deserunt porro quos odit nisi consequuntur, vel hic facilis, sapiente iusto omnis. Harum, dolorum vel." } ];
if (!localStorage.getItem("items"))
    localStorage.setItem("items", JSON.stringify(obj));


function activeItem(newItem) {
    
};

function init( list ) {
    list.forEach((item) => {
        let newItem = document.createElement("tr");
        newItem.innerHTML = `<td>${ item.title }</td><td class="content">${ item.content }</td>
            <i class="fa-solid fa-trash" onClick="this.parentElement.remove(); saveList()"></i>`;
        activeItem(newItem);

        document.querySelector(".general-items").appendChild(newItem);
    });
} init( JSON.parse(localStorage.getItem("items")) );


// Code to add new notes
{
    function addItem() {
        let value = document.querySelector(".createItem input").value;
        if (value.length < 1) return;
        init([ { "title": value, "content": "Temorary text, edit with the pen tool on the left" } ]);
        saveList();
    }
    
    document.querySelector(".createItem button").addEventListener("click", addItem);
    document.querySelector(".createItem input").addEventListener("change", addItem);
}

{
    document.querySelector(".openMenu").addEventListener("click", () => document.querySelector("nav").classList.toggle("closed") );
    
    document.querySelector(".lock").addEventListener("click", () => {
        let editable = new Boolean(document.querySelector(".title").getAttribute("contenteditable") == "false");
        document.querySelectorAll(".title, .desc").forEach((e) => e.setAttribute("contenteditable", editable.toString()));
        document.body.classList.toggle("locked");
    });
}


document.querySelectorAll("nav table tr:not(:has(th))")[0].click();


// Function to save everything and an autosave
{
    function saveList() {
        try {
            document.querySelector(".activeItem").firstElementChild.innerHTML = document.querySelector(".item .title").innerHTML;
            document.querySelector(".activeItem").querySelector(".content").innerHTML = document.querySelector(".item .desc").innerHTML;
        }
        catch (err) { location.reload(); }
    
        let items = [];
        document.querySelectorAll("nav table > tr, nav tbody > tr").forEach((tr) => {
            trItem = { title: "", content: "" };
            trItem.title = tr.firstElementChild.innerHTML;
            trItem.content = tr.querySelector(".content").innerHTML;
            items.push(trItem);
        });
    
        localStorage.setItem("items", JSON.stringify(items));
    }
    document.querySelectorAll(".title, .desc").forEach((e) => 
        e.addEventListener("input", () => { if (document.querySelector(".autoSave input").checked) saveList() }));
};


document.querySelectorAll(".general-items tr").forEach((e) => e.addEventListener("mousedown", () => {
    let hasHeldTooLong = false;
    setTimeout(() => hasHeldTooLong = true, 200);

    e.classList.add("moving");
    let position = e.getBoundingClientRect();
    function handleMouseMove() {
        e.setAttribute("style", `
            transform: translateY(${event.clientY - position.y - 18}px);
            z-index: +2; `);
    };

    function handleMouseUp() {
        document.removeEventListener("mousemove", handleMouseMove);

        let itemOver = e;
        let itemOverBy = 1000;
        document.querySelectorAll(".general-items tr").forEach((tr) => {
            let trDiff = tr.getBoundingClientRect().y - e.getBoundingClientRect().y;
            if (trDiff > 0 && trDiff < itemOverBy) {
                itemOver = tr;
                itemOverBy = trDiff;
            }
        });
        if (e == itemOver && e.parentElement.lastElementChild != e)
            e.parentElement.appendChild(e.parentNode.removeChild(e));

        else if (e != itemOver)
            e.parentElement.insertBefore(e.parentNode.removeChild(e), itemOver)

        e.removeAttribute("style");
        e.classList.remove("moving");

        if (!hasHeldTooLong) {
            document.querySelectorAll("nav tr").forEach((tr) => tr.classList.remove("activeItem"));
            e.classList.add("activeItem");

            document.querySelector(".item .title").innerHTML = document.querySelector(".activeItem").firstElementChild.innerHTML;
            document.querySelector(".item .desc").innerHTML = document.querySelector(".activeItem").querySelector(".content").innerHTML;
        }

        document.removeEventListener("mouseup", handleMouseUp);
        saveList();
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
}));



document.querySelectorAll("nav .createItem button").forEach((e) => {
    e.addEventListener("click", (evt) => {
        switch (evt.target.classList[0]) {
            case "import":
                let list;
                navigator.clipboard.readText()
                .then(text => { list = text })
                .catch(err => { list = prompt('Failed to read clipboard contents, paste your code under: ', err); });

                if (list.length <= 2) break;
                document.querySelectorAll(".general-items tr").forEach((tr) => tr.remove());
                init( JSON.parse( list ) );
            break;
            case "export":
                let items = [];
                document.querySelectorAll("nav table > tr, nav tbody > tr").forEach((tr) => {
                    trItem = { title: tr.firstElementChild.innerHTML, content: tr.lastElementChild.innerHTML };
                    items.push(trItem);
                });

                if (!navigator.clipboard)
                    alert("Copying failed, try to import to a different session manually with the following code: " + items);
                else {
                    navigator.clipboard.writeText(JSON.stringify(items))
                    alert("Copy successfull, go to a different session and hit import to get your list.");
                }
            break;
        };
    });
});

document.querySelectorAll(".editButtons button").forEach((e) => {
    e.addEventListener("click", () => {
        let newList;
        switch (e.classList[0]) {
            case "list":
                newList = document.createElement("ul");
                newList.innerHTML = `<li></li>`;
            break;
            case "numlist":
                newList = document.createElement("ol");
                newList.innerHTML = `<li></li>`;
            break;
            case "checklist":
                let c = document.querySelectorAll(".item .desc .input").length;
                newList = document.createElement("div");
                newList.innerHTML = `<input type="checkbox" id="box-${c}"><label for="box-${c}"> This is not checked</label>`;
                newList.firstElementChild.setAttribute("onClick", `this.hasAttribute("checked") 
                    ? this.removeAttribute("checked") : this.setAttribute("checked", true);`);
            break;
        }

        if (document.querySelector(".desc").lastElementChild.nodeName == "BR" || 
            (document.querySelector(".desc").lastElementChild.firstElementChild.nodeName == "BR" && 
            document.querySelector(".desc").lastElementChild.lastElementChild.nodeName == "BR")) {
                document.querySelector(".desc").lastElementChild.remove();
        };

        document.querySelector(".item .desc").appendChild(newList);
    })
});