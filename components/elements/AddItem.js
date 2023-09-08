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
  const categories = ["Category 1", "Category 2", "Category 3"];


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    setSelectedCategory(e.target.value);
  }

  // selecting size
  const [size, setSize] = useState("");
  const sizes = ["small", "medium", "large"];

  const handleSizeSelect = (size) => {
    setSize(size);
  };

  const handleInputSize = (e) => {
    setSize(e.target.value)
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
                                  <div className="d-flex">
                                    <div className="col-md-6 form-group">
                                      <input className="form-control" value={selectedCategory} onChange={handleInputChange} />
                                    </div>
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
                                  <span> (in PKR) <input type="number" required="" className="form-control price" name="price" /></span>
                                </div>

                                <div className="form-group flex col-md-12">
                                  <label>Size <span className="required">*</span></label>
                                  <div className="d-flex">
                                    <div className="col-md-6 form-group">
                                      <input className="form-control" value={size} onChange={handleInputSize} />
                                    </div>
                                    <div className="dropdown col-md-2 ms-2">
                                      <button
                                        className="btn dropdown-toggle submit font-weight-bold"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        {size || "Select Size"}
                                      </button>
                                      <ul className="dropdown-menu">
                                        {sizes.map((size) => (
                                          <li key={size}>
                                            <p className="dropdown-item" onClick={() => handleSizeSelect(size)}>
                                              {size}
                                            </p>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group col-md-12">
                                  <label>Stock <span className="required">*</span></label>
                                  <input type="number" required="" className="form-control" name="stock" />
                                </div>

                                <div>
                                  <p>Gender <span>*</span></p>
                                  <div className="form-check custom-control custom-radio d-flex col-lg-6 col-md-8 col-sm-12 justify-content-around">
                                    <div className="custome-radio">
                                      <input className="form-check-input" required="" type="radio" name="payment_option" id="exampleRadios1" defaultChecked="" />
                                      <label className="form-check-label" htmlFor="exampleRadios1" data-bs-toggle="collapse" data-target="#bankTranfer" aria-controls="bankTranfer">Male</label>
                                    </div>
                                    <div className="custome-radio">
                                      <input className="form-check-input" required="" type="radio" name="payment_option" id="exampleRadios2" defaultChecked="" />
                                      <label className="form-check-label" htmlFor="exampleRadios2" data-bs-toggle="collapse" data-target="#checkPayment" aria-controls="checkPayment">Female</label>
                                    </div>
                                    <div className="custome-radio">
                                      <input className="form-check-input" required="" type="radio" name="payment_option" id="exampleRadios3" defaultChecked="" />
                                      <label className="form-check-label" htmlFor="exampleRadios3" data-bs-toggle="collapse" data-target="#checkPayment" aria-controls="checkPayment">Other</label>
                                    </div>
                                  </div>
                                  <br />
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
