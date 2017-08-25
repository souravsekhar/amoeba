"use string";

import Jimp from 'jimp';
import fs from 'fs';

// const imageConfig = {
//   large: {
//     dimensions:,
//     formats: {[
//         {
//           type: png,
//           quality:,
//         },
//         {
//           type: jpg,
//           quality:,
//         }
//     ]}
//   },
//   medium: {
//     dimensions:,
//     formats: {[
//           {
//             type: png,
//             quality:,
//           },
//           {
//             type: jpg,
//             quality:,
//           }
//       ]}
//   }
//   small: {
//     dimensions:,
//     formats: {[
//         {
//           type: png,
//           quality:,
//         },
//         {
//           type: jpg,
//           quality:,
//         }
//     ]}
//   }
// };

const imageProcessor = (imagePath) => {
  Jimp.read(imagePath, function (err, image) {
      console.log("image === ", JSON.stringify(image));
      if (err) throw err;
      var ratio=parseInt(image.imageSize.height)/parseInt(image.imageSize.width);
      console.log("ratio",ratio);
      image.resize(256, 256)            // resize
           .quality(60)                // set greyscale
           .write("./processedImages/processed_image.png"); // save
  });

};

module.exports = {
  imageProcessor: imageProcessor
};
