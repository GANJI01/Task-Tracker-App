import React from 'react';
import styles from './Modal.module.css';

function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}

export default Modal; 