class App {
    constructor() {
        
        this.$recipeWrapper = document.querySelector('.recette-container')
        this.$filterWrapper = document.querySelector('.filter-section')
        this.$filteredWrapper = document.querySelector('.filtre-selected')
        this.recipeApi = new RecipeApi('../data/recipes.json')
        this.filteredTag= []
        this.result = []
        this.inputSearch= ""
        this.ingredients
        this.appliances
        this.ustensils
        this.recipes

    }
    dropdown() {

        const ingredients = document.querySelector("#ingredients")
        const appliances = document.querySelector("#appliances")
        const ustensils = document.querySelector("#ustensils")

        const dd1_chevron = document.getElementById("ingredients-chevron")
        const dd2_chevron = document.getElementById("appareils-chevron")
        const dd3_chevron = document.getElementById("ustensiles-chevron")


        ingredients.addEventListener("click", function () {
            dd1_chevron.classList.toggle("rotate180");
            if(dd2_chevron.classList.contains("rotate180")) {
                dd2_chevron.classList.remove("rotate180");
            } else if (dd3_chevron.classList.contains("rotate180")){
                dd3_chevron.classList.remove("rotate180");
            }
        });
        
        appliances.addEventListener("click", function () {
            dd2_chevron.classList.toggle("rotate180");
            if(dd1_chevron.classList.contains("rotate180")) {
                dd1_chevron.classList.remove("rotate180");
            } else if (dd3_chevron.classList.contains("rotate180")){
                dd3_chevron.classList.remove("rotate180");
            }
        });
        
        ustensils.addEventListener("click", function () {
            dd3_chevron.classList.toggle("rotate180");
            if(dd2_chevron.classList.contains("rotate180")) {
                dd2_chevron.classList.remove("rotate180");
            } else if (dd1_chevron.classList.contains("rotate180")){
                dd1_chevron.classList.remove("rotate180");
            }
        });
    }
    eventListenerOnTags(recipes){
        this.$filterWrapper.querySelectorAll('.dropdown-item').forEach( $item => {
            $item.addEventListener('click', e => {
                
                let selectedCat = e.target.getAttribute('data-belong')
                let selectedFilter = e.target.textContent
                const resultat = this.filteredTag.find((tag) => tag.name === selectedFilter);
                if (resultat == undefined){
                    this.filteredTag.push({type:selectedCat, id:this.filteredTag.length+1, name:selectedFilter})
                    let newTag = new tagsVue(selectedFilter, selectedCat, this.filteredTag.length)
                    document.querySelector('.filtre-selected').innerHTML += newTag.createFilterTag()
                }
                this.mainSearch(this.inputSearch, recipes, this.filteredTag)
            })    
        })
    }
    removeSearchInputValue(filterInput, filterSupp, recipes){
        filterSupp.addEventListener('click', ()=> {
            filterInput.value = '';
            this.mainSearch(filterInput.value, recipes, this.filteredTag)
        })
    }
    buildRecettesDOM(recipes, $recipeWrapper){
        this.$recipeWrapper.innerHTML = ""
        recipes.forEach(recipe => {
            var Template = new recipeCard(recipe)
            $recipeWrapper.appendChild(
                Template.createRecipeCard()
            )
        })
    }
    mainSearch(searchText, recipes, filteredTags) {
        let result = this.searchByText(searchText, recipes)
        result = this.searchByTags(filteredTags, result)
        this.buildRecettesDOM(result, this.$recipeWrapper)
        this.buildTags(result)
        this.buildNumberRecipe(result)
    }
    searchByText(searchText, recipes) {
        if(searchText.length >= 3 ){
            recipes = recipes.filter (
                (recipe) =>
                    recipe.name.toLowerCase().includes(searchText) ||
                    recipe.description.toLowerCase().includes(searchText) ||
                    recipe.ingredients.map((ingredients) => ingredients.ingredient).toString().toLowerCase().includes(searchText) ||
                    recipe.appliance.toLowerCase().includes(searchText) ||
                    recipe.ustensils.toString().toLowerCase().includes(searchText)
            )
        }
        if(recipes.length === 0){
            alert("Aucune recette avec cette recherche");
            return recipes
        } else {
            return recipes
        }
        
    }
    searchByTags(filteredTags, result){  
        if(filteredTags.length >= 1 ){
            for(let index = 0; index < filteredTags.length; index++){
                result = result.filter (
                    (recipe) => {

                        const tagsName = filteredTags[index].name.toLowerCase()
                        const searchMatchByIngredients = recipe.ingredients.map((ingredients) => ingredients.ingredient).toString().toLowerCase().includes(tagsName)
                        const searchMatchByAppliance = recipe.appliance.toLowerCase().includes(tagsName)
                        const searchMatchByUstensils = recipe.ustensils.toString().toLowerCase().includes(tagsName)
                        return searchMatchByIngredients  || searchMatchByAppliance || searchMatchByUstensils
                    }
                )
            }
            
        }
        return result
    
    }
    buildTags(result){
        const filtres = new Filters(result)
        this.ingredients = filtres.allIngredients
        let $allIngredients = new filterVueCard(this.ingredients, "Ingrédients")
        this.$filterWrapper.querySelector('#ingredients').innerHTML = $allIngredients.createFilterVueCard()
        this.searchFilterIngredient()

        this.appliances = filtres.allAppliances;
        let $allAppliances = new filterVueCard(this.appliances , "Appareils");
        this.$filterWrapper.querySelector('#appliances').innerHTML = $allAppliances.createFilterVueCard();
        this.searchFilterAppliances()
    
        this.ustensils = filtres.allUstensils;
        let $allUstensils = new filterVueCard(this.ustensils, "Ustensiles");
        this.$filterWrapper.querySelector('#ustensils').innerHTML = $allUstensils.createFilterVueCard();
        this.searchFilterUstensiles()

        this.eventListenerOnTags(result)
    }  
    removeTag(tag, recipes){
        const elementID = tag.id
        const idx = elementID.split('-')[1]
        this.filteredTag = this.filteredTag.filter((d) => d.id != idx)
        tag.remove()
        this.mainSearch(this.inputSearch, recipes, this.filteredTag)
    }
    buildNumberRecipe(result){
        const numberwrapper = document.querySelector(".recipeNumber")
        numberwrapper.innerHTML = result.length + " recettes"
        if(result.length === 1){
            numberwrapper.innerHTML = result.length + " recette"
        }
    }
    searchFilterIngredient(){
        let searchInputIngredient = document.querySelector('[data-filter="ingredients"] .form-control');
        searchInputIngredient.addEventListener("input", (event) => {
                document.querySelectorAll('ul[data-filter="ingredients"] li').forEach(e => e.remove())
                this.ingredients.filter((filter) => filter.toLowerCase().includes(event.target.value.toLowerCase()))
                .forEach(item => {
                        const $li = document.createElement("li")
                        const $a = document.createElement("a")
                        $a.classList.add("dropdown-item")
                        $a.setAttribute("data-belong", "ingredients")
                        $a.setAttribute("href", "#")
                        $a.textContent = item
                        $li.appendChild($a)
                        document.querySelector('ul[data-filter="ingredients"]').appendChild($li)
                })
        })
    }
    searchFilterAppliances(){
        let searchInputAppliances = document.querySelector('[data-filter="appareils"] .form-control');
        searchInputAppliances.addEventListener("input", (event) => {
                document.querySelectorAll('ul[data-filter="appareils"] li').forEach(e => e.remove())
                this.appliances.filter((filter) => filter.toLowerCase().includes(event.target.value.toLowerCase()))
                .forEach(item => {
                        const $li = document.createElement("li")
                        const $a = document.createElement("a")
                        $a.classList.add("dropdown-item")
                        $a.setAttribute("data-belong", "appareils")
                        $a.setAttribute("href", "#")
                        $a.textContent = item
                        $li.appendChild($a)
                        document.querySelector('ul[data-filter="appareils"]').appendChild($li)
                })
        })
    }
    searchFilterUstensiles(){
        let searchInputUstensiles = document.querySelector('[data-filter="ustensiles"] .form-control');
        searchInputUstensiles.addEventListener("input", (event) => {
                document.querySelectorAll('ul[data-filter="ustensiles"] li').forEach(e => e.remove())
                this.ustensils.filter((filter) => filter.toLowerCase().includes(event.target.value.toLowerCase()))
                .forEach(item => {
                        const $li = document.createElement("li")
                        const $a = document.createElement("a")
                        $a.classList.add("dropdown-item")
                        $a.setAttribute("data-belong", "ustensiles")
                        $a.setAttribute("href", "#")
                        $a.textContent = item
                        $li.appendChild($a)
                        document.querySelector('ul[data-filter="ustensiles"]').appendChild($li)
                })
        })
    }
    async main() {

        const recipeData = await this.recipeApi.getRecipe()
        const recipes = recipeData.map(recipe => new Recipe(recipe))

        const filterInput = document.querySelector('#search')
        const filterSupp = document.querySelector('.supp')

        this.buildRecettesDOM( recipes, this.$recipeWrapper)
        this.buildTags(recipes)


        // EventListener for searchBar
        filterInput.addEventListener('input', (event) => {
            this.inputSearch = event.target.value
            this.mainSearch(this.inputSearch, recipes, this.filteredTag)
        })

        // EventListener for tags
        this.eventListenerOnTags(recipes)



        // EventListener for searchBar supp
        filterSupp.addEventListener('click', (event) => {
            this.removeSearchInputValue(filterInput, filterSupp, recipes)
            this.mainSearch(this.inputSearch, recipes, this.filteredTag)
        })

        // EventListener for RemoveTags
        document.querySelector(".filtre-selected").addEventListener('click', (event) => {
            if(event.target.classList.contains('fa-xmark')){
                this.removeTag(event.target.closest(".selected-choice"), recipes)
                this.mainSearch(this.inputSearch, recipes, this.filteredTag)
            }
        })
    }
    

}

const app = new App()
app.main()


