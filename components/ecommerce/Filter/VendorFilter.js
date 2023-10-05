import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { updateProductFilters } from "../../../redux/action/productFiltersAction";
import {updateProductFilters} from "@redux/action/productFiltersAction"

import CheckBox from "./Checkbox";

const VendorFilter = ({ updateProductFilters }) => {
    const [sizes, setSizeCheckbox] = useState(
        [
            { value: "Tablet/Capsules" },
            { value: "Syrups" },
            { value: "Suspensions" },
            { value: "Injections" },
            { value: "Creams/Ointments/Gels" },
            { value: "Bandages" },
            { value: "Suppositories" },
            { value: "Drops/Sprays/Inhalers" },
            { value: "Oral" },
            { value: "Medical Devices/Equipment" }
        ]
    );

    const Router = useRouter();
    const searchTerm = Router.query.search;

    const [selectedVendor, setVendor] = useState([]);

    useEffect(() => {
        const filters = {
            vendor: selectedVendor
        };

        updateProductFilters(filters);
    }, [sizes, searchTerm]);

    const handleCheckBox = (event, filters, updatefilters, selectFilter, text) => {
        const value = event.target.value;
        const updateSizes = filters;

        updateSizes.forEach((item) => {
            if (item.value === value) {
                if (item.checked) {
                    item.checked = false;
                    const newsize = text.filter((item) => item !== value);
                    selectFilter([...newsize]);
                } else {
                    item.checked = true;
                    const newsize = text.includes(value) ? text : [...text, value];
                    selectFilter([...newsize]);
                }
            }
        });

        updatefilters([...updateSizes]);
    };

    return (
        <>
            <div className="custome-checkbox">
                <CheckBox
                    heading="Select Size"
                    filters={sizes}
                    handleCheckBox={(e) => {
                        handleCheckBox(e, sizes, setSizeCheckbox, setVendor, selectedVendor);
                    }}
                />
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.products.items
});

const mapDidpatchToProps = {
    updateProductFilters
};

export default connect(mapStateToProps, mapDidpatchToProps)(VendorFilter);
