import Layout from "../layout/Layout";
import React, { useState, useEffect } from "react";
import ImageUpload from "../elements/ImageUpload";

function Account() {

  // displaying slug
  const [name, setName] = useState("");
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // selecting category
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = ["Anti Infective", "Anti Epileptic", "Anti Depressant", "Alimentary Tract & Metabolism", "Cardio vascular System", "Dermatologicals", "Eyes , Nose , Ear", "Prescription Drugs", "Sensory Organs", "Others"];


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    setSelectedCategory(e.target.value);
  }

  // selecting type
  const [type, setType] = useState("");
  const types = ["Tablets", "Capsules", "Syrups", "Suspensions", "Injections", "Creams/Ointments/Gels", "Patches", "Suppositories", "Eye Drops", "Ear Drops/Nasal Sprays/Inhalers", "Oral", "Nebulizers"];

  const handleTypeSelect = (type) => {
    setType(type);
  };

  const handleInputType = (e) => {
    setType(e.target.value)
  }


  // adding and removing tags
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  const handleInputSalt = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue.trim()]);
      setInputValue(""); // Clear the input field
    }
  };

  const handleRemoveTag = (e, index) => {
    e.preventDefault()
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // discount

  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleDiscount = (e) => {
    setDiscount(e.target.value);
  }

  const calculateDiscountedPrice = () => {
    if (!price || !discount) {
      return 'Enter both price and discount';
    }

    const discounted = (price * discount) / 100;
    const discountedPrice = price - discounted;

    return `Discounted Price PKR: ${discountedPrice.toFixed(2)}`;
  }


  // strip (include tablets in a single strip & strips in a pack)

  const [medicineStrips, setMedicineStrips] = useState([]);
  // State variables for input fields
  const [tabletsOnStrip, setTabletsOnStrip] = useState('');
  const [stripsInBox, setStripsInBox] = useState('');

  // Function to handle adding a new medicine strip
  const handleAddMedicineStrip = (e) => {
    e.preventDefault()
    if (tabletsOnStrip && stripsInBox) {
      const newMedicineStrip = {
        tabletsOnStrip: parseInt(tabletsOnStrip, 10),
        stripsInBox: parseInt(stripsInBox, 10),
      };

      setMedicineStrips([...medicineStrips, newMedicineStrip]);

      // Clear input fields
      setTabletsOnStrip('');
      setStripsInBox('');
    }
  };


  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="AddItem">
        <div className="page-content pt-150 pb-150" id="addItem">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 m-auto">
                <div className="row">
                  <div className="col-md-9">
                    <div className="tab-content account dashboard-content pl-50">
                      <div>
                        <div className="card">
                          <div className="card-header">
                            <h5>Add New Item</h5>
                          </div>
                          <div className="card-body">
                            <form method="post" name="enq">
                              <div className="row">
                                <div className="form-group col-md-12">
                                  <label>Item Name <span className="required">*</span></label>
                                  <input
                                    required
                                    className="form-control"
                                    name="name"
                                    type="text"
                                    onChange={handleNameChange}
                                  />
                                  <p>item slug: <span className="fw-bold">{slug}</span></p>
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Company Name <span className="required">*</span></label>
                                  <input required="" className="form-control" name="Company" />
                                </div>

                                <div className="form-group flex col-md-12">
                                  <label>Category <span className="required">*</span></label>
                                  <div className="dropdown col-md-2 ms-2">
                                    <button
                                      className="btn dropdown-toggle submit font-weight-bold"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {selectedCategory || "Select Category"}
                                    </button>
                                    <ul className="dropdown-menu">
                                      {categories.map((category) => (
                                        <li key={category}>
                                          <p className="dropdown-item" onClick={() => handleCategorySelect(category)}>
                                            {category}
                                          </p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="form-group col-md-12">
                                  <div className="d-flex col-md-6">
                                    <input
                                      type="text"
                                      value={inputValue}
                                      onChange={handleInputSalt}
                                      placeholder={"Add tags"}
                                    />
                                    <button onClick={handleAddTag} className="btn submit font-weight-bold ms-2 ">Add</button>
                                  </div>
                                  <ul className="d-flex me-2">
                                    {items.map((item, index) => (
                                      <li key={index} className="rounded border ps-2 py-1 mt-2 me-2">
                                        {item}
                                        <button onClick={(e) => handleRemoveTag(e, index)} className="btn mx-1 px-2 py-0 submit font-weight-bold">x</button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <ImageUpload />
                                <div className="form-group col-md-12 mt-3">
                                  <label>Salt <span className="required">*</span></label>
                                  <input required="" className="form-control" name="salt" />
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Usage <span className="required">*</span></label>
                                  <input required="" className="form-control" name="use" />
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Side Effect <span className="required">*</span></label>
                                  <textarea required="" className="form-control" name="SideEffect" />
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Price <span className="required">*</span></label>
                                  <span> (in PKR) <input type="number" required="" onChange={handlePrice} className="form-control price" name="price" /></span>
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Discount (in %) <span className="required">*</span></label>
                                  <input type="number" required="" className="form-control" name="discount" onChange={handleDiscount} />
                                  <p>discounted price: <span className="fw-bold">{calculateDiscountedPrice()}</span></p>
                                </div>

                                <div className="form-group flex col-md-12">
                                  <label>type <span className="required">*</span></label>
                                  <div className="dropdown col-md-2 ms-2">
                                    <button
                                      className="btn dropdown-toggle submit font-weight-bold"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {type || "Select type"}
                                    </button>
                                    <ul className="dropdown-menu">
                                      {types.map((type) => (
                                        <li key={type}>
                                          <p className="dropdown-item" onClick={() => handleTypeSelect(type)}>
                                            {type}
                                          </p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Stock <span className="required">*</span></label>
                                  <input type="number" required="" className="form-control" name="stock" />
                                </div>


                                <div className="form-group col-md-5">
                                  <label className="form-check-label">Featured (make item featured on front page banner) <span className="required">*</span></label>
                                  <input type="checkbox" required="" className="w-25" name="featured" />
                                </div>

                                <div className="container mt-4">
                                  <label className="form-check-label">Medicine Strips <span className="required">*</span></label>
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Tablets on Strip:</label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          value={tabletsOnStrip}
                                          onChange={(e) => setTabletsOnStrip(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Strips in Box:</label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          value={stripsInBox}
                                          onChange={(e) => setStripsInBox(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <button className="btn btn-fill-out submit font-weight-bold" onClick={handleAddMedicineStrip}>
                                        Add
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mb-3">
                                    <ul>
                                      {medicineStrips.map((strip, index) => (
                                        <li key={index}>
                                          Tablets on Strip: {strip.tabletsOnStrip}, Strips in Box: {strip.stripsInBox}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <button type="submit" className="btn btn-fill-out submit font-weight-bold" name="submit" value="Submit">Save Change</button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Account;