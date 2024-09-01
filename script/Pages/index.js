class App {
    constructor() {
        
        this.$recipeWrapper = document.querySelector('.recette-container')
        this.$filterWrapper = document.querySelector('.filter-section')
        this.$filteredWrapper = document.querySelector('.filtre-selected')
        this.recipeApi = new RecipeApi('../data/recipes.json')
        this.filteredTag= []
        this.filteredRecipes = []
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
    // removeFilteredTag(id, event) {
    //     console.log("removeFilteredTag id", id)
    //     const elementID = event.currentTarget.closest(".selected-choice").id
    //     const idx = elementID.split('-')[1]
    //     this.filteredTag = this.filteredTag.filter((d) => d.id != idx)
    //     event.currentTarget.closest(".selected-choice").remove()
    //     this.filter(filteredTag, recipes, filteredRecipes)
    // }

    filter(filteredTag, recipes, filteredRecipes) {
        filteredRecipes.length = 0
        for(let indexAllRecipes = 0; indexAllRecipes < recipes.length; indexAllRecipes++){
          let recipeHasAllUstensils = true;
          for(let indexUstensils = 0; indexUstensils < filteredTag.length; indexUstensils++){
            if (!recipes[indexAllRecipes].ustensils.includes(filteredTag[indexUstensils].name)) {
              recipeHasAllUstensils = false;
              break;
            }
          }
          if (recipeHasAllUstensils) {
            filteredRecipes.push(recipes[indexAllRecipes]);
          }
        }
    }
    // displayFilteredRecipes(filteredRecipes, $recipeWrapper) {
    //     filteredRecipes.forEach(recipe => {
    //         var Template = new recipeCard(recipe)
    //         $recipeWrapper.appendChild(
    //             Template.createRecipeCard()
    //         )
    //     })
    // }
      

    async main() {

        const recipeData = await this.recipeApi.getRecipe()
        const recipes = recipeData.map(recipe => new Recipe(recipe))

        // Generation recipe
        recipes.forEach(recipe => {
            var Template = new recipeCard(recipe)
            this.$recipeWrapper.appendChild(
                Template.createRecipeCard()
            )
        })


        let deleteTag = document.createElement("i")
        deleteTag.innerText = ""
        deleteTag.className = "fa-solid fa-xmark"
        deleteTag.addEventListener("click", (event) => {
            event.currentTarget.closest(".selected-choice").remove()
        })


        // filter
        const filtres = new Filters(recipes);
        this.ingredients = filtres.allIngredients;
        let $allIngredients = new filterVueCard(this.ingredients, "Ingrédients");
        this.$filterWrapper.querySelector('#ingredients').innerHTML = $allIngredients.createFilterVueCard();

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


