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
    removeFilteredTag(id, event) {
        console.log("removeFilteredTag id", id)
        const elementID = event.currentTarget.closest(".selected-choice").id
        const idx = elementID.split('-')[1]
        this.filteredTag = this.filteredTag.filter((d) => d.id != idx)
        event.currentTarget.closest(".selected-choice").remove()
        this.filter(filteredTag, recipes, filteredRecipes)

    }

    createFilteredTag(tag, cat, id) {
        console.log("createFilteredTag id", id)
        let $selectedTag = `<article id="id-${id}" data-filterCat="${cat}" class="selected-choice"><p>${tag}<i class="fa-solid fa-xmark"></i></p></article>`
        document.querySelector('.filtre-selected').innerHTML += $selectedTag
        console.log(document.querySelector(`#id-${id}`))
        document.querySelector(`#id-${id} i`).addEventListener('click', (event) => {
            this.removeFilteredTag(`id-${id}`, event)
        })
    }

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

        // filter
        const filtres = new Filters(recipes);
        this.ingredients = filtres.allIngredients;
        let $allIngredients = new filterVueCard(this.ingredients, "Ingrédients");
        this.$filterWrapper.querySelector('#ingredients').innerHTML = $allIngredients.createFilterVueCard();

        this.appliances = filtres.allAppliances;
        let $allAppliances = new filterVueCard(this.appliances , "Appareils");
        this.$filterWrapper.querySelector('#appliances').innerHTML = $allAppliances.createFilterVueCard();
    
        this.ustensils = filtres.allUstensils;
        let $allUstensils = new filterVueCard(this.ustensils, "Ustensiles");
        this.$filterWrapper.querySelector('#ustensils').innerHTML = $allUstensils.createFilterVueCard();

        // filtered TAG
        
        this.$filterWrapper.querySelectorAll('.dropdown-item').forEach( $item => {
            $item.addEventListener('click', e => {
                let selectedCat = e.target.getAttribute('data-belong')
                let selectedFilter = e.target.textContent
                const resultat = this.filteredTag.find((tag) => tag.name === selectedFilter);
                if (resultat == undefined){
                    this.filteredTag.push({type:selectedCat, id:this.filteredTag.length+1, name:selectedFilter})
                    this.createFilteredTag(selectedFilter, selectedCat, this.filteredTag.length)
                    this.filter(this.filteredTag, recipes, this.filteredRecipes)
                }
                this.$recipeWrapper.innerHTML = ""
                this.filteredRecipes.forEach(recipe => {
                    var template = new recipeCard(recipe)
                    this.$recipeWrapper.appendChild(
                        template.createRecipeCard()
                    )
                })
                
                // recipes.forEach(recipe => {
                //     for(let i = 0; i <this.filteredTag.length; i++){
                //         if (recipe.ustensils.indexOf(selectedFilter) != -1) {
                //             this.filteredRecipes.push(recipe);
                //             console.log(this.filteredRecipes)
                //             this.$recipeWrapper.innerHTML = ""
                //             this.filteredRecipes.forEach(recipe => {
                //                 const galery = new recipeCard(recipe)
                //                 this.$recipeWrapper.appendChild(galery.createRecipeCard())
                //             })
                //         }
                //     }
                    
                // })
                // if(this.filteredTag.length > 1){
                //     this.filteredRecipes.forEach(recipe => {
                //         if (recipe.ustensils.indexOf(selectedFilter) != -1) {
                //             this.filteredRecipes.length = 0
                //             console.log(this.filteredrecipes)
                //             this.filteredRecipes.push(recipe);
                //             console.log(this.filteredrecipes)
                //             this.$recipeWrapper.innerHTML = ""
                //             this.filteredRecipes.forEach(recipe => {
                //                 const galery = new recipeCard(recipe)
                //                 this.$recipeWrapper.appendChild(galery.createRecipeCard())
                //             })
                //         }
                //     })
                // }
            })    
            })
        this.dropdown()

    }
    

}

const app = new App()

app.main()


