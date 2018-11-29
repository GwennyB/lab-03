'use strict';

function Animal(animal) {
  this.image_url = animal.image_url;
  this.title = animal.title;
  this.description = animal.description;
  this.keyword = animal.keyword;
  this.horns = animal.horns;
}

Animal.allAnimals = [];

Animal.readJson = () => {
  $.get('data/page-1.json','json')
    .then(data => {
      data.forEach(animal => {
        let thisAnimal = new Animal(animal);
        Animal.allAnimals.push(thisAnimal);
      })
    })
    .then(Animal.loadAnimals)
};

Animal.loadAnimals = () => {
  let keywordsList = ['Show All Animals'];
  Animal.allAnimals.forEach( animal => {
    animal.render();
    if (!keywordsList.includes(animal.keyword)) {
      keywordsList.push(animal.keyword);
    }
  });
  Animal.makeList(keywordsList);
  Animal.keyFilter();
};

Animal.prototype.render = function() {
  $('main').append('<section class="clone"></section>');
  let animalClone = $('section[class="clone"]');
  let animalHtml = $('#photo-template').html();
  animalClone.html(animalHtml);

  animalClone.find('h2').text(this.title);
  animalClone.find('img').attr('src', this.image_url);
  animalClone.find('p').text(this.description);
  animalClone.removeClass('clone');
  animalClone.attr('class', this.keyword);
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
    Animal.clearRender();
    const chosen = [];
    let keyValue = $(this).val();
    console.log('keyvalue', keyValue);
    Animal.allAnimals.forEach(animal => {
      if(animal.keyword === keyValue || keyValue === 'Show All Animals'){
        chosen.push(animal);
      }
    })
    chosen.forEach( animal => animal.render());
  });
};

Animal.clearRender = () => {
  $('section').hide();
};


$(() => Animal.readJson());
