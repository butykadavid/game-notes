import { Children, useRef } from 'react'
import styles from '../styles/modal.module.css'

export default function Modal({ visible, setVisible, title = 'Popup', width = '368px', height = '512px', children }) {

    const overlayRef = useRef(null)

    const closeOnOutsideClick = (e) => {
        if (overlayRef.current == e.target) setVisible(false)
    }

    return <>
        <div ref={overlayRef} style={{ display: `${visible ? "flex" : "none"}` }} className={styles.overlay} onClick={(e) => closeOnOutsideClick(e)}>
            <div style={{ width: width, maxWidth: "85%", height: height, maxHeight: '85%' }} className={styles.window}>
                <div className={styles.window__toolbar}>
                    <h2 className={styles.window__title}>{title}</h2>
                    <a className={styles.window__close__button} onClick={() => setVisible(false)}>x</a>
                </div>
                {Children.map(children, child =>
                    <div className={styles.window__content}>{child}</div>
                )}
            </div>
        </div>
    </>
}