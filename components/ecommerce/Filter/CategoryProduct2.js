import { useRouter } from "next/router";
import { connect } from "react-redux";
// import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import {updateProductCategory} from "@redux/action/productFiltersAction"

const CategoryProduct2 = ({ updateProductCategory }) => {




    const router = useRouter();

    // const removeSearchTerm = () => {
    //     router.push({
    //         pathname: "/products",
    //     });
    // };

    const selectCategory = (e, category) => {
        e.preventDefault();
        // removeSearchTerm();
        updateProductCategory(category);
        router.push({
            pathname: "/products",
            query: {
                cat: category, //
            },
        });
    };
    return (
        <>
            <ul>
                <li onClick={(e) => selectCategory(e, "Anti Infective")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/body/bacteria.svg"
                            alt="bacteria"
                            className="rounded"
                        />
                        Anti Infective
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Anti Epileptic")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/body/neurology.svg"
                            alt="antiepileptic"
                            className="rounded"
                        />
                        Anti Epileptic
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Anti Depressant")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/medications/medicines.svg"
                            alt="medicines"
                            className="rounded"
                        />
                        Anti Depressant
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Alimentary Tract & Metabolism")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/body/liver.svg"
                            alt="metabolism"
                            className="rounded"
                        />
                        Alimentary Tract & Metabolism
                    </a>
                </li>
                <li onClick={(e) => selectCategory(e, "Cardio Vascular System")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/body/heart.svg"
                            alt="cardio"
                            className="rounded"
                        />
                        Cardio Vascular System
                    </a>

                </li>
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct2);
