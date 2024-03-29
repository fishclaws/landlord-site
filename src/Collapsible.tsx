import { ReactElement, useEffect, useRef, useState } from "react";
import './Collapsible.scss';
import ReactGA from "react-ga4";

function Collapsible({ title, title_class, children, onOpen }: { title: string, title_class: string, children: ReactElement, onOpen: any }) {
    const [open, setOpen] = useState(false)
    const wrapper = useRef(null)
    useEffect(() => {
        if (open) {
            ReactGA.event({
                category: "result_page",
                action: "button_click",
                label: "view reviews", // optional
              });
        }

        const content = wrapper.current as any;
        if (content) {
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                console.log('close')
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                console.log('open')
            }
        }


    }, [open])
    onOpen.callback = () => {
        setOpen(false)
        setTimeout(() => setOpen(true), 10)
    }
    return (
        <><button className={title_class} onClick={() => setOpen(!open)}>{title}</button><div className="collapsible">
            <div className="collapsible-wrapper" ref={wrapper}>
                {children}
            </div>
        </div></>
    );
}

export default Collapsible;