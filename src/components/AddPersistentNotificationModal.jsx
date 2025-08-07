import React, { useState } from 'react';
import './AddPersistentNotificationModal.css'; // فایل CSS جداگانه

const AddPersistentNotificationModal = ({ show, onClose, onAdd }) => {
const [title, setTitle] = useState('');
const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // info, warning, error, success

const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
    alert('لطفاً عنوان و پیام را وارد کنید.');
    return;
    }

    const newNotification = {
      id: Date.now(), // ساده‌ترین روش برای ساخت ID منحصربه‌فرد
    title: title.trim(),
    message: message.trim(),
    severity,
    createdAt: new Date().toISOString(),
    persistent: true,
    };

    onAdd(newNotification);
    // پاک کردن فیلدها بعد از افزودن
    setTitle('');
    setMessage('');
    setSeverity('info');
    onClose();
};

if (!show) return null;

return (
    <div className="modal-overlay">
    <div className="modal-content">
        <div className="modal-header">
        <h3>افزودن نوتیفیکیشن دائمی</h3>
        <button className="close-btn" onClick={onClose}>
            &times;
        </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
            <label>عنوان:</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان نوتیفیکیشن"
            className="form-input"
            required
            />
        </div>

        <div className="form-group">
            <label>پیام:</label>
            <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="متن پیام..."
            className="form-textarea"
            rows="4"
            required
            />
        </div>

        <div className="form-group">
            <label>سطح اهمیت:</label>
            <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="form-select"
            >
            <option value="info">اطلاع‌رسانی (آبی)</option>
            <option value="warning">هشدار (زرد)</option>
            <option value="error">خطا (قرمز)</option>
            <option value="success">موفقیت (سبز)</option>
            </select>
        </div>

        <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
            انصراف
            </button>
            <button type="submit" className="btn-add">
            افزودن نوتیفیکیشن
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default AddPersistentNotificationModal;