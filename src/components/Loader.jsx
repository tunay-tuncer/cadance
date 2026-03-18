import loader1 from "../assets/loader/1.svg"
import loader2 from "../assets/loader/2.svg"
import loader3 from "../assets/loader/3.svg"
import loader4 from "../assets/loader/4.svg"

function Loader() {
    console.log("loader")
    return (
        <>
            <style>{`
            .loaderMainContainer {
                position: absolute;
                top: 5%;
                left: 50%;
                width: 100px;
                aspect-ratio: 1;
                z-index: 99;
           
            }

            .loader1, .loader2, .loader3, .loader4 {
                position: absolute;
                transform-origin: 40px 50px;
            }

            .loader1, .loader3{
                animation-delay: 0.5s;
                animation: r1 1.5s infinite;
            }

            .loader2, .loader4{
                animation-delay: 0.5s;
                animation: l1 1.5s infinite;
            }

            @keyframes r1 {to{transform: rotate(1turn)}}
            @keyframes l1 {to{transform: rotate(-1turn)}}


        `}
            </style>
            <div className="loaderMainContainer">
                <div className="loaderContainer">
                    <img src={loader1} className="loader1" />
                    <img src={loader2} className="loader2" />
                    <img src={loader3} className="loader3" />
                    <img src={loader4} className="loader4" />
                </div>
            </div>
        </>
    )
}

export default Loader;