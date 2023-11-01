import { useRouter } from "next/router";
import { connect } from "react-redux";
// import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import {updateProductCategory} from "@redux/action/productFiltersAction"

const CategoryProduct3 = ({ updateProductCategory }) => {




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
            <ul  className="end">
                <li onClick={(e) => selectCategory(e, "Dermatologicals")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/conditions/allergies.svg"
                            alt="bacteria"
                            className="rounded"
                            loading="lazy"
                        />
                        Dermatologicals
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Eyes , Nose , Ear")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/body/eye.svg"
                            alt="eye"
                            className="rounded"
                            loading="lazy"
                        />
                        Eyes , Nose , Ear
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Prescription Drugs")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/devices/syringe-vaccine.svg"
                            alt="prescription drugs"
                            className="rounded"
                            loading="lazy"
                        />
                        Prescription Drugs
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Medical Equipment")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/devices/stethoscope.svg"
                            alt="equipment"
                            className="rounded"
                            loading="lazy"
                        />
                        Medical Equipment
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Others")}>
                    <a>
                        <img
                            src="/assets/imgs/icons/svg/negative/body/enzyme.svg"
                            alt="others"
                            className="rounded"
                            loading="lazy"
                        />
                        Others
                    </a>
                </li>
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct3);
