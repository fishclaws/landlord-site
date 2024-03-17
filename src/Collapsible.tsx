import { ReactElement, useEffect, useRef, useState } from "react";
import './Collapsible.scss';

function Collapsible({ title, title_class, children }: { title: string, title_class: string, children: ReactElement }) {
    const [open, setOpen] = useState(false)
    const wrapper = useRef(null)
    useEffect(() => {
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
    return (
        <><button className={title_class} onClick={() => setOpen(!open)}>{title}</button><div className="collapsible">
            <div className="collapsible-wrapper" ref={wrapper}>
                {children}
            </div>
        </div></>
    );
}

export default Collapsible;