import { useState } from "react";
import "./FeedbackForm.css";

const MAX_MESSAGE_LENGTH = 500;

function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim()))
      return "Только буквы, пробелы и дефис";
    return null;
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email обязателен для заполнения";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Некорректный формат email";
    return null;
  };

  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > MAX_MESSAGE_LENGTH)
      return `Максимум ${MAX_MESSAGE_LENGTH} символов`;
    return null;
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    message: validateMessage,
  };

  const getFieldValue = (field) => {
    switch (field) {
      case "name":
        return name;
      case "email":
        return email;
      case "message":
        return message;
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](getFieldValue(field)),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field__input"];

    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field]) {
      classes.push("field__input--valid");
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setMessage("");
            setErrors({ name: null, email: null, message: null });
            setTouched({ name: false, email: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="Введите ваше имя"
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="email" className="field__label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="example@mail.com"
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Введите ваше сообщение..."
        />
        <div className="field__counter">
          {message.length} / {MAX_MESSAGE_LENGTH}
        </div>
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;