let ingredList=document.querySelector("#pantryList");
let subButton=document.querySelector("#submitButton");
let edButton=document.querySelector("#editButton");
let itName=document.querySelector("#itemName");
let quant=document.querySelector("#quantity");
let expir=document.querySelector("#expiration");
let cat=document.querySelector("#category");
let expirDetails=document.querySelector("#expirDetails");
let fridgeRadio = document.getElementById('fridge');
let freezerRadio = document.getElementById('freezer');
let shelfRadio = document.getElementById('shelf');
let names="";
let qu=0;
let exp="";
let cate="";
let loco="";
let pantry=[];
let editFoodId="";

const closeButton = document.getElementsByClassName("close")[0];
closeButton.onclick = function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none"; 
};

window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none"; 
    }
};

// clear the fields after adding
subButton.addEventListener("click", function(){
    let data = new FormData();
    data.append("name",itName.value);
    data.append("quantity",quant.value);
    data.append("expiration",expir.value);
    data.append("category",category.value);

    if (!itName.value) {
        itName.style.backgroundColor="#D97059";
        return;
    }
    if (!quant.value || isNaN(quant.value) || quant.value <= 0) {
        quant.style.backgroundColor="#D97059";
        return;
    }
    if (!expir.value) {
        expir.style.backgroundColor="#D97059";
        return;
    }
    if (!category.value) {
        category.style.backgroundColor="#D97059";
        return;
    }
    data.append("storageLocation",document.querySelector('input[name="storage"]:checked').value);
    fetch(`https://reimagined-computing-machine-9v4qrwjr9gjcxg5w-3000.app.github.dev/foods`, {
        method: "POST",
        body:data
    }).then(function (response){
        loadPantry();    
    });

    itemName.value="";
    quant.value="";
    expir.value="";
    category.value="";

})


edButton.addEventListener("click", function(){
    let data = new FormData();
    data.append("name",itName.value);
    data.append("quantity",quant.value);
    data.append("expiration",expir.value);
    data.append("category",category.value);
    data.append("storageLocation",document.querySelector('input[name="storage"]:checked').value);
    fetch(`https://reimagined-computing-machine-9v4qrwjr9gjcxg5w-3000.app.github.dev/foods/${editFoodId}`, {
        method: "PUT",
        body:data
    }).then(function (response){
        loadPantry();    
    });

    itemName.value="";
    quant.value="";
    expir.value="";
    category.value="";
    subButton.style.display="block";

})


function deleteFood(foodId){
    console.log("delete button pushed ", foodId);
    fetch(`https://reimagined-computing-machine-9v4qrwjr9gjcxg5w-3000.app.github.dev/foods/${foodId}`, {
        method: "DELETE"
    }).then(function (response){
        loadPantry();
    })
}


function getSingle(fooId){
    let upData={};
    fetch(`https://reimagined-computing-machine-9v4qrwjr9gjcxg5w-3000.app.github.dev/foods/${fooId}`, {
        method: "GET"
    }).then(function (response){
        response.json().then(function (data){
            upData["_id"]=data[0]._id;
            upData["name"]=data[0].name;
            upData["quantity"]=data[0].quantity;
            upData["expiration"]=data[0].expiration;
            upData["category"]=data[0].category;
            upData["storageLocation"]=data[0].storageLocation;
        })
    })
    return upData;

}


