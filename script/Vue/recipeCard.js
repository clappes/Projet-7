class recipeCard {
    constructor(recipe) {
        this.recipe = recipe
    }

    createRecipeCard() {
        let allIngredients ="";

        this.recipe.ingredients.forEach(ingredient => {

            if (ingredient.quantity && ingredient.unit) {
                if (ingredient.unit == "grammes") {
                    ingredient.unit = "g";
                }
                allIngredients+=`<li> ${ingredient.ingredient} <span>${ingredient.quantity} ${ingredient.unit} </span> </li>`;
            } else if (ingredient.quantity) {
                
                allIngredients+=`<li> ${ingredient.ingredient} <span>${ingredient.quantity}</span> </li>`;
            } else {
                allIngredients+=`<li> ${ingredient.ingredient}</li>`;
            }
        });

        const $wrapper = document.createElement('article')
        $wrapper.classList.add('card')

        const recipeCard = `
        <div class="card_img">
            <img src="../Images/${this.recipe.image}" alt="limonade de coco" width="380" height="253">
            <span class="duree">${this.recipe.time}min</span>
        </div>
        <div class="info-card">
            <h2>${this.recipe.name}</h2>
            <div class="recette">
                <h3 class="text-uppercase">Recette</h3>
                <p>${this.recipe.description}</p>
            </div>
            <div class="ingredient">
                <h3 class="text-uppercase">Ingrédient</h3>
                <ul>
                    ${allIngredients}
                </ul>
            </div>
        </div>
        
        `
        
        $wrapper.innerHTML = recipeCard
        return $wrapper
    }
}