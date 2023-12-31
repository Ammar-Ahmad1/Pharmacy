import React from "react";
import { useRouter } from 'next/router'
import Link from "next/link"
import Tags from "../ecommerce/Filter/Tags";

const Breadcrumb2 = ({parent, sub, subChild, noBreadcrumb}) => {
    const router = useRouter()
    console.log(router.query.cat)
    const titlex = router.query.cat
    return (
        <>
            <div className="page-header mt-30 mb-50">
            <div className="container">
                <div className="archive-header">
                    <div className="row align-items-center">
                        <div className="col-xl-3">
                            <h1 className="mb-5 h1 font-weight-bold">{titlex ? titlex : "Category"}</h1>
                            <div className="breadcrumb mb-5">
                                <Link href="/"><i className="fi-rs-home mr-5"></i>Home</Link>
                                <span></span> Shop <span></span> {titlex}
                            </div>
                        </div>
                        <div className="col-xl-9 text-end d-none d-xl-block">
                            <Tags/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Breadcrumb2;
