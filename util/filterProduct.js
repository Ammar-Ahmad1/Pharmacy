// // Filter Products By Filters

  
// export default (productList, filters) => {
//   let filteredList = [...productList];
//   for (const key in filters) {
//     if (key !== "price") {
//       if (
//         filters[key] === "featured" ||
//         filters[key] === "trending" ||
//         filters[key] === "lowToHigh" ||
//         filters[key] === "highToLow"
//       ) {
//         console.log("hi");
//         if (filters[key] === "lowToHigh") {
//             console.log("hi");
//           filteredList = [
//             ...filteredList.sort((a, b) => {
//               if (a.price < b.price) return -1;
//               if (a.price > b.price) return 1;
//             }),
//           ];
//         } else {
//           if (filters[key] === "highToLow") {
//             console.log("hi");
//             filteredList = [
//               ...filteredList.sort((a, b) => {
//                 if (b.price < a.price) return -1;
//                 if (b.price > a.price) return 1;
//               }),
//             ];
//           } else {
//             console.log("hi1");
//             filteredList = filteredList.filter((item) => item[filters[key]]);
//           }
//         }
//       } else {
//         filteredList = filterProductsByField(filteredList, key, filters[key]);
//         // filteredList = filterByKey(filteredList, filters[key], key);
//       }
//     } else {
//       filteredList = filterByPrice(filteredList, filters[key], key);
//     }
//   }
// //   console.log("filteredList", filteredList);
//   return filteredList;
// };

// // Filter Product By Price

// function filterByPrice(filteredList, price, key) {
//   let list = [];

//   for (let index = 0; index < filteredList.length; index++) {
//     const product = filteredList[index];
//     const productPrice = product[key];

//     if (productPrice >= price.min && productPrice <= price.max) {
//       list.push(product);
//     }
//   }

//   return (filteredList = list);
// }

// // Filter Product by key size/category/brand etc

// function filterByKey(filteredList, size, key) {
//   let list = [];
//   if (!size || size.length === 0) return filteredList;
//   for (let index = 0; index < filteredList.length; index++) {
//     const product = filteredList[index];

//     if (size.indexOf != undefined) {
//       const isOk = size && size.indexOf(product[key]);
//       if (isOk !== -1) {
//         list.push(product);
//       }
//     }
//   }
//   return (filteredList = list);
// }
// function filterProductsByField(products, field, value) {
    
//     return products.filter(product => {
//       // Check if the product has the specified field and its value matches the provided value
//       return product[field] === value;
//     });
//   }

// Filter Products By Filters
export default (productList, filters) => {
    let filteredList = [...productList];
    let templist = [...productList];
  
    for (const key in filters) {
      if (key !== "price") {
        if (
          filters[key] === "featured" ||
          filters[key] === "trending" ||
          filters[key] === "lowToHigh" ||
          filters[key] === "highToLow"
        ) {
            console.log("hi");
          if (filters[key] === "lowToHigh") {
            filteredList = [
              ...filteredList.sort((a, b) => a.price - b.price),
            ];
          } else if (filters[key] === "highToLow") {
            filteredList = [
              ...filteredList.sort((a, b) => b.price - a.price),
            ];
          } else {
            console.log("hi1");
            const filteredProducts = filteredList.filter((item) => item[filters[key]]);
          // Only update filteredList if filteredProducts is not empty
          if (filteredProducts.length > 0) {
            filteredList = filteredProducts;
          }
          }
        } else {
            
          const filteredProducts = filterProductsByField(filteredList, key, filters[key]);
          // Only update filteredList if filteredProducts is not empty
          if (filteredProducts.length > 0) {
            filteredList = filteredProducts;
          }
        }
      } else {
        // Use filterByPrice for price filtering
        console.log("hi3");
        const filteredProducts = filterByPrice(filteredList, filters[key]);
        console.log("filteredProducts", filteredProducts)
        // Only update filteredList if filteredProducts is not empty
        if (filteredProducts.length > 0) {
            filteredList = filteredProducts;
            }
      }
    }
    return filteredList;
  };
  
  // Filter Product By Price
  function filterByPrice(filteredList, priceFilter) {
    console.log("priceFilter", filteredList)
    return filteredList.filter((product) => {
      const productPrice = parseFloat(product.price); // Assuming price is a string, convert it to a number
      return productPrice >= priceFilter.min && productPrice <= priceFilter.max;
    });
  }
  
  // Filter Product by key size/category/brand etc
  function filterProductsByField(filteredList, key, value) {
    return filteredList.filter((product) => {
      return product[key] === value;
    });
  }
  