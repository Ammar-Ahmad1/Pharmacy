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
        const filteredProducts = filterByPrice(filteredList, filters[key]);
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
  