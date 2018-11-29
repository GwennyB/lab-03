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

Animal.readJson = () => {
  $.get('data/page-1.json','json')
    .then(data => {
      data.forEach(animal => {
        let thisAnimal = new Animal(animal);
        Animal.pageOneAnimals.push(thisAnimal);
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
  Animal.pageOneAnimals.sort( (a,b) => a.title.localeCompare(b.title) )
  let keywordsList = ['Show All Animals'];
  Animal.pageOneAnimals.forEach( animal => {
    animal.render();
    if (!keywordsList.includes(animal.keyword)) {
      keywordsList.push(animal.keyword);
    }
  });
  Animal.makeList(keywordsList);
  Animal.keyFilter();
  Animal.sortAnimals();
  // Animal.pageSelect();
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
    $('section').hide();
    const chosen = [];
    let keyValue = $(this).val();
    console.log('keyvalue', keyValue);
    Animal.pageOneAnimals.forEach(animal => {
      if(animal.keyword === keyValue || keyValue === 'Show All Animals'){
        chosen.push(animal);
      }
    })
    console.log('chosen: ',chosen);
    chosen.forEach( animal => animal.render());
  });
};

Animal.sortAnimals = () => {
  $('.sortoptions').on('change',function(event){
    event.preventDefault();
    let sortValue = $(this).val();
    if(sortValue === 'horns') {
      Animal.pageOneAnimals.sort( (a,b) => a.horns-b.horns);
    } else {
      Animal.pageOneAnimals.sort( (a,b) => a.title.localeCompare(b.title) );
    }
    $('main').empty();
    let keywordsList = ['Show All Animals'];
    Animal.pageOneAnimals.forEach( animal => {
      animal.render();
      if (!keywordsList.includes(animal.keyword)) {
        keywordsList.push(animal.keyword);
      }
    });
  })
};



$(() => Animal.readJson());
