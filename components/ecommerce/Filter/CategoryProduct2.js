import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";

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
                <li onClick={(e) => selectCategory(e, "Anti-infective")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-1.svg"
                            alt="nest"
                        />
                        Anti-infective
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Anti-epileptic")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-2.svg"
                            alt="nest"
                        />
                        Anti epileptic
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "A1imentary-Tract-&-Metabolism")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-3.svg"
                            alt="nest"
                        />
                        A1imentary Tract &
                        Metabolism
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Dermatologicals")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-4.svg"
                            alt="nest"
                        />
                        Dermatologicals
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "Sensory Organs")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-5.svg"
                            alt="nest"
                        />
                        Sensory Organs
                    </a>
                </li>
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct2);
