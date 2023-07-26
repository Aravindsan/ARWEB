var textBox  = document.getElementById('textBox');
var imgBox = document.getElementById('imgBox');
textBox.addEventListener('input', function() {
    document.getElementById('prevText').textContent = this.value;
});

var loadFile = function(event){
    imgBox.style.backgroundImage = "url(" + URL.createObjectURL(event.target.files[0])+ ")";
    imgBox.style.backgroundColor = "white";
}

const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img"),
resetFilterBtn = document.querySelector(".reset-filter");


let brightness=100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;


const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }else if(option.id === "inversion"){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});


rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left"){
            rotate -= 90;
        } else if(option.id === "right"){
            rotate += 90;
        } else if(option.id === "horizontal"){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});



const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id == "brightness"){
        brightness = filterSlider.value;
    } else if(selectedFilter.id == "inversion"){
        inversion = filterSlider.value;
    } else if(selectedFilter.id == "saturation"){
        saturation = filterSlider.value;
    }else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

const resetFilter = () => {
    brightness=100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilters();
}


const saveImage = () => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
  
    img.onload = function() {
      let width = img.width;
      let height = img.height;
  
      if (rotate === 90 || rotate === 270) {
        // Si l'image a été tournée de 90 ou 270 degrés, inversez les dimensions
        [width, height] = [height, width];
      }
  
      canvas.width = width;
      canvas.height = height;
  
      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180);
      }
      ctx.scale(flipHorizontal, flipVertical);
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
  
      const link = document.createElement("a");
      link.download = "image.jpg";
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    };
  
    img.src = previewImg.src;
  };


fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
