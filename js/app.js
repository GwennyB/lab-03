'use strict';

function Animal(animal) {
  this.image_url = animal.image_url;
  this.title = animal.title;
  this.description = animal.description;
  this.keyword = animal.keyword;
  this.horns = animal.horns;
  this.page = 0;
}
Animal.pageOneAnimals = [];
Animal.pageTwoAnimals = [];
Animal.allAnimals = [];

Animal.readJson = () => {
  $.get('data/page-1.json','json')
    .then(data => {
      data.forEach(animal => {
        let thisAnimal = new Animal(animal);
        Animal.pageOneAnimals.push(thisAnimal);
        Animal.allAnimals = Animal.pageOneAnimals;
      })
    })
  $.get('data/page-2.json','json')
    .then(data => {
      data.forEach(animal => {
        let thisAnimal = new Animal(animal);
        Animal.pageTwoAnimals.push(thisAnimal);
      })
    })
    .then(Animal.loadAnimals)
};

Animal.loadAnimals = () => {
  Animal.allAnimals.sort( (a,b) => a.title.localeCompare(b.title) )
  let keywordsList = ['Show All Animals'];
  Animal.allAnimals.forEach( animal => {
    animal.render();
    if (!keywordsList.includes(animal.keyword)) {
      keywordsList.push(animal.keyword);
    }
  });
  Animal.makeList(keywordsList);
  Animal.keyFilter();
  Animal.sortAnimals();
  Animal.pageSelect();
};

Animal.prototype.toHtml = function() {
  // STEP 1: Get the template from the HTML document
  const $template = $('#animal-template').html(); // for coder recognition that expected value is a jQuery object
  // STEP 2: compile the template to regular HTML
  const $source = Handlebars.compile($template); // fill blank Handlebars template with actual template
  // STEP 3: return the compiled template
  return $source(this); // allows chaining with template as 'this'
};

Animal.prototype.render = function() {
  $('main').append(this.toHtml());
}

Animal.makeList = function(keywordsList) {
  keywordsList.forEach ( animal => {
    $('.keyfilter').append('<option class="clone"></option>');
    $('option[class="clone"]').text(animal);
    $('option[class="clone"]').val(animal);
    $('option[class="clone"]').removeClass('clone');
  })
};

Animal.keyFilter = () => {
  $('.keyfilter').on('change',function(event){
    event.preventDefault();
    $('main').empty();
    const chosen = [];
    let keyValue = $(this).val();
    Animal.allAnimals.forEach(animal => {
      if(animal.keyword === keyValue || keyValue === 'Show All Animals'){
        chosen.push(animal);
      }
    })
    chosen.forEach( animal => animal.render());
  });
};

Animal.sortAnimals = () => {
  $('.sortoptions').on('change',function(event){
    event.preventDefault();
    let sortValue = $(this).val();
    if(sortValue === 'horns') {
      Animal.allAnimals.sort( (a,b) => a.horns-b.horns);
    } else {
      Animal.allAnimals.sort( (a,b) => a.title.localeCompare(b.title) );
    }
    $('main').empty();
    let keywordsList = ['Show All Animals'];
    Animal.allAnimals.forEach( animal => {
      animal.render();
      if (!keywordsList.includes(animal.keyword)) {
        keywordsList.push(animal.keyword);
      }
    });
  })
};

Animal.pageSelect = () => {
  $('.prev').on('click', function(event) {
    event.preventDefault();
    Animal.allAnimals = Animal.pageOneAnimals;
    $('main').empty();
    Animal.loadAnimals();
  })
  $('.next').on('click', function(event) {
    event.preventDefault();
    Animal.allAnimals = Animal.pageTwoAnimals;
    $('main').empty();
    Animal.loadAnimals();
  })

};

$(() => Animal.readJson());
