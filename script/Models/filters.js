class Filters {
    constructor(data) {
        this.allIngredients = [];
        this.allAppliances = [];
        this.allUstensils = [];
        this.recipesSelected;

        data.forEach(recipe => {
            if (this.allAppliances.indexOf(recipe.appliance) == -1) {
                this.allAppliances.push(recipe.appliance); 
            }  
            
            recipe.ustensils.forEach(ustensil => {
                if (this.allUstensils.indexOf(ustensil) == -1) {
                    this.allUstensils.push(ustensil);
                }
            })

            recipe.ingredients.forEach(ingredient => {
                if (this.allIngredients.indexOf(ingredient.ingredient) == -1) {
                    this.allIngredients.push(ingredient.ingredient);
                }
            });

        });

    }

}