function loadPantry(){
    edButton.style.display="none";
    fetch("https://reimagined-computing-machine-9v4qrwjr9gjcxg5w-3000.app.github.dev/foods").then(function (response){
        response.json().then(function(data) {
            console.log("data",data);
            pantry = data;

            pantryList.innerHTML = "";

            expirDetails.innerHTML="";
            
            // generate expriing soon
            let expiDiv=document.createElement("div");
            expiDiv.classList.add("ingred-card");

            let expirTitle=document.createElement("h2");
            expirTitle.textContent= pantry[0].name;
            expiDiv.appendChild(expirTitle);

            let expirDate=document.createElement("h2");
            let yes=false;
            let expiring={};
            for (let fo of pantry){
                if ((new Date(fo.expiration) > new Date()) && (!yes)){
                    
                    expiring=fo;
                    let soonE=new Date(fo.expiration);
                    expirDate.textContent= soonE.toLocaleDateString("en-US");
                    yes = true;
                }
            }
            expiDiv.appendChild(expirDate);

            expiDiv.addEventListener("click", function(){

                let modalBigDiv = document.querySelector("#modalBigDiv");
                const modal = document.getElementById("myModal");
                const modalTitle = document.getElementById("modalTitle");
        
                const modalContent = document.getElementById("modalContent");

                modalBigDiv.innerHTML = ""; 

                modalTitle.textContent=expiring.name;

                let modalList=document.createElement("ul");

                let newLi1=document.createElement("li");
                    newLi1.textContent="Quantity: " + expiring.quantity;
                    modalList.appendChild(newLi1);

                    let newLi2=document.createElement("li");
                    newLi2.textContent= "Expiration Date:" + expiring.expiration;
                    modalList.appendChild(newLi2);

                    let newLi3=document.createElement("li");
                    newLi3.textContent="Category: " + expiring.category;
                    modalList.appendChild(newLi3);

                    let newLi4=document.createElement("li");
                    newLi4.textContent="Storage Location: " + expiring.storageLocation;
                    modalList.appendChild(newLi4);

                modalBigDiv.appendChild(modalList);
                modal.style.display = "block";
            })

            expirDetails.appendChild(expiDiv);


            // generate big list
            for (let ingred of data){
                let ingredDiv=document.createElement("div");
                ingredDiv.classList.add("ingred-card");

                let nameH2=document.createElement("h2");
                nameH2.textContent=ingred.name;
                ingredDiv.appendChild(nameH2);

                let date=new Date();
                let expirDate=new Date(ingred.expiration);

                let infos=document.createElement("h3");
                if (expirDate < date){
                    infos.textContent="EXPIRED";
                }else{
                    
                    infos.textContent="Expiration Date: " + expirDate.toLocaleDateString("en-US");
                }

                let loca=document.createElement("h3");
                loca.textContent="Storage Location: " + ingred.storageLocation;
                ingredDiv.appendChild(infos);
                ingredDiv.appendChild(loca);

                ingredDiv.addEventListener("click", function(){
                    
                    let modalBigDiv = document.querySelector("#modalBigDiv");
                    const modal = document.getElementById("myModal");
                    const modalTitle = document.getElementById("modalTitle");
            
                    const modalContent = document.getElementById("modalContent");

                    modalBigDiv.innerHTML = ""; 

                    modalTitle.textContent=ingred.name;

                    let iconsDiv=document.createElement("div");
                    let deleteSpan=document.createElement("span");
                    deleteSpan.classList.add("material-symbols-outlined");
                    deleteSpan.textContent="delete";
                    deleteSpan.addEventListener("click", function(){
                        if (confirm("Are you sure you want to delete this food?")){
                            modal.style.display="none";
                            deleteFood(ingred._id); 
                        }
                    })
                    iconsDiv.appendChild(deleteSpan);

                    let editSpan=document.createElement("span");
                    editSpan.classList.add("material-symbols-outlined");
                    editSpan.textContent="edit_square";
                    editSpan.addEventListener("click", function (){
                        editFoodId=ingred._id;
                        modal.style.display = "none";
                        itName.value=ingred.name;
                        quant.value=ingred.quantity;
                        cat.value=ingred.category;
                        expir.value=new Date(expirDate).toISOString().split("T")[0];
                        if (ingred.storageLocation == "Shelf"){
                            shelfRadio.checked=true;
                        }else if (ingred.storageLocation == "Fridge"){
                            fridgeRadio.checked=true;
                        }else{
                            freezerRadio.checked=true;
                        }
                        subButton.style.display="none";
                        edButton.style.display="block";

                    })
                    iconsDiv.appendChild(editSpan);

                    modalBigDiv.appendChild(iconsDiv);

                    let modalList=document.createElement("ul");
                        
                    let newLi1=document.createElement("li");
                    newLi1.textContent="Quantity: " + ingred.quantity;
                    modalList.appendChild(newLi1);

                    let newLi2=document.createElement("li");
                    newLi2.textContent= "Expiration Date:" + expirDate.toLocaleDateString("en-US");
                    modalList.appendChild(newLi2);

                    let newLi3=document.createElement("li");
                    newLi3.textContent="Category: " + ingred.category;
                    modalList.appendChild(newLi3);

                    let newLi4=document.createElement("li");
                    newLi4.textContent="Storage Location: " + ingred.storageLocation;
                    modalList.appendChild(newLi4);

                    modalBigDiv.appendChild(modalList);
                    modal.style.display = "block";
                })

                ingredList.appendChild(ingredDiv);
                
            }

        });
    })
}


loadPantry();

