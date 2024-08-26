class filterVueCard {
    constructor(arrayOfFilter, type) {
        this.filters = arrayOfFilter;
        this.type = type;
    }

    searchFilterIngredient(){
        let searchInputIngredient = document.querySelector('[data-filter="ingredients"] .form-control');
        let filterList = document.querySelectorAll('[data-belong="ingredients"].dropdown-item')
        let finalFilterList = []
        console.log(filterList)

        searchInputIngredient.addEventListener("input", (event) => {
            if(event.target.value.length >= 1){
                finalFilterList = Object.values(filterList).filter( 
                    (filter) => {
                        console.log(filter)
                        const filterSelected = filter.innerText.toLowerCase().includes(event.target.value)
                        return filterSelected
                    }
                        
                )
                console.log(finalFilterList)
            }
        })
        filterList.innerHTML = ""
        filterList.innerHTML = finalFilterList
    }
    // searchFilterUstensils(){
    //     let searchInput = document.querySelector('.form-control');
    //     let filterList = document.querySelectorAll('.dropdown-item');
        
    //     searchInput.addEventListener("input", (event) => {
    //             if(event.target.value.length >= 1){
    //                 console.log(event.target.value)
    //                 console.log(filterList)
    //                 filterList = filterList.filter ((item) => item.name.toLowerCase().includes(event.target.value))
    //             }
    //     })
    // }
    // searchFilterAppliances(){
    //     let searchInput = document.querySelector('.form-control');
    //     let filterList = document.querySelectorAll('.dropdown-item');

    //     searchInput.addEventListener("input", (event) => {
    //         if(event.target.value.length >= 1){
    //             console.log(event.target.value)
    //             console.log(filterList)
    //             filterList = filterList.filter ((item) => item.name.toLowerCase().includes(event.target.value))
    //         }
    //     })
    // }



    createFilterVueCard() {

        let options = "";
        let typeOfFilter;

        switch (this.type)  {
            case "Ingrédients" : typeOfFilter = "ingredients" ;
            break;

            case "Appareils" : typeOfFilter = "appareils";
            break;

            case "Ustensiles" :typeOfFilter = "ustensiles" ;
            break;

        } 

        this.filters.forEach((filter) => {
            options += `<li><a data-belong="${typeOfFilter}" class="dropdown-item" href="#">${filter}</a></li>`
        });


       return `
                        <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">${this.type}
                            <i id="${typeOfFilter}-chevron" class="fa-solid fa-chevron-down"></i>
                        </button>
                        <ul data-filter="${typeOfFilter}" class="dropdown-menu">
                            <div class="search-container">
                                <input class="form-control" type="text" placeholder="">
                                <svg class="glass-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                    viewBox="0 0 14 14" fill="none">
                                    <circle cx="5" cy="5" r="4.75" stroke="#7A7A7A" stroke-width="0.5" />
                                    <line x1="9.17678" y1="9.32322" x2="13.6768" y2="13.8232" stroke="#7A7A7A" stroke-width="0.5" />
                                </svg>
                            </div>
                            ${options}
                        </ul>
        `
    }
}