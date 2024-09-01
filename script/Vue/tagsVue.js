class tagsVue {
    constructor(name, type, id) {
        this.name = name
        this.type = type
        this.id = id
    }
    createFilterTag() {
       return `
                        <article id="id-${this.id}" data-filterCat="${this.type}" class="selected-choice"><p class="tagname">${this.name}</p><i class="fa-solid fa-xmark"></i></article>
        `
    }
}