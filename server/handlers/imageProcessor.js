"use string";

import Jimp from 'jimp';
import fs from 'fs';

// predefined image configuration
const imageConfig = {
  "large": {
    "dimensions": {
      "height": 1000,
      "width": 1000
    },
    "formats": [
        {
          "type": "png",
          "quality": 99
        },
        {
          "type": "jpg",
          "quality": 60
        }
    ]
  },
  "medium": {
    "dimensions": {
      "height": 700,
      "width": 700
    },
    "formats": [
          {
            "type": "png",
            "quality": 99
          },
          {
            "type": "jpg",
            "quality": 60
          }
      ]
  },
  "small": {
    "dimensions": {
      "height": 200,
      "width": 200
    },
    "formats": [
        {
          "type": "png",
          "quality": 99
        },
        {
          "type": "jpg",
          "quality": 60
        }
    ]
  }
}

const imageProcessor = (imagePath, imageName) => {
  Jimp.read(imagePath, function (err, image) {// reading the uploaded file    
    if (err) return err;

    for (let size in imageConfig) {      

        let height = imageConfig[size].dimensions.height;
        let width = imageConfig[size].dimensions.width;
        let fileName = imageName.substring(0, imageName.indexOf('.'));

        imageConfig[size].formats.forEach((format) => {          
          switch (format.type) {
            case 'png':
              image.resize(height, width)
                   .rgba(true) 
                   .filterType( Jimp.PNG_FILTER_AUTO )
                   .write(`./uploads/${size}/PNG/processed_image_${fileName}_png_${size}.png`);
              break;
            case 'jpg':
              image.resize(height, width)
                   .quality(format.quality)
                   .write(`./uploads/${size}/JPG/processed_image_${fileName}_jpg_${size}.jpg`);
              break;            
          }
      });                
    }
  });        
}

module.exports = {
  imageProcessor: imageProcessor
};
